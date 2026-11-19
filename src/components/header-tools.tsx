"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cartCount, useCart } from "@/lib/cart";
import { getLiteVariant } from "@/lib/lite";
import { useHearts } from "@/lib/wishlist";
import { BagIcon, CloseIcon, HeartIcon, SearchIcon } from "./icons";

const btn = "relative grid h-11 w-11 place-items-center rounded-full bg-white text-cocoa shadow-[inset_0_0_0_2px_var(--color-line)] transition hover:bg-straw";

export function HeaderTools() {
  const items = useCart();
  const liked = useHearts();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [bump, setBump] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const n = cartCount(items);

  useEffect(() => {
    let t: number | undefined;
    const onAdd = (e: Event) => {
      const v = getLiteVariant((e as CustomEvent<{ id: string }>).detail.id);
      setToast(v ? `${v.n}${v.z ? ` (${v.z})` : ""}` : "Сагсанд нэмлээ");
      setBump((b) => b + 1);
      window.clearTimeout(t);
      t = window.setTimeout(() => setToast(null), 2600);
    };
    window.addEventListener("beautylock:added", onAdd);
    return () => {
      window.removeEventListener("beautylock:added", onAdd);
      window.clearTimeout(t);
    };
  }, []);
  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  return (
    <div className="ml-auto flex items-center gap-2">
      {open ? (
        <form
          role="search"
          className="pop flex items-center gap-1 rounded-full bg-white py-1 pr-1 pl-4 shadow-[inset_0_0_0_2px_var(--color-bubble)]"
          onSubmit={(e) => {
            e.preventDefault();
            const q = input.current?.value.trim();
            setOpen(false);
            router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
          }}
        >
          <input ref={input} name="q" placeholder="Тонер, серум, TFIT…" aria-label="Хайх" className="w-[38vw] max-w-[220px] bg-transparent text-[15px] outline-none" />
          <button type="button" onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-straw" aria-label="Хаах">
            <CloseIcon size={16} />
          </button>
        </form>
      ) : (
        <button type="button" onClick={() => setOpen(true)} className={btn} aria-label="Хайх">
          <SearchIcon size={19} />
        </button>
      )}
      <Link href="/hearts" className={`${btn} ${open ? "hidden sm:grid" : ""}`} aria-label={`Хадгалсан (${liked.length})`}>
        <HeartIcon size={19} filled={liked.length > 0} className={liked.length ? "text-cherry" : ""} />
      </Link>
      <Link href="/cart" className={`${btn} !bg-cocoa !text-milk !shadow-none`} aria-label={`Сагс (${n})`}>
        <BagIcon size={19} />
        {n > 0 && (
          <span key={bump} className="pop absolute -top-1 -right-1 grid h-[22px] min-w-[22px] place-items-center rounded-full bg-bubble px-1 text-[12px] font-extrabold text-white ring-2 ring-milk">
            {n}
          </span>
        )}
      </Link>
      {toast && (
        <div role="status" className="pop fixed top-[118px] right-4 z-50 flex max-w-[calc(100vw-32px)] items-center gap-3 rounded-[22px] bg-cocoa py-3 pr-4 pl-3 text-[14px] text-milk shadow-xl md:top-[132px]">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-bubble text-white">♥</span>
          <span className="min-w-0">
            <b className="block">Сагсанд нэмлээ</b>
            <span className="block truncate text-milk/75">{toast}</span>
          </span>
          <Link href="/cart" className="ml-2 shrink-0 rounded-full bg-milk px-3 py-1.5 font-bold text-cocoa">
            Сагс
          </Link>
        </div>
      )}
    </div>
  );
}
