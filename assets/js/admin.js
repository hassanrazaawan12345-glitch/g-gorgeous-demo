/* ==========================================================================
   G.GORGEOUS — admin panel
   Add / edit / delete products, manage orders, reviews and stock.
   ========================================================================== */

const NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { key: 'products', label: 'Products', icon: 'box' },
  { key: 'orders', label: 'Orders', icon: 'truck' },
  { key: 'reviews', label: 'Reviews', icon: 'chat' },
  { key: 'settings', label: 'Settings', icon: 'user' }
];

let draft = null;          // product being edited
let productSearch = '';

document.addEventListener('DOMContentLoaded', async () => {
  await loadCatalogue();
  if (Auth.isSignedIn() && Auth.isAdmin()) mountAdmin();
  else if (Auth.isSignedIn()) renderLogin('You are signed in, but this account is not marked as staff.');
  else renderLogin();
  window.addEventListener('hashchange', () => {
    if (Auth.isSignedIn() && Auth.isAdmin()) route();
  });
});

/* ---------- login ---------- */

function renderLogin(message) {
  $('#admin-root').innerHTML = `
    <div class="login-screen">
      <div class="login-card">
        <img src="${LOGO}" alt="G.Gorgeous">
        <h2 style="margin-bottom:2px">Admin Panel</h2>
        <p class="muted" style="font-size:.86rem">G.Gorgeous — Gents Wear</p>
        <div class="rule-ornament"><span>◆</span></div>
        ${message ? `<div class="demo-note" style="text-align:left"><span></span><div>${esc(message)}</div></div>` : ''}
        <div class="field" style="text-align:left">
          <label>Email</label>
          <input type="email" id="ad-email" placeholder="you@example.com" autocomplete="email" autofocus>
        </div>
        <div class="field" style="text-align:left">
          <label>Password</label>
          <input type="password" id="ad-pw" placeholder="Your password" autocomplete="current-password">
        </div>
        <button class="btn btn-gold btn-block" id="login-btn">Sign in</button>
        <p class="hint mt-16">Only staff accounts can open this panel.</p>
        <p class="hint"><a href="index.html" style="text-decoration:underline">← Back to store</a></p>
      </div>
    </div>`;

  const go = async () => {
    const btn = $('#login-btn');
    btn.disabled = true; btn.textContent = 'Signing in…';
    try {
      await Auth.signIn({ identifier: $('#ad-email').value, password: $('#ad-pw').value });
      if (!Auth.isAdmin()) {
        await Auth.signOut();
        return renderLogin('That account signed in fine, but it is not marked as staff, so it cannot open the admin panel.');
      }
      mountAdmin();
    } catch (e) {
      btn.disabled = false; btn.textContent = 'Sign in';
      toast(e.message, 'err');
    }
  };
  $('#login-btn').onclick = go;
  $('#ad-pw').onkeydown = e => { if (e.key === 'Enter') go(); };
}

/* ---------- shell ---------- */

function mountAdmin() {
  $('#admin-root').innerHTML = `
    <div class="admin-shell">
      <aside class="admin-side">
        <div class="admin-brand">
          <img src="${LOGO}" alt="">
          <div><b>G.Gorgeous</b><span>Admin</span></div>
        </div>
        <nav class="admin-nav" id="admin-nav">
          ${NAV.map(n => `<a data-go="${n.key}">${ICON[n.icon]} ${n.label}</a>`).join('')}
        </nav>
        <div class="side-foot">
          <a href="index.html" target="_blank">View store ↗</a>
          <a id="logout">${'Sign out'}</a>
        </div>
      </aside>
      <main class="admin-main" id="admin-main"></main>
    </div>`;

  $$('[data-go]').forEach(a => a.onclick = () => { location.hash = a.dataset.go; });
  $('#logout').onclick = async () => { await Auth.signOut(); renderLogin(); };
  route();
}

function route() {
  const hash = (location.hash || '#dashboard').slice(1);
  const [view, arg] = hash.split('/');
  $$('#admin-nav a').forEach(a => a.classList.toggle('on', a.dataset.go === view || (view === 'product' && a.dataset.go === 'products')));
  window.scrollTo({ top: 0 });

  if (view === 'products') return viewProducts();
  if (view === 'product') return viewProductForm(arg);
  if (view === 'orders') return viewOrders();
  if (view === 'reviews') return viewReviews();
  if (view === 'settings') return viewSettings();
  return viewDashboard();
}

const head = (title, sub, actions) => `
  <div class="admin-head">
    <div><h1>${title}</h1><p>${sub}</p></div>
    <div class="flex gap-8 wrap-flex">${actions || ''}</div>
  </div>`;

/* ---------- dashboard ---------- */

async function viewDashboard() {
  const products = getProducts();
  let orders = [];
  try { orders = await AdminDB.orders(); } catch (e) {}
  const revenue = orders.reduce((n, o) => n + o.totals.total, 0);
  const lowStock = products.filter(p => totalStock(p) > 0 && totalStock(p) <= 5);
  const outStock = products.filter(p => totalStock(p) === 0);

  $('#admin-main').innerHTML =
    head('Dashboard', 'Everything happening in your store right now',
      `<a class="btn btn-sm btn-gold" href="#product/new">${ICON.plus} Add product</a>`) + `

    <div class="stat-grid">
      <div class="stat"><span>Products</span><b>${products.length}</b></div>
      <div class="stat"><span>Orders</span><b>${orders.length}</b></div>
      <div class="stat"><span>Revenue</span><b style="font-size:1.5rem">${money(revenue)}</b></div>
      <div class="stat"><span>Reviews</span><b>${getReviews().length}</b></div>
    </div>

    <div class="grid-2" style="gap:20px;align-items:start">
      <div class="panel">
        <div class="panel-head"><h3>Recent orders</h3><a class="btn btn-sm btn-ghost" href="#orders">View all</a></div>
        <div class="table-wrap">
          ${orders.length ? `<table class="data">
            <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>${orders.slice(0, 6).map(o => `<tr>
              <td><b>#${esc(o.id)}</b><br><span class="muted" style="font-size:.76rem">${shortDate(o.date)}</span></td>
              <td>${esc(o.customer.name)}<br><span class="muted" style="font-size:.76rem">${esc(o.customer.city)}</span></td>
              <td>${money(o.totals.total)}</td>
              <td>${statusBadge(o.status)}</td></tr>`).join('')}</tbody></table>`
          : `<div class="panel-body muted">No orders yet. Place a test order from the store to see it here.</div>`}
        </div>
      </div>

      <div class="panel">
        <div class="panel-head"><h3>Stock alerts</h3><a class="btn btn-sm btn-ghost" href="#products">Manage</a></div>
        <div class="panel-body">
          ${outStock.length ? outStock.map(p => `<div class="flex between items-center" style="padding:8px 0;border-bottom:1px solid var(--line-soft)">
              <span>${esc(p.name)}</span><span class="badge badge-out">Sold out</span></div>`).join('') : ''}
          ${lowStock.length ? lowStock.map(p => `<div class="flex between items-center" style="padding:8px 0;border-bottom:1px solid var(--line-soft)">
              <span>${esc(p.name)}</span><span class="badge badge-warn">${totalStock(p)} left</span></div>`).join('') : ''}
          ${!outStock.length && !lowStock.length ? '<p class="muted mb-0">All products are comfortably in stock.</p>' : ''}
        </div>
      </div>
    </div>

    <div class="panel mt-24">
      <div class="panel-head"><h3>Catalogue by category</h3></div>
      <div class="panel-body">
        ${CATEGORIES.map(c => {
          const list = products.filter(p => p.category === c.slug);
          const stock = list.reduce((n, p) => n + totalStock(p), 0);
          return `<div class="flex between items-center" style="padding:10px 0;border-bottom:1px solid var(--line-soft)">
            <div class="flex items-center gap-12"><span style="width:26px">${CAT_ICON[c.art]}</span><b>${c.name}</b></div>
            <span class="muted">${list.length} products · ${stock} pieces in stock</span></div>`;
        }).join('')}
      </div>
    </div>`;
}

function statusBadge(s) {
  const map = { 'Pending': 'badge-warn', 'Confirmed': 'badge-new', 'Shipped': 'badge-new', 'Delivered': 'badge-ok', 'Cancelled': 'badge-sale' };
  return `<span class="badge ${map[s] || 'badge-out'}">${esc(s)}</span>`;
}

/* ---------- products list ---------- */

function viewProducts() {
  const q = productSearch.toLowerCase();
  const list = getProducts().filter(p =>
    !q || (p.name + p.sku + categoryName(p.category)).toLowerCase().includes(q));

  $('#admin-main').innerHTML =
    head('Products', `${getProducts().length} items in the store`,
      `<a class="btn btn-sm btn-gold" href="#product/new">${ICON.plus} Add product</a>`) + `

    <div class="panel">
      <div class="panel-head">
        <div class="header-search" style="width:280px">${ICON.search}
          <input type="text" id="p-search" placeholder="Search products…" value="${esc(productSearch)}">
        </div>
        <span class="muted" style="font-size:.84rem">${list.length} shown</span>
      </div>
      <div class="table-wrap">
        <table class="data">
          <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th></th></tr></thead>
          <tbody>
          ${list.length ? list.map(p => {
            const s = totalStock(p);
            return `<tr>
              <td><div class="t-prod"><img src="${productCover(p)}" alt="">
                <div><b>${esc(p.name)}</b><span>${esc(p.sku || '')}</span></div></div></td>
              <td>${esc(categoryName(p.category))}</td>
              <td>${money(effectivePrice(p))}${discountPct(p) ? `<br><span class="muted" style="text-decoration:line-through;font-size:.76rem">${money(p.price)}</span>` : ''}</td>
              <td>${s}</td>
              <td>${s === 0 ? '<span class="badge badge-out">Sold out</span>'
                    : s <= 5 ? `<span class="badge badge-warn">Low</span>`
                    : '<span class="badge badge-ok">Active</span>'}
                  ${p.featured ? '<span class="badge badge-new" style="margin-left:5px">Featured</span>' : ''}</td>
              <td><div class="row-actions">
                <a class="btn btn-sm btn-ghost" href="product.html?id=${p.id}" target="_blank" title="View">View</a>
                <a class="btn btn-sm btn-ghost" href="#product/${p.id}">${ICON.edit}</a>
                <button class="btn btn-sm btn-danger" data-del="${p.id}">${ICON.trash}</button>
              </div></td></tr>`;
          }).join('') : `<tr><td colspan="6" class="center muted" style="padding:36px">No products match that search.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>`;

  let t;
  $('#p-search').oninput = e => {
    clearTimeout(t);
    t = setTimeout(() => { productSearch = e.target.value; viewProducts(); $('#p-search').focus(); }, 220);
  };
  $$('[data-del]').forEach(b => b.onclick = () => {
    const p = productById(b.dataset.del);
    confirmBox('Delete product?', `“${p.name}” will be removed from the store along with its reviews.`, () => {
      AdminDB.deleteProduct(p.id)
        .then(async () => { await loadCatalogue(); toast('Product deleted'); viewProducts(); })
        .catch(e => toast(e.message, 'err'));
    });
  });
}

/* ---------- product form ---------- */

function blankProduct() {
  return {
    id: newProductId(), sku: '', name: '', category: CATEGORIES[0].slug,
    price: 0, salePrice: null, featured: false,
    description: '', details: '',
    fabric: '', fit: '', care: '', origin: 'Stitched in Rawalpindi', lining: '',
    colors: [{ name: 'Charcoal', hex: '#3a3f47' }],
    sizes: SIZE_SETS[CATEGORIES[0].slug].map(s => ({ size: s, qty: 0 })),
    images: [], video: '', artOpts: { weave: 'twill' },
    createdAt: new Date().toISOString()
  };
}

function viewProductForm(id) {
  const isNew = !id || id === 'new';
  draft = isNew ? blankProduct() : JSON.parse(JSON.stringify(productById(id) || blankProduct()));
  if (!draft.artOpts) draft.artOpts = { weave: 'twill' };

  $('#admin-main').innerHTML =
    head(isNew ? 'Add product' : 'Edit product',
      isNew ? 'Fill in the details customers will see on the store' : esc(draft.name),
      `<a class="btn btn-sm btn-ghost" href="#products">Cancel</a>
       <button class="btn btn-sm btn-gold" id="save-top">Save product</button>`) + `

    <div class="admin-form">
      <div>
        <div class="form-card">
          <h3>Basic information</h3>
          <p class="sub">Name, category and the short line shown on the product card.</p>
          <div class="grid-2">
            <div class="field"><label>Product name *</label>
              <input type="text" id="f-name" value="${esc(draft.name)}" placeholder="e.g. Regal Charcoal Three Piece">
              <p class="err-msg">Product name is required</p></div>
            <div class="field"><label>Product code / SKU</label>
              <input type="text" id="f-sku" value="${esc(draft.sku)}" placeholder="GG-3P-105"></div>
          </div>
          <div class="grid-2">
            <div class="field"><label>Category *</label>
              <select id="f-cat">${CATEGORIES.map(c =>
                `<option value="${c.slug}" ${draft.category === c.slug ? 'selected' : ''}>${c.name}</option>`).join('')}</select></div>
            <div class="field"><label>Fabric pattern (for placeholder art)</label>
              <select id="f-weave">
                ${['twill', 'plain', 'stripe', 'check'].map(w =>
                  `<option value="${w}" ${draft.artOpts.weave === w ? 'selected' : ''}>${w[0].toUpperCase() + w.slice(1)}</option>`).join('')}
              </select></div>
          </div>
          <div class="field"><label>Short description *</label>
            <textarea id="f-desc" style="min-height:80px" placeholder="One or two lines shown near the top of the product page">${esc(draft.description)}</textarea>
            <p class="err-msg">Please add a short description</p></div>
        </div>

        <div class="form-card">
          <h3>Pricing</h3>
          <p class="sub">Leave the sale price empty if the product is not discounted.</p>
          <div class="grid-2">
            <div class="field"><label>Price (Rs) *</label>
              <input type="number" id="f-price" value="${draft.price || ''}" min="0" placeholder="24500">
              <p class="err-msg">Enter a price above 0</p></div>
            <div class="field"><label>Sale price (Rs)</label>
              <input type="number" id="f-sale" value="${draft.salePrice || ''}" min="0" placeholder="optional">
              <p class="err-msg">Sale price must be lower than the price</p></div>
          </div>
          <label class="switch"><input type="checkbox" id="f-featured" ${draft.featured ? 'checked' : ''}>
            <span>Show in “Featured this season” on the home page</span></label>
        </div>

        <div class="form-card">
          <h3>Colours available</h3>
          <p class="sub">The first colour drives the placeholder artwork.</p>
          <div id="colors-list"></div>
          <button class="btn btn-sm btn-ghost mt-16" id="add-color">${ICON.plus} Add colour</button>
        </div>

        <div class="form-card">
          <h3>Sizes &amp; quantity available</h3>
          <p class="sub">Set how many pieces you have in each size. Zero means that size shows as sold out.</p>
          <div id="sizes-list"></div>
          <div class="flex gap-8 mt-16 wrap-flex">
            <button class="btn btn-sm btn-ghost" id="add-size">${ICON.plus} Add size</button>
            <button class="btn btn-sm btn-ghost" id="reset-sizes">Use standard sizes for this category</button>
          </div>
        </div>

        <div class="form-card">
          <h3>Product details</h3>
          <p class="sub">The long description shown under the “Product details” tab. Press Enter twice for a new paragraph.</p>
          <div class="field"><textarea id="f-details" style="min-height:180px" placeholder="Describe the cut, construction, fabric behaviour, styling advice, alteration policy…">${esc(draft.details)}</textarea></div>
          <div class="grid-2">
            <div class="field"><label>Fabric</label><input type="text" id="f-fabric" value="${esc(draft.fabric)}" placeholder="Poly-viscose twill, 260 gsm"></div>
            <div class="field"><label>Fit</label><input type="text" id="f-fit" value="${esc(draft.fit)}" placeholder="Slim Regular"></div>
          </div>
          <div class="grid-3">
            <div class="field"><label>Lining</label><input type="text" id="f-lining" value="${esc(draft.lining)}" placeholder="Full viscose"></div>
            <div class="field"><label>Care</label><input type="text" id="f-care" value="${esc(draft.care)}" placeholder="Dry clean only"></div>
            <div class="field"><label>Made</label><input type="text" id="f-origin" value="${esc(draft.origin)}" placeholder="Stitched in Rawalpindi"></div>
          </div>
        </div>
      </div>

      <div>
        <div class="form-card">
          <h3>Photos</h3>
          <p class="sub">First photo is the cover. Leave empty to use the generated artwork.</p>
          <div class="dropzone" id="img-drop">
            ${ICON.upload}<b>Click or drop images here</b><span>JPG or PNG · resized automatically</span>
            <input type="file" id="img-input" accept="image/*" multiple hidden>
          </div>
          <div class="media-grid" id="img-grid"></div>
          <div class="field mt-16"><label>…or paste an image URL</label>
            <div class="flex gap-8"><input type="url" id="img-url" placeholder="https://…">
              <button class="btn btn-sm btn-ghost" id="add-img-url">Add</button></div></div>
        </div>

        <div class="form-card">
          <h3>Video</h3>
          <p class="sub">Paste a link to a video you have already posted — it plays right on the product page.</p>
          <div class="field">
            <label>TikTok, YouTube or Instagram link</label>
            <input type="url" id="vid-url" value="${esc(draft.video || '')}"
                   placeholder="https://www.tiktok.com/@g.gorgeous_1.0/video/…">
            <p class="hint" id="vid-hint">Open the video on TikTok, tap Share → Copy link, then paste the full link here.</p>
          </div>
          <div id="vid-preview"></div>
        </div>

        <div class="form-card">
          <h3>Live preview</h3>
          <p class="sub">How the card will look in the store.</p>
          <div id="preview-card"></div>
        </div>

        <button class="btn btn-gold btn-block" id="save-bottom">Save product</button>
        ${isNew ? '' : `<button class="btn btn-danger btn-block mt-16" id="delete-product">Delete this product</button>`}
      </div>
    </div>`;

  renderColors(); renderSizes(); renderImages(); renderVideo(); renderPreview();
  bindForm(isNew);
}

function bindForm(isNew) {
  const sync = () => {
    draft.name = $('#f-name').value.trim();
    draft.sku = $('#f-sku').value.trim();
    draft.category = $('#f-cat').value;
    draft.description = $('#f-desc').value.trim();
    draft.details = $('#f-details').value.trim();
    draft.price = +$('#f-price').value || 0;
    draft.salePrice = $('#f-sale').value === '' ? null : +$('#f-sale').value;
    draft.featured = $('#f-featured').checked;
    draft.fabric = $('#f-fabric').value.trim();
    draft.fit = $('#f-fit').value.trim();
    draft.lining = $('#f-lining').value.trim();
    draft.care = $('#f-care').value.trim();
    draft.origin = $('#f-origin').value.trim();
    draft.artOpts.weave = $('#f-weave').value;
  };

  $$('#admin-main input, #admin-main select, #admin-main textarea').forEach(el => {
    el.addEventListener('input', () => {
      sync(); renderPreview();
      const f = el.closest('.field'); if (f) f.classList.remove('invalid');
    });
    el.addEventListener('change', () => { sync(); renderPreview(); });
  });

  $('#f-cat').addEventListener('change', () => {
    const std = SIZE_SETS[draft.category] || [];
    const hasCustom = draft.sizes.some(s => !std.includes(s.size));
    if (!hasCustom && confirm('Switch to the standard sizes for this category?')) {
      draft.sizes = std.map(s => ({ size: s, qty: 0 }));
      renderSizes();
    }
    renderPreview();
  });

  $('#add-color').onclick = () => { draft.colors.push({ name: 'New colour', hex: '#3a3f47' }); renderColors(); renderPreview(); };
  $('#add-size').onclick = () => {
    const s = prompt('Size label (e.g. 48, XXL, One Size)');
    if (s && !draft.sizes.some(x => x.size === s.trim())) {
      draft.sizes.push({ size: s.trim(), qty: 0 }); renderSizes();
    }
  };
  $('#reset-sizes').onclick = () => {
    draft.sizes = (SIZE_SETS[draft.category] || []).map(s => {
      const old = draft.sizes.find(x => x.size === s);
      return { size: s, qty: old ? old.qty : 0 };
    });
    renderSizes();
  };

  bindUploads();

  const save = () => { sync(); saveDraft(); };
  $('#save-top').onclick = save;
  $('#save-bottom').onclick = save;
  const del = $('#delete-product');
  if (del) del.onclick = () => confirmBox('Delete product?', `“${draft.name}” will be removed from the store.`, () => {
    AdminDB.deleteProduct(draft.id)
      .then(async () => { await loadCatalogue(); toast('Product deleted'); location.hash = 'products'; route(); })
      .catch(e => toast(e.message, 'err'));
  });
}

function saveDraft() {
  $$('.field').forEach(f => f.classList.remove('invalid'));
  const bad = [];
  if (!draft.name) bad.push('#f-name');
  if (!draft.description) bad.push('#f-desc');
  if (!draft.price || draft.price <= 0) bad.push('#f-price');
  if (draft.salePrice != null && draft.salePrice >= draft.price) bad.push('#f-sale');

  if (bad.length) {
    bad.forEach(sel => { const f = $(sel).closest('.field'); if (f) f.classList.add('invalid'); });
    $(bad[0]).scrollIntoView({ behavior: 'smooth', block: 'center' });
    return toast('Please check the highlighted fields', 'err');
  }

  if (!draft.sku) draft.sku = 'GG-' + draft.id.slice(-5).toUpperCase();
  draft.sizes = draft.sizes.map(s => ({ size: s.size, qty: Math.max(0, +s.qty || 0) }));
  if (!draft.createdAt) draft.createdAt = new Date().toISOString();

  const btns = [$('#save-top'), $('#save-bottom')].filter(Boolean);
  btns.forEach(b => { b.disabled = true; b.textContent = 'Saving\u2026'; });

  AdminDB.saveProduct(draft)
    .then(async () => {
      await loadCatalogue();
      toast('Product saved');
      location.hash = 'products';
      route();
    })
    .catch(e => {
      btns.forEach(b => { b.disabled = false; b.textContent = 'Save product'; });
      toast(e.message, 'err');
    });
}

/* ---------- colours / sizes editors ---------- */

function renderColors() {
  $('#colors-list').innerHTML = draft.colors.map((c, i) => `
    <div class="color-row">
      <input type="color" value="${c.hex}" data-chex="${i}">
      <input type="text" value="${esc(c.name)}" data-cname="${i}" placeholder="Colour name">
      <button class="btn btn-sm btn-danger" data-crm="${i}" ${draft.colors.length === 1 ? 'disabled' : ''}>${ICON.x}</button>
    </div>`).join('');

  $$('[data-chex]').forEach(el => el.oninput = () => { draft.colors[+el.dataset.chex].hex = el.value; renderPreview(); });
  $$('[data-cname]').forEach(el => el.oninput = () => { draft.colors[+el.dataset.cname].name = el.value; });
  $$('[data-crm]').forEach(b => b.onclick = () => { draft.colors.splice(+b.dataset.crm, 1); renderColors(); renderPreview(); });
}

function renderSizes() {
  $('#sizes-list').innerHTML = draft.sizes.length ? draft.sizes.map((s, i) => `
    <div class="size-stock-row">
      <span class="sz">${esc(s.size)}</span>
      <input type="number" min="0" value="${s.qty}" data-sq="${i}" placeholder="Quantity in stock">
      <button class="btn btn-sm btn-danger" data-srm="${i}">${ICON.x}</button>
    </div>`).join('') : '<p class="muted">No sizes yet — add one below.</p>';

  $$('[data-sq]').forEach(el => el.oninput = () => { draft.sizes[+el.dataset.sq].qty = Math.max(0, +el.value || 0); });
  $$('[data-srm]').forEach(b => b.onclick = () => { draft.sizes.splice(+b.dataset.srm, 1); renderSizes(); });
}

/* ---------- media ---------- */

function renderImages() {
  const grid = $('#img-grid');
  grid.innerHTML = draft.images.map((src, i) => `
    <div class="media-item">
      <img src="${src}" alt="">
      ${i === 0 ? '<span class="cover-tag">Cover</span>' : ''}
      <button class="rm" data-irm="${i}" title="Remove">×</button>
    </div>`).join('');
  $$('[data-irm]').forEach(b => b.onclick = () => { draft.images.splice(+b.dataset.irm, 1); renderImages(); renderPreview(); });
}

function renderVideo() {
  const box = $('#vid-preview');
  const hint = $('#vid-hint');
  if (!box) return;

  const raw = ($('#vid-url') ? $('#vid-url').value : draft.video || '').trim();

  if (!raw) {
    draft.video = '';
    box.innerHTML = '';
    hint.textContent = 'Open the video on TikTok, tap Share → Copy link, then paste the full link here.';
    hint.style.color = '';
    return;
  }

  const v = parseVideo(raw);

  if (v.kind === 'error') {
    draft.video = '';
    box.innerHTML = '';
    hint.textContent = v.error;
    hint.style.color = 'var(--danger)';
    return;
  }

  draft.video = raw;
  hint.textContent = `${v.label} video recognised — this is how customers will see it.`;
  hint.style.color = 'var(--ok)';
  box.innerHTML = `<div class="video-preview" style="aspect-ratio:${v.ratio}">${videoEmbedHTML(raw)}</div>
    <button class="btn btn-sm btn-danger mt-16" id="vid-rm">${ICON.trash} Remove video</button>`;

  const rm = $('#vid-rm');
  if (rm) rm.onclick = () => { $('#vid-url').value = ''; renderVideo(); renderPreview(); };
}

function compressImage(file, maxSide, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width: w, height: h } = img;
        const scale = Math.min(1, maxSide / Math.max(w, h));
        w = Math.round(w * scale); h = Math.round(h * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function bindUploads() {
  const imgDrop = $('#img-drop'), imgInput = $('#img-input');
  imgDrop.onclick = () => imgInput.click();
  imgDrop.ondragover = e => { e.preventDefault(); imgDrop.classList.add('drag'); };
  imgDrop.ondragleave = () => imgDrop.classList.remove('drag');
  imgDrop.ondrop = e => {
    e.preventDefault(); imgDrop.classList.remove('drag');
    handleImages(Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/')));
  };
  imgInput.onchange = () => { handleImages(Array.from(imgInput.files)); imgInput.value = ''; };

  $('#add-img-url').onclick = () => {
    const url = $('#img-url').value.trim();
    if (!url) return;
    draft.images.push(url); $('#img-url').value = '';
    renderImages(); renderPreview(); toast('Image added');
  };

  // video is a link, never an upload — see the note in store.js
  let vt;
  $('#vid-url').addEventListener('input', () => {
    clearTimeout(vt);
    vt = setTimeout(renderVideo, 350);
  });
}

async function handleImages(files) {
  if (!files.length) return;
  toast(`Uploading ${files.length} image${files.length > 1 ? 's' : ''}\u2026`);
  let done = 0;
  for (const f of files) {
    try {
      draft.images.push(await AdminDB.uploadImage(f));
      done++;
      renderImages(); renderPreview();
    } catch (e) {
      toast(`${f.name}: ${e.message}`, 'err');
    }
  }
  if (done) toast(`${done} image${done > 1 ? 's' : ''} uploaded`);
}

function renderPreview() {
  const p = { ...draft, name: draft.name || 'Product name', price: draft.price || 0 };
  $('#preview-card').innerHTML = productCard(p);
}

/* ---------- orders ---------- */

async function viewOrders() {
  let orders = [];
  try { orders = await AdminDB.orders(); }
  catch (e) { toast(e.message, 'err'); }
  $('#admin-main').innerHTML =
    head('Orders', `${orders.length} order${orders.length === 1 ? '' : 's'} placed`) + `
    <div class="panel">
      <div class="table-wrap">
        <table class="data">
          <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Payment</th><th>Total</th><th>Status</th><th></th></tr></thead>
          <tbody>
          ${orders.length ? orders.map(o => `<tr>
            <td><b>#${esc(o.id)}</b><br><span class="muted" style="font-size:.76rem">${shortDate(o.date)}</span></td>
            <td>${esc(o.customer.name)}<br><span class="muted" style="font-size:.76rem">${esc(o.customer.phone)}</span></td>
            <td>${o.items.reduce((n, i) => n + i.qty, 0)}</td>
            <td>${esc(o.payment.label)}<br><span class="muted" style="font-size:.76rem">${esc(o.payment.status)}</span></td>
            <td>${money(o.totals.total)}</td>
            <td><select data-status="${o.id}" style="padding:7px 30px 7px 10px;font-size:.8rem">
              ${['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map(s =>
                `<option ${o.status === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select></td>
            <td><div class="row-actions">
              <button class="btn btn-sm btn-ghost" data-view="${o.id}">Details</button>
              <button class="btn btn-sm btn-danger" data-orm="${o.id}">${ICON.trash}</button>
            </div></td></tr>`).join('')
          : `<tr><td colspan="7" class="center muted" style="padding:40px">No orders yet. Place a test order from the store to see it appear here.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>`;

  $$('[data-status]').forEach(sel => sel.onchange = () => {
    AdminDB.setOrderStatus(sel.dataset.status, sel.value)
      .then(() => toast('Order status updated'))
      .catch(e => toast(e.message, 'err'));
  });
  $$('[data-view]').forEach(b => b.onclick = () => orderModal(b.dataset.view, orders));
  $$('[data-orm]').forEach(b => b.onclick = () => confirmBox('Delete order?', `Order #${b.dataset.orm} will be removed.`, () => {
    AdminDB.deleteOrder(b.dataset.orm)
      .then(() => { toast('Order deleted'); viewOrders(); })
      .catch(e => toast(e.message, 'err'));
  }));
}

function orderModal(id, orders) {
  const o = (orders || []).find(x => x.id === id);
  if (!o) return;
  openModal(`<div class="modal-pad">
    <p class="eyebrow">Order #${esc(o.id)} · ${shortDate(o.date)}</p>
    <h2>${esc(o.customer.name)}</h2>
    <div class="rule-ornament" style="margin:6px 0 22px"><span>◆</span></div>

    <div class="grid-2" style="gap:24px">
      <div>
        <h3 style="font-size:1rem">Delivery</h3>
        <table class="spec-table">
          <tr><td>Phone</td><td>${esc(o.customer.phone)}</td></tr>
          <tr><td>Email</td><td>${esc(o.customer.email)}</td></tr>
          <tr><td>Address</td><td>${esc(o.customer.address)}</td></tr>
          <tr><td>City</td><td>${esc(o.customer.city)}, ${esc(o.customer.province)} ${esc(o.customer.postal || '')}</td></tr>
          ${o.customer.notes ? `<tr><td>Notes</td><td>${esc(o.customer.notes)}</td></tr>` : ''}
        </table>
      </div>
      <div>
        <h3 style="font-size:1rem">Payment</h3>
        <table class="spec-table">
          <tr><td>Method</td><td>${esc(o.payment.label)}</td></tr>
          ${o.payment.last4 ? `<tr><td>Card</td><td>•••• ${esc(o.payment.last4)}</td></tr>` : ''}
          ${o.payment.wallet ? `<tr><td>Wallet</td><td>${esc(o.payment.wallet)}</td></tr>` : ''}
          <tr><td>Status</td><td>${esc(o.payment.status)}</td></tr>
          <tr><td>Order status</td><td>${statusBadge(o.status)}</td></tr>
        </table>
      </div>
    </div>

    <h3 style="font-size:1rem;margin-top:24px">Items</h3>
    <table class="data" style="min-width:auto">
      <thead><tr><th>Product</th><th>Options</th><th>Qty</th><th>Total</th></tr></thead>
      <tbody>${o.items.map(i => `<tr>
        <td><b>${esc(i.name)}</b><br><span class="muted" style="font-size:.76rem">${esc(i.sku || '')}</span></td>
        <td>${esc(i.color || '—')} · Size ${esc(i.size)}</td>
        <td>${i.qty}</td><td>${money(i.lineTotal)}</td></tr>`).join('')}</tbody>
    </table>

    <div style="max-width:300px;margin-left:auto;margin-top:16px">
      <div class="sum-row"><span class="muted">Subtotal</span><span>${money(o.totals.subtotal)}</span></div>
      ${o.totals.discount ? `<div class="sum-row"><span class="muted">Discount</span><span>− ${money(o.totals.discount)}</span></div>` : ''}
      <div class="sum-row"><span class="muted">Delivery</span><span>${o.totals.shipping ? money(o.totals.shipping) : 'Free'}</span></div>
      <div class="sum-row total"><span>Total</span><span>${money(o.totals.total)}</span></div>
    </div>

    <div class="flex gap-12 mt-24">
      <a class="btn btn-sm" href="https://wa.me/${esc((o.customer.phone || '').replace(/\D/g, '').replace(/^0/, '92'))}?text=${encodeURIComponent('Assalam o Alaikum ' + o.customer.name + ', your G.Gorgeous order #' + o.id + ' is confirmed.')}" target="_blank" rel="noopener">Message customer</a>
      <button class="btn btn-sm btn-ghost" onclick="window.print()">Print</button>
    </div>
  </div>`);
}

/* ---------- reviews ---------- */

async function viewReviews() {
  let reviews = [];
  try { reviews = await AdminDB.reviews(); }
  catch (e) { toast(e.message, 'err'); }
  $('#admin-main').innerHTML =
    head('Reviews', `${reviews.length} customer review${reviews.length === 1 ? '' : 's'}`) + `
    <div class="panel">
      <div class="table-wrap">
        <table class="data">
          <thead><tr><th>Product</th><th>Customer</th><th>Rating</th><th>Review</th><th>Date</th><th></th></tr></thead>
          <tbody>
          ${reviews.length ? reviews.map(r => {
            const p = productById(r.productId);
            return `<tr>
              <td>${p ? `<a href="product.html?id=${p.id}" target="_blank" style="text-decoration:underline">${esc(p.name)}</a>` : '<span class="muted">deleted</span>'}</td>
              <td>${esc(r.name)}</td>
              <td>${starsHTML(r.rating)}</td>
              <td style="max-width:360px">${r.title ? `<b>${esc(r.title)}</b><br>` : ''}<span class="muted">${esc(r.body)}</span></td>
              <td>${shortDate(r.date)}</td>
              <td><button class="btn btn-sm btn-danger" data-rrm="${r.id}">${ICON.trash}</button></td></tr>`;
          }).join('') : `<tr><td colspan="6" class="center muted" style="padding:40px">No reviews yet.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>`;

  $$('[data-rrm]').forEach(b => b.onclick = () => confirmBox('Delete review?', 'This review will be removed from the product page.', () => {
    AdminDB.deleteReview(b.dataset.rrm)
      .then(() => { toast('Review deleted'); viewReviews(); })
      .catch(e => toast(e.message, 'err'));
  }));
}

/* ---------- settings ---------- */

function viewSettings() {
  const used = new Blob(Object.keys(localStorage).map(k => localStorage.getItem(k))).size;
  $('#admin-main').innerHTML = head('Settings', 'Store information and demo data tools') + `
    <div class="grid-2" style="gap:20px;align-items:start">
      <div class="panel">
        <div class="panel-head"><h3>Store details</h3></div>
        <div class="panel-body">
          <table class="spec-table">
            <tr><td>Store</td><td>${esc(SITE.name)} — ${esc(SITE.tagline)}</td></tr>
            <tr><td>Phone</td><td>${esc(SITE.phone)}</td></tr>
            <tr><td>Address</td><td>${esc(SITE.address)}</td></tr>
            <tr><td>Instagram</td><td>${esc(SITE.instagramHandle)}</td></tr>
            <tr><td>TikTok</td><td>${esc(SITE.tiktokHandle)}</td></tr>
            <tr><td>Free delivery over</td><td>${money(SITE.freeShipOver)}</td></tr>
            <tr><td>Delivery charge</td><td>${money(SITE.shipFlat)}</td></tr>
            <tr><td>Admin PIN</td><td>${esc(SITE.adminPin)}</td></tr>
          </table>
          <p class="hint mt-16">These are set in <b>assets/js/data.js</b> — edit that file to change them across the whole site.</p>
        </div>
      </div>

      <div class="panel">
        <div class="panel-head"><h3>Data</h3></div>
        <div class="panel-body">
          <p class="muted">Products, orders, customers and reviews live in your Supabase database. Product photos are stored there too; the original catalogue photos are served from Cloudflare.</p>
          <p class="hint">Cart and favourites stay in each visitor’s own browser, which is why they do not follow a customer between devices.</p>
          <div class="flex gap-8 wrap-flex mt-16">
            <button class="btn btn-sm btn-ghost" id="export">Export data (JSON)</button>


          </div>

          <p class="hint mt-16">Export downloads a JSON copy of the live catalogue, orders and reviews — a quick manual backup between Supabase backups.</p>
        </div>
      </div>
    </div>`;

  $('#export').onclick = async () => {
    const data = {
      products: getProducts(),
      reviews: await AdminDB.reviews().catch(() => []),
      orders: await AdminDB.orders().catch(() => []),
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'g-gorgeous-data.json';
    a.click();
    URL.revokeObjectURL(a.href);
    toast('Data exported');
  };



}
