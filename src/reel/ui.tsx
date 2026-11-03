import React from "react";
import { interpolate, spring } from "remotion";
import { C, sans } from "./theme";

export const FPS = 30;

// spring 0→1 starting at time `at` (seconds), given global time t
export const pop = (t: number, at: number, damping = 13) =>
  spring({ frame: Math.round((t - at) * FPS), fps: FPS, config: { damping, stiffness: 140, mass: 0.8 } });

export const ramp = (t: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(t, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const float = (t: number, seed: number, amp = 10) => Math.sin(t * 1.6 + seed) * amp;

export const Abs: React.FC<{
  x: number;
  y: number;
  children: React.ReactNode;
  scale?: number;
  rotate?: number;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({ x, y, children, scale = 1, rotate = 0, opacity = 1, style }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotate}deg)`,
      opacity,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      background: C.card,
      borderRadius: 36,
      boxShadow: C.shadow,
      fontFamily: sans,
      color: C.ink,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Pill: React.FC<{ children: React.ReactNode; bg?: string; color?: string; size?: number }> = ({
  children,
  bg = C.ink,
  color = "#fff",
  size = 30,
}) => (
  <div
    style={{
      background: bg,
      color,
      borderRadius: 999,
      padding: `${size * 0.45}px ${size * 0.9}px`,
      fontFamily: sans,
      fontWeight: 800,
      fontSize: size,
      whiteSpace: "nowrap",
      boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
    }}
  >
    {children}
  </div>
);

export const BigNumber: React.FC<{ text: string; color?: string; size?: number }> = ({
  text,
  color = C.green,
  size = 190,
}) => (
  <div
    style={{
      fontFamily: sans,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: -6,
      color,
      textShadow: `0 4px 0 ${C.greenDeep}, 0 18px 40px rgba(23,163,91,0.35)`,
      whiteSpace: "nowrap",
    }}
  >
    {text}
  </div>
);

export const Check: React.FC<{ size?: number }> = ({ size = 34 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: 999,
      background: C.green,
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: size * 0.6,
      fontWeight: 800,
    }}
  >
    ✓
  </div>
);

export const Phone: React.FC<{ children?: React.ReactNode; w?: number }> = ({ children, w = 300 }) => (
  <div
    style={{
      width: w,
      height: w * 2,
      borderRadius: w * 0.16,
      background: "#15151b",
      padding: w * 0.04,
      boxShadow: C.shadow,
    }}
  >
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: w * 0.13,
        overflow: "hidden",
        position: "relative",
        background: "linear-gradient(160deg,#ffd9c7,#f5a68c 55%,#e8573c)",
      }}
    >
      {children}
    </div>
  </div>
);
