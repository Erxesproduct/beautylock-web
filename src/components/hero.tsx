"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Banner = { src: string; w: number; h: number; href: string | null; title: string };

/** The shop's own Zochil banners, first thing on the home page, rotating every 6 s (paused on hover). */
export function BannerDeck({ banners }: { banners: Banner[] }) {
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  useEffect(() => {
    if (hold || banners.length < 2) return;
    const id = window.setInterval(() => setI((x) => (x + 1) % banners.length), 6000);
    return () => window.clearInterval(id);
  }, [hold, banners.length]);
  if (!banners.length) return null;
  return (
    <div className="relative" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)} onFocus={() => setHold(true)} onBlur={() => setHold(false)}>
      <div className="relative overflow-hidden rounded-[28px] bg-straw shadow-[0_8px_0_var(--color-straw-2)] md:rounded-[40px]" style={{ aspectRatio: `${banners[0].w} / ${banners[0].h}` }}>
        {banners.map((b, k) => {
          const img = <Image src={b.src} alt={b.title === "b2" ? "Beauty Lock баннер" : b.title} fill priority={k === 0} sizes="(min-width: 1240px) 1184px, 100vw" className="object-cover" />;
          return (
            <div key={b.src} className={`absolute inset-0 transition-opacity duration-700 ${k === i ? "opacity-100" : "pointer-events-none opacity-0"}`} aria-hidden={k !== i}>
              {b.href ? (
                <a href={b.href} target="_blank" rel="noopener noreferrer" tabIndex={k === i ? 0 : -1} className="absolute inset-0">
                  {img}
                </a>
              ) : (
                img
              )}
            </div>
          );
        })}
      </div>
      {banners.length > 1 && (
        <div className="absolute right-0 -bottom-9 left-0 flex justify-center gap-2">
          {banners.map((b, k) => (
            <button key={b.src} type="button" onClick={() => setI(k)} aria-label={`Баннер ${k + 1}`} aria-current={k === i} className={`h-3 rounded-full transition-all ${k === i ? "w-8 bg-cherry" : "w-3 bg-straw-2 hover:bg-bubble"}`} />
          ))}
        </div>
      )}
    </div>
  );
}
