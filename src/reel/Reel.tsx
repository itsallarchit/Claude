import React, { useMemo } from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Captions } from "./Captions";
import { Character } from "./Character";
import { CHAPTERS, SceneId } from "./data";
import { Brands, Cta, Hook, MathScene, Need, Price, Rights, SceneProps, What, Zero } from "./Scenes";
import { C, sans } from "./theme";
import { buildTimeline, Word } from "./timing";
import { Abs, float, pop, ramp } from "./ui";

export type ReelProps = { audio: string | null; words: Word[] | null };

const SCENES: Record<SceneId, React.FC<SceneProps>> = {
  hook: Hook,
  zero: Zero,
  what: What,
  need: Need,
  price: Price,
  math: MathScene,
  rights: Rights,
  brands: Brands,
  cta: Cta,
};

const MOOD: Partial<Record<SceneId, "smile" | "wow" | "smirk">> = {
  hook: "wow",
  zero: "smirk",
  math: "wow",
  rights: "smirk",
};

const Background: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ background: "#f6f1ec" }}>
    {[
      { c: "#ffc9ad", x: 200, y: 380, r: 520, s: 0 },
      { c: "#c9dcff", x: 900, y: 1500, r: 600, s: 2 },
      { c: "#ffe2c4", x: 880, y: 300, r: 420, s: 4 },
      { c: "#ffd3c9", x: 150, y: 1650, r: 460, s: 1 },
    ].map((b, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: b.x - b.r + Math.sin(t * 0.4 + b.s) * 60,
          top: b.y - b.r + Math.cos(t * 0.35 + b.s) * 60,
          width: b.r * 2,
          height: b.r * 2,
          borderRadius: 999,
          background: b.c,
          filter: "blur(140px)",
          opacity: 0.8,
        }}
      />
    ))}
  </AbsoluteFill>
);

const Sparkles: React.FC<{ t: number }> = ({ t }) => (
  <>
    {[
      { e: "✨", x: 150, y: 960, s: 0 },
      { e: "💰", x: 210, y: 1130, s: 1.3 },
      { e: "⭐", x: 900, y: 1110, s: 2.1 },
      { e: "🪙", x: 930, y: 930, s: 3.2 },
    ].map((p, i) => (
      <Abs key={i} x={p.x} y={p.y + float(t, p.s, 14)} rotate={Math.sin(t + p.s) * 10} opacity={0.85}>
        <span style={{ fontSize: 54 }}>{p.e}</span>
      </Abs>
    ))}
  </>
);

export const Reel: React.FC<ReelProps> = ({ audio, words }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const total = durationInFrames / fps;
  const tl = useMemo(() => buildTimeline(words, total), [words, total]);

  const phrase = tl.phrases.find((p) => t >= p.start - 0.1 && t <= p.end + 0.3);
  const speaking = tl.phrases.some((p) => t >= p.start && t <= p.end);
  const scene = tl.scenes.find((sc) => t >= sc.start && t < sc.end) ?? tl.scenes[tl.scenes.length - 1];
  const chapter = CHAPTERS[scene.scene];

  const mouth = speaking ? 0.35 + 0.65 * Math.abs(Math.sin(t * 17)) * (0.6 + 0.4 * Math.sin(t * 5.3)) : 0;
  const blink = t % 3.1 > 2.98;

  return (
    <AbsoluteFill style={{ fontFamily: sans, overflow: "hidden" }}>
      <Background t={t} />
      {audio ? <Audio src={staticFile(audio)} /> : null}

      {/* chapter pill */}
      {chapter ? (
        <Abs key={scene.scene} x={540} y={250} scale={pop(t, scene.start)}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#fff", borderRadius: 999, padding: "12px 30px 12px 12px", boxShadow: C.shadow }}>
            <div style={{ width: 50, height: 50, borderRadius: 999, background: C.blue, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800 }}>{chapter.n}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: C.ink }}>{chapter.label}</div>
          </div>
        </Abs>
      ) : null}

      {/* scene props */}
      {tl.scenes.map((sc) => {
        if (t < sc.start - 0.05 || t > sc.end + 0.25) return null;
        const S = SCENES[sc.scene];
        const exit = ramp(t, sc.end - 0.05, sc.end + 0.2, 1, 0);
        const ph = tl.phrases.filter((p) => p.scene === sc.scene);
        return (
          <AbsoluteFill key={sc.scene} style={{ opacity: exit, transform: `scale(${0.96 + 0.04 * exit})`, filter: `blur(${(1 - exit) * 8}px)` }}>
            <S t={t} s={sc.start} e={sc.end} ph={ph} />
          </AbsoluteFill>
        );
      })}

      <Sparkles t={t} />

      {/* host character */}
      <Abs x={540} y={1030 + float(t, 0.5, 6)} scale={pop(t, 0) * (1 + (speaking ? 0.012 * Math.sin(t * 9) : 0))}>
        <div style={{ width: 300, height: 300, borderRadius: 80, background: "#fff", boxShadow: C.shadow, overflow: "hidden", padding: 18, boxSizing: "border-box" }}>
          <div style={{ width: "100%", height: "100%", borderRadius: 60, background: "linear-gradient(180deg,#fff6ef,#ffe6d8)", overflow: "hidden" }}>
            <Character mouth={mouth} blink={blink} mood={MOOD[scene.scene]} />
          </div>
        </div>
      </Abs>

      <Captions phrase={phrase} t={t} />
    </AbsoluteFill>
  );
};
