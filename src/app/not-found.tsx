import Link from "next/link";
import { LockMark } from "@/components/deco";

export default function NotFound() {
  return (
    <div className="wrap py-20 text-center">
      <LockMark size={90} className="mx-auto animate-floaty" />
      <h1 className="mt-6 text-[40px] font-extrabold">Энэ хуудас түгжээтэй байна</h1>
      <p className="mt-2 text-cocoa-2">Хаяг буруу эсвэл бүтээгдэхүүн шилжсэн байж магадгүй.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="btn btn-cherry">
          Дэлгүүр
        </Link>
        <Link href="/" className="btn btn-soft">
          Нүүр хуудас
        </Link>
      </div>
    </div>
  );
}
