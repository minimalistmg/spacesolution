# Space Solutions

Static website for Space Solutions — interior design services in Mysuru and Karnataka.

## Start local server

From the project root:

```powershell
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

### Alternative (Node.js)

If you have Node.js installed:

```powershell
npx serve .
```

## Project structure

```
spacesolution/
├── index.html          # Redirects to pages/home.html
├── css/                # Stylesheets
├── js/                 # Scripts
└── pages/              # HTML pages
    ├── home.html
    ├── about.html
    ├── contact.html
    ├── portfolio.html
    ├── project-detail.html
    ├── privacy-policy.html
    ├── faq.html
    └── ...service pages
```
