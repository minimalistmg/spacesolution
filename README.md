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

Open [http://localhost:4321](http://localhost:4321) in your browser.

## Build

```powershell
npm run build
```

Preview the production build locally:

```powershell
npm run preview
```

## Project structure

```
spacesolution/
├── astro.config.mjs
├── functions/
│   └── api/
│       └── enquiry.js      # Resend email handler (Cloudflare Pages Function)
├── public/
│   ├── fonts/              # Montserrat WOFF2 (400+700 active; 500+600 reserved)
│   └── js/                 # Client-side scripts
├── src/
│   ├── components/         # Reusable Astro components
│   ├── layouts/            # Page layouts
│   ├── pages/              # Routes (file-based routing)
│   └── styles/             # Global CSS
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
| Turnkey Fitout | `/turnkey-fitout` |
