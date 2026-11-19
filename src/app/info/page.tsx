import type { Metadata } from "next";
import { Confetti, LockMark } from "@/components/deco";
import { ClockIcon, FlaskIcon, PhoneIcon, PinIcon, TruckIcon } from "@/components/icons";
import { business } from "@/content/business";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Хүргэлт, төлбөр, салбар, асуулт",
  description: "Beauty Lock: маргааш нь хүргэлт, QPay төлбөр, и-баримт, хоёр салбарын хаяг, цагийн хуваарь, түгээмэл асуулт.",
  alternates: { canonical: "/info" },
};

export default function Info() {
  return (
    <>
      <section className="relative overflow-hidden bg-straw">
        <Confetti />
        <div className="wrap relative py-12 md:py-16">
          <p className="script text-[26px] text-cherry">Хамгийн хэрэгтэй нь</p>
          <h1 className="text-[36px] font-extrabold md:text-[52px]">Хүргэлт, төлбөр, асуулт</h1>
        </div>
      </section>
      <div className="scallop" />

      <div className="wrap mt-10 grid gap-5 md:grid-cols-2">
        <section id="delivery" className="rounded-[32px] bg-mint p-7 md:p-9">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-white">
            <TruckIcon size={24} />
          </span>
          <h2 className="mt-4 text-[26px] font-bold">Хүргэлт</h2>
          <ul className="mt-4 space-y-3">
            {business.delivery.map((d) => (
              <li key={d.id} className="flex items-start justify-between gap-4 rounded-[20px] bg-white/80 px-4 py-3">
                <span>
                  <b className="block">{d.name}</b>
                  <span className="text-[14px] text-cocoa-2">{d.note}</span>
                </span>
                <span className="display shrink-0 text-right font-bold">
                  {formatPrice(d.fee)}
                  <span className="block text-[12px] font-semibold text-cocoa-2">{formatPrice(d.freeFrom)}-өөс дээш үнэгүй</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[14.5px]">{business.rules.delivery}</p>
          <p className="mt-2 text-[14.5px] font-bold">{business.rules.urgent}</p>
        </section>

        <section id="payment" className="rounded-[32px] bg-butter p-7 md:p-9">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-white">
            <LockMark size={28} />
          </span>
          <h2 className="mt-4 text-[26px] font-bold">Төлбөр, и-баримт</h2>
          <p className="mt-4">
            <b>QPay:</b> {business.payments[0].note} {business.rules.payment}
          </p>
          <p className="mt-3 text-[14.5px] text-cocoa-2">{business.rules.ebarimt}</p>
          <p className="mt-3 text-[14.5px] text-cocoa-2">{business.rules.returns}</p>
        </section>
      </div>

      <section id="stores" className="wrap mt-16 scroll-mt-36">
        <h2 className="text-[30px] font-bold md:text-[38px]">Салбарууд</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-[1fr_1fr_1.1fr]">
          {business.branches.map((b) => (
            <a key={b.id} href={b.map} target="_blank" rel="noopener noreferrer" className="card flex flex-col p-6 transition hover:-translate-y-1">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-straw text-cherry">
                <PinIcon size={22} />
              </span>
              <b className="display mt-4 text-[22px]">{b.name}</b>
              <span className="mt-1 text-[14.5px] text-cocoa-2">{b.address}</span>
              <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-butter px-3 py-1 text-[13px] font-bold">
                <ClockIcon size={14} /> {b.hours}
              </span>
              <span className="mt-4 text-[14px] font-bold text-cherry">Газрын зураг →</span>
            </a>
          ))}
          <div className="flex flex-col rounded-[32px] bg-lilac p-6">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-white">
              <FlaskIcon size={22} />
            </span>
            <b className="display mt-4 text-[22px]">Үнэгүй арьс оношилгоо</b>
            <p className="mt-2 text-[14.5px]">{business.rules.diagnosis}</p>
            <a href={`tel:${business.phone.tel}`} className="btn btn-cocoa mt-auto w-fit">
              <PhoneIcon size={16} /> {business.phone.display}
            </a>
          </div>
        </div>
      </section>

      <section id="faq" className="wrap mt-16 scroll-mt-36">
        <h2 className="text-[30px] font-bold md:text-[38px]">Түгээмэл асуулт</h2>
        <div className="mt-6 grid gap-3">
          {business.faq.map((f, i) => (
            <details key={f.q} className="group rounded-[26px] bg-white p-5 shadow-[inset_0_0_0_2px_var(--color-line)] open:bg-cream" open={i === 0}>
              <summary className="display flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-bold">
                {f.q}
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-straw text-[18px] transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-[15px] text-cocoa-2">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="about" className="wrap mt-16">
        <div className="rounded-[36px] bg-white p-7 shadow-[inset_0_0_0_2px_var(--color-line)] md:p-10">
          <p className="script text-[26px] text-cherry">Бидний тухай</p>
          <div className="mt-3 space-y-3 text-[16px] text-cocoa-2">
            {business.about.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
