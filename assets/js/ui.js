/* ==========================================================================
   G.GORGEOUS — shared UI: chrome, cards, toasts, cart drawer, quick view
   ========================================================================== */

const ICON = {
  search: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
  heart: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M12 20.5s-7.5-4.7-7.5-9.8A4.2 4.2 0 0 1 12 7.4a4.2 4.2 0 0 1 7.5 3.3c0 5.1-7.5 9.8-7.5 9.8Z"/></svg>',
  bag: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>',
  user: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c0-3.6 3.1-5.5 7-5.5s7 1.9 7 5.5"/></svg>',
  menu: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  x: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.05 1.1-6.5-4.7-4.6 6.5-.95L12 2.5Z"/></svg>',
  starO: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3.2l2.7 5.5 6.1.9-4.4 4.3 1.05 6.05L12 17.1l-5.45 2.85L7.6 13.9 3.2 9.6l6.1-.9L12 3.2Z"/></svg>',
  chevL: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  chevR: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
  play: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5-11-6.5Z"/></svg>',
  truck: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M2 6h11v10H2zM13 9h4.5l3 3.2V16H13z"/><circle cx="6.5" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/></svg>',
  scissors: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="6" cy="6" r="2.6"/><circle cx="6" cy="18" r="2.6"/><path d="M8.2 7.6 20 18M8.2 16.4 20 6"/></svg>',
  shield: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3l7 3v6c0 4.2-3 7.6-7 9-4-1.4-7-4.8-7-9V6l7-3Z"/><path d="M9 12l2.2 2.2L15.5 10"/></svg>',
  phone: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M6 3h3l1.6 4-2 1.4a12 12 0 0 0 5 5L15 11.4 19 13v3a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4 5.2 2 2 0 0 1 6 3Z"/></svg>',
  pin: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/></svg>',
  insta: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none"/></svg>',
  tiktok: '<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3h-2.7v11.4a2.6 2.6 0 1 1-2.2-2.57V9.05a5.4 5.4 0 1 0 4.9 5.37V8.6a6.3 6.3 0 0 0 3.6 1.13V7.03A3.7 3.7 0 0 1 16.5 3Z"/></svg>',
  whatsapp: '<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.35A10 10 0 1 0 12 2Zm5.2 14.1c-.22.62-1.3 1.2-1.8 1.24-.46.05-1.04.07-1.68-.1a13.7 13.7 0 0 1-6.2-5.35c-.46-.75-.76-1.63-.76-2.5 0-.87.46-1.3.62-1.48.16-.18.36-.22.48-.22h.35c.11 0 .27-.04.42.32l.58 1.4c.05.1.08.22.01.35l-.28.42-.4.44c-.13.13-.26.27-.11.53.15.25.66 1.08 1.41 1.75.97.86 1.79 1.13 2.04 1.26.25.13.4.11.55-.07l.79-.92c.18-.22.33-.16.55-.09l1.56.74c.22.11.37.16.42.25.05.09.05.53-.17 1.15Z"/></svg>',
  trash: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"/></svg>',
  edit: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M4 20h4L20 8l-4-4L4 16v4Z"/></svg>',
  plus: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  upload: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V5m0 0L8 9m4-4 4 4"/><path d="M4 16v2.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V16"/></svg>',
  check: '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  filter: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M3 6h18M6 12h12M10 18h4"/></svg>',
  box: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M3.5 7.5 12 3.5l8.5 4v9L12 20.5l-8.5-4v-9Z"/><path d="M3.5 7.5 12 11.5l8.5-4M12 11.5v9"/></svg>',
  grid: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3.5" y="3.5" width="7" height="7"/><rect x="13.5" y="3.5" width="7" height="7"/><rect x="3.5" y="13.5" width="7" height="7"/><rect x="13.5" y="13.5" width="7" height="7"/></svg>',
  chat: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M4 5h16v10H9l-5 4V5Z"/></svg>',
  logout: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 8V5H5v14h9v-3"/><path d="M11 12h9m0 0-3-3m3 3-3 3"/></svg>'
};

const LOGO = 'assets/img/logo.jpg';

/* ---------- helpers ---------- */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const params = () => new URLSearchParams(location.search);

function starsHTML(rating, size) {
  const r = Math.round(rating);
  let out = `<span class="stars" ${size ? `style="--s:${size}"` : ''}>`;
  for (let i = 1; i <= 5; i++) out += i <= r ? ICON.star : ICON.starO;
  return out + '</span>';
}

function toast(msg, type) {
  let wrap = $('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; document.body.appendChild(wrap); }
  const el = document.createElement('div');
  el.className = 'toast' + (type === 'err' ? ' err' : '');
  el.innerHTML = `<span>${esc(msg)}</span>`;
  wrap.appendChild(el);
  setTimeout(() => { el.classList.add('leaving'); setTimeout(() => el.remove(), 260); }, 2600);
}

function openModal(html, cls) {
  const back = document.createElement('div');
  back.className = 'modal-back';
  back.innerHTML = `<div class="modal ${cls || ''}">
      <button class="modal-close" aria-label="Close">${ICON.x}</button>${html}</div>`;
  document.body.appendChild(back);
  document.body.style.overflow = 'hidden';
  const close = () => { back.remove(); document.body.style.overflow = ''; };
  back.addEventListener('click', e => { if (e.target === back) close(); });
  $('.modal-close', back).addEventListener('click', close);
  document.addEventListener('keydown', function esc2(e) {
    if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc2); }
  });
  back.close = close;
  return back;
}

function confirmBox(title, message, onYes, yesLabel) {
  const m = openModal(`<div class="modal-pad center">
      <h3>${esc(title)}</h3>
      <p class="muted">${esc(message)}</p>
      <div class="flex gap-12 mt-24" style="justify-content:center">
        <button class="btn btn-ghost" data-no>Cancel</button>
        <button class="btn btn-danger" data-yes>${esc(yesLabel || 'Delete')}</button>
      </div></div>`, 'sm');
  $('[data-no]', m).onclick = () => m.close();
  $('[data-yes]', m).onclick = () => { m.close(); onYes(); };
}

/* ---------- chrome ---------- */

function renderHeader(active) {
  const el = $('#site-header');
  if (!el) return;
  el.innerHTML = `
  <div class="announce">Free delivery across Pakistan on orders over <b>${money(SITE.freeShipOver)}</b> &nbsp;·&nbsp; Free alterations at our Malikabad shop</div>
  <header class="site-header">
    <div class="wrap">
      <div class="header-bar">
        <form class="header-search" id="hdr-search" role="search">
          ${ICON.search}
          <input type="text" name="q" placeholder="Search suits, shirts, ties…" aria-label="Search products" autocomplete="off">
        </form>
        <a class="brand" href="index.html">
          <img src="${LOGO}" alt="G.Gorgeous logo">
          <div>
            <div class="brand-name">G.Gorgeous</div>
            <div class="brand-sub">Gents Wear</div>
          </div>
        </a>
        <div class="header-actions">
          <button class="icon-btn menu-toggle" id="menu-toggle" aria-label="Menu">${ICON.menu}</button>
          <a class="icon-btn" href="favourites.html" aria-label="Favourites">${ICON.heart}<span class="count" id="fav-count"></span></a>
          <button class="icon-btn" id="cart-btn" aria-label="Cart">${ICON.bag}<span class="count" id="cart-count"></span></button>
          <a class="icon-btn" href="admin.html" aria-label="Admin panel" title="Admin panel">${ICON.user}</a>
        </div>
      </div>
      <nav class="nav" id="main-nav">
        <a href="index.html" class="${active === 'home' ? 'active' : ''}">Home</a>
        ${CATEGORIES.map(c => `<a href="index.html?cat=${c.slug}" class="${active === c.slug ? 'active' : ''}">${c.name}</a>`).join('')}
        <a href="favourites.html" class="${active === 'fav' ? 'active' : ''}">Favourites</a>
      </nav>
    </div>
  </header>`;

  $('#hdr-search').addEventListener('submit', e => {
    e.preventDefault();
    const q = e.target.q.value.trim();
    location.href = 'index.html?q=' + encodeURIComponent(q) + '#shop';
  });
  $('#menu-toggle').addEventListener('click', () => $('#main-nav').classList.toggle('open'));
  $('#cart-btn').addEventListener('click', openCartDrawer);
  refreshCounts();
}

function renderFooter() {
  const el = $('#site-footer');
  if (!el) return;
  el.innerHTML = `
  <footer class="site-footer">
    <div class="wrap footer-top">
      <div class="footer-brand">
        <img src="${LOGO}" alt="G.Gorgeous">
        <p>${esc(SITE.blurb)}</p>
        <div class="socials">
          <a href="${SITE.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${ICON.insta}</a>
          <a href="${SITE.tiktok}" target="_blank" rel="noopener" aria-label="TikTok">${ICON.tiktok}</a>
          <a href="https://wa.me/${SITE.phoneRaw.replace('+', '')}" target="_blank" rel="noopener" aria-label="WhatsApp">${ICON.whatsapp}</a>
        </div>
      </div>
      <div>
        <h4>Shop</h4>
        <div class="footer-links">
          ${CATEGORIES.map(c => `<a href="index.html?cat=${c.slug}">${c.name}</a>`).join('')}
        </div>
      </div>
      <div>
        <h4>Customer Care</h4>
        <div class="footer-links">
          <a href="#" data-info="sizing">Size Guide</a>
          <a href="#" data-info="shipping">Shipping &amp; Delivery</a>
          <a href="#" data-info="returns">Returns &amp; Exchange</a>
          <a href="#" data-info="alterations">Alterations</a>
          <a href="favourites.html">My Favourites</a>
          <a href="admin.html">Admin Panel</a>
        </div>
      </div>
      <div>
        <h4>Visit The Shop</h4>
        <div class="contact-line">${ICON.pin}<span>${esc(SITE.address)}</span></div>
        <div class="contact-line">${ICON.phone}<a href="tel:${SITE.phoneRaw}">${esc(SITE.phone)}</a></div>
        <div class="contact-line">${ICON.insta}<a href="${SITE.instagram}" target="_blank" rel="noopener">${SITE.instagramHandle}</a></div>
        <div class="contact-line">${ICON.tiktok}<a href="${SITE.tiktok}" target="_blank" rel="noopener">${SITE.tiktokHandle}</a></div>
      </div>
    </div>
    <div class="wrap footer-bottom">
      <span>© ${new Date().getFullYear()} G.Gorgeous — Gents Wear, Rawalpindi. All rights reserved.</span>
      <span>Demo store · built for client preview</span>
    </div>
  </footer>`;

  $$('[data-info]', el).forEach(a => a.addEventListener('click', e => { e.preventDefault(); infoModal(a.dataset.info); }));
}

const INFO = {
  sizing: ['Size Guide', `<table class="spec-table">
      <tr><td>Coat 36</td><td>Chest 36" · Waist 30"</td></tr>
      <tr><td>Coat 38</td><td>Chest 38" · Waist 32"</td></tr>
      <tr><td>Coat 40</td><td>Chest 40" · Waist 34"</td></tr>
      <tr><td>Coat 42</td><td>Chest 42" · Waist 36"</td></tr>
      <tr><td>Coat 44</td><td>Chest 44" · Waist 38"</td></tr>
      <tr><td>Coat 46</td><td>Chest 46" · Waist 40"</td></tr>
      <tr><td>Shirt S–XXL</td><td>Collar 15" · 15.5" · 16" · 17" · 18"</td></tr>
      <tr><td>Trouser</td><td>Waist size in inches, unhemmed length 42"</td></tr>
    </table><p class="hint mt-16">Between two sizes? Take the larger — we alter down free of charge at the shop.</p>`],
  shipping: ['Shipping &amp; Delivery', `<p>We ship nationwide through TCS and Leopards Courier.</p>
      <ul><li>Rawalpindi / Islamabad — 1 to 2 working days</li><li>Rest of Pakistan — 3 to 5 working days</li>
      <li>Flat delivery charge ${money(SITE.shipFlat)}, free over ${money(SITE.freeShipOver)}</li>
      <li>Cash on delivery available everywhere we ship</li></ul>`],
  returns: ['Returns &amp; Exchange', `<p>Unworn items with tags attached can be exchanged within 7 days of delivery.</p>
      <ul><li>Size exchanges are free — we cover the return courier</li>
      <li>Refunds are issued to the original payment method within 5 working days</li>
      <li>Altered and made-to-measure pieces cannot be returned</li></ul>`],
  alterations: ['Alterations', `<p>Every suit bought from G.Gorgeous includes free minor alterations at our Malikabad shop within 14 days of purchase — sleeve length, trouser hem, waist take-in and shoulder adjustment.</p>
      <p>Ordering online from another city? Send us your measurements on WhatsApp at ${esc(SITE.phone)} before we dispatch and we will pre-alter the piece for you.</p>`]
};

function infoModal(key) {
  const [title, body] = INFO[key] || ['Information', ''];
  openModal(`<div class="modal-pad"><h2>${title}</h2><div class="rule-ornament"><span>◆</span></div><div class="prose">${body}</div></div>`, 'sm');
}

function refreshCounts() {
  const c = $('#cart-count'), f = $('#fav-count');
  if (c) { const n = cartCount(); c.textContent = n; c.dataset.zero = n ? '0' : '1'; }
  if (f) { const n = getFavs().length; f.textContent = n; f.dataset.zero = n ? '0' : '1'; }
}
document.addEventListener('gg:cart', refreshCounts);
document.addEventListener('gg:favs', refreshCounts);

/* ---------- product card ---------- */

function productCard(p) {
  const stock = totalStock(p);
  const off = discountPct(p);
  const st = ratingStats(p.id);
  return `
  <article class="card" data-id="${p.id}">
    <a class="card-media" href="product.html?id=${p.id}">
      <img src="${productCover(p)}" alt="${esc(p.name)}" loading="lazy">
      <span class="card-flags">
        ${off ? `<span class="badge badge-sale">-${off}%</span>` : ''}
        ${isNewArrival(p) ? '<span class="badge badge-new">New</span>' : ''}
        ${stock === 0 ? '<span class="badge badge-out">Sold out</span>' : ''}
      </span>
    </a>
    <button class="card-fav ${isFav(p.id) ? 'on' : ''}" data-fav="${p.id}" aria-label="Save to favourites">${ICON.heart}</button>
    <div class="card-quick">
      <button class="btn btn-sm btn-block" data-quick="${p.id}">Quick view</button>
    </div>
    <div class="card-body">
      <div class="card-cat">${esc(categoryName(p.category))}</div>
      <h3 class="card-title"><a href="product.html?id=${p.id}">${esc(p.name)}</a></h3>
      <div class="card-meta">
        <div class="price">${money(effectivePrice(p))}${off ? `<span class="was">${money(p.price)}</span>` : ''}</div>
        <div class="card-colors">${(p.colors || []).slice(0, 4).map(c => `<i style="background:${c.hex}" title="${esc(c.name)}"></i>`).join('')}</div>
      </div>
      ${st.count ? `<div class="rating-row">${starsHTML(st.avg)}<span>${st.avg.toFixed(1)} (${st.count})</span></div>`
                 : '<div class="rating-row"><span>No reviews yet</span></div>'}
    </div>
  </article>`;
}

/* delegated card interactions — works on every page */
document.addEventListener('click', e => {
  const fav = e.target.closest('[data-fav]');
  if (fav) {
    e.preventDefault();
    const on = toggleFav(fav.dataset.fav);
    fav.classList.toggle('on', on);
    toast(on ? 'Added to favourites' : 'Removed from favourites');
    return;
  }
  const q = e.target.closest('[data-quick]');
  if (q) { e.preventDefault(); quickView(q.dataset.quick); }
});

/* ---------- quick view ---------- */

function quickView(id) {
  const p = productById(id);
  if (!p) return;
  const imgs = productImages(p);
  const sizes = p.sizes || [];
  const firstAvail = (sizes.find(s => s.qty > 0) || sizes[0] || {}).size || '';
  const st = ratingStats(p.id);

  const m = openModal(`<div class="modal-pad">
    <div class="pdp" style="gap:34px">
      <div>
        <div class="gallery-main"><img id="qv-img" src="${imgs[0]}" alt="${esc(p.name)}"></div>
        <div class="thumbs">${imgs.map((src, i) =>
          `<div class="thumb ${i === 0 ? 'on' : ''}" data-qvi="${i}"><img src="${src}" alt=""></div>`).join('')}</div>
      </div>
      <div class="pdp-info">
        <p class="eyebrow">${esc(categoryName(p.category))}</p>
        <h2>${esc(p.name)}</h2>
        ${st.count ? `<div class="rating-row">${starsHTML(st.avg)}<span>${st.avg.toFixed(1)} · ${st.count} reviews</span></div>` : ''}
        <div class="pdp-price">
          <span class="now">${money(effectivePrice(p))}</span>
          ${discountPct(p) ? `<span class="was">${money(p.price)}</span><span class="badge badge-sale off">-${discountPct(p)}%</span>` : ''}
        </div>
        <p class="pdp-desc">${esc(p.description)}</p>
        <div class="opt-block">
          <div class="opt-head"><span class="lbl">Colour</span><span class="sel" id="qv-cname">${esc((p.colors[0] || {}).name || '')}</span></div>
          <div class="color-dots" id="qv-colors">
            ${(p.colors || []).map((c, i) => `<span class="color-dot ${i === 0 ? 'on' : ''}" data-c="${esc(c.name)}" style="background:${c.hex}" title="${esc(c.name)}"></span>`).join('')}
          </div>
        </div>
        <div class="opt-block">
          <div class="opt-head"><span class="lbl">Size</span></div>
          <div class="size-pills" id="qv-sizes">
            ${sizes.map(s => `<div class="size-pill ${s.size === firstAvail ? 'on' : ''} ${s.qty <= 0 ? 'disabled' : ''}" data-s="${esc(s.size)}">${esc(s.size)}</div>`).join('')}
          </div>
        </div>
        <div class="buy-row">
          <button class="btn btn-gold" id="qv-add" ${totalStock(p) === 0 ? 'disabled' : ''}>${totalStock(p) === 0 ? 'Sold out' : 'Add to cart'}</button>
          <a class="btn btn-ghost" href="product.html?id=${p.id}">Full details</a>
        </div>
      </div>
    </div></div>`);

  let color = (p.colors[0] || {}).name || '', size = firstAvail;
  $$('[data-qvi]', m).forEach(t => t.onclick = () => {
    $$('[data-qvi]', m).forEach(x => x.classList.remove('on')); t.classList.add('on');
    $('#qv-img', m).src = imgs[+t.dataset.qvi];
  });
  $$('#qv-colors .color-dot', m).forEach(d => d.onclick = () => {
    $$('#qv-colors .color-dot', m).forEach(x => x.classList.remove('on')); d.classList.add('on');
    color = d.dataset.c; $('#qv-cname', m).textContent = color;
  });
  $$('#qv-sizes .size-pill', m).forEach(s => s.onclick = () => {
    if (s.classList.contains('disabled')) return;
    $$('#qv-sizes .size-pill', m).forEach(x => x.classList.remove('on')); s.classList.add('on');
    size = s.dataset.s;
  });
  const addBtn = $('#qv-add', m);
  if (addBtn) addBtn.onclick = () => {
    if (!size) return toast('Please choose a size', 'err');
    addToCart(p.id, size, color, 1);
    m.close();
    toast(`${p.name} added to cart`);
    openCartDrawer();
  };
}

/* ---------- cart drawer ---------- */

function openCartDrawer() {
  $('.drawer-back') && $('.drawer-back').remove();
  $('.drawer') && $('.drawer').remove();

  const t = cartTotals();
  const back = document.createElement('div');
  back.className = 'drawer-back';
  const dr = document.createElement('aside');
  dr.className = 'drawer';
  dr.innerHTML = `
    <div class="drawer-head">
      <h3>Your Cart <span class="muted" style="font-size:.8rem">(${cartCount()})</span></h3>
      <button class="icon-btn" id="dr-close" aria-label="Close">${ICON.x}</button>
    </div>
    <div class="drawer-body">
      ${t.lines.length ? t.lines.map(l => `
        <div class="cart-row">
          <a class="cart-img" href="product.html?id=${l.productId}"><img src="${productCover(l.product)}" alt=""></a>
          <div>
            <h4>${esc(l.product.name)}</h4>
            <div class="cart-opts"><span>${esc(l.color || '—')}</span><span>Size ${esc(l.size)}</span><span>Qty ${l.qty}</span></div>
            <div class="line-total">${money(l.lineTotal)}</div>
            <div class="cart-actions" style="margin-top:8px">
              <button class="link-btn" data-drrm="${l.index}">Remove</button>
            </div>
          </div>
        </div>`).join('')
      : `<div class="empty-state"><h3>Your cart is empty</h3><p>Browse the collection and add something sharp.</p>
         <a class="btn btn-sm" href="index.html#shop">Start shopping</a></div>`}
    </div>
    ${t.lines.length ? `<div class="drawer-foot">
      <div class="sum-row"><span>Subtotal</span><b>${money(t.subtotal)}</b></div>
      <div class="sum-row"><span class="muted">Delivery</span><span class="muted">${t.shipping ? money(t.shipping) : 'Free'}</span></div>
      <a class="btn btn-gold btn-block mt-16" href="checkout.html">Checkout — ${money(t.total)}</a>
      <a class="btn btn-ghost btn-block mt-16" href="cart.html">View full cart</a>
    </div>` : ''}`;

  document.body.append(back, dr);
  document.body.style.overflow = 'hidden';
  const close = () => { back.remove(); dr.remove(); document.body.style.overflow = ''; };
  back.onclick = close;
  $('#dr-close', dr).onclick = close;
  $$('[data-drrm]', dr).forEach(b => b.onclick = () => {
    removeCartLine(+b.dataset.drrm);
    close(); openCartDrawer();
  });
}

/* ---------- boot ---------- */

function mountChrome(active) {
  renderHeader(active);
  renderFooter();
}
