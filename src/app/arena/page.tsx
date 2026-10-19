"use client";

import React, { useState, useEffect } from "react";
import { getGamificationState, AVAILABLE_BADGES, UserGamificationState } from "@/lib/gamification";

export default function ShinobiArenaPage() {
    const [gamerState, setGamerState] = useState<UserGamificationState | null>(null);
    const [activeTab, setActiveTab] = useState<"hub" | "duel" | "team" | "badges">("hub");

    useEffect(() => {
        // Muat data gamifikasi saat halaman dibuka
        setGamerState(getGamificationState());

        const handleUpdate = (e: Event) => {
            const customEvent = e as CustomEvent<UserGamificationState>;
            if (customEvent.detail) {
                setGamerState(customEvent.detail);
            }
        };

        window.addEventListener("gamification-updated", handleUpdate as EventListener);
        return () => {
            window.removeEventListener("gamification-updated", handleUpdate as EventListener);
        };
    }, []);

    if (!gamerState) return <div className="p-8 text-center text-white">Memuat Arena Shinobi...</div>;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans">
            {/* HEADER ARENA */}
            <div className="max-w-5xl mx-auto bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-2xl p-6 shadow-2xl border border-purple-500/30 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3">
                        <span className="text-4xl">🥷</span>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">SHINOBI ARENA • 大筒木クラス</h1>
                            <p className="text-purple-300 text-sm">Pusat Latihan Tempur Kotoba, Kanji & Simulasi JFT-Basic</p>
                        </div>
                    </div>
                </div>

                {/* STATUS KARTU PROFIL XP */}
                <div className="bg-slate-900/80 backdrop-blur border border-purple-500/40 rounded-xl p-4 flex items-center gap-4 w-full md:w-auto">
                    <div className="text-3xl font-black text-amber-400">{gamerState.rankBadge}</div>
                    <div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider">{gamerState.rankTitle} (Lv. {gamerState.level})</div>
                        <div className="text-lg font-bold text-white">{gamerState.xp} XP <span className="text-xs text-emerald-400 font-normal">🔥 {gamerState.dailyStreak} Hari Streak</span></div>
                        {/* Progress bar */}
                        <div className="w-36 bg-slate-800 h-2 rounded-full mt-1 overflow-hidden">
                            <div className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-500" style={{ width: `${gamerState.progressPercent}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* NAVIGASI MENU ARENA */}
            <div className="max-w-5xl mx-auto flex flex-wrap gap-3 mb-8">
                <button
                    onClick={() => setActiveTab("hub")}
                    className={`px-5 py-2.5 rounded-xl font-bold transition-all ${activeTab === "hub" ? "bg-purple-600 text-white shadow-lg shadow-purple-600/40" : "bg-slate-900 text-slate-400 hover:bg-slate-800"}`}
                >
                    ⚡ Beranda Arena
                </button>
                <button
                    onClick={() => setActiveTab("duel")}
                    className={`px-5 py-2.5 rounded-xl font-bold transition-all ${activeTab === "duel" ? "bg-purple-600 text-white shadow-lg shadow-purple-600/40" : "bg-slate-900 text-slate-400 hover:bg-slate-800"}`}
                >
                    ⚔️ Duel 1v1 Kotoba
                </button>
                <button
                    onClick={() => setActiveTab("team")}
                    className={`px-5 py-2.5 rounded-xl font-bold transition-all ${activeTab === "team" ? "bg-purple-600 text-white shadow-lg shadow-purple-600/40" : "bg-slate-900 text-slate-400 hover:bg-slate-800"}`}
                >
                    🛡️ Team Battle Squad
                </button>
                <button
                    onClick={() => setActiveTab("badges")}
                    className={`px-5 py-2.5 rounded-xl font-bold transition-all ${activeTab === "badges" ? "bg-purple-600 text-white shadow-lg shadow-purple-600/40" : "bg-slate-900 text-slate-400 hover:bg-slate-800"}`}
                >
                    🏆 Koleksi Badge ({gamerState.badges.length})
                </button>
            </div>

            {/* KONTEN UTAMA BERDASARKAN TAB */}
            <div className="max-w-5xl mx-auto">
                {activeTab === "hub" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-purple-500/50 transition-all">
                            <div>
                                <div className="text-3xl mb-3">⚔️</div>
                                <h3 className="text-xl font-bold text-white mb-2">Mode Duel 1v1</h3>
                                <p className="text-slate-400 text-sm mb-4">Tantang teman sekelas secara *real-time* adu kecepatan menjawab Kotoba dan Kanji JFT-Basic.</p>
                            </div>
                            <button onClick={() => setActiveTab("duel")} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-all">
                                Mulai Duel ›
                            </button>
                        </div>

                        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-purple-500/50 transition-all">
                            <div>
                                <div className="text-3xl mb-3">🛡️</div>
                                <h3 className="text-xl font-bold text-white mb-2">Team Battle (Squad)</h3>
                                <p className="text-slate-400 text-sm mb-4">Bentuk aliansi tim kelas Outsutsuki, kumpulkan poin kolektif terbanyak untuk menguasai takhta mingguan.</p>
                            </div>
                            <button onClick={() => setActiveTab("team")} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all">
                                Masuk Squad ›
                            </button>
                        </div>

                        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-purple-500/50 transition-all">
                            <div>
                                <div className="text-3xl mb-3">🏆</div>
                                <h3 className="text-xl font-bold text-white mb-2">Turnamen Kelas & Badge</h3>
                                <p className="text-slate-400 text-sm mb-4">Lihat lencana kehormatan yang berhasil Anda buka dari misi harian dan ujian simulasi.</p>
                            </div>
                            <button onClick={() => setActiveTab("badges")} className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl transition-all">
                                Lihat Badge ›
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === "duel" && (
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 text-center">
                        <h2 className="text-2xl font-bold mb-4">⚔️ Arena Duel 1v1 Kotoba & Kanji</h2>
                        <p className="text-slate-400 mb-6">Sistem matchmaking real-time siap mempertemukan Anda dengan penantang dari 28 siswa Kelas Ootsutsuki.</p>
                        <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 max-w-md mx-auto mb-6">
                            <div className="text-sm text-slate-400 mb-2">Masukkan Kode Ruangan / Buat Lobi Baru</div>
                            <input type="text" placeholder="Contoh: 8821" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-center text-xl font-mono text-white mb-4 focus:outline-none focus:border-purple-500" />
                            <button onClick={() => alert("Fitur Lobi Duel Real-time siap dihubungkan ke Supabase Realtime!")} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl">
                                Masuk / Buat Ruangan Duel
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === "team" && (
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 text-center">
                        <h2 className="text-2xl font-bold mb-4">🛡️ Team Battle (Squad Outsutsuki)</h2>
                        <p className="text-slate-400 mb-6">28 siswa dibagi menjadi faksi shinobi untuk menguji kekompakan penguasaan bab Irodori.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                            <div className="p-5 bg-slate-950 border border-indigo-500/30 rounded-xl text-left">
                                <h4 className="font-bold text-indigo-400 text-lg mb-1">Faksi チーム雷 (Team Kaminari)</h4>
                                <p className="text-xs text-slate-400">Total XP Tim: 3,450 XP</p>
                            </div>
                            <div className="p-5 bg-slate-950 border border-purple-500/30 rounded-xl text-left">
                                <h4 className="font-bold text-purple-400 text-lg mb-1">Faksi チーム炎 (Team Honoo)</h4>
                                <p className="text-xs text-slate-400">Total XP Tim: 3,890 XP</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "badges" && (
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold mb-6 text-center">🏆 Koleksi Badge Shinobi</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {AVAILABLE_BADGES.map((b) => {
                                const isUnlocked = gamerState.badges.includes(b.id);
                                return (
                                    <div key={b.id} className={`p-4 rounded-xl border flex items-center gap-4 ${isUnlocked ? 'bg-slate-950 border-amber-500/40 text-white' : 'bg-slate-950/40 border-slate-800/50 text-slate-600 grayscale'}`}>
                                        <div className="text-4xl">{b.icon}</div>
                                        <div>
                                            <div className="font-bold text-sm">{b.name}</div>
                                            <div className="text-xs text-slate-400">{b.desc}</div>
                                            <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider">
                                                {isUnlocked ? <span className="text-emerald-400">✔ Terbuka</span> : <span className="text-slate-600">🔒 Terkunci</span>}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}