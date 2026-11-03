// Reel 01: "The 30-second video" (UGC pay)
// `say` must match the voiceover text (used to align with the transcript).
// `show` is the on-screen caption. Markup: **word** = highlighted, _word_ = serif italic accent.

export type SceneId =
  | "hook"
  | "zero"
  | "what"
  | "need"
  | "price"
  | "math"
  | "rights"
  | "brands"
  | "cta";

export type Phrase = { scene: SceneId; say: string; show: string };

export const PHRASES: Phrase[] = [
  { scene: "hook", say: "See this thirty-second video?", show: "See this **30-second** video?" },
  { scene: "hook", say: "Brands pay creators up to three hundred dollars for one like it", show: "Brands pay creators up to **$300** for one like it" },
  { scene: "zero", say: "and you don't need a single follower.", show: "and you don't need a single _follower._" },
  { scene: "what", say: "Basically, it's called U-G-C.", show: "Basically, it's called **UGC.**" },
  { scene: "what", say: "You film a short video using a product,", show: "You _film_ a short video using a product," },
  { scene: "what", say: "and the brand posts it as their ad.", show: "and the _brand_ posts it as their **ad.**" },
  { scene: "need", say: "No audience needed.", show: "No _audience_ needed." },
  { scene: "need", say: "Just your phone, good lighting, and an honest review.", show: "Just your **phone,** good **lighting,** and an honest **review.**" },
  { scene: "price", say: "Beginners charge a hundred to a hundred and fifty dollars a video.", show: "Beginners charge **$100–150** a video." },
  { scene: "price", say: "With a portfolio? Three hundred and up.", show: "With a _portfolio?_ **$300** and up." },
  { scene: "math", say: "At three hundred, just two videos a week is twenty-four hundred dollars a month.", show: "At **$300,** just **2** videos a week is **$2,400** a month." },
  { scene: "rights", say: "And if the brand runs it as a paid ad?", show: "And if the brand runs it as a _paid ad?_" },
  { scene: "rights", say: "You charge double for usage rights.", show: "You charge **double** for usage rights." },
  { scene: "brands", say: "Skincare, apps, coffee brands", show: "Skincare, apps, coffee _brands…_" },
  { scene: "brands", say: "they post these gigs every single day.", show: "they post these gigs **every single day.**" },
  { scene: "cta", say: "Want my rate card, and where to find the gigs?", show: "Want my _rate card_ and where to find the gigs?" },
  { scene: "cta", say: "Follow, and comment RATES. I'll DM you everything.", show: "_Follow,_ and comment **RATES.** I'll _DM_ you everything." },
];

export const CHAPTERS: Partial<Record<SceneId, { n: number; label: string }>> = {
  what: { n: 1, label: "What is UGC" },
  need: { n: 2, label: "What you need" },
  price: { n: 3, label: "What to charge" },
  math: { n: 4, label: "The math" },
  rights: { n: 5, label: "The 2X trick" },
  brands: { n: 6, label: "Who's hiring" },
};

export const CTA_WORD = "RATES";
