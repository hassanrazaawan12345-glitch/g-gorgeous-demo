/* ==========================================================================
   G.GORGEOUS — home page: category strip, featured rail, filterable shop
   ========================================================================== */

const PAGE_SIZE = 9;

const state = {
  q: '',
  cats: new Set(),
  sizes: new Set(),
  colors: new Set(),
  min: null,
  max: null,
  inStock: false,
  onSale: false,
  sort: 'featured',
  shown: PAGE_SIZE
};

document.addEventListener('DOMContentLoaded', async () => {
  await loadCatalogue();
  const p = params();
  if (p.get('cat')) state.cats.add(p.get('cat'));
  if (p.get('q')) state.q = p.get('q');

  mountChrome(p.get('cat') || 'home');
  buildFeatured();
  buildAssurances();
  buildVisit();
  buildFilters();
  bindControls();
  render();

  if (p.get('cat') || p.get('q')) {
    setTimeout(() => document.getElementById('shop').scrollIntoView({ behavior: 'smooth' }), 220);
  }
});

/* ---------- static blocks ---------- */

function buildFeatured() {
  const list = getProducts().filter(p => p.featured).slice(0, 4);
  const grid = $('#featured-grid');
  if (!list.length) { grid.closest('section').style.display = 'none'; return; }
  grid.innerHTML = list.map(productCard).join('');
}

function buildAssurances() {
  const items = [
    [ICON.scissors, 'Free alterations', 'Every suit adjusted at our Malikabad shop within 14 days.'],
    [ICON.truck, 'Nationwide delivery', `Flat ${money(SITE.shipFlat)} — free over ${money(SITE.freeShipOver)}. COD available.`],
    [ICON.shield, '7-day easy exchange', 'Unworn, tagged items can be exchanged for another size.']
  ];
  items.forEach((it, i) => {
    $('#a' + (i + 1)).innerHTML = `${it[0]}<div><b>${it[1]}</b><span>${it[2]}</span></div>`;
  });
}

function buildVisit() {
  $('#visit-addr').textContent = SITE.address + ' · ' + SITE.phone;
  $('#visit-call').href = 'tel:' + SITE.phoneRaw;
  $('#visit-insta').href = SITE.instagram;
  $('#visit-tiktok').href = SITE.tiktok;
}

/* ---------- filters ---------- */

function allSizes() {
  const seen = [];
  getProducts().forEach(p => (p.sizes || []).forEach(s => { if (!seen.includes(s.size)) seen.push(s.size); }));
  return seen.sort((a, b) => {
    const na = parseInt(a), nb = parseInt(b);
    if (!isNaN(na) && !isNaN(nb)) return na - nb;
    const order = ['S', 'M', 'L', 'XL', 'XXL', 'One Size'];
    return order.indexOf(a) - order.indexOf(b);
  });
}

function allColors() {
  const map = new Map();
  getProducts().forEach(p => (p.colors || []).forEach(c => { if (!map.has(c.name)) map.set(c.name, c.hex); }));
  return Array.from(map, ([name, hex]) => ({ name, hex }));
}

function buildFilters() {
  const products = getProducts();

  $('#f-cats').innerHTML = CATEGORIES.map(c => {
    const n = products.filter(p => p.category === c.slug).length;
    return `<label class="check">
      <input type="checkbox" value="${c.slug}" ${state.cats.has(c.slug) ? 'checked' : ''}>
      <span>${c.name}</span><span class="n">${n}</span></label>`;
  }).join('');

  $('#f-sizes').innerHTML = allSizes().map(s =>
    `<div class="size-pill ${state.sizes.has(s) ? 'on' : ''}" data-size="${esc(s)}">${esc(s)}</div>`).join('');

  $('#f-colors').innerHTML = allColors().map(c =>
    `<span class="color-dot ${state.colors.has(c.name) ? 'on' : ''}" data-color="${esc(c.name)}" style="background:${c.hex}" title="${esc(c.name)}"></span>`).join('');

  $('#f-search').value = state.q;
}

function bindControls() {
  $('#f-cats').addEventListener('change', e => {
    if (e.target.checked) state.cats.add(e.target.value); else state.cats.delete(e.target.value);
    resetPage(); render();
  });
  $('#f-sizes').addEventListener('click', e => {
    const el = e.target.closest('[data-size]'); if (!el) return;
    const v = el.dataset.size;
    if (state.sizes.has(v)) state.sizes.delete(v); else state.sizes.add(v);
    el.classList.toggle('on'); resetPage(); render();
  });
  $('#f-colors').addEventListener('click', e => {
    const el = e.target.closest('[data-color]'); if (!el) return;
    const v = el.dataset.color;
    if (state.colors.has(v)) state.colors.delete(v); else state.colors.add(v);
    el.classList.toggle('on'); resetPage(); render();
  });

  let t;
  $('#f-search').addEventListener('input', e => {
    clearTimeout(t);
    t = setTimeout(() => { state.q = e.target.value.trim(); resetPage(); render(); }, 200);
  });
  $('#f-min').addEventListener('input', e => { state.min = e.target.value === '' ? null : +e.target.value; resetPage(); render(); });
  $('#f-max').addEventListener('input', e => { state.max = e.target.value === '' ? null : +e.target.value; resetPage(); render(); });
  $('#f-instock').addEventListener('change', e => { state.inStock = e.target.checked; resetPage(); render(); });
  $('#f-sale').addEventListener('change', e => { state.onSale = e.target.checked; resetPage(); render(); });
  $('#sort').addEventListener('change', e => { state.sort = e.target.value; resetPage(); render(); });

  $('#clear-filters').addEventListener('click', clearAll);
  $('#load-more').addEventListener('click', () => { state.shown += PAGE_SIZE; render(); });

  const toggle = $('#filter-toggle');
  toggle.classList.remove('hide');
  toggle.innerHTML = ICON.filter + ' Filters';
  toggle.addEventListener('click', () => {
    $('#filters').classList.add('open');
    $('#filters-done-wrap').style.display = 'block';
    document.body.style.overflow = 'hidden';
  });
  $('#filters-done').addEventListener('click', () => {
    $('#filters').classList.remove('open');
    document.body.style.overflow = '';
  });
}

function resetPage() { state.shown = PAGE_SIZE; }

function clearAll() {
  state.q = ''; state.cats.clear(); state.sizes.clear(); state.colors.clear();
  state.min = state.max = null; state.inStock = state.onSale = false; resetPage();
  $('#f-search').value = ''; $('#f-min').value = ''; $('#f-max').value = '';
  $('#f-instock').checked = false; $('#f-sale').checked = false;
  $$('#f-cats input').forEach(i => i.checked = false);
  $$('#f-sizes .size-pill').forEach(i => i.classList.remove('on'));
  $$('#f-colors .color-dot').forEach(i => i.classList.remove('on'));
  history.replaceState({}, '', location.pathname);
  render();
}

/* ---------- filtering + render ---------- */

function filtered() {
  const q = state.q.toLowerCase();
  let list = getProducts().filter(p => {
    if (state.cats.size && !state.cats.has(p.category)) return false;
    if (state.sizes.size && !(p.sizes || []).some(s => state.sizes.has(s.size))) return false;
    if (state.colors.size && !(p.colors || []).some(c => state.colors.has(c.name))) return false;
    const price = effectivePrice(p);
    if (state.min != null && price < state.min) return false;
    if (state.max != null && price > state.max) return false;
    if (state.inStock && totalStock(p) <= 0) return false;
    if (state.onSale && !discountPct(p)) return false;
    if (q) {
      const hay = [p.name, p.description, p.sku, categoryName(p.category), p.fabric,
        (p.colors || []).map(c => c.name).join(' ')].join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  switch (state.sort) {
    case 'low':    list.sort((a, b) => effectivePrice(a) - effectivePrice(b)); break;
    case 'high':   list.sort((a, b) => effectivePrice(b) - effectivePrice(a)); break;
    case 'name':   list.sort((a, b) => a.name.localeCompare(b.name)); break;
    case 'new':    list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)); break;
    case 'rating': list.sort((a, b) => ratingStats(b.id).avg - ratingStats(a.id).avg); break;
    default:       list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }
  return list;
}

function renderChips() {
  const chips = [];
  state.cats.forEach(c => chips.push(['cat', c, categoryName(c)]));
  state.sizes.forEach(s => chips.push(['size', s, 'Size ' + s]));
  state.colors.forEach(c => chips.push(['color', c, c]));
  if (state.q) chips.push(['q', state.q, `“${state.q}”`]);
  if (state.inStock) chips.push(['stock', '1', 'In stock']);
  if (state.onSale) chips.push(['sale', '1', 'On sale']);
  if (state.min != null) chips.push(['min', '1', 'Min ' + money(state.min)]);
  if (state.max != null) chips.push(['max', '1', 'Max ' + money(state.max)]);

  const el = $('#active-chips');
  el.innerHTML = chips.length
    ? chips.map(c => `<span class="chip">${esc(c[2])}<button data-rm="${c[0]}" data-v="${esc(c[1])}">×</button></span>`).join('') +
      `<button class="chip" id="chip-clear" style="cursor:pointer">Clear all</button>`
    : '';

  $$('[data-rm]', el).forEach(b => b.onclick = () => {
    const { rm, v } = b.dataset;
    if (rm === 'cat') { state.cats.delete(v); $$('#f-cats input').forEach(i => { if (i.value === v) i.checked = false; }); }
    if (rm === 'size') { state.sizes.delete(v); $$('#f-sizes .size-pill').forEach(i => { if (i.dataset.size === v) i.classList.remove('on'); }); }
    if (rm === 'color') { state.colors.delete(v); $$('#f-colors .color-dot').forEach(i => { if (i.dataset.color === v) i.classList.remove('on'); }); }
    if (rm === 'q') { state.q = ''; $('#f-search').value = ''; }
    if (rm === 'stock') { state.inStock = false; $('#f-instock').checked = false; }
    if (rm === 'sale') { state.onSale = false; $('#f-sale').checked = false; }
    if (rm === 'min') { state.min = null; $('#f-min').value = ''; }
    if (rm === 'max') { state.max = null; $('#f-max').value = ''; }
    resetPage(); render();
  });
  const ca = $('#chip-clear', el);
  if (ca) ca.onclick = clearAll;
}

function render() {
  const list = filtered();
  const page = list.slice(0, state.shown);

  $('#shop-grid').innerHTML = page.length
    ? page.map(productCard).join('')
    : `<div class="empty-state" style="grid-column:1/-1">
         <h3>Nothing matches those filters</h3>
         <p>Try widening the price range or clearing a filter.</p>
         <button class="btn btn-sm btn-ghost" onclick="clearAll()">Clear all filters</button>
       </div>`;

  $('#count-txt').innerHTML = `Showing <b>${page.length}</b> of <b>${list.length}</b> products`;
  $('#load-more').classList.toggle('hide', page.length >= list.length);
  renderChips();
}
