export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getAdminSecret } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body;
    const secret = getAdminSecret();

    if (!password) {
      return NextResponse.json(
        { success: false, error: "Password wajib diisi." },
        { status: 400 }
      );
    }

    if (password === secret) {
      return NextResponse.json({
        success: true,
        token: secret,
      });
    }

    return NextResponse.json(
      { success: false, error: "Kata sandi admin/guru salah." },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
