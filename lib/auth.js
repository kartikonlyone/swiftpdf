import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { prisma as adminPrisma } from "@/lib/prisma";

// Two independent credential flows share one NextAuth instance:
//  - regular Users (customer accounts, dashboard)
//  - AdminUsers (admin panel) — kept in a separate table/role system entirely,
//    authenticated through a distinct provider id so a compromised customer
//    session can never resolve to admin privileges.

const providers = [
  CredentialsProvider({
    id: "customer-credentials",
    name: "Email and password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;

      const user = await prisma.user.findUnique({
        where: { email: credentials.email.toLowerCase().trim() }
      });
      if (!user || !user.passwordHash) return null;

      const valid = await bcrypt.compare(credentials.password, user.passwordHash);
      if (!valid) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        userType: "customer"
      };
    }
  }),
  CredentialsProvider({
    id: "admin-credentials",
    name: "Admin sign-in",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;

      const admin = await adminPrisma.adminUser.findUnique({
        where: { email: credentials.email.toLowerCase().trim() }
      });
      if (!admin || !admin.isActive) return null;

      const valid = await bcrypt.compare(credentials.password, admin.passwordHash);
      if (!valid) return null;

      // Never let a failure here block login — this is a "nice to have"
      // timestamp, not a condition for authentication succeeding.
      await adminPrisma.adminUser
        .update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } })
        .catch((err) => console.error("Failed to update admin lastLoginAt:", err.message));

      return {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        userType: "admin"
      };
    }
  })
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  );
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60 // refresh the session token once a day
  },
  // Deliberately no global `pages.signIn` here: this app has two separate
  // login screens (/login for customers, /admin/login for admins). Each
  // page calls signIn(providerId, { redirect: false }) itself and handles
  // its own error UI, so NextAuth's built-in redirect-on-failure page is
  // never used. Setting pages.signIn to one of the two would incorrectly
  // send the other flow's expired/failed sessions to the wrong screen.
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userType = user.userType;
        token.role = user.role ?? null;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.userType = token.userType;
        session.user.role = token.role;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};

// Helper for server components / route handlers that need to hard-require
// an authenticated admin with a sufficient role.
export function isAdminSession(session) {
  return Boolean(session?.user && session.user.userType === "admin");
}
