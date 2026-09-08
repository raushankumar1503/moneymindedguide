// Semantic parity check: original how-to-make-a-budget.html vs generated _site copy.
// Compares SEO-critical fields + all JSON-LD + visible content. Exit 1 on any mismatch.
const fs = require("fs");
const path = require("path");
const ROOT = __dirname;

const ORIG = fs.readFileSync(path.join(ROOT, "how-to-make-a-budget.html"), "utf8");
const GEN = fs.readFileSync(path.join(ROOT, "_site", "how-to-make-a-budget.html"), "utf8");

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
    crumb: norm(grab(h, /<a class="crumb" href="([^"]+)">/)) ,
    crumbHref: grab(h, /<a class="crumb" href="([^"]+)">/),
    byline: norm(grab(h, /<div class="byline">([\s\S]*?)<\/div>/)),
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

const O = fields(ORIG);
const G = fields(GEN);
let pass = 0,
  fail = 0;
const out = [];

function check(name, a, b) {
  const A = Array.isArray(a) ? JSON.stringify(a) : a;
  const B = Array.isArray(b) ? JSON.stringify(b) : b;
  const ok = A === B;
  out.push(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (ok) pass++;
  else {
    fail++;
    out.push(`      orig: ${A}`);
    out.push(`      gen : ${B}`);
  }
}

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
  "byline",
])
  check(k, O[k], G[k]);

check(`toc (${O.toc.length} entries)`, O.toc, G.toc);
check(`faq visible (${O.faq.length})`, O.faq, G.faq);
check(`related links (${O.related.length})`, O.related, G.related);
check(`sources links (${O.sources.length})`, O.sources, G.sources);

const byType = (arr) => arr.reduce((m, o) => ((m[o["@type"]] = o), m), {});
const Ot = byType(O.jsonld),
  Gt = byType(G.jsonld);
check(`JSON-LD blocks count`, [O.jsonld.length], [G.jsonld.length]);
for (const t of ["Article", "BreadcrumbList", "FAQPage"])
  check(`JSON-LD ${t}`, Ot[t] ? canon(Ot[t]) : null, Gt[t] ? canon(Gt[t]) : null);

console.log(
  "\n=== PARITY REPORT: how-to-make-a-budget.html (original vs generated) ===\n"
);
console.log(out.join("\n"));
console.log(`\n${pass} passed, ${fail} failed.`);
process.exit(fail ? 1 : 0);
