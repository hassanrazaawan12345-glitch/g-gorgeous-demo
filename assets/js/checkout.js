/* ==========================================================================
   G.GORGEOUS — checkout: validation, payment methods, order placement
   Demo only: no card data leaves the browser and nothing is charged.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  mountChrome('cart');

  const last = sessionStorage.getItem('gg.lastOrder');
  if (!cartTotals().lines.length) {
    if (last && params().get('done') === '1') return showSuccess(JSON.parse(last));
    return showEmpty();
  }

  renderAuthBanner();
  renderSummary();
  restoreDetails();
  bindPayment();
  bindFormatting();
  $('#checkout-form').addEventListener('submit', submit);
  document.addEventListener('gg:cart', renderSummary);
});

function showEmpty() {
  $('#checkout-body').innerHTML = `<div class="empty-state" style="grid-column:1/-1">
    <h3>Your cart is empty</h3>
    <p>Add something to the cart before checking out.</p>
    <a class="btn" href="index.html#shop">Browse the collection</a></div>`;
  $('.steps').style.display = 'none';
}

/* ---------- signed-in banner ---------- */

function renderAuthBanner() {
  const user = Auth.currentUser();
  const el = document.createElement('div');
  el.className = 'signin-banner';

  if (user) {
    const addrs = Auth.addresses();
    el.innerHTML = `
      <span>Signed in as <b>${esc(user.name)}</b> — your details are filled in below.</span>
      ${addrs.length > 1 ? `<select id="addr-pick" style="width:auto;min-width:220px">
          ${addrs.map(a => `<option value="${a.id}" ${a.isDefault ? 'selected' : ''}>${esc(a.label)} — ${esc(a.city)}</option>`).join('')}
        </select>` : `<a class="btn btn-sm btn-ghost" href="account.html">My account</a>`}`;
  } else {
    el.innerHTML = `
      <span>Have an account? Sign in and we will fill this in for you.</span>
      <span class="flex gap-8">
        <a class="btn btn-sm btn-ghost" href="account.html?next=checkout.html">Sign in</a>
        <a class="btn btn-sm" href="account.html?view=signup&next=checkout.html">Create account</a>
      </span>`;
  }

  const body = $('#checkout-body');
  body.parentNode.insertBefore(el, body);

  const pick = $('#addr-pick');
  if (pick) pick.onchange = () => fillAddress(Auth.addresses().find(a => a.id === pick.value));
}

function fillAddress(a) {
  if (!a) return;
  $('#c-address').value = a.address || '';
  $('#c-city').value = a.city || '';
  $('#c-province').value = a.province || '';
  $('#c-postal').value = a.postal || '';
  if (a.phone) $('#c-phone').value = prettyPhone(a.phone);
  $$('.field').forEach(f => f.classList.remove('invalid'));
}

/* ---------- summary ---------- */

function renderSummary() {
  const t = cartTotals();
  $('#checkout-summary').innerHTML = `
    <h3>Your order</h3>
    ${t.lines.map(l => `
      <div class="flex gap-12" style="padding:11px 0;border-bottom:1px solid var(--line-soft)">
        <div class="cart-img" style="width:58px;flex:none"><img src="${productCover(l.product)}" alt=""></div>
        <div style="flex:1;min-width:0">
          <div style="font-size:.88rem;font-weight:600">${esc(l.product.name)}</div>
          <div class="muted" style="font-size:.76rem">${esc(l.color || '—')} · Size ${esc(l.size)} · ×${l.qty}</div>
        </div>
        <div style="font-size:.88rem;font-weight:600;white-space:nowrap">${money(l.lineTotal)}</div>
      </div>`).join('')}

    <div class="sum-row" style="margin-top:12px"><span class="muted">Subtotal</span><span>${money(t.subtotal)}</span></div>
    ${t.discount ? `<div class="sum-row"><span class="muted">Discount (${esc(t.promoCode)})</span><span style="color:var(--ok)">− ${money(t.discount)}</span></div>` : ''}
    <div class="sum-row"><span class="muted">Delivery</span><span>${t.shipping ? money(t.shipping) : 'Free'}</span></div>
    <div class="sum-row total"><span>Total</span><span>${money(t.total)}</span></div>
    <p class="hint center mt-16">${ICON.shield} Demo checkout — no real payment is taken.</p>
    <a class="btn btn-ghost btn-block btn-sm mt-16" href="cart.html">Edit cart</a>`;
}

/* ---------- payment method switching ---------- */

function bindPayment() {
  $$('.pay-option').forEach(opt => {
    opt.addEventListener('click', () => {
      $$('.pay-option').forEach(o => o.classList.remove('on'));
      opt.classList.add('on');
      const v = $('input', opt).value;
      $('#card-form').classList.toggle('hide', v !== 'card');
      $('#wallet-form').classList.toggle('hide', v !== 'wallet');
      $('#bank-form').classList.toggle('hide', v !== 'bank');
      $('#cod-form').classList.toggle('hide', v !== 'cod');
      $('#place-order').textContent = v === 'cod' ? 'Place order (cash on delivery)' : 'Pay & place order';
    });
  });
}

const payMethod = () => ($('input[name="pay"]:checked') || {}).value || 'card';

/* ---------- input formatting ---------- */

function bindFormatting() {
  const card = $('#c-card');
  card.addEventListener('input', () => {
    const v = card.value.replace(/\D/g, '').slice(0, 19);
    card.value = v.replace(/(.{4})/g, '$1 ').trim();
  });
  const exp = $('#c-exp');
  exp.addEventListener('input', () => {
    let v = exp.value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
    exp.value = v;
  });
  $('#c-cvv').addEventListener('input', e => e.target.value = e.target.value.replace(/\D/g, ''));
  $('#c-phone').addEventListener('input', e => e.target.value = e.target.value.replace(/[^\d+\s-]/g, ''));

  $$('input, select, textarea').forEach(el =>
    el.addEventListener('input', () => el.closest('.field') && el.closest('.field').classList.remove('invalid')));
}

/* ---------- validation ---------- */

function fail(id) {
  const el = $(id);
  const f = el.closest('.field');
  if (f) f.classList.add('invalid');
  return el;
}

function luhn(num) {
  const d = num.replace(/\D/g, '');
  if (d.length < 13) return false;
  let sum = 0, alt = false;
  for (let i = d.length - 1; i >= 0; i--) {
    let n = +d[i];
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n; alt = !alt;
  }
  return sum % 10 === 0;
}

function validExpiry(v) {
  const m = /^(\d{2})\/(\d{2})$/.exec(v);
  if (!m) return false;
  const mm = +m[1], yy = 2000 + +m[2];
  if (mm < 1 || mm > 12) return false;
  const now = new Date();
  const end = new Date(yy, mm, 0, 23, 59, 59);
  return end >= now;
}

function validate() {
  $$('.field').forEach(f => f.classList.remove('invalid'));
  const bad = [];

  if ($('#c-name').value.trim().length < 3) bad.push(fail('#c-name'));
  if (!/^(\+92|0)?3\d{2}[\s-]?\d{7}$/.test($('#c-phone').value.replace(/\s|-/g, ''))) bad.push(fail('#c-phone'));
  if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test($('#c-email').value.trim())) bad.push(fail('#c-email'));
  if ($('#c-address').value.trim().length < 6) bad.push(fail('#c-address'));
  if (!$('#c-city').value.trim()) bad.push(fail('#c-city'));
  if (!$('#c-province').value) bad.push(fail('#c-province'));

  const m = payMethod();
  if (m === 'card') {
    if (!luhn($('#c-card').value)) bad.push(fail('#c-card'));
    if ($('#c-cardname').value.trim().length < 3) bad.push(fail('#c-cardname'));
    if (!validExpiry($('#c-exp').value)) bad.push(fail('#c-exp'));
    if (!/^\d{3,4}$/.test($('#c-cvv').value)) bad.push(fail('#c-cvv'));
  }
  if (m === 'wallet' && !/^(\+92|0)?3\d{2}[\s-]?\d{7}$/.test($('#c-wallet').value.replace(/\s|-/g, ''))) {
    bad.push(fail('#c-wallet'));
  }

  const terms = $('#c-terms').checked;
  $('#terms-err').style.display = terms ? 'none' : 'block';
  if (!terms) bad.push($('#c-terms'));

  if (bad.length) {
    bad[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    bad[0].focus({ preventScroll: true });
    toast('Please check the highlighted fields', 'err');
    return false;
  }
  return true;
}

/* ---------- submit ---------- */

function saveDetails(c) { localStorage.setItem('gg.customer', JSON.stringify(c)); }

function restoreDetails() {
  // A signed-in customer's account details win over the guest cache
  const user = Auth.currentUser();
  if (user) {
    $('#c-name').value = user.name || '';
    $('#c-email').value = user.email || '';
    $('#c-phone').value = prettyPhone(user.phone || '');
    fillAddress(Auth.defaultAddress());
    return;
  }
  try {
    const c = JSON.parse(localStorage.getItem('gg.customer') || 'null');
    if (!c) return;
    $('#c-name').value = c.name || ''; $('#c-phone').value = c.phone || '';
    $('#c-email').value = c.email || ''; $('#c-address').value = c.address || '';
    $('#c-city').value = c.city || ''; $('#c-province').value = c.province || '';
    $('#c-postal').value = c.postal || '';
  } catch (e) {}
}

/* keep the signed-in customer's address book up to date */
function rememberAddress(customer) {
  if (!Auth.isSignedIn()) return;
  const existing = Auth.addresses();
  const same = existing.some(a =>
    (a.address || '').trim().toLowerCase() === customer.address.toLowerCase() &&
    (a.city || '').trim().toLowerCase() === customer.city.toLowerCase());
  if (same) return;
  Auth.saveAddress({
    label: existing.length ? 'Address ' + (existing.length + 1) : 'Home',
    address: customer.address, city: customer.city, province: customer.province,
    postal: customer.postal, phone: customer.phone,
    isDefault: !existing.length
  });
}

function submit(e) {
  e.preventDefault();
  if (!validate()) return;

  const btn = $('#place-order');
  btn.disabled = true;
  btn.textContent = 'Processing payment…';

  const customer = {
    name: $('#c-name').value.trim(), phone: $('#c-phone').value.trim(), email: $('#c-email').value.trim(),
    address: $('#c-address').value.trim(), city: $('#c-city').value.trim(),
    province: $('#c-province').value, postal: $('#c-postal').value.trim(), notes: $('#c-notes').value.trim()
  };
  saveDetails(customer);
  rememberAddress(customer);

  const m = payMethod();
  const labels = { card: 'Credit / Debit card', wallet: 'Easypaisa / JazzCash', bank: 'Bank transfer', cod: 'Cash on delivery' };
  const payment = {
    method: m, label: labels[m],
    last4: m === 'card' ? $('#c-card').value.replace(/\D/g, '').slice(-4) : '',
    wallet: m === 'wallet' ? $('#c-wallet').value.trim() : '',
    status: m === 'cod' ? 'Unpaid — collect on delivery' : (m === 'bank' ? 'Awaiting transfer' : 'Paid (demo)')
  };

  setTimeout(() => {
    const order = placeOrder(customer, payment);
    if (!order) { btn.disabled = false; btn.textContent = 'Place order'; return toast('Something went wrong', 'err'); }
    history.replaceState({}, '', 'checkout.html?done=1');
    showSuccess(order);
  }, 1100);
}

/* ---------- confirmation ---------- */

function showSuccess(order) {
  window.scrollTo({ top: 0 });
  $('#checkout-main').innerHTML = `
    <div class="steps" style="margin-top:36px">
      <span class="step done"><i>✓</i> Cart</span><span class="step-sep"></span>
      <span class="step done"><i>✓</i> Details &amp; payment</span><span class="step-sep"></span>
      <span class="step on"><i>3</i> Confirmation</span>
    </div>

    <div class="success-panel">
      <div class="success-mark">${ICON.check}</div>
      <p class="eyebrow">Order confirmed</p>
      <h1>Thank you, ${esc(order.customer.name.split(' ')[0])}</h1>
      <div class="rule-ornament"><span>◆</span></div>
      <p class="muted">Your order <b>#${esc(order.id)}</b> has been received. We have sent a confirmation to ${esc(order.customer.email)} and will call before dispatch.</p>

      <div class="order-box">
        <h3 style="margin-bottom:14px">Order summary</h3>
        ${order.items.map(i => `<div class="flex between" style="padding:8px 0;border-bottom:1px solid var(--line-soft)">
          <span style="font-size:.9rem">${esc(i.name)}<span class="muted"> · ${esc(i.color || '—')} · ${esc(i.size)} · ×${i.qty}</span></span>
          <b style="font-size:.9rem;white-space:nowrap">${money(i.lineTotal)}</b></div>`).join('')}
        <div class="sum-row" style="margin-top:10px"><span class="muted">Subtotal</span><span>${money(order.totals.subtotal)}</span></div>
        ${order.totals.discount ? `<div class="sum-row"><span class="muted">Discount</span><span style="color:var(--ok)">− ${money(order.totals.discount)}</span></div>` : ''}
        <div class="sum-row"><span class="muted">Delivery</span><span>${order.totals.shipping ? money(order.totals.shipping) : 'Free'}</span></div>
        <div class="sum-row total"><span>Total</span><span>${money(order.totals.total)}</span></div>

        <table class="spec-table mt-24">
          <tr><td>Payment</td><td>${esc(order.payment.label)}${order.payment.last4 ? ` ending ${esc(order.payment.last4)}` : ''}</td></tr>
          <tr><td>Status</td><td>${esc(order.payment.status)}</td></tr>
          <tr><td>Deliver to</td><td>${esc(order.customer.address)}, ${esc(order.customer.city)}, ${esc(order.customer.province)}</td></tr>
          <tr><td>Phone</td><td>${esc(order.customer.phone)}</td></tr>
          <tr><td>Estimated</td><td>${estimate(order.customer.city)}</td></tr>
          ${order.customer.notes ? `<tr><td>Notes</td><td>${esc(order.customer.notes)}</td></tr>` : ''}
        </table>
      </div>

      <div class="flex gap-12 mt-32" style="justify-content:center;flex-wrap:wrap">
        ${Auth.isSignedIn()
          ? `<a class="btn btn-gold" href="account.html">Track it in my account</a>`
          : `<a class="btn btn-gold" href="account.html?view=signup">Create an account to track it</a>`}
        <a class="btn" href="index.html#shop">Continue shopping</a>
        <a class="btn btn-ghost" href="https://wa.me/${SITE.phoneRaw.replace('+', '')}?text=${encodeURIComponent('Hi, I just placed order #' + order.id)}" target="_blank" rel="noopener">Message us on WhatsApp</a>
        <button class="btn btn-ghost" onclick="window.print()">Print receipt</button>
      </div>
    </div>`;
}

function estimate(city) {
  const fast = ['rawalpindi', 'islamabad'];
  const days = fast.includes((city || '').toLowerCase()) ? 2 : 5;
  const d = new Date(Date.now() + days * 864e5);
  return `by ${d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}`;
}
