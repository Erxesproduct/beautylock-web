"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { business, deliveryFee, type DeliveryId } from "@/content/business";
import { cart, cartSubtotal, maxQty, useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { getLiteVariant } from "@/lib/lite";
import { localOrders } from "@/lib/local-orders";
import { AIMAGS, DISTRICTS } from "@/lib/orders/places";
import type { OrderErrors } from "@/lib/orders/schema";
import { Heart } from "./deco";
import { BagIcon, MinusIcon, PhoneIcon, PlusIcon, TrashIcon } from "./icons";

/** One idempotency key per checkout attempt, kept until the order goes through. */
function checkoutKey() {
  try {
    const k = sessionStorage.getItem("beautylock.checkout-key");
    if (k) return k;
    const n = crypto.randomUUID();
    sessionStorage.setItem("beautylock.checkout-key", n);
    return n;
  } catch {
    return crypto.randomUUID();
  }
}

export function Checkout() {
  const items = useCart();
  const router = useRouter();
  const [delivery, setDelivery] = useState<DeliveryId>("city");
  const [receiptType, setReceiptType] = useState<"person" | "company">("person");
  const [errors, setErrors] = useState<OrderErrors>({});
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const lines = items.flatMap((i) => {
    const v = getLiteVariant(i.id);
    return v ? [{ ...i, v }] : [];
  });
  const subtotal = cartSubtotal(items);
  const opt = business.delivery.find((d) => d.id === delivery)!;
  const fee = deliveryFee(delivery, subtotal);
  const total = subtotal + fee;
  const toFree = subtotal <= opt.freeFrom ? opt.freeFrom - subtotal : 0;

  if (!lines.length)
    return (
      <div className="card mx-auto max-w-lg px-8 py-14 text-center">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-straw text-cherry">
          <BagIcon size={32} />
        </span>
        <p className="display mt-6 text-[28px] font-bold">Сагс хоосон байна</p>
        <p className="mt-2 text-cocoa-2">Арьсандаа тохирохоо олоход тест туслана.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="btn btn-cherry">
            Дэлгүүр
          </Link>
          <Link href="/skin-test" className="btn btn-soft">
            ✨ Арьсны тест
          </Link>
        </div>
      </div>
    );

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setNotice(null);
    setErrors({});
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: checkoutKey(),
          name: f.get("name"),
          phone: f.get("phone"),
          email: f.get("email"),
          delivery,
          area: f.get("area"),
          khoroo: Number(f.get("khoroo")),
          address: f.get("address") ?? "",
          payment: "qpay",
          receiptType,
          regNo: f.get("regNo") ?? "",
          note: f.get("note"),
          website: f.get("website"),
          items: items.map(({ id, qty }) => ({ id, qty })),
        }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.ok) {
        localOrders.save({
          reference: json.reference,
          createdAt: new Date().toISOString(),
          subtotal: json.subtotal,
          deliveryFee: json.deliveryFee,
          total: json.total,
          lines: lines.map((l) => ({ name: [l.v.b, l.v.n].filter(Boolean).join(" "), label: l.v.z, qty: l.qty, total: l.v.p * l.qty })),
          invoiceId: json.payment?.invoiceId ?? null,
          payUrl: json.payment?.url ?? null,
          status: json.payment ? "pending" : null,
        });
        try {
          sessionStorage.removeItem("beautylock.checkout-key");
        } catch {}
        cart.clear();
        router.push(`/order/${json.reference}`);
        return;
      }
      if (res.status === 422 && json?.errors) {
        setErrors(json.errors);
        setNotice("Мэдээллээ шалгаад дахин оролдоно уу.");
      } else if (json?.error === "not_configured") {
        setNotice(`Онлайн захиалга одоогоор холбогдоогүй байна. Захиалгаа ${business.phone.display} дугаарт өгнө үү (лавлах код ${json.reference}, нийт ${formatPrice(json.total ?? total)}). Таны сагс хадгалагдсан.`);
      } else {
        setNotice(`Захиалга илгээхэд алдаа гарлаа. Дахин оролдох эсвэл ${business.phone.display} дугаарт залгана уу.`);
      }
    } catch {
      setNotice("Интернэт холболтоо шалгаад дахин оролдоно уу.");
    } finally {
      setBusy(false);
    }
  }

  const err = (k: keyof OrderErrors) =>
    errors[k] && (
      <p className="mt-1.5 text-[13.5px] font-bold text-cherry" id={`e-${k}`}>
        {errors[k]}
      </p>
    );
  const step = (n: number, t: string) => (
    <h2 className="flex items-center gap-3">
      <span className="display grid h-10 w-10 place-items-center rounded-full bg-straw text-[18px] font-extrabold text-cherry">{n}</span>
      <span className="text-[24px] font-bold">{t}</span>
    </h2>
  );

  return (
    <form onSubmit={submit} noValidate className="grid gap-10 lg:grid-cols-[1.45fr_1fr] lg:gap-12">
      <div className="space-y-12">
        <section aria-label="Сагсны бараа">
          <ul className="space-y-3">
            {lines.map(({ id, qty, v }) => (
              <li key={id} className="flex gap-4 rounded-[26px] bg-white p-3 shadow-[inset_0_0_0_2px_var(--color-line)] md:p-4">
                <Link href={`/p/${v.s}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[20px] bg-straw md:h-28 md:w-28">
                  {v.t && <Image src={v.t} alt="" fill sizes="112px" className="object-contain p-2 mix-blend-multiply" />}
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  {v.b && <span className="eyebrow text-[11px] text-cocoa-3">{v.b}</span>}
                  <Link href={`/p/${v.s}`} className="display line-clamp-2 leading-snug font-semibold hover:text-cherry">
                    {v.n}
                  </Link>
                  <span className="text-[13px] text-cocoa-2">
                    {v.z ? `${v.z} · ` : ""}
                    {formatPrice(v.p)}
                  </span>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
                    <div className="flex items-center rounded-full bg-cream">
                      <button type="button" onClick={() => cart.setQty(id, qty - 1)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-white" aria-label="Цөөлөх">
                        <MinusIcon size={14} />
                      </button>
                      <span className="w-7 text-center font-bold tabular-nums">{qty}</span>
                      <button type="button" onClick={() => cart.setQty(id, qty + 1)} disabled={qty >= maxQty(id)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-white disabled:opacity-30" aria-label="Нэмэх">
                        <PlusIcon size={14} />
                      </button>
                    </div>
                    <span className="display text-[18px] font-bold tabular-nums">{formatPrice(v.p * qty)}</span>
                    <button type="button" onClick={() => cart.setQty(id, 0)} className="grid h-9 w-9 place-items-center rounded-full text-cocoa-3 hover:bg-straw hover:text-cherry" aria-label={`${v.n}: хасах`}>
                      <TrashIcon size={17} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section>
          {step(1, "Захиалагч")}
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="label">
              Нэр
              <input name="name" autoComplete="name" required aria-invalid={!!errors.name} aria-describedby={errors.name ? "e-name" : undefined} className="field" />
              {err("name")}
            </label>
            <label className="label">
              Утас
              <input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="99112233" required aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "e-phone" : undefined} className="field" />
              {err("phone")}
            </label>
            <label className="label sm:col-span-2">
              Имэйл <span className="font-normal text-cocoa-3">(заавал биш)</span>
              <input name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} className="field" />
              {err("email")}
            </label>
          </div>
          <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        </section>

        <section>
          {step(2, "Хүргэлт")}
          <div className="mt-5 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Хүргэлт">
            {business.delivery.map((d) => (
              <button key={d.id} type="button" role="radio" aria-checked={delivery === d.id} onClick={() => setDelivery(d.id)} className={`rounded-[22px] p-4 text-left transition ${delivery === d.id ? "bg-cocoa text-milk shadow-[0_5px_0_#24171b]" : "bg-white shadow-[inset_0_0_0_2px_var(--color-line)] hover:shadow-[inset_0_0_0_2px_var(--color-bubble)]"}`}>
                <span className="flex items-baseline justify-between gap-2">
                  <b className="display text-[16px]">{d.name}</b>
                  <span className="display font-bold">{deliveryFee(d.id, subtotal) === 0 ? "Үнэгүй" : formatPrice(d.fee)}</span>
                </span>
                <span className="mt-1 block text-[13px] opacity-75">{d.note}</span>
              </button>
            ))}
          </div>
          {toFree > 0 && toFree < opt.freeFrom && (
            <p className="mt-3 flex items-center gap-2 text-[14px] font-bold text-cocoa-2">
              <Heart size={14} color="var(--color-bubble)" /> Дахиад {formatPrice(toFree)}-өөс илүү бараа нэмбэл хүргэлт үнэгүй.
            </p>
          )}
          {delivery === "city" ? (
            <div key="city" className="mt-5 grid gap-4 sm:grid-cols-[1.4fr_1fr]">
              <label className="label">
                Дүүрэг
                <select name="area" required defaultValue="" aria-invalid={!!errors.area} className="field">
                  <option value="" disabled>
                    Сонгох
                  </option>
                  {DISTRICTS.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
                {err("area")}
              </label>
              <label className="label">
                Хороо
                <input name="khoroo" type="number" inputMode="numeric" min={1} max={45} required aria-invalid={!!errors.khoroo} className="field" />
                {err("khoroo")}
              </label>
              <label className="label sm:col-span-2">
                Хаяг
                <textarea name="address" rows={2} required aria-invalid={!!errors.address} placeholder="Байр, орц, давхар, тоот, орцны код" className="field" />
                {err("address")}
              </label>
            </div>
          ) : (
            <div key="country" className="mt-5 grid gap-4">
              <label className="label">
                Аймаг
                <select name="area" required defaultValue="" aria-invalid={!!errors.area} className="field">
                  <option value="" disabled>
                    Сонгох
                  </option>
                  {AIMAGS.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
                {err("area")}
              </label>
              <label className="label">
                Сум, хаяг ба илгээх арга
                <textarea name="address" rows={3} required aria-invalid={!!errors.address} placeholder="Сум / хот, хүлээн авагч. Унаагаар бол жолоочийн утас, хөдлөх цаг; шуудангаар бол салбар." className="field" />
                {err("address")}
              </label>
              <p className="text-[13.5px] text-cocoa-2">Орон нутгийн унаа, шууданд хүргэж өгнө. Унаа, шуудангийн төлбөрийг утсаар тохирно.</p>
            </div>
          )}
        </section>

        <section>
          {step(3, "Төлбөр, и-баримт")}
          <div className="mt-5 flex items-start gap-3.5 rounded-[22px] bg-white p-4 shadow-[inset_0_0_0_2px_var(--color-cocoa)]">
            <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-cocoa">
              <span className="h-2 w-2 rounded-full bg-milk" />
            </span>
            <span>
              <b className="block">{business.payments[0].name}</b>
              <span className="block text-[13.5px] text-cocoa-2">{business.payments[0].note} Захиалга өгсний дараа төлбөрийн хуудас нээгдэнэ.</span>
            </span>
          </div>
          {err("payment")}
          <div className="mt-6 flex gap-2" role="radiogroup" aria-label="И-баримтын төрөл">
            {(
              [
                ["person", "Хувь хүн"],
                ["company", "Байгууллага"],
              ] as const
            ).map(([id, text]) => (
              <button key={id} type="button" role="radio" aria-checked={receiptType === id} onClick={() => setReceiptType(id)} className="chip">
                {text}
              </button>
            ))}
          </div>
          {receiptType === "company" ? (
            <label className="label mt-4">
              Байгууллагын регистр
              <input name="regNo" inputMode="numeric" maxLength={7} placeholder="1234567" aria-invalid={!!errors.regNo} className="field" />
              {err("regNo")}
            </label>
          ) : (
            <p className="mt-3 text-[13.5px] text-cocoa-2">И-баримтыг таны утасны дугаараар бүртгэнэ.</p>
          )}
          <label className="label mt-6">
            Нэмэлт тайлбар <span className="font-normal text-cocoa-3">(хүргэх цаг, бэлгийн мэндчилгээ)</span>
            <textarea name="note" rows={2} className="field" />
          </label>
        </section>
      </div>

      <aside className="lg:sticky lg:top-36 lg:self-start">
        <div className="relative overflow-hidden rounded-[32px] bg-cocoa p-6 text-milk md:p-8">
          <p className="script text-[24px] text-straw">Төлөх дүн</p>
          <dl className="mt-4 space-y-3 text-[15px]">
            <div className="flex justify-between gap-4">
              <dt className="text-milk/70">Бараа</dt>
              <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-milk/70">Хүргэлт ({opt.name})</dt>
              <dd className="tabular-nums">{fee === 0 ? "Үнэгүй" : formatPrice(fee)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-t border-milk/15 pt-4">
              <dt className="font-bold">Нийт</dt>
              <dd className="display text-[34px] font-extrabold text-straw tabular-nums">{formatPrice(total)}</dd>
            </div>
          </dl>
          <p className="mt-4 text-[13px] leading-snug text-milk/65">{business.rules.payment}</p>
          <p className="mt-2 text-[13px] leading-snug text-milk/65">{business.rules.delivery}</p>
          {notice && (
            <p role="alert" className="mt-5 rounded-[18px] bg-milk px-4 py-3 text-[14px] text-cocoa">
              {notice}
            </p>
          )}
          {errors.items && <p className="mt-4 rounded-[18px] bg-cherry px-4 py-2.5 text-[14px]">{errors.items}</p>}
          <button type="submit" disabled={busy} className="btn btn-cherry mt-6 h-14 w-full text-[16px]">
            {busy ? "Илгээж байна…" : "Захиалах, QPay-ээр төлөх"}
          </button>
          <a href={`tel:${business.phone.tel}`} className="mt-5 inline-flex items-center gap-2 text-[14px] text-milk/80 hover:text-straw">
            <PhoneIcon size={16} /> {business.phone.display}
          </a>
        </div>
      </aside>
    </form>
  );
}
