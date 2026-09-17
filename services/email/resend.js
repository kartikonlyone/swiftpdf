import { Resend } from "resend";

function isConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

export function emailStatus() {
  return { configured: isConfigured(), from: process.env.EMAIL_FROM || null };
}

let client = null;
function getClient() {
  if (!isConfigured()) throw new Error("Resend is not configured (missing RESEND_API_KEY).");
  if (client) return client;
  client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

export async function sendVerificationEmail(to, verifyUrl) {
  const resend = getClient();
  return resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject: "Verify your SwiftPDF account",
    html: `<p>Welcome to SwiftPDF. Confirm your email to activate your account:</p>
           <p><a href="${verifyUrl}">${verifyUrl}</a></p>`
  });
}

export async function sendPasswordResetEmail(to, resetUrl) {
  const resend = getClient();
  return resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject: "Reset your SwiftPDF password",
    html: `<p>Reset your password using the link below. This link expires in 1 hour.</p>
           <p><a href="${resetUrl}">${resetUrl}</a></p>`
  });
}
