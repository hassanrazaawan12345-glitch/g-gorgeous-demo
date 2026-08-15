/* ==========================================================================
   G.GORGEOUS — product detail: gallery, video, options, tabs, reviews
   ========================================================================== */

let P = null;
let media = [];
let sel = { color: '', size: '', qty: 1, index: 0 };

document.addEventListener('DOMContentLoaded', () => {
  const id = params().get('id');
  P = productById(id);

  if (!P) {
    mountChrome('home');
    $('#pdp').innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <h3>Product not found</h3><p>It may have been removed from the store.</p>
      <a class="btn btn-sm" href="index.html#shop">Back to shop</a></div>`;
    $('#tabs-section').style.display = 'none';
    $('#related-section').style.display = 'none';
    renderFooter();
    return;
  }

  document.title = `${P.name} — G.Gorgeous`;
  mountChrome(P.category);

  media = productImages(P).map(src => ({ type: 'image', src }));
  if (P.video) media.push({ type: 'video', src: P.video });

  sel.color = (P.colors && P.colors[0] || {}).name || '';
  const firstAvail = (P.sizes || []).find(s => s.qty > 0);
  sel.size = firstAvail ? firstAvail.size : ((P.sizes || [])[0] || {}).size || '';

  renderCrumbs();
  renderPDP();
  renderTabs();
  renderRelated();
});

function renderCrumbs() {
  $('#crumbs').innerHTML = `<a href="index.html">Home</a><span>/</span>
    <a href="index.html?cat=${P.category}">${esc(categoryName(P.category))}</a><span>/</span>
    <span class="muted">${esc(P.name)}</span>`;
}

/* ---------- main panel ---------- */

function renderPDP() {
  const st = ratingStats(P.id);
  const stock = totalStock(P);
  const off = discountPct(P);

  $('#pdp').innerHTML = `
    <div>
      <div class="gallery-main" id="gal-main"></div>
      ${media.length > 1 ? `<div class="thumbs" id="thumbs"></div>` : ''}
    </div>

    <div class="pdp-info">
      <p class="eyebrow">${esc(categoryName(P.category))} · ${esc(P.sku || '')}</p>
      <h1>${esc(P.name)}</h1>
      <div class="rating-row" style="margin-bottom:6px">
        ${starsHTML(st.avg)}
        <a href="#reviews" id="jump-reviews" style="text-decoration:underline">
          ${st.count ? `${st.avg.toFixed(1)} · ${st.count} review${st.count > 1 ? 's' : ''}` : 'Write the first review'}
        </a>
      </div>

      <div class="pdp-price">
        <span class="now">${money(effectivePrice(P))}</span>
        ${off ? `<span class="was">${money(P.price)}</span><span class="badge badge-sale">Save ${off}%</span>` : ''}
      </div>

      <p class="pdp-desc">${esc(P.description)}</p>

      <div class="stock-line" id="stock-line"></div>

      <div class="opt-block">
        <div class="opt-head"><span class="lbl">Colour</span><span class="sel" id="c-name">${esc(sel.color)}</span></div>
        <div class="color-dots" id="colors">
          ${(P.colors || []).map(c => `<span class="color-dot ${c.name === sel.color ? 'on' : ''}"
             data-c="${esc(c.name)}" style="background:${c.hex}" title="${esc(c.name)}"></span>`).join('')}
        </div>
      </div>

      <div class="opt-block">
        <div class="opt-head">
          <span class="lbl">Size</span>
          <span class="size-guide-link" id="size-guide">Size guide</span>
        </div>
        <div class="size-pills" id="sizes">
          ${(P.sizes || []).map(s => `<div class="size-pill ${s.size === sel.size ? 'on' : ''} ${s.qty <= 0 ? 'disabled' : ''}"
             data-s="${esc(s.size)}" title="${s.qty > 0 ? s.qty + ' in stock' : 'Out of stock'}">${esc(s.size)}</div>`).join('')}
        </div>
      </div>

      <div class="opt-block">
        <span class="lbl">Quantity</span>
        <div class="qty-picker">
          <button id="q-minus" aria-label="Decrease">−</button>
          <input type="number" id="q-input" value="1" min="1">
          <button id="q-plus" aria-label="Increase">+</button>
        </div>
      </div>

      <div class="buy-row">
        <button class="btn btn-gold" id="add-cart" ${stock === 0 ? 'disabled' : ''}>${stock === 0 ? 'Sold out' : 'Add to cart'}</button>
        <button class="btn" id="buy-now" ${stock === 0 ? 'disabled' : ''}>Buy it now</button>
        <button class="btn btn-heart ${isFav(P.id) ? 'on' : ''}" id="fav-btn" aria-label="Favourite">${ICON.heart}</button>
      </div>

      <a class="btn btn-ghost btn-block" href="https://wa.me/${SITE.phoneRaw.replace('+', '')}?text=${encodeURIComponent('Assalam o Alaikum, I am interested in ' + P.name + ' (' + P.sku + ')')}" target="_blank" rel="noopener">
        ${ICON.whatsapp} Ask about this piece on WhatsApp
      </a>

      <div class="assurances">
        <div class="assurance">${ICON.scissors}<div><b>Free alterations</b><span>Adjusted at our Malikabad shop within 14 days of purchase.</span></div></div>
        <div class="assurance">${ICON.truck}<div><b>Delivery in 1–5 days</b><span>Flat ${money(SITE.shipFlat)} · free over ${money(SITE.freeShipOver)} · cash on delivery available.</span></div></div>
        <div class="assurance">${ICON.shield}<div><b>7-day size exchange</b><span>Unworn with tags attached — we cover the return courier.</span></div></div>
      </div>
    </div>`;

  renderGallery();
  updateStockLine();
  bindPDP();
}

function renderGallery() {
  const m = media[sel.index] || media[0];
  const main = $('#gal-main');
  main.innerHTML = m.type === 'video'
    ? `<video src="${m.src}" controls playsinline preload="metadata"></video>`
    : `<img src="${m.src}" alt="${esc(P.name)}" id="main-img">
       ${media.length > 1 ? `<button class="gallery-nav prev" id="g-prev">${ICON.chevL}</button>
         <button class="gallery-nav next" id="g-next">${ICON.chevR}</button>` : ''}`;

  const th = $('#thumbs');
  if (th) {
    th.innerHTML = media.map((x, i) => x.type === 'video'
      ? `<div class="thumb video-thumb ${i === sel.index ? 'on' : ''}" data-i="${i}" title="Video">${ICON.play}</div>`
      : `<div class="thumb ${i === sel.index ? 'on' : ''}" data-i="${i}"><img src="${x.src}" alt=""></div>`).join('');
    $$('[data-i]', th).forEach(t => t.onclick = () => { sel.index = +t.dataset.i; renderGallery(); });
  }
  const prev = $('#g-prev'), next = $('#g-next');
  if (prev) prev.onclick = () => { sel.index = (sel.index - 1 + media.length) % media.length; renderGallery(); };
  if (next) next.onclick = () => { sel.index = (sel.index + 1) % media.length; renderGallery(); };
  const img = $('#main-img');
  if (img) img.onclick = () => openModal(`<img src="${m.src}" alt="${esc(P.name)}" style="width:100%;border-radius:8px">`);
}

function updateStockLine() {
  const n = sizeStock(P, sel.size);
  const total = totalStock(P);
  const el = $('#stock-line');
  if (!el) return;
  if (total === 0) el.innerHTML = `<span class="stock-dot out"></span><span>Currently sold out — <a href="tel:${SITE.phoneRaw}" style="text-decoration:underline">call the shop</a> to pre-order</span>`;
  else if (n === 0) el.innerHTML = `<span class="stock-dot out"></span><span>Size ${esc(sel.size)} is out of stock — choose another size</span>`;
  else if (n <= 3) el.innerHTML = `<span class="stock-dot low"></span><span>Only ${n} left in size ${esc(sel.size)}</span>`;
  else el.innerHTML = `<span class="stock-dot"></span><span>In stock — ${n} available in size ${esc(sel.size)}</span>`;

  const add = $('#add-cart'), buy = $('#buy-now');
  if (add) add.disabled = n === 0;
  if (buy) buy.disabled = n === 0;
}

function bindPDP() {
  $$('#colors .color-dot').forEach(d => d.onclick = () => {
    $$('#colors .color-dot').forEach(x => x.classList.remove('on'));
    d.classList.add('on'); sel.color = d.dataset.c; $('#c-name').textContent = sel.color;
  });

  $$('#sizes .size-pill').forEach(s => s.onclick = () => {
    if (s.classList.contains('disabled')) return;
    $$('#sizes .size-pill').forEach(x => x.classList.remove('on'));
    s.classList.add('on'); sel.size = s.dataset.s; sel.qty = 1; $('#q-input').value = 1;
    updateStockLine();
  });

  const qi = $('#q-input');
  const clampQty = () => {
    const max = Math.max(1, sizeStock(P, sel.size));
    sel.qty = Math.max(1, Math.min(max, parseInt(qi.value) || 1));
    qi.value = sel.qty;
  };
  $('#q-minus').onclick = () => { qi.value = (parseInt(qi.value) || 1) - 1; clampQty(); };
  $('#q-plus').onclick = () => { qi.value = (parseInt(qi.value) || 1) + 1; clampQty(); };
  qi.onchange = clampQty;

  $('#add-cart').onclick = () => {
    if (!sel.size) return toast('Please choose a size', 'err');
    addToCart(P.id, sel.size, sel.color, sel.qty);
    toast(`${P.name} added to cart`);
    openCartDrawer();
  };
  $('#buy-now').onclick = () => {
    if (!sel.size) return toast('Please choose a size', 'err');
    addToCart(P.id, sel.size, sel.color, sel.qty);
    location.href = 'checkout.html';
  };
  $('#fav-btn').onclick = () => {
    const on = toggleFav(P.id);
    $('#fav-btn').classList.toggle('on', on);
    toast(on ? 'Saved to favourites' : 'Removed from favourites');
  };
  $('#size-guide').onclick = () => infoModal('sizing');
  $('#jump-reviews').onclick = e => {
    e.preventDefault();
    switchTab('reviews');
    $('#tabs-section').scrollIntoView({ behavior: 'smooth' });
  };
}

/* ---------- tabs ---------- */

const TABS = [
  { key: 'details', label: 'Product details' },
  { key: 'specs', label: 'Specifications' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'delivery', label: 'Delivery & returns' }
];

function renderTabs() {
  $('#tabs').innerHTML = TABS.map((t, i) =>
    `<button class="tab ${i === 0 ? 'on' : ''}" data-tab="${t.key}">${t.label}${t.key === 'reviews' ? ` (${ratingStats(P.id).count})` : ''}</button>`).join('');

  $('#tab-panels').innerHTML = `
    <div class="tab-panel on" id="panel-details">${detailsPanel()}</div>
    <div class="tab-panel" id="panel-specs">${specsPanel()}</div>
    <div class="tab-panel" id="panel-reviews"></div>
    <div class="tab-panel" id="panel-delivery">${deliveryPanel()}</div>`;

  renderReviews();
  $$('#tabs .tab').forEach(b => b.onclick = () => switchTab(b.dataset.tab));
}

function switchTab(key) {
  $$('#tabs .tab').forEach(b => b.classList.toggle('on', b.dataset.tab === key));
  $$('.tab-panel').forEach(p => p.classList.toggle('on', p.id === 'panel-' + key));
}

function detailsPanel() {
  const paras = (P.details || P.description || '').split('\n').filter(Boolean);
  return `<div class="prose">
    ${paras.map(t => `<p>${esc(t)}</p>`).join('')}
    <p><b>Available colours:</b> ${(P.colors || []).map(c => esc(c.name)).join(' · ')}</p>
    <p><b>Available sizes:</b> ${(P.sizes || []).filter(s => s.qty > 0).map(s => esc(s.size)).join(' · ') || 'Currently none in stock'}</p>
  </div>`;
}

function specsPanel() {
  const rows = [
    ['Product code', P.sku],
    ['Category', categoryName(P.category)],
    ['Fabric', P.fabric],
    ['Fit', P.fit],
    ['Lining', P.lining],
    ['Care', P.care],
    ['Made', P.origin],
    ['Colours', (P.colors || []).map(c => c.name).join(', ')],
    ['Sizes', (P.sizes || []).map(s => s.size).join(', ')],
    ['Total stock', totalStock(P) + ' pieces']
  ].filter(r => r[1]);
  return `<table class="spec-table">${rows.map(r =>
    `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join('')}</table>`;
}

function deliveryPanel() {
  return `<div class="prose">
    <p><b>Delivery.</b> We dispatch within 24 hours of order confirmation. Rawalpindi and Islamabad usually arrive in 1–2 working days; the rest of Pakistan in 3–5. Delivery is a flat ${money(SITE.shipFlat)} and free on orders over ${money(SITE.freeShipOver)}.</p>
    <p><b>Cash on delivery.</b> Available nationwide — choose it at checkout and pay the courier when your parcel arrives.</p>
    <p><b>Exchanges.</b> Unworn items with tags attached can be exchanged for a different size within 7 days of delivery. We cover the return courier on size exchanges.</p>
    <p><b>Alterations.</b> Every suit includes free minor alterations at Shop #G77, Malikabad Shopping Mall within 14 days. Ordering from another city? Send your measurements to ${esc(SITE.phone)} on WhatsApp before dispatch and we will pre-alter for you.</p>
  </div>`;
}

/* ---------- reviews ---------- */

function renderReviews() {
  const st = ratingStats(P.id);
  const list = reviewsFor(P.id);

  $('#panel-reviews').innerHTML = `
    <div class="reviews-layout" id="reviews">
      <div class="review-summary">
        <div class="big">${st.count ? st.avg.toFixed(1) : '—'}</div>
        ${starsHTML(st.avg)}
        <p class="hint">${st.count ? `Based on ${st.count} review${st.count > 1 ? 's' : ''}` : 'No reviews yet'}</p>
        <div style="margin-top:16px">
          ${[5, 4, 3, 2, 1].map(n => {
            const c = st.counts[n - 1];
            const pct = st.count ? (c / st.count) * 100 : 0;
            return `<div class="bar-row"><span>${n}★</span><span class="bar"><i style="width:${pct}%"></i></span><span class="muted">${c}</span></div>`;
          }).join('')}
        </div>
      </div>

      <div>
        <div id="review-list">
          ${list.length ? list.map(r => `
            <div class="review">
              <div class="review-head">
                <div class="avatar">${esc((r.name || '?').trim().charAt(0).toUpperCase())}</div>
                <div>
                  <b>${esc(r.name)}</b>
                  <time>${shortDate(r.date)}</time>
                </div>
                <div style="margin-left:auto">${starsHTML(r.rating)}</div>
              </div>
              ${r.title ? `<h4>${esc(r.title)}</h4>` : ''}
              <p>${esc(r.body)}</p>
            </div>`).join('')
          : `<div class="empty-state" style="padding:30px 0;text-align:left">
               <h3>No reviews yet</h3><p>Be the first to review ${esc(P.name)}.</p></div>`}
        </div>

        <div class="review-form">
          <h3>Write a review</h3>
          <p class="muted" style="margin-top:-6px">Tell other customers about the fit, fabric and finish.</p>
          <div class="field">
            <label>Your rating</label>
            <div class="star-input" id="star-input">
              ${[1, 2, 3, 4, 5].map(n => `<button type="button" data-r="${n}">${ICON.starO}</button>`).join('')}
            </div>
            <p class="err-msg" id="rating-err">Please pick a rating</p>
          </div>
          <div class="grid-2">
            <div class="field"><label>Your name</label><input type="text" id="rv-name" placeholder="e.g. Ahmed K."></div>
            <div class="field"><label>Review title</label><input type="text" id="rv-title" placeholder="e.g. Excellent fit"></div>
          </div>
          <div class="field"><label>Your review</label>
            <textarea id="rv-body" placeholder="How was the quality, size and delivery?"></textarea></div>
          <button class="btn btn-gold" id="rv-submit">Submit review</button>
        </div>
      </div>
    </div>`;

  let rating = 0;
  const btns = $$('#star-input button');
  const paint = n => btns.forEach((b, i) => {
    b.classList.toggle('on', i < n);
    b.innerHTML = i < n ? ICON.star : ICON.starO;
  });
  btns.forEach((b, i) => {
    b.onmouseenter = () => paint(i + 1);
    b.onclick = () => { rating = i + 1; paint(rating); };
  });
  $('#star-input').onmouseleave = () => paint(rating);

  $('#rv-submit').onclick = () => {
    const name = $('#rv-name').value.trim();
    const body = $('#rv-body').value.trim();
    if (!rating) { $('#rating-err').style.display = 'block'; return toast('Please choose a star rating', 'err'); }
    if (!name) return toast('Please add your name', 'err');
    if (body.length < 6) return toast('Please write a little more', 'err');
    addReview({
      productId: P.id, name, rating,
      title: $('#rv-title').value.trim(),
      body, date: new Date().toISOString().slice(0, 10)
    });
    toast('Thank you — your review is live');
    renderReviews();
    renderTabsCount();
    switchTab('reviews');
  };
}

function renderTabsCount() {
  const b = $('#tabs .tab[data-tab="reviews"]');
  if (b) b.textContent = `Reviews (${ratingStats(P.id).count})`;
}

/* ---------- related ---------- */

function renderRelated() {
  let list = getProducts().filter(p => p.id !== P.id && p.category === P.category);
  if (list.length < 4) {
    list = list.concat(getProducts().filter(p => p.id !== P.id && p.category !== P.category));
  }
  list = list.slice(0, 4);
  if (!list.length) { $('#related-section').style.display = 'none'; return; }
  $('#related-grid').innerHTML = list.map(productCard).join('');
}
