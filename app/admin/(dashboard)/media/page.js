import { requireAdmin } from "@/lib/adminGuard";
import { prisma } from "@/lib/prisma";
import { storageStatus } from "@/lib/storage";
import NotConnectedCard from "@/components/admin/NotConnectedCard";
import MediaLibraryUploadSection from "@/components/admin/MediaLibraryUploadSection";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  await requireAdmin();
  const storage = storageStatus();
  const media = await prisma.media.findMany({ orderBy: { uploadedAt: "desc" }, take: 50 }).catch(() => []);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Media Library</h1>

      {!storage.configured && (
        <div className="mt-6">
          <NotConnectedCard title="File Storage" description="Configure Cloudflare R2 or AWS S3 in Settings to enable uploads to the media library." />
        </div>
      )}

      {storage.configured && <MediaLibraryUploadSection />}

      {storage.configured && media.length === 0 && (
        <p className="mt-6 text-sm text-ink/50">No media uploaded yet.</p>
      )}

      {media.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {media.map((item) => (
            <div key={item.id} className="rounded-card border border-ink/10 bg-white p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={item.altText || item.filename} className="aspect-square w-full rounded object-cover" />
              <p className="mt-2 truncate text-xs text-ink/60">{item.filename}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
