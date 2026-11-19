import Image from "next/image";
import Link from "next/link";
import { available, brandName, onSale, type Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { CardActions } from "./card-actions";

/** Pastel tile colour per routine step / group, so the grid reads like a candy box. */
const TINT: Record<string, string> = {
  cleanse: "var(--color-mint)",
  tone: "var(--color-lilac)",
  treat: "var(--color-butter)",
  care: "var(--color-straw)",
  protect: "var(--color-peach)",
  mask: "var(--color-sky)",
  makeup: "var(--color-straw)",
  "hair-body": "var(--color-mint)",
  kids: "var(--color-butter)",
  men: "var(--color-sky)",
  tools: "var(--color-lilac)",
};
export const tintOf = (p: Product) => TINT[p.steps[0]] ?? TINT[p.groups[0]] ?? "var(--color-straw)";

export function ProductCard({ p, priority = false, rank }: { p: Product; priority?: boolean; rank?: number }) {
  const v = p.variants[0];
  const img = p.images[0];
  const ok = available(p);
  const sale = onSale(p);
  return (
    <article className="group wiggle-hover relative flex h-full flex-col">
      <Link href={`/p/${p.slug}`} className="relative block aspect-[4/5] overflow-hidden rounded-[28px] transition duration-300 group-hover:-translate-y-1" style={{ background: tintOf(p) }}>
        <span className="absolute inset-[9%] rounded-[45%_55%_50%_50%/55%_45%_55%_45%] bg-white/75 transition duration-500 group-hover:rotate-12" aria-hidden />
        {img && <Image src={img.thumb.src} alt={`${brandName(p.brand) ?? ""} ${p.title}`.trim()} fill priority={priority} sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw" className={`object-contain p-[12%] mix-blend-multiply transition duration-500 group-hover:scale-105 ${ok ? "" : "opacity-50 grayscale"}`} />}
        <span className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {rank != null && <span className="sticker wiggle-me bg-cocoa text-milk">#{rank} хит</span>}
          {sale && ok && <span className="sticker -rotate-3 bg-cherry text-white">Хямдрал</span>}
          {!ok && <span className="sticker bg-white text-cocoa-2">Дууссан</span>}
          {p.variants.length > 1 && <span className="sticker bg-white/90 text-cocoa">{p.variants.length} сонголт</span>}
        </span>
      </Link>
      <CardActions slug={p.slug} variantId={p.variants.length === 1 && ok ? v.id : null} />
      <div className="mt-3 flex flex-1 flex-col px-1">
        {p.brand && <span className="eyebrow text-[11px] text-cocoa-3">{brandName(p.brand)}</span>}
        <Link href={`/p/${p.slug}`} className="display mt-0.5 line-clamp-2 text-[15.5px] leading-snug font-semibold hover:text-cherry">
          {p.title}
        </Link>
        {p.sub && <span className="mt-0.5 line-clamp-1 text-[13px] text-cocoa-2">{p.sub}</span>}
        <span className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="display text-[17px] font-bold text-cherry">
            {p.variants.length > 1 && <span className="text-[12px] font-semibold text-cocoa-2">-с </span>}
            {formatPrice(v.price)}
          </span>
          {v.compareAt && <s className="text-[13px] text-cocoa-3">{formatPrice(v.compareAt)}</s>}
        </span>
      </div>
    </article>
  );
}
