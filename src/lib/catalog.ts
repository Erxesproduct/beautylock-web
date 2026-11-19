import "server-only";

import data from "@/data/catalog.json";

export type Variant = {
  /** "<zochilProductId>" or "<zochilProductId>-<zochilVariantId>". erxes product code BL-<id>. */
  id: string;
  /** Zochil option value (size / shade); null for products without options. */
  label: string | null;
  price: number;
  compareAt: number | null;
  /** null: not counted on Zochil (orderable) */
  stock: number | null;
};
export type Photo = { src: string; w: number; h: number; thumb: { src: string; w: number; h: number } };
export type Product = {
  id: number;
  slug: string;
  /** Latin product name without the brand, e.g. «Persimmon whip cleanser» */
  title: string;
  /** Mongolian line from the Zochil name, e.g. «Цайруулах, хар батганы эсрэг хөөсөн цэвэрлэгч» */
  sub: string;
  zochilName: string;
  brand: string | null;
  groups: string[];
  kinds: string[];
  steps: string[];
  concerns: string[];
  skinTypes: string[];
  variants: Variant[];
  /** verified Zochil orders */
  orders: number;
  featured: boolean;
  createdAt: string;
  details: { t: "p" | "li"; x: string }[];
  images: Photo[];
};
export type Facet = { id: string; name: string; count: number };
export type Step = Facet & { line: string; tint: string };
export type Concern = Facet & { line: string };
export type Kind = Facet & { step: string };
export type Brand = Facet & { origin: string | null };

export const products = data.products as Product[];
export const groups = data.groups as Facet[];
export const steps = data.steps as Step[];
export const concerns = data.concerns as Concern[];
export const kinds = data.kinds as Kind[];
export const brands = data.brands as Brand[];
export const banners = data.banners as { src: string; w: number; h: number; href: string | null; title: string }[];
export const catalogInfo = { source: data.source, shopId: data.shopId, updatedAt: data.updatedAt };

const bySlug = new Map(products.map((p) => [p.slug, p]));
const byVariant = new Map(products.flatMap((p) => p.variants.map((v) => [v.id, { product: p, variant: v }] as const)));
export const getProduct = (slug: string) => bySlug.get(slug);
export const getVariant = (id: string) => byVariant.get(id);
export const brandName = (id: string | null) => (id ? (brands.find((b) => b.id === id)?.name ?? null) : null);
export const sku = (id: string) => `BL-${id}`;

export const soldOut = (v: Pick<Variant, "stock">) => v.stock === 0;
export const available = (p: Product) => p.variants.some((v) => !soldOut(v));
export const fromPrice = (p: Product) => p.variants[0].price;
export const onSale = (p: Product) => p.variants.some((v) => v.compareAt);

/** In stock first, then most ordered on Zochil. */
export const byPopularity = (a: Product, b: Product) => Number(available(b)) - Number(available(a)) || b.orders - a.orders || Number(b.featured) - Number(a.featured);
export const popular = [...products].sort(byPopularity);
export const ORIGIN_NAME: Record<string, string> = { KR: "Солонгос", VN: "Вьетнам" };
