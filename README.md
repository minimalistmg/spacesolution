# Space Solutions

Astro static website for Space Solutions — interior design services in Mysuru and Karnataka.

## Hosting

Hosted on [Cloudflare Pages](https://pages.cloudflare.com/). Pushes to the connected GitHub repository trigger automatic builds and deployments.

Enquiry and contact forms POST to `/api/enquiry`, handled by `functions/api/enquiry.js`. Resend credentials are configured in that file.

## Development

Install dependencies:

```powershell
npm install
```

Start the local dev server:

```powershell
npm run dev
```

For faster iteration (Astro only, skips minify and asset scripts — used by Cursor agents):

```powershell
npm run dev:fast
```

Or use the hidden launchers in [`dev-server/`](./dev-server/) — only two files to click:

- `dev-server/start-restart-dev.bat` — start or restart
- `dev-server/stop-dev.bat` — stop

Open [http://localhost:4321](http://localhost:4321) in your browser.

See [docs/cursor-agent/](./docs/cursor-agent/) for agent token-saving rules and workflow.

## Build

```powershell
npm run build
```

Preview the production build locally:

```powershell
npm run preview
```

## Website features

Interactive theme options (try links, params, storage keys):

**[website_features.md](./website_features.md)**

Quick start:

- [Open color palette switcher](https://spacesolution.in/?color_pallet=true)

## Project structure

```
spacesolution/
├── astro.config.mjs
├── functions/
│   └── api/
│       └── enquiry.js      # Resend email handler (Cloudflare Pages Function)
├── public/
│   ├── fonts/              # One folder per family: gotham, archivo, syne, canela, domaine-display, gilda
│   └── js/                 # Client-side scripts (incl. color-palette-selector.js, showcase.js)
├── src/
│   ├── components/         # Reusable Astro components (incl. ColorPaletteSelector)
│   ├── data/               # Site data (incl. colorPalettes.js)
│   ├── layouts/            # Page layouts
│   ├── pages/              # Routes (file-based routing)
│   ├── client/             # Source client JS (minified to public/js)
│   └── styles/             # Global CSS (incl. color-palette-selector.css)
└── dist/                   # Build output (deployed to Cloudflare Pages)
```

## Routes

| Page | URL |
|------|-----|
| Home | `/` |
| About | `/about` |
| Contact | `/contact` |
| Portfolio | `/portfolio` |
| Project Detail | `/project-detail` |
| FAQ | `/faq` |
| Privacy Policy | `/privacy-policy` |
| Residential Interiors | `/residential-interiors` |
| Commercial Interiors | `/commercial-interiors` |
| Institutional Interiors | `/institutional-interiors` |
| Turnkey Fitout (hub) | `/turnkey-fitout` |
| Turnkey Residential Fitout | `/turnkey-residential-fitout` |
| Project Showcase | `/showcase` | Desint-style GSAP experience (Hero → About → Services → Process → Library → CTA) |
