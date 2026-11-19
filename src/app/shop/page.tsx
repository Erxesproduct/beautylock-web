import type { Metadata } from "next";
import Link from "next/link";
import { Confetti } from "@/components/deco";
import { CloseIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { Scroller } from "@/components/scroller";
import { available, brandName, brands, byPopularity, concerns, fromPrice, groups, kinds, onSale, products, steps, type Product } from "@/lib/catalog";

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

const SORTS = [
  ["popular", "Эрэлттэй"],
  ["new", "Шинэ"],
  ["price-asc", "Хямдаас"],
  ["price-desc", "Үнэтэйгээс"],
] as const;

function titleOf(q: Record<string, string>) {
  if (q.q) return `«${q.q}»`;
  if (q.k) return kinds.find((k) => k.id === q.k)?.name;
  if (q.st) return steps.find((s) => s.id === q.st)?.name;
  if (q.c) return concerns.find((c) => c.id === q.c)?.name;
  if (q.b) return brandName(q.b);
  if (q.g) return groups.find((g) => g.id === q.g)?.name;
  if (q.sale) return "Хямдрал";
  return null;
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<SP> }): Promise<Metadata> {
  const sp = await searchParams;
  const q = Object.fromEntries(["g", "st", "k", "c", "b", "q", "sale"].map((k) => [k, one(sp[k])]));
  const t = titleOf(q);
  return { title: t ? `${t}: дэлгүүр` : "Дэлгүүр", alternates: { canonical: "/shop" } };
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-zа-яёөү0-9]+/gi, " ").trim();

export default async function Shop({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const q = Object.fromEntries(["g", "st", "k", "c", "b", "q", "sale", "sort"].map((k) => [k, one(sp[k]).slice(0, 60)]));
  const sort = SORTS.some(([id]) => id === q.sort) ? q.sort : "popular";

  const match = (p: Product, skip?: string) =>
    (skip === "g" || !q.g || p.groups.includes(q.g)) &&
    (skip === "st" || !q.st || (p.steps.includes(q.st) && !p.groups.includes("kids"))) &&
    (!q.k || p.kinds.includes(q.k)) &&
    (skip === "c" || !q.c || p.concerns.includes(q.c)) &&
    (skip === "b" || !q.b || p.brand === q.b) &&
    (!q.sale || onSale(p)) &&
    (!q.q || norm(`${brandName(p.brand) ?? ""} ${p.title} ${p.sub} ${p.zochilName}`).includes(norm(q.q)));

  const list = products.filter((p) => match(p));
  list.sort((a, b) => {
    const av = Number(available(b)) - Number(available(a));
    if (av) return av;
    if (sort === "new") return b.createdAt.localeCompare(a.createdAt);
    if (sort === "price-asc") return fromPrice(a) - fromPrice(b);
    if (sort === "price-desc") return fromPrice(b) - fromPrice(a);
    return byPopularity(a, b);
  });

  const href = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...q, ...patch })) if (v) next.set(k, v);
    const s = next.toString();
    return s ? `/shop?${s}` : "/shop";
  };
  const title = titleOf(q) ?? "Бүх бүтээгдэхүүн";
  const active = (["g", "st", "k", "c", "b", "q", "sale"] as const).filter((k) => q[k]);
  const label = (k: string) => (k === "sale" ? "Хямдрал" : k === "q" ? `«${q.q}»` : titleOf({ [k]: q[k] }));

  const row = (name: string, key: "g" | "st" | "c" | "b", items: { id: string; name: string }[]) => (
    <Scroller label={name} small className="no-bar flex gap-2 overflow-x-auto py-1">
      <span className="eyebrow mr-1 shrink-0 self-center text-cocoa-3">{name}</span>
      {items.map((it) => {
        const n = products.filter((p) => match(p, key) && (key === "g" ? p.groups.includes(it.id) : key === "st" ? p.steps.includes(it.id) && !p.groups.includes("kids") : key === "c" ? p.concerns.includes(it.id) : p.brand === it.id)).length;
        if (!n && q[key] !== it.id) return null;
        return (
          <Link key={it.id} href={href({ [key]: q[key] === it.id ? null : it.id, k: key === "st" || key === "g" ? null : q.k })} aria-current={q[key] === it.id} className="chip shrink-0" scroll={false}>
            {it.name}
            <span className="text-[12px] opacity-60">{n}</span>
          </Link>
        );
      })}
    </Scroller>
  );

  return (
    <>
      <section className="relative overflow-hidden bg-straw">
        <Confetti />
        <div className="wrap relative py-10 md:py-14">
          <nav className="text-[13px] font-bold text-cocoa-2" aria-label="Зам">
            <Link href="/" className="hover:text-cherry">
              Нүүр
            </Link>{" "}
            / <Link href="/shop" className="hover:text-cherry">Дэлгүүр</Link>
          </nav>
          <h1 className="mt-2 text-[36px] font-extrabold md:text-[52px]">{title}</h1>
          <p className="mt-1 font-bold text-cocoa-2">{list.length} бүтээгдэхүүн</p>
          {active.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {active.map((k) => (
                <Link key={k} href={href({ [k]: null })} className="chip !border-cocoa !bg-cocoa !text-milk" scroll={false}>
                  {label(k)} <CloseIcon size={14} />
                </Link>
              ))}
              <Link href="/shop" className="chip">
                Бүгдийг арилгах
              </Link>
            </div>
          )}
        </div>
      </section>
      <div className="scallop" />

      <div className="wrap mt-6 space-y-2">
        {row("Төрөл", "g", groups)}
        {(!q.g || q.g === "skin") && row("Алхам", "st", steps)}
        {row("Асуудал", "c", concerns)}
        {row("Брэнд", "b", brands)}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="eyebrow mr-1 text-cocoa-3">Эрэмбэ</span>
          {SORTS.map(([id, name]) => (
            <Link key={id} href={href({ sort: id === "popular" ? null : id })} aria-current={sort === id} className="chip" scroll={false}>
              {name}
            </Link>
          ))}
          <Link href={href({ sale: q.sale ? null : "1" })} aria-pressed={!!q.sale} className="chip" scroll={false}>
            Хямдралтай
          </Link>
        </div>
      </div>

      <section className="wrap mt-8">
        {list.length ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 md:gap-x-6">
            {list.map((p, i) => (
              <ProductCard key={p.slug} p={p} priority={i < 4} />
            ))}
          </div>
        ) : (
          <div className="card mx-auto max-w-md p-10 text-center">
            <p className="display text-[24px] font-bold">Олдсонгүй</p>
            <p className="mt-2 text-cocoa-2">Шүүлтүүрээ багасгаад үзээрэй, эсвэл бидэнтэй холбогдоорой.</p>
            <Link href="/shop" className="btn btn-cherry mt-6">
              Бүх бүтээгдэхүүн
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
