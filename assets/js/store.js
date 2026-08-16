/* ==========================================================================
   G.GORGEOUS — client-side store (localStorage). Demo persistence layer.
   Everything the admin panel changes lives here and survives a refresh.
   ========================================================================== */

const DB = {
  V: 'gg.version',
  VERSION: '1.2.0',
  PRODUCTS: 'gg.products',
  REVIEWS: 'gg.reviews',
  ORDERS: 'gg.orders',
  CART: 'gg.cart',
  FAVS: 'gg.favs',
  ADMIN: 'gg.admin'
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch (e) { return fallback; }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    if (typeof toast === 'function') {
      toast('Storage full — try smaller images or fewer uploads.', 'err');
    }
    console.error('Storage write failed', e);
    return false;
  }
}

/* ---------- seeding ---------- */

function seedIfNeeded(force) {
  if (force || localStorage.getItem(DB.V) !== DB.VERSION || !localStorage.getItem(DB.PRODUCTS)) {
    const products = SEED_PRODUCTS.map(p => ({
      ...p,
      images: p.images ? p.images.slice() : [],
      video: p.video || '',
      createdAt: p.createdAt || '2026-07-01T10:00:00.000Z'
    }));
    write(DB.PRODUCTS, products);
    write(DB.REVIEWS, SEED_REVIEWS.map(r => ({ ...r })));
    if (force) { write(DB.ORDERS, []); write(DB.CART, []); write(DB.FAVS, []); }
    else {
      if (!localStorage.getItem(DB.ORDERS)) write(DB.ORDERS, []);
      if (!localStorage.getItem(DB.CART)) write(DB.CART, []);
      if (!localStorage.getItem(DB.FAVS)) write(DB.FAVS, []);
    }
    localStorage.setItem(DB.V, DB.VERSION);
  }
}
seedIfNeeded(false);

function resetDemoData() {
  seedIfNeeded(true);
}

/* ---------- products ---------- */

/* The bundled copy in browser storage — the offline fallback. */
const localProducts = () => read(DB.PRODUCTS, []);

/* Live database first, bundled copy second. Every screen calls this, so
   pointing it at the cache in db.js switched the whole site over to
   Supabase without touching the pages themselves. */
const getProducts = () =>
  (typeof DBCache !== 'undefined' && DBCache.source === 'supabase' && DBCache.products)
    ? DBCache.products
    : localProducts();

const saveProducts  = (list) => write(DB.PRODUCTS, list);
const productById   = (id) => getProducts().find(p => p.id === id);

function upsertProduct(product) {
  const list = getProducts();
  const i = list.findIndex(p => p.id === product.id);
  if (i > -1) list[i] = product; else list.unshift(product);
  return saveProducts(list);
}

function deleteProduct(id) {
  saveProducts(getProducts().filter(p => p.id !== id));
  write(DB.REVIEWS, getReviews().filter(r => r.productId !== id));
  write(DB.CART, getCart().filter(l => l.productId !== id));
  write(DB.FAVS, getFavs().filter(f => f !== id));
}

function newProductId() {
  return 'p-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/* media: uploaded photos win, otherwise generated vector artwork */
function productImages(p) {
  if (p && p.images && p.images.length) return p.images;
  return generatedArt(p);
}
const productCover = (p) => productImages(p)[0];

const totalStock = (p) => (p.sizes || []).reduce((n, s) => n + (+s.qty || 0), 0);
const sizeStock  = (p, size) => { const s = (p.sizes || []).find(x => x.size === size); return s ? +s.qty || 0 : 0; };
const effectivePrice = (p) => (p.salePrice && p.salePrice < p.price) ? p.salePrice : p.price;
const discountPct = (p) => (p.salePrice && p.salePrice < p.price)
  ? Math.round((1 - p.salePrice / p.price) * 100) : 0;

function isNewArrival(p) {
  if (!p.createdAt) return false;
  return (Date.now() - new Date(p.createdAt).getTime()) < 1000 * 60 * 60 * 24 * 21;
}

const categoryName = (slug) => (CATEGORIES.find(c => c.slug === slug) || {}).name || slug;

/* ---------- reviews ---------- */

const localReviews = () => read(DB.REVIEWS, []);

const getReviews = () =>
  (typeof DBCache !== 'undefined' && DBCache.source === 'supabase' && DBCache.reviews)
    ? DBCache.reviews
    : localReviews();

const reviewsFor  = (id) => getReviews().filter(r => r.productId === id)
  .sort((a, b) => new Date(b.date) - new Date(a.date));

function addReview(review) {
  const list = getReviews();
  list.push({ ...review, id: 'r-' + Date.now().toString(36) });
  return write(DB.REVIEWS, list);
}
function deleteReview(id) { write(DB.REVIEWS, getReviews().filter(r => r.id !== id)); }

function ratingStats(productId) {
  const rs = reviewsFor(productId);
  const counts = [0, 0, 0, 0, 0];
  rs.forEach(r => { counts[Math.min(4, Math.max(0, r.rating - 1))]++; });
  const avg = rs.length ? rs.reduce((n, r) => n + r.rating, 0) / rs.length : 0;
  return { count: rs.length, avg, counts };
}

/* ---------- favourites ---------- */

const getFavs   = () => read(DB.FAVS, []);
const isFav     = (id) => getFavs().includes(id);
function toggleFav(id) {
  const favs = getFavs();
  const i = favs.indexOf(id);
  if (i > -1) favs.splice(i, 1); else favs.push(id);
  write(DB.FAVS, favs);
  document.dispatchEvent(new CustomEvent('gg:favs'));
  return i === -1;
}

/* ---------- cart ---------- */

const getCart = () => read(DB.CART, []);
function saveCart(cart) {
  write(DB.CART, cart);
  document.dispatchEvent(new CustomEvent('gg:cart'));
}
const cartCount = () => getCart().reduce((n, l) => n + l.qty, 0);

function addToCart(productId, size, color, qty) {
  const cart = getCart();
  const line = cart.find(l => l.productId === productId && l.size === size && l.color === color);
  const p = productById(productId);
  const max = p ? sizeStock(p, size) : 99;
  if (line) line.qty = Math.min(max, line.qty + qty);
  else cart.push({ productId, size, color, qty: Math.min(max, qty) });
  saveCart(cart);
}

function setCartQty(index, qty) {
  const cart = getCart();
  if (!cart[index]) return;
  const p = productById(cart[index].productId);
  const max = p ? sizeStock(p, cart[index].size) : 99;
  cart[index].qty = Math.max(1, Math.min(max || 1, qty));
  saveCart(cart);
}

function removeCartLine(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
}
function clearCart() { saveCart([]); }

function cartLines() {
  return getCart().map((l, i) => {
    const p = productById(l.productId);
    if (!p) return null;
    return { ...l, index: i, product: p, unit: effectivePrice(p), lineTotal: effectivePrice(p) * l.qty };
  }).filter(Boolean);
}

function getPromo() { return read('gg.promo', null); }
function setPromo(code) { write('gg.promo', code); }

const PROMOS = {
  'GG10':     { off: 0.10, label: '10% off' },
  'GORGEOUS': { off: 0.15, label: '15% off — welcome offer' },
  'SHADI25':  { off: 0.25, label: '25% off wedding special' }
};

function cartTotals() {
  const lines = cartLines();
  const subtotal = lines.reduce((n, l) => n + l.lineTotal, 0);
  const promoCode = getPromo();
  const promo = promoCode && PROMOS[promoCode] ? PROMOS[promoCode] : null;
  const discount = promo ? Math.round(subtotal * promo.off) : 0;
  const afterDiscount = subtotal - discount;
  const shipping = subtotal === 0 ? 0 : (afterDiscount >= SITE.freeShipOver ? 0 : SITE.shipFlat);
  const tax = Math.round(afterDiscount * SITE.taxRate);
  return { lines, subtotal, discount, promo, promoCode, shipping, tax, total: afterDiscount + shipping + tax };
}

/* ---------- orders ---------- */

const getOrders = () => read(DB.ORDERS, []);

function placeOrder(customer, payment) {
  const t = cartTotals();
  if (!t.lines.length) return null;
  const signedIn = (typeof Auth !== 'undefined') ? Auth.currentUser() : null;
  const order = {
    id: 'GG' + Date.now().toString().slice(-8),
    date: new Date().toISOString(),
    status: 'Pending',
    userId: signedIn ? signedIn.id : null,
    customer, payment,
    items: t.lines.map(l => ({
      productId: l.productId, name: l.product.name, sku: l.product.sku,
      size: l.size, color: l.color, qty: l.qty, unit: l.unit, lineTotal: l.lineTotal
    })),
    totals: { subtotal: t.subtotal, discount: t.discount, promoCode: t.promoCode, shipping: t.shipping, tax: t.tax, total: t.total }
  };

  // decrement stock
  const products = getProducts();
  order.items.forEach(item => {
    const p = products.find(x => x.id === item.productId);
    if (!p) return;
    const s = (p.sizes || []).find(x => x.size === item.size);
    if (s) s.qty = Math.max(0, (+s.qty || 0) - item.qty);
  });
  saveProducts(products);

  const orders = getOrders();
  orders.unshift(order);
  write(DB.ORDERS, orders);
  clearCart();
  setPromo(null);
  sessionStorage.setItem('gg.lastOrder', JSON.stringify(order));
  return order;
}

function updateOrderStatus(id, status) {
  const orders = getOrders();
  const o = orders.find(x => x.id === id);
  if (o) { o.status = status; write(DB.ORDERS, orders); }
}
function deleteOrder(id) { write(DB.ORDERS, getOrders().filter(o => o.id !== id)); }

/* ==========================================================================
   Product video — links, not uploads.

   A 30-second clip is 5–20 MB. Hosting a few dozen would fill the free
   storage tier on its own and eat the monthly bandwidth allowance, so the
   shop pastes a link to a video it has already posted. Costs nothing,
   streams better on phones, and the platform handles playback quality.
   ========================================================================== */

/* How long uploaded images should be cached by browsers and CDNs.
   One year, because filenames change when an image changes. Used by the
   Cloudflare _headers file and by Supabase Storage uploads. */
const MEDIA_CACHE_SECONDS = 31536000;

function parseVideo(url) {
  const u = String(url || '').trim();
  if (!u) return null;
  let m;

  m = u.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (m) return {
    kind: 'youtube', label: 'YouTube', id: m[1], ratio: '16 / 9',
    embed: `https://www.youtube-nocookie.com/embed/${m[1]}?rel=0&modestbranding=1`,
    thumb: `https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg`
  };

  m = u.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
  if (m) return {
    kind: 'tiktok', label: 'TikTok', id: m[1], ratio: '9 / 16',
    embed: `https://www.tiktok.com/embed/v2/${m[1]}`, thumb: null
  };

  // Short share links redirect server-side, so the id cannot be read here
  if (/(?:vm|vt)\.tiktok\.com\//i.test(u)) return {
    kind: 'error',
    error: 'Open that short TikTok link in a browser, then copy the full link from the address bar — it looks like tiktok.com/@g.gorgeous_1.0/video/123456…'
  };

  m = u.match(/instagram\.com\/(?:reel|reels|p)\/([A-Za-z0-9_-]+)/);
  if (m) return {
    kind: 'instagram', label: 'Instagram', id: m[1], ratio: '9 / 16',
    embed: `https://www.instagram.com/reel/${m[1]}/embed`, thumb: null
  };

  if (/^https?:\/\/\S+\.(mp4|webm|mov|m4v)(\?\S*)?$/i.test(u) || u.startsWith('data:video')) {
    return { kind: 'file', label: 'Video file', src: u, ratio: '4 / 5' };
  }

  return { kind: 'error', error: 'That does not look like a YouTube, TikTok or Instagram video link.' };
}

function videoEmbedHTML(url) {
  const v = parseVideo(url);
  if (!v || v.kind === 'error') return '';
  if (v.kind === 'file') {
    return `<video src="${esc(v.src)}" controls playsinline preload="metadata"></video>`;
  }
  return `<iframe class="video-embed" src="${esc(v.embed)}" title="Product video" loading="lazy"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
}

/* ---------- formatting ---------- */

function money(n) {
  return SITE.currency + ' ' + Math.round(n).toLocaleString('en-PK');
}
function shortDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
