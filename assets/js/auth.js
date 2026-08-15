/* ==========================================================================
   G.GORGEOUS — accounts

   ⚠ DEMO AUTHENTICATION ⚠
   Everything below runs in the browser and stores accounts in localStorage.
   That is fine for a client preview but it is NOT real security:
     · anyone can read the stored data with dev tools
     · password hashing here does not protect against a determined attacker
     · reset codes are shown on screen because a static site cannot send
       an email or an SMS — that needs a server

   For production, swap AUTH_BACKEND for a real provider (Firebase Auth,
   Supabase Auth, or your own API). Every screen in this site talks only to
   the Auth.* methods below, so only this one file has to change.
   ========================================================================== */

const AUTH_KEYS = {
  USERS: 'gg.users',
  SESSION: 'gg.session',
  RESETS: 'gg.resets'
};

const AUTH_BACKEND = 'demo';           // 'demo' | 'firebase' | 'supabase' | 'api'
const SESSION_DAYS = 30;
const RESET_CODE_MINUTES = 10;
const MAX_SIGNIN_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 5;

/* ---------- low level ---------- */

const getUsers  = () => read(AUTH_KEYS.USERS, []);
const saveUsers = (u) => write(AUTH_KEYS.USERS, u);

function normEmail(v) { return String(v || '').trim().toLowerCase(); }

/* 03xx xxxxxxx / +923xxxxxxxxx / 923xxxxxxxxx → 923xxxxxxxxx */
function normPhone(v) {
  let d = String(v || '').replace(/[^\d+]/g, '');
  if (d.startsWith('+')) d = d.slice(1);
  if (d.startsWith('0')) d = '92' + d.slice(1);
  if (d.startsWith('3')) d = '92' + d;
  return d;
}
function prettyPhone(v) {
  const d = normPhone(v);
  return d.length === 12 ? '0' + d.slice(2, 5) + ' ' + d.slice(5) : v;
}

const isEmail = (v) => /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(String(v).trim());
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

function randomId(prefix) {
  return prefix + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function randomCode() {
  if (window.crypto && crypto.getRandomValues) {
    const a = new Uint32Array(1);
    crypto.getRandomValues(a);
    return String(a[0] % 1000000).padStart(6, '0');
  }
  return String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
}

/* SHA-256 where available, with a plain fallback so the demo still runs
   in contexts without Web Crypto. Neither is production-grade — a real
   backend must use bcrypt/argon2 server-side. */
async function hashPassword(password, salt) {
  const text = salt + '::' + password;
  if (window.crypto && crypto.subtle) {
    try {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) { /* falls through */ }
  }
  let h = 0;
  for (let i = 0; i < text.length; i++) { h = ((h << 5) - h + text.charCodeAt(i)) | 0; }
  return 'fb' + (h >>> 0).toString(16);
}

/* ---------- session ---------- */

function readSession() {
  const s = read(AUTH_KEYS.SESSION, null);
  if (!s) return null;
  if (s.expires && Date.now() > s.expires) { localStorage.removeItem(AUTH_KEYS.SESSION); return null; }
  return s;
}

function startSession(userId, remember) {
  const days = remember ? SESSION_DAYS : 1;
  write(AUTH_KEYS.SESSION, {
    userId,
    token: randomId('sess'),
    started: Date.now(),
    expires: Date.now() + days * 864e5
  });
  document.dispatchEvent(new CustomEvent('gg:auth'));
}

function publicUser(u) {
  if (!u) return null;
  const { passwordHash, salt, attempts, lockedUntil, ...safe } = u;
  return safe;
}

/* ==========================================================================
   Public API — every screen uses only these
   ========================================================================== */

const Auth = {

  backend: AUTH_BACKEND,
  isDemo: AUTH_BACKEND === 'demo',

  currentUser() {
    const s = readSession();
    if (!s) return null;
    return publicUser(getUsers().find(u => u.id === s.userId));
  },

  isSignedIn() { return !!this.currentUser(); },

  findBy(identifier) {
    const users = getUsers();
    const id = String(identifier || '').trim();
    if (isEmail(id)) return users.find(u => u.email === normEmail(id));
    if (isPhone(id)) return users.find(u => u.phone === normPhone(id));
    return null;
  },

  async signUp({ name, email, phone, password }) {
    name = String(name || '').trim();
    const em = normEmail(email);
    const ph = normPhone(phone);

    if (name.length < 3) throw new Error('Please enter your full name');
    if (!isEmail(em)) throw new Error('Please enter a valid email address');
    if (!isPhone(ph)) throw new Error('Please enter a valid Pakistani mobile number');
    const pwIssues = passwordProblems(password);
    if (pwIssues.length) throw new Error('Password needs ' + pwIssues.join(', '));

    const users = getUsers();
    if (users.some(u => u.email === em)) throw new Error('An account already uses that email address');
    if (users.some(u => u.phone === ph)) throw new Error('An account already uses that mobile number');

    const salt = randomId('s');
    const user = {
      id: randomId('u'),
      name, email: em, phone: ph,
      passwordHash: await hashPassword(password, salt),
      salt,
      addresses: [],
      createdAt: new Date().toISOString(),
      emailVerified: false,
      phoneVerified: false
    };
    users.push(user);
    saveUsers(users);
    startSession(user.id, true);
    return publicUser(user);
  },

  async signIn({ identifier, password, remember }) {
    const users = getUsers();
    const idx = users.findIndex(u =>
      (isEmail(identifier) && u.email === normEmail(identifier)) ||
      (isPhone(identifier) && u.phone === normPhone(identifier)));

    if (idx === -1) throw new Error('No account found with that email or mobile number');
    const user = users[idx];

    if (user.lockedUntil && Date.now() < user.lockedUntil) {
      const mins = Math.ceil((user.lockedUntil - Date.now()) / 60000);
      throw new Error(`Too many attempts. Try again in ${mins} minute${mins > 1 ? 's' : ''}`);
    }

    const hash = await hashPassword(password, user.salt);
    if (hash !== user.passwordHash) {
      user.attempts = (user.attempts || 0) + 1;
      if (user.attempts >= MAX_SIGNIN_ATTEMPTS) {
        user.lockedUntil = Date.now() + LOCKOUT_MINUTES * 60000;
        user.attempts = 0;
        saveUsers(users);
        throw new Error(`Too many attempts. Account locked for ${LOCKOUT_MINUTES} minutes`);
      }
      saveUsers(users);
      const left = MAX_SIGNIN_ATTEMPTS - user.attempts;
      throw new Error(`Incorrect password — ${left} attempt${left > 1 ? 's' : ''} left`);
    }

    user.attempts = 0;
    user.lockedUntil = null;
    user.lastLogin = new Date().toISOString();
    saveUsers(users);
    startSession(user.id, remember);
    return publicUser(user);
  },

  signOut() {
    localStorage.removeItem(AUTH_KEYS.SESSION);
    document.dispatchEvent(new CustomEvent('gg:auth'));
  },

  async updateProfile(patch) {
    const s = readSession();
    if (!s) throw new Error('You are not signed in');
    const users = getUsers();
    const user = users.find(u => u.id === s.userId);
    if (!user) throw new Error('Account not found');

    if (patch.name !== undefined) {
      if (String(patch.name).trim().length < 3) throw new Error('Please enter your full name');
      user.name = String(patch.name).trim();
    }
    if (patch.email !== undefined) {
      const em = normEmail(patch.email);
      if (!isEmail(em)) throw new Error('Please enter a valid email address');
      if (users.some(u => u.email === em && u.id !== user.id)) throw new Error('Another account uses that email');
      if (em !== user.email) user.emailVerified = false;
      user.email = em;
    }
    if (patch.phone !== undefined) {
      const ph = normPhone(patch.phone);
      if (!isPhone(ph)) throw new Error('Please enter a valid Pakistani mobile number');
      if (users.some(u => u.phone === ph && u.id !== user.id)) throw new Error('Another account uses that number');
      if (ph !== user.phone) user.phoneVerified = false;
      user.phone = ph;
    }
    saveUsers(users);
    document.dispatchEvent(new CustomEvent('gg:auth'));
    return publicUser(user);
  },

  async changePassword(currentPassword, newPassword) {
    const s = readSession();
    if (!s) throw new Error('You are not signed in');
    const users = getUsers();
    const user = users.find(u => u.id === s.userId);
    if (!user) throw new Error('Account not found');

    if (await hashPassword(currentPassword, user.salt) !== user.passwordHash) {
      throw new Error('Your current password is not correct');
    }
    const issues = passwordProblems(newPassword);
    if (issues.length) throw new Error('New password needs ' + issues.join(', '));

    user.salt = randomId('s');
    user.passwordHash = await hashPassword(newPassword, user.salt);
    saveUsers(users);
    return true;
  },

  /* ---------- password recovery ---------- */

  /* Step 1 — request a code by email or SMS.
     DEMO: the code is returned so the page can display it. A real backend
     returns nothing and delivers the code out of band. */
  requestReset(identifier) {
    const user = this.findBy(identifier);
    const channel = isEmail(identifier) ? 'email' : 'sms';

    // Always behave the same way whether or not the account exists, so the
    // form cannot be used to discover which emails are registered.
    if (!user) return { channel, sent: true, code: null, unknown: true };

    const resets = read(AUTH_KEYS.RESETS, []).filter(r => r.expires > Date.now());
    const entry = {
      id: randomId('rst'),
      userId: user.id,
      channel,
      destination: channel === 'email' ? user.email : user.phone,
      code: randomCode(),
      expires: Date.now() + RESET_CODE_MINUTES * 60000,
      used: false
    };
    resets.push(entry);
    write(AUTH_KEYS.RESETS, resets);

    return {
      channel,
      sent: true,
      destination: channel === 'email' ? maskEmail(user.email) : maskPhone(user.phone),
      code: this.isDemo ? entry.code : null,
      expiresInMinutes: RESET_CODE_MINUTES
    };
  },

  /* Step 2 — check the code, hand back a short-lived token */
  verifyReset(identifier, code) {
    const user = this.findBy(identifier);
    if (!user) throw new Error('That code is not valid');

    const resets = read(AUTH_KEYS.RESETS, []);
    const entry = resets.find(r => r.userId === user.id && r.code === String(code).trim() &&
      !r.used && r.expires > Date.now());
    if (!entry) throw new Error('That code is not valid or has expired');

    entry.used = true;
    entry.token = randomId('tok');
    entry.tokenExpires = Date.now() + 10 * 60000;
    write(AUTH_KEYS.RESETS, resets);
    return entry.token;
  },

  /* Step 3 — set the new password */
  async resetPassword(token, newPassword) {
    const resets = read(AUTH_KEYS.RESETS, []);
    const entry = resets.find(r => r.token === token && r.tokenExpires > Date.now());
    if (!entry) throw new Error('This reset link has expired — please start again');

    const issues = passwordProblems(newPassword);
    if (issues.length) throw new Error('Password needs ' + issues.join(', '));

    const users = getUsers();
    const user = users.find(u => u.id === entry.userId);
    if (!user) throw new Error('Account not found');

    user.salt = randomId('s');
    user.passwordHash = await hashPassword(newPassword, user.salt);
    user.attempts = 0;
    user.lockedUntil = null;
    saveUsers(users);

    write(AUTH_KEYS.RESETS, resets.filter(r => r.token !== token));
    return publicUser(user);
  },

  /* ---------- address book ---------- */

  addresses() {
    const u = this.currentUser();
    return u ? (u.addresses || []) : [];
  },

  saveAddress(addr) {
    const s = readSession();
    if (!s) throw new Error('You are not signed in');
    const users = getUsers();
    const user = users.find(u => u.id === s.userId);
    user.addresses = user.addresses || [];

    if (addr.id) {
      const i = user.addresses.findIndex(a => a.id === addr.id);
      if (i > -1) user.addresses[i] = { ...user.addresses[i], ...addr };
    } else {
      addr.id = randomId('addr');
      if (!user.addresses.length) addr.isDefault = true;
      user.addresses.push(addr);
    }
    if (addr.isDefault) user.addresses.forEach(a => { a.isDefault = a.id === addr.id; });
    saveUsers(users);
    document.dispatchEvent(new CustomEvent('gg:auth'));
    return user.addresses;
  },

  deleteAddress(id) {
    const s = readSession();
    if (!s) return;
    const users = getUsers();
    const user = users.find(u => u.id === s.userId);
    user.addresses = (user.addresses || []).filter(a => a.id !== id);
    if (user.addresses.length && !user.addresses.some(a => a.isDefault)) user.addresses[0].isDefault = true;
    saveUsers(users);
    document.dispatchEvent(new CustomEvent('gg:auth'));
  },

  defaultAddress() {
    const list = this.addresses();
    return list.find(a => a.isDefault) || list[0] || null;
  },

  /* ---------- orders belonging to the signed-in customer ---------- */

  myOrders() {
    const u = this.currentUser();
    if (!u) return [];
    return getOrders().filter(o =>
      o.userId === u.id ||
      (!o.userId && o.customer && normEmail(o.customer.email) === u.email));
  }
};

function maskEmail(e) {
  const [a, b] = String(e).split('@');
  if (!b) return e;
  const shown = a.slice(0, Math.min(2, a.length));
  return shown + '•'.repeat(Math.max(3, a.length - shown.length)) + '@' + b;
}
function maskPhone(p) {
  const d = normPhone(p);
  return d.length === 12 ? '0' + d.slice(2, 5) + ' •••• ' + d.slice(-3) : p;
}
