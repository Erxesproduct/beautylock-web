// node scripts/export-erxes.mjs → docs/erxes/beautylock-{categories,products,delivery}.csv
// Files for erxes Products & Services import (Settings → Import). Every row comes from src/data/catalog.json.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const c = JSON.parse(readFileSync(path.join(root, "src/data/catalog.json"), "utf8"));
const out = path.join(root, "docs/erxes");
mkdirSync(out, { recursive: true });

const cell = (v) => {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const csv = (rows) => "﻿" + rows.map((r) => r.map(cell).join(",")).join("\n") + "\n";
const code = (id) => `BL-${id.toUpperCase()}`;

// categories: groups (parent BL) → kinds (parent = their group)
const groupOfKind = (k) => {
  const p = c.products.find((x) => x.kinds.includes(k));
  return p?.groups[0] ?? "skin";
};
const cats = [["code", "name", "parent code"], ["BL", "Beauty Lock", ""]];
for (const g of c.groups) cats.push([code(g.id), g.name, "BL"]);
for (const k of c.kinds) cats.push([code(k.id), k.name, code(groupOfKind(k.id))]);
cats.push(["BL-DELIVERY", "Хүргэлт", "BL"]);
writeFileSync(path.join(out, "beautylock-categories.csv"), csv(cats));

const bName = Object.fromEntries(c.brands.map((b) => [b.id, b.name]));
const rows = [["code", "name", "category code", "type", "unit price", "price before sale", "brand", "option", "stock (Zochil)", "skin concerns", "zochil product id", "image (website path)"]];
for (const p of c.products)
  for (const v of p.variants)
    rows.push([
      `BL-${v.id}`,
      [bName[p.brand], p.title, p.sub, v.label].filter(Boolean).join(" ").slice(0, 200),
      p.kinds[0] ? code(p.kinds[0]) : code(p.groups[0]),
      "product",
      v.price,
      v.compareAt ?? "",
      bName[p.brand] ?? "",
      v.label ?? "",
      v.stock ?? "",
      p.concerns.join(" "),
      p.id,
      p.images[0]?.src ?? "",
    ]);
writeFileSync(path.join(out, "beautylock-products.csv"), csv(rows));

const d = c.shop.delivery;
writeFileSync(
  path.join(out, "beautylock-delivery.csv"),
  csv([["code", "name", "category code", "type", "unit price", "free above (goods total)", "source"], ...d.map((x) => [`BL-DELIVERY-${x.id}`, `Хүргэлт: ${x.title}`, "BL-DELIVERY", "service", x.price, x.freeFrom ?? "", `Zochil delivery option ${x.id}`])]),
);
console.log(`categories ${cats.length - 1}, products ${rows.length - 1}, delivery ${d.length}`);
