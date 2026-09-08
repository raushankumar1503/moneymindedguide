// Article layout: breadcrumb, H1, byline, author box, TOC, ad slots,
// article body (verbatim HTML from the content file), related, disclaimer.
// Also builds the three JSON-LD blocks (Article, BreadcrumbList, FAQPage).
const { esc } = require("./util");

function jsonldScript(obj) {
  const body = JSON.stringify(obj, null, 2)
    .split("\n")
    .map((l) => "  " + l)
    .join("\n");
  return `  <script type="application/ld+json">\n${body}\n  </script>`;
}

function buildJsonld({ site, page, author, category, canonical }) {
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.headline,
    description: page.description,
    author: {
      "@type": "Person",
      name: author.name,
      url: author.url,
      jobTitle: author.jobTitle,
    },
    publisher: { "@type": "Organization", name: site.siteName },
    datePublished: page.datePublished,
    dateModified: page.dateModified,
    mainEntityOfPage: canonical,
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.domain + "/" },
      { "@type": "ListItem", position: 2, name: category.name, item: category.url },
      { "@type": "ListItem", position: 3, name: page.headline, item: canonical },
    ],
  };
  const blocks = [article, breadcrumb];
  // FAQPage only when the article actually has FAQs (some pages have none).
  if ((page.faq || []).length) {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }
  return blocks.map(jsonldScript).join("\n");
}

function main({ page, author, category }) {
  const toc = page.toc
    .map((t) => `          <li><a href="${t.href}">${esc(t.label)}</a></li>`)
    .join("\n");
  const related = page.related
    .map((r) => `          <li><a href="${r.href}">${esc(r.label)}</a></li>`)
    .join("\n");
  return `  <main id="main" class="article">
    <div class="wrap">
      <div class="article-head">
        <a class="crumb" href="${category.page}">${esc(category.name)}</a>
        <h1>${esc(page.headline)}</h1>
        <div class="byline">
          <span>Written &amp; Edited by <a href="${author.page}" rel="author">${esc(author.name)}</a>, ${esc(author.jobTitle)}</span>
          <span class="sep"></span>
          <span>Published <time datetime="${page.datePublished}">${esc(page.publishedDisplay)}</time></span>
          <span class="sep"></span>${page.updatedDisplay ? `
          <span>Updated <time datetime="${page.dateModified}">${esc(page.updatedDisplay)}</time></span>
          <span class="sep"></span>` : ""}
          <span>${esc(page.readingTime)}</span>
        </div>
      </div>

      <aside class="author-box" aria-label="About the author">
        <div class="author-badge" aria-hidden="true">${esc(author.badge)}</div>
        <div class="author-info">
          <p class="author-name">${esc(author.name)}</p>
          <p class="author-role">${esc(author.role)}</p>
          <p class="author-bio">${author.bioHtml}</p>
          <p class="author-updated">Last reviewed ${esc(page.reviewedDisplay)} &middot; General educational information, not personalized financial advice.</p>
        </div>
      </aside>

      <nav class="toc" aria-label="Table of contents">
        <h2>In this guide</h2>
        <ol>
${toc}
        </ol>
      </nav>

      <div class="ad-slot" aria-hidden="true"><!-- AD SLOT (top) — paste an AdSense unit here after approval --></div>

      <article class="article-body">
${page.body}
      </article>

      <div class="ad-slot" aria-hidden="true"><!-- AD SLOT (bottom) — paste an AdSense unit here after approval --></div>

      <div class="article-foot">
        <section class="related">
          <h2>Keep reading</h2>
          <ul>
${related}
          </ul>
        </section>
        <p class="note">MoneyMinded provides general educational information, not personalized financial advice. Everyone's situation is different — see our <a href="disclaimer.html">full disclaimer</a>.</p>
      </div>
    </div>
  </main>`;
}

module.exports = { main, buildJsonld };
