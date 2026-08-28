---
name: Setu Health
colors:
  surface: '#fbf8ff'
  surface-dim: '#dad9e3'
  surface-bright: '#fbf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f2fd'
  surface-container: '#eeedf7'
  surface-container-high: '#e8e7f1'
  surface-container-highest: '#e3e1ec'
  on-surface: '#1a1b22'
  on-surface-variant: '#404944'
  inverse-surface: '#2f3038'
  inverse-on-surface: '#f1effa'
  outline: '#707974'
  outline-variant: '#bfc9c3'
  surface-tint: '#2b6954'
  primary: '#003527'
  on-primary: '#ffffff'
  primary-container: '#064e3b'
  on-primary-container: '#80bea6'
  inverse-primary: '#95d3ba'
  secondary: '#416656'
  on-secondary: '#ffffff'
  secondary-container: '#c3ecd7'
  on-secondary-container: '#476c5b'
  tertiary: '#442800'
  on-tertiary: '#ffffff'
  tertiary-container: '#623c00'
  on-tertiary-container: '#f69f0d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b0f0d6'
  primary-fixed-dim: '#95d3ba'
  on-primary-fixed: '#002117'
  on-primary-fixed-variant: '#0b513d'
  secondary-fixed: '#c3ecd7'
  secondary-fixed-dim: '#a8cfbc'
  on-secondary-fixed: '#002115'
  on-secondary-fixed-variant: '#294e3f'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#fbf8ff'
  on-background: '#1a1b22'
  surface-variant: '#e3e1ec'
  warm-white: '#fafaf9'
  off-white: '#f5f5f4'
  charcoal: '#1e293b'
  slate: '#475569'
  emerald-accent: '#10b981'
typography:
  hero-display:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  hero-display-mobile:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  button:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: '1'
  nav-link:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  container-max: 1280px
---

## Brand & Style

The design system is built on the narrative of "Digital Infrastructure as Care." It serves the rural healthcare landscape of Maharashtra by balancing the authority of public health institutions with the approachability of modern technology. The brand personality is **calm, precise, and dignified**, avoiding the cluttered aesthetic often associated with legacy government portals in favor of a **High-End Minimalist** approach.

The visual style leverages "Modern Indian Digital Public-Health Infrastructure," characterized by:
- **Quiet Authority:** Using deep emerald tones to signify growth and stability.
- **Radical Clarity:** Removing all non-essential decorative elements to focus on health outcomes and accessibility.
- **Warm Professionalism:** Utilizing warm-toned neutrals to ensure the interface feels welcoming rather than clinical or cold.

## Colors

The palette is anchored in **Deep Teal (#064e3b)**, a color that resonates with trust and the verdant landscape of rural India, specifically chosen to differentiate from the standard blue-toned corporate health sector.

- **Primary & Secondary:** The interaction between Deep Teal and Mint Emerald creates a high-contrast but soothing hierarchy. Use Mint for large background surfaces or secondary call-outs.
- **Background Strategy:** Use **Warm White (#fafaf9)** as the canvas. This reduces eye strain and provides a premium, paper-like quality compared to pure digital white.
- **Functional Accents:** Soft Amber is reserved strictly for informational awareness and cautionary states, never for primary actions.
- **Neutrals:** Zinc and Charcoal are used for text and iconography to maintain a soft, legible contrast that is easier on the eyes in high-brightness outdoor environments.

## Typography

This design system utilizes **Inter** exclusively to ensure maximum legibility and a systematic, utilitarian feel. 

- **Editorial Hierarchy:** Use generous vertical rhythm. Hero headlines should use tighter letter spacing to feel "locked" and professional.
- **Scale:** On mobile devices, headline sizes must step down aggressively (refer to `hero-display-mobile`) to prevent awkward text wrapping, while maintaining the 1.6x line-height for body text to assist readability for a wide range of literacy levels.
- **Weights:** Reserve 700 (Bold) for large display text and 600 (Semi-Bold) for functional headlines. Use 400 (Regular) for all long-form reading.

## Layout & Spacing

The layout philosophy follows a **Fixed-Fluid Hybrid Grid**. Content is contained within a maximum width of 1280px to maintain readability on ultra-wide monitors, but fluidly scales down to mobile.

- **The 8px Rhythm:** All spacing (padding, margins, gap) must be multiples of 4px, with a preference for an 8px base unit.
- **Whitespace as Content:** Avoid the urge to fill empty spaces. In this design system, whitespace is used to signal the "Premium" nature of the service and to reduce the cognitive load for patients.
- **Breakpoints:**
  - **Mobile:** 0 - 599px (4 columns, 16px margins)
  - **Tablet:** 600 - 1023px (8 columns, 24px margins)
  - **Desktop:** 1024px+ (12 columns, 64px margins)

## Elevation & Depth

This design system rejects heavy shadows in favor of **Tonal Layering and Low-Contrast Outlines**.

- **Surface Tiers:** Depth is communicated by placing Off-white (#f5f5f4) cards onto a Warm White (#fafaf9) background. 
- **Borders:** Use 1px solid borders using the Zinc (#71717a) color at 20% opacity. This creates "ghost borders" that define shape without adding visual noise.
- **Shadows:** If elevation is required (e.g., a modal or a floating action button), use a single, highly diffused "Ambient Shadow": `0 10px 30px rgba(30, 41, 59, 0.04)`.

## Shapes

The shape language is **Soft-Geometric**. By using a consistent 0.5rem (8px) base radius, we bridge the gap between the strictness of government architecture and the friendliness of a healthcare provider.

- **Standard Radius:** 8px for small components (inputs, small buttons).
- **Large Radius:** 16px (rounded-lg) for main content cards and containers.
- **Interactive Elements:** Buttons utilize a slightly more pronounced rounding (12px) to make them feel "pressable" and distinct from structural containers.

## Components

- **Buttons:**
  - **Primary:** Height 52px. Solid Deep Teal (#064e3b) with Warm White text. 12px corner radius.
  - **Secondary:** Height 52px. Transparent background with a 1px Zinc (#71717a) border. 
- **Cards:**
  - Background: #FFFFFF (to pop against the #fafaf9 page background). 1px subtle border. No shadow. 16px internal padding.
- **Input Fields:**
  - Minimalist style with a 1px Zinc border. On focus, the border transitions to Deep Teal. Labels are always persistent above the field in `label-sm` style.
- **Navigation:**
  - A sticky top bar, 72px height, with a slight background blur (Glassmorphism) or solid Warm White. Use high-contrast Charcoal for links.
- **Chips/Badges:**
  - Used for health categories or status. Small, 24px height, using the Secondary Mint (#d1fae5) background with Primary Deep Teal text.
- **Status Indicators:**
  - Use Soft Amber for "Pending" or "In-Progress" states, ensuring the icons used are clear and universal.