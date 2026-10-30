import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Printer, ShareNetwork, MagicWand, Sparkle, Butterfly } from "@phosphor-icons/react";
import { toast } from "sonner";
import {
  BRAND_NAME,
  FLOWERS,
  WRAPPING_STYLES,
  RIBBON_COLORS,
  SIZE_TIERS,
  computeCost,
  stemCount,
  depositSplit,
} from "../constants";
import type { BuilderState } from "../types";

interface BouquetVisualizerProps {
  builder: BuilderState;
}

const NAME_PREFIX = ["Enchanted", "Whispering", "Twilight", "Meadow", "Starlit", "Velvet", "Crystal"];
const NAME_SUFFIX = ["Fairy Crown", "Bloom Spell", "Petal Dream", "Garden Wish", "Blossom Charm", "Stem Symphony"];

export default function BouquetVisualizer({ builder }: BouquetVisualizerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const cost = useMemo(() => computeCost(builder), [builder]);
  const count = stemCount(builder);
  const tier = SIZE_TIERS.find((s) => s.id === builder.selectedSize);
  const wrap = WRAPPING_STYLES.find((w) => w.id === builder.wrappingPaper);
  const ribbon = RIBBON_COLORS.find((r) => r.id === builder.ribbonColor);
  const lightsOn = builder.fairyLightsActive || builder.addOns.includes("fairy-lights");
  const hasGlitter = builder.addOns.includes("glitter-dust");
  const hasButterfly = builder.addOns.includes("butterfly-pins");

  // Expand each selected flower into individual stems for the canvas.
  const stems = useMemo(() => {
    const arr: { petal: string; stem: string; texture: string; flower: string }[] = [];
    builder.items.forEach((it) => {
      for (let q = 0; q < Math.min(it.quantity, 12); q++) {
        arr.push({ petal: it.petalColor, stem: it.stemColor, texture: it.texture, flower: it.flowerId });
      }
    });
    return arr;
  }, [builder.items]);

  const layout = useMemo(() => {
    const n = stems.length;
    const cx = 150;
    const baseY = 250;
    const spread = Math.min(120, 40 + n * 8);
    const height = tier?.id === "large" ? 150 : tier?.id === "medium" ? 120 : 95;
    return stems.map((s, i) => {
      const t = n === 1 ? 0.5 : i / (n - 1);
      const angle = (t - 0.5) * 1.1; // radians fan
      const x = cx + Math.sin(angle) * spread * 0.5;
      const topY = baseY - height + Math.abs(t - 0.5) * 40;
      return { ...s, x, topY, angle, len: baseY - topY };
    });
  }, [stems, tier]);

  const generateName = () => {
    const name = `${NAME_PREFIX[Math.floor(Math.random() * NAME_PREFIX.length)]} ${NAME_SUFFIX[Math.floor(Math.random() * NAME_SUFFIX.length)]}`;
    toast.success(`Your bouquet is now "${name}"`);
    return name;
  };

  const handlePrint = () => {
    if (!svgRef.current) return;
    const win = window.open("", "_blank", "width=520,height=680");
    if (!win) { toast.error("Please allow pop-ups to save your bouquet image"); return; }
    win.document.write(
      `<html><head><title>${BRAND_NAME}</title></head><body style="margin:0;display:grid;place-items:center;background:#fffdf9">${svgRef.current.outerHTML}<script>setTimeout(function(){window.print()},300)</script></body></html>`
    );
    win.document.close();
  };

  const handleShare = async () => {
    const data = `${builder.customName} — ${count} stems, ${cost.total} total, made at ${BRAND_NAME}`;
    try {
      await navigator.clipboard.writeText(data);
      toast.success("Bouquet recipe copied to clipboard");
    } catch {
      toast.error("Could not copy — try again");
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="mb-8 text-center">
        <span className="font-fairy text-3xl text-forest">Watch it bloom</span>
        <h2 className="mt-1 font-display text-4xl font-bold text-forest md:text-5xl">Live Arrangement Visualizer</h2>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Canvas */}
        <div className="lg:col-span-3">
          <div
            className="relative overflow-hidden rounded-3xl glass p-4"
            style={{ perspective: "1000px" }}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setTilt({ rx: ((e.clientY - r.top) / r.height - 0.5) * -8, ry: ((e.clientX - r.left) / r.width - 0.5) * 10 });
            }}
            onMouseLeave={() => setTilt({ rx: 0, ry: 0 })}
          >
            <motion.div
              className="relative"
              animate={{ rotateX: tilt.rx, rotateY: tilt.ry }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <svg ref={svgRef} viewBox="0 0 300 320" className="mx-auto w-full max-w-md animate-floaty" style={{ transform: "translateZ(0)" }}>
                <defs>
                  <linearGradient id="wrapGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#fbcfe8" stopOpacity="0.7" />
                  </linearGradient>
                </defs>

                {/* Wrapping cone */}
                <path d="M110 250 L190 250 L165 315 L135 315 Z" fill={wrap ? "url(#wrapGrad)" : "#f5e9ff"} stroke="#f472b6" strokeOpacity="0.35" />
                <path d="M110 250 L190 250 L178 275 L122 275 Z" fill="#ffffff" fillOpacity="0.5" />

                {/* Stems */}
                {layout.map((s, i) => (
                  <g key={i}>
                    <line x1={s.x} y1={s.topY} x2={150} y2={255} stroke={s.stem} strokeWidth={3} strokeLinecap="round" strokeDasharray={s.texture === "Tinsel Sparkle" ? "1 3" : undefined} />
                    {/* leaf */}
                    <ellipse cx={(s.x + 150) / 2} cy={(s.topY + 255) / 2 + 10} rx={7} ry={3} fill={s.stem} opacity={0.7} transform={`rotate(${(s.angle * 180) / Math.PI} ${(s.x + 150) / 2} ${(s.topY + 255) / 2 + 10})`} />
                    {/* flower head */}
                    <g transform={`translate(${s.x} ${s.topY})`}>
                      {s.flower === "babys-breath" ? (
                        <>
                          {[0, 1, 2, 3, 4].map((k) => (
                            <circle key={k} cx={Math.cos((k / 5) * 6.28) * 6} cy={Math.sin((k / 5) * 6.28) * 6} r={3} fill={s.petal} />
                          ))}
                        </>
                      ) : s.flower === "lavender-spire" ? (
                        [0, 1, 2, 3, 4].map((k) => <circle key={k} cx={0} cy={-k * 5} r={4 - k * 0.5} fill={s.petal} />)
                      ) : (
                        <>
                          {[0, 1, 2, 3, 4, 5].map((k) => (
                            <ellipse key={k} cx={0} cy={-8} rx={5} ry={8} fill={s.petal} transform={`rotate(${k * 60})`} opacity={s.texture === "Fluffy Chenille" ? 0.95 : 0.85} />
                          ))}
                          <circle r={4} fill="#fde68a" />
                        </>
                      )}
                      {s.texture === "Tinsel Sparkle" && <circle r={11} fill="none" stroke="#fcd34d" strokeWidth={1} strokeDasharray="2 2" />}
                    </g>
                  </g>
                ))}

                {/* Fairy lights */}
                {lightsOn && layout.map((s, i) => (
                  <circle key={`l${i}`} cx={s.x + (i % 2 ? 4 : -4)} cy={s.topY + 14} r={2.5} fill="#fff3b0" className="animate-twinkle" style={{ animationDelay: `${i * 0.3}s`, filter: "drop-shadow(0 0 4px #fcd34d)" }} />
                ))}

                {/* Glitter dust */}
                {hasGlitter && Array.from({ length: 14 }).map((_, i) => (
                  <circle key={`g${i}`} cx={60 + (i * 13) % 180} cy={80 + (i * 21) % 150} r={1.5} fill="#fcd34d" className="animate-twinkle" style={{ animationDelay: `${(i % 5) * 0.4}s` }} />
                ))}

                {/* Ribbon bow */}
                <g transform="translate(150 262)">
                  <path d="M0 0 C-18 -12 -26 6 0 4 Z" fill={ribbon?.hex ?? "#f472b6"} />
                  <path d="M0 0 C18 -12 26 6 0 4 Z" fill={ribbon?.hex ?? "#f472b6"} />
                  <circle r={4} fill="#ffffff" stroke={ribbon?.hex ?? "#f472b6"} />
                </g>

                {hasButterfly && (
                  <g transform="translate(210 120)" className="animate-flutter">
                    <path d="M0 0 C-14 -12 -16 8 0 2 Z" fill="#38bdf8" opacity={0.85} />
                    <path d="M0 0 C14 -12 16 8 0 2 Z" fill="#f472b6" opacity={0.85} />
                  </g>
                )}
              </svg>

              {stems.length === 0 && (
                <div className="pointer-events-none absolute inset-0 grid place-items-center">
                  <p className="max-w-[26ch] text-center text-sm text-forest/50">Add stems in the Flower Builder to see your bouquet bloom here.</p>
                </div>
              )}
            </motion.div>

            <div className="mt-2 flex items-center justify-between gap-2 border-t border-black/5 pt-3">
              <div className="flex items-center gap-2 text-sm text-forest/70">
                <Butterfly weight="fill" className="h-4 w-4 text-rosepetal" />
                {tier ? `${tier.name}` : "Custom mix"} · {count} stems
              </div>
              <div className="flex gap-2">
                <button onClick={handlePrint} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-forest shadow-sm transition active:scale-95"><Printer weight="fill" className="h-4 w-4 text-deepsea" /> Save</button>
                <button onClick={handleShare} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-forest shadow-sm transition active:scale-95"><ShareNetwork weight="fill" className="h-4 w-4 text-tang" /> Share</button>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 space-y-4 rounded-3xl glass p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl font-bold text-forest">{builder.customName || "My Fairy Bouquet"}</h3>
              <button onClick={() => builder && generateName()} className="inline-flex items-center gap-1 rounded-full bg-sage px-3 py-1.5 text-xs font-medium text-forest transition active:scale-95"><MagicWand weight="fill" className="h-4 w-4 text-rosepetal" /> Name</button>
            </div>

            {builder.recipientName && <p className="text-sm text-forest/70">For <span className="font-semibold text-blush">{builder.recipientName}</span></p>}

            <ul className="space-y-1 text-sm">
              {builder.items.map((it) => {
                const f = FLOWERS.find((x) => x.id === it.flowerId)!;
                return (
                  <li key={it.flowerId} className="flex items-center justify-between text-forest/80">
                    <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: it.petalColor }} />{f.name} ×{it.quantity}</span>
                    <span className="text-forest/50">${f.price * it.quantity}</span>
                  </li>
                );
              })}
              {builder.items.length === 0 && <li className="text-forest/40">No flowers yet.</li>}
            </ul>

            <div className="space-y-1.5 border-t border-black/5 pt-3 text-sm">
              <Row label={tier ? `Base (${tier.name})` : "Base tier"} value={cost.base} />
              <Row label="Flowers" value={cost.flowers} />
              <Row label={`Wrapping · ${wrap?.name ?? ""}`} value={cost.wrapping} />
              <Row label="Add-ons" value={cost.addOns} />
            </div>

            <div className="flex items-end justify-between rounded-2xl bg-gradient-to-r from-babypink to-ocean px-4 py-3">
              <span className="font-display text-lg font-bold text-forest">Total</span>
              <span className="font-display text-3xl font-bold text-blush">${cost.total}</span>
            </div>

            <p className="text-xs font-medium text-forest/60">{`Reserve with a $${depositSplit(cost.total).deposit} M-Pesa deposit (50%).`}</p>
            <p className="text-xs text-forest/40">Every bouquet is handmade to order, so petal shapes and shades may vary slightly from this preview.</p>

            {builder.giftNote && (
              <div className="rounded-2xl border border-rosepetal/20 bg-white/60 p-3">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-rosepetal"><Sparkle weight="fill" className="h-3.5 w-3.5" /> Fairy wish</p>
                <p className="mt-1 font-fairy text-xl leading-snug text-forest">"{builder.giftNote}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-forest/70">
      <span>{label}</span>
      <span>${value}</span>
    </div>
  );
}