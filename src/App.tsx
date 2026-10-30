import { useEffect, useMemo, useState } from "react";
import { Toaster } from "sonner";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight, Phone, Envelope, FilePdf, WhatsappLogo } from "@phosphor-icons/react";
import HeaderHero from "./components/HeaderHero";
import BouquetSizes from "./components/BouquetSizes";
import FlowerBuilder from "./components/FlowerBuilder";
import BouquetVisualizer from "./components/BouquetVisualizer";
import SocialCheckout from "./components/SocialCheckout";
import { DEFAULT_BUILDER, computeCost, stemCount, depositSplit, BRAND_NAME, LOGO_IMAGE, CONTACT_PHONE, CONTACT_PHONE_TEL, CONTACT_EMAIL, MPESA_SEND_MONEY_PHONE, MPESA_RECIPIENT_NAME, FLOWER_CATALOGUE_URL, PRICE_LIST_URL, whatsappLink } from "./constants";
import type { BuilderState, SizeId } from "./types";

const STORAGE_KEY = "roys-blooms-builder";
const SECTION_IDS = ["showcase", "builder", "visualizer", "checkout", "social"];

function loadBuilder(): BuilderState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_BUILDER;
    return { ...DEFAULT_BUILDER, ...(JSON.parse(raw) as Partial<BuilderState>) };
  } catch {
    return DEFAULT_BUILDER;
  }
}

export default function App() {
  const [builder, setBuilder] = useState<BuilderState>(loadBuilder);
  const [activeTab, setActiveTab] = useState("showcase");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(builder));
    } catch {
      /* storage unavailable — in-memory only */
    }
  }, [builder]);

  const update = (patch: Partial<BuilderState>) => setBuilder((b) => ({ ...b, ...patch }));

  const goTo = (id: string) => {
    setActiveTab(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onSelectSize = (id: SizeId) => {
    update({ selectedSize: id });
    goTo("builder");
  };

  // Scroll-spy to keep the nav pill in sync while reading down the page.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveTab(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const cost = useMemo(() => computeCost(builder), [builder]);
  const count = stemCount(builder);
  const showBar = count > 0 || builder.selectedSize !== null;

  return (
    <div className="min-h-screen bg-cream text-forest">
      <HeaderHero activeTab={activeTab} setActiveTab={goTo} stemCount={count} />

      <main className="relative">
        <div id="showcase" className="scroll-mt-24">
          <BouquetSizes onSelectSize={onSelectSize} />
        </div>

        <div id="builder" className="scroll-mt-24 bg-gradient-to-b from-transparent via-babypink/20 to-transparent">
          <FlowerBuilder builder={builder} update={update} />
        </div>

        <div id="visualizer" className="scroll-mt-24">
          <BouquetVisualizer builder={builder} />
        </div>

        <div id="checkout" className="scroll-mt-24 bg-gradient-to-b from-transparent via-ocean/30 to-transparent">
          <SocialCheckout builder={builder} />
        </div>

        <div id="social" className="scroll-mt-24" />

        <footer className="border-t border-rosepetal/15 bg-gradient-to-b from-babypink/30 to-cream py-12">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 text-center sm:px-6 md:grid-cols-3 md:text-left">
            <div>
              <img src={LOGO_IMAGE} alt={`${BRAND_NAME} logo`} width={64} height={64} className="mx-auto h-16 w-16 rounded-full object-cover ring-2 ring-rosepetal/25 md:mx-0" />
              <p className="mt-2 font-fairy text-3xl text-rosepetal">{BRAND_NAME}</p>
              <p className="mt-2 text-sm text-forest/60">Handcrafted chenille &amp; pipe-cleaner florals. Never wilt, always wonder.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
                <a href={FLOWER_CATALOGUE_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-forest transition hover:bg-white active:scale-95"><FilePdf weight="fill" className="h-4 w-4 text-rosepetal" /> Catalogue</a>
                <a href={PRICE_LIST_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-forest transition hover:bg-white active:scale-95"><FilePdf weight="fill" className="h-4 w-4 text-tang" /> Price List</a>
              </div>
            </div>
            <div>
              <h4 className="font-display text-lg font-bold text-forest">Reserve with 50% deposit</h4>
              <ul className="mt-3 space-y-2 text-sm text-forest/70">
                <li>M-Pesa Send Money to <span className="font-semibold text-forest">{MPESA_SEND_MONEY_PHONE}</span> ({MPESA_RECIPIENT_NAME})</li>
                <li>Pay the balance once your bouquet is ready.</li>
                <li>Deposits are confirmed by our florist on WhatsApp.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-display text-lg font-bold text-forest">Get in touch</h4>
              <ul className="mt-3 space-y-2 text-sm text-forest/70">
                <li className="flex items-center justify-center gap-2 md:justify-start"><Phone weight="fill" className="h-4 w-4 text-rosepetal" /><a href={`tel:${CONTACT_PHONE_TEL}`} className="transition hover:text-blush">{CONTACT_PHONE}</a></li>
                <li className="flex items-center justify-center gap-2 md:justify-start"><Envelope weight="fill" className="h-4 w-4 text-blush" /><a href={`mailto:${CONTACT_EMAIL}`} className="transition hover:text-blush">{CONTACT_EMAIL}</a></li>
                <li className="flex items-center justify-center gap-2 md:justify-start"><WhatsappLogo weight="fill" className="h-4 w-4 text-[#25D366]" /><a href={whatsappLink("Hi Roy's Blooms! I'd like to order a bouquet.")} target="_blank" rel="noreferrer" className="transition hover:text-blush">Chat on WhatsApp</a></li>
              </ul>
            </div>
          </div>
          <p className="mt-8 text-center text-xs text-forest/40">© {new Date().getFullYear()} {BRAND_NAME}. Woven with fairy dust.</p>
        </footer>
      </main>

      {/* Floating sticky summary bar */}
      {showBar && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4"
        >
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 rounded-2xl glass px-4 py-3 fuzzy-shadow">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-mint to-sky text-forest">
                <ShoppingBag weight="fill" className="h-5 w-5" />
              </span>
              <div className="leading-tight">
                <p className="text-xs text-forest/60">{count} stems · {builder.customName || "Fairy bouquet"}</p>
                <p className="font-display text-xl font-bold text-blush">
                  ${cost.total}
                  <span className="font-body text-xs font-semibold text-forest/55">{` · $${depositSplit(cost.total).deposit} deposit`}</span>
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => goTo("visualizer")} className="hidden rounded-full border border-forest/20 bg-white/70 px-4 py-2.5 text-sm font-semibold text-forest transition hover:bg-white active:scale-95 sm:block">
                Preview
              </button>
              <button onClick={() => goTo("checkout")} className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rosepetal to-blush px-5 py-2.5 text-sm font-semibold text-white transition active:scale-95">
                Order <ArrowRight weight="bold" className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <Toaster richColors position="top-right" closeButton />
    </div>
  );
}