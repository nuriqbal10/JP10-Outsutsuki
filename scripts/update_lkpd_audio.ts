import fs from "fs";
import path from "path";

const lkpdDir = path.resolve(__dirname, "../public/lkpd");

const robustAudioLogic = `/* ================= AUDIO ================= */
const SUPABASE_AUDIO_BASE = "https://pxhyzrglmoiszqhtevzx.supabase.co/storage/v1/object/public/irodori-assets/audio/shokyu2/";

function safeAudioSrc(path) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const fileName = path.split("/").pop() || "";
  const cleanName = fileName.replace(/\\[/g, "").replace(/\\]/g, "");
  return SUPABASE_AUDIO_BASE + cleanName;
}

function stopCurrentAudio() {
  if (currentAudio) {
    currentAudio.onended = null;
    currentAudio.onerror = null;
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  if (currentButton && currentButton.dataset.originalLabel) {
    currentButton.textContent = currentButton.dataset.originalLabel;
  }
  currentButton = null;
}

function playItemAudio(id, btn) {
  const item = findItemById(id);
  if (!item) { alert("Soal tidak ditemukan."); return; }
  stopCurrentAudio();
  const times = Number(btn.dataset.times || LISTENING_PLAY_COUNT || 2);
  btn.dataset.originalLabel = btn.dataset.originalLabel || btn.textContent;
  currentButton = btn;

  if (item.audioUrl) {
    let audio = document.getElementById("audio-" + id);
    if (!audio) {
      audio = new Audio(safeAudioSrc(item.audioUrl));
      audio.id = "audio-" + id;
      document.body.appendChild(audio);
    }
    currentAudio = audio;
    btn.textContent = "Memutar…";
    let played = 0;

    audio.onended = function() {
      played++;
      if (played < times) {
        audio.currentTime = 0;
        const pr = audio.play();
        if (pr && pr.catch) pr.catch(onPlayErr);
      } else {
        stopCurrentAudio();
      }
    };

    audio.onerror = function() {
      console.warn("Audio source failed, trying local fallback:", audio.src);
      if (!audio.dataset.retried) {
        audio.dataset.retried = "1";
        audio.src = item.audioUrl;
        const retryPr = audio.play();
        if (retryPr && retryPr.catch) retryPr.catch(function(e) {
          console.warn("Local fallback failed:", e);
          if (item.script) playTts(item.script, btn, times);
          else { alert("File audio tidak dapat diputar."); stopCurrentAudio(); }
        });
      } else if (item.script) {
        playTts(item.script, btn, times);
      } else {
        alert("File audio tidak ditemukan/format tidak didukung:\\n" + item.audioUrl);
        stopCurrentAudio();
      }
    };

    audio.currentTime = 0;
    const pr = audio.play();
    if (pr && pr.catch) pr.catch(onPlayErr);
  } else if (item.script) {
    playTts(item.script, btn, times);
  } else {
    alert("Audio dan naskah tidak tersedia untuk soal ini.");
  }
}`;

for (let i = 1; i <= 18; i++) {
  const scriptPath = path.join(lkpdDir, `bab${i}`, "script.js");
  if (!fs.existsSync(scriptPath)) continue;

  let content = fs.readFileSync(scriptPath, "utf8");

  // Replace existing AUDIO block
  const audioBlockRegex = /\/\* =+ AUDIO =+ \*\/[\s\S]*?(?=function onPlayErr|\/\* =+ START =+ \*\/)/;
  if (audioBlockRegex.test(content)) {
    content = content.replace(audioBlockRegex, robustAudioLogic + "\n");
    fs.writeFileSync(scriptPath, content, "utf8");
    console.log(`✅ Updated audio logic in Bab ${i}`);
  } else {
    console.warn(`⚠️ Could not find audio block in Bab ${i}`);
  }
}

console.log("LKPD audio update completed!");
