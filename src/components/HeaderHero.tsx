import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkle, Butterfly, ShoppingBag, Lightbulb, Quotes, Phone, Envelope, FilePdf, Download } from "@phosphor-icons/react";
import { BRAND_NAME, LOGO_IMAGE, HERO_IMAGE, OCCASIONS, CONTACT_PHONE, CONTACT_PHONE_TEL, CONTACT_EMAIL, FLOWER_CATALOGUE_URL, PRICE_LIST_URL } from "../constants";

interface HeaderHeroProps {
  activeTab: string;
  setActiveTab: (t: string) => void;
  stemCount: number;
}

const TAB_LINKS: { id: string; label: string }[] = [
  { id: "showcase", label: "Showcase" },
  { id: "builder", label: "Flower Builder" },
  { id: "visualizer", label: "Live Preview" },
  { id: "checkout", label: "Order & Pay" },
  { id: "social", label: "Social" },
];

const SPARKLES = Array.from({ length: 16 }, (_, i) => ({
  left: `${(i * 6.3 + 4) % 100}%`,
  top: `${(i * 11.7 + 8) % 92}%`,
  delay: `${(i % 6) * 0.5}s`,
  size: 6 + (i % 4) * 3,
}));

export default function HeaderHero({ activeTab, setActiveTab, stemCount }: HeaderHeroProps) {
  const [ambient, setAmbient] = useState(true);

  return (
    <header className="relative">
      {/* Top contact strip */}
      <div className="relative z-50 border-b border-rosepetal/15 bg-gradient-to-r from-babypink/40 via-cream/30 to-ocean/30">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 text-xs sm:px-6">
          <div className="flex items-center gap-4">
            <a href={`tel:${CONTACT_PHONE_TEL}`} className="inline-flex items-center gap-1.5 text-forest/70 transition hover:text-blush">
              <Phone weight="fill" className="h-3.5 w-3.5 text-rosepetal" />
              <span className="hidden sm:inline">{CONTACT_PHONE}</span>
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-1.5 text-forest/70 transition hover:text-blush">
              <Envelope weight="fill" className="h-3.5 w-3.5 text-blush" />
              <span className="hidden md:inline">{CONTACT_EMAIL}</span>
            </a>
          </div>
          <div className="flex items-center gap-2">
            <a href={FLOWER_CATALOGUE_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 font-medium text-forest backdrop-blur transition hover:bg-white active:scale-95">
              <FilePdf weight="fill" className="h-3.5 w-3.5 text-rosepetal" /> Catalogue
            </a>
            <a href={PRICE_LIST_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 font-medium text-forest backdrop-blur transition hover:bg-white active:scale-95">
              <Download weight="fill" className="h-3.5 w-3.5 text-tang" /> Price List
            </a>
          </div>
        </div>
      </div>
      {/* Nav */}
      <nav className="sticky top-0 z-50 glass">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6">
          <button onClick={() => setActiveTab("showcase")} className="flex items-center gap-2.5">
            <img
              src={LOGO_IMAGE}
              alt={`${BRAND_NAME} logo`}
              width={44}
              height={44}
              className="h-11 w-11 rounded-full object-cover ring-2 ring-rosepetal/30 fuzzy-shadow"
            />
            <span className="text-left leading-none">
              <span className="block font-fairy text-2xl font-bold text-forest">{BRAND_NAME}</span>
              <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-forest/50">Chenille Florist</span>
            </span>
          </button>

          <div className="hidden items-center gap-1 md:flex">
            {TAB_LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => setActiveTab(l.id)}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === l.id ? "text-white" : "text-forest/70 hover:text-forest"
                }`}
              >
                {activeTab === l.id && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-gradient-to-r from-rosepetal to-tang" />
                )}
                <span className="relative z-10">{l.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAmbient((a) => !a)}
              aria-label="Toggle ambient sparkles"
              className={`grid h-10 w-10 place-items-center rounded-full border transition ${
                ambient ? "border-sky/40 bg-ocean text-deepsea" : "border-black/10 bg-white/60 text-forest/50"
              }`}
            >
              <Lightbulb weight={ambient ? "fill" : "regular"} className="h-5 w-5" />
            </button>
            <button
              onClick={() => setActiveTab("checkout")}
              className="relative grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-rosepetal to-blush text-white fuzzy-shadow"
              aria-label="Open order"
            >
              <ShoppingBag weight="fill" className="h-5 w-5" />
              {stemCount > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-forest px-1 text-[11px] font-bold text-white">
                  {stemCount}
                </span>
              )}
            </button>
          </div>
        </div>
        {/* Mobile tabs */}
        <div className="flex gap-1 overflow-x-auto px-4 pb-2 md:hidden">
          {TAB_LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => setActiveTab(l.id)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${
                activeTab === l.id ? "bg-rosepetal text-white" : "bg-white/60 text-forest/70"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cream/70 via-babypink/40 to-ocean/50" />

        {ambient && (
          <div className="pointer-events-none absolute inset-0">
            {SPARKLES.map((s, i) => (
              <Sparkle
                key={i}
                weight="fill"
                className="absolute text-white animate-twinkle"
                style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: s.delay, filter: "drop-shadow(0 0 4px #f9a8d4)" }}
              />
            ))}
            <Butterfly weight="fill" className="absolute left-[12%] top-[30%] h-8 w-8 text-rosepetal/80 animate-flutter" />
            <Butterfly weight="fill" className="absolute right-[16%] top-[52%] h-7 w-7 text-sky/80 animate-flutter" style={{ animationDelay: "2s" }} />
          </div>
        )}

        <div className="relative mx-auto flex min-h-[100dvh] max-w-4xl flex-col items-center justify-center px-4 py-16 text-center">
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            src={LOGO_IMAGE}
            alt={`${BRAND_NAME} emblem`}
            width={112}
            height={112}
            className="mb-5 h-20 w-20 rounded-full object-cover ring-4 ring-white/80 fuzzy-shadow md:h-24 md:w-24"
          />
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-rosepetal/30 bg-white/70 px-4 py-1.5 text-sm font-medium text-forest backdrop-blur"
          >
            <Quotes weight="fill" className="h-4 w-4 text-rosepetal" />
            Handcrafted chenille blooms that never wilt
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-forest md:text-7xl"
          >
            Fairy-tale flowers,
            <br />
            <span className="text-shimmer font-fairy">woven by hand</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mt-5 max-w-[52ch] text-base leading-relaxed text-forest/70 md:text-lg"
          >
            Soft velvet chenille stems shaped into enchanted bouquets. Build your own, preview it live, and order in a tap.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <button
              onClick={() => setActiveTab("builder")}
              className="rounded-full bg-gradient-to-r from-rosepetal to-blush px-7 py-3.5 font-semibold text-white fuzzy-shadow transition active:scale-[0.98]"
            >
              Build a Bouquet
            </button>
            <button
              onClick={() => setActiveTab("showcase")}
              className="rounded-full border border-forest/20 bg-white/70 px-7 py-3.5 font-semibold text-forest backdrop-blur transition hover:bg-white active:scale-[0.98]"
            >
              See Sizes
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-4 flex flex-wrap items-center justify-center gap-3"
          >
            <a href={FLOWER_CATALOGUE_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-forest/20 bg-white/70 px-5 py-2.5 text-sm font-semibold text-forest backdrop-blur transition hover:bg-white active:scale-[0.98]">
              <FilePdf weight="fill" className="h-4 w-4 text-blush" /> View Catalogue (PDF)
            </a>
            <a href={PRICE_LIST_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-forest/20 bg-white/70 px-5 py-2.5 text-sm font-semibold text-forest backdrop-blur transition hover:bg-white active:scale-[0.98]">
              <Download weight="fill" className="h-4 w-4 text-tang" /> Price List (PDF)
            </a>
          </motion.div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {OCCASIONS.map((o) => (
              <button
                key={o}
                onClick={() => setActiveTab("builder")}
                className="rounded-full border border-mint bg-sage/70 px-4 py-1.5 text-sm font-medium text-forest backdrop-blur transition hover:bg-mint/60 active:scale-[0.98]"
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      </section>
    </header>
  );
}