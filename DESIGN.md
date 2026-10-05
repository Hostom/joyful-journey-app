---
name: Fenômeno Imóveis
colors:
  surface: '#fcf9f3'
  surface-dim: '#dcdad4'
  surface-bright: '#fcf9f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ed'
  surface-container: '#f0eee8'
  surface-container-high: '#eae8e2'
  surface-container-highest: '#e5e2dc'
  on-surface: '#1b1c18'
  on-surface-variant: '#414844'
  inverse-surface: '#30312d'
  inverse-on-surface: '#f3f0ea'
  outline: '#727973'
  outline-variant: '#c1c8c2'
  surface-tint: '#446653'
  primary: '#00180d'
  on-primary: '#ffffff'
  primary-container: '#0b2e1f'
  on-primary-container: '#749783'
  inverse-primary: '#aacfb9'
  secondary: '#795900'
  on-secondary: '#ffffff'
  secondary-container: '#fdd274'
  on-secondary-container: '#775800'
  tertiary: '#00180a'
  on-tertiary: '#ffffff'
  tertiary-container: '#002f19'
  on-tertiary-container: '#649b78'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c5ebd4'
  primary-fixed-dim: '#aacfb9'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#2c4d3d'
  secondary-fixed: '#ffdf9e'
  secondary-fixed-dim: '#ebc165'
  on-secondary-fixed: '#261a00'
  on-secondary-fixed-variant: '#5b4300'
  tertiary-fixed: '#b6f0c9'
  tertiary-fixed-dim: '#9bd3ae'
  on-tertiary-fixed: '#002110'
  on-tertiary-fixed-variant: '#1a5034'
  background: '#fcf9f3'
  on-background: '#1b1c18'
  surface-variant: '#e5e2dc'
  forest-deep: '#0B2E1F'
  forest-mid: '#16412C'
  forest-light: '#1F5538'
  gold-burnished: '#8A6B2C'
  gold-classic: '#C9A24A'
  gold-champagne: '#D9BC72'
  cream-foundation: '#FAF8F2'
  cream-stone: '#EDE8DA'
typography:
  display-lg:
    fontFamily: Libre Caslon Text
    fontSize: 64px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Libre Caslon Text
    fontSize: 40px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-xl:
    fontFamily: Libre Caslon Text
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  icon:
    fontFamily: Material Symbols Outlined
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.0'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1440px
  gutter: 24px
  section-padding: 120px
  element-gap: 16px
---

## Brand & Style

The design system for Fenômeno Imóveis embodies the exclusive, high-end atmosphere of Balneário Camboriú's luxury real estate market. The brand personality is authoritative yet approachable, positioning itself as a knowledgeable guide in a world of ultra-luxury coastal living. 

The aesthetic is **Minimalist with Corporate/Modern influences**, characterized by generous whitespace, architectural precision, and a focus on high-fidelity visual storytelling. It avoids decorative clutter to allow the property photography—the true "phenomenon"—to take center stage. The emotional response should be one of profound trust, quiet confidence, and aspirational desire.

## Colors

The palette is rooted in the "Forest Green" and "Gold" combination, reflecting both the natural coastal vegetation and the prestige of high-end development.

- **Primary (Forest Deep):** Used for primary backgrounds, navigation bars, and heavy typography to establish grounding and authority.
- **Secondary (Gold Classic):** Reserved for highlights, call-to-action buttons, and signature decorative elements (like thin dividers or iconography).
- **Neutral (Cream & Charcoal):** The system uses `#FAF8F2` (Cream Foundation) as the primary surface color instead of pure white to soften the high-contrast look and add a tactile, premium feel. `#3A3A36` (Charcoal) is used for body text to ensure readability without the harshness of pure black.

## Typography

The typography strategy relies on the tension between a traditional, literary serif and a sharp, contemporary sans-serif.

- **Headlines:** `Libre Caslon Text` provides an editorial feel, reminiscent of luxury lifestyle magazines. It should be used for all major headings and impactful quotes.
- **Body & Labels:** `Hanken Grotesk` offers a clean, technical contrast. Its high legibility is essential for property details and technical data. 
- **Styling Note:** Use `label-caps` for section overlines (e.g., "FEATURED PROPERTIES") to create a structured, architectural hierarchy.
- **Icons:** `Material Symbols Outlined` (Google Fonts) is the site's icon system, loaded globally and referenced via the `.material-symbols-outlined` class rather than a component library. It is a glyph set, not a text typeface — never use it for headings or body copy.

## Layout & Spacing

The layout is a **Fixed Grid** system (12 columns) that emphasizes vertical rhythm and "breathing room."

- **Generous Margins:** Desktop layouts should maintain a 120px padding between major sections to emphasize the luxury of space.
- **Reflow:** On mobile, the 12-column grid collapses to a 4-column layout, and section padding is reduced to 64px.
- **Asymmetry:** Inspired by high-end architectural sites, occasional off-grid placements (e.g., an image overlapping a text container) are encouraged to create a sense of movement.

## Elevation & Depth

This design system eschews heavy shadows in favor of **Tonal Layers** and **Low-Contrast Outlines**.

- **Surfaces:** Use `cream-stone` surfaces on top of `cream-foundation` backgrounds to create subtle, physical-feeling depth.
- **Borders:** Instead of shadows, use 1px solid borders in `gold-champagne` (at 30% opacity) to define cards and containers.
- **Image Depth:** Property photos should use subtle scale-up animations on hover rather than lift-shadows to maintain the minimalist, flat aesthetic.

## Shapes

The shape language is **Soft (0.25rem)**. This slight rounding takes the "edge" off the corporate feel, making the interface feel more like a home than an office.

- **Large Elements:** Major cards and hero sections should use the `rounded-lg` (0.5rem) token.
- **Buttons:** Primary buttons use a slightly higher roundedness for a tactile, "pressable" feel, but should never be fully pill-shaped.

## Components

### Buttons
- **Primary:** Forest Deep background with Gold Classic text. 1px Gold border. High-contrast and formal.
- **Secondary:** Transparent background with Forest Deep text and a 1px border in Forest Light.
- **CTA Animation:** On hover, primary buttons should fill from the bottom with Gold Classic.

### Input Fields
- **Style:** Underlined (bottom border only) for a sleek, minimal look. Use `Charcoal` for the label and `Forest Deep` for the active indicator.

### Cards (Property)
- **Structure:** Full-bleed image at the top with a 3:4 aspect ratio. Content area below uses `cream-stone` background.
- **Details:** Use `label-caps` for price and location.

### Chips & Badges
- **Status:** For "Sold" or "New Listing," use small, square-edged badges with Forest Deep backgrounds and Gold text, placed in the top-right corner of property images.

### Navigation
- **Floating Header:** A slim, transparent header that becomes `forest-deep` with 90% opacity upon scroll. Use Gold for the "Contact Us" primary action in the top right.