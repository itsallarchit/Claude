import { PHRASES, SceneId } from "./data";

export type Word = { text: string; start: number; end: number };
export type TimedPhrase = { index: number; scene: SceneId; show: string; start: number; end: number };
export type TimedScene = { scene: SceneId; start: number; end: number };

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

const tokens = (s: string) =>
  s
    .replace(/-/g, " ")
    .split(/\s+/)
    .map(norm)
    .filter(Boolean);

// Fallback when there is no transcript yet: ~2.9 words/sec with short pauses.
const estimate = (): Word[] => {
  const out: Word[] = [];
  let t = 0.25;
  for (const p of PHRASES) {
    for (const w of tokens(p.say)) {
      const d = 0.2 + w.length * 0.035;
      out.push({ text: w, start: t, end: t + d });
      t += d + 0.03;
    }
    t += 0.22;
  }
  return out;
};

// Align each phrase to transcript words by walking both sequences in order.
export const buildTimeline = (words: Word[] | null, totalSec: number) => {
  const src = (words && words.length ? words : estimate())
    .map((w) => ({ ...w, n: norm(w.text) }))
    .flatMap((w) => {
      // split hyphenated transcript words so they line up with tokens()
      const parts = w.text.split("-").map(norm).filter(Boolean);
      if (parts.length <= 1) return [w];
      const d = (w.end - w.start) / parts.length;
      return parts.map((p, i) => ({ text: p, n: p, start: w.start + i * d, end: w.start + (i + 1) * d }));
    })
    .filter((w) => w.n);

  let cursor = 0;
  const phrases: TimedPhrase[] = PHRASES.map((p, index) => {
    const toks = tokens(p.say);
    let first = -1;
    let last = -1;
    for (const tk of toks) {
      // look a few words ahead for a match, tolerating transcript differences
      let found = -1;
      for (let j = cursor; j < Math.min(src.length, cursor + 6); j++) {
        if (src[j].n === tk) {
          found = j;
          break;
        }
      }
      if (found === -1) continue;
      if (first === -1) first = found;
      last = found;
      cursor = found + 1;
    }
    if (first === -1) {
      first = Math.min(cursor, src.length - 1);
      last = Math.min(cursor + toks.length - 1, src.length - 1);
      cursor = last + 1;
    }
    return { index, scene: p.scene, show: p.show, start: src[first].start, end: src[last].end };
  });

  const scenes: TimedScene[] = [];
  phrases.forEach((p, i) => {
    const start = i === 0 ? 0 : p.start - 0.12;
    if (!scenes.length || scenes[scenes.length - 1].scene !== p.scene) {
      if (scenes.length) scenes[scenes.length - 1].end = start;
      scenes.push({ scene: p.scene, start, end: totalSec });
    }
  });

  const speechEnd = phrases[phrases.length - 1].end;
  return { phrases, scenes, speechEnd };
};
