/* ==========================================================================
   G.GORGEOUS — demo catalogue
   Photos: freely licensed (CC0 / CC-BY) stock, cropped to 4:5 in
   assets/img/products/. Replace them with the shop's own photos from the
   admin panel — uploaded images override everything here.
   ========================================================================== */

const IMG = 'assets/img/products/';

const C = {
  charcoal: { name: 'Charcoal', hex: '#3a3f47' },
  black:    { name: 'Jet Black', hex: '#16181c' },
  navy:     { name: 'Midnight Navy', hex: '#1e2a44' },
  royal:    { name: 'Royal Blue', hex: '#27488f' },
  storm:    { name: 'Storm Grey', hex: '#6f757e' },
  silver:   { name: 'Silver Grey', hex: '#b3b7bd' },
  beige:    { name: 'Sand Beige', hex: '#c3ac86' },
  brown:    { name: 'Coffee Brown', hex: '#5a4032' },
  maroon:   { name: 'Maroon', hex: '#6d2230' },
  wine:     { name: 'Wine', hex: '#5c1f2c' },
  bottle:   { name: 'Bottle Green', hex: '#22453a' },
  olive:    { name: 'Deep Olive', hex: '#3d4033' },
  white:    { name: 'Optic White', hex: '#f6f4ef' },
  cream:    { name: 'Cream', hex: '#ece2cd' },
  sky:      { name: 'Sky Blue', hex: '#b8cbe0' },
  sage:     { name: 'Sage Green', hex: '#b9c7b4' },
  violet:   { name: 'Violet', hex: '#6b4a9c' },
  champagne:{ name: 'Champagne', hex: '#d9c295' },
  gold:     { name: 'Antique Gold', hex: '#c8a24a' }
};

function stock(sizes, qtys) { return sizes.map((s, i) => ({ size: s, qty: qtys[i] })); }

const SEED_PRODUCTS = [

  /* ---------------- THREE PIECE SUITS ---------------- */
  {
    id: 'p-001', sku: 'GG-3P-101', name: 'Regal Charcoal Three Piece', category: 'three-piece-suits',
    price: 28500, salePrice: 24900, featured: true,
    images: [IMG + '3p-charcoal-1.jpg', IMG + '3p-charcoal-2.jpg', IMG + 'detail-tweed.jpg'],
    description: 'Our signature three piece in a textured charcoal weave — structured shoulder, peak lapel and a matching waistcoat cut for a clean silhouette.',
    details: `Cut from a mid-weight all-season cloth, the Regal is the suit we build most often for barat and reception wear. The half-canvas front holds its shape through a long evening, while the lightly padded shoulder gives width without stiffness.\n\nThe waistcoat is a five-button, straight-hem cut that sits neatly under the coat. Trousers are finished flat-front with an extended tab closure and a hidden comfort waistband.\n\nEvery suit is pressed, checked and packed in a G.Gorgeous garment bag. Free minor alterations at our Malikabad shop within 14 days of purchase.`,
    fabric: 'Textured wool-blend, 260 gsm', fit: 'Slim Regular', care: 'Dry clean only',
    origin: 'Stitched in Rawalpindi', lining: 'Full viscose lining',
    colors: [C.charcoal, C.black, C.olive],
    sizes: stock(SIZE_SETS['three-piece-suits'], [3, 6, 8, 6, 4, 2]),
    artOpts: { accent: '#8d1c2b', shirt: '#f7f5ef', weave: 'twill' }
  },
  {
    id: 'p-002', sku: 'GG-3P-102', name: 'Windowpane Navy Three Piece', category: 'three-piece-suits',
    price: 33500, salePrice: null, featured: true,
    images: [IMG + '3p-check-1.jpg', IMG + '3p-check-2.jpg', IMG + 'detail-buttons.jpg'],
    description: 'A deep navy carrying a soft windowpane check — dressy enough for a nikkah, restrained enough for the office.',
    details: `The check is woven in a tonal thread, so it reads as a solid navy from across a room and reveals its pattern up close. That makes it one of the most versatile three pieces we stitch.\n\nComes with a matching waistcoat and a plain-front trouser. We can add a shawl lapel, contrast piping or a custom lining on request — mention it in the order notes or call the shop.`,
    fabric: 'Windowpane suiting, 280 gsm', fit: 'Slim', care: 'Dry clean only',
    origin: 'Stitched in Rawalpindi', lining: 'Jacquard viscose lining',
    colors: [C.navy, C.storm, C.charcoal],
    sizes: stock(SIZE_SETS['three-piece-suits'], [2, 4, 6, 5, 3, 1]),
    artOpts: { accent: '#c8a24a', shirt: '#ffffff', weave: 'check' }
  },
  {
    id: 'p-003', sku: 'GG-3P-103', name: 'Silver Grey Ceremonial Three Piece', category: 'three-piece-suits',
    price: 31900, salePrice: 27500, featured: true,
    images: [IMG + '3p-silver-1.jpg', IMG + '2p-ivory-1.jpg', IMG + 'detail-tweed.jpg'],
    description: 'A light silver grey built for daytime mehndi and walima functions — worn here with a bow tie and lapel pin.',
    details: `Lighter in both colour and weight, this one is made for daytime events and photographs beautifully in natural light.\n\nThe waistcoat is cut with a shallow V to show more of the shirt and tie. Pairs particularly well with our Cream Oxford and Optic White shirts, and with a champagne or maroon neckpiece.`,
    fabric: 'Lightweight suiting, 240 gsm', fit: 'Regular', care: 'Dry clean only',
    origin: 'Stitched in Rawalpindi', lining: 'Half lining',
    colors: [C.silver, C.beige, C.cream],
    sizes: stock(SIZE_SETS['three-piece-suits'], [2, 3, 5, 4, 2, 1]),
    artOpts: { accent: '#5a4032', shirt: '#ffffff', weave: 'plain' }
  },

  /* ---------------- TWO PIECE SUITS ---------------- */
  {
    id: 'p-004', sku: 'GG-2P-201', name: 'Royal Blue Two Piece', category: 'two-piece-suits',
    price: 23900, salePrice: 20900, featured: true,
    images: [IMG + '2p-royal-1.jpg', IMG + '2p-royal-2.jpg', IMG + 'detail-buttons.jpg'],
    description: 'A confident royal blue with a clean notch lapel — the suit people remember you in.',
    details: `Bright enough to stand out at an evening function, structured enough to wear to work with a white shirt and black tie.\n\nTwo-button front, double vent, and a slightly tapered trouser that breaks cleanly over a formal shoe. Half-lined so it stays wearable through Rawalpindi summers.`,
    fabric: 'Wool-blend suiting, 250 gsm', fit: 'Slim', care: 'Dry clean only',
    origin: 'Stitched in Rawalpindi', lining: 'Half lining',
    colors: [C.royal, C.navy, C.charcoal],
    sizes: stock(SIZE_SETS['two-piece-suits'], [4, 8, 10, 7, 5, 3]),
    artOpts: { accent: '#16181c', shirt: '#ffffff', weave: 'twill' }
  },
  {
    id: 'p-005', sku: 'GG-2P-202', name: 'Jet Black Tuxedo Two Piece', category: 'two-piece-suits',
    price: 27500, salePrice: null, featured: true,
    images: [IMG + '2p-black-1.jpg', IMG + '2p-black-2.jpg', IMG + 'detail-buttons.jpg'],
    description: 'A true black tuxedo with a satin-faced lapel — for nikkah, receptions and black-tie evenings.',
    details: `The satin facing on the lapel catches light exactly the way a tuxedo should, without the whole suit turning shiny in photographs.\n\nWorn with a black bow tie and a white evening shirt as shown, or dressed down with a slim black tie. Trousers carry a satin side stripe that can be left off on request.`,
    fabric: 'Suiting with satin facing, 265 gsm', fit: 'Slim', care: 'Dry clean only',
    origin: 'Stitched in Rawalpindi', lining: 'Full satin lining',
    colors: [C.black, C.navy],
    sizes: stock(SIZE_SETS['two-piece-suits'], [3, 6, 8, 6, 4, 2]),
    artOpts: { accent: '#16181c', shirt: '#ffffff', weave: 'plain' }
  },
  {
    id: 'p-006', sku: 'GG-2P-203', name: 'Midnight Navy Two Piece', category: 'two-piece-suits',
    price: 21500, salePrice: 18900, featured: false,
    images: [IMG + '2p-navy-1.jpg', IMG + '2p-navy-2.jpg', IMG + 'detail-buttons.jpg'],
    description: 'The everyday formal — a deep navy that works for the office, interviews and evening functions alike.',
    details: `If you only own one suit, make it this one. Navy flatters more skin tones than black and reads formal without being severe.\n\nNotch lapel, two-button front, double vent. The trouser is flat-front with a slight taper below the knee, and the jacket is half-lined for warmer months.`,
    fabric: 'Poly-viscose suiting, 245 gsm', fit: 'Slim Regular', care: 'Dry clean only',
    origin: 'Stitched in Rawalpindi', lining: 'Half lining',
    colors: [C.navy, C.charcoal, C.royal],
    sizes: stock(SIZE_SETS['two-piece-suits'], [4, 7, 9, 7, 4, 2]),
    artOpts: { accent: '#8d1c2b', shirt: '#ffffff', weave: 'twill' }
  },
  {
    id: 'p-007', sku: 'GG-2P-204', name: 'Ivory Double-Breasted Two Piece', category: 'two-piece-suits',
    price: 29900, salePrice: null, featured: false,
    images: [IMG + '2p-ivory-1.jpg', IMG + '3p-silver-1.jpg'],
    description: 'A double-breasted ivory coat with a peak lapel — a statement piece for daytime functions.',
    details: `Six-button double-breasted front with a sharp peak lapel. The ivory is warm rather than stark, so it stays flattering under both daylight and warm indoor lighting.\n\nBecause of the colour we recommend the dry-clean-only route and a garment bag between wears. Pairs with a black or charcoal trouser for contrast, or keep the matching ivory trouser for a full look.`,
    fabric: 'Fine ivory suiting, 250 gsm', fit: 'Slim', care: 'Dry clean only',
    origin: 'Stitched in Rawalpindi', lining: 'Full lining',
    colors: [C.white, C.cream, C.silver],
    sizes: stock(SIZE_SETS['two-piece-suits'], [1, 3, 5, 4, 2, 1]),
    artOpts: { accent: '#3a3f47', shirt: '#ffffff', weave: 'plain' }
  },
  {
    id: 'p-008', sku: 'GG-2P-205', name: 'Deep Olive Two Piece', category: 'two-piece-suits',
    price: 22500, salePrice: 19500, featured: false,
    images: [IMG + '2p-olive-1.jpg', IMG + 'detail-tweed.jpg'],
    description: 'A rich olive green with a soft hand — the alternative for men who are done with navy and charcoal.',
    details: `Olive reads warm and unusual without being loud, and it sits beautifully against cream, sand and sky blue shirts.\n\nSoft-construction shoulder, single vent, patch-style hip pockets. This is the most relaxed cut in our suiting range — wear it with a knit tie or no tie at all.`,
    fabric: 'Textured wool blend, 270 gsm', fit: 'Regular', care: 'Dry clean only',
    origin: 'Stitched in Rawalpindi', lining: 'Half lining',
    colors: [C.olive, C.brown, C.charcoal],
    sizes: stock(SIZE_SETS['two-piece-suits'], [2, 4, 6, 4, 3, 1]),
    artOpts: { accent: '#c8a24a', shirt: '#ece2cd', weave: 'check' }
  },

  /* ---------------- DRESS PANTS ---------------- */
  {
    id: 'p-009', sku: 'GG-DP-301', name: 'Charcoal Formal Trouser', category: 'dress-pants',
    price: 4500, salePrice: 3800, featured: true,
    images: [IMG + 'dp-charcoal-1.jpg', IMG + '2p-navy-2.jpg'],
    description: 'Flat-front formal trouser with a clean taper and a hidden comfort waistband.',
    details: `Our best-selling trouser. Flat-front, no pleats, with a gently tapered leg that breaks cleanly over a formal shoe.\n\nThe inner waistband has a grip lining so shirts stay tucked through a full day. Sold unhemmed by default — free hemming at the shop, or tell us your inseam in the order notes and we will finish it before dispatch.`,
    fabric: 'Poly-viscose, 230 gsm', fit: 'Slim taper', care: 'Machine wash cold / dry clean',
    origin: 'Stitched in Rawalpindi', lining: 'Unlined',
    colors: [C.charcoal, C.black, C.navy, C.storm],
    sizes: stock(SIZE_SETS['dress-pants'], [6, 10, 12, 9, 5, 3]),
    artOpts: { weave: 'twill' }
  },
  {
    id: 'p-010', sku: 'GG-DP-302', name: 'Ivory Summer Trouser', category: 'dress-pants',
    price: 4800, salePrice: null, featured: false,
    images: [IMG + 'dp-ivory-1.jpg', IMG + 'dp-ivory-2.jpg'],
    description: 'A crisp off-white trouser for daytime functions and summer smart-casual.',
    details: `Cotton-rich so it breathes, cut and finished like a formal trouser with a clean waistband and welt pockets.\n\nOpaque enough to wear with confidence — we line the seat and front panels. Best worn with a navy polo, a sky blue shirt, or an ivory coat for a full daytime look.`,
    fabric: 'Cotton twill, 250 gsm', fit: 'Slim', care: 'Machine wash cold, warm iron',
    origin: 'Stitched in Rawalpindi', lining: 'Part lined',
    colors: [C.white, C.cream, C.beige],
    sizes: stock(SIZE_SETS['dress-pants'], [4, 8, 9, 6, 3, 1]),
    artOpts: { weave: 'plain' }
  },
  {
    id: 'p-011', sku: 'GG-DP-303', name: 'Sand Chino-Formal Trouser', category: 'dress-pants',
    price: 4200, salePrice: 3600, featured: false,
    images: [IMG + 'dp-sand-1.jpg'],
    description: 'The bridge between a chino and a dress pant — smart enough for the office, easy enough for the weekend.',
    details: `Cotton twill in a warm sand, cut with a formal waistband and welt back pockets so it still works under a blazer.\n\nGoes with everything from a white dress shirt to a knit polo, and it is the trouser we recommend under our Deep Olive and Coffee Brown coats.`,
    fabric: 'Cotton twill, 240 gsm', fit: 'Slim', care: 'Machine wash cold',
    origin: 'Stitched in Rawalpindi', lining: 'Unlined',
    colors: [C.beige, C.brown, C.storm],
    sizes: stock(SIZE_SETS['dress-pants'], [3, 7, 8, 6, 3, 1]),
    artOpts: { weave: 'plain' }
  },

  /* ---------------- DRESS SHIRTS ---------------- */
  {
    id: 'p-012', sku: 'GG-DS-401', name: 'Optic White Formal Shirt', category: 'dress-shirts',
    price: 3400, salePrice: 2950, featured: true,
    images: [IMG + 'ds-white-1.jpg', IMG + 'ds-white-3.jpg', IMG + 'ds-white-2.jpg'],
    description: 'A crisp white shirt with a semi-spread collar — the base layer for every suit we make.',
    details: `Woven from a fine cotton-blend poplin that stays opaque and holds a press. The semi-spread collar has removable stays and sits correctly under a suit lapel.\n\nSingle-button barrel cuff, chest pocket, and a slightly tapered body that tucks without bunching. French cuffs available on request at the shop.`,
    fabric: 'Cotton-blend poplin, 120 gsm', fit: 'Slim', care: 'Machine wash cold, warm iron',
    origin: 'Stitched in Rawalpindi', lining: '—',
    colors: [C.white, C.sky, C.cream],
    sizes: stock(SIZE_SETS['dress-shirts'], [8, 14, 16, 10, 5]),
    artOpts: { weave: 'plain' }
  },
  {
    id: 'p-013', sku: 'GG-DS-402', name: 'Cream Oxford Shirt', category: 'dress-shirts',
    price: 3600, salePrice: null, featured: false,
    images: [IMG + 'ds-cream-1.jpg', IMG + 'ds-white-2.jpg'],
    description: 'A warm cream oxford — softer than stark white and made for beige, silver and olive suiting.',
    details: `Oxford weave gives a subtle texture and a softer hand than poplin, and it creases far less over a long day.\n\nA warmer neutral for men who find white too harsh. Button-down collar option available at the shop.`,
    fabric: 'Cotton oxford, 135 gsm', fit: 'Regular', care: 'Machine wash cold, warm iron',
    origin: 'Stitched in Rawalpindi', lining: '—',
    colors: [C.cream, C.white, C.beige],
    sizes: stock(SIZE_SETS['dress-shirts'], [6, 11, 12, 8, 4]),
    artOpts: { weave: 'twill' }
  },
  {
    id: 'p-014', sku: 'GG-DS-403', name: 'Sage Cotton Shirt', category: 'dress-shirts',
    price: 3800, salePrice: 3300, featured: true,
    images: [IMG + 'ds-sage-1.jpg', IMG + 'ds-white-3.jpg'],
    description: 'A muted sage green in a smooth cotton — an easy way out of the white-shirt habit.',
    details: `Sage is quietly becoming our most requested colour. It sits well under charcoal, olive and navy, and it photographs far better than a plain white shirt at daytime events.\n\nCutaway collar, single-button cuff, no chest pocket for a cleaner front line.`,
    fabric: 'Cotton poplin, 130 gsm', fit: 'Slim', care: 'Machine wash cold, warm iron',
    origin: 'Stitched in Rawalpindi', lining: '—',
    colors: [C.sage, C.sky, C.white],
    sizes: stock(SIZE_SETS['dress-shirts'], [5, 9, 10, 7, 3]),
    artOpts: { weave: 'plain' }
  },
  {
    id: 'p-015', sku: 'GG-DS-404', name: 'Tan Poplin Shirt', category: 'dress-shirts',
    price: 3500, salePrice: null, featured: false,
    images: [IMG + 'ds-tan-1.jpg', IMG + 'ds-white-2.jpg'],
    description: 'A soft tan shirt that layers cleanly under a knit waistcoat or an unstructured coat.',
    details: `Warm, low-contrast and easy to layer — this is the shirt we reach for when the look calls for a waistcoat or a cardigan over the top.\n\nStandard point collar and a barrel cuff, cut a touch longer in the body so it stays tucked when you sit down.`,
    fabric: 'Cotton poplin, 125 gsm', fit: 'Regular', care: 'Machine wash cold, warm iron',
    origin: 'Stitched in Rawalpindi', lining: '—',
    colors: [C.beige, C.cream, C.storm],
    sizes: stock(SIZE_SETS['dress-shirts'], [4, 8, 9, 6, 3]),
    artOpts: { weave: 'twill' }
  },

  /* ---------------- TIES ---------------- */
  {
    id: 'p-016', sku: 'GG-TI-501', name: 'Violet Stripe Silk Tie', category: 'ties',
    price: 2200, salePrice: 1850, featured: true,
    images: [IMG + 'ti-violet-1.jpg', IMG + 'ti-violet-2.jpg'],
    description: 'A deep violet with woven black and silver stripes — our most-photographed tie.',
    details: `Standard 7cm blade with a hand-rolled tip and a wool interlining that produces a firm, symmetrical knot with a clean dimple.\n\nThe stripe is woven rather than printed, so it keeps its depth after years of wear. Sits best against charcoal, black and midnight navy.`,
    fabric: 'Woven silk-touch jacquard', fit: '7cm blade / 148cm', care: 'Spot clean only',
    origin: 'Finished in Rawalpindi', lining: 'Wool interlining',
    colors: [C.violet, C.wine, C.navy],
    sizes: stock(SIZE_SETS['ties'], [24]),
    artOpts: { accent: '#c8a24a' }
  },
  {
    id: 'p-017', sku: 'GG-TI-502', name: 'Sky Stripe Silk Tie', category: 'ties',
    price: 1900, salePrice: null, featured: true,
    images: [IMG + 'ti-sky-1.jpg', IMG + 'ti-sky-2.jpg'],
    description: 'Layered blue stripes on a navy ground — the safest upgrade to a plain business suit.',
    details: `A classic repp stripe in three tones of blue. Formal enough for an interview, relaxed enough for a Friday.\n\nWorn here against our Midnight Navy two piece. Also works beautifully with a grey suit and a white shirt.`,
    fabric: 'Woven repp stripe', fit: '7cm blade / 148cm', care: 'Spot clean only',
    origin: 'Finished in Rawalpindi', lining: 'Wool interlining',
    colors: [C.sky, C.navy, C.storm],
    sizes: stock(SIZE_SETS['ties'], [20]),
    artOpts: { accent: '#1e2a44' }
  },
  {
    id: 'p-018', sku: 'GG-TI-503', name: 'Champagne Satin Tie', category: 'ties',
    price: 2400, salePrice: 2050, featured: true,
    images: [IMG + 'ti-champagne-1.jpg', IMG + 'ti-champagne-2.jpg'],
    description: 'A warm champagne satin cut to match our ceremonial suiting — the groom’s tie.',
    details: `Made in the house champagne to sit alongside our Silver Grey and Ivory suiting. The satin finish picks up warm lighting without looking metallic.\n\nAvailable with a matching pocket square — ask at the shop or add a note to your order.`,
    fabric: 'Satin-finish microfibre', fit: '7cm blade / 148cm', care: 'Spot clean only',
    origin: 'Finished in Rawalpindi', lining: 'Wool interlining',
    colors: [C.champagne, C.gold, C.cream],
    sizes: stock(SIZE_SETS['ties'], [18]),
    artOpts: { accent: '#c8a24a' }
  },
  {
    id: 'p-019', sku: 'GG-TI-504', name: 'Classic Black Silk Tie', category: 'ties',
    price: 1700, salePrice: 1450, featured: false,
    images: [IMG + 'ti-black-1.jpg'],
    description: 'The plain black tie every wardrobe needs — matte finish, perfect knot, no fuss.',
    details: `A matte black with a fine woven texture that stops it going flat under camera flash. This is the tie for formal occasions where nothing should compete with the suit.\n\nTie a simple four-in-hand — the interlining does the rest.`,
    fabric: 'Matte woven microfibre', fit: '7cm blade / 148cm', care: 'Spot clean only',
    origin: 'Finished in Rawalpindi', lining: 'Wool interlining',
    colors: [C.black, C.charcoal, C.navy],
    sizes: stock(SIZE_SETS['ties'], [30]),
    artOpts: { accent: '#3a3f47' }
  },
  {
    id: 'p-020', sku: 'GG-TI-505', name: 'Maroon Silk Bow Tie', category: 'ties',
    price: 1600, salePrice: null, featured: false,
    images: [IMG + 'ti-maroon-1.jpg'],
    description: 'A self-tie bow in deep maroon — for the groom who wants something other than a long tie.',
    details: `Adjustable neck band fits collar sizes 14 to 18. Comes pre-shaped so it holds its form even on a first attempt.\n\nMaroon is the single most versatile bow colour we sell — it works against charcoal, navy, black and silver grey alike.`,
    fabric: 'Silk-touch microfibre', fit: 'Self-tie, adjustable 14"–18"', care: 'Spot clean only',
    origin: 'Finished in Rawalpindi', lining: 'Light interlining',
    colors: [C.maroon, C.wine, C.black],
    sizes: stock(SIZE_SETS['ties'], [22]),
    artOpts: { accent: '#c8a24a' }
  }
];

const SEED_REVIEWS = [
  { id: 'r1',  productId: 'p-001', name: 'Usman Tariq',   rating: 5, title: 'Perfect for my barat', body: 'Got this stitched for my barat and the fit was spot on after one small alteration. The waistcoat quality is much better than what I saw at other shops in Malikabad.', date: '2026-06-14' },
  { id: 'r2',  productId: 'p-001', name: 'Hamza Sheikh',  rating: 4, title: 'Great value', body: 'Very good fabric for the price. Delivery took four days to Islamabad. Only note is that the sleeves ran slightly long for me.', date: '2026-05-28' },
  { id: 'r3',  productId: 'p-002', name: 'Bilal Ahmed',   rating: 5, title: 'Looks expensive', body: 'The windowpane check is subtle in person, exactly as described. Everyone at the wedding asked where I got it stitched.', date: '2026-07-02' },
  { id: 'r4',  productId: 'p-003', name: 'Moiz Rehman',   rating: 5, title: 'Ideal for a day function', body: 'Wore it for my walima. Light enough to sit through the whole afternoon and it photographed brilliantly.', date: '2026-07-25' },
  { id: 'r5',  productId: 'p-004', name: 'Saad Iqbal',    rating: 4, title: 'Stand-out colour', body: 'The blue is bright but not loud. Got a lot of compliments at a friend\'s reception.', date: '2026-06-08' },
  { id: 'r6',  productId: 'p-005', name: 'Zeeshan Khan',  rating: 5, title: 'Proper tuxedo', body: 'The satin lapel is the real thing, not a printed finish. Worth every rupee for a nikkah suit.', date: '2026-05-19' },
  { id: 'r7',  productId: 'p-006', name: 'Ali Raza',      rating: 5, title: 'Office staple', body: 'Wearing it twice a week for two months and it still holds shape. Trouser needed hemming which they did free at the shop.', date: '2026-06-30' },
  { id: 'r8',  productId: 'p-008', name: 'Danish Nawaz',  rating: 4, title: 'Something different', body: 'Wanted a suit that was not navy or black. The olive is deep and rich, and it goes with cream shirts really well.', date: '2026-07-12' },
  { id: 'r9',  productId: 'p-009', name: 'Faizan Malik',  rating: 5, title: 'Bought three pairs', body: 'Comfortable waistband and the taper is just right. Best everyday trouser I have found in Pindi.', date: '2026-07-20' },
  { id: 'r10', productId: 'p-012', name: 'Ahsan Javed',   rating: 5, title: 'Best white shirt I own', body: 'Collar stays sharp all day and it does not go see-through. Ordered two more the following week.', date: '2026-07-11' },
  { id: 'r11', productId: 'p-014', name: 'Talha Aziz',    rating: 5, title: 'Lovely colour', body: 'The sage is exactly as pictured, muted and easy to wear. Fabric feels premium for the price.', date: '2026-08-02' },
  { id: 'r12', productId: 'p-016', name: 'Waleed Anwar',  rating: 5, title: 'Knots beautifully', body: 'Makes a really clean dimple and the violet is deep, not purple-bright. Excellent quality silk feel.', date: '2026-07-29' },
  { id: 'r13', productId: 'p-018', name: 'Hassan Raza',   rating: 4, title: 'Matched my suit perfectly', body: 'Bought it with the silver grey three piece for my wedding. The champagne shade matched exactly as the shop promised.', date: '2026-08-05' }
];
