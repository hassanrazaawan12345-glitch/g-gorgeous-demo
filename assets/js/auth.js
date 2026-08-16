/* ==========================================================================
   G.GORGEOUS — accounts, backed by Supabase Auth

   Real accounts: they work on every device, and password-reset emails
   actually arrive. Passwords are hashed server-side by Supabase and never
   touch this code.

   Sign-in is by EMAIL only. Supabase phone sign-in needs a paid SMS
   provider (Twilio), so the mobile number is kept on the profile for
   delivery and contact rather than as a login method. Wiring SMS later is
   a provider setting plus a small change in signIn().

   The session is cached in memory so the rest of the site can keep asking
   Auth.currentUser() synchronously. Auth.init() must be awaited once per
   page before anything reads it — bootAuth() below does that.
   ========================================================================== */

const AuthState = {
  session: null,
  profile: null,     // row from public.profiles
  addresses: [],
  ready: false
};

function mapUser() {
  const s = AuthState.session;
  if (!s || !s.user) return null;
  const p = AuthState.profile || {};
  return {
    id: s.user.id,
    email: s.user.email,
    name: p.full_name || s.user.user_metadata?.full_name || '',
    phone: p.phone || s.user.user_metadata?.phone || '',
    role: p.role || 'customer',
    emailVerified: !!s.user.email_confirmed_at,
    phoneVerified: false,
    createdAt: s.user.created_at,
    lastLogin: s.user.last_sign_in_at,
    addresses: AuthState.addresses
  };
}

async function loadProfile() {
  if (!AuthState.session) { AuthState.profile = null; AuthState.addresses = []; return; }
  const uid = AuthState.session.user.id;
  const [prof, addr] = await Promise.all([
    sb.from('profiles').select('id,full_name,phone,role,created_at').eq('id', uid).maybeSingle(),
    sb.from('addresses').select('*').eq('user_id', uid).order('created_at')
  ]);
  AuthState.profile = prof.data || null;
  AuthState.addresses = addr.data || [];
}

/* Turn Supabase's terse errors into something a customer can act on. */
function friendlyAuthError(e) {
  const m = (e && (e.message || e.error_description) || '').toLowerCase();
  if (m.includes('invalid login credentials')) return 'That email or password is not correct';
  if (m.includes('email not confirmed')) return 'Please confirm your email first — check your inbox for the link';
  if (m.includes('user already registered') || m.includes('already been registered')) return 'An account already uses that email address';
  if (m.includes('password should be at least')) return 'Password needs at least 8 characters';
  if (m.includes('rate limit') || m.includes('too many')) return 'Too many attempts — please wait a minute and try again';
  if (m.includes('unable to validate email')) return 'Please enter a valid email address';
  if (m.includes('failed to fetch') || m.includes('network')) return 'Cannot reach the server — check your internet connection';
  return (e && e.message) || 'Something went wrong, please try again';
}

/* ---------- validation shared with the forms ---------- */

const isEmail = (v) => /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(String(v || '').trim());

function normPhone(v) {
  let d = String(v || '').replace(/[^\d+]/g, '');
  if (d.startsWith('+')) d = d.slice(1);
  if (d.startsWith('0')) d = '92' + d.slice(1);
  if (d.startsWith('3')) d = '92' + d;
  return d;
}
function prettyPhone(v) {
  const d = normPhone(v);
  return d.length === 12 ? '0' + d.slice(2, 5) + ' ' + d.slice(5) : (v || '');
}
const isPhone = (v) => /^923\d{9}$/.test(normPhone(v));

function passwordProblems(pw) {
  const out = [];
  if (!pw || pw.length < 8) out.push('at least 8 characters');
  if (!/[A-Za-z]/.test(pw || '')) out.push('a letter');
  if (!/\d/.test(pw || '')) out.push('a number');
  return out;
}

function passwordStrength(pw) {
  if (!pw) return { score: 0, label: '' };
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const labels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'];
  return { score: Math.min(5, s), label: labels[Math.min(5, s)] };
}

/* ==========================================================================
   Public API
   ========================================================================== */

const Auth = {

  isDemo: false,
  available: () => !!sb,

  async init() {
    if (AuthState.ready || !sb) { AuthState.ready = true; return; }
    const { data } = await sb.auth.getSession();
    AuthState.session = data.session || null;
    await loadProfile();
    AuthState.ready = true;

    sb.auth.onAuthStateChange(async (event, session) => {
      AuthState.session = session || null;
      await loadProfile();
      document.dispatchEvent(new CustomEvent('gg:auth', { detail: { event } }));
    });
  },

  currentUser() { return mapUser(); },
  isSignedIn() { return !!AuthState.session; },
  isAdmin() { return (AuthState.profile || {}).role === 'admin'; },

  /* Supabase puts a recovery token in the URL fragment when someone
     follows a reset link. detectSessionInUrl consumes it, so we look for
     the marker to know the page should show "set a new password". */
  isRecovery() {
    return /(^|[#&])type=recovery/.test(location.hash) ||
           sessionStorage.getItem('gg.recovery') === '1';
  },
  markRecovery() { sessionStorage.setItem('gg.recovery', '1'); },
  clearRecovery() { sessionStorage.removeItem('gg.recovery'); },

  async signUp({ name, email, phone, password }) {
    name = String(name || '').trim();
    const em = String(email || '').trim().toLowerCase();
    const ph = normPhone(phone);

    if (name.length < 3) throw new Error('Please enter your full name');
    if (!isEmail(em)) throw new Error('Please enter a valid email address');
    if (!isPhone(ph)) throw new Error('Please enter a valid Pakistani mobile number');
    const issues = passwordProblems(password);
    if (issues.length) throw new Error('Password needs ' + issues.join(', '));

    const { data, error } = await sb.auth.signUp({
      email: em,
      password,
      options: {
        data: { full_name: name, phone: ph },
        emailRedirectTo: location.origin + '/account.html'
      }
    });
    if (error) throw new Error(friendlyAuthError(error));

    // With email confirmation on, there is no session until they confirm.
    const needsConfirmation = !data.session;
    if (data.session) {
      AuthState.session = data.session;
      await loadProfile();
      document.dispatchEvent(new CustomEvent('gg:auth'));
    }
    return { needsConfirmation, email: em };
  },

  async signIn({ identifier, password }) {
    const em = String(identifier || '').trim().toLowerCase();
    if (!isEmail(em)) {
      throw new Error(isPhone(em)
        ? 'Please sign in with your email address — mobile sign-in is not enabled yet'
        : 'Please enter a valid email address');
    }
    const { data, error } = await sb.auth.signInWithPassword({ email: em, password });
    if (error) throw new Error(friendlyAuthError(error));
    AuthState.session = data.session;
    await loadProfile();
    document.dispatchEvent(new CustomEvent('gg:auth'));
    return mapUser();
  },

  async signOut() {
    await sb.auth.signOut();
    AuthState.session = null;
    AuthState.profile = null;
    AuthState.addresses = [];
    this.clearRecovery();
    document.dispatchEvent(new CustomEvent('gg:auth'));
  },

  async updateProfile(patch) {
    if (!AuthState.session) throw new Error('You are not signed in');
    const uid = AuthState.session.user.id;
    const row = {};

    if (patch.name !== undefined) {
      if (String(patch.name).trim().length < 3) throw new Error('Please enter your full name');
      row.full_name = String(patch.name).trim();
    }
    if (patch.phone !== undefined) {
      if (!isPhone(patch.phone)) throw new Error('Please enter a valid Pakistani mobile number');
      row.phone = normPhone(patch.phone);
    }
    if (Object.keys(row).length) {
      const { error } = await sb.from('profiles').update(row).eq('id', uid);
      if (error) throw new Error(error.message);
    }
    if (patch.email !== undefined && patch.email.trim().toLowerCase() !== AuthState.session.user.email) {
      if (!isEmail(patch.email)) throw new Error('Please enter a valid email address');
      const { error } = await sb.auth.updateUser({ email: patch.email.trim().toLowerCase() });
      if (error) throw new Error(friendlyAuthError(error));
      await loadProfile();
      document.dispatchEvent(new CustomEvent('gg:auth'));
      return { emailChangePending: true };
    }
    await loadProfile();
    document.dispatchEvent(new CustomEvent('gg:auth'));
    return {};
  },

  async changePassword(currentPassword, newPassword) {
    if (!AuthState.session) throw new Error('You are not signed in');
    const issues = passwordProblems(newPassword);
    if (issues.length) throw new Error('New password needs ' + issues.join(', '));

    // Supabase does not verify the old password on update, so prove it by
    // re-authenticating first — otherwise a borrowed open laptop is enough
    // to change someone's password.
    const { error: reauth } = await sb.auth.signInWithPassword({
      email: AuthState.session.user.email,
      password: currentPassword
    });
    if (reauth) throw new Error('Your current password is not correct');

    const { error } = await sb.auth.updateUser({ password: newPassword });
    if (error) throw new Error(friendlyAuthError(error));
    return true;
  },

  /* ---------- password recovery: a real email ---------- */

  async requestReset(email) {
    const em = String(email || '').trim().toLowerCase();
    if (!isEmail(em)) throw new Error('Please enter a valid email address');

    const { error } = await sb.auth.resetPasswordForEmail(em, {
      redirectTo: location.origin + '/account.html'
    });
    // Never reveal whether the address is registered.
    if (error && !/rate limit|too many/i.test(error.message || '')) {
      console.warn('reset error', error.message);
    }
    if (error && /rate limit|too many/i.test(error.message || '')) {
      throw new Error('Too many requests — please wait a minute and try again');
    }
    return { sent: true, email: em };
  },

  async completeRecovery(newPassword) {
    const issues = passwordProblems(newPassword);
    if (issues.length) throw new Error('Password needs ' + issues.join(', '));
    const { error } = await sb.auth.updateUser({ password: newPassword });
    if (error) throw new Error(friendlyAuthError(error));
    this.clearRecovery();
    await loadProfile();
    document.dispatchEvent(new CustomEvent('gg:auth'));
    return mapUser();
  },

  /* ---------- address book ---------- */

  addresses() { return AuthState.addresses || []; },
  defaultAddress() {
    const l = this.addresses();
    return l.find(a => a.is_default) || l[0] || null;
  },

  async saveAddress(addr) {
    if (!AuthState.session) throw new Error('You are not signed in');
    const uid = AuthState.session.user.id;
    const row = {
      user_id: uid,
      label: addr.label || 'Address',
      address: addr.address, city: addr.city, province: addr.province,
      postal: addr.postal || null, phone: normPhone(addr.phone) || null,
      is_default: !!addr.isDefault
    };
    if (addr.id) {
      const { error } = await sb.from('addresses').update(row).eq('id', addr.id);
      if (error) throw new Error(error.message);
    } else {
      if (!this.addresses().length) row.is_default = true;
      const { error } = await sb.from('addresses').insert(row);
      if (error) throw new Error(error.message);
    }
    if (row.is_default) {
      await sb.from('addresses').update({ is_default: false })
        .eq('user_id', uid).neq('id', addr.id || '00000000-0000-0000-0000-000000000000');
      if (addr.id) await sb.from('addresses').update({ is_default: true }).eq('id', addr.id);
    }
    await loadProfile();
    document.dispatchEvent(new CustomEvent('gg:auth'));
    return this.addresses();
  },

  async deleteAddress(id) {
    const { error } = await sb.from('addresses').delete().eq('id', id);
    if (error) throw new Error(error.message);
    const left = this.addresses().filter(a => a.id !== id);
    if (left.length && !left.some(a => a.is_default)) {
      await sb.from('addresses').update({ is_default: true }).eq('id', left[0].id);
    }
    await loadProfile();
    document.dispatchEvent(new CustomEvent('gg:auth'));
  },

  /* ---------- this customer's orders ---------- */

  async myOrders() {
    if (!AuthState.session) return [];
    const { data, error } = await sb
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });
    if (error) { console.error(error); return []; }
    return (data || []).map(orderRowToOrder);
  }
};

/* Map a database order onto the shape the account and admin screens use. */
function orderRowToOrder(o) {
  return {
    id: o.order_no,
    dbId: o.id,
    date: o.created_at,
    status: o.status,
    userId: o.user_id,
    customer: {
      name: o.customer_name, email: o.customer_email, phone: o.customer_phone,
      address: o.address, city: o.city, province: o.province,
      postal: o.postal || '', notes: o.notes || ''
    },
    payment: {
      method: o.payment_method, label: o.payment_method,
      status: o.payment_status, last4: '', wallet: ''
    },
    items: (o.order_items || []).map(i => ({
      productId: i.product_id, name: i.name, sku: i.sku, size: i.size,
      color: i.color, qty: i.qty, unit: Number(i.unit_price), lineTotal: Number(i.line_total)
    })),
    totals: {
      subtotal: Number(o.subtotal), discount: Number(o.discount),
      promoCode: o.promo_code, shipping: Number(o.shipping), total: Number(o.total)
    }
  };
}

/* Every page calls this once, before rendering. */
async function bootAuth() {
  if (sb) await Auth.init();
}
