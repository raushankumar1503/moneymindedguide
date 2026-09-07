/* MoneyMinded — reusable calculator engine.
   No dependencies. Progressive enhancement: markup shows sensible default
   values, and this script wires up live recalculation on input.

   Drop a calculator into any page with:
     <div class="calc" data-calc="emergency-fund"> ... </div>
   The engine finds inputs/outputs by their id suffix (see FIELDS below) and
   recomputes on every input/change event. All results are clearly labelled
   estimates for illustration only — never personalized financial advice. */
(function () {
  "use strict";

  function num(v) { v = parseFloat(v); return isFinite(v) ? v : 0; }
  function money(x) {
    if (!isFinite(x)) return "—";
    return "$" + x.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
  function money2(x) {
    if (!isFinite(x)) return "—";
    return "$" + x.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function get(root, suffix) { return root.querySelector("[data-field='" + suffix + "']"); }
  function setOut(root, suffix, text) {
    var el = root.querySelector("[data-out='" + suffix + "']");
    if (el) { el.textContent = text; }
  }
  function val(root, suffix, floor) {
    var el = get(root, suffix);
    var n = el ? num(el.value) : 0;
    if (typeof floor === "number" && n < floor) { n = floor; }
    return n;
  }

  /* ---- Emergency Fund ----------------------------------------------------
     target = essential monthly expenses * months of cover.
     progress = current savings vs. target; monthly gap over a chosen horizon. */
  function emergencyFund(root) {
    var expenses = val(root, "expenses", 0);
    var months = val(root, "months", 0);
    var saved = val(root, "saved", 0);
    var target = expenses * months;
    var gap = Math.max(0, target - saved);
    setOut(root, "target", money(target));
    setOut(root, "gap", money(gap));
    setOut(root, "saveMonthly", gap > 0 ? money(Math.ceil(gap / 12)) : money(0));
  }

  /* ---- Debt Payoff -------------------------------------------------------
     Fixed monthly payment against a balance at a monthly rate.
     months to clear + total interest. Handles the "payment too small" case. */
  function debtPayoff(root) {
    var balance = val(root, "balance", 0);
    var apr = val(root, "apr", 0) / 100;
    var payment = val(root, "payment", 0);
    var i = apr / 12;
    var minInterest = balance * i;
    if (balance <= 0) {
      setOut(root, "months", "0");
      setOut(root, "interest", money2(0));
      setOut(root, "total", money2(0));
      return;
    }
    if (payment <= minInterest) {
      setOut(root, "months", "Never at this payment");
      setOut(root, "interest", "—");
      setOut(root, "total", "—");
      return;
    }
    var bal = balance, months = 0, interestPaid = 0;
    while (bal > 0 && months < 1200) {
      var interest = bal * i;
      interestPaid += interest;
      bal = bal + interest - payment;
      months++;
    }
    if (bal < 0) { interestPaid += bal; } /* last payment overshoots; trim */
    setOut(root, "months", months + (months === 1 ? " month" : " months"));
    setOut(root, "interest", money2(interestPaid));
    setOut(root, "total", money2(balance + interestPaid));
  }

  /* ---- Compound Interest -------------------------------------------------
     FV = P(1+i)^N + PMT*((1+i)^N - 1)/i,  i = r/n, N = n*t. */
  function compound(root) {
    var P = val(root, "principal", 0);
    var PMT = val(root, "contribution", 0);
    var rate = val(root, "rate", 0) / 100;
    var nEl = get(root, "frequency");
    var n = nEl ? (parseInt(nEl.value, 10) || 1) : 12;
    var years = val(root, "years", 0);
    var N = Math.round(n * years);
    var i = rate / n;
    var fv;
    if (N === 0) { fv = P; }
    else if (i === 0) { fv = P + PMT * N; }
    else { var g = Math.pow(1 + i, N); fv = P * g + PMT * ((g - 1) / i); }
    var contrib = P + PMT * N;
    setOut(root, "balance", money2(fv));
    setOut(root, "contrib", money2(contrib));
    setOut(root, "growth", money2(fv - contrib));
  }

  /* ---- 50/30/20 Budget ---------------------------------------------------
     Targets from monthly take-home pay: 50% needs, 30% wants, 20% savings.
     Optional actual needs/wants inputs show what is left to save + a status. */
  function budget(root) {
    var income = val(root, "income", 0);
    var needs = income * 0.5;
    var wants = income * 0.3;
    var savings = income * 0.2;
    setOut(root, "needs", money(needs));
    setOut(root, "wants", money(wants));
    setOut(root, "savings", money(savings));
    if (get(root, "needsActual") || get(root, "wantsActual")) {
      var needsA = val(root, "needsActual", 0);
      var wantsA = val(root, "wantsActual", 0);
      var leftToSave = income - needsA - wantsA;
      setOut(root, "savingsActual", money(leftToSave));
      var msg;
      if (income <= 0) { msg = "Enter your monthly take-home pay to see your split."; }
      else if (needsA + wantsA > income) { msg = "Your needs and wants already exceed your take-home pay."; }
      else if (leftToSave >= savings) { msg = "On track — you have at least 20% left to save."; }
      else { msg = "Below the 20% savings target. Trim needs or wants to close the gap."; }
      setOut(root, "status", msg);
    }
  }

  var ENGINES = {
    "emergency-fund": emergencyFund,
    "debt-payoff": debtPayoff,
    "compound": compound,
    "budget": budget
  };

  function ready(fn) {
    if (document.readyState !== "loading") { fn(); }
    else { document.addEventListener("DOMContentLoaded", fn); }
  }

  ready(function () {
    var calcs = document.querySelectorAll(".calc[data-calc]");
    calcs.forEach(function (root) {
      var engine = ENGINES[root.getAttribute("data-calc")];
      if (!engine) { return; }
      var run = function () { engine(root); };
      root.querySelectorAll("input, select").forEach(function (el) {
        el.addEventListener("input", run);
        el.addEventListener("change", run);
      });
      var btn = root.querySelector("[data-calc-btn]");
      if (btn) { btn.addEventListener("click", run); }
      run();
    });
  });
})();
