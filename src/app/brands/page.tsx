import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Confetti } from "@/components/deco";
import { ArrowIcon } from "@/components/icons";
import { brands, byPopularity, ORIGIN_NAME, products } from "@/lib/catalog";

export const metadata: Metadata = { title: "Брэндүүд", description: "Beauty Lock-ийн албан ёсны эрхтэй Солонгос, Вьетнамын арьс, үс арчилгааны брэндүүд.", alternates: { canonical: "/brands" } };

const TINTS = ["var(--color-straw)", "var(--color-mint)", "var(--color-butter)", "var(--color-lilac)", "var(--color-sky)", "var(--color-peach)"];

export default function Brands() {
  return (
    <>
      <section className="relative overflow-hidden bg-straw">
        <Confetti />
        <div className="wrap relative py-12 md:py-16">
          <p className="script text-[26px] text-cherry">Албан ёсны эрхтэй</p>
          <h1 className="text-[38px] font-extrabold md:text-[56px]">Брэндүүд</h1>
          <p className="mt-2 max-w-xl text-cocoa-2">Брэндээс нь шууд, Солонгос, Вьетнамаас. Брэнд бүрийн хамгийн их захиалсан бүтээгдэхүүнүүд.</p>
        </div>
      </section>
      <div className="scallop" />
      <div className="wrap mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((b, i) => {
          const top = products.filter((p) => p.brand === b.id).sort(byPopularity).slice(0, 3);
          return (
            <Link key={b.id} href={`/shop?b=${b.id}`} className="group relative flex flex-col overflow-hidden rounded-[32px] p-6 transition hover:-translate-y-1" style={{ background: TINTS[i % TINTS.length] }}>
              <span className="flex items-start justify-between gap-3">
                <span>
                  <span className="display block text-[26px] font-extrabold">{b.name}</span>
                  <span className="text-[13.5px] font-bold text-cocoa-2">
                    {b.count} бүтээгдэхүүн{b.origin ? ` · ${ORIGIN_NAME[b.origin]}` : ""}
                  </span>
                </span>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white transition group-hover:rotate-[-20deg] group-hover:bg-cocoa group-hover:text-milk">
                  <ArrowIcon size={18} />
                </span>
              </span>
              <span className="mt-6 flex gap-3">
                {top.map((p) => (
                  <span key={p.slug} className="relative aspect-square flex-1 overflow-hidden rounded-[20px] bg-white/80">
                    {p.images[0] && <Image src={p.images[0].thumb.src} alt="" fill sizes="120px" className="object-contain p-2 mix-blend-multiply" />}
                  </span>
                ))}
                {Array.from({ length: 3 - top.length }, (_, k) => (
                  <span key={k} className="flex-1" />
                ))}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
