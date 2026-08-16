# Going live: Cloudflare Pages + Supabase

Two accounts, both free, both keep working when you add a domain later.

---

## Step 1 — Host it on Cloudflare Pages (2 minutes, do this first)

**Recommended over Vercel** for this project. Three reasons:

1. **Vercel's free "Hobby" plan is for non-commercial use.** A shop taking real orders is commercial, which means the Pro plan at ~$20/month per member. Cloudflare Pages allows commercial use on the free plan.
2. **Unlimited bandwidth**, versus Vercel's 100 GB/month cap.
3. **Cloudflare has data centres inside Pakistan** (Karachi, Lahore, Islamabad), so the site loads noticeably faster for local customers.

The site is already a GitHub repo, so there is no CLI and no upload:

1. Sign up at **[dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)**
2. Left sidebar → **Workers & Pages** → **Create** → **Pages** tab → **Connect to Git**
3. Authorise GitHub, pick **`g-gorgeous-demo`**
4. Build settings — the site is plain static, so leave these empty:
   - Framework preset: **None**
   - Build command: *(blank)*
   - Build output directory: **`/`**
5. **Save and Deploy**

A minute later you get `g-gorgeous-demo.pages.dev`. **Every push to `main` redeploys automatically.**

### Adding your domain later

Buy the domain whenever you're ready, then: **your Pages project → Custom domains → Set up a domain**. Cloudflare handles DNS and the HTTPS certificate itself — if you buy the domain through Cloudflare Registrar it's a two-click job, and they sell at cost with no markup.

The site does not change and nothing gets rebuilt. Nothing in the code refers to a domain, so there is no migration step. This is why hosting now and buying the domain later costs you nothing.

### If you prefer Vercel anyway

[vercel.com/signup](https://vercel.com/signup) → **Continue with GitHub** → **Add New → Project** → import `g-gorgeous-demo` → change nothing → **Deploy**. A `vercel.json` is already in the repo, as is a `_headers` file for Cloudflare, so either host works with no code changes. Just be aware of the commercial-use term on the free plan.

---

## Step 2 — Create the Supabase project (5 minutes)

1. Go to **[supabase.com/dashboard](https://supabase.com/dashboard)** → **Sign in with GitHub**
2. **New project**
   - **Name:** `g-gorgeous`
   - **Database password:** generate one and **save it in your password manager** — it is not recoverable
   - **Region:** `Southeast Asia (Singapore)` — the closest to Pakistan, lowest latency
   - **Plan:** Free
3. Wait ~2 minutes while it provisions

### Load the database structure

4. Left sidebar → **SQL Editor** → **New query**
5. Open **`supabase/migrations/20260816090000_initial_schema.sql`** from this repo, copy the whole file, paste it in
6. Press **Run**. You should see *Success. No rows returned.*

That creates every table, the security rules, the server-side order function and the image bucket.

Then load the catalogue the same way with **`supabase/seed.sql`** — 20 products with colours, stock, photos and reviews.

### Why the files are laid out this way

`supabase/migrations/` and `supabase/seed.sql` are the layout the Supabase CLI and its GitHub integration expect, so schema history is versioned in git either way. Copy-pasting into the SQL Editor works exactly the same and needs no CLI — that is the simpler route and the one to use unless schema changes become frequent.

**On connecting Supabase to GitHub:** it is genuinely optional here. It shines when several people change the schema and you want preview branches per pull request. For a single shop whose schema changes a few times a year, running SQL in the dashboard is fewer moving parts and one less thing to break. The structure is in place if you ever want to switch.

### Turn on the login methods

7. **Authentication → Providers → Email** — leave enabled. For a real shop, turn **Confirm email** ON so addresses get verified.
8. **Authentication → Providers → Phone** — enable only if you want SMS login. It needs a Twilio or MessageBird account and **SMS is billed per message**, so email-only is the cheaper start.
9. **Authentication → URL Configuration** → set **Site URL** to your Vercel URL (and later your domain). This is what password-reset links point at — get it wrong and the emails lead nowhere.

### Get me the two keys

10. **Project Settings → API**, copy these two and send them over:

```
Project URL   https://xxxxxxxxxxxx.supabase.co
anon public   eyJhbGciOi...
```

**The `anon` key is safe to share and safe to put in the code** — it is designed to be public, and the Row Level Security policies in `schema.sql` are what actually protect the data.

⚠ **Never send me the `service_role` key.** That one bypasses all security. It only ever belongs in a server environment variable.

---

## Step 3 — What I do once you send the keys

- Wire `auth.js` to real Supabase Auth: proper sign-up, sign-in, and **password-reset emails that actually arrive**
- Move the 20 products, their photos, sizes and colours into the database
- Point the shop, product pages, cart and admin panel at live data
- Make orders go through `place_order()`, so prices and stock are validated on the server instead of in the browser
- Upload the product images to Supabase Storage
- Replace the admin PIN with a real admin login
- Test the whole thing against your live project and redeploy

After that, accounts work across devices, the owner sees real orders from real customers, and stock is genuinely shared.

---

## Free tier limits — and whether they're enough

| | Free allowance | Realistic for this shop? |
|---|---|---|
| Cloudflare Pages bandwidth | **Unlimited** | Yes |
| Cloudflare Pages builds | 500/month | Yes — that's 500 pushes |
| Supabase database | 500 MB | Years of orders. Text rows are tiny. |
| Supabase file storage | 1 GB | ~1,000 compressed photos |
| Supabase egress | 5 GB/month | **The real limit — see below** |
| Supabase auth users | 50,000 monthly active | Yes |
| Password-reset emails | Included | Yes |
| SMS codes | **Not included** — billed per message via Twilio | Optional |

### Keeping inside the free tier

The one number that could bite is Supabase's **5 GB/month egress**, because product photos are heavy and data is not. The fix is architectural:

- **Serve product photos from Cloudflare, not Supabase.** They live in the repo as static files, and Cloudflare's bandwidth is unlimited and free. Supabase then only sends JSON — a few KB per page view instead of a few MB.
- **Keep the admin panel's image compression.** It already resizes uploads to ~100 KB before saving. Uploading raw 4 MB phone photos would fill 1 GB in about 250 images; compressed, the same space holds thousands.
- **Watch videos.** A 30-second clip is 5–20 MB. Fifty of them would fill the free storage on their own. If the shop wants lots of video, put those on Cloudflare R2 (10 GB free, and unlike everyone else, **zero egress charges**) or just link to their TikTok.

Done that way, this shop will not come close to the free limits.

### When to actually pay

Supabase **Pro is $25/month** (check [supabase.com/pricing](https://supabase.com/pricing) — plans change). It raises the database to 8 GB, storage to 100 GB and egress to 250 GB, and adds daily backups and email support.

Worth paying for when one of these becomes true:

- **You want daily automatic backups.** The free plan has none. Once real customer orders are in the database, this is the strongest argument — losing them would be much more expensive than $25.
- Traffic outgrows 5 GB egress, or storage outgrows 1 GB.
- **The project pausing becomes annoying.** Free projects pause after 7 days with no requests at all; the next visit wakes it after a few seconds. A shop with daily traffic never pauses, so this rarely matters in practice.

**Start on free.** Nothing needs migrating when you upgrade — it's a button in the dashboard, same project, same keys, no downtime.

---

## Payments — separate track

Payments do **not** block any of the above. Get the site live on COD and bank transfer first, add a gateway when the merchant account clears.

Note that **Stripe and PayPal do not serve businesses in Pakistan**. The workable options are Safepay, PayFast Pakistan, or JazzCash/Easypaisa merchant APIs — all of which need a registered business, NTN and a company bank account. Confirm current terms with the provider directly.

When you have credentials, the payment callback runs as a Vercel serverless function in `/api`, which is the reason for hosting on Vercel rather than GitHub Pages.
