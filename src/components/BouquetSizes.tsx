import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, ArrowRight, Ruler, Timer, CalendarCheck, Download } from "@phosphor-icons/react";
import { SIZE_TIERS, PRICE_LIST_URL } from "../constants";
import type { SizeId } from "../types";

interface BouquetSizesProps {
  onSelectSize: (id: SizeId) => void;
}

export default function BouquetSizes({ onSelectSize }: BouquetSizesProps) {
  const [uploads, setUploads] = useState<Record<string, string>>({});
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleUpload = (id: string, file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setUploads((u) => ({ ...u, [id]: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mb-10 text-center">
        <span className="font-fairy text-3xl text-rosepetal">Choose your magic</span>
        <h2 className="mt-1 font-display text-4xl font-bold text-forest md:text-5xl">Bouquet Size Showcase</h2>
        <p className="mx-auto mt-3 max-w-[60ch] text-forest/70">
          Three curated tiers of handcrafted chenille florals. Upload your own reference photo to preview a custom arrangement.
        </p>
        <a
          href={PRICE_LIST_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-tang to-peach px-5 py-2.5 text-sm font-semibold text-white fuzzy-shadow transition hover:brightness-105 active:scale-[0.98]"
        >
          <Download weight="fill" className="h-4 w-4" />
          Download full Bouquet Price List (PDF)
        </a>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {SIZE_TIERS.map((tier, i) => (
          <motion.article
            key={tier.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="group relative flex flex-col overflow-hidden rounded-3xl glass p-2 fuzzy-shadow"
          >
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={uploads[tier.id] ?? tier.image}
                alt={tier.name}
                className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-sm font-bold text-blush backdrop-blur">
                ${tier.price}
              </span>
              <input
                ref={(el) => { fileRefs.current[tier.id] = el; }}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleUpload(tier.id, e.target.files?.[0])}
              />
              <button
                onClick={() => fileRefs.current[tier.id]?.click()}
                className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-forest/85 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition hover:bg-forest active:scale-95"
              >
                <Upload weight="bold" className="h-4 w-4" />
                {uploads[tier.id] ? "Change photo" : "Upload photo"}
              </button>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <h3 className="font-display text-2xl font-bold text-forest">{tier.name}</h3>
              <p className="mt-1 text-sm text-forest/70">{tier.blurb}</p>

              <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1.5 text-forest/80">
                  <Ruler weight="fill" className="h-4 w-4 text-sky" /> {tier.stemRange}
                </div>
                <div className="flex items-center gap-1.5 text-forest/80">
                  <Timer weight="fill" className="h-4 w-4 text-tang" /> {tier.turnaround}
                </div>
                <div className="flex items-center gap-1.5 text-forest/80">
                  <span className="text-sage-700">Ø {tier.diameter}</span>
                </div>
                <div className="flex items-center gap-1.5 text-forest/80">
                  <span>H {tier.height}</span>
                </div>
              </dl>

              <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-sage/60 px-3 py-2 text-sm text-forest">
                <CalendarCheck weight="fill" className="h-4 w-4 text-forest" />
                {tier.occasion}
              </div>

              <button
                onClick={() => onSelectSize(tier.id)}
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rosepetal to-tang px-5 py-3 font-semibold text-white transition active:scale-[0.98]"
              >
                Select &amp; Customize
                <ArrowRight weight="bold" className="h-4 w-4" />
              </button>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}