/* ==========================================================================
   G.GORGEOUS — account screens
   Signed out : sign in · create account · forgot password (3 steps)
   Signed in  : overview · orders · addresses · profile · security
   ========================================================================== */

let view = 'signin';           // signin | signup | forgot
let forgotStep = 1;
let forgot = { identifier: '', channel: 'email', token: '', masked: '', demoCode: '' };
let panel = 'overview';

const nextUrl = () => params().get('next') || '';

document.addEventListener('DOMContentLoaded', async () => {
  await loadCatalogue();
  mountChrome('account');
  if (params().get('view') === 'signup') view = 'signup';
  render();
  document.addEventListener('gg:auth', render);
});

function render() {
  if (Auth.isRecovery() && Auth.isSignedIn()) return renderRecovery();
  Auth.isSignedIn() ? renderDashboard() : renderAuth();
}

/* ==========================================================================
   Signed out
   ========================================================================== */

const DEMO_NOTE = '';

function renderAuth() {
  const m = $('#account-main');
  m.innerHTML = `
    <div class="page-head">
      <p class="eyebrow">${view === 'forgot' ? 'Account recovery' : 'Your account'}</p>
      <h1>${view === 'signup' ? 'Create your account' : view === 'forgot' ? 'Reset your password' : 'Welcome back'}</h1>
      <div class="rule-ornament"><span>◆</span></div>
    </div>
    <div class="auth-wrap" style="padding-bottom:60px">
      ${nextUrl() ? `<div class="signin-banner"><span>Sign in to continue to checkout.</span></div>` : ''}
      <div class="auth-card" id="auth-card"></div>
    </div>`;

  if (view === 'forgot') return renderForgot();

  $('#auth-card').innerHTML = `
    <div class="auth-tabs">
      <button data-v="signin" class="${view === 'signin' ? 'on' : ''}">Sign in</button>
      <button data-v="signup" class="${view === 'signup' ? 'on' : ''}">Create account</button>
    </div>
    ${DEMO_NOTE}
    ${view === 'signin' ? signInForm() : signUpForm()}`;

  $$('[data-v]').forEach(b => b.onclick = () => { view = b.dataset.v; renderAuth(); });
  view === 'signin' ? bindSignIn() : bindSignUp();
}

const pwEye = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
  <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/></svg>`;

function signInForm() {
  return `
    <div class="field">
      <label>Email address</label>
      <input type="text" id="si-id" placeholder="you@example.com" autocomplete="username">
    </div>
    <div class="field pw-field">
      <label>Password</label>
      <input type="password" id="si-pw" placeholder="Your password" autocomplete="current-password">
      <button class="pw-toggle" data-pw="si-pw" type="button" aria-label="Show password">${pwEye}</button>
    </div>
    <div class="flex between items-center wrap-flex gap-12" style="margin-bottom:20px">
      <label class="check" style="font-size:.85rem"><input type="checkbox" id="si-remember" checked><span>Keep me signed in</span></label>
      <button class="link-btn" id="go-forgot" style="color:var(--gold-deep)">Forgot password?</button>
    </div>
    <button class="btn btn-gold btn-block" id="si-go">Sign in</button>
    <p class="auth-alt">New to G.Gorgeous? <button data-v="signup">Create an account</button></p>`;
}

function signUpForm() {
  return `
    <div class="field">
      <label>Full name</label>
      <input type="text" id="su-name" placeholder="Ahmed Khan" autocomplete="name">
    </div>
    <div class="field">
      <label>Email address</label>
      <input type="email" id="su-email" placeholder="you@example.com" autocomplete="email">
    </div>
    <div class="field">
      <label>Mobile number</label>
      <input type="tel" id="su-phone" placeholder="03XX XXXXXXX" autocomplete="tel">
      <p class="hint">Used for delivery updates and password recovery.</p>
    </div>
    <div class="field pw-field">
      <label>Password</label>
      <input type="password" id="su-pw" placeholder="At least 8 characters" autocomplete="new-password">
      <button class="pw-toggle" data-pw="su-pw" type="button" aria-label="Show password">${pwEye}</button>
      <div class="pw-meter" id="su-meter"><i></i><i></i><i></i><i></i><i></i></div>
      <div class="pw-hint"><span id="su-strength">Use 8+ characters with a letter and a number</span></div>
    </div>
    <div class="field pw-field">
      <label>Confirm password</label>
      <input type="password" id="su-pw2" placeholder="Re-enter your password" autocomplete="new-password">
      <button class="pw-toggle" data-pw="su-pw2" type="button" aria-label="Show password">${pwEye}</button>
    </div>
    <label class="check" style="margin-bottom:20px;align-items:flex-start">
      <input type="checkbox" id="su-terms" style="margin-top:3px">
      <span style="font-size:.85rem">I agree to the exchange policy and to being contacted about my orders.</span>
    </label>
    <button class="btn btn-gold btn-block" id="su-go">Create account</button>
    <p class="auth-alt">Already have an account? <button data-v="signin">Sign in</button></p>`;
}

function bindPwToggles() {
  $$('.pw-toggle').forEach(b => b.onclick = () => {
    const i = $('#' + b.dataset.pw);
    i.type = i.type === 'password' ? 'text' : 'password';
    b.style.color = i.type === 'text' ? 'var(--gold-deep)' : '';
  });
}

function busy(btn, on, label) {
  btn.disabled = on;
  if (on) { btn.dataset.label = btn.textContent; btn.textContent = label || 'Please wait…'; }
  else btn.textContent = btn.dataset.label;
}

function bindSignIn() {
  bindPwToggles();
  $('#go-forgot').onclick = () => { view = 'forgot'; forgotStep = 1; renderAuth(); };
  const go = async () => {
    const btn = $('#si-go');
    busy(btn, true, 'Signing in…');
    try {
      const user = await Auth.signIn({
        identifier: $('#si-id').value.trim(),
        password: $('#si-pw').value,
        remember: $('#si-remember').checked
      });
      toast(`Welcome back, ${user.name.split(' ')[0]}`);
      setTimeout(() => { location.href = nextUrl() || 'account.html'; }, 400);
    } catch (e) {
      busy(btn, false);
      toast(e.message, 'err');
    }
  };
  $('#si-go').onclick = go;
  $('#si-pw').onkeydown = e => { if (e.key === 'Enter') go(); };
  $('#si-id').onkeydown = e => { if (e.key === 'Enter') $('#si-pw').focus(); };
}

function bindSignUp() {
  bindPwToggles();
  const pw = $('#su-pw');
  pw.oninput = () => {
    const s = passwordStrength(pw.value);
    $('#su-meter').className = 'pw-meter s' + s.score;
    $('#su-strength').textContent = pw.value ? s.label : 'Use 8+ characters with a letter and a number';
  };
  $('#su-go').onclick = async () => {
    const btn = $('#su-go');
    if (pw.value !== $('#su-pw2').value) return toast('Passwords do not match', 'err');
    if (!$('#su-terms').checked) return toast('Please accept the terms to continue', 'err');
    busy(btn, true, 'Creating account…');
    try {
      const res = await Auth.signUp({
        name: $('#su-name').value,
        email: $('#su-email').value,
        phone: $('#su-phone').value,
        password: pw.value
      });
      if (res.needsConfirmation) return showCheckEmail(res.email);
      toast('Account created');
      setTimeout(() => { location.href = nextUrl() || 'account.html'; }, 500);
    } catch (e) {
      busy(btn, false);
      toast(e.message, 'err');
    }
  };
}

/* ---------- password recovery ----------
   Supabase emails a one-time link. Following it signs the person in with a
   recovery session, and the page then asks for a new password. There is no
   code to type, and the link is single-use and time limited. */

function renderForgot() {
  $('#auth-card').innerHTML = `
    <h3 style="margin-bottom:4px">Reset your password</h3>
    <p class="muted" style="font-size:.88rem;margin-top:0">
      Enter the email you signed up with and we will send you a reset link.</p>
    <div class="field">
      <label>Email address</label>
      <input type="email" id="fg-id" placeholder="you@example.com" autocomplete="email">
    </div>
    <button class="btn btn-gold btn-block" id="fg-send">Send reset link</button>
    <p class="auth-alt"><button id="back-signin">← Back to sign in</button></p>`;

  $('#back-signin').onclick = () => { view = 'signin'; renderAuth(); };
  const go = async () => {
    const btn = $('#fg-send');
    const em = $('#fg-id').value.trim();
    if (!isEmail(em)) return toast('Please enter a valid email address', 'err');
    busy(btn, true, 'Sending…');
    try {
      await Auth.requestReset(em);
      showResetSent(em);
    } catch (e) { busy(btn, false); toast(e.message, 'err'); }
  };
  $('#fg-send').onclick = go;
  $('#fg-id').onkeydown = e => { if (e.key === 'Enter') go(); };
}

function noticePanel(title, lines, email) {
  $('#account-main').innerHTML = `
    <div class="page-head">
      <p class="eyebrow">Check your inbox</p>
      <h1>${esc(title)}</h1>
      <div class="rule-ornament"><span>◆</span></div>
    </div>
    <div class="auth-wrap" style="padding-bottom:60px">
      <div class="auth-card center">
        <div class="success-mark" style="margin-bottom:18px">${ICON.chat}</div>
        <p class="muted">${lines}</p>
        <p class="hint mt-16">Sent to <b>${esc(email)}</b>. It can take a minute — check spam if it has not arrived.</p>
        <a class="btn btn-ghost btn-block mt-24" href="account.html">Back to sign in</a>
      </div>
    </div>`;
}

function showResetSent(email) {
  noticePanel('Reset link sent',
    'Open the email and follow the link. It will bring you back here to choose a new password.', email);
}

function showCheckEmail(email) {
  noticePanel('Confirm your email',
    'We have sent a confirmation link. Click it to activate your account, then sign in.', email);
}

/* Shown when the person arrives back from the reset email. */
function renderRecovery() {
  Auth.markRecovery();
  $('#account-main').innerHTML = `
    <div class="page-head">
      <p class="eyebrow">Account recovery</p>
      <h1>Choose a new password</h1>
      <div class="rule-ornament"><span>◆</span></div>
    </div>
    <div class="auth-wrap" style="padding-bottom:60px">
      <div class="auth-card">
        <div class="field pw-field">
          <label>New password</label>
          <input type="password" id="np" placeholder="At least 8 characters" autocomplete="new-password">
          <button class="pw-toggle" data-pw="np" type="button">${pwEye}</button>
          <div class="pw-meter" id="np-meter"><i></i><i></i><i></i><i></i><i></i></div>
          <div class="pw-hint"><span id="np-strength">Use 8+ characters with a letter and a number</span></div>
        </div>
        <div class="field pw-field">
          <label>Confirm new password</label>
          <input type="password" id="np2" placeholder="Re-enter your password" autocomplete="new-password">
          <button class="pw-toggle" data-pw="np2" type="button">${pwEye}</button>
        </div>
        <button class="btn btn-gold btn-block" id="np-go">Update password</button>
        <p class="auth-alt"><button id="np-cancel">Skip and go to my account</button></p>
      </div>
    </div>`;

  $('#np-cancel').onclick = () => { Auth.clearRecovery(); render(); };

  bindPwToggles();
  const np = $('#np');
  np.oninput = () => {
    const s = passwordStrength(np.value);
    $('#np-meter').className = 'pw-meter s' + s.score;
    $('#np-strength').textContent = np.value ? s.label : 'Use 8+ characters with a letter and a number';
  };
  $('#np-go').onclick = async () => {
    if (np.value !== $('#np2').value) return toast('Passwords do not match', 'err');
    const btn = $('#np-go');
    busy(btn, true, 'Updating…');
    try {
      await Auth.completeRecovery(np.value);
      history.replaceState({}, '', 'account.html');
      toast('Password updated — you are signed in');
      render();
    } catch (e) { busy(btn, false); toast(e.message, 'err'); }
  };
}

/* ==========================================================================
   Signed in
   ========================================================================== */

const ACCT_NAV = [
  ['overview', 'Overview', 'grid'],
  ['orders', 'My Orders', 'box'],
  ['addresses', 'Addresses', 'pin'],
  ['profile', 'Profile', 'user'],
  ['security', 'Security', 'shield']
];

async function renderDashboard() {
  const u = Auth.currentUser();
  const orders = await Auth.myOrders();

  $('#account-main').innerHTML = `
    <div class="page-head">
      <p class="eyebrow">Your account</p>
      <h1>Assalam o Alaikum, ${esc(u.name.split(' ')[0])}</h1>
      <div class="rule-ornament"><span>◆</span></div>
    </div>

    <div class="acct" style="padding-bottom:60px">
      <aside class="acct-side">
        <div class="acct-me">
          <div class="avatar">${esc(u.name.trim().charAt(0).toUpperCase())}</div>
          <b>${esc(u.name)}</b>
          <span>${esc(u.email)}</span>
        </div>
        <nav class="acct-nav">
          ${ACCT_NAV.map(n => `<a data-p="${n[0]}" class="${panel === n[0] ? 'on' : ''}">${ICON[n[2]] || ''} ${n[1]}</a>`).join('')}
          <a class="danger" id="do-signout">${ICON.logout} Sign out</a>
        </nav>
      </aside>

      <div>
        <div class="acct-panel ${panel === 'overview' ? 'on' : ''}" id="p-overview">${overviewPanel(u, orders)}</div>
        <div class="acct-panel ${panel === 'orders' ? 'on' : ''}" id="p-orders">${ordersPanel(orders)}</div>
        <div class="acct-panel ${panel === 'addresses' ? 'on' : ''}" id="p-addresses">${addressesPanel()}</div>
        <div class="acct-panel ${panel === 'profile' ? 'on' : ''}" id="p-profile">${profilePanel(u)}</div>
        <div class="acct-panel ${panel === 'security' ? 'on' : ''}" id="p-security">${securityPanel(u)}</div>
      </div>
    </div>`;

  $$('[data-p]').forEach(a => a.onclick = () => {
    panel = a.dataset.p;
    $$('.acct-nav a').forEach(x => x.classList.toggle('on', x.dataset.p === panel));
    $$('.acct-panel').forEach(x => x.classList.toggle('on', x.id === 'p-' + panel));
  });

  $('#do-signout').onclick = () => confirmBox('Sign out?', 'You can sign back in at any time.', async () => {
    await Auth.signOut();
    toast('Signed out');
    location.href = 'index.html';
  }, 'Sign out');

  bindOrders();
  bindAddresses();
  bindProfile();
  bindSecurity();
}

function overviewPanel(u, orders) {
  const spent = orders.reduce((n, o) => n + o.totals.total, 0);
  return `
    <div class="acct-stats">
      <div class="acct-stat"><span>Orders</span><b>${orders.length}</b></div>
      <div class="acct-stat"><span>Total spent</span><b style="font-size:1.35rem">${money(spent)}</b></div>
      <div class="acct-stat"><span>Favourites</span><b>${getFavs().length}</b></div>
    </div>

    <div class="panel">
      <div class="panel-head"><h3>Recent orders</h3>
        ${orders.length ? `<button class="btn btn-sm btn-ghost" data-p="orders">View all</button>` : ''}</div>
      <div class="panel-body">
        ${orders.length ? orders.slice(0, 3).map(o => `
          <div class="flex between items-center wrap-flex" style="padding:11px 0;border-bottom:1px solid var(--line-soft);gap:12px">
            <div><b>#${esc(o.id)}</b><br><span class="muted" style="font-size:.78rem">${shortDate(o.date)} · ${o.items.length} item${o.items.length > 1 ? 's' : ''}</span></div>
            <div class="flex items-center gap-12">${statusPill(o.status)}<b>${money(o.totals.total)}</b></div>
          </div>`).join('')
        : `<p class="muted mb-0">No orders yet. <a href="index.html#shop" style="text-decoration:underline">Start shopping</a>.</p>`}
      </div>
    </div>

    <div class="assurances mt-24">
      <div class="assurance">${ICON.truck}<div><b>Delivery</b><span>Flat ${money(SITE.shipFlat)}, free over ${money(SITE.freeShipOver)}. Cash on delivery available.</span></div></div>
      <div class="assurance">${ICON.scissors}<div><b>Free alterations</b><span>Bring any suit to Shop #G77, Malikabad within 14 days.</span></div></div>
    </div>`;
}

function statusPill(s) {
  const map = { 'Pending': 'badge-warn', 'Confirmed': 'badge-new', 'Shipped': 'badge-new', 'Delivered': 'badge-ok', 'Cancelled': 'badge-sale' };
  return `<span class="badge ${map[s] || 'badge-out'}">${esc(s)}</span>`;
}

function ordersPanel(orders) {
  if (!orders.length) {
    return `<div class="empty-state"><h3>No orders yet</h3>
      <p>When you place an order it will appear here with its delivery status.</p>
      <a class="btn btn-sm" href="index.html#shop">Browse the collection</a></div>`;
  }
  return orders.map(o => `
    <div class="order-card" data-order="${o.id}">
      <div class="order-head">
        <div><b>Order #${esc(o.id)}</b><br><span class="muted">${shortDate(o.date)} · ${esc(o.payment.label)}</span></div>
        <div class="flex items-center gap-12">${statusPill(o.status)}<b>${money(o.totals.total)}</b>${ICON.chevR}</div>
      </div>
      <div class="order-body">
        ${o.items.map(i => {
          const p = productById(i.productId);
          return `<div class="order-line">
            ${p ? `<img src="${productCover(p)}" alt="">` : ''}
            <div style="flex:1">
              <b style="font-size:.92rem">${esc(i.name)}</b><br>
              <span class="muted" style="font-size:.8rem">${esc(i.color || '—')} · Size ${esc(i.size)} · Qty ${i.qty}</span>
            </div>
            <b style="font-size:.9rem;white-space:nowrap">${money(i.lineTotal)}</b>
          </div>`;
        }).join('')}
        <div style="max-width:280px;margin-left:auto;margin-top:14px">
          <div class="sum-row"><span class="muted">Subtotal</span><span>${money(o.totals.subtotal)}</span></div>
          ${o.totals.discount ? `<div class="sum-row"><span class="muted">Discount</span><span style="color:var(--ok)">− ${money(o.totals.discount)}</span></div>` : ''}
          <div class="sum-row"><span class="muted">Delivery</span><span>${o.totals.shipping ? money(o.totals.shipping) : 'Free'}</span></div>
          <div class="sum-row total"><span>Total</span><span>${money(o.totals.total)}</span></div>
        </div>
        <table class="spec-table mt-16">
          <tr><td>Deliver to</td><td>${esc(o.customer.address)}, ${esc(o.customer.city)}</td></tr>
          <tr><td>Payment</td><td>${esc(o.payment.status)}</td></tr>
        </table>
        <a class="btn btn-sm btn-ghost mt-16" href="https://wa.me/${SITE.phoneRaw.replace('+', '')}?text=${encodeURIComponent('Hi, about my order #' + o.id)}" target="_blank" rel="noopener">Ask about this order</a>
      </div>
    </div>`).join('');
}

function bindOrders() {
  $$('.order-head').forEach(h => h.onclick = () => h.closest('.order-card').classList.toggle('open'));
}

function addressesPanel() {
  const list = Auth.addresses();
  return `
    <div class="flex between items-center wrap-flex gap-12" style="margin-bottom:18px">
      <h3 style="margin:0">Saved addresses</h3>
      <button class="btn btn-sm btn-gold" id="add-addr">${ICON.plus} Add address</button>
    </div>
    ${list.length ? `<div class="addr-grid">${list.map(a => `
      <div class="addr-card ${a.is_default ? 'default' : ''}">
        ${a.is_default ? '<span class="badge badge-new tag">Default</span>' : ''}
        <b>${esc(a.label || 'Address')}</b>
        <p>${esc(a.address)}<br>${esc(a.city)}, ${esc(a.province)} ${esc(a.postal || '')}<br>${esc(prettyPhone(a.phone || ''))}</p>
        <div class="flex gap-8 wrap-flex">
          <button class="btn btn-sm btn-ghost" data-edit="${a.id}">Edit</button>
          ${a.is_default ? '' : `<button class="btn btn-sm btn-ghost" data-def="${a.id}">Make default</button>`}
          <button class="btn btn-sm btn-danger" data-del="${a.id}">${ICON.trash}</button>
        </div>
      </div>`).join('')}</div>`
    : `<div class="empty-state" style="text-align:left;padding:26px 0">
         <h3>No saved addresses</h3><p>Save an address to check out faster next time.</p></div>`}`;
}

function bindAddresses() {
  const add = $('#add-addr');
  if (add) add.onclick = () => addressModal(null);
  $$('[data-edit]').forEach(b => b.onclick = () => addressModal(Auth.addresses().find(a => a.id === b.dataset.edit)));
  $$('[data-def]').forEach(b => b.onclick = async () => {
    const a = Auth.addresses().find(x => x.id === b.dataset.def);
    try { await Auth.saveAddress({ ...a, isDefault: true }); toast('Default address updated'); renderDashboard(); }
    catch (e) { toast(e.message, 'err'); }
  });
  $$('.addr-card [data-del]').forEach(b => b.onclick = () => confirmBox('Delete address?', 'This address will be removed from your account.', () => {
    Auth.deleteAddress(b.dataset.del)
      .then(() => { toast('Address deleted'); renderDashboard(); })
      .catch(e => toast(e.message, 'err'));
  }));
}

function addressModal(addr) {
  const a = addr || {};
  const u = Auth.currentUser();
  const m = openModal(`<div class="modal-pad">
    <h2>${addr ? 'Edit address' : 'Add an address'}</h2>
    <div class="rule-ornament" style="margin:6px 0 22px"><span>◆</span></div>
    <div class="field"><label>Label</label><input type="text" id="a-label" value="${esc(a.label || 'Home')}" placeholder="Home, Office…"></div>
    <div class="field"><label>Street address *</label><input type="text" id="a-address" value="${esc(a.address || '')}" placeholder="House / flat, street, area"></div>
    <div class="grid-3">
      <div class="field"><label>City *</label><input type="text" id="a-city" value="${esc(a.city || '')}" placeholder="Rawalpindi"></div>
      <div class="field"><label>Province *</label>
        <select id="a-province">
          <option value="">Select…</option>
          ${['Punjab','Sindh','Khyber Pakhtunkhwa','Balochistan','Islamabad Capital Territory','Gilgit-Baltistan','Azad Kashmir']
            .map(p => `<option ${a.province === p ? 'selected' : ''}>${p}</option>`).join('')}
        </select></div>
      <div class="field"><label>Postal code</label><input type="text" id="a-postal" value="${esc(a.postal || '')}" placeholder="46000"></div>
    </div>
    <div class="field"><label>Contact number</label><input type="tel" id="a-phone" value="${esc(prettyPhone(a.phone || u.phone))}" placeholder="03XX XXXXXXX"></div>
    <label class="check" style="margin-bottom:20px"><input type="checkbox" id="a-default" ${a.is_default ? 'checked' : ''}><span>Use as my default delivery address</span></label>
    <div class="flex gap-12">
      <button class="btn btn-ghost" data-cancel>Cancel</button>
      <button class="btn btn-gold" style="flex:1" data-save>Save address</button>
    </div>
  </div>`, 'sm');

  $('[data-cancel]', m).onclick = () => m.close();
  $('[data-save]', m).onclick = () => {
    const addrOut = {
      id: a.id,
      label: $('#a-label', m).value.trim() || 'Address',
      address: $('#a-address', m).value.trim(),
      city: $('#a-city', m).value.trim(),
      province: $('#a-province', m).value,
      postal: $('#a-postal', m).value.trim(),
      phone: $('#a-phone', m).value.trim(),
      isDefault: $('#a-default', m).checked
    };
    if (addrOut.address.length < 6) return toast('Please enter the street address', 'err');
    if (!addrOut.city) return toast('Please enter the city', 'err');
    if (!addrOut.province) return toast('Please choose a province', 'err');
    Auth.saveAddress(addrOut)
      .then(() => { m.close(); toast('Address saved'); renderDashboard(); })
      .catch(e => toast(e.message, 'err'));
  };
}

function profilePanel(u) {
  return `
    <div class="panel">
      <div class="panel-head"><h3>Your details</h3></div>
      <div class="panel-body" style="max-width:520px">
        <div class="field"><label>Full name</label><input type="text" id="pr-name" value="${esc(u.name)}"></div>
        <div class="field"><label>Email address</label><input type="email" id="pr-email" value="${esc(u.email)}"></div>
        <div class="field"><label>Mobile number</label><input type="tel" id="pr-phone" value="${esc(prettyPhone(u.phone))}"></div>
        <button class="btn btn-gold" id="pr-save">Save changes</button>
        <p class="hint mt-16">Member since ${shortDate(u.createdAt)}</p>
      </div>
    </div>`;
}

function bindProfile() {
  const b = $('#pr-save');
  if (!b) return;
  b.onclick = async () => {
    busy(b, true, 'Saving…');
    try {
      await Auth.updateProfile({
        name: $('#pr-name').value,
        email: $('#pr-email').value,
        phone: $('#pr-phone').value
      });
      toast('Profile updated');
      renderDashboard();
    } catch (e) { busy(b, false); toast(e.message, 'err'); }
  };
}

function securityPanel(u) {
  return `
    <div class="panel">
      <div class="panel-head"><h3>Change password</h3></div>
      <div class="panel-body" style="max-width:520px">
        <div class="field pw-field"><label>Current password</label>
          <input type="password" id="se-old" autocomplete="current-password">
          <button class="pw-toggle" data-pw="se-old" type="button">${pwEye}</button></div>
        <div class="field pw-field"><label>New password</label>
          <input type="password" id="se-new" autocomplete="new-password">
          <button class="pw-toggle" data-pw="se-new" type="button">${pwEye}</button>
          <div class="pw-meter" id="se-meter"><i></i><i></i><i></i><i></i><i></i></div>
          <div class="pw-hint"><span id="se-strength">Use 8+ characters with a letter and a number</span></div></div>
        <div class="field pw-field"><label>Confirm new password</label>
          <input type="password" id="se-new2" autocomplete="new-password">
          <button class="pw-toggle" data-pw="se-new2" type="button">${pwEye}</button></div>
        <button class="btn btn-gold" id="se-save">Update password</button>
      </div>
    </div>

    <div class="panel mt-24">
      <div class="panel-head"><h3>Account security</h3></div>
      <div class="panel-body">
        <table class="spec-table">
          <tr><td>Email</td><td>${esc(u.email)} ${u.emailVerified ? '<span class="badge badge-ok">Verified</span>' : '<span class="badge badge-out">Not verified</span>'}</td></tr>
          <tr><td>Mobile</td><td>${esc(prettyPhone(u.phone))} ${u.phoneVerified ? '<span class="badge badge-ok">Verified</span>' : '<span class="badge badge-out">Not verified</span>'}</td></tr>
          <tr><td>Last sign in</td><td>${u.lastLogin ? shortDate(u.lastLogin) : 'This session'}</td></tr>
        </table>
        <div class="demo-note mt-16" style="margin-bottom:0">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round">
            <circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.2v.1"/></svg>
          <div><b>Verification is not active in the demo</b>Email and SMS verification need a server to send the messages.</div>
        </div>
      </div>
    </div>`;
}

function bindSecurity() {
  const b = $('#se-save');
  if (!b) return;
  bindPwToggles();
  const np = $('#se-new');
  np.oninput = () => {
    const s = passwordStrength(np.value);
    $('#se-meter').className = 'pw-meter s' + s.score;
    $('#se-strength').textContent = np.value ? s.label : 'Use 8+ characters with a letter and a number';
  };
  b.onclick = async () => {
    if (np.value !== $('#se-new2').value) return toast('New passwords do not match', 'err');
    busy(b, true, 'Updating…');
    try {
      await Auth.changePassword($('#se-old').value, np.value);
      toast('Password updated');
      renderDashboard();
    } catch (e) { busy(b, false); toast(e.message, 'err'); }
  };
}
