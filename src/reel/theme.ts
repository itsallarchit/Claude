import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Self-hosted (SIL Open Font License) so renders don't depend on network access.
loadFont({ family: "Manrope", url: staticFile("fonts/Manrope.woff2"), weight: "200 800" });
loadFont({ family: "Instrument Serif", url: staticFile("fonts/InstrumentSerif-Italic.woff2"), style: "italic", weight: "400" });

export const sans = "Manrope, sans-serif";
export const serif = "'Instrument Serif', serif";

export const C = {
  ink: "#1d1d24",
  muted: "#b9b4ae",
  blue: "#2f6bff",
  green: "#17a35b",
  greenDeep: "#0f7a43",
  coral: "#e8573c",
  card: "#ffffff",
  shadow: "0 30px 60px rgba(60, 40, 30, 0.14), 0 6px 14px rgba(60, 40, 30, 0.08)",
};
