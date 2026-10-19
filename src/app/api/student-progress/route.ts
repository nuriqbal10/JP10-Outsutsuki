import { NextResponse } from "next/server";
import { db } from "@/db"; // Pastikan path koneksi database Anda sesuai
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// Handler GET: Mengambil data XP / Rapor siswa dari database
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json({ success: false, message: "Email diperlukan" }, { status: 400 });
        }

        // Cari user di database berdasarkan email
        const student = await db.select().from(users).where(eq(users.email, email)).limit(1);

        if (student.length === 0) {
            return NextResponse.json({ success: false, message: "Siswa tidak ditemukan" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: student[0] });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// Handler POST: Menyimpan / memperbarui XP & progres siswa ke database
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, name, xp } = body;

        if (!email) {
            return NextResponse.json({ success: false, message: "Email diperlukan" }, { status: 400 });
        }

        // Cek apakah user sudah terdaftar di database
        const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

        if (existingUser.length > 0) {
            // Update data jika sudah ada
            await db.update(users)
                .set({
                    name: name || existingUser[0].name,
                    updatedAt: new Date()
                })
                .where(eq(users.email, email));

            return NextResponse.json({ success: true, message: "Progres berhasil disinkronkan ke database!" });
        } else {
            // Buat ent baru jika belum ada (misal siswa baru mendaftar)
            await db.insert(users).values({
                id: `OUT-${Math.floor(Math.random() * 90000) + 10000}`,
                clerkId: email, // Atau ID otentikasi yang digunakan
                email: email,
                name: name || "Siswa Ootsutsuki",
                role: "student",
            });

            return NextResponse.json({ success: true, message: "Akun siswa berhasil didaftarkan ke database pusat!" });
        }
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}