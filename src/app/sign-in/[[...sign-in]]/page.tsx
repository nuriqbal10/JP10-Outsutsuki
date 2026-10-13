import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen w-full flex flex-col justify-between p-6 sm:p-10 bg-[#16040A] text-rose-50 font-sans selection:bg-rose-900 selection:text-white">
      {/* Top Navigation */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-rose-300 hover:text-white transition px-3.5 py-2 rounded-xl bg-[#240610] border border-rose-900/50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
        <div className="flex items-center gap-2 text-xs text-rose-300/70 font-medium">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>Kurikulum Irodori 初級2 (A2.2)</span>
        </div>
      </div>

      {/* Main Login Area */}
      <main className="w-full max-w-md mx-auto my-auto flex flex-col items-center gap-6 py-8">
        {/* Brand Header Outsutsuki */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="relative p-1 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 shadow-xl border border-amber-400/50">
            <img
              src="/outsutsuki-logo.jpg"
              alt="Logo Outsutsuki"
              className="w-16 h-16 rounded-xl object-cover"
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#280512] border border-amber-500/40 text-[10px] font-black text-amber-300 uppercase tracking-wider mb-1.5">
              <span>大筒木クラス</span> • <span>Eksklusif Kelas Outsutsuki</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-rose-50 tracking-tight">
              Portal Siswa Outsutsuki
            </h1>
            <p className="text-xs text-rose-300/80 mt-1 max-w-xs">
              Masuk dengan akun Anda untuk mengakses modul Irodori A2.2 dan pengumpulan lembar kerja (LKPD).
            </p>
          </div>
        </div>

        {/* Login Box */}
        <div className="w-full rounded-3xl p-3 sm:p-4 bg-[#230611] border border-rose-900/60 shadow-2xl">
          <SignIn
            appearance={{
              variables: {
                colorPrimary: "#e11d48",
                colorText: "#fff1f2",
                colorTextSecondary: "#fecdd3",
                colorBackground: "#230611",
                colorInputBackground: "#17030A",
                colorInputText: "#ffffff",
                borderRadius: "0.75rem",
                fontFamily: "var(--font-jakarta), sans-serif",
              },
              elements: {
                card: "bg-transparent shadow-none border-0 p-3 sm:p-5",
                headerTitle: "text-rose-100 font-bold text-lg",
                headerSubtitle: "text-rose-300/70 text-xs",
                socialButtonsBlockButton:
                  "bg-[#1A030C] border border-rose-900/70 hover:bg-[#2F0615] text-rose-100 font-semibold rounded-xl transition",
                socialButtonsBlockButtonText: "text-rose-100 font-medium text-xs",
                dividerLine: "bg-rose-950/80",
                dividerText: "text-rose-300/50 text-[11px] font-medium",
                formFieldLabel: "text-rose-200 text-xs font-semibold mb-1",
                formFieldInput:
                  "bg-[#150208] border border-rose-900/70 focus:border-rose-500 text-rose-50 text-xs rounded-xl py-2.5 px-3 transition",
                formButtonPrimary:
                  "bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs py-3 rounded-xl shadow-md transition border border-rose-500/30",
                footerActionLink: "text-amber-400 hover:text-amber-300 font-semibold transition",
                footerActionText: "text-rose-300/70 text-xs",
                identityPreview: "bg-[#18030C] border border-rose-900/60 text-rose-100 rounded-xl",
              },
            }}
          />
        </div>
      </main>

      {/* Footer Bawah */}
      <footer className="w-full max-w-4xl mx-auto text-center text-[11px] text-rose-400/50 py-2">
        Materi berdasarkan buku <em>Irodori: Nihongo de Seikatsu</em> © The Japan Foundation. Digunakan untuk pembelajaran dan persiapan ujian JFT-Basic A2.
      </footer>
    </div>
  );
}
