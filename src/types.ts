export type SizeId = "small" | "medium" | "large";

export type TextureMode = "Standard Velvet" | "Fluffy Chenille" | "Tinsel Sparkle";

export interface SizeTier {
  id: SizeId;
  name: string;
  price: number;
  stemRange: string;
  diameter: string;
  height: string;
  occasion: string;
  turnaround: string;
  image: string;
  blurb: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface FlowerItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  petalColor: string;
  stemColor: string;
  stockCount: number;
}

export interface CustomFlowerItem {
  flowerId: string;
  quantity: number;
  petalColor: string;
  stemColor: string;
  texture: TextureMode;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  icon: string;
  description: string;
}

export interface WrappingStyle {
  id: string;
  name: string;
  price: number;
  gradient: string;
}

export interface RibbonColor {
  id: string;
  name: string;
  hex: string;
}

export interface RecipeSuggestion {
  name: string;
  blurb: string;
  flowerIds: string[];
}

export interface BuilderState {
  selectedSize: SizeId | null;
  items: CustomFlowerItem[];
  wrappingPaper: string;
  ribbonColor: string;
  addOns: string[];
  giftNote: string;
  recipientName: string;
  fairyLightsActive: boolean;
  customName: string;
}

export interface CostBreakdown {
  base: number;
  flowers: number;
  wrapping: number;
  addOns: number;
  total: number;
}
