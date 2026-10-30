import type {
  SizeTier,
  ColorSwatch,
  FlowerItem,
  AddOn,
  WrappingStyle,
  RibbonColor,
  RecipeSuggestion,
  BuilderState,
  CostBreakdown,
} from "./types";

const IMG = "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/47505a84-fa3c-47cd-9670-9112ce89186c";

export const LOGO_IMAGE =
  "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/47505a84-fa3c-47cd-9670-9112ce89186c/roys-blooms-logo-602ccb4d-1793193070095.webp";
export const HERO_IMAGE = `${IMG}/fairy-chenille-hero-518b15b0-1793101252828.webp`;
export const CATALOGUE_IMAGE = `${IMG}/catalogue-cover-d02f2050-1793191613509.webp`;
export const PRICE_LIST_IMAGE = `${IMG}/price-list-banner-c51d8f06-1793191614631.webp`;
export const STUDIO_IMAGE = `${IMG}/studio-contact-f7635377-1793191609831.webp`;
export const GALLERY_IMAGE = `${IMG}/gallery-accent-b8d6c1ed-1793191606666.webp`;

export const BRAND_NAME = "Roy's Blooms";
export const WHATSAPP_NUMBER = "254712345678";
/** M-Pesa Send Money details used for the 50% deposit. */
export const MPESA_SEND_MONEY_PHONE = "0712 345 678";
export const MPESA_RECIPIENT_NAME = "Roy's Blooms";
export const DEPOSIT_RATE = 0.5;

/** Splits a total into the deposit due now and the balance due on delivery. */
export function depositSplit(total: number) {
  const deposit = Math.round(total * DEPOSIT_RATE);
  return { total, deposit, balance: total - deposit };
}
export const INSTAGRAM_HANDLE = "@roysblooms.chenille";
export const TIKTOK_HANDLE = "@roysblooms";

// Official uploaded PDF assets (public S3 URLs).
export const FLOWER_CATALOGUE_URL =
  "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/attachments/09614d12-90ba-4801-9be3-deb87b69349f/1793191438494_FLOWER_CATALOGUE.pdf";
export const PRICE_LIST_URL =
  "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/attachments/09614d12-90ba-4801-9be3-deb87b69349f/1793191437199_Bouquet_Price_List.pdf";

// Contact & studio details.
export const CONTACT_PHONE = "+254 712 345 678";
export const CONTACT_PHONE_TEL = "+254712345678";
export const CONTACT_EMAIL = "orders@roysblooms.com";

export const INSTAGRAM_URL = "https://instagram.com/roysblooms.chenille";
export const TIKTOK_URL = "https://tiktok.com/@roysblooms";
export const FACEBOOK_URL = "https://facebook.com/roysblooms";

/** Click-to-chat WhatsApp link with an optional prefilled message. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const SIZE_TIERS: SizeTier[] = [
  {
    id: "small",
    name: "Petite Fairy Posy",
    price: 28,
    stemRange: "5-7 stems",
    diameter: "12 cm",
    height: "20 cm",
    occasion: "Desk cheer & little surprises",
    turnaround: "Ready in 24 hrs",
    image: `${IMG}/small-fairy-bouquet-fe93fe27-1793101253581.webp`,
    blurb: "A tiny enchanted posy of fuzzy chenille blooms, perfect for a windowsill or a gentle hello.",
  },
  {
    id: "medium",
    name: "Enchanted Garden Bundle",
    price: 48,
    stemRange: "10-14 stems",
    diameter: "18 cm",
    height: "30 cm",
    occasion: "Birthdays & romance",
    turnaround: "Ready in 48 hrs",
    image: `${IMG}/medium-fairy-bouquet-e02fbaa2-1793101267269.webp`,
    blurb: "A hand-wrapped bundle in sheer Korean kraft with a satin bow and woven fairy lights.",
  },
  {
    id: "large",
    name: "Grand Fairy Crown",
    price: 78,
    stemRange: "18-24 stems",
    diameter: "26 cm",
    height: "40 cm",
    occasion: "Graduations & grand gestures",
    turnaround: "Ready in 3 days",
    image: `${IMG}/large-fairy-bouquet-c24d0bb5-1793101253008.webp`,
    blurb: "A lush statement crown wrapped in holographic organza with butterfly pins and glitter dust.",
  },
];

export const COLOR_SWATCHES: ColorSwatch[] = [
  { name: "Pastel Pink", hex: "#f9a8d4" },
  { name: "Sage Mint", hex: "#a7f3d0" },
  { name: "Lavender Mist", hex: "#ddd6fe" },
  { name: "Ocean Azure", hex: "#7dd3fc" },
  { name: "Peach Sherbet", hex: "#fed7aa" },
  { name: "Velvet Mauve", hex: "#d8b4fe" },
  { name: "Buttercup Yellow", hex: "#fde68a" },
  { name: "Pearlescent White", hex: "#faf5ff" },
  { name: "Emerald Green", hex: "#34d399" },
  { name: "Metallic Gold", hex: "#fcd34d" },
];

export const FLOWERS: FlowerItem[] = [
  { id: "fairy-rose", name: "Fairy Rose", price: 6, category: "Romance", description: "Spiral velvet petals with a soft fuzzy core.", petalColor: "#f9a8d4", stemColor: "#34d399", stockCount: 40 },
  { id: "enchanted-tulip", name: "Enchanted Tulip", price: 5, category: "Spring", description: "Cupped chenille petals in a graceful curve.", petalColor: "#fb7185", stemColor: "#10b981", stockCount: 32 },
  { id: "chenille-sunflower", name: "Chenille Sunflower", price: 7, category: "Cheer", description: "Radiant buttercup rays around a cocoa center.", petalColor: "#fcd34d", stemColor: "#16a34a", stockCount: 25 },
  { id: "lavender-spire", name: "Lavender Spire", price: 4, category: "Calm", description: "Tall fuzzy spikes that whisper calm.", petalColor: "#ddd6fe", stemColor: "#4d7c0f", stockCount: 50 },
  { id: "daisy-meadow", name: "Daisy Meadow", price: 4, category: "Cheer", description: "Bright cheerful petals with a golden eye.", petalColor: "#faf5ff", stemColor: "#22c55e", stockCount: 60 },
  { id: "peony-cloud", name: "Peony Cloud", price: 8, category: "Romance", description: "Layered ruffled chenille like a soft cloud.", petalColor: "#f9a8d4", stemColor: "#15803d", stockCount: 18 },
  { id: "lily-valley", name: "Lily of the Valley", price: 5, category: "Calm", description: "Dainty drooping bells on an arching stem.", petalColor: "#ecfeff", stemColor: "#16a34a", stockCount: 22 },
  { id: "babys-breath", name: "Baby's Breath Spray", price: 3, category: "Filler", description: "Airy micro blooms to fill the gaps.", petalColor: "#faf5ff", stemColor: "#84cc16", stockCount: 80 },
  { id: "cherry-blossom", name: "Cherry Blossom", price: 6, category: "Spring", description: "Delicate five-petal blush blossoms.", petalColor: "#fbcfe8", stemColor: "#65a30d", stockCount: 30 },
];

export const WRAPPING_STYLES: WrappingStyle[] = [
  { id: "fairy-pearl", name: "Fairy Pearl Sheer", price: 6, gradient: "linear-gradient(135deg,#fdf2f8,#e0f2fe)" },
  { id: "korean-kraft", name: "Korean Bouquet Kraft", price: 8, gradient: "linear-gradient(135deg,#ffedd5,#fed7aa)" },
  { id: "pastel-ombre", name: "Pastel Ombre Netting", price: 7, gradient: "linear-gradient(135deg,#fce7f3,#a7f3d0)" },
  { id: "celestial-organza", name: "Celestial Organza", price: 10, gradient: "linear-gradient(135deg,#e0f2fe,#ddd6fe)" },
  { id: "vintage-parchment", name: "Vintage Parchment", price: 5, gradient: "linear-gradient(135deg,#fef3c7,#fed7aa)" },
  { id: "holographic-glaze", name: "Holographic Glaze", price: 12, gradient: "linear-gradient(135deg,#f5d0fe,#a5f3fc,#fde68a)" },
];

export const RIBBON_COLORS: RibbonColor[] = [
  { id: "blush", name: "Blush Satin", hex: "#f472b6" },
  { id: "sage", name: "Sage Ribbon", hex: "#86efac" },
  { id: "ocean", name: "Ocean Blue", hex: "#38bdf8" },
  { id: "peach", name: "Peach Charmeuse", hex: "#fb923c" },
  { id: "gold", name: "Gold Wire", hex: "#fcd34d" },
  { id: "ivory", name: "Ivory Silk", hex: "#faf5ff" },
];

export const ADD_ONS: AddOn[] = [
  { id: "fairy-lights", name: "LED Fairy Lights", price: 5, icon: "Lightbulb", description: "Warm micro string lights woven through the stems." },
  { id: "butterfly-pins", name: "Butterfly Pins", price: 4, icon: "Butterfly", description: "Two hand-folded fluttering butterfly clips." },
  { id: "glitter-dust", name: "Glitter Dust", price: 3, icon: "Sparkle", description: "A shimmer of cosmetic-safe sparkle dust." },
  { id: "wooden-tag", name: "Wooden Gift Tag", price: 2, icon: "Tag", description: "Laser-etched keepsake tag for your note." },
  { id: "scent-drops", name: "Scent Drops", price: 4, icon: "Flower", description: "Optional rose-vanilla mist for a sensory touch." },
];

export const RECIPES: RecipeSuggestion[] = [
  { name: "Fairy Forest", blurb: "Sage, mint & lavender calm", flowerIds: ["lavender-spire", "lily-valley", "babys-breath", "cherry-blossom"] },
  { name: "Sunset Romance", blurb: "Rose, peony & peach warmth", flowerIds: ["fairy-rose", "peony-cloud", "enchanted-tulip", "babys-breath"] },
  { name: "Ocean Breeze", blurb: "Azure, daisy & white airiness", flowerIds: ["daisy-meadow", "lily-valley", "chenille-sunflower", "babys-breath"] },
];

export const OCCASIONS = ["Birthday", "Romance", "Graduation", "Cheer Up", "Fairycore Decor"];

export const DEFAULT_BUILDER: BuilderState = {
  selectedSize: null,
  items: [],
  wrappingPaper: "fairy-pearl",
  ribbonColor: "blush",
  addOns: [],
  giftNote: "",
  recipientName: "",
  fairyLightsActive: false,
  customName: "My Fairy Bouquet",
};

const TEXTURES: import("./types").TextureMode[] = ["Standard Velvet", "Fluffy Chenille", "Tinsel Sparkle"];
export const TEXTURE_MODES = TEXTURES;

export function computeCost(state: BuilderState): CostBreakdown {
  const base = state.selectedSize ? SIZE_TIERS.find((s) => s.id === state.selectedSize)?.price ?? 0 : 0;
  const flowers = state.items.reduce((sum, it) => {
    const f = FLOWERS.find((x) => x.id === it.flowerId);
    return sum + (f ? f.price * it.quantity : 0);
  }, 0);
  const wrap = WRAPPING_STYLES.find((w) => w.id === state.wrappingPaper)?.price ?? 0;
  const addOns = state.addOns.reduce((sum, id) => sum + (ADD_ONS.find((a) => a.id === id)?.price ?? 0), 0);
  return { base, flowers, wrapping: wrap, addOns, total: base + flowers + wrap + addOns };
}

export function stemCount(state: BuilderState): number {
  return state.items.reduce((sum, it) => sum + it.quantity, 0);
}