import Link from "next/link";
import { business } from "@/content/business";
import { Heart, LockMark } from "./deco";
import { ClockIcon, FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon } from "./icons";

export function Footer() {
  return (
    <footer className="mt-24">
      <div className="scallop-up" style={{ ["--sc" as string]: "var(--color-cocoa)" }} />
      <div className="bg-cocoa text-milk">
        <div className="wrap grid gap-10 pt-14 pb-10 lg:grid-cols-[1.1fr_2fr]">
          <div>
            <div className="flex items-center gap-3">
              <LockMark size={52} />
              <p className="script text-[40px] leading-none text-straw">beauty lock</p>
            </div>
            <p className="mt-5 max-w-sm text-[15px] text-milk/75">{business.description}</p>
            <div className="mt-6 flex gap-2">
              <a href={business.facebook} target="_blank" rel="noopener noreferrer" className="grid h-11 w-11 place-items-center rounded-full bg-milk/10 transition hover:bg-bubble" aria-label="Facebook">
                <FacebookIcon size={19} />
              </a>
              <a href={business.instagram} target="_blank" rel="noopener noreferrer" className="grid h-11 w-11 place-items-center rounded-full bg-milk/10 transition hover:bg-bubble" aria-label="Instagram">
                <InstagramIcon size={19} />
              </a>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {business.branches.map((b) => (
              <a key={b.id} href={b.map} target="_blank" rel="noopener noreferrer" className="group rounded-[26px] bg-milk/8 p-5 ring-1 ring-milk/12 transition hover:bg-milk/14">
                <span className="flex items-center gap-2 text-straw">
                  <PinIcon size={18} />
                  <span className="display text-[17px] font-bold text-milk">{b.name}</span>
                </span>
                <span className="mt-2 block text-[14px] text-milk/75">{b.address}</span>
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-butter px-3 py-1 text-[12.5px] font-bold text-cocoa">
                  <ClockIcon size={14} /> Өдөр бүр {b.hours}
                </span>
              </a>
            ))}
            <a href={`tel:${business.phone.tel}`} className="flex items-center gap-4 rounded-[26px] bg-bubble p-5 text-white transition hover:-translate-y-0.5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/20">
                <PhoneIcon size={22} />
              </span>
              <span>
                <span className="block text-[13px] font-bold opacity-85">Утас</span>
                <span className="display block text-[22px] font-bold">{business.phone.display}</span>
              </span>
            </a>
            <a href={`mailto:${business.email}`} className="flex items-center gap-4 rounded-[26px] bg-milk/8 p-5 ring-1 ring-milk/12 transition hover:bg-milk/14">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-milk/10 text-straw">
                <MailIcon size={22} />
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] font-bold text-milk/70">Имэйл</span>
                <span className="block truncate text-[15.5px] font-bold">{business.email}</span>
              </span>
            </a>
          </div>
        </div>
        <div className="wrap flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-milk/12 py-6 text-[14px] text-milk/70">
          <Link href="/shop" className="hover:text-straw">
            Дэлгүүр
          </Link>
          <Link href="/skin-test" className="hover:text-straw">
            Арьсны тест
          </Link>
          <Link href="/brands" className="hover:text-straw">
            Брэндүүд
          </Link>
          <Link href="/info" className="hover:text-straw">
            Хүргэлт, төлбөр, асуулт
          </Link>
          <Link href="/info#stores" className="hover:text-straw">
            Салбарууд
          </Link>
          <span className="ml-auto flex items-center gap-1.5">
            © {new Date().getFullYear()} Beauty Lock <Heart size={13} color="var(--color-bubble)" /> Ulaanbaatar
          </span>
        </div>
      </div>
    </footer>
  );
}
