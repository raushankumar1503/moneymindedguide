# MoneyMinded

Personal-finance education for beginners — clear guides, worked examples, and free calculators. Live at **https://moneymindedguide.com**.

MoneyMinded publishes plain-English articles on budgeting, saving, debt, credit, banking, investing, and retirement, alongside interactive calculators (budget, emergency fund, debt payoff, compound interest). Content is educational, not personalized financial advice.

## Tech stack

Static website — no framework, no build step, no dependencies to install.

- HTML5 (one file per page)
- CSS in a single stylesheet (`style.css`)
- Vanilla JavaScript: `app.js` (site-wide UI + search) and `calculators.js` (calculator engine)
- Google Analytics 4 (gtag.js) in every page
- Structured data (JSON-LD): Article, BreadcrumbList, FAQPage, CollectionPage, Person/ProfilePage

## Project structure

- `index.html` — homepage
- Article pages — e.g. `how-to-make-a-budget.html`, `what-is-compound-interest.html`
- Category hubs — e.g. `budgeting.html`, `saving.html`, `investing.html`
- Calculators — `calculators.html` hub plus `budget-calculator.html`, `emergency-fund-calculator.html`, `debt-payoff-calculator.html`, `compound-interest-calculator.html`
- `author-raushan-kumar.html` — author profile
- Policy pages — `privacy-policy.html`, `terms.html`, `disclaimer.html`, `editorial-standards.html`
- `style.css`, `app.js`, `calculators.js`, `logo.svg`
- `sitemap.xml`, `robots.txt`, `ads.txt`, `404.html`

## Preview locally

No build needed. Either open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

A local server is recommended so that clean paths and the search work exactly as in production.

## Deploy

The site is a plain static folder, so it deploys to any static host:

- **Cloudflare Pages** — Workers & Pages → Create → Pages → Upload assets → drag the folder contents.
- **GitHub Pages** — repo Settings → Pages → deploy from the `main` branch root.

Attach the custom domain and enable HTTPS in the host's dashboard.

## Editorial

Written and edited by Raushan Kumar, founder and editor. Articles cite official sources (CFPB, FDIC, Federal Reserve, SEC / Investor.gov). MoneyMinded is not a licensed financial adviser; see `disclaimer.html` and `editorial-standards.html`.

© 2026 MoneyMinded. Content for educational purposes only.
