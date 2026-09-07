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
    toTop.innerHTML = '<i class="fa-solid fa-arrow-up" aria-hidden="true"></i>';
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
      if (a.querySelector(".fa-arrow-up-right-from-square")) { return; }
      var icon = document.createElement("i");
      icon.className = "fa-solid fa-arrow-up-right-from-square";
      icon.setAttribute("aria-hidden", "true");
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
        var icon = navToggle.querySelector("i");
        if (icon) { icon.className = open ? "fa-solid fa-xmark" : "fa-solid fa-bars"; }
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
      calcLink.innerHTML = '<i class="fa-solid fa-calculator" aria-hidden="true"></i> Calculators';
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
      searchBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>';
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
            '<i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>' +
            '<input type="search" class="search-input" autocomplete="off" ' +
              'placeholder="Search guides and calculators…" ' +
              'aria-label="Search guides and calculators" ' +
              'aria-controls="search-results" aria-expanded="true">' +
            '<button type="button" class="search-close" aria-label="Close search">' +
              '<i class="fa-solid fa-xmark" aria-hidden="true"></i></button>' +
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
