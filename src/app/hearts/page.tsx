import type { Metadata } from "next";
import { HeartsView } from "@/components/hearts-view";

export const metadata: Metadata = { title: "Хадгалсан", robots: { index: false } };

export default function HeartsPage() {
  return (
    <div className="wrap pt-8 md:pt-12">
      <p className="script text-[24px] text-cherry">Зүрхэндээ түгжсэн</p>
      <h1 className="text-[36px] font-extrabold md:text-[48px]">Хадгалсан бүтээгдэхүүн</h1>
      <HeartsView />
    </div>
  );
}
