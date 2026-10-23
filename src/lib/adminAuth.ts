import { NextRequest } from "next/server";

export function getAdminSecret(): string {
  return process.env.ADMIN_SECRET_KEY || "sensei2026";
}

export function verifyAdminRequest(req: Request | NextRequest): boolean {
  const secret = getAdminSecret();

  // 1. Check x-admin-key header
  const adminHeader = req.headers.get("x-admin-key");
  if (adminHeader && adminHeader === secret) {
    return true;
  }

  // 2. Check Authorization Bearer header
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    if (token === secret) {
      return true;
    }
  }

  return false;
}
