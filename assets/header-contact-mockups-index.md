# Header contact actions mockups index

Five space-efficient ways to present phone number, WhatsApp icon, and Get Quote in the header.

## Live preview (dev server)

| Variant | URL | Concept |
|---------|-----|---------|
| Default | http://localhost:4321/ | Current layout (Call us + number · WhatsApp · Get Quote) |
| v1 | http://localhost:4321/?cta=v1 | Icon-Only Trio |
| v2 | http://localhost:4321/?cta=v2 | Unified Contact Chip |
| v3 | http://localhost:4321/?cta=v3 | Micro Stack Block |
| v4 | http://localhost:4321/?cta=v4 | Contact Dropdown |
| v5 | http://localhost:4321/?cta=v5 | Segmented Action Bar |

Works on any page, e.g. `http://localhost:4321/portfolio?cta=v2`.

## Static mockup images

| File | Concept | Space saved | Best for |
|------|---------|-------------|----------|
| header-contact-01-icon-only-trio.png | **Icon-Only Trio** — phone, WhatsApp, and Quote as three compact icon/button squares; number hidden (tooltip on hover) | ~120px vs current | Wide nav, max header breathing room |
| header-contact-02-unified-chip.png | **Unified Contact Chip** — phone + number + WhatsApp fused in one dark pill; Quote button adjacent | ~40px vs current | Keeps number visible, still grouped |
| header-contact-03-micro-stack.png | **Micro Stack Block** — "CALL US" label stacked above number in a narrow block | ~30px vs current | Closest to current layout, tighter |
| header-contact-04-contact-dropdown.png | **Contact Dropdown** — single "Contact ▾" trigger; phone, WhatsApp, Quote in dropdown | ~160px vs current | Minimal header footprint; mobile-friendly pattern |
| header-contact-05-segmented-bar.png | **Segmented Action Bar** — phone, WhatsApp, Quote as one connected segmented control | ~50px vs current | Modern, unified visual; strong CTA grouping |

## Current layout (reference)

Phone block (icon + "Call us" + number) · WhatsApp square · Get Quote button — three separate elements, ~280px total width.

## Recommendation

- **02 Unified Chip** or **05 Segmented Bar** if the phone number must stay visible without hover.
- **01 Icon-Only Trio** if nav items need the most room at 1024–1280px breakpoints.
- **04 Contact Dropdown** if you want the cleanest header and can accept one extra click.
