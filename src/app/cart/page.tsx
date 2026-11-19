import type { Metadata } from "next";
import { Checkout } from "@/components/checkout";

export const metadata: Metadata = { title: "Сагс", robots: { index: false } };

export default function CartPage() {
  return (
    <div className="wrap pt-8 pb-10 md:pt-12">
      <p className="script text-[24px] text-cherry">Бараг л болчихлоо</p>
      <h1 className="mb-8 text-[36px] font-extrabold md:text-[48px]">Сагс, захиалга</h1>
      <Checkout />
    </div>
  );
}
