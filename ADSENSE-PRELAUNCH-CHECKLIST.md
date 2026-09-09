# MoneyMinded — AdSense Pre-Apply Checklist

A short, ordered checklist for applying to Google AdSense. None of this guarantees approval — Google reviews every site manually, and personal-finance ("Your Money or Your Life") sites are reviewed strictly — but completing these steps removes the common reasons for rejection.

**Status as of 2026-09-08:** the site is deployed, live on its custom domain over HTTPS, and verified in Search Console with the sitemap submitted. The one remaining gate is **indexing/settling time** (Steps 1–3 are done; you are at Step 4). Do **not** apply until the site has been indexed for a couple of weeks.

---

## Current setup (how this site actually works)

- **Hosting:** GitHub Pages, from the `main` branch of `github.com/raushankumar1503/moneymindedguide`.
- **Deploy = git push.** To publish a change: commit it on `main`, then `git push origin main`. GitHub Pages rebuilds automatically in ~1 minute. (There is no Netlify anymore — the site was migrated off Netlify on 2026-09-07.)
- **Domain:** `moneymindedguide.com`, DNS managed at **Hostinger** (4 A-records → GitHub Pages `185.199.108–111.153`, `www` CNAME → `raushankumar1503.github.io`). "Enforce HTTPS" is on in the GitHub Pages settings.
- **Analytics:** GA4, measurement ID **`G-Y9TY1WFQ3F`** (sitewide).
- **Contact:** `hello@moneymindedguide.com` (also a form on `contact.html`).

---

## Step 1 — Deploy the current site  ✅ DONE

The site is live on GitHub Pages. Whenever you make future changes, publish them with:

```
git add -A
git commit -m "your message"
git push origin main
```

**Verify:** open `https://moneymindedguide.com/`, confirm the Calculators pages load and the search button works.

---

## Step 2 — Custom domain live over HTTPS  ✅ DONE

Apply to AdSense with your real domain (`moneymindedguide.com`), never a `github.io` subdomain.

**Verify** these all load without a security warning:
- `https://moneymindedguide.com/`
- `https://moneymindedguide.com/calculators.html`
- `https://moneymindedguide.com/sitemap.xml`
- `https://moneymindedguide.com/ads.txt`
- `https://moneymindedguide.com/robots.txt`

---

## Step 3 — Google Search Console  ✅ DONE

The property is verified and `sitemap.xml` (48 URLs) is submitted.

**What to watch:** open Search Console → **Indexing → Pages**. On a brand-new domain this report is empty at first — that is normal and just means Google has not finished crawling yet. Over the coming weeks the "Indexed" count should climb.

---

## Step 4 — Let the site settle  ⏳ YOU ARE HERE

This is the current gate. Applying the day you launch is the single most common cause of a "site not ready / low value" rejection.

- Give Google **2–4 weeks** to crawl and index the pages.
- Check progress by searching Google for `site:moneymindedguide.com` — your pages should start appearing. Wait until a good share of your 24 articles show up.
- Confirm a little real traffic is flowing (GA4 Realtime, ID `G-Y9TY1WFQ3F`).
- Re-read 3–4 articles on your phone to confirm they look right on mobile.

---

## Step 5 — Apply to AdSense

1. Go to **adsense.google.com** and sign up with your domain `moneymindedguide.com`.
2. AdSense gives you a code snippet and asks you to place it in your site's `<head>`. Tell me your **publisher ID** (looks like `ca-pub-1234567890123456`) — I will **uncomment the AdSense loader and insert your real ID on every page** (it is currently a commented-out placeholder on the pages, waiting for exactly this).
3. `git push origin main` to publish, then submit for review. Reviews typically take a few days to two weeks.

---

## Step 6 — After you are approved

1. **ads.txt** — replace `pub-0000000000000000` in `ads.txt` with your real publisher ID (the digits after `ca-pub-`), keep the rest of the line identical, then `git push origin main`. It must stay reachable at `https://moneymindedguide.com/ads.txt`.
2. Give me the publisher ID and I will place ad units in the existing ad slots across the article pages (there are two `<!-- AD SLOT -->` placeholders in each article).
3. `git push origin main`.

---

## Quick reference — what is already done for you

- 24 original articles (each ~1,600–4,000 words), 4 calculators, 10 category hubs, author page.
- All required policy pages: Privacy, Terms, Disclaimer, Contact, About, Editorial standards.
- Privacy policy discloses cookies and links to Google's ad-technology / partner-site policies (what AdSense looks for).
- Named author (Raushan Kumar), editorial-process page, official-source citations (CFPB, FDIC, Federal Reserve, IRS, SEC/Investor.gov).
- Unique titles/meta, valid structured data, one H1 per page, sitemap (48 URLs), `robots.txt` allowing crawl, mobile-friendly, HTTPS.
- AdSense loader is intentionally **commented out** (inert) until you have a publisher ID. Note: the loader block currently exists on some pages; at apply time I will make sure it is present and uncommented on **all** pages so Auto Ads run sitewide.
- `ads.txt` is in place with a placeholder ID and swap instructions.

## What only you can do

- The AdSense application itself, and any domain/DNS changes.
- Provide the AdSense **publisher ID** when you apply — hand it to me and I will wire it into every page and into `ads.txt`.

---

*No part of this guarantees AdSense approval, Google ranking, or traffic. It removes common blockers; the decision is Google's.*
