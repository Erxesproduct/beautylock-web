# Beauty Lock: erxes manual steps

Owner of every step below: **Terbish**, with Beauty Lock for credentials and decisions.

These steps happen in the erxes 3.0 admin (and at QPay / ebarimt.mn), not in code. The website reads the results
through the environment variables in `.env.example`. Never commit their values; set them in
**Vercel → beautylock-web → Settings → Environment Variables** and redeploy.

There is no erxes instance for Beauty Lock yet ("erxes 3.0: NOT SET"). Create the workspace first.

| Task | Website | erxes / external (manual) |
| --- | --- | --- |
| [1.1] Products, categories, prices | done: 162 products (182 SKUs with options) imported from Zochil | import the CSVs (section 1.1) |
| [1.2] QPay | done: invoice + status check through the erxes payment plugin | **blocked**: QPay merchant credentials, erxes payment method (1.2) |
| [1.3] eBarimt | done: person / company choice, registry number validated | **blocked**: PosAPI registration, TIN; receipts are issued by erxes (1.3) |
| [1.4] Delivery, fees, statuses | done: Ulaanbaatar and countryside 6,000₮, free above 500,000₮; address forms | delivery products, pipeline stages (1.4) |
| [1.5] Full journey test | validation verified (29 checks) | **blocked**: a real order needs the env vars and 1.2 / 1.3 (1.5) |

---

## 1.1 Products, categories, prices

Source: beautylock.mn (Zochil shop 6709), read 2026-11-19: **162 products**, 9 of them with options (size / shade),
**182 sellable SKUs**, MNT prices 1,500₮–216,000₮, 435 photos (pre-sized WebP on the website).

- Groups from the Zochil category tree: skin care 94, makeup 41, hair & body 23, kids 21, men 3, tools 7.
- Kinds (cleansers, toners, serums, creams, sun, masks, primers, cushions, shampoo, …) and the 6-step routine come
  from the Zochil sub-categories; 11 products without one got their kind from the name.
- Skin concerns (brightening, acne, pores, wrinkles, dry, sensitive) come from the Zochil «BEAUTY LOCK BOX»
  categories plus words in the name / description. They are labelled as guidance on the site, not a diagnosis.
- Brands (20): from the start of the product name, else the Zochil brand field.
- Prices: Zochil price; a Zochil sale price only where it is set. The 11.07–11.15 sale campaign had ended when the
  catalog was read, so its prices were **not** used.
- Stock: only 14 products track stock on Zochil, all at 0 → shown as sold out. The others are orderable
  (not counted). Open question 3.
- Old Zochil URLs (`/products/<category>/<id>`, category pages, `/about`, `/faq`) redirect to the new pages.

Files (made by `npm run export:erxes` from `src/data/catalog.json`):

- `docs/erxes/beautylock-categories.csv`: 34 rows, parent `BL`, groups `BL-SKIN`, `BL-MAKEUP`, …, kinds under them,
  `BL-DELIVERY`.
- `docs/erxes/beautylock-products.csv`: 182 rows, code `BL-<zochilId>` or `BL-<zochilId>-<variantId>`, name, category,
  unit price, price before sale, brand, option, Zochil stock, skin concerns, photo path.

Steps:

1. **Products & services → Categories**: import `beautylock-categories.csv` (parents first; already ordered).
2. **Settings → Import & Export → Import → Products**: upload `beautylock-products.csv`. Map `code → Code`,
   `name → Name`, `category code → Category code`, `unit price → Unit price`, `type → Type`. Keep the codes: website
   orders name every line with its `BL-…` code.
3. Brands: **Products & services → Brands** (or a product property «Брэнд») from the `brand` column.
4. **Inventories → Remainders**: enter real stock per branch (3, 4-р хороолол / Peace mall).
5. Photos: upload from `public/images/p/` (path in the CSV) if erxes should show them too.
