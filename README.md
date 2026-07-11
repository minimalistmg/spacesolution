# Space Solutions

Astro static website for Space Solutions — interior design services in Mysuru and Karnataka.

## Hosting

This website is hosted on [Cloudflare Pages](https://pages.cloudflare.com/). The static site is built with Astro into `dist/`, and form submissions are handled by a Pages Function at `functions/api/enquiry.js`.

### Prerequisites

- [Node.js](https://nodejs.org/) 20 or later
- A [Cloudflare account](https://dash.cloudflare.com/sign-up)
- This repository pushed to GitHub (for Git-based deploys), or [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) for manual deploys

---

### Option 1 — Deploy from GitHub (recommended)

Connect the repo once in the Cloudflare dashboard; every push to the production branch deploys automatically.

1. Log in to the [Cloudflare dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Select the `minimalistmg/spacesolution` repository (or your fork).
3. Use these build settings:

| Setting | Value |
|---------|-------|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` (leave default) |
| Node.js version | 20 (set under **Environment variables** → **Production** → `NODE_VERSION` = `20`) |

4. Click **Save and Deploy**.

After the first deploy, Cloudflare assigns a URL like `https://spacesolution.pages.dev`. Add a custom domain under **Custom domains** if needed (e.g. `spacesolution.in`).

**Deploy updates by pushing to Git:**

```powershell
git add .
git commit -m "Your change description"
git push origin main
```

Cloudflare builds and deploys automatically. Check status under **Workers & Pages** → your project → **Deployments**.

---

### Option 2 — Deploy from the command line (Wrangler)

Use this for one-off deploys or when Git integration is not set up.

Install Wrangler globally (once):

```powershell
npm install -g wrangler
```

Log in to Cloudflare (once per machine):

```powershell
wrangler login
```

Build the site, then deploy:

```powershell
npm install
npm run build
wrangler pages deploy dist --project-name=spacesolution
```

Replace `spacesolution` with your Cloudflare Pages project name if different. On first deploy, Wrangler creates the project if it does not exist.

**Create the project explicitly (optional, first time only):**

```powershell
wrangler pages project create spacesolution --production-branch=main
```

---

### Test production build locally (including the contact form API)

Pages Functions do not run with `npm run preview`. Use Wrangler to test the built site and `/api/enquiry` locally:

```powershell
npm run build
npx wrangler pages dev dist
```

Open the URL shown in the terminal (usually `http://localhost:8788`). Submit the enquiry or contact form to verify email delivery.

---

### Cloudflare Pages settings (reference)

| Setting | Value |
|---------|-------|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Functions directory | `functions` (auto-detected at repo root) |
| Node.js version | 20 |

### Contact form email (Resend)

Enquiry and contact forms POST to `/api/enquiry`, handled by `functions/api/enquiry.js` on Cloudflare Pages. Resend credentials are configured in that file.

---

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
