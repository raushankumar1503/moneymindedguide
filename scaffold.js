// Dev tool (not shipped): derive content/articles/<slug>.md from an existing
// original .html, so migration never rewrites article content. Text fields that
// the templates re-escape are entity-decoded here (inverse of util.esc); the
// article body is copied verbatim; FAQ is read from the FAQPage JSON-LD.
// Usage: node scaffold.js <slug> [<slug> ...]
const fs = require("fs");
const path = require("path");
const ROOT = __dirname;

const categories = JSON.parse(
  fs.readFileSync(path.join(ROOT, "_data", "categories.json"), "utf8")
);

// Inverse of util.esc: undo &lt; &gt; &quot; first, then &amp; last.
const dec = (s) =>
  s == null
    ? null
    : s
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&");

const grab = (h, re) => {
  const m = h.match(re);
  return m ? m[1] : null;
};

function jsonldOfType(html, type) {
  for (const m of html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
  )) {
    try {
      const o = JSON.parse(m[1]);
      if (o && o["@type"] === type) return o;
    } catch (e) {
      /* ignore */
    }
  }
  return null;
}

function catKeyForPage(page) {
  for (const k of Object.keys(categories))
    if (categories[k].page === page) return k;
  throw new Error(`No category maps to crumb page "${page}"`);
}

function scaffold(slug) {
  const src = path.join(ROOT, slug + ".html");
  const h = fs.readFileSync(src, "utf8");

  const canonical = grab(h, /<link rel="canonical" href="([^"]+)">/);
  const permalink = canonical.replace(/^https?:\/\/[^/]+/, "");
  const crumbHref = grab(h, /<a class="crumb" href="([^"]+)">/);
  const category = catKeyForPage(crumbHref);

  const art = jsonldOfType(h, "Article") || {};
  const faqLd = jsonldOfType(h, "FAQPage");

  const bylineBlock = grab(h, /<div class="byline">([\s\S]*?)<\/div>/) || "";
  const publishedDisplay = dec(
    grab(bylineBlock, /Published <time datetime="[^"]*">([\s\S]*?)<\/time>/)
  );
  const updatedDisplay = dec(
    grab(bylineBlock, /Updated <time datetime="[^"]*">([\s\S]*?)<\/time>/)
  );
  const readingTime = dec(grab(bylineBlock, /<span>([^<]*?min read)<\/span>/));

  const reviewedDisplay = dec(
    grab(h, /<p class="author-updated">Last reviewed ([\s\S]*?) &middot;/)
  );

  const tocM = h.match(/<nav class="toc"[\s\S]*?<\/nav>/);
  const tocBlock = tocM ? tocM[0] : "";
  const toc = [...tocBlock.matchAll(/<a href="(#[^"]+)">([\s\S]*?)<\/a>/g)].map(
    (m) => ({ href: m[1], label: dec(m[2]).replace(/\s+/g, " ").trim() })
  );

  const relBlock = h.match(/<section class="related">[\s\S]*?<\/section>/);
  const related = relBlock
    ? [...relBlock[0].matchAll(/<a href="([^"]+)">([\s\S]*?)<\/a>/g)].map((m) => ({
        href: m[1],
        label: dec(m[2]).replace(/\s+/g, " ").trim(),
      }))
    : [];

  const faq = faqLd
    ? (faqLd.mainEntity || []).map((q) => ({
        q: q.name,
        a: q.acceptedAnswer && q.acceptedAnswer.text,
      }))
    : [];

  const body = grab(
    h,
    /<article class="article-body">\n([\s\S]*?)\n[ \t]*<\/article>/
  );
  if (body == null) throw new Error(`No article-body found in ${slug}.html`);

  const fm = {
    layout: "article",
    title: dec(grab(h, /<title>([\s\S]*?) — MoneyMinded<\/title>/)),
    ogTitle: dec(grab(h, /<meta property="og:title" content="([\s\S]*?)">/)),
    headline: dec(grab(h, /<h1>([\s\S]*?)<\/h1>/)),
    description: dec(grab(h, /<meta name="description" content="([\s\S]*?)">/)),
    permalink,
    slug,
    category,
    author: "raushan-kumar",
    datePublished: art.datePublished,
    dateModified: art.dateModified,
    publishedDisplay,
  };
  if (updatedDisplay) fm.updatedDisplay = updatedDisplay;
  fm.reviewedDisplay = reviewedDisplay;
  fm.readingTime = readingTime;
  fm.toc = toc;
  fm.faq = faq;
  fm.related = related;

  const out =
    "---json\n" + JSON.stringify(fm, null, 2) + "\n---\n" + body + "\n";
  const dest = path.join(ROOT, "content", "articles", slug + ".md");
  fs.writeFileSync(dest, out, "utf8");
  console.log(
    `scaffolded ${slug}.md  (cat=${category}, toc=${toc.length}, faq=${faq.length}, related=${related.length}, updated=${!!updatedDisplay})`
  );
}

const slugs = process.argv.slice(2);
if (!slugs.length) {
  console.error("usage: node scaffold.js <slug> [<slug> ...]");
  process.exit(1);
}
slugs.forEach(scaffold);
