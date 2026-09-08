# MoneyMinded — Content Workflow

This document explains how to add and edit articles on MoneyMinded using the
single-source content system. It is written so that one article lives in **one
file**, and the repeated parts of every page (the `<head>`, Google Analytics tag,
navigation, author box, footer, and structured data) are generated automatically
from shared templates and data.

The generator has **zero runtime dependencies** — it uses only Node.js built-ins,
so there is nothing to install and no network access is required to build.

## The idea in one sentence

You write the article once in `content/articles/<slug>.md`; running `node build.js`
turns it into a finished `.html` page that is identical in structure to the pages
already on the site, with the boilerplate filled in for you.

## Folder layout

```
_data/
  site.json         Site-wide constants: domain, GA ID, nav, footer, fonts, etc.
  authors.json      Author profiles (name, page, job title, bio).
  categories.json   Category names and their hub-page URLs.
templates/
  base.js           The document shell: <head>, header/nav, footer.
  article.js        The article layout + JSON-LD (Article, Breadcrumb, FAQ).
  util.js           Small HTML-escaping helper.
content/articles/
  how-to-make-a-budget.md   One file per article (front matter + body).
build.js            Reads content + data, writes finished pages to _site/.
verify.js           Checks a generated page matches the original for SEO parity.
_site/              Build output (git-ignored). Not committed.
```

## Adding or editing an article

Each article file has two parts: a **front matter** block (settings, in JSON,
between `---json` and `---`) and the **article body** (plain HTML) after it.

```
---json
{
  "title":            "Page <title> (site name is appended automatically)",
  "ogTitle":          "Social-share title (usually same as title)",
  "headline":         "The visible H1 and the schema headline",
  "description":      "Meta description + social description (~150 chars)",
  "permalink":        "/your-article-slug.html",
  "slug":             "your-article-slug",
  "category":         "budgeting",
  "author":           "raushan-kumar",
  "datePublished":    "2026-09-01",
  "dateModified":     "2026-09-04",
  "publishedDisplay": "September 1, 2026",
  "updatedDisplay":   "September 4, 2026",
  "reviewedDisplay":  "September 4, 2026",
  "readingTime":      "9 min read",
  "toc":     [ { "href": "#section-id", "label": "Section name" } ],
  "faq":     [ { "q": "Question?", "a": "Answer." } ],
  "related": [ { "href": "other-article.html", "label": "Other article title" } ]
}
---
<p>Your article body as HTML goes here...</p>
<h2 id="section-id">Section name</h2>
...
```

Notes on the fields:

- **title vs headline.** The browser tab `<title>` uses `title` (with `— MoneyMinded`
  added for you); the visible `<h1>` and the Article schema use `headline`. They can
  differ, exactly as they do on the existing pages.
- **permalink** must keep the `.html` ending and match the current live URL so no
  links or search rankings break (for example `/how-to-make-a-budget.html`).
- **category** must be a key that exists in `_data/categories.json`.
- **author** must be a key that exists in `_data/authors.json`.
- **toc** entries point to `id` attributes on the `<h2>`/`<h3>` headings in your body.
- **faq** drives the FAQ structured data. The same questions and answers must also
  appear in the visible body (see "FAQ safety" below).
- **related** is the "Keep reading" list. Only link to pages that actually exist.

The body is written as ordinary HTML — the same tags the current articles use
(`<p>`, `<h2 id="...">`, `<ul>`, `<ol>`, `<table>`, `<div class="callout">`, the
`<div class="faq">` block, and the `<div class="sources">` block). Because the body
is passed through unchanged, what you write is exactly what ships.

## Changing site-wide things

You no longer edit 50 files to change a shared element:

- **Navigation, footer links, fonts, favicon, or the Google Analytics ID** →
  edit `_data/site.json` once.
- **Author name, job title, or bio** → edit `_data/authors.json` once.
- **A category name or hub URL** → edit `_data/categories.json` once.

Rebuild and every generated page picks up the change.

## Build and verify

```
node build.js     # generates every article in content/articles/ into _site/
node verify.js    # confirms _site/how-to-make-a-budget.html matches the original
```

`build.js` also copies `style.css`, `app.js`, and `calculators.js` into `_site/`
so the output folder previews correctly on its own (open the file in a browser).

`verify.js` compares the generated pilot page against the original
`how-to-make-a-budget.html` on every SEO-critical field: title, meta description,
canonical, Open Graph, Twitter card, the Google verification tag, the GA ID, the
`<h1>`, the byline, the table of contents, the visible FAQ, the related links, the
sources, and all three JSON-LD blocks (Article, BreadcrumbList, FAQPage). It exits
with an error if anything differs, so it is safe to run in an automated check later.

## FAQ safety

The FAQ appears in two places on a page: the visible Q&A block in the body and the
`FAQPage` structured data in the `<head>`. To keep them from drifting apart, the FAQ
text is stored once in the `faq` front-matter list (which generates the schema), and
`build.js` warns if any of those questions or answers is missing from the visible
body. Keep the two in sync; a future refinement can generate the visible block from
the same list to remove the duplication entirely.

## How this maps to deployment

The site is served as plain static files. Today the live pages sit at the repository
root and GitHub Pages serves them directly. This generator writes finished pages into
`_site/`. Going live with a generated page is a deliberate, separate step (promoting
the generated file to the served location, or switching the Pages build to run the
generator) and has intentionally **not** been done yet — the original
`how-to-make-a-budget.html` remains the live file until you verify the generated one
and approve the switch.

## Portability note (optional Eleventy path)

Each article file uses `---json` front matter followed by an HTML body. This is the
same format the Eleventy static-site generator accepts, so if you later choose to run
Eleventy on your own machine (`npm install`), the `content/` and `_data/` files carry
over with little change; only the two small template files would be rewritten in
Eleventy's template language. Nothing about the current setup locks you in.

## What this system deliberately does not change

- It does not alter any article's text, facts, sources, examples, or disclaimers.
- It does not change any existing URL.
- It does not touch the visual design, the CSS, `app.js`, or the calculators.
- It does not add a CMS, a framework, or any installed dependency.
