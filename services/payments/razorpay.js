import Razorpay from "razorpay";
import crypto from "node:crypto";

function isConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export function razorpayStatus() {
  return { configured: isConfigured() };
}

let client = null;
function getClient() {
  if (!isConfigured()) throw new Error("Razorpay is not configured.");
  if (client) return client;
  client = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
  return client;
}

const PLAN_AMOUNTS_PAISE = {
  PRO: 29900,      // e.g. ₹299/month — configure real pricing in Admin > Settings
  BUSINESS: 99900  // e.g. ₹999/month
};

export async function createSubscriptionOrder(plan) {
  const amount = PLAN_AMOUNTS_PAISE[plan];
  if (!amount) throw new Error(`Unknown plan: ${plan}`);

  const razorpay = getClient();
  return razorpay.orders.create({
    amount,
    currency: "INR",
    payment_capture: 1,
    notes: { plan }
  });
}

/**
 * Verify the signature Razorpay sends back after checkout, per their docs:
 * expected = HMAC_SHA256(order_id + "|" + payment_id, key_secret)
 */
export function verifyPaymentSignature({ orderId, paymentId, signature }) {
  if (!isConfigured()) throw new Error("Razorpay is not configured.");
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return expected === signature;
}

/**
 * Verify an incoming webhook's signature header against the raw request body.
 */
export function verifyWebhookSignature({ rawBody, signatureHeader }) {
  if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
    throw new Error("RAZORPAY_WEBHOOK_SECRET is not configured.");
  }
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");
  return expected === signatureHeader;
}
