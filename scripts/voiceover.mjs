// Generate a reel voiceover with ElevenLabs and write word timings for the captions.
// Usage: ELEVENLABS_API_KEY=... node scripts/voiceover.mjs reel01 [voiceId]
// Reads  public/<reel>/script.txt
// Writes public/<reel>/voice.mp3 and public/<reel>/words.json ([{text,start,end}])
import fs from "node:fs";
import path from "node:path";

const reel = process.argv[2] ?? "reel01";
const voiceId = process.argv[3] ?? process.env.ELEVENLABS_VOICE_ID ?? "TX3LPaxmHKxFdv7VOQHJ"; // Liam
const model = process.env.ELEVENLABS_MODEL ?? "eleven_v3";
const key = process.env.ELEVENLABS_API_KEY;
if (!key) {
  console.error("ELEVENLABS_API_KEY is not set (add it in the environment settings).");
  process.exit(1);
}

const dir = path.join("public", reel);
let text = fs.readFileSync(path.join(dir, "script.txt"), "utf8").trim();
// Audio tags like [excited] only work on v3+; strip them for older models so they aren't read aloud.
if (!/^eleven_v[3-9]/.test(model)) text = text.replace(/\[[^\]]*\]\s*/g, "");

const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps?output_format=mp3_44100_128`, {
  method: "POST",
  headers: { "xi-api-key": key, "Content-Type": "application/json" },
  body: JSON.stringify({ text, model_id: model }),
});
if (!res.ok) {
  console.error(`ElevenLabs error ${res.status}: ${await res.text()}`);
  process.exit(1);
}
const data = await res.json();
fs.writeFileSync(path.join(dir, "voice.mp3"), Buffer.from(data.audio_base64, "base64"));

// Characters -> words, skipping [audio tags].
const a = data.normalized_alignment ?? data.alignment;
const words = [];
let cur = null;
let inTag = false;
a.characters.forEach((ch, i) => {
  if (ch === "[") inTag = true;
  if (inTag) {
    if (ch === "]") inTag = false;
    return;
  }
  if (/\s/.test(ch)) {
    if (cur) words.push(cur);
    cur = null;
    return;
  }
  const s = a.character_start_times_seconds[i];
  const e = a.character_end_times_seconds[i];
  if (!cur) cur = { text: ch, start: s, end: e };
  else {
    cur.text += ch;
    cur.end = e;
  }
});
if (cur) words.push(cur);
fs.writeFileSync(path.join(dir, "words.json"), JSON.stringify(words.filter((w) => /[a-z0-9]/i.test(w.text)), null, 1));
console.log(`Wrote ${dir}/voice.mp3 and ${dir}/words.json (${words.length} words, ends at ${words.at(-1)?.end.toFixed(2)}s)`);
