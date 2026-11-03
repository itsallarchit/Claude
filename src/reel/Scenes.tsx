import React from "react";
import { interpolate } from "remotion";
import { CTA_WORD } from "./data";
import { C, sans, serif } from "./theme";
import { TimedPhrase } from "./timing";
import { Abs, BigNumber, Card, Check, Phone, Pill, float, pop, ramp } from "./ui";

export type SceneProps = { t: number; s: number; e: number; ph: TimedPhrase[] };

const money = (v: number) => "$" + Math.round(v).toLocaleString("en-US");

// ---------- HOOK: phone with a 30s video, then $300 counts up ----------
export const Hook: React.FC<SceneProps> = ({ t, s, ph }) => {
  const p2 = ph[1]?.start ?? s + 1.5;
  const count = interpolate(t, [p2, p2 + 1.1], [0, 300], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const phoneIn = pop(t, s);
  const numIn = pop(t, p2 - 0.1);
  const shrink = ramp(t, p2 - 0.2, p2 + 0.3);
  return (
    <>
      <Abs x={540 - 250 * shrink} y={540 + 90 * shrink + float(t, 1, 8)} scale={phoneIn * (1 - 0.35 * shrink)} rotate={-6 * shrink}>
        <Phone w={300}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 110, height: 110, borderRadius: 999, background: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 0, height: 0, borderTop: "26px solid transparent", borderBottom: "26px solid transparent", borderLeft: `40px solid ${C.coral}`, marginLeft: 10 }} />
            </div>
          </div>
          <div style={{ position: "absolute", bottom: 30, left: 24, right: 24, height: 10, borderRadius: 9, background: "rgba(255,255,255,0.4)" }}>
            <div style={{ width: `${ramp(t, s, s + 3) * 100}%`, height: "100%", borderRadius: 9, background: "#fff" }} />
          </div>
          <div style={{ position: "absolute", top: 34, right: 26 }}>
            <Pill size={24} bg="rgba(0,0,0,0.55)">0:30</Pill>
          </div>
        </Phone>
      </Abs>
      <Abs x={640} y={470} scale={numIn} opacity={numIn}>
        <BigNumber text={money(count)} />
      </Abs>
      <Abs x={700} y={640} scale={pop(t, p2 + 1.0)}>
        <Pill bg="#fff" color={C.ink} size={30}>per video 🎬</Pill>
      </Abs>
    </>
  );
};

// ---------- ZERO followers ----------
export const Zero: React.FC<SceneProps> = ({ t, s }) => {
  const a = pop(t, s);
  const strike = ramp(t, s + 0.6, s + 0.95);
  return (
    <>
      <Abs x={540} y={560 + float(t, 2, 8)} scale={a}>
        <Card style={{ padding: "44px 70px", textAlign: "center" }}>
          <div style={{ fontSize: 34, fontWeight: 700, color: "#8a8580" }}>Followers</div>
          <div style={{ position: "relative", fontSize: 170, fontWeight: 800, letterSpacing: -4, lineHeight: 1 }}>
            0
            <div style={{ position: "absolute", left: -30, right: -30, top: "52%", height: 14, borderRadius: 8, background: C.coral, transform: `scaleX(${strike}) rotate(-8deg)`, transformOrigin: "left" }} />
          </div>
        </Card>
      </Abs>
      <Abs x={830} y={420} scale={pop(t, s + 1.0)} rotate={8}>
        <Pill bg={C.coral}>Not needed</Pill>
      </Abs>
    </>
  );
};

// ---------- 1. WHAT IS UGC: you film -> brand posts ----------
export const What: React.FC<SceneProps> = ({ t, s, ph }) => {
  const film = ph[1]?.start ?? s + 1;
  const brand = ph[2]?.start ?? s + 2.5;
  return (
    <>
      <Abs x={540} y={470} scale={pop(t, s)}>
        <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 200, letterSpacing: -6, color: C.blue, textShadow: "0 4px 0 #1d47b8, 0 18px 40px rgba(47,107,255,0.3)" }}>UGC</div>
      </Abs>
      <Abs x={290} y={700 + float(t, 3, 6)} scale={pop(t, film)}>
        <Card style={{ padding: "26px 34px", textAlign: "center", width: 300 }}>
          <div style={{ fontSize: 64 }}>🤳</div>
          <div style={{ fontSize: 32, fontWeight: 800 }}>You film it</div>
        </Card>
      </Abs>
      <Abs x={540} y={700} opacity={ramp(t, brand - 0.3, brand)}>
        <div style={{ fontSize: 70, color: C.muted, fontWeight: 800 }}>→</div>
      </Abs>
      <Abs x={790} y={700 + float(t, 4, 6)} scale={pop(t, brand)}>
        <Card style={{ padding: "26px 34px", textAlign: "center", width: 300 }}>
          <div style={{ fontSize: 64 }}>📣</div>
          <div style={{ fontSize: 32, fontWeight: 800 }}>Brand runs it</div>
          <div style={{ marginTop: 10, display: "inline-block" }}>
            <Pill size={22} bg={C.blue}>Sponsored</Pill>
          </div>
        </Card>
      </Abs>
    </>
  );
};

// ---------- 2. WHAT YOU NEED: phone, light, review ----------
export const Need: React.FC<SceneProps> = ({ t, s, ph }) => {
  const list = ph[1]?.start ?? s + 1.2;
  const d = (ph[1] ? ph[1].end - ph[1].start : 2.4) / 3;
  const items = [
    { icon: "📱", label: "Your phone" },
    { icon: "💡", label: "Good light" },
    { icon: "⭐", label: "Honest review" },
  ];
  return (
    <>
      <Abs x={540} y={410} scale={pop(t, s)}>
        <Pill bg="#fff" color={C.ink} size={34}>
          <span style={{ textDecoration: "line-through", textDecorationColor: C.coral, textDecorationThickness: 5 }}>10K followers</span>
          <span style={{ marginLeft: 14 }}>❌</span>
        </Pill>
      </Abs>
      {items.map((it, i) => {
        const a = pop(t, list + i * d);
        return (
          <Abs key={i} x={220 + i * 320} y={650 + float(t, i, 8)} scale={a}>
            <Card style={{ width: 270, padding: "30px 0", textAlign: "center" }}>
              <div style={{ fontSize: 90 }}>{it.icon}</div>
              <div style={{ fontSize: 32, fontWeight: 800, marginTop: 6 }}>{it.label}</div>
              <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
                <Check />
              </div>
            </Card>
          </Abs>
        );
      })}
    </>
  );
};

// ---------- 3. WHAT TO CHARGE: price tiers ----------
export const Price: React.FC<SceneProps> = ({ t, s, ph }) => {
  const pro = ph[1]?.start ?? s + 2;
  const Tier: React.FC<{ label: string; price: string; tag: string; color: string; at: number; x: number; h: number }> = ({ label, price, tag, color, at, x, h }) => {
    const a = pop(t, at);
    return (
      <Abs x={x} y={760 - (h * a) / 2} opacity={a}>
        <div style={{ width: 360, height: h * a, borderRadius: 34, background: color, boxShadow: C.shadow, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", paddingTop: 36, color: "#fff", fontFamily: sans, overflow: "hidden" }}>
          <div style={{ fontSize: 30, fontWeight: 700, opacity: 0.9 }}>{label}</div>
          <div style={{ fontSize: 76, fontWeight: 800, letterSpacing: -2 }}>{price}</div>
          <div style={{ fontSize: 26, fontWeight: 700, opacity: 0.85 }}>{tag}</div>
        </div>
      </Abs>
    );
  };
  return (
    <>
      <Tier label="Beginner" price="$100–150" tag="per video" color="#8fb0ff" at={s + 0.2} x={330} h={300} />
      <Tier label="Portfolio" price="$300+" tag="per video" color={C.green} at={pro} x={750} h={460} />
      <Abs x={880} y={330} scale={pop(t, pro + 0.5)} rotate={10}>
        <Pill bg={C.coral}>2–3X more</Pill>
      </Abs>
    </>
  );
};

// ---------- 4. THE MATH ----------
export const MathScene: React.FC<SceneProps> = ({ t, s, ph }) => {
  const p = ph[0];
  const len = p ? p.end - p.start : 4;
  const resultAt = s + len * 0.62;
  const total = interpolate(t, [resultAt, resultAt + 1], [0, 2400], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <>
      <Abs x={540} y={420} scale={pop(t, s)}>
        <Card style={{ padding: "26px 34px", display: "flex", gap: 14 }}>
          {days.map((d, i) => {
            const on = i === 1 || i === 4;
            const a = on ? pop(t, s + 0.6 + (i === 4 ? 0.4 : 0)) : 0;
            return (
              <div key={d} style={{ width: 90, textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#8a8580" }}>{d}</div>
                <div style={{ height: 84, marginTop: 8, borderRadius: 20, background: on ? C.green : "#f1eeea", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, transform: `scale(${on ? 0.6 + 0.4 * a : 1})` }}>{on ? "🎬" : ""}</div>
                {on && <div style={{ fontSize: 24, fontWeight: 800, color: C.green, marginTop: 6, opacity: a }}>$300</div>}
              </div>
            );
          })}
        </Card>
      </Abs>
      <Abs x={540} y={700} scale={pop(t, resultAt - 0.1)}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <BigNumber text={money(total)} size={170} />
          <span style={{ fontFamily: serif, fontStyle: "italic", fontSize: 70, color: C.coral }}>/month</span>
        </div>
      </Abs>
    </>
  );
};

// ---------- 5. USAGE RIGHTS: 2X ----------
export const Rights: React.FC<SceneProps> = ({ t, s, ph }) => {
  const dbl = ph[1]?.start ?? s + 1.6;
  return (
    <>
      <Abs x={460} y={580 + float(t, 5, 8)} scale={pop(t, s)} rotate={-4}>
        <Card style={{ width: 460, padding: 30 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: C.blue, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, fontWeight: 800 }}>B</div>
            <div>
              <div style={{ fontSize: 30, fontWeight: 800 }}>Brand Co.</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#8a8580" }}>Sponsored · Paid ad</div>
            </div>
          </div>
          <div style={{ marginTop: 20, height: 240, borderRadius: 24, background: "linear-gradient(160deg,#ffd9c7,#f5a68c)" }} />
          <div style={{ marginTop: 18, height: 54, borderRadius: 16, background: C.blue, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 800 }}>Shop now</div>
        </Card>
      </Abs>
      <Abs x={790} y={420} scale={pop(t, dbl, 9)} rotate={12}>
        <div style={{ background: C.coral, color: "#fff", fontFamily: sans, fontWeight: 800, fontSize: 120, padding: "6px 40px", borderRadius: 30, boxShadow: C.shadow }}>2X</div>
      </Abs>
      <Abs x={800} y={590} scale={pop(t, dbl + 0.4)}>
        <Pill bg="#fff" color={C.ink} size={28}>Usage rights 📄</Pill>
      </Abs>
    </>
  );
};

// ---------- 6. WHO'S HIRING: categories + gig list ----------
export const Brands: React.FC<SceneProps> = ({ t, s, ph }) => {
  const gigs = ph[1]?.start ?? s + 1.4;
  const cats = [
    { i: "🧴", l: "Skincare" },
    { i: "📲", l: "Apps" },
    { i: "☕", l: "Coffee" },
  ];
  const d = (ph[0] ? ph[0].end - ph[0].start : 1.5) / 3;
  const rows = [
    { b: "Glow skincare", p: "$250" },
    { b: "Fitness app", p: "$300" },
    { b: "Cold brew co.", p: "$200" },
    { b: "Pet snacks", p: "$180" },
  ];
  const listIn = ramp(t, gigs - 0.2, gigs + 0.2);
  return (
    <>
      {cats.map((c, i) => (
        <Abs key={i} x={230 + i * 310} y={430 - 50 * listIn + float(t, i + 7, 6)} scale={pop(t, s + i * d) * (1 - 0.25 * listIn)}>
          <Card style={{ padding: "22px 30px", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 50 }}>{c.i}</span>
            <span style={{ fontSize: 32, fontWeight: 800 }}>{c.l}</span>
          </Card>
        </Abs>
      ))}
      <Abs x={540} y={680} scale={pop(t, gigs)} opacity={listIn}>
        <Card style={{ width: 640, padding: "26px 34px" }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#8a8580", letterSpacing: 2 }}>TODAY'S GIGS</div>
          {rows.map((r, i) => {
            const a = pop(t, gigs + 0.25 + i * 0.25);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, opacity: a, transform: `translateX(${(1 - a) * 30}px)` }}>
                <span style={{ fontSize: 30, fontWeight: 700 }}>{r.b}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 30, fontWeight: 800, color: C.green }}>{r.p}</span>
                  <Check size={36} />
                </span>
              </div>
            );
          })}
        </Card>
      </Abs>
    </>
  );
};

// ---------- CTA: follow + comment box types the keyword ----------
export const Cta: React.FC<SceneProps> = ({ t, s, ph }) => {
  const second = ph[1]?.start ?? s + 2;
  const typeStart = second + 0.6;
  const n = Math.floor(ramp(t, typeStart, typeStart + 0.7, 0, CTA_WORD.length + 0.99));
  const typed = CTA_WORD.slice(0, n);
  const sent = ramp(t, typeStart + 1.0, typeStart + 1.3);
  return (
    <>
      <Abs x={540} y={360} scale={pop(t, s + 0.2)}>
        <Card style={{ width: 520, padding: "22px 30px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: 999, background: C.coral }} />
            <div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>your.page</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#8a8580" }}>Tips that pay</div>
            </div>
          </div>
          <Pill bg={t > second ? "#e9e6e2" : C.blue} color={t > second ? C.ink : "#fff"} size={26}>
            {t > second ? "Following" : "Follow"}
          </Pill>
        </Card>
      </Abs>
      <Abs x={540} y={560} scale={pop(t, second)}>
        <Card style={{ width: 760, padding: "24px 28px" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#8a8580" }}>💬 Add a comment…</div>
          <div style={{ marginTop: 12, height: 96, borderRadius: 22, border: "3px solid #ece8e3", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 26px" }}>
            <span style={{ fontSize: 54, fontWeight: 800, color: C.coral, letterSpacing: 2 }}>
              {typed}
              {sent < 1 && Math.floor(t * 2.5) % 2 === 0 ? <span style={{ color: C.ink, fontWeight: 400 }}>|</span> : null}
            </span>
            <div style={{ width: 62, height: 62, borderRadius: 999, background: C.blue, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, transform: `scale(${1 + 0.2 * Math.sin(sent * Math.PI)})` }}>➤</div>
          </div>
        </Card>
      </Abs>
      <Abs x={540} y={720} scale={pop(t, typeStart + 1.2)}>
        <Pill size={30}>📩 Rate card in your DM</Pill>
      </Abs>
    </>
  );
};
