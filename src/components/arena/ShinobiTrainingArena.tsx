"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Zap,
  Target,
  Trophy,
  Award,
  BookOpen,
  Headphones,
  FileText,
  Flame,
  ShieldCheck,
  ChevronRight,
  Clock,
  Layers,
  Info,
  Type,
  Check,
} from "lucide-react";
import { addXp, unlockBadge } from "@/lib/gamification";
import soundFX from "@/lib/soundEffects";
import RubyText from "@/components/common/RubyText";

export type TrainingCategory =
  | "choukai"
  | "kotoba"
  | "kanji_kana"
  | "bunpou"
  | "partikel"
  | "dokkai";

export interface TrainingQuestion {
  id: string;
  category: TrainingCategory;
  level: "N4 / JFT-A2";
  title: string;
  contextJa?: string; // Teks bacaan untuk Dokkai atau naskah dialog
  audioTranscript?: string; // Naskah percakapan untuk Choukai
  questionJa: string;
  questionId: string;
  options: {
    text: string;
    label: string; // A, B, C, D
  }[];
  correctIndex: number;
  explanation: string;
  workContextTip: string; // Tips situasi kerja di Jepang
}

// ============================================================================
// BANK SOAL OTENTIK N4 / JFT-BASIC A2 (6 SEKTOR KOMPETENSI LENGKAP)
// ============================================================================
const TRAINING_QUESTIONS: TrainingQuestion[] = [
  // -------------------------------------------------------------
  // 1. CHOUKAI (聴解 - AUDIO PERCAKAPAN SITUASI KERJA)
  // -------------------------------------------------------------
  {
    id: "choukai-1",
    category: "choukai",
    level: "N4 / JFT-A2",
    title: "Percakapan di Pabrik: Instruksi Mematikan Mesin",
    audioTranscript:
      "田中さん、今日の作業が終わったら、必ず機械の電源を切って、赤いレバーを下に引いてください。それから、作業日誌を書いて事務所に提出してくださいね。",
    questionJa: "作業が終わったあと、田中さんはまず何をしなければなりませんか。",
    questionId: "Setelah pekerjaan selesai, apa yang pertama kali harus dilakukan Tanaka?",
    options: [
      { label: "A", text: "機械の電源を切って、レバーを下に引く (Mematikan daya mesin & tarik tuas ke bawah)" },
      { label: "B", text: "事務所へ行って作業日誌を書く (Pergi ke kantor menulis buku harian kerja)" },
      { label: "C", text: "赤いレバーを上に上げる (Menaikkan tuas merah ke atas)" },
      { label: "D", text: "そのまま帰宅する (Langsung pulang ke rumah)" },
    ],
    correctIndex: 0,
    explanation:
      "Pembicara dengan jelas menyatakan: 「必ず機械の電源を切って、赤いレバーを下に引いてください」(Pastikan matikan saklar mesin, lalu tarik tuas merah ke bawah), baru setelah itu menulis buku kerja.",
    workContextTip:
      "Di pabrik manufaktur Jepang (工場), kata 必ず (wajib/pasti) menandakan instruksi keselamatan K3 yang tidak boleh terlewat.",
  },
  {
    id: "choukai-2",
    category: "choukai",
    level: "N4 / JFT-A2",
    title: "Pemberitahuan di Stasiun Shinkansen",
    audioTranscript:
      "まもなく、2番線に東京行き新幹線が到着いたします。黄色い点字ブロックの内側までお下がりください。なお、この列車は全席指定席となっております。",
    questionJa: "乗客はどこで電車を待たなければなりませんか。",
    questionId: "Di mana penumpang harus menunggu kereta Shinkansen?",
    options: [
      { label: "A", text: "点字ブロックの外側 (Di sisi luar garis kuning braille)" },
      { label: "B", text: "黄色い点字ブロックの内側 (Di sisi dalam garis kuning braille)" },
      { label: "C", text: "自由席の看板の前 (Di depan plang gerbong non-reservasi)" },
      { label: "D", text: "改札口の近く (Di dekat gerbang tiket masuk stasiun)" },
    ],
    correctIndex: 1,
    explanation:
      "Pengumuman menyebutkan 「黄色い点字ブロックの内側までお下がりください」(Harap mundur ke sisi dalam blok braille kuning) demi keselamatan penumpang.",
    workContextTip:
      "Pola 『〜の内側までお下がりください』 adalah pengumuman keselamatan standar stasiun JR di seluruh Jepang.",
  },
  {
    id: "choukai-3",
    category: "choukai",
    level: "N4 / JFT-A2",
    title: "Dialog Izin Sakit ke Atasan (Koushin)",
    audioTranscript:
      "すみません、部長。今朝から熱が38度あって頭が痛いので、今日病院へ行ってもよろしいでしょうか。午後の打ち合わせの資料は鈴木さんにメールで送りました。",
    questionJa: "この人はこれから何をしますか。",
    questionId: "Apa yang akan dilakukan orang ini selanjutnya?",
    options: [
      { label: "A", text: "会社へ行って会議に出席する (Pergi ke kantor menghadiri rapat)" },
      { label: "B", text: "病院へ行って診察を受ける (Pergi ke klinik/RS untuk berobat)" },
      { label: "C", text: "鈴木さんに電話して資料を届ける (Menelepon Suzuki menyerahkan dokumen)" },
      { label: "D", text: "薬を飲んで普通に仕事をする (Minum obat lalu bekerja seperti biasa)" },
    ],
    correctIndex: 1,
    explanation:
      "Karyawan meminta izin cuti sakit karena demam 38°C: 「今日病院へ行ってもよろしいでしょうか」(Bolehkah hari ini saya pergi ke RS/klinik?), dan dokumen rapat sudah didelegasikan ke rekan kerja.",
    workContextTip:
      "Dalam budaya kerja Jepang (Hourensou), saat izin sakit wajib menyebutkan gejala secara spesifik dan memastikan tugas kantor sudah didelegasikan.",
  },

  // -------------------------------------------------------------
  // 2. KOSAKATA (語彙 / KOTOBA - ISTILAH KERJA & KEHIDUPAN JEPANG)
  // -------------------------------------------------------------
  {
    id: "kotoba-1",
    category: "kotoba",
    level: "N4 / JFT-A2",
    title: "Kosakata Operasional: Merapikan Tempat Kerja (5S)",
    questionJa: "仕事が終わったら、使った道具を元の場所に【　　】ください。",
    questionId: "Pilihlah kata kerja yang tepat untuk 'mengembalikan/merapikan' peralatan ke tempat semula:",
    options: [
      { label: "A", text: "かたづけて (Katasukete - Rapikan / simpan kembali)" },
      { label: "B", text: "すてて (Sutete - Buang)" },
      { label: "C", text: "こわして (Kowashite - Rusak)" },
      { label: "D", text: "わすれて (Wasurete - Lupakan)" },
    ],
    correctIndex: 0,
    explanation:
      "Kata 片付ける (かたづける) berarti merapikan atau membereskan. Dalam prinsip 5S (Seiri, Seiton, Seisou, Seiketsu, Shitsuke), alat harus selalu dikembalikan ke tempat semula.",
    workContextTip:
      "5S adalah budaya wajib di seluruh industri Jepang. Pola 『元の場所にかたづける』 adalah instruksi harian di pabrik.",
  },
  {
    id: "kotoba-2",
    category: "kotoba",
    level: "N4 / JFT-A2",
    title: "Kosakata Pelaporan: Tenggat Waktu Kerja",
    questionJa: "このレポートの【　　】は金曜日の午後5時までです。",
    questionId: "Istilah yang berarti batas akhir penyerahan dokumen/tugas (deadline) adalah:",
    options: [
      { label: "A", text: "しめきり (Shimekiri - Tenggat waktu / Deadline)" },
      { label: "B", text: "おわり (Owari - Selesai akhir)" },
      { label: "C", text: "じかん (Jikan - Waktu)" },
      { label: "D", text: "やすみ (Yasumi - Libur)" },
    ],
    correctIndex: 0,
    explanation:
      "締め切り (しめきり) adalah kata resmi dalam dunia bisnis dan ujian JFT untuk tenggat waktu penyerahan dokumen atau pendaftaran.",
    workContextTip:
      "Di Jepang, menyerahkan tugas sebelum 締め切り (bahkan 1 hari sebelum deadline) sangat diapresiasi atasan.",
  },
  {
    id: "kotoba-3",
    category: "kotoba",
    level: "N4 / JFT-A2",
    title: "Kosakata Keselamatan: Pemeriksaan Rutin",
    questionJa: "作業を始める前に、必ず安全装置を【　　】してください。",
    questionId: "Kata yang berarti 'melakukan inspeksi / pemeriksaan' adalah:",
    options: [
      { label: "A", text: "てんけん (Tenken - Pemeriksaan / Inspeksi)" },
      { label: "B", text: "そうじ (Souji - Pembersihan)" },
      { label: "C", text: "りょこう (Ryokou - Perjalanan)" },
      { label: "D", text: "れんしゅう (Renshuu - Latihan)" },
    ],
    correctIndex: 0,
    explanation:
      "点検する (てんけんする) berarti melakukan inspeksi/pemeriksaan teknis kelayakan mesin atau alat pengaman sebelum digunakan.",
    workContextTip:
      "Pemeriksaan 点検 (Tenken) adalah pilar K3 utama untuk mencegah kecelakaan kerja (労働災害) di tempat magang.",
  },

  // -------------------------------------------------------------
  // 3. KANJI & KANA (漢字・仮名 - RAMBU & KATA PRAKTIS N4/A2)
  // -------------------------------------------------------------
  {
    id: "kanji-1",
    category: "kanji_kana",
    level: "N4 / JFT-A2",
    title: "Kanji Rambu: Larangan Masuk",
    questionJa: "工場の中に【立入禁止】という看板があります。どう読みますか。",
    questionId: "Bagaimana cara membaca rambu kanji '立入禁止'?",
    options: [
      { label: "A", text: "たちいりきんし (Tachi-iri Kinshi - Dilarang Masuk)" },
      { label: "B", text: "りついりきんし (Ritsu-iri Kinshi)" },
      { label: "C", text: "たちいりとめ (Tachi-iri Tome)" },
      { label: "D", text: "はいりきんし (Hairi Kinshi)" },
    ],
    correctIndex: 0,
    explanation:
      "立入禁止 dibaca たちいりきんし (Tachi-iri Kinshi). Kanji 立 (tachi) + 入 (iri) + 禁 (kin) + 止 (shi) berarti area terlarang dimasuki orang tanpa izin.",
    workContextTip:
      "Soal kanji rambu sering keluar di ujian Prometric JFT A2 seksi Dokkai & Moji-Goi.",
  },
  {
    id: "kanji-2",
    category: "kanji_kana",
    level: "N4 / JFT-A2",
    title: "Kanji Komunikasi: Tiga Pilar Hou-Ren-So",
    questionJa: "問題が起きたら、すぐに上司に【連絡】してください。読み方はどれですか。",
    questionId: "Cara membaca kanji 【連絡】 adalah:",
    options: [
      { label: "A", text: "れんらく (Renraku - Hubungi / Kabari)" },
      { label: "B", text: "れんけつ (Renketsu - Sambungan)" },
      { label: "C", text: "ほうこく (Houkoku - Laporan)" },
      { label: "D", text: "そうだん (Soudan - Konsultasi)" },
    ],
    correctIndex: 0,
    explanation:
      "連絡 dibaca れんらく (Renraku). Bersama 報告 (ほうこく) dan 相談 (そうだん), ketiganya membentuk singkatan etika kerja Jepang HOU-REN-SO.",
    workContextTip:
      "Jangan tertukar antara 連絡 (Renraku - mengabari), 報告 (Houkoku - melaporkan hasil), dan 相談 (Soudan - meminta nasihat).",
  },
  {
    id: "kanji-3",
    category: "kanji_kana",
    level: "N4 / JFT-A2",
    title: "Katakana Istilah Kerja: Petunjuk Operasional",
    questionJa: "機械の使い方がわからないときは、【　　】を読んで確認してください。",
    questionId: "Kata katakana yang tepat untuk 'buku panduan teknis' adalah:",
    options: [
      { label: "A", text: "マニュアル (Manyuaru - Buku Manual / Panduan)" },
      { label: "B", text: "スケジュール (Sukejuuru - Jadwal)" },
      { label: "C", text: "ドライバー (Doraibaa - Obeng)" },
      { label: "D", text: "エレベーター (Erebeetaa - Lift)" },
    ],
    correctIndex: 0,
    explanation:
      "マニュアル (manual) adalah buku instruksi kerja standar yang wajib dibaca saat mengoperasikan mesin baru.",
    workContextTip:
      "Di Jepang, semua SOP tertulis dalam 操作マニュアル (buku manual operasional).",
  },

  // -------------------------------------------------------------
  // 4. BUNPOU (文法 - POLA KALIMAT N4 & JFT-BASIC A2)
  // -------------------------------------------------------------
  {
    id: "bunpou-1",
    category: "bunpou",
    level: "N4 / JFT-A2",
    title: "Pola Keharusan: Harus Memakai Helm Pengaman",
    questionJa: "工事現場に入る前は、安全ヘルメットを【　　】なりません。",
    questionId: "Bentuk pola keharusan (harus memakai) yang tepat adalah:",
    options: [
      { label: "A", text: "かぶらなければ (Kaburanakereba - Harus memakai di kepala)" },
      { label: "B", text: "かぶっても (Kabuttemo - Walaupun memakai)" },
      { label: "C", text: "かぶると (Kaburu to - Jika memakai)" },
      { label: "D", text: "かぶらないで (Kaburanaide - Jangan memakai)" },
    ],
    correctIndex: 0,
    explanation:
      "Pola keharusan resmi N4/A2 adalah 〜なければならない / 〜なければなりません. Bentuk dasar かぶる (memakai topi/helm) diubah ke bentuk Nai menjadi かぶらない, lalu diganti かぶらなければなりません.",
    workContextTip:
      "Topi/helm memakai kata kerja かぶる, pakaian memakai きる, dan sepatu/celana memakai はく.",
  },
  {
    id: "bunpou-2",
    category: "bunpou",
    level: "N4 / JFT-A2",
    title: "Pola Kondisional Waktu: Jika Sudah Selesai...",
    questionJa: "この荷物の確認が【　　】、トラックに積み込んでください。",
    questionId: "Pilihlah bentuk kondisional 'setelah/jika sudah selesai' yang tepat:",
    options: [
      { label: "A", text: "終わったら (Owattara - Setelah/Jika sudah selesai)" },
      { label: "B", text: "終わるから (Owaru kara - Karena selesai)" },
      { label: "C", text: "終わるのに (Owaru noni - Padahal selesai)" },
      { label: "D", text: "終わればいい (Owareba ii - Sebaiknya selesai)" },
    ],
    correctIndex: 0,
    explanation:
      "Pola 〜たら (Ta-ra) menyatakan urutan kejadian: tindakan A harus selesai sempurna lebih dulu, baru tindakan B (memuat ke truk) dilakukan.",
    workContextTip:
      "Pola 〜たら sering dipakai oleh pimpinan regu (Leader) untuk memberikan instruksi kerja bertahap.",
  },
  {
    id: "bunpou-3",
    category: "bunpou",
    level: "N4 / JFT-A2",
    title: "Pola Larangan Tegas: Dilarang Mengambil Foto",
    questionJa: "社内の秘密を守るため、ここで写真を【　　】いけません。",
    questionId: "Lengkapilah pola larangan resmi (dilarang memotret):",
    options: [
      { label: "A", text: "撮っては (Totte wa - Dilarang memotret)" },
      { label: "B", text: "撮っても (Totte mo - Boleh memotret)" },
      { label: "C", text: "撮るなら (Toru nara - Kalau memotret)" },
      { label: "D", text: "撮らないと (Toranai to - Jika tidak memotret)" },
    ],
    correctIndex: 0,
    explanation:
      "Pola 〜てはいけない / 〜てはいけません menyatakan larangan aturan keras. Mengambil foto = 撮る (toru) $\rightarrow$ 撮ってはいけません.",
    workContextTip:
      "Privasi dan rahasia perusahaan (企業秘密) sangat dijunjung tinggi di Jepang. Pelanggaran memotret bisa berakibat pemutusan kontrak kerja.",
  },

  // -------------------------------------------------------------
  // 5. PARTIKEL (助詞 - DRILL TEPAT MEMILIH PARTIKEL)
  // -------------------------------------------------------------
  {
    id: "partikel-1",
    category: "partikel",
    level: "N4 / JFT-A2",
    title: "Partikel Lokasi Aksi vs Lokasi Keberadaan",
    questionJa: "私は毎日、社員食堂【　】昼ご飯を食べます。",
    questionId: "Partikel yang menandakan tempat berlangsungnya kegiatan (makan siang) adalah:",
    options: [
      { label: "A", text: "で (De - Tempat aktivitas berlangsung)" },
      { label: "B", text: "に (Ni - Titik keberadaan diam)" },
      { label: "C", text: "へ (He - Arah tujuan)" },
      { label: "D", text: "を (Wo - Objek penderita)" },
    ],
    correctIndex: 0,
    explanation:
      "Partikel で (De) dipakai saat ada aktivitas dinamis yang dilakukan di tempat tersebut (食べる, 働く, 勉強する). Sedangkan に dipakai untuk keberadaan diam (いる, ある).",
    workContextTip:
      "Perbedaan 『食堂で食べる』 (makan di kantin) vs 『食堂にいる』 (sedang ada di kantin) adalah jebolan klasik soal JFT Prometric.",
  },
  {
    id: "partikel-2",
    category: "partikel",
    level: "N4 / JFT-A2",
    title: "Partikel Alat / Sarana Transportasi",
    questionJa: "寮から工場まで、自転車【　】15分くらいかかります。",
    questionId: "Partikel yang menyatakan sarana/alat transportasi (dengan sepeda) adalah:",
    options: [
      { label: "A", text: "で (De - Menggunakan sarana sepeda)" },
      { label: "B", text: "に (Ni)" },
      { label: "C", text: "と (To - Bersama)" },
      { label: "D", text: "を (Wo)" },
    ],
    correctIndex: 0,
    explanation:
      "Partikel で (De) berfungsi menunjukkan alat, sarana transportasi, atau metode yang digunakan (自転車で, バスで, 電車で).",
    workContextTip:
      "Pengecualian: jika berjalan kaki, tidak memakai partikel で melainkan 『歩いて』 (Aruite).",
  },
  {
    id: "partikel-3",
    category: "partikel",
    level: "N4 / JFT-A2",
    title: "Partikel Kemampuan / Minat (Dekimasu)",
    questionJa: "アディックリさんは日本語の日常会話【　】できます。",
    questionId: "Partikel yang mendampingi kata kerja kemampuan できます adalah:",
    options: [
      { label: "A", text: "が (Ga - Menandakan hal yang bisa dilakukan)" },
      { label: "B", text: "を (Wo)" },
      { label: "C", text: "に (Ni)" },
      { label: "D", text: "で (De)" },
    ],
    correctIndex: 0,
    explanation:
      "Kata kerja kemampuan (できます, わかります) dan kata sifat kesukaan/kemahiran (好きです, 上手です) selalu berpasangan dengan partikel が, bukan を.",
    workContextTip:
      "Banyak pembelajar keliru menggunakan 『日本語をできます』 yang salah secara tata bahasa Jepang. Ingat rumus: [Hal] + ができます.",
  },

  // -------------------------------------------------------------
  // 6. DOKKAI (読解 - BACAAN SINGKAT, EMAIL, & RAMBU INFORMASI)
  // -------------------------------------------------------------
  {
    id: "dokkai-1",
    category: "dokkai",
    level: "N4 / JFT-A2",
    title: "Pengumuman Pemeliharaan Lift Pabrik",
    contextJa:
      "【エレベーター定期点検のお知らせ】\n日時：11月15日（金）13:00 〜 15:00\n点検中は第1および第2エレベーターのご利用ができません。\n恐れ入りますが、非常階段をご利用ください。\nご不便をおかけしますが、ご協力をお願いいたします。\n管理部",
    questionJa: "このお知らせの内容と合っているものはどれですか。",
    questionId: "Pernyataan yang BENAR sesuai isi pengumuman pemeliharaan lift di atas adalah:",
    options: [
      { label: "A", text: "金曜日の午後1時から3時までは、階段を使わなければならない (Harus memakai tangga darurat jam 13:00 - 15:00)" },
      { label: "B", text: "エレベーターは終日（一日中）使えない (Lift tidak bisa dipakai seharian penuh)" },
      { label: "C", text: "第1エレベーターだけが利用できる (Hanya lift nomor 1 yang bisa dipakai)" },
      { label: "D", text: "非常階段も利用できない (Tangga darurat juga dilarang dipakai)" },
    ],
    correctIndex: 0,
    explanation:
      "Pengumuman jelas menyebutkan pemeliharaan pada pukul 13:00-15:00 (selama 2 jam) dan penumpang diminta memakai tangga darurat: 「非常階段をご利用ください」.",
    workContextTip:
      "Di ujian JFT-Basic A2, soal Dokkai membaca pengumuman gedung/fasilitas selalu menanyakan waktu, batasan aturan, dan solusi alternatif.",
  },
  {
    id: "dokkai-2",
    category: "dokkai",
    level: "N4 / JFT-A2",
    title: "Email Undangan Syukuran Teman Kantor (Soubetsu-kai)",
    contextJa:
      "件名：山田さんの送別会のご案内\n社員の皆様へ\n来月末で退職される山田さんの送別会を下記の通り開催いたします。\n\n・日時：11月22日（金）18:30開始\n・場所：駅前居酒屋「さくら」\n・会費：3,000円\n出欠の返事は、11月18日（月）までに幹事の佐藤までメールでお知らせください。",
    questionJa: "送別会に参加したい人は、何をしなければなりませんか。",
    questionId: "Apa yang harus dilakukan orang yang ingin berpartisipasi dalam pesta perpisahan tersebut?",
    options: [
      { label: "A", text: "11月18日までに佐藤さんにメールで連絡する (Mengabari Sato via email paling lambat 18 Nov)" },
      { label: "B", text: "当日居酒屋に直接行って会費を払う (Langsung datang ke kedai di hari H membayar biaya)" },
      { label: "C", text: "山田さんに直接プレゼントを渡す (Langsung memberikan kado ke Yamada)" },
      { label: "D", text: "11月22日の昼休みに返事をする (Memberi jawaban di jam istirahat tanggal 22 Nov)" },
    ],
    correctIndex: 0,
    explanation:
      "Kalimat terakhir menyebutkan batas konfirmasi: 「11月18日（月）までに幹事の佐藤までメールでお知らせください」 (Beri tahu panitia Sato lewat email paling lambat 18 November).",
    workContextTip:
      "Kata 幹事 (かんじ) adalah istilah penting di dunia kerja Jepang yang berarti koordinator / panitia acara.",
  },
  {
    id: "dokkai-3",
    category: "dokkai",
    level: "N4 / JFT-A2",
    title: "Aturan Pembuangan Sampah Asrama (Gomi Dashikata)",
    contextJa:
      "【寮のゴミ出しルール】\n・燃えるゴミ（生ゴミ・紙など）：火曜日・金曜日の朝8時まで\n・ペットボトル・空き缶：水曜日の朝8時まで\n※指定の透明なゴミ袋を必ず使用してください。前日の夜に出してはいけません。",
    questionJa: "空き缶を捨てたいとき、正しいルールはどれですか。",
    questionId: "Manakah aturan yang BENAR jika ingin membuang kaleng kosong (Aki-kan)?",
    options: [
      { label: "A", text: "水曜日の朝8時までに、透明な袋で出す (Membuang sebelum jam 8 pagi hari Rabu memakai kantong transparan)" },
      { label: "B", text: "火曜日の夜に出しておく (Menaruh di tempat sampah pada Selasa malam)" },
      { label: "C", text: "燃えるゴミと一緒に金曜日に出す (Membuang bersama sampah bakar pada hari Jumat)" },
      { label: "D", text: "黒い不透明な袋に入れて捨てる (Memasukkan ke dalam kantong hitam tidak tembus pandang)" },
    ],
    correctIndex: 0,
    explanation:
      "Kaleng kosong (空き缶) dibuang pada hari Rabu sebelum jam 8 pagi (水曜日の朝8時まで), wajib menggunakan kantong plastik transparan yang ditentukan (指定の透明なゴミ袋), dan dilarang membuang pada malam sebelumnya.",
    workContextTip:
      "Pemisahan sampah (ゴミの分別) adalah salah satu ujian kepatuhan sosial paling krusial bagi pekerja asing di Jepang.",
  },
];

// ============================================================================
// DEFINISI 6 SEKTOR KATEGORI TRAINING
// ============================================================================
const TRAINING_CATEGORIES = [
  {
    id: "choukai",
    name: "Choukai (聴解)",
    sub: "Listening Dialog Situasi Kerja",
    icon: Headphones,
    color: "from-blue-500 to-indigo-600",
    border: "border-blue-500/40",
    badge: "Audio Pemahaman N4/A2",
  },
  {
    id: "kotoba",
    name: "Kosakata (語彙)",
    sub: "Istilah Operasional & Harian",
    icon: BookOpen,
    color: "from-emerald-500 to-teal-600",
    border: "border-emerald-500/40",
    badge: "5S & Dunia Kerja",
  },
  {
    id: "kanji_kana",
    name: "Kanji & Kana (漢字・仮名)",
    sub: "Rambu K3 & Istilah Katakana",
    icon: Layers,
    color: "from-purple-500 to-pink-600",
    border: "border-purple-500/40",
    badge: "Rambu & Katakana Kerja",
  },
  {
    id: "bunpou",
    name: "Bunpou (文法)",
    sub: "Pola Kalimat Esensial A2",
    icon: Zap,
    color: "from-amber-500 to-orange-600",
    border: "border-amber-500/40",
    badge: "Syarat, Larangan, Keharusan",
  },
  {
    id: "partikel",
    name: "Partikel Drill (助詞特訓)",
    sub: "Tantangan に, で, を, が, へ",
    icon: Flame,
    color: "from-rose-500 to-red-600",
    border: "border-rose-500/40",
    badge: "Akurasi Partikel Kalimat",
  },
  {
    id: "dokkai",
    name: "Dokkai (読解)",
    sub: "Email, Rambu, & Pengumuman",
    icon: FileText,
    color: "from-cyan-500 to-blue-600",
    border: "border-cyan-500/40",
    badge: "Bacaan Otentik Jepang",
  },
];

interface ShinobiTrainingArenaProps {
  onBackToHub: () => void;
  initialCategory?: TrainingCategory;
}

export default function ShinobiTrainingArena({
  onBackToHub,
  initialCategory = "choukai",
}: ShinobiTrainingArenaProps) {
  const [selectedCat, setSelectedCat] = useState<TrainingCategory>(initialCategory);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(true);

  // UX & Accessibility toggles
  const [showFurigana, setShowFurigana] = useState(true);
  const [isShaking, setIsShaking] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);

  const CATEGORY_ORDER: TrainingCategory[] = [
    "choukai",
    "kotoba",
    "kanji_kana",
    "bunpou",
    "partikel",
    "dokkai",
  ];

  // Filter daftar soal berdasarkan kategori aktif
  const currentCategoryQuestions = useMemo(() => {
    return TRAINING_QUESTIONS.filter((q) => q.category === selectedCat);
  }, [selectedCat]);

  const activeQuestion = currentCategoryQuestions[currentIndex] || currentCategoryQuestions[0];

  // Reset state saat berganti kategori
  const handleSelectCategory = (cat: TrainingCategory) => {
    setSelectedCat(cat);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setShowTranscript(false);
    setTimeRemaining(30);
    setIsTimerActive(true);
    setCorrectAnswersCount(0);
    setShowVictoryModal(false);
  };

  // Timer Countdown (30 detik per soal)
  useEffect(() => {
    if (!isTimerActive || isAnswerSubmitted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Waktu habis, otomatis submit salah jika belum memilih
          handleAutoSubmitTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerActive, isAnswerSubmitted, currentIndex]);

  const handleAutoSubmitTimeOut = () => {
    if (!isAnswerSubmitted) {
      setIsAnswerSubmitted(true);
      setStreak(0);
      soundFX.playWrong();
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 450);
    }
  };

  // Fitur Audio Synthesizer Text-to-Speech untuk Choukai
  const playJapaneseSpeech = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    utterance.rate = 0.88; // Kecepatan alami JFT-Basic A2

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  // Otomatis putar audio jika kategori Choukai
  useEffect(() => {
    if (selectedCat === "choukai" && activeQuestion?.audioTranscript) {
      playJapaneseSpeech(activeQuestion.audioTranscript);
    }
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedCat, currentIndex]);

  // Submit Jawaban
  const handleSelectAnswer = (idx: number) => {
    if (isAnswerSubmitted) return;

    setSelectedOption(idx);
    setIsAnswerSubmitted(true);
    setIsTimerActive(false);

    const isCorrect = idx === activeQuestion.correctIndex;
    if (isCorrect) {
      const nextStreak = streak + 1;
      const bonusStreak = streak >= 2 ? 15 : 0;
      const gained = 25 + bonusStreak;
      setScore((prev) => prev + 100);
      setStreak(nextStreak);
      if (nextStreak > maxStreak) setMaxStreak(nextStreak);
      setCorrectAnswersCount((prev) => prev + 1);
      setXpEarned((prev) => prev + gained);

      // Play SFX
      soundFX.playCorrect();
      if (nextStreak >= 3) {
        setTimeout(() => soundFX.playTaiko(), 120);
      }

      // Sinkronkan ke Gamification State
      addXp(gained, "Latihan Sektor Dojo N4/JFT-A2");

      if (nextStreak >= 5) {
        unlockBadge("streak_5_dojo");
      }
    } else {
      setStreak(0);
      soundFX.playWrong();
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 450);
    }
  };

  // Maju ke Soal Berikutnya
  const handleNextQuestion = () => {
    if (currentIndex < currentCategoryQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setShowTranscript(false);
      setTimeRemaining(30);
      setIsTimerActive(true);
    } else {
      // Selesai satu putaran kategori -> Tampilkan Custom Victory Modal!
      soundFX.playTaiko();
      setShowVictoryModal(true);
    }
  };

  // Handler Lanjut ke Sektor Berikutnya dari Victory Modal
  const handleProceedNextSector = () => {
    const currentIdx = CATEGORY_ORDER.indexOf(selectedCat);
    const nextCat = CATEGORY_ORDER[(currentIdx + 1) % CATEGORY_ORDER.length];
    handleSelectCategory(nextCat);
  };

  // Handler Ulangi Sektor Ini
  const handleRepeatCurrentSector = () => {
    handleSelectCategory(selectedCat);
  };

  const isCorrectAnswer = selectedOption === activeQuestion?.correctIndex;

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200 text-stone-100">
      {/* 1. TOP HEADER & NAVIGATION BAR */}
      <div className="clay-card p-5 sm:p-6 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-stone-900 to-slate-950 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <button
            onClick={onBackToHub}
            className="p-2.5 rounded-2xl bg-black/40 hover:bg-black/60 border border-white/10 text-white transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Hub</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                🥋 SHINOBI TRAINING GROUND
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 opacity-70">
                Standard: N4 / JFT-Basic A2
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-serif tracking-tight mt-0.5">
              Dojo Latihan Mandiri 6 Sektor Kompetensi
            </h1>
          </div>
        </div>

        {/* Status Dashboard Mini (XP, Streak, Timer, Furigana Toggle) */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Furigana ON/OFF Toggle */}
          <button
            onClick={() => setShowFurigana((prev) => !prev)}
            className={`px-3 py-1.5 rounded-2xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm ${
              showFurigana
                ? "bg-amber-400 text-stone-950 border-amber-300"
                : "bg-black/50 text-stone-400 border-white/10 hover:text-white"
            }`}
            title="Nyalakan/matikan furigana (kana di atas kanji)"
          >
            <Type className="w-3.5 h-3.5" />
            <span>Furigana: {showFurigana ? "ON" : "OFF"}</span>
          </button>

          <div className="px-3.5 py-1.5 rounded-2xl bg-black/40 border border-white/10 text-center">
            <span className="text-[9px] opacity-60 block uppercase font-bold">Chakra XP</span>
            <span className="font-mono font-black text-amber-400 text-sm">+{xpEarned}</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-2xl bg-black/40 border border-white/10 text-center">
            <span className="text-[9px] opacity-60 block uppercase font-bold">Streak Combo</span>
            <span className="font-mono font-black text-emerald-400 text-sm">🔥 {streak}x</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-2xl bg-black/40 border border-amber-500/30 text-center">
            <span className="text-[9px] text-amber-400 block uppercase font-bold">Waktu</span>
            <span className={`font-mono font-black text-sm ${timeRemaining <= 5 ? "text-rose-500 animate-pulse" : "text-amber-300"}`}>
              ⏱️ {timeRemaining}s
            </span>
          </div>
        </div>
      </div>

      {/* 2. 6-SECTOR CATEGORY SELECTOR TABS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {TRAINING_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCat === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id as TrainingCategory)}
              className={`p-3 rounded-2xl border text-left transition cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isActive
                  ? `bg-gradient-to-br ${cat.color} text-white shadow-lg ring-2 ring-amber-400 scale-[1.02]`
                  : "bg-black/30 hover:bg-black/50 border-white/10 text-stone-300 opacity-80 hover:opacity-100"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-black/40">
                  {cat.badge}
                </span>
              </div>
              <div>
                <h4 className="font-black text-xs truncate">{cat.name}</h4>
                <p className="text-[10px] opacity-75 truncate">{cat.sub}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. WORKSPACE SOAL LATIHAN N4 / JFT-BASIC A2 */}
      {activeQuestion && (
        <div className={`clay-card p-6 sm:p-8 rounded-3xl border border-white/10 bg-slate-900/90 shadow-2xl space-y-6 transition-all duration-200 ${
          isShaking ? "animate-shake ring-2 ring-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.4)]" : ""
        }`}>
          {/* Header Soal & Indikator Nomor */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-mono font-black flex items-center justify-center border border-amber-500/40 text-sm">
                #{currentIndex + 1}
              </span>
              <div>
                <h3 className="font-extrabold text-sm text-amber-300">
                  {activeQuestion.title}
                </h3>
                <span className="text-[11px] opacity-60">
                  Soal ke-{currentIndex + 1} dari {currentCategoryQuestions.length} • Standar JFT-Basic A2
                </span>
              </div>
            </div>

            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-stone-400 self-start sm:self-auto">
              Kategori: {selectedCat.toUpperCase()}
            </span>
          </div>

          {/* DOKKAI VIEW: Teks Konteks Bacaan / Rambu Nyata */}
          {activeQuestion.contextJa && (
            <div className="p-5 rounded-2xl bg-black/50 border border-cyan-500/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                <FileText className="w-4 h-4" /> Naskah Dokumen / Rambu Informasi Resmi Jepang:
              </div>
              <div className="font-serif text-sm sm:text-base leading-relaxed text-stone-200 whitespace-pre-wrap bg-transparent border-0 p-0">
                <RubyText text={activeQuestion.contextJa} showFurigana={showFurigana} />
              </div>
            </div>
          )}

          {/* CHOUKAI VIEW: Audio Player & Transkrip Percakapan */}
          {selectedCat === "choukai" && activeQuestion.audioTranscript && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/60 to-indigo-950/50 border border-blue-500/40 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => playJapaneseSpeech(activeQuestion.audioTranscript!)}
                    className="clay-btn-gold px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Volume2 className={`w-4 h-4 ${isPlayingAudio ? "animate-bounce" : ""}`} />
                    <span>{isPlayingAudio ? "Memutar Suara Asli..." : "Putar Audio Percakapan"}</span>
                  </button>
                  <span className="text-xs text-blue-300 font-medium">
                    (Kecepatan Standar Ujian JFT Prometric)
                  </span>
                </div>

                <button
                  onClick={() => setShowTranscript((prev) => !prev)}
                  className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showTranscript ? "Sembunyikan Naskah" : "Buka Naskah Jepang"}</span>
                </button>
              </div>

              {showTranscript && (
                <div className="p-3.5 rounded-xl bg-black/40 border border-blue-500/20 text-xs sm:text-sm text-stone-300 font-serif leading-relaxed animate-in fade-in duration-150">
                  <p className="font-bold text-[10px] text-blue-400 uppercase mb-1">Naskah Dialog Percakapan (スクリプト):</p>
                  <RubyText text={activeQuestion.audioTranscript} showFurigana={showFurigana} />
                </div>
              )}
            </div>
          )}

          {/* PERTANYAAN (Jepang & Indonesia) */}
          <div className="space-y-1.5 pt-1">
            <h2 className="text-base sm:text-lg font-black font-serif text-white leading-snug">
              <RubyText text={activeQuestion.questionJa} showFurigana={showFurigana} />
            </h2>
            <p className="text-xs sm:text-sm text-amber-200/80 font-medium">
              💡 {activeQuestion.questionId}
            </p>
          </div>

          {/* OPSI JAWABAN (A, B, C, D) */}
          <div className="grid grid-cols-1 gap-3 pt-2">
            {activeQuestion.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectOption = idx === activeQuestion.correctIndex;

              let btnStyle = "bg-black/40 border-white/15 hover:border-amber-400 hover:bg-black/60 text-stone-200";

              if (isAnswerSubmitted) {
                if (isCorrectOption) {
                  btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-black ring-2 ring-emerald-500/50";
                } else if (isSelected && !isCorrectOption) {
                  btnStyle = "bg-rose-500/20 border-rose-500 text-rose-300 ring-2 ring-rose-500/50";
                } else {
                  btnStyle = "bg-black/20 border-white/5 opacity-40";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(idx)}
                  disabled={isAnswerSubmitted}
                  className={`p-4 rounded-2xl border text-left transition flex items-center gap-3.5 text-xs sm:text-sm cursor-pointer ${btnStyle}`}
                >
                  <span
                    className={`w-7 h-7 rounded-xl font-mono font-black flex items-center justify-center shrink-0 border ${
                      isAnswerSubmitted && isCorrectOption
                        ? "bg-emerald-500 text-stone-950 border-emerald-400"
                        : isAnswerSubmitted && isSelected
                        ? "bg-rose-500 text-white border-rose-400"
                        : "bg-white/10 border-white/20 text-white"
                    }`}
                  >
                    {opt.label}
                  </span>
                  <span className="flex-1 leading-snug">{opt.text}</span>
                  {isAnswerSubmitted && isCorrectOption && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrectOption && (
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* 4. PENJELASAN SHIHAN & TIPS DUNIA KERJA JEPANG */}
          {isAnswerSubmitted && (
            <div className="space-y-4 pt-4 border-t border-white/10 animate-in fade-in-50 duration-200">
              <div
                className={`p-4 sm:p-5 rounded-2xl border ${
                  isCorrectAnswer
                    ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
                    : "bg-rose-950/40 border-rose-500/40 text-rose-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-sm flex items-center gap-2">
                    {isCorrectAnswer ? (
                      <>
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span>Jawaban Anda Tepat! (+25 XP)</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                        <span>Jawaban Kurang Tepat — Mari Pelajari Polanya:</span>
                      </>
                    )}
                  </span>
                  <span className="text-xs font-mono font-bold opacity-75">
                    Kunci: Opsi {activeQuestion.options[activeQuestion.correctIndex].label}
                  </span>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                  {activeQuestion.explanation}
                </p>
              </div>

              {/* Tips Dunia Kerja Jepang (Work Context Tip) */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-1">
                <span className="text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 text-amber-400">
                  <ShieldCheck className="w-3.5 h-3.5" /> Tips Ujian Prometric &amp; Etika Kerja di Jepang:
                </span>
                <p className="text-xs leading-relaxed opacity-85">
                  {activeQuestion.workContextTip}
                </p>
              </div>

              {/* Tombol Lanjut ke Soal Berikutnya */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNextQuestion}
                  className="clay-btn-gold px-6 py-3 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 shadow-xl cursor-pointer"
                >
                  <span>Lanjut ke Soal Berikutnya</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          CUSTOM ANIMATED VICTORY MODAL (SELESAI 1 SEKTOR DOJO)
          ======================================================== */}
      {showVictoryModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="clay-card max-w-lg w-full p-6 sm:p-8 rounded-3xl border-2 border-amber-400/80 bg-gradient-to-b from-amber-950/70 via-stone-900 to-black text-center shadow-[0_0_50px_rgba(245,158,11,0.35)] relative overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Background Glow */}
            <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-5">
              {/* Animated Crown / Trophy Icon */}
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 flex items-center justify-center text-4xl shadow-2xl ring-4 ring-amber-400/40 animate-bounce">
                🥋
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-amber-400 text-stone-950 text-xs font-black tracking-widest uppercase shadow-md">
                  SEKTOR TUNTAS • 修練完了
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-2">
                  Latihan Sektor Selesai!
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 mt-1">
                  Anda telah menuntaskan seluruh latihan di sektor <strong className="text-amber-400">{selectedCat.toUpperCase()}</strong> berstandar N4 &amp; JFT-Basic A2!
                </p>
              </div>

              {/* Rincian Hasil & Statistik Sesi */}
              <div className="grid grid-cols-3 gap-2.5 p-4 rounded-2xl bg-black/50 border border-white/10 text-center">
                <div className="p-2">
                  <div className="text-[10px] text-stone-400 uppercase font-bold">Chakra XP</div>
                  <div className="text-lg font-black text-amber-400">+{xpEarned}</div>
                </div>
                <div className="p-2 border-x border-white/10">
                  <div className="text-[10px] text-stone-400 uppercase font-bold">Akurasi</div>
                  <div className="text-lg font-black text-emerald-400">
                    {Math.round((correctAnswersCount / Math.max(1, currentCategoryQuestions.length)) * 100)}%
                  </div>
                </div>
                <div className="p-2">
                  <div className="text-[10px] text-stone-400 uppercase font-bold">Max Streak</div>
                  <div className="text-lg font-black text-orange-400">🔥 {maxStreak}x</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={handleProceedNextSector}
                  className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-stone-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl hover:brightness-110 transition cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Lanjut Sektor Berikutnya</span>
                </button>
                <button
                  onClick={handleRepeatCurrentSector}
                  className="w-full sm:w-auto py-3 px-4 rounded-2xl bg-stone-800 hover:bg-stone-700 border border-white/10 text-stone-200 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Ulangi</span>
                </button>
                <button
                  onClick={onBackToHub}
                  className="w-full sm:w-auto py-3 px-4 rounded-2xl bg-black/40 hover:bg-black/60 border border-white/10 text-stone-400 hover:text-white font-bold text-xs transition cursor-pointer"
                >
                  Lobi Arena
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
