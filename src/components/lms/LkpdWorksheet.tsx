"use client";

import React, { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import {
  FileText,
  Printer,
  ExternalLink,
  RotateCcw,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  User,
  Check,
  Edit2,
  Send,
} from "lucide-react";

interface LkpdWorksheetProps {
  chapter: number;
  chapterTitle: string;
  chapterTopic: string;
}

const AUTHENTIC_LKPD_TITLES: Record<number, { titleJa: string; subtitle: string; desc: string }> = {
  1: {
    titleJa: "第1課「私のこと」",
    subtitle: "先週、日本に来たばかりです／私の周りの人たち",
    desc: "Mencakup: Panduan LPK & Can-do A2, Ringkasan Materi & Tata Bahasa, 10 Soal Moji-Goi, 8 Soal Kaiwa Hyougen, 6 Soal Choukai (Audio & Naskah), 6 Soal Dokkai, 10 Soal Kanji, 10 Soal Kosakata, 5 Soal Terjemahan, Bank Audio Lengkap, serta Lembar Refleksi.",
  },
  2: {
    titleJa: "第2課「どんな人ですか」",
    subtitle: "まじめそうな人ですね／外見と性格",
    desc: "Mencakup: Ciri fisik, pakaian kerja & keselamatan, sifat/karakter seseorang, penyanyi/aktor favorit, artikel wawancara, 30 soal asesmen JFT-like, kanji, kosakata, dan terjemahan.",
  },
  3: {
    titleJa: "第3課「おすすめは何ですか」",
    subtitle: "おいしそうな料理／レストランとアレルギー",
    desc: "Mencakup: Rekomendasi menu makanan, konfirmasi pantangan/alergi, reservasi meja makan, 30 soal mini JFT-like, kanji, kosakata, terjemahan, dan bank audio.",
  },
  4: {
    titleJa: "第4課「何時からですか」",
    subtitle: "工場のシフト／勤務時間と残業",
    desc: "Mencakup: Jadwal kerja, shift siang/malam, jam lembur, janji temu, batas waktu ～までに vs ～まで, serta latihan kanji & kosakata terstandar.",
  },
  5: {
    titleJa: "第5課「安全第一」",
    subtitle: "工場のルールとK3／安全標識と注意喚起",
    desc: "Mencakup: Rambu keselamatan kerja, prosedur K3 di pabrik Jepang, larangan ～ないでください & keharusan, inspeksi alat kerja, dan evaluasi mandiri.",
  },
  6: {
    titleJa: "第6課「どうやって行きますか」",
    subtitle: "交通機関と道案内／電車の乗り換えと行き方",
    desc: "Mencakup: Transportasi umum di Jepang, rute dan jenis kereta (JR/Subway), tiket perjalanan, petunjuk arah, bank audio, dan asesmen kelulusan.",
  },
  7: {
    titleJa: "第7課「雨が降ったら、ホールでやります」",
    subtitle: "イベントと天気／地域の催し物と連絡",
    desc: "Mencakup: Kegiatan komunitas & cuaca, pengumuman darurat, bentuk kondisional ～たら & ～場合, izin ～てもいい／なくてもいい, istilah 雨天中止／雨天決行, 30 soal mini JFT-like, kanji, kosakata, terjemahan, dan 15 file audio otentik.",
  },
  8: {
    titleJa: "第8課「屋台はどこかわかりますか？」",
    subtitle: "お祭り・イベントと道案内／ブースの位置とルール",
    desc: "Mencakup: Festival budaya, denah stan/booth, kata petunjuk posisi (突き当たり、右手、奥), bentuk tanya sopan ～かわかりますか, larangan ～ご遠慮ください, 30 soal asesmen JFT-like, kanji, kosakata, terjemahan, dan 23 audio otentik.",
  },
  9: {
    titleJa: "第9課「成人の日は、何をするんですか？」",
    subtitle: "年中行事と日本の文化／お祝いと伝統行事",
    desc: "Mencakup: Hari libur nasional & perayaan tradisi Jepang (お正月、成人の日、ひな祭り、七五三), ungkapan tanya ramah ～んです（か）, variasi kegiatan ～たり～たり, doa keberkahan, 30 soal JFT-like, kanji, kosakata, terjemahan, dan 20 audio otentik.",
  },
  10: {
    titleJa: "第10課「どんな服を着て行けばいいですか？」",
    subtitle: "冠婚葬祭とマナー／服装・持ち物と社会ルール",
    desc: "Mencakup: Etiket menghadiri pemakaman (お葬式、香典、黒スーツ), pernikahan (ご祝儀、ドレス), menjenguk orang sakit (お見舞い), meminta nasihat ～ばいいですか, saran ～ほうがいい, sopan santun publik, 30 soal JFT-like, kanji, kosakata, terjemahan, dan 18 audio otentik.",
  },
  11: {
    titleJa: "第11課「ポイントカードを忘れてしまいました」",
    subtitle: "買い物とトラブル／試着・サイズとレジ対応",
    desc: "Mencakup: Berbelanja pakaian & ukuran, izin mencoba di fitting room (～てみてもいいですか), ungkapan penyesalan / hal tak terduga (～てしまいました), barang hilang, penukaran barang (返品・交換), 30 soal JFT-like, kanji, kosakata, terjemahan, dan 25 audio otentik.",
  },
  12: {
    titleJa: "第12課「このボタンを押すと、エコモードに変わります」",
    subtitle: "電化製品と使い方／取扱説明と操作ボタン",
    desc: "Mencakup: Peralatan elektronik rumah tangga (炊飯器、電子レンジ、洗濯機、掃除機), syarat otomatis / pengoperasian mesin (V辞書形＋と、～), cara penggunaan (～方), mode hemat energi (エコモード), keselamatan listrik, 30 soal JFT-like, kanji, kosakata, terjemahan, dan 13 audio otentik.",
  },
};

export default function LkpdWorksheet({
  chapter,
  chapterTitle,
  chapterTopic,
}: LkpdWorksheetProps) {
  const { user, isLoaded } = useUser();
  const [iframeKey, setIframeKey] = useState<number>(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Identitas Siswa State (Clerk / LocalStorage / Input Mandiri)
  const [studentName, setStudentName] = useState<string>("");
  const [studentClass, setStudentClass] = useState<string>("outsutsuki");
  const [tempName, setTempName] = useState<string>("");
  const [tempClass, setTempClass] = useState<string>("outsutsuki");
  const [isEditingIdentity, setIsEditingIdentity] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{ student: string; score?: number } | null>(null);

  // Sync dengan Clerk User atau LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("irodori_student_name");
      const savedClass = localStorage.getItem("irodori_student_class") || "outsutsuki";

      let initialName = savedName || "";
      if (user) {
        const clerkName = user.fullName || user.firstName || user.username || user.primaryEmailAddress?.emailAddress;
        if (clerkName) {
          initialName = clerkName;
        }
      }
      if (!initialName) {
        initialName = "Peserta Didik";
      }

      setStudentName(initialName);
      setStudentClass(savedClass);
      setTempName(initialName);
      setTempClass(savedClass);
    }
  }, [user, isLoaded]);

  // Dengarkan pesan sukses submit dari iframe LKPD
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "LKPD_SUBMISSION_SUCCESS") {
        setSubmissionSuccess({
          student: event.data.student || studentName,
          score: event.data.score,
        });
        setTimeout(() => setSubmissionSuccess(null), 10000);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [studentName]);

  const handleSaveIdentity = () => {
    const finalName = tempName.trim() || (user?.fullName || "Peserta Didik");
    const finalClass = tempClass.trim() || "A2.2";
    setStudentName(finalName);
    setStudentClass(finalClass);
    if (typeof window !== "undefined") {
      localStorage.setItem("irodori_student_name", finalName);
      localStorage.setItem("irodori_student_class", finalClass);
    }
    setIsEditingIdentity(false);
    // Reload iframe dengan nama baru
    setIframeKey((prev) => prev + 1);
  };

  const hasAuthenticLkpd = chapter >= 1 && chapter <= 12;
  const meta = AUTHENTIC_LKPD_TITLES[chapter] || {
    titleJa: `第${chapter}課「${chapterTitle}」`,
    subtitle: chapterTopic,
    desc: "Materi LKPD interaktif sedang dalam proses sinkronisasi dari kurikulum Irodori.",
  };

  const todayDate = new Date().toISOString().slice(0, 10);
  const activeStudentName = studentName || (user?.fullName || "Peserta Didik");
  const lkpdUrl = `/lkpd/bab${chapter}/index.html?name=${encodeURIComponent(activeStudentName)}&kelas=${encodeURIComponent(studentClass)}&date=${todayDate}&userId=${user?.id || ""}`;

  const handleReload = () => {
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col gap-6 text-rose-50 font-sans">
      {/* ========================================================
          1. HEADER LKPD RESMI (CLAYMORPHISM LUXURY BURGUNDY & GOLD)
          ======================================================== */}
      <div className="clay-card rounded-3xl p-6 sm:p-8 border-2 border-amber-500/30 shadow-2xl relative overflow-hidden flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rose-950/80 pb-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-inner">
              <FileText className="w-6 h-6 stroke-[2.5]" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-[#24060E] px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  LEMBAR KERJA PESERTA DIDIK (LKPD) RESMI
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Standar CEFR A2 / JFT-Basic
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-amber-100 mt-1">
                {meta.titleJa} • {meta.subtitle}
              </h2>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleReload}
              className="clay-nav-pill px-3 py-1.5 bg-[#2D0711] hover:bg-[#450B1B] text-xs font-bold text-rose-200 border border-rose-800/40 flex items-center gap-1.5 transition"
              title="Muat ulang lembar LKPD"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Muat Ulang</span>
            </button>

            {hasAuthenticLkpd && (
              <a
                href={lkpdUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="clay-btn-gold px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg hover:scale-105 transition"
                title="Buka LKPD di tab baru layar penuh"
              >
                <span>Buka Layar Penuh</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Informasi Isi LKPD */}
        <div className="p-4 rounded-2xl bg-[#1C050E] border border-rose-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-200/90 leading-relaxed">
              <strong className="text-amber-300 block mb-0.5">Struktur LKPD Lengkap Bab Ini:</strong>
              {meta.desc}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          1.5. IDENTITAS SISWA & TRACKING PENGERJAAN
          ======================================================== */}
      <div className="clay-card rounded-3xl p-5 border border-amber-500/20 shadow-xl bg-gradient-to-r from-[#20050F] via-[#2A0714] to-[#1E050E] flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <User className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400/90 block">
                Identitas Pengerjaan LKPD Siswa
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm sm:text-base font-black text-rose-50">
                  {activeStudentName}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-950/80 border border-rose-800/40 text-amber-300 font-bold">
                  Kelas: {studentClass}
                </span>
                {user ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Akun LMS Terhubung
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 font-bold">
                    Mode Tamu / Nama Mandiri
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditingIdentity ? (
              <button
                onClick={() => setIsEditingIdentity(true)}
                className="clay-nav-pill px-3 py-1.5 bg-[#3B0A17] hover:bg-[#520E21] text-xs font-bold text-amber-200 border border-amber-500/30 flex items-center gap-1.5 transition"
                title="Sesuaikan nama lengkap atau kelas LPK Anda"
              >
                <Edit2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Ubah Nama / Kelas</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditingIdentity(false)}
                className="clay-nav-pill px-3 py-1.5 bg-[#2B0711] text-xs font-bold text-rose-300 border border-rose-800/40 transition"
              >
                Batal
              </button>
            )}
          </div>
        </div>

        {/* Form Edit Identitas Siswa */}
        {isEditingIdentity && (
          <div className="p-4 rounded-2xl bg-[#17030A] border border-amber-500/30 flex flex-col sm:flex-row items-end gap-3 mt-1">
            <div className="flex-1 w-full">
              <label className="text-[11px] font-bold text-amber-300 block mb-1">
                Nama Lengkap Siswa:
              </label>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Contoh: Budi Santoso / 山田"
                className="w-full px-3 py-2 rounded-xl bg-[#280612] border border-rose-900/60 text-rose-100 text-xs font-bold focus:outline-none focus:border-amber-400 transition"
              />
            </div>
            <div className="w-full sm:w-44">
              <label className="text-[11px] font-bold text-amber-300 block mb-1">
                Kelas / LPK:
              </label>
              <input
                type="text"
                value={tempClass}
                onChange={(e) => setTempClass(e.target.value)}
                placeholder="Contoh: A2.2 / LPK Sakura"
                className="w-full px-3 py-2 rounded-xl bg-[#280612] border border-rose-900/60 text-rose-100 text-xs font-bold focus:outline-none focus:border-amber-400 transition"
              />
            </div>
            <button
              onClick={handleSaveIdentity}
              className="clay-btn-gold px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg w-full sm:w-auto justify-center"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Simpan & Terapkan</span>
            </button>
          </div>
        )}

        {/* Notifikasi Pengumpulan Berhasil */}
        {submissionSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 flex items-center justify-between gap-3 text-xs font-bold animate-pulse">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                Alhamdulillah! Nilai LKPD Bab {chapter} atas nama <strong>{submissionSuccess.student}</strong> telah berhasil terkirim dan tercatat di sistem Guru!
              </span>
            </div>
            <span className="text-[10px] text-emerald-300/80 uppercase font-mono">
              Status: Tersimpan
            </span>
          </div>
        )}
      </div>

      {/* ========================================================
          2. WORKSPACE LKPD INTERAKTIF (IFRAME OTENTIK / FALLBACK)
          ======================================================== */}
      {hasAuthenticLkpd ? (
        <div className="clay-card rounded-3xl p-3 sm:p-5 border border-rose-950/80 shadow-2xl flex flex-col gap-3">
          <div className="flex items-center justify-between px-2 text-xs text-rose-300/70 font-bold border-b border-rose-950/60 pb-2">
            <span className="flex items-center gap-1.5 text-amber-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Simulator LKPD Terintegrasi (Audio, Penilaian Otomatis & Refleksi Aktif)
            </span>
            <span className="text-[11px] text-rose-400/60">
              * Mode Ujian & Latihan Interaktif
            </span>
          </div>

          <div className="w-full rounded-2xl overflow-hidden border border-rose-900/50 shadow-inner bg-[#1A050D] h-[900px] sm:h-[1050px]">
            <iframe
              key={iframeKey}
              ref={iframeRef}
              src={lkpdUrl}
              title={`LKPD Bab ${chapter}`}
              className="w-full h-full border-0 rounded-2xl"
              allow="autoplay"
            />
          </div>
        </div>
      ) : (
        /* Fallback untuk Bab 7 ke atas */
        <div className="clay-card rounded-3xl p-8 sm:p-12 border border-rose-950/80 text-center flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-black text-amber-200">
              Sinkronisasi LKPD Bab {chapter} ({chapterTitle})
            </h3>
            <p className="text-xs text-rose-200/80 max-w-md mt-1 leading-relaxed">
              Materi LKPD interaktif untuk Bab 01 s.d. 06 telah aktif secara penuh. Untuk Bab {chapter}, silakan pelajari modul materi melalui Tab 1 (Modul Slide & Materi) atau ikuti latihan di Tab 4 (Latihan Kuis CBT).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
