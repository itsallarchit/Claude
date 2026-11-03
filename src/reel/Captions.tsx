import React from "react";
import { interpolate } from "remotion";
import { C, sans, serif } from "./theme";
import { TimedPhrase } from "./timing";

type Tok = { text: string; style: "plain" | "hl" | "serif" };

const parse = (s: string): Tok[] => {
  const out: Tok[] = [];
  const re = /\*\*(.+?)\*\*|_(.+?)_|(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    if (m[1]) m[1].split(" ").forEach((t) => out.push({ text: t, style: "hl" }));
    else if (m[2]) m[2].split(" ").forEach((t) => out.push({ text: t, style: "serif" }));
    else out.push({ text: m[3], style: "plain" });
  }
  return out;
};

const hlColor = (t: string) => (/[$\d]/.test(t) ? C.green : C.blue);

export const Captions: React.FC<{ phrase: TimedPhrase | undefined; t: number }> = ({ phrase, t }) => {
  if (!phrase) return null;
  const toks = parse(phrase.show);
  const dur = Math.max(0.3, phrase.end - phrase.start);
  const fadeOut = interpolate(t, [phrase.end + 0.05, phrase.end + 0.25], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 1230,
        left: 90,
        right: 90,
        textAlign: "center",
        fontFamily: sans,
        fontWeight: 800,
        fontSize: 64,
        lineHeight: 1.22,
        letterSpacing: -0.5,
        color: C.ink,
        opacity: fadeOut,
      }}
    >
      {toks.map((tk, i) => {
        const at = phrase.start + (dur * i) / toks.length;
        const p = interpolate(t, [at - 0.04, at + 0.12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const base: React.CSSProperties = {
          display: "inline-block",
          marginRight: 16,
          opacity: 0.18 + 0.82 * p,
          filter: `blur(${(1 - p) * 3}px)`,
          transform: `translateY(${(1 - p) * 10}px)`,
        };
        if (tk.style === "serif")
          return (
            <span key={i} style={{ ...base, fontFamily: serif, fontWeight: 400, fontSize: 76, color: C.coral }}>
              {tk.text}
            </span>
          );
        if (tk.style === "hl")
          return (
            <span key={i} style={{ ...base, color: hlColor(tk.text) }}>
              {tk.text}
            </span>
          );
        return (
          <span key={i} style={base}>
            {tk.text}
          </span>
        );
      })}
    </div>
  );
};
