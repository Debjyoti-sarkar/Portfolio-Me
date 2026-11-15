// Renders HD project media (covers, gallery frames, architecture diagrams) to JPEG.
// Usage: node scripts/media/compose-project-media.mjs <shotsDir> <outDir>
// shotsDir holds raw screenshots (hm-*.png, hearme-root.png, wf-*.png) captured from the real apps.
import { chromium } from "@playwright/test";
import { mkdirSync, readFileSync } from "node:fs";

const [shots, out] = process.argv.slice(2);
const img = (f) => `data:image/png;base64,${readFileSync(`${shots}/${f}`).toString("base64")}`;

const base = `
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:"Inter","Helvetica Neue","DejaVu Sans",Arial,sans-serif;color:#f5f5f4;-webkit-font-smoothing:antialiased}
.stage{position:relative;overflow:hidden;width:100vw;height:100vh;background:#0c0a09}
.dots{position:absolute;inset:0;background-image:radial-gradient(#2b2623 1.2px,transparent 1.2px);background-size:28px 28px;opacity:.9}
.glow{position:absolute;border-radius:50%;filter:blur(90px);opacity:.55}
`;

// ---------- architecture diagrams ----------
function diagram({ eyebrow, title, rows, foot }) {
  const node = (n) =>
    `<div class="node${n.accent ? " acc" : ""}"><div class="nt">${n.t}</div>${n.s ? `<div class="ns">${n.s}</div>` : ""}</div>`;
  const row = (r) =>
    `<div class="row">${r.map((n, i) => (i ? `<div class="arrow">${n.edge ? `<span>${n.edge}</span>` : ""}</div>` : "") + node(n)).join("")}</div>`;
  return `<style>${base}
  .wrap{position:relative;height:100%;display:flex;flex-direction:column;justify-content:center;padding:70px 90px;gap:26px}
  .eb{font:600 15px/1 ui-monospace,"DejaVu Sans Mono",monospace;letter-spacing:.22em;text-transform:uppercase;color:#fb923c}
  h1{font-size:46px;font-weight:700;letter-spacing:-.02em;margin-top:12px}
  .rows{display:flex;flex-direction:column;gap:30px;margin-top:22px}
  .row{display:flex;align-items:stretch;gap:0}
  .node{flex:1;min-width:0;background:linear-gradient(180deg,#1b1815,#141210);border:1.5px solid #3a3532;border-radius:18px;padding:20px 22px;box-shadow:0 18px 40px -20px #000}
  .node.acc{border-color:#fb923c;box-shadow:0 0 0 4px rgba(251,146,60,.12),0 18px 40px -20px #000}
  .nt{font-size:21px;font-weight:650;line-height:1.25}
  .ns{margin-top:8px;font-size:15.5px;line-height:1.45;color:#b5aea8}
  .arrow{flex:0 0 74px;position:relative;display:flex;align-items:center;justify-content:center}
  .arrow:before{content:"";position:absolute;left:8px;right:14px;top:50%;height:2px;background:#fb923c}
  .arrow:after{content:"";position:absolute;right:6px;top:50%;margin-top:-7px;border:7px solid transparent;border-left:11px solid #fb923c}
  .arrow span{position:relative;top:-22px;font:500 12px/1.2 ui-monospace,monospace;color:#fdba74;text-align:center;max-width:70px}
  .foot{margin-top:18px;font:500 14px/1.4 ui-monospace,monospace;color:#8c847e}
  </style>
  <div class="stage"><div class="dots"></div>
  <div class="glow" style="width:520px;height:520px;right:-120px;top:-160px;background:#7c2d12"></div>
  <div class="glow" style="width:420px;height:420px;left:-140px;bottom:-200px;background:#431407"></div>
  <div class="wrap"><div><div class="eb">${eyebrow}</div><h1>${title}</h1></div>
  <div class="rows">${rows.map(row).join("")}</div>${foot ? `<div class="foot">${foot}</div>` : ""}</div></div>`;
}

const diagrams = {
  hearme: {
    eyebrow: "HearMe · architecture",
    title: "Detect on-device, upload evidence only when it matters",
    rows: [
      [
        {
          t: "NeuroBand wearable",
          s: "Nordic nRF52 · Zephyr firmware<br>1 Hz BioFrame: HR, HRV, SpO₂, GSR, motion, tamper",
        },
        {
          t: "HearMe app",
          s: "Expo / React Native · sensor-fusion threat score 0–100 · voice SOS (Whisper/Vosk)",
          accent: true,
          edge: "BLE 5.0",
        },
        {
          t: "Supabase + Algorand",
          s: "Auth · Postgres + RLS · Storage evidence locker · evidence hashes anchored on Algorand",
          edge: "on event",
        },
      ],
      [
        { t: "SOS triggers", s: "Voice phrase · triple-tap · duress PIN · silent tap on the band" },
        { t: "Trusted contacts", s: "SMS with live GPS location", accent: true, edge: "alert" },
        { t: "Alert history", s: "Chronological log of every triggered event", edge: "log" },
      ],
    ],
    foot: "Source: HearMe README · résumé. Diagram, not a screenshot.",
  },
  "wishflow-ai": {
    eyebrow: "WishFlow AI · architecture",
    title: "An agent that remembers, writes and delivers",
    rows: [
      [
        { t: "Google Calendar", s: "Birthday events imported via calendar sync" },
        { t: "Next.js dashboard", s: "React · TypeScript · Zustand · TanStack Query", accent: true, edge: "sync" },
        { t: "API layer", s: "Mock mode or FastAPI backend contract", edge: "REST" },
      ],
      [
        { t: "AI message agent", s: "3 drafts per contact · tone & relationship aware" },
        { t: "Approval queue", s: "Approve, edit or regenerate before sending", edge: "drafts" },
        { t: "Delivery", s: "Email · Telegram · WhatsApp · history & retries", edge: "send" },
      ],
    ],
    foot: "Source: WishFlowAI README · app code. Dockerised for dev and production. Diagram, not a screenshot.",
  },
  "secure-rural-banking": {
    eyebrow: "Secure Rural Banking · SIH 2025 finalist",
    title: "Layered security behind simple banking flows",
    rows: [
      [
        { t: "React Native app", s: "Android · workflows for low digital literacy" },
        { t: "Authentication", s: "OTP challenge–response · role-based access control", accent: true, edge: "login" },
        { t: "Firebase + MongoDB", s: "Auth and application data", edge: "verified" },
      ],
      [
        { t: "Incoming link / transaction", s: "Every URL and payment is screened" },
        {
          t: "Phishing + anomaly checks",
          s: "OpenAI API URL classifier (under 100 ms) · real-time transaction anomaly detection",
          accent: true,
          edge: "screen",
        },
      ],
    ],
    foot: "Source: résumé. Diagram, not a screenshot.",
  },
  beyondsilence: {
    eyebrow: "BeyondSilence · pipeline",
    title: "Word-level Indian Sign Language recognition",
    rows: [
      [
        { t: "Video clip", s: "2–3 s from camera, file or web app" },
        { t: "45 frames", s: "Sampled evenly so no motion is lost", edge: "sample" },
        { t: "MediaPipe keypoints", s: "Body, left hand and right hand per frame", accent: true, edge: "pose" },
      ],
      [
        { t: "NumPy sequence", s: "45 frames × keypoint coordinates" },
        { t: "LSTM model", s: "Learns the temporal dynamics of the sign", accent: true, edge: "sequence" },
        { t: "Predicted word", s: "“Hello” · “How are you” · “Thank you”", edge: "classify" },
      ],
    ],
    foot: "Source: BeyondSilence README (builds on Sooryak12/ISL_Recognition). Diagram, not a screenshot.",
  },
  "nexavault-kavach": {
    eyebrow: "NexaVault (KAVACH) · architecture",
    title: "Full-stack UPI banking with ML fraud detection",
    rows: [
      [
        { t: "Mobile app (Expo)", s: "Screens · services · contexts · 22-language voice assistant" },
        {
          t: "Express REST API",
          s: "12 route handlers · 8 services · auth & validation middleware",
          accent: true,
          edge: "Axios / HTTP",
        },
        { t: "MongoDB", s: "8 Mongoose models", edge: "Mongoose" },
      ],
      [
        { t: "SMS / OTP / transaction", s: "Monitored in real time with risk scoring" },
        {
          t: "ML fraud API",
          s: "Hugging Face BERT · OTP, transaction and spam analysis",
          accent: true,
          edge: "analyse",
        },
        { t: "Risk verdict", s: "Critical · High · Medium · Low · Safe, with recommended action", edge: "score" },
      ],
    ],
    foot: "Source: KAVACH & NexaVault READMEs · résumé. Diagram, not a screenshot.",
  },
  "wifi-robot-car": {
    eyebrow: "Wi-Fi Controlled Robot Car",
    title: "Drive a robot from any browser on the network",
    rows: [
      [
        { t: "Browser control UI", s: "HTML · CSS · AJAX commands" },
        { t: "ESP8266", s: "Hosts the web interface and parses commands", accent: true, edge: "Wi-Fi · HTTP" },
        { t: "L298N driver", s: "Dual H-bridge motor control", edge: "GPIO / PWM" },
        { t: "DC motors", s: "Forward · reverse · turn", edge: "" },
      ],
    ],
    foot: "Source: résumé · v1 portfolio. Diagram, not a photo.",
  },
  "iot-smart-light": {
    eyebrow: "IoT Smart Light Control",
    title: "Lights you can schedule and recolour from your phone",
    rows: [
      [
        { t: "Smartphone app", s: "On/off · timers · colour picker" },
        { t: "Wi-Fi module", s: "Bridges the phone to the board", edge: "Wi-Fi" },
        { t: "Arduino Uno", s: "Timer logic and colour control", accent: true, edge: "serial" },
        { t: "RGB lights", s: "Remote on/off and colour changes", edge: "PWM" },
      ],
    ],
    foot: "Source: résumé · v1 portfolio. Diagram, not a photo.",
  },
};

// ---------- real-screenshot compositions ----------
const phone = (src, w) =>
  `<div style="width:${w}px;aspect-ratio:1236/2517;border-radius:${w * 0.13}px;padding:${w * 0.035}px;background:linear-gradient(160deg,#3b3446,#141019);box-shadow:0 40px 80px -30px #000,0 0 0 2px #2a2433"><img src="${src}" style="width:100%;height:100%;object-fit:cover;border-radius:${w * 0.1}px;display:block"></div>`;

const hearmeBg = `<div class="stage" style="background:radial-gradient(1200px 700px at 30% 0%,#3b1a78,#0f0820 60%,#07040f)"><div class="dots" style="opacity:.25"></div>`;

const hearmeCover = `<style>${base}</style>${hearmeBg}
<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:56px;transform:translateY(40px)">
<div style="transform:translateY(60px) rotate(-6deg)">${phone(img("hm-language.png"), 330)}</div>
<div>${phone(img("hearme-root.png"), 380)}</div>
<div style="transform:translateY(60px) rotate(6deg)">${phone(img("hm-disguise.png"), 330)}</div></div></div>`;

const hearmeFrame = (f) => `<style>${base}</style>${hearmeBg}
<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${phone(img(f), 470)}</div></div>`;

const browser = (src) => `<style>${base}</style>
<div class="stage" style="background:radial-gradient(1000px 600px at 70% 0%,#3a1466,#090b18 65%)"><div class="dots" style="opacity:.25"></div>
<div style="position:absolute;inset:70px 80px;border-radius:22px;overflow:hidden;background:#0b1020;box-shadow:0 40px 90px -30px #000,0 0 0 1.5px #262b45">
<div style="height:46px;display:flex;align-items:center;gap:9px;padding:0 18px;background:#121733;border-bottom:1px solid #262b45">
<i style="width:13px;height:13px;border-radius:50%;background:#ff5f57"></i><i style="width:13px;height:13px;border-radius:50%;background:#febc2e"></i><i style="width:13px;height:13px;border-radius:50%;background:#28c840"></i>
<span style="margin-left:18px;font:500 15px ui-monospace,monospace;color:#8a90b5">WishFlow AI</span></div>
<img src="${src}" style="width:100%;height:calc(100% - 46px);object-fit:cover;object-position:top;display:block"></div></div>`;

// ---------- render ----------
const jobs = [];
const COVER = { width: 1600, height: 900 };
const FRAME = { width: 1600, height: 1200 };
for (const [slug, d] of Object.entries(diagrams)) {
  const isCover = !["hearme", "wishflow-ai"].includes(slug);
  if (isCover) jobs.push([slug, "cover.jpg", diagram(d), COVER]);
  jobs.push([slug, "architecture.jpg", diagram(d), FRAME]);
}
jobs.push(["hearme", "cover.jpg", hearmeCover, COVER]);
for (const [f, n] of [
  ["hearme-root.png", "onboarding"],
  ["hm-login.png", "sign-in"],
  ["hm-language.png", "language"],
  ["hm-disguise.png", "disguise"],
  ["hm-lock.png", "pin-lock"],
])
  jobs.push(["hearme", `screen-${n}.jpg`, hearmeFrame(f), FRAME]);
jobs.push([
  "wishflow-ai",
  "cover.jpg",
  `<style>${base}</style><img src="${img("wf-hero.png")}" style="width:100vw;height:100vh;object-fit:cover;display:block">`,
  COVER,
]);
for (const n of ["hero", "tour", "features", "timeline", "integrations"])
  jobs.push(["wishflow-ai", `screen-${n}.jpg`, browser(img(`wf-${n}.png`)), FRAME]);

const b = await chromium.launch();
for (const [slug, file, html, vp] of jobs) {
  mkdirSync(`${out}/${slug}`, { recursive: true });
  const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 1.5 });
  const p = await ctx.newPage();
  await p.setContent(`<!doctype html><html><body>${html}</body></html>`, { waitUntil: "load" });
  await p.waitForTimeout(150);
  await p.screenshot({ path: `${out}/${slug}/${file}`, type: "jpeg", quality: 88 });
  await ctx.close();
}
await b.close();
console.log(`rendered ${jobs.length} images`);
