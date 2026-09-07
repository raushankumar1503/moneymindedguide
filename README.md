# MoneyMinded

> Clear, beginner-friendly personal-finance education — plain-English guides, worked examples, and free calculators.

**Live site:** https://moneymindedguide.com

MoneyMinded helps people who are new to managing money make confident, informed decisions. It covers budgeting, saving, debt, credit, banking, investing, and retirement in plain language, backed by official sources and paired with interactive calculators. All content is educational — not personalized financial advice.

## Contents

- [Features](#features)
- [What's covered](#whats-covered)
- [Calculators](#calculators)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Run locally](#run-locally)
- [Deploy](#deploy)
- [Editorial and sources](#editorial-and-sources)
- [License](#license)

## Features

- 24 in-depth guides across 10 categories, written for beginners
- 4 interactive calculators (budget, emergency fund, debt payoff, compound interest)
- Client-side site search (open with the search button, `/`, or `Cmd`/`Ctrl` + `K`)
- Responsive "paper-ledger" design; works with or without JavaScript
- SEO-ready: unique titles and meta, canonical URLs, XML sitemap, structured data (JSON-LD)
- Named author and editorial-standards page for transparency (E-E-A-T)
- Google Analytics 4 built in
- Accessibility-minded: motion respects `prefers-reduced-motion`, semantic headings, keyboard-navigable search

## What's covered

Budgeting · Saving · Debt & Credit · Investing · Retirement · Banking · Personal Finance · Money Basics · Financial Basics — each with its own category hub page, plus a Research section and a Calculators hub.

## Calculators

| Calculator | What it does |
|---|---|
| Budget (50/30/20) | Splits take-home pay into needs, wants, and savings |
| Emergency fund | Targets months of cover from your monthly expenses |
| Debt payoff | Months to clear a balance and total interest at a fixed payment |
| Compound interest | Future value of savings with regular contributions |

Each runs entirely in the browser through one shared, dependency-free engine (`calculators.js`) and shows its method, a worked example, and its assumptions.

## Tech stack

Static website — no framework, no build step, nothing to install.

- HTML5 (one file per page)
- CSS in a single stylesheet (`style.css`)
- Vanilla JavaScript: `app.js` (site-wide UI + search), `calculators.js` (calculator engine)
- Structured data: Article, BreadcrumbList, FAQPage, CollectionPage, Person / ProfilePage
- Google Analytics 4 (gtag.js)

## Project structure

```
index.html                     Homepage
*-.html (guides)               e.g. how-to-make-a-budget.html, what-is-compound-interest.html
budgeting.html, saving.html …  Category hub pages (10)
research.html                  Research hub
calculators.html               Calculators hub
*-calculator.html              Budget, emergency fund, debt payoff, compound interest
author-raushan-kumar.html      Author profile
about.html, contact.html       Site pages
privacy-policy.html, terms.html, disclaimer.html, editorial-standards.html
style.css                      Single stylesheet
app.js, calculators.js         Site JS
logo.svg                       Brand mark
sitemap.xml, robots.txt, ads.txt, 404.html
```

## Run locally

No build needed. Open `index.html` directly, or serve the folder so paths and search behave exactly as in production:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy

It is a plain static folder, so it deploys to any static host:

- **Cloudflare Pages** — Workers & Pages → Create → Pages → Upload assets → drag the folder contents.
- **GitHub Pages** — repo Settings → Pages → deploy from the `main` branch root. Add a `CNAME` file for a custom domain.

Attach the custom domain and enable HTTPS in the host's dashboard. Google Analytics is embedded in the pages, so it keeps working regardless of host.

## Editorial and sources

Written and edited by Raushan Kumar, founder and editor. Guides cite official, authoritative sources — the Consumer Financial Protection Bureau (CFPB), FDIC, Federal Reserve, and the SEC's Investor.gov. Figures that change year to year point readers to the official source rather than stating a number that may go stale.

MoneyMinded is not a licensed financial adviser. See [`disclaimer.html`](disclaimer.html) and [`editorial-standards.html`](editorial-standards.html) for the full policy.

## License

© 2026 MoneyMinded. All rights reserved. Content is provided for educational purposes only and is not financial, investment, tax, or legal advice.
