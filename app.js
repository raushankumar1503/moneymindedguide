/* MoneyMinded — small progressive-enhancement layer.
   No dependencies. Every effect is optional: without JS the site
   works normally, and all motion respects prefers-reduced-motion. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function ready(fn) {
    if (document.readyState !== "loading") { fn(); }
    else { document.addEventListener("DOMContentLoaded", fn); }
  }

  ready(function () {

    /* 1 — soft shadow on the sticky header once the page is scrolled */
    var header = document.querySelector(".site-header");
    if (header) {
      var setShadow = function () {
        header.classList.toggle("scrolled", window.scrollY > 8);
      };
      setShadow();
      window.addEventListener("scroll", setShadow, { passive: true });
    }

    /* 2 — reveal cards / headings as they scroll into view */
    var reveals = document.querySelectorAll(".reveal");
    if (reveals.length) {
      if (reduceMotion || !("IntersectionObserver" in window)) {
        reveals.forEach(function (el) { el.classList.add("in"); });
      } else {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              io.unobserve(entry.target);
            }
          });
        }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
        reveals.forEach(function (el) { io.observe(el); });
      }
    }

    /* 3 — back-to-top button (built here so no-JS pages stay clean) */
    var toTop = document.createElement("button");
    toTop.type = "button";
    toTop.className = "back-to-top";
    toTop.setAttribute("aria-label", "Back to top");
    toTop.innerHTML = '<svg class="mm-ico" viewBox="0 0 384 512" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false"><path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"/></svg>';
    document.body.appendChild(toTop);

    var toggleTop = function () {
      toTop.classList.toggle("show", window.scrollY > 500);
    };
    toggleTop();
    window.addEventListener("scroll", toggleTop, { passive: true });

    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      var main = document.getElementById("main");
      if (main) {
        main.setAttribute("tabindex", "-1");
        main.focus({ preventScroll: true });
      }
    });

    /* 4 — mark external source links with a small icon + a11y hint */
    var extLinks = document.querySelectorAll('.sources a[target="_blank"]');
    extLinks.forEach(function (a) {
      if (a.querySelector(".mm-ico.external-link")) { return; }
      var icon = document.createElement("span");
      icon.className = "mm-ico external-link";
      icon.setAttribute("aria-hidden", "true");
      icon.innerHTML = '<svg viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor" focusable="false"><path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320z"/><path d="M80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v112c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"/></svg>';
      a.appendChild(document.createTextNode(" "));
      a.appendChild(icon);
      var label = (a.textContent || "").replace(/\s+/g, " ").trim();
      if (label && !/opens in a new tab/i.test(a.getAttribute("aria-label") || "")) {
        a.setAttribute("aria-label", label + " (opens in a new tab)");
      }
    });

    /* 5 — mobile nav: collapse the primary nav behind a hamburger toggle.
       JS-gated: without JS the full nav stays visible (see CSS .js guards). */
    var navToggle = document.querySelector(".nav-toggle");
    var primaryNav = document.getElementById("primary-nav");
    if (navToggle && primaryNav) {
      var setIcon = function (open) {
        var icon = navToggle.querySelector("svg");
        if (icon) {
          icon.setAttribute("viewBox", open ? "0 0 384 512" : "0 0 448 512");
          icon.innerHTML = open
            ? '<path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>'
            : '<path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/>';
        }
        navToggle.setAttribute("aria-expanded", open ? "true" : "false");
        navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      };
      navToggle.addEventListener("click", function () {
        setIcon(primaryNav.classList.toggle("open"));
      });
      /* close after tapping a link */
      primaryNav.addEventListener("click", function (e) {
        if (e.target.closest("a") && primaryNav.classList.contains("open")) {
          primaryNav.classList.remove("open");
          setIcon(false);
        }
      });
      /* close on Escape */
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && primaryNav.classList.contains("open")) {
          primaryNav.classList.remove("open");
          setIcon(false);
          navToggle.focus();
        }
      });
    }

    /* 6 — Calculators nav link + site search.
       Both are built in JS so no-JS pages keep a clean, static 8-item nav.
       The static files already link to calculators.html from the homepage,
       article bodies and the sitemap, so discovery does not depend on JS.

       INDEX: every entry points at a real page that exists in this site.
       Do not add an entry unless the file is present. */
    var INDEX = [
      { t: "50/30/20 Budget Calculator", u: "budget-calculator.html", c: "Calculator", k: "budget spending needs wants" },
      { t: "Emergency Fund Calculator", u: "emergency-fund-calculator.html", c: "Calculator", k: "savings save months expenses" },
      { t: "Debt Payoff Calculator", u: "debt-payoff-calculator.html", c: "Calculator", k: "credit card interest apr balance" },
      { t: "Compound Interest Calculator", u: "compound-interest-calculator.html", c: "Calculator", k: "invest growth returns" },
      { t: "All calculators", u: "calculators.html", c: "Section", k: "tools" },
      { t: "MoneyMinded Research", u: "research.html", c: "Section", k: "data original" },
      { t: "How to Make a Budget", u: "how-to-make-a-budget.html", c: "Budgeting", k: "" },
      { t: "The 50/30/20 Budget Rule", u: "50-30-20-budget-rule.html", c: "Budgeting", k: "" },
      { t: "How to Budget on a Low Income", u: "how-to-budget-on-a-low-income.html", c: "Budgeting", k: "" },
      { t: "How to Stop Living Paycheck to Paycheck", u: "stop-living-paycheck-to-paycheck.html", c: "Budgeting", k: "" },
      { t: "27 Realistic Ways to Save Money Every Month", u: "ways-to-save-money-every-month.html", c: "Saving", k: "" },
      { t: "How to Save Money on Groceries", u: "how-to-save-money-on-groceries.html", c: "Saving", k: "food" },
      { t: "How to Save for a House Deposit", u: "how-to-save-for-a-house-deposit.html", c: "Saving", k: "down payment mortgage" },
      { t: "How to Build an Emergency Fund From Scratch", u: "build-an-emergency-fund.html", c: "Saving", k: "" },
      { t: "How Much Emergency Savings Do You Need?", u: "how-much-emergency-fund-do-you-need.html", c: "Saving", k: "" },
      { t: "Sinking Funds, Explained", u: "sinking-funds-explained.html", c: "Saving", k: "irregular expenses" },
      { t: "Checking vs. Savings Account", u: "checking-vs-savings-account.html", c: "Banking", k: "" },
      { t: "How Credit Scores Work", u: "how-credit-scores-work.html", c: "Credit", k: "fico" },
      { t: "How to Improve Your Credit Score", u: "how-to-improve-your-credit-score.html", c: "Credit", k: "" },
      { t: "Good Debt vs. Bad Debt", u: "good-debt-vs-bad-debt.html", c: "Debt", k: "" },
      { t: "How to Get Out of Credit Card Debt", u: "how-to-get-out-of-credit-card-debt.html", c: "Debt", k: "" },
      { t: "Debt Snowball vs. Avalanche", u: "pay-off-debt-snowball-vs-avalanche.html", c: "Debt", k: "" },
      { t: "APR vs. APY", u: "apr-vs-apy.html", c: "Credit", k: "interest rate" },
      { t: "How to Start Investing With Little Money", u: "how-to-start-investing-with-little-money.html", c: "Investing", k: "" },
      { t: "Index Funds vs. Individual Stocks", u: "index-funds-vs-individual-stocks.html", c: "Investing", k: "etf" },
      { t: "What Is Compound Interest?", u: "what-is-compound-interest.html", c: "Money basics", k: "" },
      { t: "What Is Net Worth?", u: "what-is-net-worth.html", c: "Money basics", k: "assets" },
      { t: "How Does a 401(k) Work?", u: "how-does-a-401k-work.html", c: "Retirement", k: "" },
      { t: "401(k) Employer Match", u: "401k-employer-match.html", c: "Retirement", k: "" },
      { t: "Roth IRA vs. Traditional IRA", u: "roth-ira-vs-traditional-ira.html", c: "Retirement", k: "" },
      { t: "Budgeting guides", u: "budgeting.html", c: "Category", k: "" },
      { t: "Saving guides", u: "saving.html", c: "Category", k: "" },
      { t: "Banking guides", u: "banking.html", c: "Category", k: "" },
      { t: "Credit guides", u: "credit.html", c: "Category", k: "" },
      { t: "Debt & Credit guides", u: "debt-credit.html", c: "Category", k: "" },
      { t: "Investing guides", u: "investing.html", c: "Category", k: "" },
      { t: "Retirement guides", u: "retirement.html", c: "Category", k: "" },
      { t: "Money Basics guides", u: "money-basics.html", c: "Category", k: "" },
      { t: "About MoneyMinded", u: "about.html", c: "Page", k: "author editor" },
      { t: "Editorial standards", u: "editorial-standards.html", c: "Page", k: "sources method" },
      { t: "Contact", u: "contact.html", c: "Page", k: "email" }
    ];

    var headerInner = document.querySelector(".header-inner");

    /* 6a — add a "Calculators" link into the primary nav (runtime only) */
    if (primaryNav && !primaryNav.querySelector('a[href="calculators.html"]')) {
      var calcLink = document.createElement("a");
      calcLink.href = "calculators.html";
      calcLink.className = "nav-calc";
      calcLink.innerHTML = '<svg class="mm-ico" viewBox="0 0 384 512" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false"><path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64zM96 64H288c17.7 0 32 14.3 32 32v32c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V96c0-17.7 14.3-32 32-32zm32 160a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zM96 352a32 32 0 1 1 0-64 32 32 0 1 1 0 64zM64 416c0-17.7 14.3-32 32-32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H96c-17.7 0-32-14.3-32-32zM192 256a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm32 64a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zm64-64a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm32 64a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zM288 448a32 32 0 1 1 0-64 32 32 0 1 1 0 64z"/></svg> Calculators';
      if (/\/calculators\.html$/.test(location.pathname)) {
        calcLink.setAttribute("aria-current", "page");
      }
      primaryNav.appendChild(calcLink);
    }

    /* 6b — search button + overlay */
    if (headerInner) {
      var searchBtn = document.createElement("button");
      searchBtn.type = "button";
      searchBtn.className = "search-open";
      searchBtn.setAttribute("aria-label", "Search the site");
      searchBtn.innerHTML = '<svg class="mm-ico" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>';
      /* sit just before the mobile nav toggle when present, else at the end */
      if (navToggle && navToggle.parentNode === headerInner) {
        headerInner.insertBefore(searchBtn, navToggle);
      } else {
        headerInner.appendChild(searchBtn);
      }

      var overlay = document.createElement("div");
      overlay.className = "search-overlay";
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.setAttribute("aria-label", "Search MoneyMinded");
      overlay.hidden = true;
      overlay.innerHTML =
        '<div class="search-panel" role="document">' +
          '<div class="search-bar">' +
            '<svg class="mm-ico" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>' +
            '<input type="search" class="search-input" autocomplete="off" ' +
              'placeholder="Search guides and calculators…" ' +
              'aria-label="Search guides and calculators" ' +
              'aria-controls="search-results" aria-expanded="true">' +
            '<button type="button" class="search-close" aria-label="Close search">' +
              '<svg class="mm-ico" viewBox="0 0 384 512" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg></button>' +
          '</div>' +
          '<p class="search-hint" id="search-status" aria-live="polite">Start typing to search across every guide and calculator.</p>' +
          '<ul class="search-results" id="search-results" role="listbox"></ul>' +
        '</div>';
      document.body.appendChild(overlay);

      var input = overlay.querySelector(".search-input");
      var results = overlay.querySelector(".search-results");
      var status = overlay.querySelector("#search-status");
      var closeBtn = overlay.querySelector(".search-close");
      var lastFocus = null;
      var active = -1;
      var current = [];

      function score(item, terms) {
        var hay = (item.t + " " + item.c + " " + item.k).toLowerCase();
        var title = item.t.toLowerCase();
        for (var i = 0; i < terms.length; i++) {
          if (hay.indexOf(terms[i]) === -1) { return -1; }
        }
        if (title.indexOf(terms.join(" ")) === 0) { return 3; }
        if (title.indexOf(terms[0]) !== -1) { return 2; }
        return 1;
      }

      function render(q) {
        q = q.trim().toLowerCase();
        results.innerHTML = "";
        active = -1;
        if (!q) {
          current = [];
          status.textContent = "Start typing to search across every guide and calculator.";
          status.hidden = false;
          return;
        }
        var terms = q.split(/\s+/);
        var scored = [];
        INDEX.forEach(function (item) {
          var s = score(item, terms);
          if (s >= 0) { scored.push({ item: item, s: s }); }
        });
        scored.sort(function (a, b) { return b.s - a.s; });
        current = scored.slice(0, 8).map(function (x) { return x.item; });
        if (!current.length) {
          status.textContent = 'No matches for “' + q + '”. Try a broader word like "budget", "debt" or "invest".';
          status.hidden = false;
          return;
        }
        status.hidden = true;
        current.forEach(function (item, idx) {
          var li = document.createElement("li");
          li.setAttribute("role", "option");
          li.id = "search-opt-" + idx;
          li.innerHTML = '<a href="' + item.u + '"><span class="s-title"></span>' +
            '<span class="s-cat"></span></a>';
          li.querySelector(".s-title").textContent = item.t;
          li.querySelector(".s-cat").textContent = item.c;
          results.appendChild(li);
        });
      }

      function setActive(next) {
        var opts = results.querySelectorAll('[role="option"]');
        if (!opts.length) { return; }
        if (next < 0) { next = opts.length - 1; }
        if (next >= opts.length) { next = 0; }
        opts.forEach(function (o) { o.classList.remove("active"); });
        active = next;
        opts[active].classList.add("active");
        input.setAttribute("aria-activedescendant", opts[active].id);
        opts[active].scrollIntoView({ block: "nearest" });
      }

      function openSearch() {
        lastFocus = document.activeElement;
        overlay.hidden = false;
        document.body.classList.add("search-on");
        input.value = "";
        render("");
        input.focus();
      }
      function closeSearch() {
        overlay.hidden = true;
        document.body.classList.remove("search-on");
        input.removeAttribute("aria-activedescendant");
        if (lastFocus && lastFocus.focus) { lastFocus.focus(); }
      }

      searchBtn.addEventListener("click", openSearch);
      closeBtn.addEventListener("click", closeSearch);
      overlay.addEventListener("mousedown", function (e) {
        if (e.target === overlay) { closeSearch(); }
      });
      input.addEventListener("input", function () { render(input.value); });
      input.addEventListener("keydown", function (e) {
        if (e.key === "ArrowDown") { e.preventDefault(); setActive(active + 1); }
        else if (e.key === "ArrowUp") { e.preventDefault(); setActive(active - 1); }
        else if (e.key === "Enter") {
          var opts = results.querySelectorAll('[role="option"] a');
          if (active >= 0 && opts[active]) { window.location.href = opts[active].getAttribute("href"); }
          else if (opts.length) { window.location.href = opts[0].getAttribute("href"); }
        }
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && !overlay.hidden) { e.preventDefault(); closeSearch(); return; }
        var typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target.tagName || "")) ||
          (e.target.isContentEditable);
        if (overlay.hidden && !typing) {
          if (e.key === "/") { e.preventDefault(); openSearch(); }
          else if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
            e.preventDefault(); openSearch();
          }
        }
      });
    }

  });
})();
