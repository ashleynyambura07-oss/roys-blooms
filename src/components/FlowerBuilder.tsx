import { motion } from "framer-motion";
import { Plus, Minus, Trash, Palette, Check, MagicWand, Sparkle } from "@phosphor-icons/react";
import {
  FLOWERS,
  COLOR_SWATCHES,
  WRAPPING_STYLES,
  RIBBON_COLORS,
  ADD_ONS,
  RECIPES,
  TEXTURE_MODES,
  SIZE_TIERS,
} from "../constants";
import type { BuilderState, CustomFlowerItem, TextureMode } from "../types";

interface FlowerBuilderProps {
  builder: BuilderState;
  update: (patch: Partial<BuilderState>) => void;
}

export default function FlowerBuilder({ builder, update }: FlowerBuilderProps) {
  const categories = Array.from(new Set(FLOWERS.map((f) => f.category)));

  const findItem = (id: string) => builder.items.find((i) => i.flowerId === id);

  const setItems = (items: CustomFlowerItem[]) => update({ items });

  const addFlower = (flowerId: string) => {
    if (findItem(flowerId)) return;
    const f = FLOWERS.find((x) => x.id === flowerId)!;
    setItems([...builder.items, { flowerId, quantity: 1, petalColor: f.petalColor, stemColor: f.stemColor, texture: "Fluffy Chenille" }]);
  };

  const changeQty = (flowerId: string, delta: number) => {
    setItems(
      builder.items
        .map((i) => (i.flowerId === flowerId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const removeFlower = (flowerId: string) => setItems(builder.items.filter((i) => i.flowerId !== flowerId));

  const patchItem = (flowerId: string, patch: Partial<CustomFlowerItem>) =>
    setItems(builder.items.map((i) => (i.flowerId === flowerId ? { ...i, ...patch } : i)));

  const applyRecipe = (flowerIds: string[]) => {
    const items = flowerIds.map((id) => {
      const f = FLOWERS.find((x) => x.id === id)!;
      const existing = findItem(id);
      return existing ?? { flowerId: id, quantity: 2, petalColor: f.petalColor, stemColor: f.stemColor, texture: "Fluffy Chenille" as TextureMode };
    });
    setItems(items);
  };

  const toggleAddOn = (id: string) =>
    update({
      addOns: builder.addOns.includes(id) ? builder.addOns.filter((a) => a !== id) : [...builder.addOns, id],
      fairyLightsActive: id === "fairy-lights" ? !builder.addOns.includes(id) : builder.fairyLightsActive,
    });

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="mb-8 text-center">
        <span className="font-fairy text-3xl text-deepsea">Pick your petals</span>
        <h2 className="mt-1 font-display text-4xl font-bold text-forest md:text-5xl">Custom Flower Selector</h2>
        <p className="mx-auto mt-3 max-w-[60ch] text-forest/70">
          Choose blooms, tune each stem and petal shade, then wrap it all in fairy-finishing touches.
        </p>
      </div>

      {/* Recipes + size */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
        {SIZE_TIERS.map((s) => (
          <button
            key={s.id}
            onClick={() => update({ selectedSize: builder.selectedSize === s.id ? null : s.id })}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition active:scale-95 ${
              builder.selectedSize === s.id ? "border-transparent bg-gradient-to-r from-rosepetal to-blush text-white fuzzy-shadow" : "border-forest/20 bg-white/60 text-forest"
            }`}
          >
            {s.name} · ${s.price}
          </button>
        ))}
        <div className="mx-2 hidden h-6 w-px bg-forest/15 sm:block" />
        {RECIPES.map((r) => (
          <button
            key={r.name}
            onClick={() => applyRecipe(r.flowerIds)}
            className="inline-flex items-center gap-1.5 rounded-full border border-tang/40 bg-peach/70 px-4 py-2 text-sm font-medium text-forest transition hover:bg-peach active:scale-95"
          >
            <MagicWand weight="fill" className="h-4 w-4 text-tang" />
            {r.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Catalog */}
        <div className="space-y-6">
          {categories.map((cat) => (
            <div key={cat}>
              <h3 className="mb-3 font-fairy text-2xl text-rosepetal">{cat}</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {FLOWERS.filter((f) => f.category === cat).map((f) => {
                  const item = findItem(f.id);
                  return (
                    <motion.div
                      key={f.id}
                      layout
                      className={`rounded-2xl border p-4 transition ${item ? "border-rosepetal/50 bg-babypink/40" : "border-black/5 bg-white/70 hover:border-rosepetal/30"}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full" style={{ background: f.petalColor }} />
                            <h4 className="font-semibold text-forest">{f.name}</h4>
                          </div>
                          <p className="mt-1 text-xs text-forest/60">{f.description}</p>
                          <p className="mt-1 text-xs font-medium text-forest/50">
                            ${f.price} each · {f.stockCount} in stock
                          </p>
                        </div>
                        {!item ? (
                          <button
                            onClick={() => addFlower(f.id)}
                            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-mint to-sky text-forest transition active:scale-90"
                            aria-label={`Add ${f.name}`}
                          >
                            <Plus weight="bold" className="h-5 w-5" />
                          </button>
                        ) : (
                          <button onClick={() => removeFlower(f.id)} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blush/10 text-blush transition active:scale-90" aria-label="Remove">
                            <Trash weight="bold" className="h-5 w-5" />
                          </button>
                        )}
                      </div>

                      {item && (
                        <div className="mt-3 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-forest">Quantity</span>
                            <div className="flex items-center gap-2">
                              <button onClick={() => changeQty(f.id, -1)} className="grid h-7 w-7 place-items-center rounded-full bg-white text-forest shadow-sm active:scale-90"><Minus weight="bold" className="h-4 w-4" /></button>
                              <span className="w-6 text-center font-bold text-forest">{item.quantity}</span>
                                                             <button onClick={() => changeQty(f.id, 1)} className="grid h-7 w-7 place-items-center rounded-full bg-white text-forest shadow-sm active:scale-90"><Plus weight="bold" className="h-4 w-4" /></button>
                               <button onClick={() => changeQty(f.id, 5)} className="rounded-full bg-sage px-2 py-1 text-xs font-bold text-forest transition active:scale-90">+5</button>
                               <button onClick={() => changeQty(f.id, 10)} className="rounded-full bg-sage px-2 py-1 text-xs font-bold text-forest transition active:scale-90">+10</button>
                            </div>
                          </div>

                          <ColorRow label="Petal" value={item.petalColor} onChange={(hex) => patchItem(f.id, { petalColor: hex })} />
                          <ColorRow label="Stem" value={item.stemColor} onChange={(hex) => patchItem(f.id, { stemColor: hex })} />

                          <div className="flex flex-wrap gap-1.5">
                            {TEXTURE_MODES.map((t) => (
                              <button
                                key={t}
                                onClick={() => patchItem(f.id, { texture: t })}
                                className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${item.texture === t ? "bg-forest text-white" : "bg-sage text-forest"}`}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Finishing touches */}
        <div className="space-y-6">
          <Panel title="Wrapping Paper" icon={<Palette weight="fill" className="h-5 w-5 text-deepsea" />}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {WRAPPING_STYLES.map((w) => (
                <button
                  key={w.id}
                  onClick={() => update({ wrappingPaper: w.id })}
                  className={`relative overflow-hidden rounded-xl border-2 p-3 text-left transition active:scale-95 ${builder.wrappingPaper === w.id ? "border-rosepetal" : "border-transparent"}`}
                  style={{ background: w.gradient }}
                >
                  <span className="text-xs font-semibold text-forest">{w.name}</span>
                  <span className="block text-xs text-forest/60">+${w.price}</span>
                  {builder.wrappingPaper === w.id && <Check weight="bold" className="absolute right-2 top-2 h-4 w-4 text-blush" />}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Ribbon Trim" icon={<Sparkle weight="fill" className="h-5 w-5 text-tang" />}>
            <div className="flex flex-wrap gap-3">
              {RIBBON_COLORS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => update({ ribbonColor: r.id })}
                  className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition active:scale-95 ${builder.ribbonColor === r.id ? "border-rosepetal bg-babypink/50" : "border-black/10 bg-white/60"}`}
                >
                  <span className="h-4 w-4 rounded-full ring-2 ring-white" style={{ background: r.hex }} />
                  {r.name}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Fairy Add-ons" icon={<MagicWand weight="fill" className="h-5 w-5 text-rosepetal" />}>
            <div className="space-y-2">
              {ADD_ONS.map((a) => {
                const on = builder.addOns.includes(a.id);
                return (
                  <button
                    key={a.id}
                    onClick={() => toggleAddOn(a.id)}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition active:scale-[0.99] ${on ? "border-mint bg-sage/60" : "border-black/5 bg-white/60"}`}
                  >
                    <span>
                      <span className="block font-medium text-forest">{a.name}</span>
                      <span className="block text-xs text-forest/60">{a.description}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-forest/70">+${a.price}</span>
                      <span className={`grid h-6 w-6 place-items-center rounded-full ${on ? "bg-forest text-white" : "bg-black/5 text-transparent"}`}><Check weight="bold" className="h-4 w-4" /></span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Panel>

          <Panel title="Gift Note & Name" icon={<Palette weight="fill" className="h-5 w-5 text-blush" />}>
            <div className="space-y-3">
              <Field label="Bouquet name" value={builder.customName} onChange={(v) => update({ customName: v })} placeholder="My Fairy Bouquet" />
              <Field label="Recipient" value={builder.recipientName} onChange={(v) => update({ recipientName: v })} placeholder="For Amara" />
              <div>
                <label className="mb-1 block text-sm font-medium text-forest">Fairy wish note</label>
                <textarea
                  value={builder.giftNote}
                  onChange={(e) => update({ giftNote: e.target.value })}
                  rows={3}
                  maxLength={140}
                  placeholder="Wishing you a garden of small magics..."
                  className="w-full resize-none rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm text-forest outline-none focus:border-rosepetal"
                />
                <p className="mt-1 text-right text-xs text-forest/50">{builder.giftNote.length}/140</p>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </section>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (hex: string) => void }) {
  return (
    <div>
      <span className="mb-1 flex items-center gap-1 text-xs font-medium text-forest/70">
        <Palette weight="fill" className="h-3.5 w-3.5" /> {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {COLOR_SWATCHES.map((c) => (
          <button
            key={c.hex}
            title={c.name}
            onClick={() => onChange(c.hex)}
            className={`h-6 w-6 rounded-full ring-2 transition active:scale-90 ${value === c.hex ? "ring-forest" : "ring-white"}`}
            style={{ background: c.hex }}
          />
        ))}
      </div>
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl glass p-5">
      <h3 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-forest">{icon}{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-forest">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm text-forest outline-none focus:border-rosepetal"
      />
    </div>
  );
}