import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";

// A thin, provider-agnostic file storage layer. Works with Cloudflare R2 or
// AWS S3 since both speak the S3 API. If no provider is configured, every
// method throws StorageNotConfiguredError so callers can surface a proper
// "Configure Integration" state instead of silently pretending to work.

export class StorageNotConfiguredError extends Error {
  constructor() {
    super("File storage is not configured. Set STORAGE_PROVIDER and credentials in .env");
    this.name = "StorageNotConfiguredError";
  }
}

function isConfigured() {
  return (
    process.env.STORAGE_PROVIDER &&
    process.env.STORAGE_PROVIDER !== "none" &&
    process.env.STORAGE_BUCKET &&
    process.env.STORAGE_ACCESS_KEY_ID &&
    process.env.STORAGE_SECRET_ACCESS_KEY
  );
}

let client = null;
function getClient() {
  if (!isConfigured()) throw new StorageNotConfiguredError();
  if (client) return client;

  client = new S3Client({
    region: process.env.STORAGE_REGION || "auto",
    endpoint: process.env.STORAGE_ENDPOINT || undefined, // undefined => real AWS S3
    credentials: {
      accessKeyId: process.env.STORAGE_ACCESS_KEY_ID,
      secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY
    }
  });
  return client;
}

// Randomized key so original filenames / paths are never exposed.
function randomKey(originalName) {
  const ext = (originalName?.split(".").pop() || "bin").toLowerCase().slice(0, 8);
  const datePrefix = new Date().toISOString().slice(0, 10);
  return `uploads/${datePrefix}/${nanoid(24)}.${ext}`;
}

export async function uploadBuffer({ buffer, originalName, contentType }) {
  const s3 = getClient();
  const key = randomKey(originalName);

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.STORAGE_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      // Never publicly listable/indexable — access only via signed URLs.
      ACL: "private"
    })
  );

  return { key };
}

/**
 * Upload an image meant for public display (blog featured images, inline
 * content images). Unlike uploadBuffer (private, tool-processing files),
 * these need a stable public URL a browser can load directly.
 *
 * If STORAGE_PUBLIC_BASE_URL is set (a public bucket domain or a CDN in
 * front of the bucket — e.g. an R2 public bucket URL, or a CloudFront/
 * Cloudflare domain pointed at the S3 bucket), the URL is built directly
 * from that and never expires. Without it, this falls back to a long-lived
 * signed URL (7 days — the maximum AWS SigV4 allows) so images still work
 * immediately in dev, but callers should treat that as temporary: set
 * STORAGE_PUBLIC_BASE_URL before relying on this for real published posts.
 */
export async function uploadPublicMedia({ buffer, originalName, contentType }) {
  const s3 = getClient();
  const key = randomKey(originalName);

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.STORAGE_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ACL: "public-read" // ignored by R2 (public access is bucket/domain-level there), honored by S3
    })
  );

  const url = process.env.STORAGE_PUBLIC_BASE_URL
    ? `${process.env.STORAGE_PUBLIC_BASE_URL.replace(/\/$/, "")}/${key}`
    : await getDownloadUrl(key, 7 * 24 * 60 * 60);

  return { key, url, isPermanentUrl: Boolean(process.env.STORAGE_PUBLIC_BASE_URL) };
}

export async function getDownloadUrl(key, expiresInSeconds = 900) {
  const s3 = getClient();
  const command = new GetObjectCommand({
    Bucket: process.env.STORAGE_BUCKET,
    Key: key
  });
  return getSignedUrl(s3, command, { expiresIn: expiresInSeconds });
}

export async function deleteObject(key) {
  const s3 = getClient();
  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.STORAGE_BUCKET,
      Key: key
    })
  );
}

export function storageStatus() {
  return {
    configured: isConfigured(),
    provider: process.env.STORAGE_PROVIDER || "none",
    bucket: process.env.STORAGE_BUCKET || null
  };
}
