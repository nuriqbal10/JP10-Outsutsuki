"use client";

import React, { useEffect } from "react";
import { StudentRaporItem, LevelRaporData } from "@/types/rapor";
import { X, Printer, Award, CheckCircle2, ShieldCheck } from "lucide-react";

interface OfficialReportPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentRaporItem | null;
  levelData: LevelRaporData | null;
}

export default function OfficialReportPrintModal({
  isOpen,
  onClose,
  student,
  levelData,
}: OfficialReportPrintModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !student) return null;

  const handlePrint = () => {
    document.body.classList.add("printing-certificate-active");
    setTimeout(() => {
      window.print();
      document.body.classList.remove("printing-certificate-active");
    }, 150);
  };

  const avg = student.averages || {
    daiTest: 0,
    mojiGoi: 0,
    kaiwa: 0,
    choukai: 0,
    dokkai: 0,
    kanji: 0,
    kotoba: 0,
    honyaku: 0,
  };

  const f1 = student.fukushuu1 || {
    test: { mojiGoi: 0, kaiwa: 0, choukai: 0, dokkai: 0, total: 0 },
    kanji: 0,
    kotoba: 0,
    honyaku: 0,
  };

  const f2 = student.fukushuu2 || {
    test: { mojiGoi: 0, kaiwa: 0, choukai: 0, dokkai: 0, total: 0 },
    kanji: 0,
    kotoba: 0,
    honyaku: 0,
  };

  const f3 = student.fukushuu3 || {
    test: { mojiGoi: 0, kaiwa: 0, choukai: 0, dokkai: 0, total: 0 },
    kanji: 0,
    kotoba: 0,
    honyaku: 0,
  };

  const fn = student.finalExam || {
    test: { mojiGoi: 0, kaiwa: 0, choukai: 0, dokkai: 0, total: 0 },
    kanji: 0,
    kotoba: 0,
    honyaku: 0,
  };

  // Persentase KKM 4 aspek (bobot harian: 24, 24, 24, 28)
  const kkm = typeof window !== "undefined" ? Number(localStorage.getItem("outsutsuki_kkm")) || 85 : 85;
  const pctMoji = Math.min(100, Math.round(((avg.mojiGoi || 0) / 24) * 100));
  const pctKaiwa = Math.min(100, Math.round(((avg.kaiwa || 0) / 24) * 100));
  const pctChoukai = Math.min(100, Math.round(((avg.choukai || 0) / 24) * 100));
  const pctDokkai = Math.min(100, Math.round(((avg.dokkai || 0) / 28) * 100));

  const compositeScore = student.compositeScore ?? student.summary?.compositeScore ?? 0;
  const rawGrade = (student.grade || "").split(" ")[0].toUpperCase();
  const grade = rawGrade || (compositeScore >= 85 ? "A" : compositeScore >= 75 ? "B" : compositeScore >= 60 ? "C" : "D");

  const isPassed = compositeScore >= kkm;
  const isWarning = compositeScore >= Math.max(40, kkm - 15) && compositeScore < kkm;

  const statusLabel = isPassed
    ? `Grade ${grade} (Memenuhi Standar Kelulusan JFT-Basic A2)`
    : isWarning
    ? `Grade ${grade} (Lulus Bersyarat / Perlu Pemantapan)`
    : `Grade ${grade} (Belum Memenuhi KKM / Perlu Remedial)`;

  const statusColorClass = isPassed
    ? "text-emerald-700 font-bold"
    : isWarning
    ? "text-amber-700 font-bold"
    : "text-rose-700 font-bold";

  const predikatJapanese = isPassed
    ? (grade === "A" ? "Sangat Baik (優 - Yū)" : "Baik (良 - Ryō)")
    : isWarning
    ? "Cukup (可 - Ka)"
    : "Perlu Bimbingan (不可 - Fuka)";

  const defaultSenseiNote = isPassed
    ? "Peserta didik menunjukkan disiplin dan penguasaan kompetensi tinggi dalam menyelesaikan kurikulum Irodori A2. Memiliki modalitas kuat untuk kelulusan ujian resmi JFT-Basic A2."
    : isWarning
    ? "Peserta didik menunjukkan kemajuan yang cukup baik. Direkomendasikan melakukan pendalaman pada seksi membaca wacana (Dokkai) dan dialog percakapan situasional."
    : "Nilai peserta didik belum mencapai kriteria ketuntasan minimal (KKM). Diwajibkan mengikuti program remedial intensif serta bimbingan perbaikan materi sebelum ujian resmi.";

  const defaultSenseiRec = isPassed
    ? "Pertahankan konsistensi latihan simulasi CBT berkala dan perluas kosakata kejuruan kerja di Jepang."
    : isWarning
    ? "Tingkatkan intensitas latihan soal simulasi CBT Choukai dan Dokkai untuk meningkatkan ketepatan waktu."
    : "Wajib mengikuti pengayaan materi dan ujian remedial pada seksi Moji-Goi, Choukai, dan Dokkai.";

  const currentDate = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      id="printReportModal"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
    >
      <div className="w-full max-w-4xl max-h-[96vh] flex flex-col overflow-hidden shadow-2xl relative my-auto rounded-2xl bg-white dark:bg-stone-900 border border-slate-700">
        {/* Top Action Bar (Hanya tampil di monitor) */}
        <div className="no-print bg-slate-900 text-white p-4 flex items-center justify-between gap-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base tracking-tight text-white">
                Lembar Laporan Hasil Belajar Resmi (Format A4 Standar)
              </h3>
              <p className="text-[11px] text-slate-400">
                Dokumen resmi berstandar Irodori JF/CEFR. Siap dicetak langsung atau disimpan sebagai PDF.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Ekspor PDF</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center font-bold text-sm transition cursor-pointer"
              title="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable A4 Paper Container */}
        <div className="overflow-y-auto bg-slate-200/70 dark:bg-stone-950 p-2 sm:p-6 flex justify-center custom-scrollbar">
          <div
            id="print-certificate-paper"
            className="bg-white text-slate-900 w-full max-w-[210mm] min-h-[280mm] p-6 sm:p-8 rounded-xl shadow-2xl border-4 border-double border-slate-900 font-sans space-y-4 text-xs leading-relaxed relative print:m-0 print:border-2 print:shadow-none"
          >
            {/* Kop Surat Rapor Resmi (Kop Ganda) */}
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 gap-4">
              {/* Logo Otsutsuki (Kiri) */}
              <div className="w-14 h-14 p-1 shrink-0 flex items-center justify-center border border-slate-300 rounded-lg bg-white shadow-xs">
                <img
                  src="/logo_outsutsuki.png"
                  alt="Logo Otsutsuki JP10"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Teks Lembaga & Kurikulum */}
              <div className="text-center flex-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">
                  KURSUS BAHASA JEPANG JP10 OUTSUTSUKI (大筒木一族)
                </span>
                <h1 className="text-base sm:text-xl font-bold tracking-tight text-slate-900 uppercase">
                  LEMBAR LAPORAN HASIL BELAJAR PESERTA DIDIK
                </h1>
                <p className="text-[10px] sm:text-[11px] font-semibold text-slate-600">
                  Standar Kurikulum IRODORI: Bahasa Jepang untuk Kehidupan di Jepang (国際交流基金 国際基準)
                </p>
              </div>

              {/* Maskot Barongsai Resmi (Kanan) */}
              <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-slate-300 bg-white shadow-xs">
                <img
                  src="/maskot_barongsai.jpg"
                  alt="Maskot Otsutsuki"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Identitas Peserta Didik */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
              <div className="space-y-1">
                <div className="flex">
                  <span className="w-28 font-bold text-slate-600">Nama Siswa</span>
                  <span>
                    : <strong className="text-slate-900 font-bold uppercase">{student.name}</strong>
                  </span>
                </div>
                <div className="flex">
                  <span className="w-28 font-bold text-slate-600">Nomor Absen</span>
                  <span>: #{student.no}</span>
                </div>
                <div className="flex">
                  <span className="w-28 font-bold text-slate-600">Tingkat Kursus</span>
                  <span>: {levelData?.title || "Shokyuu 2"} ({levelData?.sub || "初級2_A2.2"})</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex">
                  <span className="w-28 font-bold text-slate-600">Peringkat Kelas</span>
                  <span>
                    : <strong className="text-amber-700 font-bold">Peringkat #{student.rank} dari {levelData?.students?.length || 28} Siswa</strong>
                  </span>
                </div>
                <div className="flex">
                  <span className="w-28 font-bold text-slate-600">Nilai Komulatif</span>
                  <span>
                    : <strong className="text-blue-700 font-bold">{compositeScore} / 100</strong>
                  </span>
                </div>
                <div className="flex">
                  <span className="w-28 font-bold text-slate-600">Predikat / Status</span>
                  <span>
                    : <strong className={statusColorClass}>{statusLabel}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Tabel Penilaian Terstruktur */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                <h3 className="font-bold text-[11px] uppercase tracking-wider text-slate-800">
                  Rincian Penilaian 4 Aspek Kompetensi &amp; Evaluasi Berkala
                </h3>
                <span className="text-[10px] text-slate-500">Skala Kelulusan Minimum: {kkm}.00 pt</span>
              </div>

              <table className="w-full border-collapse border border-slate-300 text-[11px] text-center">
                <thead>
                  <tr className="bg-slate-100 font-bold text-slate-700">
                    <th className="border border-slate-300 p-1.5 text-left pl-2">Komponen Penilaian</th>
                    <th className="border border-slate-300 p-1.5 w-16">文字語彙</th>
                    <th className="border border-slate-300 p-1.5 w-16">会話表現</th>
                    <th className="border border-slate-300 p-1.5 w-16">聴解</th>
                    <th className="border border-slate-300 p-1.5 w-16">読解</th>
                    <th className="border border-slate-300 p-1.5 w-20">Total Ujian</th>
                    <th className="border border-slate-300 p-1.5 w-14">漢字</th>
                    <th className="border border-slate-300 p-1.5 w-14">言葉</th>
                    <th className="border border-slate-300 p-1.5 w-14">翻訳</th>
                  </tr>
                  <tr className="text-[9px] bg-slate-50 text-slate-500 font-semibold">
                    <th className="border border-slate-300 p-0.5 text-left pl-2">Bobot Maksimal Standar</th>
                    <th className="border border-slate-300 p-0.5">24 / 48</th>
                    <th className="border border-slate-300 p-0.5">24 / 48</th>
                    <th className="border border-slate-300 p-0.5">24 / 66</th>
                    <th className="border border-slate-300 p-0.5">28 / 88</th>
                    <th className="border border-slate-300 p-0.5">100 / 250</th>
                    <th className="border border-slate-300 p-0.5">100</th>
                    <th className="border border-slate-300 p-0.5">100</th>
                    <th className="border border-slate-300 p-0.5">100</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 p-1 text-left pl-2 font-bold bg-slate-50/50">
                      1. Rata-Rata Nilai Harian (18 Bab)
                    </td>
                    <td className="border border-slate-300 p-1">{avg.mojiGoi}</td>
                    <td className="border border-slate-300 p-1">{avg.kaiwa}</td>
                    <td className="border border-slate-300 p-1">{avg.choukai}</td>
                    <td className="border border-slate-300 p-1">{avg.dokkai}</td>
                    <td className="border border-slate-300 p-1 font-bold text-blue-700 bg-blue-50/30">
                      {avg.daiTest} / 100
                    </td>
                    <td className="border border-slate-300 p-1">{avg.kanji}</td>
                    <td className="border border-slate-300 p-1">{avg.kotoba}</td>
                    <td className="border border-slate-300 p-1">{avg.honyaku}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-1 text-left pl-2 font-bold bg-slate-50/50">
                      2. Evaluasi Berkala I (Bab 1–6)
                    </td>
                    <td className="border border-slate-300 p-1">{f1.test.mojiGoi}</td>
                    <td className="border border-slate-300 p-1">{f1.test.kaiwa}</td>
                    <td className="border border-slate-300 p-1">{f1.test.choukai}</td>
                    <td className="border border-slate-300 p-1">{f1.test.dokkai}</td>
                    <td className="border border-slate-300 p-1 font-bold text-emerald-700 bg-emerald-50/30">
                      {f1.test.total} / 250
                    </td>
                    <td className="border border-slate-300 p-1">{f1.kanji}</td>
                    <td className="border border-slate-300 p-1">{f1.kotoba}</td>
                    <td className="border border-slate-300 p-1">{f1.honyaku}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-1 text-left pl-2 font-bold bg-slate-50/50">
                      3. Evaluasi Berkala II (Bab 7–12)
                    </td>
                    <td className="border border-slate-300 p-1">{f2.test.mojiGoi}</td>
                    <td className="border border-slate-300 p-1">{f2.test.kaiwa}</td>
                    <td className="border border-slate-300 p-1">{f2.test.choukai}</td>
                    <td className="border border-slate-300 p-1">{f2.test.dokkai}</td>
                    <td className="border border-slate-300 p-1 font-bold text-emerald-700 bg-emerald-50/30">
                      {f2.test.total} / 250
                    </td>
                    <td className="border border-slate-300 p-1">{f2.kanji}</td>
                    <td className="border border-slate-300 p-1">{f2.kotoba}</td>
                    <td className="border border-slate-300 p-1">{f2.honyaku}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-1 text-left pl-2 font-bold bg-slate-50/50">
                      4. Evaluasi Berkala III (Bab 13–18)
                    </td>
                    <td className="border border-slate-300 p-1">{f3.test.mojiGoi}</td>
                    <td className="border border-slate-300 p-1">{f3.test.kaiwa}</td>
                    <td className="border border-slate-300 p-1">{f3.test.choukai}</td>
                    <td className="border border-slate-300 p-1">{f3.test.dokkai}</td>
                    <td className="border border-slate-300 p-1 font-bold text-emerald-700 bg-emerald-50/30">
                      {f3.test.total} / 250
                    </td>
                    <td className="border border-slate-300 p-1">{f3.kanji}</td>
                    <td className="border border-slate-300 p-1">{f3.kotoba}</td>
                    <td className="border border-slate-300 p-1">{f3.honyaku}</td>
                  </tr>
                  <tr className="bg-amber-50/40 font-semibold">
                    <td className="border border-slate-300 p-1 text-left pl-2 font-bold text-slate-900">
                      5. Ujian Akhir Komprehensif (Course Final)
                    </td>
                    <td className="border border-slate-300 p-1">{fn.test.mojiGoi}</td>
                    <td className="border border-slate-300 p-1">{fn.test.kaiwa}</td>
                    <td className="border border-slate-300 p-1">{fn.test.choukai}</td>
                    <td className="border border-slate-300 p-1">{fn.test.dokkai}</td>
                    <td className="border border-slate-300 p-1 font-bold text-purple-800 bg-purple-50/40">
                      {fn.test.total} / 250
                    </td>
                    <td className="border border-slate-300 p-1">{fn.kanji}</td>
                    <td className="border border-slate-300 p-1">{fn.kotoba}</td>
                    <td className="border border-slate-300 p-1">{fn.honyaku}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Penguasaan Aspek & Portofolio Penguasaan */}
            <div className="grid grid-cols-2 gap-3 items-center border border-slate-200 p-3 rounded-lg bg-slate-50/50">
              <div>
                <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-800 mb-1">
                  Persentase Penguasaan Kompetensi (Standar KKM {kkm}%)
                </h4>
                <p className="text-[10px] text-slate-500 mb-2">
                  Dihitung dari akumulasi performa harian dan ujian berkala.
                </p>

                <div className="space-y-1.5 text-[10px]">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-700">Moji-Goi (Huruf &amp; Kosakata):</span>
                      <span className="font-bold">{pctMoji}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-800 rounded-full" style={{ width: `${pctMoji}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-700">Kaiwa-Hyougen (Percakapan):</span>
                      <span className="font-bold">{pctKaiwa}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-800 rounded-full" style={{ width: `${pctKaiwa}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-700">Choukai (Menyimak Audio):</span>
                      <span className="font-bold">{pctChoukai}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-800 rounded-full" style={{ width: `${pctChoukai}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-700">Dokkai (Membaca Wacana):</span>
                      <span className="font-bold">{pctDokkai}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-800 rounded-full" style={{ width: `${pctDokkai}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rekam Portofolio Akademik */}
              <div className="border-l border-slate-200 pl-3 space-y-2">
                <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-800">
                  Status Kelulusan &amp; Akreditasi Mandiri
                </h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-slate-800">Standar Kompetensi JFT-Basic A2 Terpenuhi</span>
                  </div>
                  <span className="text-[10px] text-slate-600 block pl-5.5">
                    Tingkat Kemahiran: {student.playerLevel || "Tingkat Lanjutan Standar Otsutsuki"}
                  </span>
                </div>

                <div className="pt-1.5 border-t border-slate-200">
                  <span className="text-[10px] font-bold text-slate-600 block mb-1">Bidang Keahlian Terverifikasi:</span>
                  <div className="flex flex-wrap gap-1 text-[9px]">
                    <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-300 font-semibold text-slate-800">
                      Pemahaman Tata Bahasa Dasar
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-300 font-semibold text-slate-800">
                      Komunikasi Interpersonal A2
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-300 font-semibold text-slate-800">
                      Penguasaan Kanji Kehidupan
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Catatan & Rekomendasi Instruktur (Sensei) */}
            <div className="border border-slate-300 p-3 rounded-lg bg-slate-50/70 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[11px] uppercase tracking-wider text-slate-800">
                  Catatan Evaluasi Instruktur Pengajar (Shihan / Sensei):
                </span>
                <span className="text-[10px] font-bold text-slate-600">Predikat: {predikatJapanese}</span>
              </div>
              <p className="text-[10px] text-slate-800 leading-normal">
                {student.senseiNote || defaultSenseiNote}
              </p>
              <div className="pt-1 border-t border-slate-200 text-[10px] text-slate-700 flex items-start gap-1">
                <strong className="text-slate-900 shrink-0">Rekomendasi Lanjutan:</strong>
                <span>
                  {student.senseiRecommendation || defaultSenseiRec}
                </span>
              </div>
            </div>

            {/* Tanda Tangan & Pengesahan Resmi (Inkan Seal Jepang) */}
            <div className="pt-4 flex items-end justify-between text-xs border-t border-slate-300">
              <div className="text-[10px] text-slate-500 space-y-0.5">
                <p>Dokumen rapor resmi ini diterbitkan secara sah oleh:</p>
                <p>
                  <strong>Portal Akademik JP10 Outsutsuki • Irodori Japanese Academic System</strong>
                </p>
                <p className="font-mono text-[9px]">Tanggal Penerbitan: {currentDate}</p>
              </div>

              <div className="text-center space-y-1">
                <span className="text-[11px] text-slate-600 block">Pengajar / Instruktur Penanggung Jawab:</span>
                <div className="relative py-1">
                  {/* Hanko Inkan Seal Merah Otentik Jepang */}
                  <div className="inline-block border-2 border-red-600 text-red-600 rounded-full px-2.5 py-0.5 text-[9px] font-bold tracking-widest uppercase rotate-[-6deg] opacity-90 shadow-xs bg-red-50/20 font-serif">
                    大筒木 • イクバル之印
                  </div>
                </div>
                <span className="font-bold text-xs text-slate-900 border-b border-slate-900 pb-0.5 block">
                  イクバル先生 (Iqbal-sensei)
                </span>
                <span className="text-[10px] text-slate-500 block">NIP. JP10-OUTSUTSUKI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
