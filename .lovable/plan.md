# Fenômeno Imóveis — Luxury Real Estate Landing

Port the supplied HTML (luxury real estate in Balneário Camboriú, PT-BR) into the TanStack Start project as a single-page site at `/`.

## Scope
- Single route: `src/routes/index.tsx` (homepage with all sections from the HTML)
- Replace placeholder index content
- Preserve the design exactly: deep forest green + champagne gold palette, Libre Caslon Text (display/serif) + Hanken Grotesk (body), Material Symbols Outlined icons
- Sections (per HTML): sticky nav, hero, featured properties, about/philosophy, services, testimonials, contact/CTA, footer
- Scroll behaviors: header shrink on scroll, reveal-on-scroll fade-up, subtle parallax on hero/section images

## Design tokens (add to `src/styles.css` via `@theme`)
- `--color-forest-deep: #0B2E1F`, `--color-forest-mid: #16412C`
- `--color-cream-foundation: #FAF8F2`, `--color-cream-stone: #EDE8DA`
- `--color-gold-champagne: #D9BC72`, `--color-gold-classic: #C9A24A`
- `--font-display: "Libre Caslon Text", serif`
- `--font-sans: "Hanken Grotesk", sans-serif`

## Fonts & icons
- Add `<link>` tags in `src/routes/__root.tsx` head for Libre Caslon Text, Hanken Grotesk, and Material Symbols Outlined (do NOT @import URLs in CSS)

## Images
- Use the same external image URLs referenced in the HTML (hotlinked), no asset uploads

## Interactivity
- IntersectionObserver-based reveal-up (React effect)
- Scroll listener for nav background/padding shrink
- Light parallax transform on hero/section images

## Out of scope
- No backend, no forms wiring beyond visual (contact CTA is a styled link)
- No additional routes; nav anchors scroll to in-page sections (acceptable here since it's a single marketing page)

## Technical notes
- Tailwind v4 CSS-first config; custom utilities via `@utility` if needed
- Single `index.tsx` component split into small sub-components (Nav, Hero, Properties, About, Services, Testimonials, Contact, Footer) co-located in `src/components/fenomeno/`
- `head()` on the index route: PT-BR title "Fenômeno Imóveis | Luxo em Balneário Camboriú", meta description, og/twitter tags
