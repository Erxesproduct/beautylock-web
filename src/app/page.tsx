import Image from "next/image";
import Link from "next/link";
import { Confetti, Heart, LockMark, Sparkle } from "@/components/deco";
import { BannerDeck } from "@/components/hero";
import { ArrowIcon, ClockIcon, FlaskIcon, PinIcon, TruckIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { Scroller } from "@/components/scroller";
import { business } from "@/content/business";
import { available, banners, brandName, brands, concerns, popular, products, steps } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

const CONCERN_STYLE: Record<string, { bg: string; ring: string; mark: string }> = {
  bright: { bg: "var(--color-butter)", ring: "#f1cf6a", mark: "☀" },
  acne: { bg: "var(--color-mint)", ring: "#9fd9bf", mark: "✚" },
  pores: { bg: "var(--color-sky)", ring: "#a9cff2", mark: "◎" },
  aging: { bg: "var(--color-lilac)", ring: "#c6b3fb", mark: "✧" },
  hydrate: { bg: "#d5f3ff", ring: "#9fdcf2", mark: "💧" },
  calm: { bg: "var(--color-straw)", ring: "var(--color-straw-2)", mark: "❀" },
};

function Shelf({ title, kicker, href, list, ranked = false }: { title: string; kicker: string; href: string; list: typeof products; ranked?: boolean }) {
  return (
    <section className="wrap mt-24">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="script text-[24px] text-cherry">{kicker}</p>
          <h2 className="text-[30px] font-bold md:text-[40px]">{title}</h2>
        </div>
        <Link href={href} className="btn btn-soft hidden shrink-0 sm:inline-flex">
          Бүгдийг үзэх <ArrowIcon size={16} />
        </Link>
      </div>
      <Scroller label={title} className="no-bar -mx-4 mt-8 flex snap-x gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:gap-6 md:px-0">
        {list.map((p, i) => (
          <div key={p.slug} className="w-[46vw] max-w-[260px] shrink-0 snap-start sm:w-[230px]">
            <ProductCard p={p} rank={ranked && i < 3 ? i + 1 : undefined} />
          </div>
        ))}
      </Scroller>
      <Link href={href} className="btn btn-soft mt-4 w-full sm:hidden">
        Бүгдийг үзэх <ArrowIcon size={16} />
      </Link>
    </section>
  );
}

export default function Home() {
  const best = popular.filter(available).slice(0, 12);
  const trio = best.slice(0, 3);
  const makeup = popular.filter((p) => p.groups.includes("makeup") && available(p)).slice(0, 12);
  const kids = popular.filter((p) => p.groups.includes("kids") && available(p)).slice(0, 10);
  const city = business.delivery[0];

  return (
    <>
      <div className="wrap pt-6 md:pt-8">
        <BannerDeck banners={banners} />
      </div>

      {/* intro */}
      <section className="wrap relative mt-16 grid items-center gap-12 md:mt-20 lg:grid-cols-[1.05fr_1fr]">
        <div className="rise relative">
          <p className="script text-[28px] text-cherry md:text-[34px]">with love, Beauty Lock team</p>
          <h1 className="mt-2 text-[42px] font-extrabold md:text-[64px]">
            Арьсандаа <span className="relative inline-block text-cherry">тохирсоноо<Heart size={30} color="var(--color-bubble)" className="absolute -top-5 -right-6 rotate-12" /></span> олъё
          </h1>
          <p className="mt-5 max-w-xl text-[17px] text-cocoa-2">
            Солонгос, Вьетнамын арьс, үс арчилгааны брэндүүд албан ёсны эрхтэйгээр, брэндээс нь шууд. Хаана ч байсан маргааш нь хүргэнэ, салбартаа арьсаа үнэгүй оношлуулаарай.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/skin-test" className="btn btn-cherry h-14 px-7 text-[16.5px]">
              ✨ Арьсны тест хийх
            </Link>
            <Link href="/shop" className="btn btn-soft h-14 px-7 text-[16.5px]">
              Дэлгүүр хэсэх
            </Link>
          </div>
          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-3">
            {[
              [String(products.length), "бүтээгдэхүүн"],
              [String(brands.filter((b) => b.id !== "tools").length), "брэнд"],
              ["2", "салбар"],
            ].map(([n, t]) => (
              <div key={t} className="rounded-[22px] bg-white p-4 text-center shadow-[inset_0_0_0_2px_var(--color-line)]">
                <dt className="display text-[28px] font-extrabold text-cherry">{n}</dt>
                <dd className="text-[13px] font-bold text-cocoa-2">{t}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative mx-auto h-[400px] w-full max-w-[460px] md:h-[480px]">
          <div className="absolute inset-6 rounded-full gingham" aria-hidden />
          <Confetti dense />
          {trio.map((p, i) => {
            const pos = ["left-0 top-6 -rotate-6", "right-0 top-0 rotate-6", "left-1/2 bottom-0 -translate-x-1/2 rotate-2"][i];
            return (
              <Link key={p.slug} href={`/p/${p.slug}`} className={`absolute w-[52%] rounded-[22px] bg-white p-3 pb-4 shadow-[0_18px_40px_-18px_rgb(61_42_48/0.45)] transition hover:z-10 hover:scale-105 hover:rotate-0 ${pos}`}>
                <span className="relative block aspect-square overflow-hidden rounded-[16px] bg-cream">{p.images[0] && <Image src={p.images[0].thumb.src} alt="" fill sizes="240px" className="object-contain p-3 mix-blend-multiply" />}</span>
                <span className="mt-2 block truncate text-[13px] font-bold">
                  {brandName(p.brand)} {p.title}
                </span>
                <span className="display text-[14px] font-bold text-cherry">{formatPrice(p.variants[0].price)}</span>
                <span className="absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 -rotate-3 rounded-sm bg-straw-2/80" aria-hidden />
              </Link>
            );
          })}
        </div>
      </section>

      {/* promises */}
      <section className="wrap mt-20 grid gap-4 sm:grid-cols-3">
        {[
          [<TruckIcon key="t" size={24} />, "Маргааш нь хүргэнэ", `Хот дотор ${formatPrice(city.fee)}, ${formatPrice(city.freeFrom)}-өөс дээш үнэгүй. Орон нутагт унаа, шуудангаар.`, "var(--color-mint)"],
          [<FlaskIcon key="f" size={24} />, "Үнэгүй арьс оношилгоо", "Аппарат ба асуулгаар. Салбартаа будаггүй ирээрэй.", "var(--color-lilac)"],
          [<LockMark key="l" size={26} />, "Албан ёсны эрхтэй", "Брэндээс нь шууд, жинхэнэ бүтээгдэхүүн.", "var(--color-butter)"],
        ].map(([icon, t, d, bg]) => (
          <div key={t as string} className="flex gap-4 rounded-[28px] p-5" style={{ background: bg as string }}>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/80">{icon}</span>
            <span>
              <span className="display block text-[17px] font-bold">{t}</span>
              <span className="block text-[14px] text-cocoa-2">{d}</span>
            </span>
          </div>
        ))}
      </section>

      {/* concerns */}
      <section className="wrap mt-24 text-center">
        <p className="script text-[24px] text-cherry">Арьс тань юу хүсэж байна?</p>
        <h2 className="text-[30px] font-bold md:text-[40px]">Санаа зовоосноо сонгоорой</h2>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {concerns.map((c, i) => {
            const s = CONCERN_STYLE[c.id];
            return (
              <Link key={c.id} href={`/shop?c=${c.id}`} className="group flex flex-col items-center rounded-[30px] p-5 transition hover:-translate-y-1.5" style={{ background: s.bg, boxShadow: `0 6px 0 ${s.ring}` }}>
                <span className="grid h-16 w-16 place-items-center rounded-full bg-white text-[26px] transition group-hover:scale-110 group-hover:rotate-12" style={{ animationDelay: `${i * 0.2}s` }} aria-hidden>
                  {s.mark}
                </span>
                <span className="display mt-3 text-[16px] leading-tight font-bold">{c.name}</span>
                <span className="mt-1 text-[12.5px] text-cocoa-2">{c.line}</span>
                <span className="mt-2 rounded-full bg-white/80 px-2.5 py-0.5 text-[12px] font-bold">{c.count} бараа</span>
              </Link>
            );
          })}
        </div>
      </section>

      <Shelf title="Хамгийн их захиалсан" kicker="Бүгдийн дуртай" href="/shop?sort=popular" list={best} ranked />

      {/* routine */}
      <section className="relative mt-24">
        <div className="scallop" />
        <div className="relative bg-straw pt-12 pb-16">
          <Confetti />
          <div className="wrap relative">
            <div className="text-center">
              <p className="script text-[24px] text-cherry">Өглөө, орой</p>
              <h2 className="text-[30px] font-bold md:text-[40px]">Арчилгааны 6 алхам</h2>
              <p className="mx-auto mt-3 max-w-lg text-cocoa-2">Алхам бүрээс өөрт тохирохоо сонгоод «түгжээрэй». Маскыг долоо хоногт 2–3 удаа.</p>
            </div>
            <ol className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {steps.map((s, i) => (
                <li key={s.id}>
                  <Link href={`/shop?st=${s.id}`} className="group relative flex h-full flex-col items-center rounded-[28px] bg-white p-5 pt-8 text-center shadow-[0_6px_0_var(--color-straw-2)] transition hover:-translate-y-1">
                    <span className="display absolute -top-4 grid h-10 w-10 place-items-center rounded-full text-[18px] font-extrabold ring-4 ring-straw" style={{ background: s.tint }}>
                      {i + 1}
                    </span>
                    <span className="display text-[18px] font-bold">{s.name}</span>
                    <span className="mt-1 text-[13px] text-cocoa-2">{s.line}</span>
                    <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-bold text-cherry">
                      {s.count} бараа <ArrowIcon size={14} />
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="scallop-up" style={{ ["--sc" as string]: "var(--color-straw)", transform: "scaleY(-1)" }} />
      </section>

      {/* skin test + diagnosis */}
      <section className="wrap mt-20 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="gingham relative overflow-hidden rounded-[36px] p-8 md:p-12">
          <Confetti />
          <div className="relative max-w-md rounded-[28px] bg-white/92 p-7 shadow-[0_8px_0_var(--color-straw-2)]">
            <span className="sticker bg-butter text-cocoa">1 минут · 4 асуулт</span>
            <h2 className="mt-4 text-[30px] font-extrabold md:text-[36px]">Арьсны мини тест</h2>
            <p className="mt-3 text-cocoa-2">Арьсны төрөл, санаа зовоосон зүйлээ хэлээд манай бүтээгдэхүүнээс алхам алхмаар зөвлөмж аваарай.</p>
            <Link href="/skin-test" className="btn btn-cherry mt-6">
              Тест эхлэх <Sparkle size={16} color="#fff" />
            </Link>
          </div>
        </div>
        <div className="flex flex-col justify-between rounded-[36px] bg-lilac p-8 md:p-10">
          <div>
            <span className="grid h-14 w-14 place-items-center rounded-full bg-white">
              <FlaskIcon size={26} />
            </span>
            <h2 className="mt-5 text-[26px] font-bold md:text-[30px]">Салбартаа үнэгүй оношлуулаарай</h2>
            <p className="mt-3 text-[15px] text-cocoa-2">{business.rules.diagnosis}</p>
          </div>
          <div className="mt-6 grid gap-2">
            {business.branches.map((b) => (
              <a key={b.id} href={b.map} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-[20px] bg-white/80 px-4 py-3 transition hover:bg-white">
                <PinIcon size={18} className="shrink-0 text-cherry" />
                <span className="min-w-0 flex-1">
                  <b className="block text-[15px]">{b.name}</b>
                  <span className="flex items-center gap-1 text-[13px] text-cocoa-2">
                    <ClockIcon size={13} /> {b.hours}
                  </span>
                </span>
                <ArrowIcon size={16} />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* brands marquee */}
      <section className="mt-24 overflow-hidden" aria-label="Брэндүүд">
        <div className="wrap flex items-end justify-between gap-4">
          <h2 className="text-[30px] font-bold md:text-[40px]">Манай брэндүүд</h2>
          <Link href="/brands" className="inline-flex items-center gap-1 font-bold text-cherry hover:underline">
            Бүгд <ArrowIcon size={16} />
          </Link>
        </div>
        <div className="mt-8 flex w-max marquee gap-3 hover:[animation-play-state:paused]">
          {[0, 1].map((k) =>
            brands
              .filter((b) => b.id !== "tools")
              .map((b, i) => (
                <Link
                  key={`${k}-${b.id}`}
                  href={`/shop?b=${b.id}`}
                  tabIndex={k ? -1 : 0}
                  aria-hidden={k ? true : undefined}
                  className="display flex shrink-0 items-center gap-2 rounded-full px-6 py-3 text-[18px] font-bold transition hover:-translate-y-1"
                  style={{ background: ["var(--color-straw)", "var(--color-mint)", "var(--color-butter)", "var(--color-lilac)", "var(--color-sky)", "var(--color-peach)"][i % 6], transform: `rotate(${(i % 3) - 1}deg)` }}
                >
                  {b.name}
                  <span className="rounded-full bg-white/80 px-2 text-[12px]">{b.count}</span>
                </Link>
              )),
          )}
        </div>
      </section>

      <Shelf title="Нүүр будалт" kicker="Өө дарагч, праймер, уруул" href="/shop?g=makeup" list={makeup} />

      {/* kids corner */}
      <section className="wrap mt-24">
        <div className="relative overflow-hidden rounded-[40px] bg-butter p-6 md:p-12">
          <div className="dots absolute inset-0" aria-hidden />
          <div className="relative flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="sticker bg-white text-cocoa">Recipebox Kids</span>
              <h2 className="mt-3 text-[30px] font-extrabold md:text-[40px]">Бяцхан хайртуудад</h2>
              <p className="mt-2 max-w-md text-cocoa-2">Нярай, хүүхдийн зөөлөн угаагч, нарны тос, шампунь, хөөрхөн уруулын будаг.</p>
            </div>
            <Link href="/shop?g=kids" className="btn btn-cocoa">
              Хүүхдийн бүгд <ArrowIcon size={16} />
            </Link>
          </div>
          <Scroller label="Хүүхдэд" className="no-bar relative -mx-6 mt-8 flex snap-x gap-4 overflow-x-auto px-6 pb-2 md:mx-0 md:px-0">
            {kids.map((p) => (
              <div key={p.slug} className="w-[44vw] max-w-[220px] shrink-0 snap-start rounded-[30px] bg-white/70 p-2 pb-4 sm:w-[200px]">
                <ProductCard p={p} />
              </div>
            ))}
          </Scroller>
        </div>
      </section>

      {/* about */}
      <section className="wrap mt-24 grid items-center gap-10 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-[36px] shadow-[0_8px_0_var(--color-straw-2)]">
          <Image src="/brand/banner-30985.webp" alt="Beauty Lock: бүтээгдэхүүн, хэрэглэгчид" width={1200} height={300} sizes="(min-width: 1024px) 600px, 100vw" className="h-[260px] w-full object-cover md:h-[340px]" />
        </div>
        <div>
          <p className="script text-[26px] text-cherry">Бидний тухай</p>
          <h2 className="text-[30px] font-bold md:text-[38px]">Брэндээс нь шууд таны гарт</h2>
          <div className="mt-4 space-y-3 text-[16px] text-cocoa-2">
            {business.about.slice(0, 3).map((t) => (
              <p key={t}>{t}</p>
            ))}
          </div>
          <Link href="/info" className="btn btn-soft mt-6">
            Хүргэлт, төлбөр, асуулт <ArrowIcon size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
