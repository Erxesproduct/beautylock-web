import Image from "next/image";
import Link from "next/link";
import { business } from "@/content/business";
import { formatPrice } from "@/lib/format";
import { HeaderTools } from "./header-tools";
import { Heart, Sparkle } from "./deco";
import { Scroller } from "./scroller";

export const NAV = [
  { href: "/shop?g=skin", label: "Арьс арчилгаа" },
  { href: "/shop?g=makeup", label: "Нүүр будалт" },
  { href: "/shop?g=hair-body", label: "Үс, бие" },
  { href: "/shop?g=kids", label: "Хүүхдэд" },
  { href: "/shop?sale=1", label: "Хямдрал" },
  { href: "/brands", label: "Брэндүүд" },
  { href: "/skin-test", label: "Арьсны тест", hot: true },
];

export function Header() {
  const free = business.delivery[0].freeFrom;
  return (
    <header className="sticky top-0 z-40">
      <div className="bg-cherry text-[13px] font-bold text-white">
        <div className="wrap flex h-9 items-center justify-center gap-2 overflow-hidden whitespace-nowrap">
          <Heart size={13} color="#fff" />
          <span className="truncate">
            Маргааш нь хүргэнэ<span className="hidden sm:inline"> · {formatPrice(free)}-өөс дээш хүргэлт үнэгүй</span> · Салбартаа үнэгүй арьс оношилгоо
          </span>
          <Heart size={13} color="#fff" />
        </div>
      </div>
      <div className="border-b-2 border-line bg-milk/90 backdrop-blur-md">
        <div className="wrap flex h-[68px] items-center gap-4 md:h-[78px]">
          <Link href="/" className="group relative flex shrink-0 items-center" aria-label="Beauty Lock: нүүр хуудас">
            <Image src="/brand/logo.png" alt="beauty lock Ulaanbaatar" width={420} height={193} priority className="h-[50px] w-auto md:h-[60px]" />
            <Sparkle size={12} color="var(--color-bubble)" className="absolute -right-2 top-1 animate-twinkle" />
          </Link>
          <nav aria-label="Үндсэн цэс" className="ml-4 hidden flex-1 items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`display rounded-full px-3 py-2 text-[14.5px] font-semibold transition hover:bg-straw ${n.hot ? "bg-butter text-cocoa shadow-[0_3px_0_#f1cf6a]" : ""}`}
              >
                {n.hot && <span aria-hidden>✨ </span>}
                {n.label}
              </Link>
            ))}
          </nav>
          <HeaderTools />
        </div>
        <Scroller as="nav" label="Ангилал" small className="no-bar wrap flex gap-2 overflow-x-auto pb-3 lg:hidden">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={`chip shrink-0 ${n.hot ? "!border-[#f1cf6a] !bg-butter" : ""}`}>
              {n.hot && <span aria-hidden>✨</span>}
              {n.label}
            </Link>
          ))}
        </Scroller>
      </div>
    </header>
  );
}
