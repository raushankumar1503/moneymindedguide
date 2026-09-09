# MoneyMinded — Move from Netlify to Cloudflare Pages

Goal: host the exact same site on Cloudflare Pages (free, fast, **no "Powered by" badge**, allows ad-monetized sites) and keep the domain `moneymindedguide.com`.

**Golden rule: do NOT delete the Netlify site until the new Cloudflare site is live on your domain.** Set up the new host first, cut the domain over, verify, and only then delete Netlify. This keeps the site online the whole time.

Your site is plain static HTML, so there is nothing to rebuild — you upload the same files.

---

## Step 1 — Create a Cloudflare account

1. Go to **dash.cloudflare.com/sign-up** and create a free account.
2. Verify your email and sign in.

---

## Step 2 — Create the Pages project (drag-and-drop, like Netlify)

1. In the Cloudflare dashboard sidebar, open **Workers & Pages**.
2. Click **Create** → **Pages** tab → **Upload assets** (this is the drag-and-drop option; no GitHub needed).
3. Give the project a name, e.g. `moneyminded`.
4. Open your Desktop `MoneyMinded` folder, select **all files inside it** (not the folder itself), and drag them onto the upload area. Include `index.html`, all `.html` pages, `style.css`, `app.js`, `calculators.js`, `sitemap.xml`, `robots.txt`, `ads.txt`, `404.html`.
5. Click **Deploy site**.
6. Cloudflare gives you a preview URL like `https://moneyminded.pages.dev`. Open it and confirm the homepage, a calculator page, and search all work. **No badge will appear.**

---

## Step 3 — Add your custom domain to Cloudflare

There are two ways. Option A is cleanest and gives the fastest site.

### Option A (recommended): move the domain to Cloudflare DNS
1. In the dashboard, click **Add a site**, enter `moneymindedguide.com`, pick the **Free** plan.
2. Cloudflare scans your existing DNS records — review them, keep anything you still use (for example, email/MX records if you set up `hello@moneymindedguide.com`).
3. Cloudflare shows you **two nameservers** (like `xxx.ns.cloudflare.com`).
4. Log in to wherever you **bought** the domain (your registrar), find **Nameservers**, and replace the current ones with Cloudflare's two. Save.
5. Wait for Cloudflare to say the domain is **Active** (usually minutes to a few hours).
6. Go back to **Workers & Pages** → your `moneyminded` project → **Custom domains** → **Set up a custom domain** → enter `moneymindedguide.com` (and add `www` if you want). Cloudflare wires the DNS record and issues SSL automatically.

### Option B: keep your current DNS, just point it
1. In **Workers & Pages** → your project → **Custom domains** → add `moneymindedguide.com`.
2. Cloudflare tells you the exact record to create (a CNAME to `moneyminded.pages.dev`).
3. Add that record at your current DNS provider. SSL is issued once it resolves.

---

## Step 4 — Verify the live site (before touching Netlify)

Open these in a normal browser tab and confirm each loads over **https** with a padlock and **no Netlify badge**:
- `https://moneymindedguide.com/`
- `https://moneymindedguide.com/calculators.html`
- `https://moneymindedguide.com/sitemap.xml`
- `https://moneymindedguide.com/robots.txt`
- `https://moneymindedguide.com/ads.txt`

Also click into a couple of articles and try the search button. Check on your phone too.

---

## Step 5 — Now delete the Netlify site

Only after Step 4 passes.
1. In Netlify: your site → **Site configuration** → scroll to the bottom → **Delete this site**.
2. If your domain's nameservers were pointed at **Netlify DNS**, make sure Step 3 Option A is fully Active on Cloudflare first, or the domain could briefly stop resolving.
3. Deleting the Netlify site does not touch the files on your computer — your Desktop `MoneyMinded` folder is untouched and is your master copy.

---

## After the move — housekeeping

- **Google Analytics** (`G-CE49N023SB`) keeps working; it is in your pages, not tied to the host.
- **Google Search Console**: no change needed if you verified by domain. If you verified by a Netlify-specific method, re-verify.
- **Contact form**: you chose to leave it as-is. Heads-up — the Netlify Forms wiring only works on Netlify, so on Cloudflare the submit button will not deliver messages. The "email us at hello@moneymindedguide.com" link on the contact page still works. When you want the form working again, tell me and I will switch it to Formspree (free) in about one minute — you would just paste one form ID.
- **Future updates**: to publish changes, repeat Step 2 (re-upload the folder) — Cloudflare replaces the deployment. No badge ever appears.

---

## Quick comparison

| | Netlify (free) | Cloudflare Pages (free) |
|---|---|---|
| "Powered by" badge | Yes, on free plan | **No** |
| Ad-monetized sites allowed | Yes | Yes |
| Custom domain + SSL | Yes | Yes |
| Drag-and-drop deploy | Yes | Yes |
| Built-in form handling | Yes (Netlify Forms) | No (use Formspree) |

The only feature you lose is Netlify Forms, and Formspree replaces it for free whenever you want it.
