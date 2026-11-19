"use client";

import { useState } from "react";
import { cart } from "@/lib/cart";
import { hearts, useHearts } from "@/lib/wishlist";
import { HeartIcon, PlusIcon } from "./icons";

/** Heart («lock it») and quick add, floating on the product photo. Products with options open their page instead. */
export function CardActions({ slug, variantId }: { slug: string; variantId: string | null }) {
  const liked = useHearts().includes(slug);
  const [burst, setBurst] = useState(0);
  return (
    <div className="absolute top-3 right-3 flex flex-col gap-2">
      <button
        type="button"
        onClick={() => {
          if (!liked) setBurst((b) => b + 1);
          hearts.toggle(slug);
        }}
        aria-pressed={liked}
        aria-label={liked ? "Хадгалснаас хасах" : "Хадгалах"}
        className={`relative grid h-10 w-10 place-items-center rounded-full bg-white shadow-[0_3px_0_var(--color-line)] transition hover:scale-110 ${liked ? "text-cherry" : "text-cocoa-2"}`}
      >
        <HeartIcon size={18} filled={liked} />
        {burst > 0 && liked && (
          <span key={burst} aria-hidden>
            {[-14, 0, 14].map((dx) => (
              <span key={dx} className="absolute top-0 left-1/2 text-[12px] text-bubble" style={{ animation: "heart-burst .8s ease-out forwards", ["--dx" as string]: `${dx}px` }}>
                ♥
              </span>
            ))}
          </span>
        )}
      </button>
      {variantId && (
        <button type="button" onClick={() => cart.add(variantId)} aria-label="Сагсанд нэмэх" className="grid h-10 w-10 place-items-center rounded-full bg-cocoa text-milk shadow-[0_3px_0_#24171b] transition hover:scale-110 hover:bg-cherry md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100">
          <PlusIcon size={18} />
        </button>
      )}
    </div>
  );
}
