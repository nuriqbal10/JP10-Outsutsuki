"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Layers, Award, Sparkles, CheckCircle2, ChevronRight, GraduationCap, Video, FileText, HelpCircle, Volume2, Play } from "lucide-react";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function IrodoriA2CoursePage() {
  const chapters = [
    {
      num: 1,
      title: "私のこと",
      subTitle: "Watashi no Koto",
      topic: "Perkenalan Diri, Asal Daerah & Kehidupan di Jepang",
      vocabCount: 57,
      quizCount: 25,
      grammarPoints: [
        "N でよかったら（私でよかったら）",
        "V［辞書形］＋ばかりです（来たばかりです）",
        "N という N（メダンという町）",
      ],
    },
    {
      num: 2,
      title: "どんな人ですか",
      subTitle: "Donna Hito desu ka",
      topic: "Ciri Fisik, Karakter Orang & Pakaian Kerja",
      vocabCount: 74,
      quizCount: 25,
      grammarPoints: [
        "V［て形］＋いる人（コピーをしている人）",
        "いA［～い］／なA［～な］＋人",
        "N を着ている／履いている／かけている",
      ],
    },
    {
      num: 3,
      title: "おすすめは何ですか",
      subTitle: "Osusume wa Nan desu ka",
      topic: "Restoran, Menu Makanan, Alergi & Reservasi",
      vocabCount: 104,
      quizCount: 25,
      grammarPoints: [
        "A（理由）ので、B（アレルギーがあるので）",
        "～てもいいですか（許可）",
        "～たらどうですか（アドバイス）",
      ],
    },
    {
      num: 4,
      title: "何時からですか",
      subTitle: "Nan-ji kara desu ka",
      topic: "Jam Kerja, Lembur, Jadwal & Janji Temu",
      vocabCount: 91,
      quizCount: 25,
      grammarPoints: [
        "V［辞書形］／［ない形］＋ようにしてください",
        "V［辞書形］＋前に／V［た形］＋後で",
        "～までに（期限）",
      ],
    },
    {
      num: 5,
      title: "安全第一",
      subTitle: "Anzen Daiichi",
      topic: "Aturan Pabrik, Keselamatan Kerja & Prosedur K3",
      vocabCount: 88,
      quizCount: 25,
      grammarPoints: [
        "V［可能形］（泳げます／食べられます）",
        "～てはいけません（禁止）",
        "～なければなりません（義務）",
      ],
    },
    {
      num: 6,
      title: "どうやって行きますか",
      subTitle: "Dou yatte Ikimasu ka",
      topic: "Transportasi, Tiket Kereta & Rute Perjalanan",
      vocabCount: 114,
      quizCount: 25,
      grammarPoints: [
        "V［意向形］＋と思っています（行くつもりです）",
        "V［た形］＋ほうがいいです（助言）",
        "～たら、～（条件）",
      ],
    },
    {
      num: 7,
      title: "雨が降ったら、ホールでやります",
      subTitle: "Ame ga Futtara, Hooru de Yarimasu",
      topic: "Festival Komunitas, Cuaca & Partisipasi Acara",
      vocabCount: 239,
      quizCount: 25,
      grammarPoints: [
        "～たら（雨が降ったら）",
        "～てもいいですか／～てくれませんか",
        "V［た形］＋ことがあります（経験）",
      ],
    },
    {
      num: 8,
      title: "屋台はどこかわかりますか？",
      subTitle: "Yatai wa Doko ka Wakarimasu ka",
      topic: "Festival Budaya, Lokasi Stan & Denah Acara",
      vocabCount: 189,
      quizCount: 25,
      grammarPoints: [
        "［疑問詞］＋か、わかりますか（間接疑問）",
        "突き当たり／右手／左手／奥（位置・方角）",
        "～はご遠慮ください（丁寧な禁止）",
      ],
    },
    {
      num: 9,
      title: "成人の日は、何をするんですか？",
      subTitle: "Seijin no Hi wa, Nan o Surun desu ka",
      topic: "Hari Libur Nasional, Perayaan Tradisional & Budaya Jepang",
      vocabCount: 258,
      quizCount: 25,
      grammarPoints: [
        "普通形＋んです（か）（説明・理由の確認）",
        "V［たり］＋V［たり］します（例示）",
        "～をお祝いします／祈ります",
      ],
    },
    {
      num: 10,
      title: "どんな服を着て行けばいいですか？",
      subTitle: "Donna Fuku o Kite Ikeba Ii desu ka",
      topic: "Tata Cara Berpakaian, Etiket Upacara & Kebiasaan Sosial",
      vocabCount: 240,
      quizCount: 25,
      grammarPoints: [
        "疑問詞＋V［ば形］＋いいですか（助言求め）",
        "V［た形］／［ない形］＋ほうがいいです（アドバイス）",
        "～ことになっています（規則・社会的慣習）",
      ],
    },
    {
      num: 11,
      title: "ポイントカードを忘れてしまいました",
      subTitle: "Pointo Kaado o Wasurete Shimaimashita",
      topic: "Belanja di Toko, Ukuran Pakaian & Kejadian Tak Terduga",
      vocabCount: 258,
      quizCount: 25,
      grammarPoints: [
        "V［て形］＋しまいました（失敗・遺憾）",
        "～てみてもいいですか（試着・試し）",
        "～すぎます（度合いの超過）",
      ],
    },
    {
      num: 12,
      title: "このボタンを押すと、エコモードに変わります",
      subTitle: "Kono Botan o Osu to, Ekomoodo ni Kawarimasu",
      topic: "Pengoperasian Alat Elektronik, Tombol Fungsi & Rumah Tangga",
      vocabCount: 276,
      quizCount: 25,
      grammarPoints: [
        "V［辞書形］＋と、～（確定条件・機械の動作）",
        "V［ます形］＋方（使い方・操作方法）",
        "～ようにしてください（使用上の注意）",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* HEADER */}
      <header className="clay-card border-b border-black/10 dark:border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
        <Link href="/lms" className="inline-flex items-center gap-2 text-xs font-black tracking-wider opacity-80 hover:opacity-100 transition uppercase">
          <ArrowLeft className="w-4 h-4 text-amber-500" /> Katalog Kursus
        </Link>
        <div className="flex items-center gap-2.5 text-sm sm:text-base font-extrabold tracking-wide">
          <img
            src="/outsutsuki-logo.jpg"
            alt="Logo Outsutsuki"
            className="w-7 h-7 rounded-lg object-cover border border-amber-400/50"
          />
          <span>Kelas Outsutsuki • Silabus Irodori A2.2</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-current/20 bg-black/5 dark:bg-white/10 hidden sm:inline-block">
            大筒木クラス専用
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 sm:p-8 flex-1 flex flex-col gap-8 w-full">
        {/* COURSE OVERVIEW BANNER */}
        <div className="clay-card rounded-3xl p-8 border border-current/10 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-start gap-5">
            <img
              src="/outsutsuki-logo.jpg"
              alt="Logo Outsutsuki"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400/60 shadow-xl shrink-0 hidden sm:block"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-300 bg-amber-500/10 border border-amber-400/30 px-3 py-1 rounded-lg">
                  Eksklusif Kelas Outsutsuki (大筒木)
                </span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Standar The Japan Foundation
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black mt-2.5">
                Portal Belajar Irodori A2.2 • Kelas Outsutsuki
              </h2>
              <p className="opacity-85 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
                Platform pembelajaran khusus siswa <strong>Kelas Outsutsuki</strong>. Pelajari buku modul resmi, dengarkan audio percakapan otentik, dan kerjakan lembar kerja LKPD berpenilaian otomatis.
              </p>
            </div>
          </div>
          <Link
            href="/cbt/0"
            className="clay-btn-gold px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider shrink-0"
          >
            Tryout Akbar (Fukushuu 1)
          </Link>
        </div>

        {/* CHAPTER LIST */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              Daftar Bab & Silabus Pembelajaran
            </h3>
            <span className="text-xs opacity-70">Klik salah satu bab untuk mulai belajar</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {chapters.map((ch) => (
              <div
                key={ch.num}
                className="clay-card rounded-2xl p-6 border border-current/10 flex flex-col justify-between gap-6 hover:scale-[1.01] transition group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-lg">
                      第{ch.num}課 (Bab 0{ch.num})
                    </span>
                    <span className="text-xs font-bold opacity-60 font-mono">
                      {ch.subTitle}
                    </span>
                  </div>

                  <h4 className="font-black text-lg mt-3 group-hover:text-amber-500 transition">
                    {ch.title}
                  </h4>
                  <p className="text-xs opacity-80 mt-1 leading-relaxed">
                    {ch.topic}
                  </p>

                  {/* 3 PILAR MOODLE PER BAB */}
                  <div className="mt-4 pt-4 border-t border-current/10 flex flex-col gap-2 text-xs">
                    <div className="flex items-center gap-2 opacity-85">
                      <FileText className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span><strong>Modul Tata Bahasa:</strong> {ch.grammarPoints.join(" • ")}</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-85">
                      <Volume2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span><strong>Kotoba Irodori:</strong> {ch.vocabCount} Kosakata Terdaftar</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-85">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span><strong>Latihan Soal CBT:</strong> {ch.quizCount} Butir Soal per Bab</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <Link
                    href={`/lms/irodori-a2-2/bab/${ch.num}`}
                    className="clay-btn-gold flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-wider text-center transition shadow-md hover:scale-[1.02]"
                  >
                    Buka Bab 0{ch.num}
                  </Link>
                  <Link
                    href={`/cbt/${ch.num}`}
                    className="clay-btn px-4 py-3 rounded-xl font-black text-xs transition flex items-center gap-1"
                    title="Langsung mulai kuis CBT Bab ini"
                  >
                    Kuis CBT <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
