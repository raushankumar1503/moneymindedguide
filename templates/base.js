// Base layout: <head>, header/nav, footer, full document shell.
// Reproduces the existing MoneyMinded page structure exactly.
const { esc } = require("./util");
const { ICONS } = require("./icons");

function head(site, page, jsonldBlocks) {
  const canonical = site.domain + page.permalink;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta name="google-site-verification" content="${site.googleSiteVerification}">
    <!-- Google Analytics (GA4) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${site.gaId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${site.gaId}');
    </script>
    <!-- End Google Analytics -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(page.title)} — ${esc(site.siteName)}</title>
  <meta name="description" content="${esc(page.description)}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${esc(page.ogTitle || page.title)}">
  <meta property="og:description" content="${esc(page.description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:site_name" content="${esc(site.siteName)}">
  <meta property="og:image" content="${site.domain}/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(site.siteName)} — simple money skills for real life">
  <meta property="og:locale" content="en_US">
  <meta property="article:modified_time" content="${page.dateModified}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:image" content="${site.domain}/og-image.png">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${site.fontsUrl}" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
  ${site.adsenseComment}
${jsonldBlocks}
  <script>document.documentElement.classList.add('js');</script>
</head>`;
}

function header(site) {
  const links = site.nav
    .map(
      (n) =>
        `        <a href="${n.href}">${ICONS[n.icon]} ${esc(n.label)}</a>`
    )
    .join("\n");
  return `  <header class="site-header">
    <div class="header-inner">
      <a class="brand" href="index.html">${esc(site.siteName)}<span class="dot">.</span></a>
      <button class="nav-toggle" type="button" aria-label="Open menu" aria-controls="primary-nav" aria-expanded="false">${ICONS.bars}</button>
      <nav class="nav" id="primary-nav" aria-label="Primary">
${links}
      </nav>
    </div>
  </header>`;
}

function footer(site) {
  const cats = site.footerCats
    .map(
      (c) =>
        `          <li><a href="${c.href}">${ICONS[c.icon]} ${esc(c.label)}</a></li>`
    )
    .join("\n");
  const links = site.footerSite
    .map((s) => `          <li><a href="${s.href}">${esc(s.label)}</a></li>`)
    .join("\n");
  return `    <footer class="site-footer">
    <div class="footer-inner">
      <div>
        <p class="brand-f">${esc(site.siteName)}</p>
        <p>${site.footerBlurb}</p>
      </div>
      <div>
        <h3>Categories</h3>
        <ul class="footer-cats">
${cats}
        </ul>
      </div>
      <div>
        <h3>Site</h3>
        <ul>
${links}
        </ul>
      </div>
    </div>
    <div class="footer-base">
      <span>${site.footerCopyright}</span>
      <span>${site.footerTagline}</span>
    </div>
  </footer>`;
}

function document({ site, page, main, jsonldBlocks, footHtml }) {
  return `${head(site, page, jsonldBlocks)}
<body>
  <a class="skip" href="#main">Skip to content</a>
${header(site)}

${main}

${footer(site)}
${footHtml ? footHtml + "\n" : ""}  <script src="app.js" defer></script>
</body>
</html>
`;
}

module.exports = { head, header, footer, document };
