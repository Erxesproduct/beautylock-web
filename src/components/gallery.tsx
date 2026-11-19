"use client";

import Image from "next/image";
import { useState } from "react";

type Photo = { src: string; w: number; h: number; thumb: { src: string } };

export function Gallery({ images, alt, tint }: { images: Photo[]; alt: string; tint: string }) {
  const [i, setI] = useState(0);
  const cur = images[i];
  return (
    <div className="md:sticky md:top-36">
      <div className="relative aspect-square overflow-hidden rounded-[36px]" style={{ background: tint }}>
        <span className="absolute inset-[7%] rounded-[45%_55%_50%_50%/55%_45%_55%_45%] bg-white/80" aria-hidden />
        {cur && <Image key={cur.src} src={cur.src} alt={alt} fill priority sizes="(min-width: 1024px) 560px, 100vw" className="pop object-contain p-[9%] mix-blend-multiply" />}
      </div>
      {images.length > 1 && (
        <div className="mt-4 flex gap-3">
          {images.map((m, k) => (
            <button key={m.src} type="button" onClick={() => setI(k)} aria-label={`Зураг ${k + 1}`} aria-current={k === i} className={`relative h-20 w-20 overflow-hidden rounded-[20px] bg-white transition ${k === i ? "ring-3 ring-cherry" : "ring-2 ring-line hover:ring-bubble"}`}>
              <Image src={m.thumb.src} alt="" fill sizes="80px" className="object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
