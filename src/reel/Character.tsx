import React from "react";
import { C } from "./theme";

// "Zara": the page's original host character. Warm, confident, a little cheeky.
export const Character: React.FC<{ mouth: number; blink: boolean; mood?: "smile" | "wow" | "smirk" }> = ({
  mouth,
  blink,
  mood = "smile",
}) => {
  const open = Math.max(0, Math.min(1, mouth));
  const skin = "#c98d68";
  const hair = "#231a17";
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%">
      {/* bun */}
      <circle cx="100" cy="30" r="24" fill={hair} />
      {/* back hair */}
      <path d="M44 96 C40 46, 160 46, 156 96 L158 130 C150 120, 50 120, 42 130 Z" fill={hair} />
      {/* neck + top */}
      <rect x="86" y="140" width="28" height="26" rx="10" fill={skin} />
      <path d="M40 200 C44 162, 76 152, 100 152 C124 152, 156 162, 160 200 Z" fill={C.coral} />
      <path d="M84 153 Q100 170 116 153" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
      {/* face */}
      <ellipse cx="100" cy="100" rx="48" ry="52" fill={skin} />
      {/* ears + hoops */}
      <ellipse cx="52" cy="104" rx="7" ry="10" fill={skin} />
      <ellipse cx="148" cy="104" rx="7" ry="10" fill={skin} />
      <circle cx="51" cy="122" r="7" fill="none" stroke="#e9b949" strokeWidth="3" />
      <circle cx="149" cy="122" r="7" fill="none" stroke="#e9b949" strokeWidth="3" />
      {/* fringe */}
      <path d="M52 92 C56 52, 112 44, 146 78 C132 70, 104 68, 92 82 C84 72, 64 76, 52 92 Z" fill={hair} />
      {/* brows */}
      <path
        d={mood === "wow" ? "M68 78 Q78 70 88 77" : "M68 82 Q78 76 88 81"}
        stroke={hair}
        strokeWidth="4.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={mood === "smirk" ? "M112 76 Q122 72 132 78" : mood === "wow" ? "M112 77 Q122 70 132 78" : "M112 81 Q122 76 132 82"}
        stroke={hair}
        strokeWidth="4.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* eyes */}
      {blink ? (
        <>
          <path d="M70 98 Q78 102 86 98" stroke={hair} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M114 98 Q122 102 130 98" stroke={hair} strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="78" cy="98" rx="8.5" ry={mood === "wow" ? 11 : 10} fill="#fff" />
          <ellipse cx="122" cy="98" rx="8.5" ry={mood === "wow" ? 11 : 10} fill="#fff" />
          <circle cx="79" cy="99" r="6" fill={hair} />
          <circle cx="123" cy="99" r="6" fill={hair} />
          <circle cx="81" cy="96.5" r="2" fill="#fff" />
          <circle cx="125" cy="96.5" r="2" fill="#fff" />
        </>
      )}
      {/* cheeks */}
      <ellipse cx="68" cy="118" rx="8" ry="5" fill="#e07a6a" opacity="0.35" />
      <ellipse cx="132" cy="118" rx="8" ry="5" fill="#e07a6a" opacity="0.35" />
      {/* nose */}
      <path d="M100 104 Q96 114 101 116" stroke="#9c6347" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* mouth */}
      {open > 0.08 ? (
        <path
          d={`M86 126 Q100 ${128 + open * 16} 114 126 Q100 ${126 + open * 4} 86 126 Z`}
          fill="#5b1f1f"
          stroke="#5b1f1f"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      ) : mood === "smirk" ? (
        <path d="M88 128 Q104 134 116 122" stroke="#5b1f1f" strokeWidth="4" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M86 126 Q100 136 114 126" stroke="#5b1f1f" strokeWidth="4" fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
};
