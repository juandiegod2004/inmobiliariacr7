---
name: Coastal Trust Portfolio
colors:
  surface: '#f7f9ff'
  surface-dim: '#d5dae2'
  surface-bright: '#f7f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4fc'
  surface-container: '#e9eef6'
  surface-container-high: '#e3e9f0'
  surface-container-highest: '#dde3eb'
  on-surface: '#161c22'
  on-surface-variant: '#44474e'
  inverse-surface: '#2b3137'
  inverse-on-surface: '#ecf1f9'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#465f88'
  primary: '#002046'
  on-primary: '#ffffff'
  primary-container: '#1b365d'
  on-primary-container: '#87a0cd'
  inverse-primary: '#aec7f7'
  secondary: '#006c47'
  on-secondary: '#ffffff'
  secondary-container: '#8af5be'
  on-secondary-container: '#00714b'
  tertiary: '#00270c'
  on-tertiary: '#ffffff'
  tertiary-container: '#003f18'
  on-tertiary-container: '#00b754'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#aec7f7'
  on-primary-fixed: '#001b3d'
  on-primary-fixed-variant: '#2e476f'
  secondary-fixed: '#8df7c1'
  secondary-fixed-dim: '#71dba6'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005235'
  tertiary-fixed: '#66ff8e'
  tertiary-fixed-dim: '#3de273'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005322'
  background: '#f7f9ff'
  on-background: '#161c22'
  surface-variant: '#dde3eb'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Montserrat
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style
The design system focuses on high-end real estate brokerage in Santa Marta, Colombia. It balances the authoritative reliability of institutional finance with the vibrant, inviting energy of Caribbean coastal living. The brand personality is professional, transparent, and premium, targeting both local investors and international buyers.

The design style is **Corporate / Modern** with a focus on high-clarity information architecture. It utilizes a mobile-first approach that prioritizes property photography and clear calls-to-action. The visual language is defined by structured layouts, intentional whitespace to convey "luxury," and a subtle tactile quality achieved through soft shadows and refined border treatments.

## Colors
The palette is rooted in trust and conversion.
- **Primary (Navy Blue):** Used for structural elements, headers, and form labels to establish authority and permanence.
- **Secondary (Emerald Green):** The primary CTA color for "View Property" or "Schedule Visit" actions. It represents growth and the lush landscape of the Magdalena region.
- **Tertiary (WhatsApp Green):** Specifically reserved for immediate communication triggers and mobile-floating contact buttons, leveraging the ubiquity of the platform in the local market.
- **Neutrals:** A crisp white (#FFFFFF) is used for content cards to pop against the Light Gray (#F8F9FA) page backgrounds. Dark Gray (#343A40) provides high-legibility text contrast.

## Typography
The system uses a pairing of **Montserrat** for headlines to provide a bold, geometric, and modern feel, and **Inter** for body text to ensure maximum readability for technical property details and legal descriptions.

- Use `display-lg` for hero sections and property prices.
- Use `headline-md` for property titles in listing cards.
- Use `label-md` for metadata like "Property Type," "Location," or "Status" tags.
- Line heights are generous to maintain a relaxed, premium reading experience.

## Layout & Spacing
The layout follows a **Fluid Grid** system based on an 8px square rhythm.
- **Mobile:** Single column layout with 16px side margins. Elements like property galleries should use full-bleed or "peek-a-boo" horizontal scrolling.
- **Tablet (768px+):** 2-column grid for listings.
- **Desktop (1024px+):** 12-column grid with a 1280px max-width container. 
- Spacing between sections should be 80px on desktop and 48px on mobile to maintain the "airy" luxury aesthetic.

## Elevation & Depth
Depth is used to distinguish the "Search" and "Filter" tools from the content background. 
- **Surface 0:** Background (#F8F9FA).
- **Surface 1:** Content cards and Navigation bars (#FFFFFF).
- **Shadows:** Use a "Soft Coastal" shadow style. Shadows should have a large blur (24px-32px) and low opacity (6-8%) using the Primary Navy color as the shadow tint rather than pure black. This creates a cleaner, more integrated look.
- **Interactive Depth:** On hover, cards should lift slightly (y-axis shift of -4px) and the shadow opacity should increase to 12%.

## Shapes
The design system utilizes **Rounded** (Level 2) geometry. 
- **Buttons and Input Fields:** 8px (0.5rem) corner radius.
- **Property Cards:** 16px (1rem) corner radius for a softer, more modern consumer feel.
- **Image Containers:** Should always follow the parent card's radius.
- **Icons:** Use a 1.5pt or 2pt stroke weight with rounded caps to match the UI's friendliness.

## Components
- **Buttons:** Primary buttons use Emerald Green with white text. Secondary buttons (e.g., "Filters") use a Navy outline or Ghost style. WhatsApp buttons are unique—always pill-shaped with the WhatsApp Green background and the brand icon.
- **Property Cards:** Must include a high-resolution image, a Navy Blue price tag in the top-left, and an Emerald Green "New" or "Exclusive" badge in the top-right.
- **Input Fields:** Use 1px Light Gray borders that turn Navy Blue on focus. Labels should be small and Navy Blue, positioned above the field.
- **Chips/Tags:** Used for property features (e.g., "3 Bed," "Pool," "Ocean View"). These should have a subtle Light Gray background with Dark Gray text.
- **Sticky Contact Bar:** On mobile property pages, a sticky footer containing a "Call" button (Navy) and a "WhatsApp" button (Green) is mandatory.