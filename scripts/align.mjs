// Align a reel's script to its voiceover using detected pauses (no transcription service needed).
// Usage: node --experimental-strip-types scripts/align.mjs reel01
// Reads public/<reel>/voice.mp3 + the PHRASES in src/reel/data.ts, writes public/<reel>/words.json.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import { PHRASES } from "../src/reel/data.ts";

const reel = process.argv[2] ?? "reel01";
const audio = `public/${reel}/voice.mp3`;
const run = (args) => execFileSync("ffmpeg", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
const probe = execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", audio], { encoding: "utf8" });
const total = parseFloat(probe);

let log = "";
try {
  run(["-hide_banner", "-i", audio, "-af", "silencedetect=noise=-38dB:d=0.14", "-f", "null", "-"]);
} catch (e) {
  log = e.stderr;
}
log ||= execFileSync("sh", ["-c", `ffmpeg -hide_banner -i "${audio}" -af silencedetect=noise=-38dB:d=0.14 -f null - 2>&1`], { encoding: "utf8" });
const starts = [...log.matchAll(/silence_start: ([\d.]+)/g)].map((m) => +m[1]);
const ends = [...log.matchAll(/silence_end: ([\d.]+)/g)].map((m) => +m[1]);
let sil = starts.map((s, i) => ({ s, e: ends[i] ?? total }));

// merge touching silences; peel off leading/trailing silence
sil = sil.reduce((acc, g) => {
  const last = acc[acc.length - 1];
  if (last && g.s - last.e < 0.05) last.e = g.e;
  else acc.push({ ...g });
  return acc;
}, []);
let s0 = 0;
let s1 = total;
if (sil.length && sil[0].s < 0.05) s0 = sil.shift().e;
if (sil.length && sil[sil.length - 1].e > total - 0.05) s1 = sil.pop().s;

const toks = (s) => s.replace(/-/g, " ").split(/\s+/).map((w) => w.replace(/[^A-Za-z0-9]/g, "")).filter(Boolean);
const weight = (s) => toks(s).reduce((a, w) => a + w.length + 2, 0);
const W = PHRASES.map((p) => weight(p.say));
const sumW = W.reduce((a, b) => a + b, 0);

// expected boundary after each phrase (except last), proportional to text length
const exp = [];
let acc = 0;
for (let i = 0; i < W.length - 1; i++) {
  acc += W[i];
  exp.push(s0 + ((s1 - s0) * acc) / sumW);
}

// DP: assign each boundary to a distinct gap, in order; prefer close + long gaps
const K = exp.length;
const G = sil.length;
const cost = (k, g) => Math.abs(exp[k] - (sil[g].s + sil[g].e) / 2) - 3 * (sil[g].e - sil[g].s);
const INF = 1e9;
const dp = Array.from({ length: K }, () => new Array(G).fill(INF));
const from = Array.from({ length: K }, () => new Array(G).fill(-1));
for (let g = 0; g < G; g++) dp[0][g] = cost(0, g);
for (let k = 1; k < K; k++) {
  let best = INF;
  let bi = -1;
  for (let g = 0; g < G; g++) {
    if (g > 0 && dp[k - 1][g - 1] < best) {
      best = dp[k - 1][g - 1];
      bi = g - 1;
    }
    if (bi >= 0) {
      dp[k][g] = best + cost(k, g);
      from[k][g] = bi;
    }
  }
}
let g = dp[K - 1].indexOf(Math.min(...dp[K - 1]));
const pick = new Array(K);
for (let k = K - 1; k >= 0; k--) {
  pick[k] = g;
  g = from[k][g];
}

// optional manual fixes: public/<reel>/align-overrides.json = { "<phrase number>": <pause start time in seconds> }
const ovPath = `public/${reel}/align-overrides.json`;
if (fs.existsSync(ovPath)) {
  const ov = JSON.parse(fs.readFileSync(ovPath, "utf8"));
  for (const [num, t] of Object.entries(ov)) {
    const k = +num - 1;
    const gi = sil.reduce((bi, x, i) => (Math.abs(x.s - t) < Math.abs(sil[bi].s - t) ? i : bi), 0);
    pick[k] = gi;
  }
}

// phrase spans, then words spread by length over the speech inside each span (skipping inner pauses)
const words = [];
PHRASES.forEach((p, i) => {
  const a = i === 0 ? s0 : sil[pick[i - 1]].e;
  const b = i === PHRASES.length - 1 ? s1 : sil[pick[i]].s;
  const inner = sil.filter((x) => x.s > a && x.e < b);
  const speech = [];
  let c = a;
  for (const x of inner) {
    speech.push([c, x.s]);
    c = x.e;
  }
  speech.push([c, b]);
  const speechLen = speech.reduce((t, [u, v]) => t + v - u, 0);
  const at = (frac) => {
    let rem = frac * speechLen;
    for (const [u, v] of speech) {
      if (rem <= v - u) return u + rem;
      rem -= v - u;
    }
    return b;
  };
  const ws = toks(p.say);
  const wsum = ws.reduce((t, w) => t + w.length + 1, 0);
  let cum = 0;
  for (const w of ws) {
    const st = at(cum / wsum);
    cum += w.length + 1;
    words.push({ text: w, start: +st.toFixed(3), end: +at(cum / wsum).toFixed(3) });
  }
  console.log(`${String(i + 1).padStart(2)} ${a.toFixed(2)}–${b.toFixed(2)}  ${p.say}`);
});
fs.writeFileSync(`public/${reel}/words.json`, JSON.stringify(words, null, 1));
console.log(`Wrote public/${reel}/words.json (${words.length} words, speech ${s0.toFixed(2)}–${s1.toFixed(2)}s of ${total.toFixed(2)}s)`);
