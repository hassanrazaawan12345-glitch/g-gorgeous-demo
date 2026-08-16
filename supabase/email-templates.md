# Branding the account emails

Out of the box, Supabase sends confirmation and password-reset emails from **its own address** with generic wording. Customers see "Supabase Auth" rather than G.Gorgeous, which looks like spam for a clothing shop.

There are two separate things to fix, and they are independent:

| | What it controls | Where |
|---|---|---|
| **1. Templates** | The subject line and the words in the email | Supabase dashboard — free |
| **2. SMTP** | Who the email appears to come from | Needs an email provider — free tier available |

Do **1** now; it takes five minutes and fixes most of the problem. Do **2** before real customers start signing up.

---

## 1. Templates (do this now)

**Authentication → Emails** → pick a template → paste the subject and body → **Save**.

Supabase substitutes `{{ .ConfirmationURL }}` with the real link. Leave those tags exactly as written.

### Confirm signup

**Subject:** `Confirm your G.Gorgeous account`

```html
<div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#0d0d0d">
  <div style="text-align:center;border-bottom:1px solid #e8e3d9;padding-bottom:20px;margin-bottom:28px">
    <div style="font-size:26px;letter-spacing:2px">G.GORGEOUS</div>
    <div style="font-size:11px;letter-spacing:5px;color:#a8842f;text-transform:uppercase">Gents Wear</div>
  </div>
  <p style="font-size:16px">Assalam o Alaikum,</p>
  <p style="font-size:15px;line-height:1.6;color:#2b2b2b">
    Thank you for creating an account with G.Gorgeous. Please confirm your email address to finish setting it up.
  </p>
  <p style="text-align:center;margin:32px 0">
    <a href="{{ .ConfirmationURL }}"
       style="background:#c8a24a;color:#1a1408;padding:14px 30px;text-decoration:none;
              font-family:Arial,sans-serif;font-size:13px;letter-spacing:2px;text-transform:uppercase;
              font-weight:bold;border-radius:4px;display:inline-block">Confirm my email</a>
  </p>
  <p style="font-size:13px;color:#6f6a63;line-height:1.6">
    If the button does not work, copy this link into your browser:<br>
    <span style="word-break:break-all;color:#a8842f">{{ .ConfirmationURL }}</span>
  </p>
  <p style="font-size:13px;color:#6f6a63">If you did not create this account, you can ignore this email.</p>
  <div style="border-top:1px solid #e8e3d9;margin-top:28px;padding-top:18px;font-size:12px;color:#9b968e;text-align:center">
    G.Gorgeous — Gents Wear<br>
    Shop #G77, Malikabad Shopping Mall, Rawalpindi<br>
    0342 5714108
  </div>
</div>
```

### Reset password

**Subject:** `Reset your G.Gorgeous password`

Same layout, with this middle section:

```html
  <p style="font-size:16px">Assalam o Alaikum,</p>
  <p style="font-size:15px;line-height:1.6;color:#2b2b2b">
    We received a request to reset the password on your G.Gorgeous account.
    This link works once and expires in an hour.
  </p>
  <p style="text-align:center;margin:32px 0">
    <a href="{{ .ConfirmationURL }}"
       style="background:#c8a24a;color:#1a1408;padding:14px 30px;text-decoration:none;
              font-family:Arial,sans-serif;font-size:13px;letter-spacing:2px;text-transform:uppercase;
              font-weight:bold;border-radius:4px;display:inline-block">Choose a new password</a>
  </p>
  <p style="font-size:13px;color:#6f6a63">
    If you did not ask for this, ignore this email — your password will not change.
  </p>
```

Also worth editing: **Magic Link**, **Change Email Address** and **Invite** use the same house style.

---

## 2. Sender address (before real customers)

Templates change the words. They cannot change **who it comes from** — that needs your own SMTP, set at **Project Settings → Authentication → SMTP Settings**.

There is a second reason this matters: Supabase's built-in mailer is **rate limited to a handful of emails per hour** and is explicitly not for production. Once a few people sign up at once, confirmation emails simply stop arriving.

Free options, all fine at this scale:

| Provider | Free tier | Notes |
|---|---|---|
| **Resend** | 3,000/month | Simplest setup, good deliverability |
| **Brevo** | 300/day | Generous, more configuration |
| **SendGrid** | 100/day | Widely used |

The steps are the same whichever you pick:

1. Create the account and **verify your domain** — this is the part that decides whether mail lands in the inbox or in spam, and it needs a domain, so it is best done once `ggorgeous.pk` (or similar) is bought
2. Copy the SMTP host, port, username and password
3. Paste them into Supabase → **SMTP Settings**
4. Set **Sender email** to something like `orders@ggorgeous.pk` and **Sender name** to `G.Gorgeous`

After that, customers see **G.Gorgeous** in their inbox rather than Supabase.

> Until a domain is verified you can still set the sender name, but deliverability will be poor — unverified senders get filtered as spam. This is the strongest practical argument for buying the domain sooner rather than later.
