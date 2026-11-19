import type { Metadata } from "next";
import { Confetti } from "@/components/deco";
import { SkinTest } from "@/components/skin-test";
import { concerns, steps } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Арьсны мини тест",
  description: "4 асуултад хариулаад арьсны төрөлдөө тохирсон арчилгааны алхмуудаа Beauty Lock-ийн бүтээгдэхүүнээс сонгуулаарай.",
  alternates: { canonical: "/skin-test" },
};

export default function SkinTestPage() {
  return (
    <>
      <section className="gingham relative overflow-hidden">
        <Confetti dense />
        <div className="wrap relative py-12 text-center md:py-16">
          <span className="sticker bg-white text-cocoa">1 минут · 4 асуулт</span>
          <h1 className="mx-auto mt-4 max-w-2xl rounded-[28px] bg-white/85 px-6 py-4 text-[36px] font-extrabold md:text-[52px]">Арьсны мини тест</h1>
        </div>
      </section>
      <div className="scallop" style={{ ["--sc" as string]: "#fff3f5" }} />
      <div className="wrap mt-10">
        <SkinTest steps={steps.map(({ id, name, tint }) => ({ id, name, tint }))} concerns={concerns.map(({ id, name }) => ({ id, name }))} />
      </div>
    </>
  );
}
