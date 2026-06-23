
## Overview

Extend the Fenômeno Imóveis site with two new route trees:

1. `/imoveis` — listings page with filters (location, price range, property type)
2. `/imoveis/$slug` — individual property detail page with image gallery, key features, and inquiry CTA

The existing homepage's "Imóveis em Destaque" cards will link into these detail pages.

## Routes & Files

```
src/routes/
  imoveis.index.tsx        -> /imoveis (listings + filters)
  imoveis.$slug.tsx        -> /imoveis/:slug (detail page)
src/data/
  properties.ts            -> typed property catalog (shared source of truth)
src/components/fenomeno/
  PropertyCard.tsx         -> reusable card (used on home + listings)
  PropertyFilters.tsx      -> location / price / type filter UI
  PropertyGallery.tsx      -> detail-page image gallery (main + thumbs)
  InquiryCTA.tsx           -> WhatsApp / Email CTA block
```

`src/routes/index.tsx` will be updated to import properties from `src/data/properties.ts` and use `<Link to="/imoveis/$slug">` on each card. No visual redesign of existing sections.

## Data Model (`src/data/properties.ts`)

```ts
type Property = {
  slug: string;
  name: string;
  location: "Balneário Camboriú" | "Itapema" | "Itajaí";
  neighborhood: string;
  type: "Apartamento" | "Cobertura" | "Penthouse" | "Casa";
  price: number;           // BRL
  priceLabel: string;      // "R$ 12.500.000"
  area: number;            // m²
  bedrooms: number;
  suites: number;
  parking: number;
  description: string;     // 2–3 paragraphs
  features: string[];      // ~8–12 bullets
  images: string[];        // Unsplash URLs
};
```

Seed with ~6 properties (including the 3 already shown on the homepage). All images hotlinked from Unsplash, matching the existing aesthetic.

## Listings Page (`/imoveis`)

- Hero band with page title "Portfólio" + intro line, same forest/cream palette
- Sticky filter bar (`PropertyFilters`):
  - Location: select (Todas + each city)
  - Type: select (Todos + each type)
  - Price range: dual range or two selects (min/max in BRL)
  - "Limpar filtros" button
- Filter state held in URL search params via `validateSearch` + `fallback`/`zodValidator` (so filters are shareable/back-button safe)
- Results grid (`PropertyCard` reused from homepage), responsive 1/2/3 cols
- Empty state when no matches
- `head()` with route-specific title/description

## Detail Page (`/imoveis/$slug`)

- Loader: look up property by slug from `src/data/properties.ts`; throw `notFound()` if missing
- `head()` derives title, description, and og:image from the property (leaf-only og:image per guidelines)
- Sections:
  1. `PropertyGallery` — large hero image with clickable thumbnail strip (client state, no lightbox lib)
  2. Header: name, neighborhood, price, quick specs (área, dorms, suítes, vagas) in a gold-accented row
  3. Description prose
  4. "Características" — two-column feature list with material-symbols check icons
  5. `InquiryCTA` — WhatsApp + email buttons prefilled with property name, plus broker contact
  6. "Outros imóveis" — 3 related cards (same type or location)
- `errorComponent` + `notFoundComponent` on the route

## Homepage Wiring

- Replace inline property data in `src/routes/index.tsx` with imports from `src/data/properties.ts` (first 3 entries)
- Wrap each card in `<Link to="/imoveis/$slug" params={{ slug }}>`
- Add "Ver portfólio completo" button → `/imoveis`
- Add `/imoveis` link to the top nav (desktop + mobile)

## Out of Scope

- No backend, no real inquiry submission (CTA opens WhatsApp / mailto)
- No map view, no favorites, no auth
- No CMS — properties are a static TS file
