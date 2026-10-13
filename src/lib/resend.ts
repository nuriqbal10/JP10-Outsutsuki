import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
export const resend = new Resend(resendApiKey || "re_placeholder");

const fromEmail = process.env.RESEND_FROM_EMAIL || "IRODORI Portal <onboarding@resend.dev>";

export interface CbtResultEmailParams {
  email: string;
  name: string;
  examTitle: string;
  totalScore: number;
  maxScore: number;
  isPassed: boolean;
  scoreBreakdown: {
    mojiGoi: number;
    kaiwaHyougen: number;
    choukai: number;
    dokkai: number;
  };
}

/**
 * Send Welcome Onboarding Email via Resend
 */
export async function sendWelcomeEmail(email: string, name: string) {
  if (!resendApiKey) {
    console.warn("Resend API key missing, skipping welcome email.");
    return null;
  }

  return await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: "🌸 Selamat Datang di Portal Terpadu IRODORI JFT-Basic A2!",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
        <h2 style="color: #6366f1;">Selamat Datang, ${name}! 🎉</h2>
        <p>Akun Anda telah berhasil terdaftar di <strong>Portal Terpadu IRODORI A2</strong>.</p>
        <p>Anda sekarang dapat mengakses:</p>
        <ul>
          <li>🎴 <strong>Studio Flashcard Kosakata 3D</strong> (4.245 kata resmi A1, A2.1, A2.2)</li>
          <li>📝 <strong>Simulasi CBT JFT-Basic A2</strong> (Moji Goi, Kaiwa Hyougen, Choukai, Dokkai)</li>
          <li>✍️ <strong>Studio Kanji Irodori</strong> (Animasi Stroke Order & 20-Grid Box)</li>
        </ul>
        <p style="margin-top: 24px;">Selamat belajar dan semoga sukses meraih skor maksimal JFT-Basic A2!</p>
      </div>
    `,
  });
}

/**
 * Send CBT Exam Score Report Email via Resend
 */
export async function sendCbtResultEmail(params: CbtResultEmailParams) {
  if (!resendApiKey) {
    console.warn("Resend API key missing, skipping CBT result email.");
    return null;
  }

  const { email, name, examTitle, totalScore, maxScore, isPassed, scoreBreakdown } = params;
  const statusBadge = isPassed
    ? '<span style="background:#dcfce7; color:#15803d; padding:6px 14px; border-radius:9999px; font-weight:bold;">LULUS (合格)</span>'
    : '<span style="background:#fee2e2; color:#b91c1c; padding:6px 14px; border-radius:9999px; font-weight:bold;">BELUM LULUS (不合格)</span>';

  return await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: `📊 Hasil Rapor CBT: ${examTitle} - ${isPassed ? "LULUS" : "Evaluasi"}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
        <h2 style="color: #1e293b; margin-bottom: 8px;">Laporan Hasil Ujian CBT JFT-Basic</h2>
        <p style="color: #64748b; font-size: 14px;">Peserta: <strong>${name}</strong> (${email})</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
        
        <div style="text-align: center; padding: 20px 0;">
          <div style="font-size: 36px; font-weight: 800; color: #6366f1;">${totalScore} / ${maxScore}</div>
          <div style="margin-top: 12px;">${statusBadge}</div>
        </div>

        <h4 style="color: #334155; margin-bottom: 8px;">Rincian Nilai per Sub-Tes:</h4>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 8px 0;">🔤 Moji Goi (Kosakata & Huruf)</td>
            <td style="text-align: right; font-weight: bold;">${scoreBreakdown.mojiGoi} Poin</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 8px 0;">💬 Kaiwa Hyougen (Tata Bahasa)</td>
            <td style="text-align: right; font-weight: bold;">${scoreBreakdown.kaiwaHyougen} Poin</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 8px 0;">🎧 Choukai (Pendengaran)</td>
            <td style="text-align: right; font-weight: bold;">${scoreBreakdown.choukai} Poin</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">📖 Dokkai (Pemahaman Bacaan)</td>
            <td style="text-align: right; font-weight: bold;">${scoreBreakdown.dokkai} Poin</td>
          </tr>
        </table>

        <p style="margin-top: 24px; font-size: 12px; color: #94a3b8; text-align: center;">
          Portal Terpadu IRODORI A2 • The Japan Foundation Standard
        </p>
      </div>
    `,
  });
}
