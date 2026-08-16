# Going live: Vercel + Supabase

Two accounts, both free, both keep working when you add a domain later.

---

## Step 1 — Host it on Vercel (2 minutes, do this first)

The site is already a GitHub repo, so there is no CLI and no upload.

1. Go to **[vercel.com/signup](https://vercel.com/signup)** and choose **Continue with GitHub**
2. Click **Add New → Project**
3. Find **`g-gorgeous-demo`** in the list and press **Import**
4. Leave every setting alone — framework preset "Other", no build command, root directory `./`
5. Press **Deploy**

About a minute later you get a live URL like `g-gorgeous-demo.vercel.app`.

From then on **every push to `main` redeploys automatically**. Nothing else to do.

### Adding your domain later

Buy the domain whenever you're ready, then in Vercel: **Project → Settings → Domains → Add**. Vercel shows you the two DNS records to paste at your registrar, and issues the HTTPS certificate free. The site does not change, nothing gets rebuilt, and the `.vercel.app` URL keeps working alongside it.

Nothing in the code refers to a domain, so there is no migration step. This is why hosting now and buying the domain later costs you nothing.

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
5. Open **`supabase/schema.sql`** from this repo, copy the whole file, paste it in
6. Press **Run**. You should see *Success. No rows returned.*

That creates every table, the security rules, the server-side order function and the image bucket.

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

## Free tier limits

| | Free allowance | Realistic for this shop? |
|---|---|---|
| Vercel bandwidth | 100 GB/month | Yes, comfortably |
| Supabase database | 500 MB | Thousands of orders |
| Supabase storage | 1 GB | ~500 product photos |
| Supabase auth users | 50,000 monthly active | Yes |
| Password-reset emails | Included | Yes |
| SMS codes | **Not included** — pay per message via Twilio | Optional |

The free tiers pause a Supabase project after a week of total inactivity; one visit wakes it. Not an issue for a live shop.

---

## Payments — separate track

Payments do **not** block any of the above. Get the site live on COD and bank transfer first, add a gateway when the merchant account clears.

Note that **Stripe and PayPal do not serve businesses in Pakistan**. The workable options are Safepay, PayFast Pakistan, or JazzCash/Easypaisa merchant APIs — all of which need a registered business, NTN and a company bank account. Confirm current terms with the provider directly.

When you have credentials, the payment callback runs as a Vercel serverless function in `/api`, which is the reason for hosting on Vercel rather than GitHub Pages.
