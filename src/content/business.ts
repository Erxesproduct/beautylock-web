import data from "@/data/catalog.json";

/**
 * Business facts from beautylock.mn (Zochil shop 6709: shop settings, payment / delivery rules, delivery options,
 * FAQ, about page), read on 2026-11-19. Nothing here is invented; open points are in docs/erxes/MANUAL-STEPS.md.
 */
const shop = data.shop;
const city = shop.delivery.find((d) => d.title === "Улаанбаатар");
const country = shop.delivery.find((d) => d.title === "Орон нутаг");

export const business = {
  name: "Beauty Lock",
  domain: "beautylock.mn",
  tagline: "Арьсандаа тохирсоноо олъё",
  description:
    "Beauty Lock: Солонгос, Вьетнамын арьс, үс арчилгааны брэндүүдийг албан ёсны эрхтэйгээр. Салбартаа арьс, үсний үнэгүй оношилгоо хийж, танд тохирсон бүтээгдэхүүнийг зөвлөнө.",
  phone: { display: "9040-0007", tel: "+97690400007" },
  /** FAQ: urgent delivery through UB Cab after calling this number. */
  urgentPhone: { display: "8810-1053", tel: "+97688101053" },
  email: shop.email,
  instagram: shop.instagram,
  facebook: shop.facebook,
  /** Zochil shop address (two branches, opening hours as written there). */
  branches: [
    {
      id: "khoroolol",
      name: "3, 4-р хороолол",
      address: "БГД 17-р хороо, 10000 нэрийн дэлгүүрийн замын чанх эсрэг талд, замын урд Pony shop, 2 давхар",
      hours: "10:30–20:00",
      map: "https://www.google.com/maps/search/?api=1&query=Pony+shop+3,4+%D1%85%D0%BE%D1%80%D0%BE%D0%BE%D0%BB%D0%BE%D0%BB+Ulaanbaatar",
    },
    {
      id: "peace-mall",
      name: "Peace mall",
      address: "Peace mall, 1 давхар, лифтний хажууд, 106 тоот",
      hours: "11:00–21:00",
      map: "https://www.google.com/maps/search/?api=1&query=Peace+mall+Ulaanbaatar",
    },
  ],
  /** Zochil payment rule: confirmed after 100% payment. QPay is the shop's enabled online method (has_qpay). */
  payments: [{ id: "qpay", name: "QPay", note: "Аль ч банкны аппаар QR уншуулж төлнө." }],
  /**
   * Zochil delivery options: «Улаанбаатар» (Үндсэн хүргэлт) and «Орон нутаг», both 6,000₮, free above 500,000₮
   * (`delivery_price_limit`). The shop's payment rule text says free from 300,000₮: open question 1.
   */
  delivery: [
    { id: "city", name: "Улаанбаатар хот", note: "Захиалга баталгаажсаны маргааш хүргэнэ", fee: city?.price ?? 6000, freeFrom: city?.freeFrom ?? 500000 },
    { id: "countryside", name: "Орон нутаг", note: "Орон нутгийн унаа, шууданд хүргэж өгнө", fee: country?.price ?? 6000, freeFrom: country?.freeFrom ?? 500000 },
  ],
  rules: {
    payment: "Бүтээгдэхүүний үнэ болон хүргэлтийн төлбөрөө 100% төлснөөр таны захиалга баталгаажна.",
    delivery: "Захиалга баталгаажиж маргааш өдөртөө хүргэнэ. Орон нутгийн унаа, шууданд хүргэж өгнө.",
    urgent: "Яаралтай авах бол 8810-1053 дугаарт мэдэгдээрэй: UB Cab шуурхай хүргэлтээр өгч явуулна.",
    returns: "Захиалгын бүтээгдэхүүний талаар ойлгомжгүй асуудал гарвал 9040-0007 дугаарт хандаарай.",
    ebarimt: "И-баримтыг төлбөр баталгаажсаны дараа erxes-ээс албан ёсоор олгоно. Байгууллагаар авах бол 7 оронтой регистрийн дугаараа бичнэ үү.",
    diagnosis: "Арьс оношилгоог аппарат болон асуулгад суурилж хийдэг. Салбартаа ирж үнэгүй оношлуулж, бүтээгдэхүүнээ тест хийж үзээд авах боломжтой. Оношлуулах бол будаггүй ирээрэй!",
  },
  about: shop.about,
  faq: [
    { q: "Хүргэлт хэзээ хийгдэх вэ?", a: "Захиалга хийгдсэнээс хойш 24 цагийн дотор буюу маргааш өдөртөө хүргэгдэнэ. Яаралтай авах бол 8810-1053 дугаарт мэдэгдээрэй: UB Cab шуурхай хүргэлтээр өгч явуулна." },
    { q: "Захиалга хэрхэн баталгаажих вэ?", a: "Захиалгын төлбөр 100% төлөгдсөнөөр баталгаажих бөгөөд хүргэлт маргааш өдөр нь очно." },
    { q: "Дэлгүүр хаана байдаг вэ?", a: "3, 4-р хороолол (БГД 17-р хороо, 10000 нэрийн дэлгүүрийн замын эсрэг талд, Pony shop 2 давхар) болон Peace mall-ийн 1 давхарт, лифтний хажууд 106 тоот." },
    { q: "Бүтээгдэхүүн албан ёсны эрхтэй юу?", a: "Тийм. Бид албан ёсны эрхтэйгээр Монгол Улсад бүтээгдэхүүнээ борлуулж байна." },
    { q: "Арьс оношилгоо хийдэг үү?", a: "Арьс оношилгоог аппарат болон асуулгад суурилж хийдэг. Салбартаа ирж оношлуулж, зөвлөгөө авч, бүтээгдэхүүнээ тест хийж үзээд худалдан авах боломжтой. Оношлуулах бол будаггүй ирээрэй!" },
  ],
} as const;

export type DeliveryId = (typeof business.delivery)[number]["id"];
export type PaymentId = (typeof business.payments)[number]["id"];
export const deliveryOption = (id: DeliveryId) => business.delivery.find((d) => d.id === id)!;
export const paymentOption = (id: PaymentId) => business.payments.find((p) => p.id === id)!;

/** Zochil: 6,000₮, free when the goods subtotal is above the limit (500,000₮). */
export function deliveryFee(id: DeliveryId, subtotal: number): number {
  const d = deliveryOption(id);
  return d.freeFrom && subtotal > d.freeFrom ? 0 : d.fee;
}

/** Order statuses staff move an order through (erxes Sales pipeline stages, see MANUAL-STEPS.md). */
export const ORDER_STATUSES = [
  { id: "pending", name: "Хүлээгдэж байна", note: "Захиалга ирсэн, төлбөр хүлээгдэж байна" },
  { id: "confirmed", name: "Баталгаажсан", note: "Төлбөр 100% төлөгдсөн" },
  { id: "packing", name: "Савлаж байна", note: "Бэлгийн боодолтой, хайртайгаар" },
  { id: "shipped", name: "Хүргэлтэд гарсан", note: "Хотод маргааш нь, орон нутагт унаа / шуудангаар" },
  { id: "delivered", name: "Хүргэгдсэн", note: "Хүлээн авсан" },
  { id: "cancelled", name: "Цуцлагдсан", note: "Төлбөр төлөгдөөгүй эсвэл цуцалсан" },
] as const;
