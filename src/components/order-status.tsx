"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { business, ORDER_STATUSES } from "@/content/business";
import { formatPrice } from "@/lib/format";
import { localOrders, useLocalOrders } from "@/lib/local-orders";
import { CheckIcon, ClockIcon, CloseIcon, PhoneIcon } from "./icons";

const LABEL: Record<string, { title: string; text: string; tone: "ok" | "wait" | "bad" }> = {
  paid: { title: "Төлбөр төлөгдлөө", text: "Захиалга баталгаажлаа. Маргааш нь хүргэнэ: хот дотор хаяг дээр, орон нутагт унаа / шуудангаар.", tone: "ok" },
  pending: { title: "Төлбөр хүлээгдэж байна", text: "QPay-ээр төлсний дараа энэ хуудас автоматаар шинэчлэгдэнэ.", tone: "wait" },
  failed: { title: "Төлбөр амжилтгүй", text: "Төлбөр хийгдсэнгүй. Дахин оролдох эсвэл бидэнтэй холбогдоно уу.", tone: "bad" },
  cancelled: { title: "Нэхэмжлэл цуцлагдсан", text: "Шинэ нэхэмжлэл авахаар бидэнтэй холбогдоно уу.", tone: "bad" },
  rejected: { title: "Төлбөр татгалзсан", text: "Банк төлбөрийг татгалзсан. Бидэнтэй холбогдоно уу.", tone: "bad" },
  expired: { title: "Нэхэмжлэлийн хугацаа дууссан", text: "Шинэ нэхэмжлэл авахаар бидэнтэй холбогдоно уу.", tone: "bad" },
  refunded: { title: "Төлбөр буцаагдсан", text: "Төлбөрийг буцаан шилжүүлсэн.", tone: "bad" },
};
const TERMINAL = ["paid", "failed", "cancelled", "rejected", "expired", "refunded"];

export function OrderStatus({ reference }: { reference: string }) {
  const orders = useLocalOrders();
  const order = orders.find((o) => o.reference === reference) ?? null;
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);
  const tries = useRef(0);

  const check = useCallback(async () => {
    const o = localOrders.get(reference);
    if (!o?.invoiceId) return;
    setChecking(true);
    try {
      const res = await fetch("/api/payments/check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ invoiceId: o.invoiceId }) });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.ok) {
        localOrders.setStatus(reference, json.status);
        setCheckError(null);
      } else setCheckError(json?.error === "not_configured" ? "Төлбөрийн систем холбогдоогүй байна." : "Төлбөр шалгахад алдаа гарлаа.");
    } catch {
      setCheckError("Интернэт холболтоо шалгана уу.");
    } finally {
      setChecking(false);
    }
  }, [reference]);

  // check on arrival (also when coming back from the QPay page), then every 5 s while pending and visible, for 10 min
  const status = order?.status ?? null;
  useEffect(() => {
    if (!order?.invoiceId || (status && TERMINAL.includes(status))) return;
    const first = window.setTimeout(check, 300);
    const id = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      if (++tries.current > 120) return window.clearInterval(id);
      check();
    }, 5000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, [order?.invoiceId, status, check]);

  if (!order)
    return (
      <div className="card mx-auto max-w-xl p-8 text-center md:p-12">
        <p className="display text-[30px] font-bold">{reference}</p>
        <p className="mt-3 text-cocoa-2">Энэ захиалга энэ төхөөрөмж дээр хадгалагдаагүй байна. Захиалгынхаа явцыг утсаар лавлана уу.</p>
        <a href={`tel:${business.phone.tel}`} className="btn btn-cherry mt-8">
          <PhoneIcon size={16} /> {business.phone.display}
        </a>
      </div>
    );

  const s = status ? (LABEL[status] ?? LABEL.pending) : null;
  const paid = status === "paid";
  return (
    <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.2fr_1fr]">
      <div className="pop card overflow-hidden">
        <div className="bg-cocoa p-8 text-milk md:p-10">
          <p className="script text-[24px] text-straw">Захиалга хүлээн авлаа</p>
          <h1 className="mt-1 text-[40px] font-extrabold md:text-[52px]">Баярлалаа</h1>
          <p className="mt-2 text-milk/75">
            Захиалгын дугаар: <b className="font-bold text-straw">{order.reference}</b>
          </p>
        </div>
        <div className="p-8 md:p-10">
          {s ? (
            <div className={`flex gap-4 rounded-[20px] p-4 ${s.tone === "ok" ? "bg-mint" : s.tone === "bad" ? "bg-straw" : "bg-butter/70"}`} role="status" aria-live="polite">
              <span className="mt-0.5">{s.tone === "ok" ? <CheckIcon size={20} /> : s.tone === "bad" ? <CloseIcon size={20} /> : <ClockIcon size={20} />}</span>
              <span>
                <span className="block font-semibold">{s.title}</span>
                <span className="block text-[14px] text-cocoa-2">{s.text}</span>
              </span>
            </div>
          ) : (
            <div className="rounded-[20px] bg-butter/70 p-4 text-[14px]" role="status">
              <b className="block">Төлбөрийн нэхэмжлэл үүсээгүй</b>
              Захиалга бүртгэгдсэн. QPay нэхэмжлэлийг бид таны утас руу илгээнэ, эсвэл {business.phone.display} дугаарт залгана уу.
            </div>
          )}
          {order.payUrl && !paid && status && !TERMINAL.includes(status) && (
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={order.payUrl} className="btn btn-cherry">
                QPay-ээр төлөх
              </a>
              <button type="button" onClick={check} disabled={checking} className="btn btn-soft">
                {checking ? "Шалгаж байна…" : "Төлбөр шалгах"}
              </button>
            </div>
          )}
          {checkError && <p className="mt-3 text-[13.5px] text-cherry">{checkError}</p>}

          <ul className="mt-8 space-y-2.5 text-[14.5px]">
            {order.lines.map((l) => (
              <li key={`${l.name}|${l.label}`} className="flex justify-between gap-4">
                <span className="text-cocoa-2">
                  {l.name}{l.label ? ` (${l.label})` : ""} × {l.qty}
                </span>
                <span className="shrink-0 tabular-nums">{formatPrice(l.total)}</span>
              </li>
            ))}
            <li className="flex justify-between gap-4">
              <span className="text-cocoa-2">Хүргэлт</span>
              <span className="tabular-nums">{order.deliveryFee === 0 ? "Үнэгүй" : formatPrice(order.deliveryFee)}</span>
            </li>
            <li className="display flex justify-between gap-4 border-t-2 border-line pt-4 text-[22px] font-bold">
              <span>Нийт</span>
              <span className="tabular-nums">{formatPrice(order.total)}</span>
            </li>
          </ul>
          <p className="mt-6 text-[13.5px] text-cocoa-2">{business.rules.ebarimt}</p>
        </div>
      </div>
      <aside className="rounded-[32px] bg-straw p-8 md:p-10">
        <p className="script text-[24px] text-cherry">Захиалгын явц</p>
        <ol className="mt-6 space-y-5">
          {ORDER_STATUSES.filter((x) => x.id !== "cancelled").map((x, i) => {
            const reached = i === 0 || (paid && i === 1);
            return (
              <li key={x.id} className="flex gap-4">
                <span className={`mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[11px] ${reached ? "border-cocoa bg-cocoa text-milk" : "border-cocoa-3 bg-white text-cocoa-3"}`}>{i + 1}</span>
                <span>
                  <span className={`block text-[15px] ${reached ? "font-semibold" : "text-cocoa-2"}`}>{x.name}</span>
                  <span className="block text-[13px] text-cocoa-3">{x.note}</span>
                </span>
              </li>
            );
          })}
        </ol>
        <p className="mt-8 text-[13px] text-cocoa-3">Төлбөрөөс хойших шатуудыг (савлах, хүргэлтэд гарах) бид утсаар мэдэгдэнэ.</p>
        <Link href="/shop" className="btn btn-soft mt-8">
          Дэлгүүр хэсэх →
        </Link>
      </aside>
    </div>
  );
}
