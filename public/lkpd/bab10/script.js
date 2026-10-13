/*
  script.js
  LKPD Interaktif Bahasa Jepang Bab 6 | A2.2 / JFT-Basic / LPK [Checkpoint 1]
  Tema: 旅行に行こう (いろいろなところに行けて、よかったです)
*/

let DATA = window.LKPD_DATA || { settings: {}, tabs: [] };
const SETTINGS = DATA.settings || {};

const SESSION_KEY = SETTINGS.sessionKey || "lkpd_bab10_session_v1";
const STATE_KEY = SETTINGS.stateKey || "lkpd_bab10_state_v1";
const TEACHER_PASSWORD_HASH = SETTINGS.teacherPasswordHash || "6b40c7ab79085611a42cd12be96f26e4696734ff4d7ed831606f8322f8583bb6";
const LISTENING_PLAY_COUNT = Number(SETTINGS.listeningPlayCount || 2);
const SHOW_LISTENING_CONTROLS = SETTINGS.showListeningControls === true;

/* ===== PENGIRIMAN NILAI GOOGLE SHEETS ===== */
const SHEET_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbydufvt6cBNIKrclA71S1Vwlq_SlKl52D1OmhWi0VWGKnKsrXcoe4iOWt5hufj1K4zk/exec";
const SEND_TOKEN = "LPKb1-7x9q-2026z";
const HASH_SALT = "lkpd_bab10::v1::";
/* ========================================= */

let currentRole = null;
let selectedRole = "student";
let lastReport = "";
let lastScores = null;
let lastWeaknesses = [];

let currentAudio = null;
let currentButton = null;

/* ================= CRYPTO / PASSWORD ================= */
function cryptoAvailable(){ return !!(window.crypto && window.crypto.subtle && typeof TextEncoder !== "undefined"); }
async function sha256Hex(text){
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("");
}
async function hashPassword(pw){ return await sha256Hex(HASH_SALT + String(pw||"")); }
window.generateTeacherHash = async function(pw){
  if(!cryptoAvailable()){ console.error("crypto.subtle tidak tersedia. Jalankan via https/localhost, bukan file://."); return null; }
  if(!pw){ console.log("Contoh: generateTeacherHash('PasswordAnda')"); return null; }
  const h = await hashPassword(pw);
  console.log("=== SALIN HASH INI ==="); console.log(h);
  console.log('Tempel ke data-soal.js -> settings.teacherPasswordHash: "<hash>"');
  return h;
};

/* ================= INIT ================= */
function init(){
  DATA = window.LKPD_DATA || { settings: {}, tabs: [] };
  setDefaultDate(); attachGlobalListeners();
  DATA = window.LKPD_DATA || DATA;
  if (!DATA.tabs || DATA.tabs.length === 0) {
    if (window.LKPD_DATA && window.LKPD_DATA.tabs && window.LKPD_DATA.tabs.length > 0) {
      DATA = window.LKPD_DATA;
    } else {
      console.warn("Menunggu muat data-soal.js untuk Bab 10...");
      setTimeout(init, 50);
      return;
    }
  }

  // Auto-login dari URL jika dipanggil via Portal Master
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const pName = urlParams.get('name');
    const pClass = urlParams.get('class') || urlParams.get('kelas');
    const pDate = urlParams.get('date') || urlParams.get('tanggal');
    if (pName) {
      const s = {
        role: "student",
        name: pName,
        kelas: pClass || "A2.2",
        date: pDate || new Date().toISOString().slice(0, 10)
      };
      safeSetItem(SESSION_KEY, JSON.stringify(s));
      currentRole = "student";
      showApp(s);
      return;
    }
  } catch(e) { console.warn("Param parse error:", e); }

  const raw = safeGetItem(SESSION_KEY);
  if(raw){ try{ const s=JSON.parse(raw); currentRole=s.role; showApp(s); return; }catch(e){ safeRemoveItem(SESSION_KEY); } }
  const defaultSession = {
    role: "student",
    name: "Peserta Didik",
    kelas: "A2.2",
    date: new Date().toISOString().slice(0, 10)
  };
  currentRole = "student";
  showApp(defaultSession);
}
function attachGlobalListeners(){ if(window.__lkpdListenersAttached) return; window.__lkpdListenersAttached=true; document.addEventListener("input",saveState); document.addEventListener("change",saveState); }
function setDefaultDate(){ const d=document.getElementById("loginDate"); if(d&&!d.value) d.value=new Date().toISOString().slice(0,10); }

/* ================= LOGIN / SESSION ================= */
function showLogin(){ const ls=document.getElementById("loginScreen"), app=document.getElementById("app"); if(ls)ls.style.display="flex"; if(app)app.style.display="none"; document.body.classList.remove("teacher"); }
function showApp(session){
  const ls=document.getElementById("loginScreen"), app=document.getElementById("app");
  if(ls)ls.style.display="none";
  if(app)app.style.display="block";
  document.body.classList.toggle("teacher",session.role==="teacher");
  updateUserInfo(session);
  renderTabs();
  restoreState();
}
function updateUserInfo(session){
  const u=document.getElementById("userInfo");
  if(!u)return;
  if(session.role==="teacher"){
    u.textContent="Mode: Guru — kunci jawaban, naskah audio, dan penilaian terjemahan aktif.";
  } else {
    u.textContent="Peserta: "+(session.name||"-")+" | Kelas: "+(session.kelas||"-")+" | Tanggal: "+(session.date||"-")+" [Checkpoint 1]";
  }
}
function selectRole(role){
  selectedRole=role;
  const bs=document.getElementById("btnRoleStudent"),bt=document.getElementById("btnRoleTeacher"),fs=document.getElementById("studentForm"),ft=document.getElementById("teacherForm"),er=document.getElementById("loginError");
  if(bs)bs.classList.toggle("active",role==="student");
  if(bt)bt.classList.toggle("active",role==="teacher");
  if(fs)fs.style.display=role==="student"?"flex":"none";
  if(ft)ft.style.display=role==="teacher"?"flex":"none";
  if(er)er.textContent="";
}
function loginStudent(){
  const n=document.getElementById("loginName"),k=document.getElementById("loginClass"),d=document.getElementById("loginDate"),e=document.getElementById("loginError");
  const name=n?n.value.trim():"",kelas=k?k.value.trim():"",date=d?d.value:"";
  if(!name||!kelas||!date){ if(e)e.textContent="Nama, kelas, dan tanggal wajib diisi."; return; }
  const s={role:"student",name:name,kelas:kelas,date:date};
  safeSetItem(SESSION_KEY,JSON.stringify(s));
  currentRole="student";
  showApp(s);
}
async function loginTeacher(){
  const p=document.getElementById("teacherPassword"),e=document.getElementById("loginError");
  const pw=p?p.value:"";
  if(!TEACHER_PASSWORD_HASH){ if(e)e.textContent="Password guru belum diset."; return; }
  if(!cryptoAvailable()){ if(e)e.textContent="Gunakan HTTPS atau localhost."; return; }
  try {
    const h=await hashPassword(pw);
    if(h===TEACHER_PASSWORD_HASH){
      const s={role:"teacher",name:"Guru"};
      safeSetItem(SESSION_KEY,JSON.stringify(s));
      currentRole="teacher";
      showApp(s);
    } else {
      if(e)e.textContent="Password guru salah.";
    }
  } catch(err){
    console.error(err);
    if(e)e.textContent="Terjadi kesalahan verifikasi password.";
  }
}
function logout(){
  if(!confirm("Keluar dari akun ini? Jawaban tersimpan di browser tidak otomatis terhapus.")) return;
  safeRemoveItem(SESSION_KEY);
  location.reload();
}
function resetAll(){
  if(!confirm("Hapus semua jawaban dan muat ulang LKPD Bab 10?")) return;
  safeRemoveItem(STATE_KEY);
  location.reload();
}

/* ================= RENDER ================= */
function renderTabs(){
  const tabsEl=document.getElementById("tabs"), panelsEl=document.getElementById("panels");
  if(!tabsEl||!panelsEl)return;
  tabsEl.innerHTML=""; panelsEl.innerHTML="";

  DATA.tabs.forEach(function(tab,index){
    const btn=document.createElement("button");
    btn.className="tab-btn"+(index===0?" active":"");
    btn.textContent=tab.label||"";
    btn.onclick=function(){ openTab(tab.id,btn); };
    tabsEl.appendChild(btn);

    const section=document.createElement("section");
    section.id="panel-"+tab.id;
    section.className="tab-panel"+(index===0?" active":"");

    if(tab.type==="static"){ section.innerHTML=tab.html||""; }
    else if(tab.type==="questions"){ section.innerHTML="<h2>"+escapeHtml(tab.label||"")+"</h2>"+(tab.items||[]).map(renderItem).join(""); }
    else if(tab.type==="result"){ section.innerHTML=resultHTML(); }
    else if(tab.type==="audiobank"){ section.innerHTML="<h2>"+escapeHtml(tab.label||"")+"</h2>"+'<p class="small">Putar untuk latihan / シャドーイング. Player bebas dan boleh diulang.</p>'+(tab.items||[]).map(renderBankItem).join(""); }
    else { section.innerHTML=(tab.items&&tab.items.length)?"<h2>"+escapeHtml(tab.label||"")+"</h2>"+tab.items.map(renderItem).join(""):(tab.html||""); }
    panelsEl.appendChild(section);
  });
}

function openTab(tabId, btn) {
  document.querySelectorAll(".tab-panel").forEach(el => el.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(el => el.classList.remove("active"));
  const p = document.getElementById("panel-" + tabId);
  if (p) {
    p.classList.add("active");
    setTimeout(syncAllRadioSelectedStates, 10);
  }
  if (btn) {
    btn.classList.add("active");
    try { btn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" }); } catch(e) {}
  }
}

function renderItem(item) {
  const isTeacher = currentRole === "teacher";
  let html = '<div class="question-card">';
  
  if (item.passage) html += '<div class="passage ja">' + item.passage + '</div>';

  if (item.type === "listening") {
    const times = Number(item.playCount || LISTENING_PLAY_COUNT || 2);
    const show = SHOW_LISTENING_CONTROLS;
    html += '<button class="play-btn no-print" data-times="' + times + '" onclick="playItemAudio(\'' + item.id + '\', this)">Putar Audio (' + times + 'x)</button>';
    if (item.audioUrl) {
      html += '<audio id="audio-' + item.id + '" src="' + safeAudioSrc(item.audioUrl) + '" preload="none"' + (show ? ' controls' : '') + '></audio>';
    }
  }

  if (item.number) html += '<div class="q-num prompt ja"><strong>' + escapeHtml(item.number) + '</strong> ' + (item.prompt || '') + '</div>';
  else if (item.prompt) html += '<p class="prompt ja">' + item.prompt + '</p>';
  if (item.source) html += '<p class="small"><strong>Sumber:</strong> ' + escapeHtml(item.source) + '</p>';
  if (item.hint) html += '<p class="hint small"><em>Petunjuk:</em> ' + escapeHtml(item.hint) + '</p>';

  if (item.type === "mcq" || item.type === "listening") {
    html += '<div class="options ja">';
    (item.options || []).forEach(function(opt, idx) {
      const optVal = idx + 1;
      html += '<label class="option-label">' +
        '<input type="radio" name="' + item.id + '" value="' + optVal + '" onchange="updateRadioSelection(this);saveState();" />' +
        '<span class="option-text">' + opt + '</span>' +
        '</label>';
    });
    html += '</div>';

    if (isTeacher) {
      const correctText = (item.options && item.options[item.answer - 1]) ? item.options[item.answer - 1] : ("Pilihan " + item.answer);
      html += '<div class="teacher-box note">';
      html += '<p><strong>[KUNCI GURU]</strong> Jawaban benar: <strong>' + escapeHtml(correctText) + '</strong> (Opsi ' + item.answer + ')</p>';
      if (item.script) html += '<p class="small"><strong>Naskah Audio:</strong> ' + escapeHtml(item.script) + '</p>';
      html += '</div>';
    }
  } else if (item.type === "vocab") {
    html += '<div class="vocab-field">' +
      '<input type="text" id="' + item.id + '" class="ja" placeholder="Ketik jawaban (kanji / hiragana / romaji)" oninput="saveState()" />' +
      '</div>';
    if (isTeacher) {
      html += '<div class="teacher-box note">' +
        '<p><strong>[KUNCI GURU]</strong> Diterima: ' + (item.accepted || []).map(escapeHtml).join(" / ") + '</p>' +
        '</div>';
    }
  } else if (item.type === "translation") {
    html += '<textarea id="' + item.id + '" rows="2" class="ja" placeholder="Tuliskan terjemahan bahasa Jepang di sini..." oninput="saveState()"></textarea>';
    html += '<div class="teacher-box note' + (isTeacher ? '' : ' teacher-only') + '">' +
      '<p><strong>Contoh Jawaban:</strong> ' + escapeHtml(item.modelAnswer || "-") + '</p>' +
      '<div class="tr-score-wrap">' +
      '<label>Nilai Guru (0 - 4): </label>' +
      '<select id="' + item.id + 'Score" class="tr-score" onchange="saveState()">' +
      '<option value="">Belum dinilai</option>' +
      '<option value="4">4 - Sempurna (Akumulasi tepat & alami)</option>' +
      '<option value="3">3 - Baik (Minor partikel/tata bahasa)</option>' +
      '<option value="2">2 - Cukup (Bermakna tetapi ada kekeliruan)</option>' +
      '<option value="1">1 - Kurang (Sebagian besar salah)</option>' +
      '<option value="0">0 - Kosong / Salah total</option>' +
      '</select>' +
      '</div>' +
      '</div>';
  }

  html += '</div>';
  return html;
}

function renderBankItem(item){
  const src = item.audioUrl || ("audio/" + item.file);
  const title = item.title || item.track || "";
  return '<div class="question-card"><p class="ja"><strong>[' + escapeHtml(item.track || "") + ']</strong> ' + escapeHtml(title) + '</p><audio controls preload="none" style="width:100%" src="' + safeAudioSrc(src) + '"></audio></div>';
}

function resultHTML(){
  return '<h2>Hasil Penilaian Bab 6 &amp; Checkpoint 1 Evaluasi</h2>'+
    '<p class="small">Klik <strong>Hitung Nilai</strong> untuk kalkulasi lengkap dan indikator kesiapan JFT-Basic.</p>'+
    '<div class="result-grid">'+
      '<div class="result-item"><strong>Nilai Akhir Bab 6</strong><div id="resFinal">-</div></div>'+
      '<div class="result-item"><strong>Indikasi Skor JFT (0–250)</strong><div id="resJFTScale">-</div></div>'+
      '<div class="result-item"><strong>Status Kelulusan</strong><div id="resStatus">-</div></div>'+
      '<div class="result-item"><strong>Mini JFT-Like (32 Soal)</strong><div id="resJFTSummary">-</div></div>'+
    '</div>'+
    '<h3>Rincian Sub-komponen</h3>'+
    '<table>'+
      '<tr><th>Bagian Evaluasi</th><th>Skor Perolehan</th><th>Bobot Rapor</th></tr>'+
      '<tr><td>1. 文字・語彙 (Moji - 10 Soal)</td><td id="resMoji">-</td><td rowspan="4">60% (Ujian Bab / JFT-Like)</td></tr>'+
      '<tr><td>2. 会話表現 (Kaiwa - 8 Soal)</td><td id="resKaiwa">-</td></tr>'+
      '<tr><td>3. 聴解 (Choukai - 8 Soal)</td><td id="resChoikai">-</td></tr>'+
      '<tr><td>4. 読解 (Dokkai - 6 Soal)</td><td id="resDokkai">-</td></tr>'+
      '<tr><td>5. 漢字 (Kanji - 8 Soal)</td><td id="resKanji">-</td><td>15%</td></tr>'+
      '<tr><td>6. 語彙ドリル (Kosakata - 10 Soal)</td><td id="resKosakata">-</td><td>15%</td></tr>'+
      '<tr><td>7. 翻訳 (Terjemahan - 5 Soal)</td><td id="resTerjemahan">-</td><td>10%</td></tr>'+
    '</table>'+
    '<div style="margin:14px 0;display:flex;gap:10px;align-items:center;flex-wrap:wrap;">'+
      '<button id="btnKirim" style="background:#2b8a3e;color:#fff;border:none;border-radius:10px;padding:10px 14px;cursor:pointer;font-family:inherit;font-size:.95rem;" onclick="kirimKeGuru()">Kirim Nilai ke Guru</button>'+
      '<button style="background:#0071e3;color:#fff;border:none;border-radius:10px;padding:10px 14px;cursor:pointer;font-family:inherit;font-size:.95rem;" onclick="window.print()">🖨️ Cetak / Simpan PDF</button>'+
      '<span id="kirimMsg" class="small"></span>'+
    '</div>'+
    '<h3>Umpan Balik Diagnostik Checkpoint 1</h3><div id="diagnosticBox" class="note">Belum ada hasil. Silakan klik Hitung Nilai.</div>'+
    '<h3>Rincian Kriteria</h3><div id="criteriaBox" class="small">Belum ada hasil.</div>'+
    '<div id="answerKeyContainer" class="teacher-only"></div>';
}

/* ================= LOCAL STORAGE ================= */
function safeGetItem(k){ try{return localStorage.getItem(k);}catch(e){return null;} }
function safeSetItem(k,v){ try{localStorage.setItem(k,v);}catch(e){console.warn("localStorage write gagal:",e);} }
function safeRemoveItem(k){ try{localStorage.removeItem(k);}catch(e){console.warn("localStorage remove gagal:",e);} }
function saveState(){
  const app=document.getElementById("app");
  if(!app||app.style.display==="none")return;
  const st={};
  document.querySelectorAll("#app input, #app select, #app textarea").forEach(function(el){
    if(el.type==="radio"){
      if(el.checked&&el.name) st[el.name]=el.value;
    } else if(el.type==="checkbox"){
      if(el.id) st[el.id]=el.checked;
    } else if(el.id){
      st[el.id]=el.value;
    }
  });
  safeSetItem(STATE_KEY,JSON.stringify(st));
}
function restoreState(){
  const raw=safeGetItem(STATE_KEY);
  if(!raw)return;
  let st;
  try{st=JSON.parse(raw);}catch(e){return;}
  Object.keys(st).forEach(function(key){
    const v=st[key];
    const r=document.querySelector('input[name="'+key+'"][value="'+v+'"]');
    if(r){r.checked=true;return;}
    const el=document.getElementById(key);
    if(!el)return;
    if(el.type==="checkbox")el.checked=!!v;
    else el.value=v;
  });
  syncAllRadioSelectedStates();
}

/* ================= HELPERS ================= */
function getRadio(name){ const el=document.querySelector('input[name="'+name+'"]:checked'); return el?Number(el.value):null; }
function norm(s){ return String(s||"").trim().toLowerCase().replace(/[\s　]/g,"").replace(/[、。，．,.!！?？「」『』（）()【】\[\]]/g,""); }
function escapeHtml(str){ return String(str||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function findTab(id){ for(let i=0;i<DATA.tabs.length;i++) if(DATA.tabs[i].id===id) return DATA.tabs[i]; return null; }
function findTabByType(t){ for(let i=0;i<DATA.tabs.length;i++) if(DATA.tabs[i].type===t) return DATA.tabs[i]; return null; }
function findItemById(id){ for(let i=0;i<DATA.tabs.length;i++){ const tab=DATA.tabs[i]; if(!tab.items)continue; for(let j=0;j<tab.items.length;j++) if(tab.items[j].id===id) return tab.items[j]; } return null; }
function setText(id,t){ const e=document.getElementById(id); if(e)e.textContent=t; }
function setHTML(id,h){ const e=document.getElementById(id); if(e)e.innerHTML=h; }
function minRequired(total){ return total?Math.ceil(total*0.6):0; }
function round1(v){ return Math.round(Number(v)*10)/10; }
function getSession(){ let s={}; try{s=JSON.parse(safeGetItem(SESSION_KEY)||"{}");}catch(e){s={};} return s; }

/* ================= SCORING ================= */
function sectionResult(sectionId){
  const tab=findTab(sectionId);
  if(!tab||!tab.items)return{correct:0,total:0,percent:0};
  let c=0;
  tab.items.forEach(function(item){ if(getRadio(item.id)===item.answer)c++; });
  const t=tab.items.length;
  return {correct:c,total:t,percent:t?(c/t)*100:0};
}

function calculateScore(){
  const moji=sectionResult("moji"), kaiwa=sectionResult("kaiwa"), choikai=sectionResult("choikai"), dokkai=sectionResult("dokkai"), kanji=sectionResult("kanji");
  const kosakataTab=findTab("kosakata");
  let kosakataCorrect=0, kosakataTotal=0;
  if(kosakataTab&&kosakataTab.items){
    kosakataTotal=kosakataTab.items.length;
    kosakataTab.items.forEach(function(item){
      const el=document.getElementById(item.id);
      const val=el?norm(el.value):"";
      const acc=(item.accepted||[]).map(norm);
      if(val&&acc.indexOf(val)!==-1)kosakataCorrect++;
    });
  }
  const terjemahanTab=findTab("terjemahan");
  let trSum=0, trMax=0, translationIncomplete=false;
  if(terjemahanTab&&terjemahanTab.items){
    trMax=terjemahanTab.items.length*4;
    terjemahanTab.items.forEach(function(item){
      const sel=document.getElementById(item.id+"Score");
      const val=sel?sel.value:"";
      if(val==="")translationIncomplete=true;
      else trSum+=Number(val||0);
    });
  } else { trMax=20; }

  const totalJFT=moji.total+kaiwa.total+choikai.total+dokkai.total;
  const rawJFT=moji.correct+kaiwa.correct+choikai.correct+dokkai.correct;
  const ujianBabNilai=totalJFT?(rawJFT/totalJFT)*100:0;
  const kanjiNilai=kanji.total?(kanji.correct/kanji.total)*100:0;
  const kosakataNilai=kosakataTotal?(kosakataCorrect/kosakataTotal)*100:0;
  const terjemahanNilai=trMax?(trSum/trMax)*100:0;
  const finalNilai=0.6*ujianBabNilai+0.15*kanjiNilai+0.15*kosakataNilai+0.1*terjemahanNilai;
  const jftLikeScale=ujianBabNilai*2.5;

  const mojiReq=minRequired(moji.total), kaiwaReq=minRequired(kaiwa.total), choikaiReq=minRequired(choikai.total), dokkaiReq=minRequired(dokkai.total);
  const weak=[];
  if(moji.correct<mojiReq) weak.push("文字・語彙 (Moji/Kosakata)");
  if(kaiwa.correct<kaiwaReq) weak.push("会話表現 (Tata Bahasa & Percakapan)");
  if(choikai.correct<choikaiReq) weak.push("聴解 (Listening)");
  if(dokkai.correct<dokkaiReq) weak.push("読解 (Membaca Teks)");
  if(kanji.percent<60) weak.push("漢字 (Kanji)");
  if(kosakataNilai<60) weak.push("語彙ドリル (Kosa Kata)");
  if(terjemahanNilai<60) weak.push("翻訳 (Terjemahan)");

  const isLulus = finalNilai >= 65 && weak.length <= 1;
  const statusText = isLulus ? "LULUS (CHECKPOINT 1 TERCAPAI)" : "BELUM LULUS (REMEDIAL CHECKPOINT 1)";

  lastScores = {
    moji, kaiwa, choikai, dokkai, kanji,
    kosakataCorrect, kosakataTotal, kosakataNilai,
    trSum, trMax, terjemahanNilai,
    rawJFT, totalJFT, ujianBabNilai,
    finalNilai, jftLikeScale,
    statusText, isLulus
  };
  lastWeaknesses = weak;

  // Render ke UI
  setText("resFinal", finalNilai.toFixed(1) + " / 100");
  setText("resJFTScale", Math.round(jftLikeScale) + " / 250");
  
  const stEl = document.getElementById("resStatus");
  if(stEl){
    stEl.textContent = statusText;
    stEl.className = isLulus ? "status-pass status-box" : "status-fail status-box";
  }

  setText("resJFTSummary", rawJFT + " / " + totalJFT + " (" + ujianBabNilai.toFixed(1) + "%)");
  setText("resMoji", moji.correct + " / " + moji.total + " (" + moji.percent.toFixed(0) + "%)");
  setText("resKaiwa", kaiwa.correct + " / " + kaiwa.total + " (" + kaiwa.percent.toFixed(0) + "%)");
  setText("resChoikai", choikai.correct + " / " + choikai.total + " (" + choikai.percent.toFixed(0) + "%)");
  setText("resDokkai", dokkai.correct + " / " + dokkai.total + " (" + dokkai.percent.toFixed(0) + "%)");
  setText("resKanji", kanji.correct + " / " + kanji.total + " (" + kanjiNilai.toFixed(0) + "%)");
  setText("resKosakata", kosakataCorrect + " / " + kosakataTotal + " (" + kosakataNilai.toFixed(0) + "%)");
  setText("resTerjemahan", trSum + " / " + trMax + " (" + terjemahanNilai.toFixed(0) + "%)" + (translationIncomplete ? " [Perlu Dinilai Guru]" : ""));

  let diagHtml = "";
  if(isLulus){
    diagHtml = "🎉 <strong>SELAMAT! CHECKPOINT 1 BERHASIL DILAMPAUI DENGAN BAIK.</strong><br>"+
      "Kemampuan pemahaman bahasa Jepang Bab 1 s.d. Bab 6 (Topik 1–3) Anda telah mencapai standar kelulusan CEFR A2 / Persiapan JFT-Basic LPK JP10 Outsutsuki.<br>"+
      "<em>Tetap pertahankan konsistensi latihan percakapan dan penguasaan kanji untuk melangkah ke bab berikutnya!</em>";
  } else {
    diagHtml = "⚠️ <strong>EVALUASI CHECKPOINT 1: MASIH PERLU PENGUATAN.</strong><br>"+
      "Area kompetensi yang perlu diulang: <strong>" + (weak.join(", ") || "Pemahaman umum") + "</strong>.<br>"+
      "Disarankan mendengarkan ulang trek audio di Audio Bank dan melatih kembali pola <em>～たり～たりしました</em> serta <em>～てよかったです</em>.";
  }
  setHTML("diagnosticBox", diagHtml);

  // Siapkan laporan teks clipboard
  const ssn = getSession();
  lastReport = 
    "=== RAPOR EVALUASI CHECKPOINT 1 (BAB 6) ===\n"+
    "Nama: " + (ssn.name || "-") + "\n"+
    "Kelas: " + (ssn.kelas || "-") + " | Tanggal: " + (ssn.date || "-") + "\n"+
    "Tingkat: Irodori A2.2 (初級2) Bab 6 • Checkpoint 1\n"+
    "------------------------------------------\n"+
    "Nilai Akhir: " + finalNilai.toFixed(1) + " / 100\n"+
    "Indikasi Skor JFT: " + Math.round(jftLikeScale) + " / 250\n"+
    "Status: " + statusText + "\n"+
    "- Mini JFT-like: " + rawJFT + " / " + totalJFT + " (" + ujianBabNilai.toFixed(1) + "%)\n"+
    "- Kanji: " + kanjiNilai.toFixed(1) + "% (" + kanji.correct + "/" + kanji.total + ")\n"+
    "- Kosakata: " + kosakataNilai.toFixed(1) + "% (" + kosakataCorrect + "/" + kosakataTotal + ")\n"+
    "- Terjemahan: " + terjemahanNilai.toFixed(1) + "% (" + trSum + "/" + trMax + ")\n"+
    "Area Penguatan: " + (weak.length ? weak.join(", ") : "Tidak ada") + "\n"+
    "==========================================";

  // Render kunci guru
  const akc = document.getElementById("answerKeyContainer");
  if (akc && currentRole === "teacher") {
    let kh = '<h3>Kunci Jawaban Guru (Bab 6)</h3><ol>';
    DATA.tabs.forEach(function (tab) {
      if (tab.items) {
        tab.items.forEach(function (item) {
          if (item.answer) kh += '<li>' + escapeHtml(item.number || item.id) + ': Pilihan ' + item.answer + '</li>';
          if (item.accepted) kh += '<li>' + escapeHtml(item.number || item.id) + ': ' + item.accepted.join(" / ") + '</li>';
          if (item.modelAnswer) kh += '<li>' + escapeHtml(item.number || item.id) + ': ' + escapeHtml(item.modelAnswer) + '</li>';
        });
      }
    });
    kh += '</ol>';
    akc.innerHTML = kh;
  }

  openTab("hasil", document.querySelector('#tabs button:nth-last-child(2)'));
}

function copyReport(){
  if(!lastReport){ alert("Silakan klik 'Hitung Nilai' terlebih dahulu."); return; }
  navigator.clipboard.writeText(lastReport).then(function(){
    alert("Laporan nilai Bab 6 berhasil disalin ke clipboard!");
  }).catch(function(){
    prompt("Salin teks berikut secara manual:", lastReport);
  });
}

function setKirimMsg(status){
  const el = document.getElementById("kirimMsg");
  if(!el) return;
  if(status === "ok"){
    el.style.color = "#2b8a3e";
    el.innerHTML = "✅ <strong>Berhasil dikirim ke Google Spreadsheet Rekap Nilai Guru!</strong>";
  } else if(status === "err"){
    el.style.color = "#c92a2a";
    el.innerHTML = "⚠️ Terjadi kendala pengiriman. Silakan gunakan tombol 'Salin Laporan'.";
  } else {
    el.innerHTML = "";
  }
}

function kirimKeGuru() {
  if (!lastScores) {
    calculateScore();
  }

  const jawabanKosakata = {};
  const kosakataTab = findTab("kosakata");
  if (kosakataTab && kosakataTab.items) {
    kosakataTab.items.forEach(function (item) {
      const el = document.getElementById(item.id);
      jawabanKosakata[item.id] = el ? el.value.trim() : "";
    });
  }

  const jawabanTerjemahan = {};
  const terjemahanTab = findTab("terjemahan");
  if (terjemahanTab && terjemahanTab.items) {
    terjemahanTab.items.forEach(function (item) {
      const el = document.getElementById(item.id);
      const sel = document.getElementById(item.id + "Score");
      jawabanTerjemahan[item.id] = {
        teks: el ? el.value.trim() : "",
        nilai: sel ? sel.value : ""
      };
    });
  }

  const ssn = getSession();
  const rawBab = SETTINGS.babId || "bab6";
  const sheetName = "Nilai Bab 6";

  const payload = { 
    token: SEND_TOKEN, 
    babId: rawBab,
    sheetName: sheetName,
    nama: ssn.name || "", 
    kelas: ssn.kelas || "", 
    tanggal: ssn.date || "",
    uji: "LKPD " + rawBab.toUpperCase() + " (CHECKPOINT 1)",
    moji: lastScores.moji.correct, 
    kaiwa: lastScores.kaiwa.correct, 
    choikai: lastScores.choikai.correct, 
    dokkai: lastScores.dokkai.correct,
    rawJFT: lastScores.rawJFT, 
    totalJFT: lastScores.totalJFT, 
    ujianBabNilai: round1(lastScores.ujianBabNilai),
    kanjiBenar: lastScores.kanji.correct, 
    kanjiNilai: round1(lastScores.kanjiNilai),
    kosakataBenar: lastScores.kosakataCorrect, 
    kosakataNilai: round1(lastScores.kosakataNilai),
    trSum: lastScores.trSum, 
    trMax: lastScores.trMax, 
    terjemahanNilai: round1(lastScores.terjemahanNilai),
    finalNilai: round1(lastScores.finalNilai), 
    jftLikeScale: round1(lastScores.jftLikeScale),
    status: lastScores.statusText, 
    weaknesses: lastWeaknesses.join(", "),
    jawabanKosakata: JSON.stringify(jawabanKosakata),
    jawabanTerjemahan: JSON.stringify(jawabanTerjemahan)
  };

  const btn = document.getElementById("btnKirim");
  if (btn) { btn.disabled = true; btn.textContent = "Mengirim…"; }
  setKirimMsg("");

  const baseUrl = SHEET_WEB_APP_URL.split('?')[0];
  const queryString = new URLSearchParams(payload).toString();
  const fullUrl = `${baseUrl}?${queryString}`;

  
  // === SINKRONISASI KE LMS INTERNAL (/api/lkpd) ===
  try {
    const babNum = Number(String(rawBab).replace(/\D/g, '')) || 1;
    fetch("/api/lkpd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentName: ssn.name || "Peserta Didik",
        chapter: babNum,
        score: Math.round(Number(lastScores.finalNilai || 0)),
        answersJson: {
          kelas: ssn.kelas || "A2.2",
          tanggal: ssn.date || "",
          uji: payload.uji,
          rawJFT: lastScores.rawJFT,
          totalJFT: lastScores.totalJFT,
          jftLikeScale: round1(lastScores.jftLikeScale),
          finalNilai: round1(lastScores.finalNilai),
          status: lastScores.statusText,
          weaknesses: lastWeaknesses,
          breakdown: {
            moji: lastScores.moji,
            kaiwa: lastScores.kaiwa,
            choikai: lastScores.choikai,
            dokkai: lastScores.dokkai,
            kanji: lastScores.kanji,
            kosakataBenar: lastScores.kosakataCorrect,
            trSum: lastScores.trSum
          },
          jawabanKosakata: jawabanKosakata,
          jawabanTerjemahan: jawabanTerjemahan
        }
      })
    })
    .then(r => r.json())
    .then(resData => {
      console.log("LKPD berhasil tersimpan di LMS Database:", resData);
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({
          type: "LKPD_SUBMISSION_SUCCESS",
          student: ssn.name || "Peserta Didik",
          chapter: babNum,
          score: Math.round(Number(lastScores.finalNilai || 0))
        }, "*");
      }
    })
    .catch(err => {
      console.warn("Gagal sinkronisasi ke /api/lkpd:", err);
    });
  } catch(e) {
    console.warn("LMS sync error:", e);
  }

  fetch(fullUrl, { method: "GET", mode: "no-cors" })
    .then(function () {
      setKirimMsg("ok");
    })
    .catch(function () {
      setKirimMsg("err");
    })
    .finally(function () {
      if (btn) { btn.disabled = false; btn.textContent = "Kirim Nilai ke Guru"; }
    });
}

/* ================= AUDIO ================= */
function safeAudioSrc(path){ if(!path)return""; const i=path.lastIndexOf("/"); const dir=i>=0?path.slice(0,i+1):""; const name=i>=0?path.slice(i+1):path; return dir+encodeURIComponent(name); }
function stopCurrentAudio(){ if(currentAudio){currentAudio.onended=null;currentAudio.onerror=null;currentAudio.pause();currentAudio.currentTime=0;currentAudio=null;} if("speechSynthesis"in window)window.speechSynthesis.cancel(); if(currentButton&&currentButton.dataset.originalLabel)currentButton.textContent=currentButton.dataset.originalLabel; currentButton=null; }
function playItemAudio(id,btn){
  const item=findItemById(id);
  if(!item){alert("Soal tidak ditemukan.");return;}
  stopCurrentAudio();
  const times=Number(btn.dataset.times||LISTENING_PLAY_COUNT||2);
  btn.dataset.originalLabel=btn.dataset.originalLabel||btn.textContent;
  currentButton=btn;
  if(item.audioUrl){
    const audio=document.getElementById("audio-"+id);
    if(!audio){alert("Elemen audio tidak ditemukan.");return;}
    currentAudio=audio;
    btn.textContent="Memutar…";
    let played=0;
    audio.onended=function(){ played++; if(played<times){audio.currentTime=0; const pr=audio.play(); if(pr&&pr.catch)pr.catch(onPlayErr);} else stopCurrentAudio(); };
    audio.onerror=function(){
      console.error("Audio error:",item.audioUrl);
      if(!audio.dataset.retried){
        audio.dataset.retried="1";
        audio.src = (audio.src && audio.src.indexOf("%5B") !== -1) ? item.audioUrl : safeAudioSrc(item.audioUrl);
        const retryPr = audio.play();
        if(retryPr && retryPr.catch) retryPr.catch(function(e){
          console.warn("Retry failed:", e);
          if(item.script) playTts(item.script, btn, times);
          else { alert("File audio tidak ditemukan/format tidak didukung:\n"+item.audioUrl); stopCurrentAudio(); }
        });
        return;
      }
      if(item.script) playTts(item.script,btn,times);
      else { alert("File audio tidak ditemukan/format tidak didukung:\n"+item.audioUrl); stopCurrentAudio(); }
    };
    audio.currentTime=0;
    const pr=audio.play();
    if(pr&&pr.catch)pr.catch(onPlayErr);
  } else if(item.script)playTts(item.script,btn,times);
  else alert("Audio dan naskah tidak tersedia untuk soal ini.");
}
function onPlayErr(err){ console.error(err); alert("Browser memblokir pemutaran audio. Klik tombol sekali lagi."); stopCurrentAudio(); }
function playTts(text,btn,times){
  if(!("speechSynthesis"in window)){alert("Browser tidak mendukung text-to-speech.");stopCurrentAudio();return;}
  window.speechSynthesis.cancel();
  btn.dataset.originalLabel=btn.dataset.originalLabel||btn.textContent;
  btn.textContent="Memutar…";
  currentButton=btn;
  let played=0;
  const u=new SpeechSynthesisUtterance(text);
  u.lang="ja-JP"; u.rate=0.9;
  const voices=window.speechSynthesis.getVoices();
  let jv=null;
  for(let i=0;i<voices.length;i++) if(voices[i].lang&&voices[i].lang.toLowerCase().indexOf("ja")===0){jv=voices[i];break;}
  if(jv)u.voice=jv;
  u.onend=function(){played++; if(played<times)window.speechSynthesis.speak(u); else stopCurrentAudio();};
  u.onerror=function(){alert("TTS gagal diputar.");stopCurrentAudio();};
  window.speechSynthesis.speak(u);
}

/* ================= RADIO SELECTION INTERACTIVE STATE ================= */
function updateRadioSelection(radioEl) {
  if (!radioEl || !radioEl.name) return;
  document.querySelectorAll('input[type="radio"][name="' + radioEl.name + '"]').forEach(function(r) {
    const lbl = r.closest('label');
    if (lbl) {
      if (r.checked) lbl.classList.add('selected');
      else lbl.classList.remove('selected');
    }
  });
}

function syncAllRadioSelectedStates() {
  document.querySelectorAll('input[type="radio"]').forEach(function(r) {
    const lbl = r.closest('label');
    if (lbl) {
      if (r.checked) lbl.classList.add('selected');
      else lbl.classList.remove('selected');
    }
  });
}

if (!window.__radioSelectionListenerAttached) {
  window.__radioSelectionListenerAttached = true;
  document.addEventListener('change', function(e) {
    if (e.target && e.target.type === 'radio') {
      updateRadioSelection(e.target);
    }
  });
}

/* ================= START & THEME SYNC ================= */
document.addEventListener("DOMContentLoaded",init);
if("speechSynthesis"in window)window.speechSynthesis.onvoiceschanged=function(){};

// Penanganan Cetak
window.addEventListener("beforeprint", function(){
  if(!currentRole){
    const ssn = getSession();
    const s = {
      role: ssn.role || "student",
      name: ssn.name || "................................................",
      kelas: ssn.kelas || "................",
      date: ssn.date || new Date().toISOString().slice(0, 10)
    };
    showApp(s);
  }
});

// Sync theme from parent JP10 Portal
window.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'JP10_THEME_SYNC') {
    document.body.classList.remove('theme-sakura', 'theme-ocean', 'theme-cyber', 'theme-clay-apple');
    if (e.data.theme) document.body.classList.add('theme-' + e.data.theme);
    if (e.data.isDark) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }
});

// Request initial theme from parent portal
try {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: 'JP10_REQUEST_THEME' }, '*');
  }
} catch(e) {}
