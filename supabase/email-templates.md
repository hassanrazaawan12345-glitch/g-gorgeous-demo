# Branded account emails

Supabase sends these with generic wording by default, so customers see something
that reads like a developer tool rather than a clothing shop.

## ⚠ Read this first: templates are locked until SMTP is set up

The Authentication → Emails screen shows:

> **Set up custom SMTP to edit templates.** Emails will be sent using the
> default templates.

So the two jobs are **not** independent, despite what an earlier version of this
file said. The order is:

1. **Set up custom SMTP** (Part 1 below) — this also fixes the sender address
2. **Then** the Subject and Body fields unlock and you can paste the branded
   templates (Part 2)

Nothing is broken in the meantime. Confirmation and reset emails still send and
still work — they just look generic and come from a Supabase address.

---

## Part 1 — Custom SMTP (do this first)

Set this under **Authentication → Emails → Set up SMTP** (the button on the
notice), or **Project Settings → Authentication → SMTP Settings**.

This does two things at once: it makes emails come from your address, and it
unlocks template editing.

There is a second, more urgent reason: Supabase's built-in mailer is
**rate limited to a handful of emails per hour** and is explicitly not for
production. If several people sign up at once, confirmation emails simply stop
arriving and nobody is told.

Free providers, all fine at this scale:

| Provider | Free tier |
|---|---|
| **Resend** | 3,000/month — simplest setup |
| **Brevo** | 300/day |
| **SendGrid** | 100/day |

Steps are the same whichever you choose:

1. Create the account and **verify your domain** — this is what decides whether
   mail lands in the inbox or in spam, so it needs the domain bought first
2. Copy the SMTP host, port, username and password
3. Paste them into Supabase → **SMTP Settings**
4. Set **Sender email** to something like `orders@ggorgeous.pk`
   and **Sender name** to `G.Gorgeous`

After that, customers see **G.Gorgeous** in their inbox.

> Until a domain is verified, deliverability will be poor no matter what the
> sender name says — unverified senders get filtered. This is the strongest
> practical reason to buy the domain sooner rather than later.

---

## Part 2 — The templates (once SMTP is on)

Open your project's template screen:

`https://supabase.com/dashboard/project/kqrfreudkcloszuxjogd/auth/templates`

For each template below: pick it from the list on the left, replace the
**Subject heading** and the **Message body**, then press **Save**.

`{{ .ConfirmationURL }}` is replaced by Supabase with the real link. Leave it
exactly as written or the email will not work.

---

### 1. Confirm signup

**Subject heading**

```
Confirm your G.Gorgeous account
```

**Message body**

```html
<div style="font-family:Georgia,'Times New Roman',serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#0d0d0d;background:#ffffff">
  <div style="text-align:center;border-bottom:1px solid #e8e3d9;padding-bottom:20px;margin-bottom:28px">
    <div style="font-size:26px;letter-spacing:2px;color:#0d0d0d">G.GORGEOUS</div>
    <div style="font-size:11px;letter-spacing:5px;color:#a8842f;text-transform:uppercase;margin-top:4px">Gents Wear</div>
  </div>
  <p style="font-size:16px">Assalam o Alaikum,</p>
  <p style="font-size:15px;line-height:1.7;color:#2b2b2b">Thank you for creating an account with G.Gorgeous. Please confirm your email address to finish setting it up.</p>
  <p style="text-align:center;margin:32px 0">
    <a href="{{ .ConfirmationURL }}"
       style="background:#c8a24a;color:#1a1408;padding:14px 30px;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:13px;letter-spacing:2px;text-transform:uppercase;font-weight:bold;border-radius:4px;display:inline-block">Confirm my email</a>
  </p>
  <p style="font-size:13px;color:#6f6a63;line-height:1.6">
    If the button does not work, copy this link into your browser:<br>
    <span style="word-break:break-all;color:#a8842f">{{ .ConfirmationURL }}</span>
  </p>
  <p style="font-size:13px;color:#6f6a63">If you did not create this account, you can safely ignore this email.</p>
  <div style="border-top:1px solid #e8e3d9;margin-top:28px;padding-top:18px;font-size:12px;color:#9b968e;text-align:center;line-height:1.7">
    <b style="color:#6f6a63">G.Gorgeous — Gents Wear</b><br>
    Shop #G77, Malikabad Shopping Mall, Rawalpindi<br>
    0342 5714108
  </div>
</div>
```

---

### 2. Reset password

**Subject heading**

```
Reset your G.Gorgeous password
```

**Message body**

```html
<div style="font-family:Georgia,'Times New Roman',serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#0d0d0d;background:#ffffff">
  <div style="text-align:center;border-bottom:1px solid #e8e3d9;padding-bottom:20px;margin-bottom:28px">
    <div style="font-size:26px;letter-spacing:2px;color:#0d0d0d">G.GORGEOUS</div>
    <div style="font-size:11px;letter-spacing:5px;color:#a8842f;text-transform:uppercase;margin-top:4px">Gents Wear</div>
  </div>
  <p style="font-size:16px">Assalam o Alaikum,</p>
  <p style="font-size:15px;line-height:1.7;color:#2b2b2b">We received a request to reset the password on your G.Gorgeous account. This link can only be used once and expires in an hour.</p>
  <p style="text-align:center;margin:32px 0">
    <a href="{{ .ConfirmationURL }}"
       style="background:#c8a24a;color:#1a1408;padding:14px 30px;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:13px;letter-spacing:2px;text-transform:uppercase;font-weight:bold;border-radius:4px;display:inline-block">Choose a new password</a>
  </p>
  <p style="font-size:13px;color:#6f6a63;line-height:1.6">
    If the button does not work, copy this link into your browser:<br>
    <span style="word-break:break-all;color:#a8842f">{{ .ConfirmationURL }}</span>
  </p>
  <p style="font-size:13px;color:#6f6a63">If you did not ask for this, ignore this email — your password will not change.</p>
  <div style="border-top:1px solid #e8e3d9;margin-top:28px;padding-top:18px;font-size:12px;color:#9b968e;text-align:center;line-height:1.7">
    <b style="color:#6f6a63">G.Gorgeous — Gents Wear</b><br>
    Shop #G77, Malikabad Shopping Mall, Rawalpindi<br>
    0342 5714108
  </div>
</div>
```

---

### 3. Change email address

**Subject heading**

```
Confirm your new email address
```

**Message body**

```html
<div style="font-family:Georgia,'Times New Roman',serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#0d0d0d;background:#ffffff">
  <div style="text-align:center;border-bottom:1px solid #e8e3d9;padding-bottom:20px;margin-bottom:28px">
    <div style="font-size:26px;letter-spacing:2px;color:#0d0d0d">G.GORGEOUS</div>
    <div style="font-size:11px;letter-spacing:5px;color:#a8842f;text-transform:uppercase;margin-top:4px">Gents Wear</div>
  </div>
  <p style="font-size:16px">Assalam o Alaikum,</p>
  <p style="font-size:15px;line-height:1.7;color:#2b2b2b">Please confirm this new email address for your G.Gorgeous account. Until you do, your old address stays in use.</p>
  <p style="text-align:center;margin:32px 0">
    <a href="{{ .ConfirmationURL }}"
       style="background:#c8a24a;color:#1a1408;padding:14px 30px;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:13px;letter-spacing:2px;text-transform:uppercase;font-weight:bold;border-radius:4px;display:inline-block">Confirm this address</a>
  </p>
  <p style="font-size:13px;color:#6f6a63;line-height:1.6">
    If the button does not work, copy this link into your browser:<br>
    <span style="word-break:break-all;color:#a8842f">{{ .ConfirmationURL }}</span>
  </p>
  <p style="font-size:13px;color:#6f6a63">If you did not request this change, ignore this email and contact us on 0342 5714108.</p>
  <div style="border-top:1px solid #e8e3d9;margin-top:28px;padding-top:18px;font-size:12px;color:#9b968e;text-align:center;line-height:1.7">
    <b style="color:#6f6a63">G.Gorgeous — Gents Wear</b><br>
    Shop #G77, Malikabad Shopping Mall, Rawalpindi<br>
    0342 5714108
  </div>
</div>
```

---
