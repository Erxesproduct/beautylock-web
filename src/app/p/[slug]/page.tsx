import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyBox } from "@/components/buy-box";
import { Heart } from "@/components/deco";
import { Gallery } from "@/components/gallery";
import { ClockIcon, FlaskIcon, TruckIcon } from "@/components/icons";
import { ProductCard, tintOf } from "@/components/product-card";
import { Scroller } from "@/components/scroller";
import { business } from "@/content/business";
import { available, brandName, brands, byPopularity, concerns, getProduct, groups, kinds, ORIGIN_NAME, products, sku, steps } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { absoluteUrl } from "@/lib/site-url";

export const dynamicParams = false;
export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  const name = [brandName(p.brand), p.title].filter(Boolean).join(" ");
  const desc = [p.sub, p.details.find((d) => d.t === "p")?.x].filter(Boolean).join(". ").slice(0, 160) || `${name}: ${formatPrice(p.variants[0].price)}`;
  return { title: name, description: desc, alternates: { canonical: `/p/${p.slug}` }, openGraph: { images: p.images[0] ? [{ url: p.images[0].src }] : undefined } };
}

const SKIN = { dry: "Хуурай", oily: "Тослог", combo: "Холимог", normal: "Хэвийн", sensitive: "Эмзэг" } as Record<string, string>;

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const brand = brands.find((b) => b.id === p.brand);
  const name = [brand?.name, p.title].filter(Boolean).join(" ");
  const step = steps.find((s) => p.steps.includes(s.id) && !p.groups.includes("kids"));
  const stepIndex = step ? steps.indexOf(step) : -1;
  const nextStep = stepIndex >= 0 ? steps[(stepIndex + 1) % steps.length] : null;
  const group = groups.find((g) => p.groups.includes(g.id));
  const kind = kinds.find((k) => p.kinds.includes(k.id));
  const city = business.delivery[0];

  const related = products
    .filter((x) => x.slug !== p.slug && available(x))
    .map((x) => ({ x, score: (x.brand === p.brand ? 2 : 0) + x.concerns.filter((c) => p.concerns.includes(c)).length + (nextStep && x.steps.includes(nextStep.id) ? 2 : 0) + (x.groups[0] === p.groups[0] ? 1 : 0) }))
    .sort((a, b) => b.score - a.score || byPopularity(a.x, b.x))
    .slice(0, 10)
    .map(({ x }) => x);

  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    sku: sku(p.variants[0].id),
    brand: brand ? { "@type": "Brand", name: brand.name } : undefined,
    image: p.images.map((m) => absoluteUrl(m.src)),
    description: p.sub || undefined,
    offers: p.variants.map((v) => ({
      "@type": "Offer",
      priceCurrency: "MNT",
      price: v.price,
      sku: sku(v.id),
      availability: v.stock === 0 ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      url: absoluteUrl(`/p/${p.slug}`),
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <div className="wrap pt-6 md:pt-10">
        <nav className="flex flex-wrap gap-x-1.5 text-[13px] font-bold text-cocoa-2" aria-label="Зам">
          <Link href="/shop" className="hover:text-cherry">
            Дэлгүүр
          </Link>
          {group && (
            <>
              /
              <Link href={`/shop?g=${group.id}`} className="hover:text-cherry">
                {group.name}
              </Link>
            </>
          )}
          {kind && (
            <>
              /
              <Link href={`/shop?k=${kind.id}`} className="hover:text-cherry">
                {kind.name}
              </Link>
            </>
          )}
        </nav>

        <div className="mt-5 grid gap-8 md:grid-cols-2 lg:gap-14">
          <Gallery images={p.images} alt={name} tint={tintOf(p)} />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {brand && (
                <Link href={`/shop?b=${brand.id}`} className="sticker bg-straw text-cocoa hover:bg-straw-2">
                  {brand.name}
                  {brand.origin && <span className="font-semibold text-cocoa-2">· {ORIGIN_NAME[brand.origin]}</span>}
                </Link>
              )}
              {step && (
                <Link href={`/shop?st=${step.id}`} className="sticker text-cocoa" style={{ background: step.tint }}>
                  Алхам {stepIndex + 1}: {step.name}
                </Link>
              )}
            </div>
            <h1 className="mt-4 text-[32px] font-extrabold md:text-[42px]">{p.title}</h1>
            {p.sub && <p className="mt-2 text-[18px] text-cocoa-2">{p.sub}</p>}

            {(p.concerns.length > 0 || p.skinTypes.length > 0) && (
              <div className="mt-5 flex flex-wrap gap-2">
                {concerns
                  .filter((c) => p.concerns.includes(c.id))
                  .map((c) => (
                    <Link key={c.id} href={`/shop?c=${c.id}`} className="chip !min-h-8 !text-[13px]">
                      <Heart size={12} color="var(--color-bubble)" /> {c.name}
                    </Link>
                  ))}
              </div>
            )}

            <div className="mt-6">
              <BuyBox slug={p.slug} variants={p.variants} />
            </div>

            <ul className="mt-5 grid gap-2 text-[14px]">
              <li className="flex items-start gap-3 rounded-[20px] bg-mint/60 px-4 py-3">
                <TruckIcon size={20} className="mt-0.5 shrink-0" />
                <span>
                  <b>Маргааш нь хүргэнэ.</b> Хот дотор {formatPrice(city.fee)}, {formatPrice(city.freeFrom)}-өөс дээш үнэгүй. Орон нутагт унаа, шуудангаар.
                </span>
              </li>
              <li className="flex items-start gap-3 rounded-[20px] bg-butter/70 px-4 py-3">
                <ClockIcon size={20} className="mt-0.5 shrink-0" />
                <span>{business.rules.urgent}</span>
              </li>
              <li className="flex items-start gap-3 rounded-[20px] bg-lilac/70 px-4 py-3">
                <FlaskIcon size={20} className="mt-0.5 shrink-0" />
                <span>
                  Тохирох эсэхдээ эргэлзэж байна уу? <Link href="/info#stores" className="font-bold underline decoration-bubble decoration-2 underline-offset-2">Салбартаа</Link> үнэгүй оношлуулж, тест хийж үзээрэй.
                </span>
              </li>
            </ul>

            {p.details.length > 0 && (
              <section className="mt-8">
                <h2 className="text-[22px] font-bold">Тайлбар</h2>
                <div className="prose-bl mt-3 text-[15.5px] text-cocoa-2">
                  {p.details.map((d, i) => (d.t === "li" ? <ul key={i}><li>{d.x}</li></ul> : <p key={i}>{d.x}</p>))}
                </div>
              </section>
            )}
            {p.skinTypes.length > 0 && (
              <p className="mt-6 text-[13.5px] text-cocoa-3">
                Тохиромжтой байж болох арьс: {p.skinTypes.map((s) => SKIN[s]).join(", ")}. Энэ нь нэр, тайлбараас гаргасан чиглэл: арьсандаа тохирох эсэхийг салбартаа шалгуулаарай.
              </p>
            )}
            <p className="mt-2 text-[12.5px] text-cocoa-3">Код: {p.variants.map((v) => sku(v.id)).join(", ")}</p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="wrap mt-20">
          <p className="script text-[24px] text-cherry">{nextStep ? `Дараагийн алхам: ${nextStep.name}` : "Танд таалагдаж магадгүй"}</p>
          <h2 className="text-[28px] font-bold md:text-[36px]">Хамт хэрэглэвэл</h2>
          <Scroller label="Хамт хэрэглэвэл" className="no-bar -mx-4 mt-6 flex snap-x gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:gap-6 md:px-0">
            {related.map((x) => (
              <div key={x.slug} className="w-[46vw] max-w-[250px] shrink-0 snap-start sm:w-[220px]">
                <ProductCard p={x} />
              </div>
            ))}
          </Scroller>
        </section>
      )}
    </>
  );
}
