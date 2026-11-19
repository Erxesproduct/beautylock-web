"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cart, maxQty } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { hearts, useHearts } from "@/lib/wishlist";
import { HeartIcon, MinusIcon, PlusIcon } from "./icons";

type V = { id: string; label: string | null; price: number; compareAt: number | null; stock: number | null };

export function BuyBox({ slug, variants }: { slug: string; variants: V[] }) {
  const router = useRouter();
  const first = variants.find((v) => v.stock !== 0) ?? variants[0];
  const [id, setId] = useState(first.id);
  const [qty, setQty] = useState(1);
  const liked = useHearts().includes(slug);
  const v = variants.find((x) => x.id === id) ?? first;
  const out = v.stock === 0;
  const cap = out ? 0 : Math.min(10, v.stock ?? 10);

  return (
    <div className="rounded-[30px] bg-white p-5 shadow-[inset_0_0_0_2px_var(--color-line)] md:p-6">
      <div className="flex items-baseline gap-3">
        <span className="display text-[34px] font-extrabold text-cherry">{formatPrice(v.price)}</span>
        {v.compareAt && (
          <>
            <s className="text-[17px] text-cocoa-3">{formatPrice(v.compareAt)}</s>
            <span className="sticker -rotate-3 bg-cherry text-white">-{Math.round((1 - v.price / v.compareAt) * 100)}%</span>
          </>
        )}
      </div>

      {variants.length > 1 && (
        <fieldset className="mt-5">
          <legend className="text-[14px] font-bold">Сонголт</legend>
          <div className="mt-2 flex flex-wrap gap-2" role="radiogroup">
            {variants.map((x) => (
              <button
                key={x.id}
                type="button"
                role="radio"
                aria-checked={x.id === id}
                disabled={x.stock === 0}
                onClick={() => {
                  setId(x.id);
                  setQty(1);
                }}
                className="chip disabled:line-through disabled:opacity-40"
              >
                {x.label} · {formatPrice(x.price)}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {out ? (
        <p className="mt-5 rounded-[18px] bg-cream px-4 py-3 text-[15px] font-bold text-cocoa-2">Одоогоор дууссан. Ирэх хугацааг утсаар лавлаарай.</p>
      ) : (
        <div className="mt-5 grid grid-cols-[auto_1fr] items-center gap-3 sm:grid-cols-[auto_1fr_auto]">
          <div className="flex h-14 items-center rounded-full bg-cream px-1">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-11 w-9 place-items-center rounded-full hover:bg-white sm:w-11" aria-label="Цөөлөх">
              <MinusIcon size={16} />
            </button>
            <span className="display w-8 text-center text-[18px] font-bold tabular-nums" aria-live="polite">
              {qty}
            </span>
            <button type="button" onClick={() => setQty((q) => Math.min(cap, q + 1))} disabled={qty >= cap} className="grid h-11 w-9 place-items-center rounded-full hover:bg-white disabled:opacity-30 sm:w-11" aria-label="Нэмэх">
              <PlusIcon size={16} />
            </button>
          </div>
          <button type="button" onClick={() => cart.add(v.id, qty)} disabled={maxQty(v.id) === 0} className="btn btn-cherry h-14 px-4 text-[15.5px] sm:px-6 sm:text-[16.5px]">
            Сагсанд нэмэх
          </button>
          <button
            type="button"
            onClick={() => hearts.toggle(slug)}
            aria-pressed={liked}
            aria-label={liked ? "Хадгалснаас хасах" : "Хадгалах"}
            className={`grid h-14 w-14 place-items-center justify-self-center rounded-full bg-white shadow-[inset_0_0_0_2px_var(--color-straw-2)] transition hover:bg-straw ${liked ? "text-cherry" : ""}`}
          >
            <HeartIcon size={22} filled={liked} />
          </button>
          <button
            type="button"
            onClick={() => {
              cart.add(v.id, qty);
              router.push("/cart");
            }}
            className="btn btn-cocoa h-14 sm:col-span-3 sm:h-12"
          >
            Шууд захиалах
          </button>
        </div>
      )}
    </div>
  );
}
