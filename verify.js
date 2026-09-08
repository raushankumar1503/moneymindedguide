// Semantic parity check: every migrated article (content/articles/*.md) is
// compared, original .html vs generated _site/ copy, on all SEO-critical fields,
// author box, all JSON-LD, and an EXACT article-body match. Exit 1 on any mismatch.
const fs = require("fs");
const path = require("path");
const ROOT = __dirname;

const norm = (s) => (s == null ? "" : String(s).replace(/\s+/g, " ").trim());
const grab = (h, re) => {
  const m = h.match(re);
  return m ? m[1] : null;
};
const anchorLinks = (block) =>
  [...(block || "").matchAll(/<a\s[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map(
    (m) => m[1] + " | " + norm(m[2])
  );
const sortKeys = (v) =>
  Array.isArray(v)
    ? v.map(sortKeys)
    : v && typeof v === "object"
    ? Object.keys(v)
        .sort()
        .reduce((a, k) => ((a[k] = sortKeys(v[k])), a), {})
    : v;
const canon = (o) => JSON.stringify(sortKeys(o));

const bodyRaw = (h) =>
  grab(h, /<article class="article-body">\n([\s\S]*?)\n[ \t]*<\/article>/);

function fields(h) {
  const tocBlock = (h.match(/<nav class="toc"[\s\S]*?<\/nav>/) || [""])[0];
  const relBlock = (h.match(/<section class="related">[\s\S]*?<\/section>/) || [""])[0];
  const srcBlock = (h.match(/<div class="sources">[\s\S]*?<\/div>/) || [""])[0];
  return {
    title: norm(grab(h, /<title>([\s\S]*?)<\/title>/)),
    description: grab(h, /<meta name="description" content="([\s\S]*?)">/),
    canonical: grab(h, /<link rel="canonical" href="([^"]+)">/),
    ogType: grab(h, /<meta property="og:type" content="([^"]*)">/),
    ogTitle: grab(h, /<meta property="og:title" content="([\s\S]*?)">/),
    ogDesc: grab(h, /<meta property="og:description" content="([\s\S]*?)">/),
    ogUrl: grab(h, /<meta property="og:url" content="([^"]+)">/),
    ogSite: grab(h, /<meta property="og:site_name" content="([^"]*)">/),
    twitter: grab(h, /<meta name="twitter:card" content="([^"]*)">/),
    gverify: grab(h, /<meta name="google-site-verification" content="([^"]*)">/),
    gaId: grab(h, /gtag\/js\?id=([A-Za-z0-9-]+)/),
    h1: norm(grab(h, /<h1>([\s\S]*?)<\/h1>/)),
    crumbHref: grab(h, /<a class="crumb" href="([^"]+)">/),
    crumbText: norm(grab(h, /<a class="crumb" href="[^"]+">([\s\S]*?)<\/a>/)),
    byline: norm(grab(h, /<div class="byline">([\s\S]*?)<\/div>/)),
    authorName: norm(grab(h, /<p class="author-name">([\s\S]*?)<\/p>/)),
    authorRole: norm(grab(h, /<p class="author-role">([\s\S]*?)<\/p>/)),
    authorBio: norm(grab(h, /<p class="author-bio">([\s\S]*?)<\/p>/)),
    authorUpdated: norm(grab(h, /<p class="author-updated">([\s\S]*?)<\/p>/)),
    footNote: norm(
      grab(h, /<div class="article-foot">[\s\S]*?<p class="note">([\s\S]*?)<\/p>/)
    ),
    toc: [...tocBlock.matchAll(/<a href="(#[^"]+)">([\s\S]*?)<\/a>/g)].map(
      (m) => m[1] + " | " + norm(m[2])
    ),
    faq: [
      ...h.matchAll(
        /<h3 class="faq-q">([\s\S]*?)<\/h3>\s*<p class="faq-a">([\s\S]*?)<\/p>/g
      ),
    ].map((m) => norm(m[1]) + " | " + norm(m[2])),
    related: anchorLinks(relBlock),
    sources: anchorLinks(srcBlock),
    jsonld: [
      ...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g),
    ].map((m) => JSON.parse(m[1])),
  };
}

const dir = path.join(ROOT, "content", "articles");
const slugs = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".md"))
  .map((f) => f.replace(/\.md$/, ""))
  .sort();

let totalPass = 0,
  totalFail = 0,
  pages = 0,
  skipped = 0;

console.log(`\n=== PARITY REPORT: ${slugs.length} migrated article(s) ===`);

for (const slug of slugs) {
  const origPath = path.join(ROOT, slug + ".html");
  const genPath = path.join(ROOT, "_site", slug + ".html");
  if (!fs.existsSync(origPath)) {
    console.log(`\n-- ${slug} --  SKIP (no original ${slug}.html)`);
    skipped++;
    continue;
  }
  if (!fs.existsSync(genPath)) {
    console.log(`\n-- ${slug} --  FAIL (no generated _site/${slug}.html — run build)`);
    totalFail++;
    continue;
  }
  const ORIG = fs.readFileSync(origPath, "utf8");
  const GEN = fs.readFileSync(genPath, "utf8");
  const O = fields(ORIG);
  const G = fields(GEN);
  pages++;

  let pass = 0,
    fail = 0;
  const out = [];
  const check = (name, a, b) => {
    const A = Array.isArray(a) ? JSON.stringify(a) : a;
    const B = Array.isArray(b) ? JSON.stringify(b) : b;
    const ok = A === B;
    if (ok) pass++;
    else {
      fail++;
      out.push(`  FAIL  ${name}`);
      out.push(`        orig: ${A}`);
      out.push(`        gen : ${B}`);
    }
  };

  for (const k of [
    "title",
    "description",
    "canonical",
    "ogType",
    "ogTitle",
    "ogDesc",
    "ogUrl",
    "ogSite",
    "twitter",
    "gverify",
    "gaId",
    "h1",
    "crumbHref",
    "crumbText",
    "byline",
    "authorName",
    "authorRole",
    "authorBio",
    "authorUpdated",
    "footNote",
  ])
    check(k, O[k], G[k]);

  check("toc", O.toc, G.toc);
  check("faq visible", O.faq, G.faq);
  check("related", O.related, G.related);
  check("sources", O.sources, G.sources);
  check("article-body (exact)", bodyRaw(ORIG), bodyRaw(GEN));

  const byType = (arr) => arr.reduce((m, o) => ((m[o["@type"]] = o), m), {});
  const Ot = byType(O.jsonld),
    Gt = byType(G.jsonld);
  check("jsonld count", [O.jsonld.length], [G.jsonld.length]);
  for (const t of ["Article", "BreadcrumbList", "FAQPage"])
    check(`jsonld ${t}`, Ot[t] ? canon(Ot[t]) : null, Gt[t] ? canon(Gt[t]) : null);

  totalPass += pass;
  totalFail += fail;
  const status = fail ? "FAIL" : "OK";
  console.log(
    `\n-- ${slug} --  ${status}  (${pass} passed, ${fail} failed; toc=${O.toc.length}, faq=${O.faq.length}, related=${O.related.length}, sources=${O.sources.length}, jsonld=${O.jsonld.length})`
  );
  if (out.length) console.log(out.join("\n"));
}

console.log(
  `\n=== TOTAL: ${pages} page(s) checked, ${skipped} skipped — ${totalPass} passed, ${totalFail} failed. ===`
);
process.exit(totalFail ? 1 : 0);
