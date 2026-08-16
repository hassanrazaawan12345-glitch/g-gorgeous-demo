/* ==========================================================================
   G.GORGEOUS — catalogue data layer

   Loads the catalogue from Supabase once at page start into an in-memory
   cache, then hands it to the rest of the site in the shape it already
   expects. Keeping the existing synchronous shape means the shop, product
   pages, cart and admin did not have to be rewritten around promises.

   If the database is unreachable the site falls back to the bundled
   catalogue, so a visitor still sees products rather than an empty shop.
   ========================================================================== */

const DBCache = {
  products: null,
  reviews: null,
  loaded: false,
  source: 'none',      // 'supabase' | 'local'
  error: null
};

/* Map a database row (with its nested relations) onto the product shape
   the rest of the site was written against. */
function rowToProduct(r) {
  const sizes = (r.product_sizes || [])
    .map(s => ({ size: s.size, qty: s.qty }))
    .sort((a, b) => {
      const na = parseInt(a.size), nb = parseInt(b.size);
      if (!isNaN(na) && !isNaN(nb)) return na - nb;
      const order = ['S', 'M', 'L', 'XL', 'XXL', 'One Size'];
      return order.indexOf(a.size) - order.indexOf(b.size);
    });

  const media = (r.product_media || []).slice().sort((a, b) => (a.sort || 0) - (b.sort || 0));

  return {
    id: r.id,
    sku: r.sku,
    name: r.name,
    category: r.category_slug,
    description: r.description || '',
    details: r.details || '',
    price: Number(r.price),
    salePrice: r.sale_price === null ? null : Number(r.sale_price),
    fabric: r.fabric, fit: r.fit, lining: r.lining, care: r.care, origin: r.origin,
    featured: !!r.featured,
    active: r.active !== false,
    colors: (r.product_colors || [])
      .slice().sort((a, b) => (a.sort || 0) - (b.sort || 0))
      .map(c => ({ name: c.name, hex: c.hex })),
    sizes,
    images: media.filter(m => m.kind === 'image').map(m => m.url),
    video: (media.find(m => m.kind === 'video') || {}).url || '',
    createdAt: r.created_at,
    artOpts: { weave: 'twill' }
  };
}

function reviewRowToReview(r) {
  return {
    id: r.id,
    productId: r.product_id,
    name: r.name,
    rating: r.rating,
    title: r.title || '',
    body: r.body,
    date: (r.created_at || '').slice(0, 10)
  };
}

const PRODUCT_SELECT =
  'id,sku,name,category_slug,description,details,price,sale_price,' +
  'fabric,fit,lining,care,origin,featured,active,created_at,' +
  'product_colors(name,hex,sort),product_sizes(size,qty),product_media(url,kind,sort)';

/* Called once per page before anything renders. */
async function loadCatalogue() {
  if (DBCache.loaded) return DBCache;

  // the session must be known before any page renders its header
  await bootAuth();

  if (!sb) {
    DBCache.products = localProducts();
    DBCache.reviews = localReviews();
    DBCache.source = 'local';
    DBCache.loaded = true;
    return DBCache;
  }

  try {
    const [prodRes, revRes] = await Promise.all([
      sb.from('products').select(PRODUCT_SELECT).eq('active', true).order('created_at', { ascending: true }),
      sb.from('reviews').select('id,product_id,name,rating,title,body,created_at').eq('approved', true)
    ]);

    if (prodRes.error) throw prodRes.error;
    if (revRes.error) throw revRes.error;
    if (!prodRes.data || !prodRes.data.length) throw new Error('The catalogue came back empty');

    DBCache.products = prodRes.data.map(rowToProduct);
    DBCache.reviews = (revRes.data || []).map(reviewRowToReview);
    DBCache.source = 'supabase';
  } catch (e) {
    // A visitor should still see a shop even if the database is down.
    console.error('Catalogue load failed, using the bundled copy:', e.message || e);
    DBCache.products = localProducts();
    DBCache.reviews = localReviews();
    DBCache.source = 'local';
    DBCache.error = e.message || String(e);
  }

  DBCache.loaded = true;
  return DBCache;
}

/* ---------- what the rest of the site calls ---------- */

function catalogue()        { return DBCache.products || []; }
function catalogueReviews() { return DBCache.reviews || []; }
const  isLiveData = ()      => DBCache.source === 'supabase';

/* Boot helper: load the catalogue, then run the page's render function.
   Shows a small notice if the site had to fall back to bundled data. */
async function bootPage(render) {
  await loadCatalogue();
  render();
  if (DBCache.source === 'local' && sb) {
    console.warn('Running on the bundled catalogue — database unreachable.');
  }
}
