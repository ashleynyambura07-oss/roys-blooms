import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  WhatsappLogo,
  InstagramLogo,
  TiktokLogo,
  Money,
  CheckCircle,
  Copy,
  Gift,
  Star,
  SealCheck,
  Phone,
  Envelope,
  FilePdf,
  Download,
  ArrowSquareOut,
} from "@phosphor-icons/react";
import {
  BRAND_NAME,
  WHATSAPP_NUMBER,
  MPESA_SEND_MONEY_PHONE,
  MPESA_RECIPIENT_NAME,
  DEPOSIT_RATE,
  INSTAGRAM_HANDLE,
  TIKTOK_HANDLE,
  INSTAGRAM_URL,
  TIKTOK_URL,
  FLOWERS,
  WRAPPING_STYLES,
  RIBBON_COLORS,
  ADD_ONS,
  SIZE_TIERS,
  computeCost,
  stemCount,
  depositSplit,
  CONTACT_PHONE,
  CONTACT_PHONE_TEL,
  CONTACT_EMAIL,
  FLOWER_CATALOGUE_URL,
  PRICE_LIST_URL,
  whatsappLink,
} from "../constants";
import type { BuilderState } from "../types";

interface SocialCheckoutProps {
  builder: BuilderState;
}

const REVIEWS = [
  { name: "Amara W.", text: "The chenille roses feel like velvet clouds. Guests thought they were real!", stars: 5, tone: "#f9a8d4" },
  { name: "Kevin O.", text: "Ordered the Grand Fairy Crown for my sister. The fairy lights are magical.", stars: 5, tone: "#7dd3fc" },
  { name: "Zuri M.", text: "Built a custom Ocean Breeze mix and it looked exactly like the preview.", stars: 4, tone: "#a7f3d0" },
];

export default function SocialCheckout({ builder }: SocialCheckoutProps) {
  const cost = useMemo(() => computeCost(builder), [builder]);
  const count = stemCount(builder);
  const split = depositSplit(cost.total);

  const orderMessage = useMemo(() => {
    const tier = SIZE_TIERS.find((s) => s.id === builder.selectedSize);
    const lines = [
      `*${builder.customName || "Fairy Bouquet"}* - ${BRAND_NAME}`,
      tier ? `Size: ${tier.name} ($${tier.price})` : "Size: Custom mix",
      `Stems: ${count}`,
      "",
      "Flowers:",
      ...builder.items.map((it) => {
        const f = FLOWERS.find((x) => x.id === it.flowerId);
        if (!f) return "";
        return `  - ${f.name} x${it.quantity} (petal ${it.petalColor}, stem ${it.stemColor}, ${it.texture})`;
      }),
      builder.items.length === 0 ? "  - (none selected)" : "",
      "",
      `Wrapping: ${WRAPPING_STYLES.find((w) => w.id === builder.wrappingPaper)?.name}`,
      `Ribbon: ${RIBBON_COLORS.find((r) => r.id === builder.ribbonColor)?.name}`,
      builder.addOns.length ? `Add-ons: ${builder.addOns.map((id) => ADD_ONS.find((a) => a.id === id)?.name).join(", ")}` : "Add-ons: none",
      builder.recipientName ? `Recipient: ${builder.recipientName}` : "",
      builder.giftNote ? `Note: ${builder.giftNote}` : "",
      "",
      `Total: $${split.total}`,
      `Deposit due now (${Math.round(DEPOSIT_RATE * 100)}%): $${split.deposit}`,
      `Balance on delivery: $${split.balance}`,
      `M-Pesa Send Money: ${MPESA_SEND_MONEY_PHONE} (${MPESA_RECIPIENT_NAME})`,
    ];
    return lines.filter((l) => l !== "").join(String.fromCharCode(10));
  }, [builder, count, split]);

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderMessage)}`;

  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="mb-8 text-center">
        <span className="font-fairy text-3xl text-tang">Make it yours</span>
        <h2 className="mt-1 font-display text-4xl font-bold text-forest md:text-5xl">Order &amp; Reserve</h2>
        <p className="mx-auto mt-3 max-w-[58ch] text-forest/70">
          Send your bouquet recipe to the florist, then lock in your slot with a {Math.round(DEPOSIT_RATE * 100)}% M-Pesa deposit.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* WhatsApp */}
        <div className="rounded-3xl glass p-6">
          <h3 className="flex items-center gap-2 font-display text-xl font-bold text-forest">
            <WhatsappLogo weight="fill" className="h-6 w-6 text-[#25D366]" /> WhatsApp Order
          </h3>
          <p className="mt-2 text-sm text-forest/70">Send your recipe straight to our florist with one tap. Custom requests are welcome in the same chat.</p>
          <pre className="mt-4 max-h-44 overflow-auto whitespace-pre-wrap rounded-2xl bg-white/70 p-3 text-xs text-forest/80">{orderMessage}</pre>
          <div className="mt-4 flex gap-2">
            <a href={waLink} target="_blank" rel="noreferrer" className="flex-1 rounded-full bg-[#25D366] px-4 py-3 text-center font-semibold text-white transition active:scale-[0.98]">
              Open WhatsApp
            </a>
            <button onClick={() => copyText(orderMessage, "Order summary")} aria-label="Copy order summary" className="grid h-12 w-12 place-items-center rounded-full bg-white text-forest shadow-sm transition active:scale-95">
              <Copy weight="fill" className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* M-Pesa deposit */}
        <MpesaPanel total={cost.total} />
      </div>

      {/* Social + QR */}
      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-3xl glass p-6 lg:col-span-1">
          <h3 className="font-display text-xl font-bold text-forest">Follow the fairy garden</h3>
          <div className="mt-4 space-y-3">
            <SocialRow icon={<InstagramLogo weight="fill" className="h-6 w-6 text-blush" />} handle={INSTAGRAM_HANDLE} onCopy={() => copyText(INSTAGRAM_HANDLE, "Instagram handle")} />
            <SocialRow icon={<TiktokLogo weight="fill" className="h-6 w-6 text-forest" />} handle={TIKTOK_HANDLE} onCopy={() => copyText(TIKTOK_HANDLE, "TikTok handle")} />
          </div>
          <div className="mt-5 flex gap-4">
            <QrCard label="Instagram" url={INSTAGRAM_URL} tone="#fb7185" />
            <QrCard label="TikTok" url={TIKTOK_URL} tone="#0284c7" />
          </div>
          <p className="mt-3 text-xs text-forest/50">Scan with your camera to open our profiles.</p>
        </div>

        {/* Reviews */}
        <div className="rounded-3xl glass p-6 lg:col-span-2">
          <h3 className="flex items-center gap-2 font-display text-xl font-bold text-forest">
            <SealCheck weight="fill" className="h-6 w-6 text-mint" /> Loved by fairy friends
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {REVIEWS.map((r) => (
              <div key={r.name} className="rounded-2xl border border-black/5 bg-white/70 p-4">
                <div className="flex items-center gap-2">
                  <span className="grid h-9 w-9 place-items-center rounded-full text-sm font-bold text-white" style={{ background: r.tone }}>{r.name[0]}</span>
                  <span className="font-semibold text-forest">{r.name}</span>
                </div>
                <div className="mt-2 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} weight={i < r.stars ? "fill" : "regular"} className={`h-4 w-4 ${i < r.stars ? "text-tang" : "text-black/15"}`} />
                  ))}
                </div>
                <p className="mt-2 text-sm text-forest/70">{r.text}</p>
              </div>
            ))}
          </div>
          <button onClick={() => copyText(`${window.location.origin}`, "Share link")} className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rosepetal to-tang px-5 py-2.5 text-sm font-semibold text-white transition active:scale-95">
            <Gift weight="fill" className="h-4 w-4" /> Copy share link
          </button>
        </div>
      </div>

      {/* Contact + catalogue */}
      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-3xl glass p-6">
          <h3 className="font-display text-xl font-bold text-forest">Direct contact</h3>
          <div className="mt-4 space-y-3">
            <a href={whatsappLink("Hi Roy's Blooms! I'd like to order a bouquet.")} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl bg-[#25D366] px-4 py-3 font-semibold text-white transition active:scale-[0.98]">
              <span className="flex items-center gap-2"><WhatsappLogo weight="fill" className="h-5 w-5" /> WhatsApp us</span>
              <ArrowSquareOut weight="bold" className="h-4 w-4" />
            </a>
            <a href={`tel:${CONTACT_PHONE_TEL}`} className="flex items-center justify-between rounded-2xl border border-black/5 bg-white/70 px-4 py-3 font-medium text-forest transition hover:bg-white active:scale-[0.98]">
              <span className="flex items-center gap-2"><Phone weight="fill" className="h-5 w-5 text-rosepetal" /> {CONTACT_PHONE}</span>
              <ArrowSquareOut weight="bold" className="h-4 w-4 text-forest/40" />
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center justify-between rounded-2xl border border-black/5 bg-white/70 px-4 py-3 font-medium text-forest transition hover:bg-white active:scale-[0.98]">
              <span className="flex items-center gap-2"><Envelope weight="fill" className="h-5 w-5 text-blush" /> {CONTACT_EMAIL}</span>
              <ArrowSquareOut weight="bold" className="h-4 w-4 text-forest/40" />
            </a>
          </div>
        </div>

        <div className="rounded-3xl glass p-6">
          <h3 className="font-display text-xl font-bold text-forest">Catalogue &amp; pricing</h3>
          <p className="mt-2 text-sm text-forest/70">Browse the full flower catalogue and bouquet price list while you design.</p>
          <div className="mt-4 space-y-3">
            <a href={FLOWER_CATALOGUE_URL} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-rosepetal to-blush px-4 py-3 font-semibold text-white transition active:scale-[0.98]">
              <span className="flex items-center gap-2"><FilePdf weight="fill" className="h-5 w-5" /> Flower Catalogue</span>
              <Download weight="bold" className="h-4 w-4" />
            </a>
            <a href={PRICE_LIST_URL} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-tang to-peach px-4 py-3 font-semibold text-white transition active:scale-[0.98]">
              <span className="flex items-center gap-2"><FilePdf weight="fill" className="h-5 w-5" /> Bouquet Price List</span>
              <Download weight="bold" className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function MpesaPanel({ total }: { total: number }) {
  const { deposit, balance } = depositSplit(total);
  const [code, setCode] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const confirm = () => {
    const clean = code.trim().toUpperCase();
    if (clean.length < 6) {
      toast.error("Enter the M-Pesa confirmation code from your SMS");
      return;
    }
    setConfirmed(true);
    toast.success(`Deposit of $${deposit} recorded. We will confirm on WhatsApp.`);
  };

  return (
    <div className="rounded-3xl glass p-6">
      <h3 className="flex items-center gap-2 font-display text-xl font-bold text-forest">
        <Money weight="fill" className="h-6 w-6 text-forest" /> M-Pesa Deposit
      </h3>
      <p className="mt-2 text-sm text-forest/70">
        A {Math.round(DEPOSIT_RATE * 100)}% deposit reserves your slot. Pay the balance when the bouquet is ready for collection.
      </p>

      <div className="mt-4 space-y-1.5 rounded-2xl bg-white/70 p-4 text-sm">
        <div className="flex items-center justify-between text-forest/70">
          <span>Bouquet total</span>
          <span className="font-semibold text-forest">${total}</span>
        </div>
        <div className="flex items-center justify-between text-forest/70">
          <span>Deposit due now ({Math.round(DEPOSIT_RATE * 100)}%)</span>
          <span className="font-display text-xl font-bold text-blush">${deposit}</span>
        </div>
        <div className="flex items-center justify-between text-forest/60">
          <span>Balance on delivery</span>
          <span className="font-medium text-forest">${balance}</span>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-mint bg-sage/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-forest/60">M-Pesa Send Money</p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <div>
            <p className="font-display text-lg font-bold text-forest">{MPESA_SEND_MONEY_PHONE}</p>
            <p className="text-xs text-forest/60">{MPESA_RECIPIENT_NAME}</p>
          </div>
          <button onClick={() => copyTextSafe(MPESA_SEND_MONEY_PHONE, "M-Pesa number")} aria-label="Copy M-Pesa number" className="grid h-9 w-9 place-items-center rounded-full bg-white text-forest shadow-sm transition active:scale-90">
            <Copy weight="fill" className="h-4 w-4" />
          </button>
        </div>
        <ol className="mt-3 space-y-1 text-xs text-forest/70">
          <li>1. Open M-Pesa and choose Send Money.</li>
          <li>2. Send ${deposit} to the number above.</li>
          <li>3. Paste the confirmation code below.</li>
        </ol>
      </div>

      {confirmed ? (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-sage/70 px-4 py-3 text-sm font-medium text-forest">
          <CheckCircle weight="fill" className="h-5 w-5 text-forest" /> Deposit ${deposit} pending confirmation
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="M-Pesa code e.g. SJ42KX9P"
            className="w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2.5 text-sm uppercase text-forest outline-none focus:border-mint"
          />
          <button onClick={confirm} className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white transition active:scale-[0.98]">
            Confirm deposit
          </button>
        </div>
      )}
    </div>
  );
}

function copyTextSafe(text: string, label: string) {
  navigator.clipboard
    .writeText(text)
    .then(() => toast.success(`${label} copied`))
    .catch(() => toast.error("Copy failed"));
}

function SocialRow({ icon, handle, onCopy }: { icon: React.ReactNode; handle: string; onCopy: () => void }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-black/5 bg-white/70 px-4 py-3">
      <span className="flex items-center gap-2 font-medium text-forest">{icon}{handle}</span>
      <button onClick={onCopy} aria-label={`Copy ${handle}`} className="grid h-8 w-8 place-items-center rounded-full bg-sage text-forest transition active:scale-90">
        <Copy weight="fill" className="h-4 w-4" />
      </button>
    </div>
  );
}

function QrCard({ label, url, tone }: { label: string; url: string; tone: string }) {
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=0&data=${encodeURIComponent(url)}`;
  return (
    <a href={url} target="_blank" rel="noreferrer" className="flex-1 rounded-2xl border border-black/5 bg-white p-3 transition hover:shadow-md active:scale-95">
      <img src={src} alt={`${label} QR code`} width={96} height={96} loading="lazy" className="mx-auto h-24 w-24" />
      <p className="mt-1 text-center text-xs font-semibold" style={{ color: tone }}>{label}</p>
    </a>
  );
}