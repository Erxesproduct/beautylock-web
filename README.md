# beautylock-web

Storefront for **Beauty Lock** (Korean and Vietnamese skin, hair and body care, Ulaanbaatar), replacing the Zochil
shop at beautylock.mn. Next.js 16 (App Router), Tailwind 4, orders and QPay through erxes 3.0.

Look: «Love Lock», strawberry milk pink, cherry, butter, mint, lilac and cocoa ink; Playpen Sans, Nunito Sans and
Bad Script (all with Ө Ү); heart-padlock mark, gingham, scalloped edges, sticker labels, jelly buttons.

## Pages

- `/`: the shop's own banners, skin concerns, best sellers, the 6-step routine, skin test, branches, brands, kids.
- `/shop`: filters by group, routine step, concern, brand, sale; search; sort (server-side, links only).
- `/p/<slug>`: gallery, options (size / shade), add to cart, delivery facts, «use together».
- `/skin-test`: 4 questions → skin type + a routine picked from the catalog (guidance, not a diagnosis).
- `/brands`, `/info` (delivery, payment, branches, FAQ, about), `/hearts` (saved in this browser), `/cart`,
  `/order/<reference>` (QPay status).

## Commands

```bash
npm install
npm run dev
npm run lint && npm run typecheck && npm run build
npm run test:order -- http://localhost:3000          # 29 order API checks; add --send for one real test order
npm run export:erxes                                  # docs/erxes/*.csv from src/data/catalog.json
```

Catalog data (`src/data/*.json`, `public/images/p/*`) was imported from Zochil shop 6709 on 2026-11-19.

erxes setup, open questions and the manual steps: [docs/erxes/MANUAL-STEPS.md](docs/erxes/MANUAL-STEPS.md).
Environment variables: [.env.example](.env.example).
