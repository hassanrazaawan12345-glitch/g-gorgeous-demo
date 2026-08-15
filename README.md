# G.Gorgeous — Demo Store

A complete, client-presentable e-commerce demo for **G.Gorgeous — Gents Wear**, Shop #G77 Malikabad Shopping Mall, Rawalpindi.

Not hosted, no domain, no backend — it runs from this folder and stores everything in the browser.

---

## How to run it

**Easiest:** double-click **`START WEBSITE.bat`**. It opens <http://localhost:5173/> in your browser.

**Or from a terminal:**

```bash
node serve.js
```

Then open <http://localhost:5173/>. Press `Ctrl+C` in the terminal to stop.

> Run it through the server rather than double-clicking `index.html` — browsers block local storage on `file://`, so the cart and admin panel need `http://localhost`.

---

## Pages

| Page | What it does |
|---|---|
| `index.html` | Home — hero, categories, featured rail, and the full filterable shop |
| `product.html?id=…` | Product detail — gallery, video, colours, sizes, stock, tabs, reviews |
| `cart.html` | Full cart with quantities, promo codes and totals |
| `checkout.html` | Contact + address + payment, validation, order confirmation |
| `favourites.html` | Everything the customer has hearted |
| `admin.html` | Owner's panel — **PIN: `gorgeous2255`** |

---

## What a customer can do

- **Search** from the header or the shop sidebar
- **Filter** by category, size, colour, price range, in-stock and on-sale
- **Sort** by featured, newest, price, rating or name
- **Quick view** any product without leaving the page
- **Favourite** products (heart icon) and see them on the favourites page
- **View** multiple photos plus a video, zoom the main image
- **Pick** colour, size and quantity — quantity is capped by real stock
- **Add to cart** / **Buy it now**, with a slide-out cart drawer
- **Apply promo codes** — `GG10` (10%), `GORGEOUS` (15%), `SHADI25` (25%)
- **Checkout** with card, Easypaisa/JazzCash, bank transfer or cash on delivery
- **Write a review** with a star rating — it appears instantly on the product
- Message the shop on **WhatsApp** about any piece

Card payment is validated properly (Luhn check, expiry, CVV) but **nothing is charged and no data leaves the browser** — it is a demo.

---

## What the owner can do (Admin panel)

Open `admin.html`, PIN **`gorgeous2255`**.

- **Dashboard** — product count, orders, revenue, stock alerts, catalogue breakdown
- **Products** — search, edit, delete, add new
- **Add / edit product** — name, SKU, category, short description, long details,
  price + sale price, featured toggle, **colours**, **sizes with quantity per size**,
  fabric / fit / lining / care / origin, **multiple photos** (upload or URL),
  **video** (upload or URL), and a **live preview** of the store card
- **Orders** — see every order, change status (Pending → Confirmed → Shipped → Delivered → Cancelled), open full details, message the customer on WhatsApp
- **Reviews** — read and delete customer reviews
- **Settings** — export / import all data as JSON, reset the demo back to its original state

Photos are automatically resized and compressed on upload so they fit in browser storage.

---

## The demo catalogue

**20 products** across the five categories, each with real photography, colours, per-size stock, full copy and specs:

| Category | Products |
|---|---|
| Three Piece Suits | Regal Charcoal · Windowpane Navy · Silver Grey Ceremonial |
| Two Piece Suits | Royal Blue · Jet Black Tuxedo · Midnight Navy · Ivory Double-Breasted · Deep Olive |
| Dress Pants | Charcoal Formal · Ivory Summer · Sand Chino-Formal |
| Dress Shirts | Optic White · Cream Oxford · Sage Cotton · Tan Poplin |
| Ties | Violet Stripe · Sky Stripe · Champagne Satin · Classic Black · Maroon Bow |

The catalogue lives in **`assets/js/catalog.js`** — one object per product, easy to edit by hand if you'd rather not use the admin panel.

### Photos

Product photography is in `assets/img/products/`, sourced through [Openverse](https://openverse.org) filtered to commercial-use licences (CC0 from StockSnap and Rawpixel, CC-BY from Flickr), cropped to a consistent 4:5 and compressed. Full attribution is in **`PHOTO-CREDITS.md`**. Nothing is taken from another retailer's site.

They are **placeholders**. Upload the shop's own photos in Admin → Products → Photos and they replace these everywhere — cards, gallery, cart, admin.

If a product ends up with no photos at all, the store falls back to **generated vector artwork** drawn from that product's colours, so the grid never shows a broken image.

---

## Where the data lives

Everything is in the browser's `localStorage` for this site:

| Key | Contents |
|---|---|
| `gg.products` | The catalogue |
| `gg.reviews` | Customer reviews |
| `gg.orders` | Placed orders |
| `gg.cart` / `gg.favs` | The current visitor's cart and favourites |

Clearing browser data or using a different browser resets it. **Admin → Settings → Export** saves a JSON backup you can import later.

---

## Changing the brand details

Shop phone, address, Instagram, TikTok, delivery charges, free-delivery threshold and the admin PIN are all at the top of **`assets/js/data.js`** in the `SITE` object. Categories and the standard size sets are right below it.

The products themselves are in **`assets/js/catalog.js`**. Note that the store seeds from this file only once — after that it works off the copy in browser storage, so if you edit the catalogue by hand, bump `DB.VERSION` in `assets/js/store.js` (or use Admin → Settings → Reset demo data) to pick the changes up.

Colours and typography are CSS variables at the top of **`assets/css/style.css`**.

---

## When you go live

This demo is deliberately front-end only. For a real store you would add:

- A backend + database (products, orders, stock, users)
- A real payment gateway (Stripe, or Easypaisa/JazzCash merchant APIs for Pakistan)
- Admin authentication that isn't a client-side PIN
- Order emails / SMS, and a courier integration for tracking
