"use client";

import Image from "next/image";
import Link from "next/link";
import { cart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { liteProducts } from "@/lib/lite";
import { hearts, useHearts } from "@/lib/wishlist";
import { Heart } from "./deco";
import { HeartIcon, PlusIcon } from "./icons";

export function HeartsView() {
  const slugs = useHearts();
  const list = slugs.flatMap((s) => liteProducts.filter((p) => p.s === s));
  if (!list.length)
    return (
      <div className="card mx-auto mt-10 max-w-md p-10 text-center">
        <Heart size={56} color="var(--color-straw-2)" className="mx-auto" />
        <p className="display mt-4 text-[24px] font-bold">Одоохондоо хоосон</p>
        <p className="mt-2 text-cocoa-2">Таалагдсан бүтээгдэхүүн дээрх ♥-г дараад энд хадгалаарай. Энэ төхөөрөмж дээр хадгалагдана.</p>
        <Link href="/shop" className="btn btn-cherry mt-6">
          Дэлгүүр хэсэх
        </Link>
      </div>
    );
  return (
    <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((p) => (
        <li key={p.s} className="flex gap-4 rounded-[26px] bg-white p-4 shadow-[inset_0_0_0_2px_var(--color-line)]">
          <Link href={`/p/${p.s}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[20px] bg-straw">
            {p.t && <Image src={p.t} alt="" fill sizes="96px" className="object-contain p-2 mix-blend-multiply" />}
          </Link>
          <div className="flex min-w-0 flex-1 flex-col">
            {p.b && <span className="eyebrow text-[11px] text-cocoa-3">{p.b}</span>}
            <Link href={`/p/${p.s}`} className="display line-clamp-2 leading-snug font-semibold hover:text-cherry">
              {p.n}
            </Link>
            <span className="mt-auto flex items-center gap-2 pt-1">
              <b className="display mr-auto text-cherry">{formatPrice(p.p)}</b>
              <button type="button" onClick={() => hearts.toggle(p.s)} className="grid h-9 w-9 place-items-center rounded-full text-cherry hover:bg-straw" aria-label="Хасах">
                <HeartIcon size={18} filled />
              </button>
              {p.v && p.a ? (
                <button type="button" onClick={() => cart.add(p.v!)} className="grid h-9 w-9 place-items-center rounded-full bg-cocoa text-milk hover:bg-cherry" aria-label="Сагсанд нэмэх">
                  <PlusIcon size={16} />
                </button>
              ) : (
                <Link href={`/p/${p.s}`} className="rounded-full bg-cream px-3 py-1.5 text-[13px] font-bold">
                  {p.a ? "Сонгох" : "Дууссан"}
                </Link>
              )}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
