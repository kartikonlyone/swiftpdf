import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; 
export const revalidate = 0;

const handler = async (req, res) => {
  return await NextAuth(req, res, authOptions);
};
export { handler as GET, handler as POST };