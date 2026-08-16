/* ==========================================================================
   G.GORGEOUS — backend configuration

   The publishable key below is meant to be public. It identifies the
   project; it grants no permissions on its own. What a visitor can
   actually read or write is decided by the Row Level Security policies in
   supabase/migrations/ — a signed-out visitor can read the catalogue and
   nothing else.

   The service_role / secret key must NEVER appear in this file or anywhere
   else the browser can see. It bypasses every policy.
   ========================================================================== */

const SUPABASE_URL = 'https://kqrfreudkcloszuxjogd.supabase.co';
const SUPABASE_KEY = 'sb_publishable_tVTC6H3VpdWn9s6-8h3AbQ_5BoIQWsP';

/* Set false to run the site entirely on browser storage — useful for
   working offline, and the automatic fallback if the database is
   unreachable so the shop still shows its products. */
const USE_SUPABASE = true;

const sb = (typeof supabase !== 'undefined' && USE_SUPABASE)
  ? supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'gg.supabase.session'
      }
    })
  : null;
