"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { cart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { liteProducts, type LiteProduct } from "@/lib/lite";
import { Confetti, Heart, Sparkle } from "./deco";
import { ArrowIcon, CheckIcon, PlusIcon } from "./icons";

type Skin = "dry" | "normal" | "combo" | "oily";
type Style = "simple" | "full" | "makeup";
type Step = { id: string; name: string; tint: string };
type Concern = { id: string; name: string };

const SKIN: { id: Skin; title: string; text: string; emoji: string }[] = [
  { id: "dry", title: "Татагдаж, хуурай", text: "Угаасны дараа чангарч, хальслах үе бий", emoji: "🌵" },
  { id: "normal", title: "Тав тухтай, хэвийн", text: "Тийм ч хуурай, тослог биш", emoji: "🌸" },
  { id: "combo", title: "Т бүс тослог", text: "Дух, хамар гялалзаж, хацар хуурай", emoji: "🍑" },
  { id: "oily", title: "Бүхэлдээ гялалзана", text: "Үд гэхэд нүүр тослог болдог", emoji: "✨" },
];
const SENS = [
  { id: "yes", title: "Амархан улайж, загатнадаг", emoji: "🥺" },
  { id: "some", title: "Заримдаа", emoji: "🙂" },
  { id: "no", title: "Бараг үгүй", emoji: "💪" },
];
const STYLE: { id: Style; title: string; text: string }[] = [
  { id: "simple", title: "Энгийн, хурдан", text: "Цэвэрлэх, чийгшүүлэх, нарны тос" },
  { id: "full", title: "Бүтэн арчилгаа", text: "Тонер, серум, маск ч бас" },
  { id: "makeup", title: "Будалттай хамт", text: "Арчилгаа + праймер, күшн" },
];
const RESULT: Record<Skin, { name: string; text: string }> = {
  dry: { name: "Хуурай арьс", text: "Чийгээ барьж чадахгүй байгаа арьсанд зөөлөн цэвэрлэгч, давхарлаж түрхэх чийгшүүлэгч хамгийн чухал." },
  normal: { name: "Хэвийн арьс", text: "Тэнцвэртэй арьсаа хадгалахад зөөлөн цэвэрлэгээ, чийгшүүлэлт, өдөр бүрийн нарны тос л хангалттай." },
  combo: { name: "Холимог арьс", text: "Т бүсийн тослогийг цэвэрлэж, хацрыг чийгшүүлэх тэнцвэр хэрэгтэй." },
  oily: { name: "Тослог арьс", text: "Нүхжилтийг цэвэрлэж, хөнгөн бүтэцтэй чийгшүүлэгчээр тосны тэнцвэрийг барина." },
};

function Option({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`relative flex w-full items-center gap-4 rounded-[24px] p-4 text-left transition hover:-translate-y-0.5 ${on ? "bg-cocoa text-milk shadow-[0_5px_0_#24171b]" : "bg-white shadow-[inset_0_0_0_2px_var(--color-line),0_5px_0_var(--color-line)]"}`}
    >
      {children}
      {on && (
        <span className="pop ml-auto grid h-7 w-7 shrink-0 place-items-center rounded-full bg-bubble text-white">
          <CheckIcon size={16} />
        </span>
      )}
    </button>
  );
}

export function SkinTest({ steps, concerns }: { steps: Step[]; concerns: Concern[] }) {
  const [q, setQ] = useState(0);
  const [skin, setSkin] = useState<Skin | null>(null);
  const [sens, setSens] = useState<string | null>(null);
  const [worry, setWorry] = useState<string[]>([]);
  const [style, setStyle] = useState<Style | null>(null);
  const [added, setAdded] = useState(false);

  const done = q === 4 && skin && sens && style;

  const plan = useMemo(() => {
    if (!skin || !style) return [];
    const want = new Set(worry);
    if (sens === "yes") want.add("calm");
    if (skin === "dry") want.add("hydrate");
    if (skin === "oily" || skin === "combo") want.add("pores");
    const pool = liteProducts.filter((p) => p.a && !p.g.includes("kids") && !p.g.includes("men") && p.v);
    const score = (p: LiteProduct) =>
      p.c.filter((c) => want.has(c)).length * 3 +
      p.c.filter((c) => worry.includes(c)).length * 2 +
      Math.min(3, p.r / 40) -
      (sens === "yes" && /aha|bha|peel|retinol|spicule|tingle/i.test(p.n) ? 6 : 0);
    const pick = (f: (p: LiteProduct) => boolean) => pool.filter(f).sort((a, b) => score(b) - score(a))[0];
    const ids = style === "simple" ? ["cleanse", "care", "protect"] : ["cleanse", "tone", "treat", "care", "protect", "mask"];
    const out: { step: Step; p: LiteProduct }[] = [];
    for (const id of ids) {
      const step = steps.find((s) => s.id === id);
      const p = pick((x) => x.st.includes(id));
      if (step && p) out.push({ step, p });
    }
    if (style === "makeup") {
      const primer = pick((x) => x.g.includes("makeup") && /primer|праймер|base/i.test(`${x.n} ${x.m}`));
      const baseP = pick((x) => x.g.includes("makeup") && /cushion|foundation|concea|bb|күшн/i.test(`${x.n} ${x.m}`));
      if (primer) out.push({ step: { id: "primer", name: "Праймер", tint: "var(--color-straw)" }, p: primer });
      if (baseP) out.push({ step: { id: "base", name: "Суурь будалт", tint: "var(--color-peach)" }, p: baseP });
    }
    return out;
  }, [skin, sens, worry, style, steps]);

  const total = plan.reduce((s, x) => s + x.p.p, 0);
  const progress = done ? 100 : (q / 4) * 100;

  if (done)
    return (
      <div className="pop">
        <div className="relative overflow-hidden rounded-[36px] bg-straw p-7 text-center md:p-12">
          <Confetti dense />
          <p className="script relative text-[26px] text-cherry">Таны арьс</p>
          <h2 className="relative text-[40px] font-extrabold md:text-[56px]">{RESULT[skin].name}</h2>
          {sens === "yes" && <p className="sticker relative mt-2 bg-white text-cocoa">+ эмзэг, мэдрэмтгий</p>}
          <p className="relative mx-auto mt-4 max-w-xl text-[16px] text-cocoa-2">{RESULT[skin].text}</p>
          {worry.length > 0 && (
            <p className="relative mt-3 text-[14px] font-bold">
              Анхаарах:{" "}
              {concerns
                .filter((c) => worry.includes(c.id))
                .map((c) => c.name)
                .join(", ")}
            </p>
          )}
        </div>

        <h3 className="mt-12 text-[26px] font-bold">Таны {plan.length} алхам</h3>
        <ol className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plan.map(({ step, p }, i) => (
            <li key={step.id} className="rise flex gap-4 rounded-[26px] bg-white p-4 shadow-[inset_0_0_0_2px_var(--color-line)]" style={{ animationDelay: `${i * 0.08}s` }}>
              <Link href={`/p/${p.s}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[20px]" style={{ background: step.tint }}>
                {p.t && <Image src={p.t} alt="" fill sizes="96px" className="object-contain p-2 mix-blend-multiply" />}
                <span className="display absolute top-1 left-1 grid h-7 w-7 place-items-center rounded-full bg-white text-[13px] font-extrabold">{i + 1}</span>
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="eyebrow text-[11px] text-cherry">{step.name}</span>
                <Link href={`/p/${p.s}`} className="display line-clamp-2 text-[15px] leading-snug font-semibold hover:text-cherry">
                  {p.b} {p.n}
                </Link>
                <span className="mt-auto flex items-center justify-between pt-1">
                  <b className="display text-cherry">{formatPrice(p.p)}</b>
                  {p.v && (
                    <button
                      type="button"
                      onClick={() => cart.add(p.v!)}
                      className="grid h-9 w-9 place-items-center rounded-full bg-cocoa text-milk transition hover:bg-cherry"
                      aria-label={`${p.n}: сагсанд нэмэх`}
                    >
                      <PlusIcon size={16} />
                    </button>
                  )}
                </span>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap items-center gap-4 rounded-[28px] bg-cocoa p-5 text-milk md:p-6">
          <span>
            <span className="block text-[14px] text-milk/70">Бүх алхам нийт</span>
            <b className="display text-[28px] text-straw">{formatPrice(total)}</b>
          </span>
          <button
            type="button"
            onClick={() => {
              plan.forEach(({ p }) => p.v && cart.add(p.v));
              setAdded(true);
            }}
            className="btn btn-cherry ml-auto"
          >
            {added ? "Сагсанд орлоо ♥" : "Бүгдийг сагслах"}
          </button>
          <Link href="/cart" className="btn btn-soft">
            Сагс <ArrowIcon size={16} />
          </Link>
        </div>
        <p className="mt-6 rounded-[22px] bg-lilac/70 p-5 text-[14.5px]">
          <b>Энэ бол зөвлөмж, эмнэлгийн онош биш.</b> Бүтээгдэхүүний нэр, тайлбар болон таны хариултаас сонгосон. Арьсаа аппаратаар үнэгүй оношлуулах бол салбартаа будаггүй ирээрэй.{" "}
          <Link href="/info#stores" className="font-bold underline decoration-cherry decoration-2 underline-offset-2">
            Салбарууд
          </Link>
        </p>
        <button
          type="button"
          onClick={() => {
            setQ(0);
            setSkin(null);
            setSens(null);
            setWorry([]);
            setStyle(null);
            setAdded(false);
          }}
          className="btn btn-soft mt-6"
        >
          Дахин эхлэх
        </button>
      </div>
    );

  return (
    <div className="mx-auto max-w-2xl">
      <div
        className="h-4 overflow-hidden rounded-full bg-white shadow-[inset_0_0_0_2px_var(--color-line)]"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Явц"
      >
        <div className="relative h-full rounded-full bg-bubble transition-all duration-500" style={{ width: `${Math.max(6, progress)}%` }}>
          <Heart size={14} color="#fff" className="absolute top-0 right-0.5" />
        </div>
      </div>
      <p className="mt-3 text-center text-[13px] font-bold text-cocoa-3">Асуулт {q + 1} / 4</p>

      <div key={q} className="pop mt-6">
        {q === 0 && (
          <>
            <h2 className="text-center text-[26px] font-bold md:text-[32px]">Нүүрээ угаагаад 1 цагийн дараа арьс тань…</h2>
            <div className="mt-6 grid gap-3">
              {SKIN.map((s) => (
                <Option
                  key={s.id}
                  on={skin === s.id}
                  onClick={() => {
                    setSkin(s.id);
                    setQ(1);
                  }}
                >
                  <span className="text-[28px]" aria-hidden>
                    {s.emoji}
                  </span>
                  <span>
                    <b className="display block text-[17px]">{s.title}</b>
                    <span className="block text-[14px] opacity-75">{s.text}</span>
                  </span>
                </Option>
              ))}
            </div>
          </>
        )}
        {q === 1 && (
          <>
            <h2 className="text-center text-[26px] font-bold md:text-[32px]">Шинэ бүтээгдэхүүн, нар, хүйтэнд арьс тань мэдрэмтгий юү?</h2>
            <div className="mt-6 grid gap-3">
              {SENS.map((s) => (
                <Option
                  key={s.id}
                  on={sens === s.id}
                  onClick={() => {
                    setSens(s.id);
                    setQ(2);
                  }}
                >
                  <span className="text-[28px]" aria-hidden>
                    {s.emoji}
                  </span>
                  <b className="display text-[17px]">{s.title}</b>
                </Option>
              ))}
            </div>
          </>
        )}
        {q === 2 && (
          <>
            <h2 className="text-center text-[26px] font-bold md:text-[32px]">Юу хамгийн их санаа зовоодог вэ?</h2>
            <p className="mt-2 text-center text-cocoa-2">2 хүртэлхийг сонгоно уу</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {concerns.map((c) => {
                const on = worry.includes(c.id);
                return (
                  <Option key={c.id} on={on} onClick={() => setWorry((w) => (on ? w.filter((x) => x !== c.id) : [...w, c.id].slice(-2)))}>
                    <Sparkle size={20} color="var(--color-bubble)" />
                    <b className="display text-[16px]">{c.name}</b>
                  </Option>
                );
              })}
            </div>
            <button type="button" onClick={() => setQ(3)} className="btn btn-cherry mt-6 w-full">
              {worry.length ? "Үргэлжлүүлэх" : "Онцгой санаа зоволтгүй"} <ArrowIcon size={16} />
            </button>
          </>
        )}
        {q === 3 && (
          <>
            <h2 className="text-center text-[26px] font-bold md:text-[32px]">Ямар арчилгаа танд тохирох вэ?</h2>
            <div className="mt-6 grid gap-3">
              {STYLE.map((s) => (
                <Option
                  key={s.id}
                  on={style === s.id}
                  onClick={() => {
                    setStyle(s.id);
                    setQ(4);
                  }}
                >
                  <span>
                    <b className="display block text-[17px]">{s.title}</b>
                    <span className="block text-[14px] opacity-75">{s.text}</span>
                  </span>
                </Option>
              ))}
            </div>
          </>
        )}
      </div>
      {q > 0 && (
        <button type="button" onClick={() => setQ((x) => x - 1)} className="mx-auto mt-6 block text-[14px] font-bold text-cocoa-2 underline underline-offset-4 hover:text-cherry">
          ← Буцах
        </button>
      )}
    </div>
  );
}
