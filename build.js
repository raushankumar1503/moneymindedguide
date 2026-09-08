// MoneyMinded single-source static generator. Zero dependencies (Node built-ins only).
// Reads _data/*.json + content/articles/*.md (---json front matter + HTML body),
// renders through templates/, writes to _site/. Preserves existing URLs and markup.
const fs = require("fs");
const path = require("path");
const base = require("./templates/base");
const article = require("./templates/article");

const ROOT = __dirname;
const OUT = path.join(ROOT, "_site");

const readJSON = (p) => JSON.parse(fs.readFileSync(p, "utf8"));

// Front matter: opening "---" or "---json", JSON block, closing "---", then HTML body.
function parseFrontMatter(raw, file) {
  const m = raw.match(/^---(?:json)?[ \t]*\n([\s\S]*?)\n---[ \t]*\n([\s\S]*)$/);
  if (!m) throw new Error(`No front matter in ${file}`);
  let data;
  try {
    data = JSON.parse(m[1]);
  } catch (e) {
    throw new Error(`Invalid JSON front matter in ${file}: ${e.message}`);
  }
  const body = m[2].replace(/\s+$/, "");
  return { data, body };
}

function build() {
  const site = readJSON(path.join(ROOT, "_data", "site.json"));
  const authors = readJSON(path.join(ROOT, "_data", "authors.json"));
  const categories = readJSON(path.join(ROOT, "_data", "categories.json"));

  const dir = path.join(ROOT, "content", "articles");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md")).sort();
  let count = 0;
  let warnings = 0;

  for (const file of files) {
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { data, body } = parseFrontMatter(raw, file);
    const page = Object.assign({}, data, { body });

    const author = authors[page.author];
    const category = categories[page.category];
    if (!author) throw new Error(`Unknown author '${page.author}' in ${file}`);
    if (!category) throw new Error(`Unknown category '${page.category}' in ${file}`);
    if (!page.permalink) throw new Error(`Missing permalink in ${file}`);

    const canonical = site.domain + page.permalink;

    // Safety: the FAQ that drives JSON-LD must also be visible in the body,
    // so structured data never drifts from what the reader sees.
    for (const f of page.faq || []) {
      if (!body.includes(f.q)) {
        console.warn(`WARN [${file}] FAQ question not found in body: "${f.q}"`);
        warnings++;
      }
      if (!body.includes(f.a)) {
        console.warn(`WARN [${file}] FAQ answer not found in body for: "${f.q}"`);
        warnings++;
      }
    }

    const jsonldBlocks = article.buildJsonld({ site, page, author, category, canonical });
    const mainHtml = article.main({ site, page, author, category });
    const html = base.document({ site, page, main: mainHtml, jsonldBlocks });

    const outPath = path.join(OUT, page.permalink.replace(/^\//, ""));
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, html, "utf8");
    console.log(`built ${page.permalink}`);
    count++;
  }

  // Copy shared assets so _site/ previews correctly on its own.
  for (const asset of ["style.css", "app.js", "calculators.js"]) {
    const src = path.join(ROOT, asset);
    if (fs.existsSync(src)) fs.copyFileSync(src, path.join(OUT, asset));
  }

  console.log(`\ndone: ${count} page(s) -> _site/  (${warnings} warning(s))`);
}

build();
