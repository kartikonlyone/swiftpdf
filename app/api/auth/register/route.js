import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { emailStatus, sendVerificationEmail } from "@/services/email/resend";
import { rateLimit, clientKeyFromRequest } from "@/lib/rateLimit";

// Force dynamic rendering to prevent build-time static evaluation crashes
export const dynamic = 'force-dynamic';

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters.")
});

export async function POST(request) {
  const { allowed } = rateLimit(clientKeyFromRequest(request, "register"));
  if (!allowed) return NextResponse.json({ error: "Too many attempts. Please try again shortly." }, { status: 429 });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input." }, { status: 400 });
  }

  const { name, email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { name, email: normalizedEmail, passwordHash }
  });

  if (emailStatus().configured) {
    const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/verify?userId=${user.id}`;
    await sendVerificationEmail(user.email, verifyUrl).catch(() => {
      // Registration still succeeds even if the verification email fails to send;
      // the account simply remains unverified until the user requests a resend.
    });
  }

  return NextResponse.json({ ok: true, emailSent: emailStatus().configured });
}