-- ============================================================================
-- G.GORGEOUS — catalogue seed
--
-- Generated from assets/js/catalog.js. Run AFTER schema.sql.
-- Safe to re-run: it clears the catalogue first, so it will not duplicate.
--
-- Product photos stay on Cloudflare Pages (unlimited free bandwidth) and are
-- referenced here by URL, so they cost nothing against the Supabase egress
-- allowance. Replace these URLs when the shop uploads its own photography.
-- ============================================================================

begin;

-- clear the catalogue only; customers, orders and addresses are untouched
delete from public.reviews;
delete from public.product_media;
delete from public.product_sizes;
delete from public.product_colors;
delete from public.products;

-- 1. Regal Charcoal Three Piece
do $$
declare pid uuid;
begin
  insert into public.products
    (sku, name, category_slug, description, details, price, sale_price,
     fabric, fit, lining, care, origin, featured, active)
  values
    ('GG-3P-101', 'Regal Charcoal Three Piece', 'three-piece-suits', 'Our signature three piece in a textured charcoal weave — structured shoulder, peak lapel and a matching waistcoat cut for a clean silhouette.', 'Cut from a mid-weight all-season cloth, the Regal is the suit we build most often for barat and reception wear. The half-canvas front holds its shape through a long evening, while the lightly padded shoulder gives width without stiffness.

The waistcoat is a five-button, straight-hem cut that sits neatly under the coat. Trousers are finished flat-front with an extended tab closure and a hidden comfort waistband.

Every suit is pressed, checked and packed in a G.Gorgeous garment bag. Free minor alterations at our Malikabad shop within 14 days of purchase.', 28500, 24900, 'Textured wool-blend, 260 gsm', 'Slim Regular', 'Full viscose lining', 'Dry clean only', 'Stitched in Rawalpindi', true, true)
  returning id into pid;

  insert into public.product_colors (product_id, name, hex, sort) values
    (pid, 'Charcoal', '#3a3f47', 0),
    (pid, 'Jet Black', '#16181c', 1),
    (pid, 'Deep Olive', '#3d4033', 2);

  insert into public.product_sizes (product_id, size, qty) values
    (pid, '36', 3),
    (pid, '38', 6),
    (pid, '40', 8),
    (pid, '42', 6),
    (pid, '44', 4),
    (pid, '46', 2);

  insert into public.product_media (product_id, url, kind, sort) values
    (pid, '/assets/img/products/3p-charcoal-1.jpg', 'image', 0),
    (pid, '/assets/img/products/3p-charcoal-2.jpg', 'image', 1),
    (pid, '/assets/img/products/detail-tweed.jpg', 'image', 2);
end $$;

-- 2. Windowpane Navy Three Piece
do $$
declare pid uuid;
begin
  insert into public.products
    (sku, name, category_slug, description, details, price, sale_price,
     fabric, fit, lining, care, origin, featured, active)
  values
    ('GG-3P-102', 'Windowpane Navy Three Piece', 'three-piece-suits', 'A deep navy carrying a soft windowpane check — dressy enough for a nikkah, restrained enough for the office.', 'The check is woven in a tonal thread, so it reads as a solid navy from across a room and reveals its pattern up close. That makes it one of the most versatile three pieces we stitch.

Comes with a matching waistcoat and a plain-front trouser. We can add a shawl lapel, contrast piping or a custom lining on request — mention it in the order notes or call the shop.', 33500, null, 'Windowpane suiting, 280 gsm', 'Slim', 'Jacquard viscose lining', 'Dry clean only', 'Stitched in Rawalpindi', true, true)
  returning id into pid;

  insert into public.product_colors (product_id, name, hex, sort) values
    (pid, 'Midnight Navy', '#1e2a44', 0),
    (pid, 'Storm Grey', '#6f757e', 1),
    (pid, 'Charcoal', '#3a3f47', 2);

  insert into public.product_sizes (product_id, size, qty) values
    (pid, '36', 2),
    (pid, '38', 4),
    (pid, '40', 6),
    (pid, '42', 5),
    (pid, '44', 3),
    (pid, '46', 1);

  insert into public.product_media (product_id, url, kind, sort) values
    (pid, '/assets/img/products/3p-check-1.jpg', 'image', 0),
    (pid, '/assets/img/products/3p-check-2.jpg', 'image', 1),
    (pid, '/assets/img/products/detail-buttons.jpg', 'image', 2);
end $$;

-- 3. Silver Grey Ceremonial Three Piece
do $$
declare pid uuid;
begin
  insert into public.products
    (sku, name, category_slug, description, details, price, sale_price,
     fabric, fit, lining, care, origin, featured, active)
  values
    ('GG-3P-103', 'Silver Grey Ceremonial Three Piece', 'three-piece-suits', 'A light silver grey built for daytime mehndi and walima functions — worn here with a bow tie and lapel pin.', 'Lighter in both colour and weight, this one is made for daytime events and photographs beautifully in natural light.

The waistcoat is cut with a shallow V to show more of the shirt and tie. Pairs particularly well with our Cream Oxford and Optic White shirts, and with a champagne or maroon neckpiece.', 31900, 27500, 'Lightweight suiting, 240 gsm', 'Regular', 'Half lining', 'Dry clean only', 'Stitched in Rawalpindi', true, true)
  returning id into pid;

  insert into public.product_colors (product_id, name, hex, sort) values
    (pid, 'Silver Grey', '#b3b7bd', 0),
    (pid, 'Sand Beige', '#c3ac86', 1),
    (pid, 'Cream', '#ece2cd', 2);

  insert into public.product_sizes (product_id, size, qty) values
    (pid, '36', 2),
    (pid, '38', 3),
    (pid, '40', 5),
    (pid, '42', 4),
    (pid, '44', 2),
    (pid, '46', 1);

  insert into public.product_media (product_id, url, kind, sort) values
    (pid, '/assets/img/products/3p-silver-1.jpg', 'image', 0),
    (pid, '/assets/img/products/2p-ivory-1.jpg', 'image', 1),
    (pid, '/assets/img/products/detail-tweed.jpg', 'image', 2);
end $$;

-- 4. Royal Blue Two Piece
do $$
declare pid uuid;
begin
  insert into public.products
    (sku, name, category_slug, description, details, price, sale_price,
     fabric, fit, lining, care, origin, featured, active)
  values
    ('GG-2P-201', 'Royal Blue Two Piece', 'two-piece-suits', 'A confident royal blue with a clean notch lapel — the suit people remember you in.', 'Bright enough to stand out at an evening function, structured enough to wear to work with a white shirt and black tie.

Two-button front, double vent, and a slightly tapered trouser that breaks cleanly over a formal shoe. Half-lined so it stays wearable through Rawalpindi summers.', 23900, 20900, 'Wool-blend suiting, 250 gsm', 'Slim', 'Half lining', 'Dry clean only', 'Stitched in Rawalpindi', true, true)
  returning id into pid;

  insert into public.product_colors (product_id, name, hex, sort) values
    (pid, 'Royal Blue', '#27488f', 0),
    (pid, 'Midnight Navy', '#1e2a44', 1),
    (pid, 'Charcoal', '#3a3f47', 2);

  insert into public.product_sizes (product_id, size, qty) values
    (pid, '36', 4),
    (pid, '38', 8),
    (pid, '40', 10),
    (pid, '42', 7),
    (pid, '44', 5),
    (pid, '46', 3);

  insert into public.product_media (product_id, url, kind, sort) values
    (pid, '/assets/img/products/2p-royal-1.jpg', 'image', 0),
    (pid, '/assets/img/products/2p-royal-2.jpg', 'image', 1),
    (pid, '/assets/img/products/detail-buttons.jpg', 'image', 2);
end $$;

-- 5. Jet Black Tuxedo Two Piece
do $$
declare pid uuid;
begin
  insert into public.products
    (sku, name, category_slug, description, details, price, sale_price,
     fabric, fit, lining, care, origin, featured, active)
  values
    ('GG-2P-202', 'Jet Black Tuxedo Two Piece', 'two-piece-suits', 'A true black tuxedo with a satin-faced lapel — for nikkah, receptions and black-tie evenings.', 'The satin facing on the lapel catches light exactly the way a tuxedo should, without the whole suit turning shiny in photographs.

Worn with a black bow tie and a white evening shirt as shown, or dressed down with a slim black tie. Trousers carry a satin side stripe that can be left off on request.', 27500, null, 'Suiting with satin facing, 265 gsm', 'Slim', 'Full satin lining', 'Dry clean only', 'Stitched in Rawalpindi', true, true)
  returning id into pid;

  insert into public.product_colors (product_id, name, hex, sort) values
    (pid, 'Jet Black', '#16181c', 0),
    (pid, 'Midnight Navy', '#1e2a44', 1);

  insert into public.product_sizes (product_id, size, qty) values
    (pid, '36', 3),
    (pid, '38', 6),
    (pid, '40', 8),
    (pid, '42', 6),
    (pid, '44', 4),
    (pid, '46', 2);

  insert into public.product_media (product_id, url, kind, sort) values
    (pid, '/assets/img/products/2p-black-1.jpg', 'image', 0),
    (pid, '/assets/img/products/2p-black-2.jpg', 'image', 1),
    (pid, '/assets/img/products/detail-buttons.jpg', 'image', 2);
end $$;

-- 6. Midnight Navy Two Piece
do $$
declare pid uuid;
begin
  insert into public.products
    (sku, name, category_slug, description, details, price, sale_price,
     fabric, fit, lining, care, origin, featured, active)
  values
    ('GG-2P-203', 'Midnight Navy Two Piece', 'two-piece-suits', 'The everyday formal — a deep navy that works for the office, interviews and evening functions alike.', 'If you only own one suit, make it this one. Navy flatters more skin tones than black and reads formal without being severe.

Notch lapel, two-button front, double vent. The trouser is flat-front with a slight taper below the knee, and the jacket is half-lined for warmer months.', 21500, 18900, 'Poly-viscose suiting, 245 gsm', 'Slim Regular', 'Half lining', 'Dry clean only', 'Stitched in Rawalpindi', false, true)
  returning id into pid;

  insert into public.product_colors (product_id, name, hex, sort) values
    (pid, 'Midnight Navy', '#1e2a44', 0),
    (pid, 'Charcoal', '#3a3f47', 1),
    (pid, 'Royal Blue', '#27488f', 2);

  insert into public.product_sizes (product_id, size, qty) values
    (pid, '36', 4),
    (pid, '38', 7),
    (pid, '40', 9),
    (pid, '42', 7),
    (pid, '44', 4),
    (pid, '46', 2);

  insert into public.product_media (product_id, url, kind, sort) values
    (pid, '/assets/img/products/2p-navy-1.jpg', 'image', 0),
    (pid, '/assets/img/products/2p-navy-2.jpg', 'image', 1),
    (pid, '/assets/img/products/detail-buttons.jpg', 'image', 2);
end $$;

-- 7. Ivory Double-Breasted Two Piece
do $$
declare pid uuid;
begin
  insert into public.products
    (sku, name, category_slug, description, details, price, sale_price,
     fabric, fit, lining, care, origin, featured, active)
  values
    ('GG-2P-204', 'Ivory Double-Breasted Two Piece', 'two-piece-suits', 'A double-breasted ivory coat with a peak lapel — a statement piece for daytime functions.', 'Six-button double-breasted front with a sharp peak lapel. The ivory is warm rather than stark, so it stays flattering under both daylight and warm indoor lighting.

Because of the colour we recommend the dry-clean-only route and a garment bag between wears. Pairs with a black or charcoal trouser for contrast, or keep the matching ivory trouser for a full look.', 29900, null, 'Fine ivory suiting, 250 gsm', 'Slim', 'Full lining', 'Dry clean only', 'Stitched in Rawalpindi', false, true)
  returning id into pid;

  insert into public.product_colors (product_id, name, hex, sort) values
    (pid, 'Optic White', '#f6f4ef', 0),
    (pid, 'Cream', '#ece2cd', 1),
    (pid, 'Silver Grey', '#b3b7bd', 2);

  insert into public.product_sizes (product_id, size, qty) values
    (pid, '36', 1),
    (pid, '38', 3),
    (pid, '40', 5),
    (pid, '42', 4),
    (pid, '44', 2),
    (pid, '46', 1);

  insert into public.product_media (product_id, url, kind, sort) values
    (pid, '/assets/img/products/2p-ivory-1.jpg', 'image', 0),
    (pid, '/assets/img/products/3p-silver-1.jpg', 'image', 1);
end $$;

-- 8. Deep Olive Two Piece
do $$
declare pid uuid;
begin
  insert into public.products
    (sku, name, category_slug, description, details, price, sale_price,
     fabric, fit, lining, care, origin, featured, active)
  values
    ('GG-2P-205', 'Deep Olive Two Piece', 'two-piece-suits', 'A rich olive green with a soft hand — the alternative for men who are done with navy and charcoal.', 'Olive reads warm and unusual without being loud, and it sits beautifully against cream, sand and sky blue shirts.

Soft-construction shoulder, single vent, patch-style hip pockets. This is the most relaxed cut in our suiting range — wear it with a knit tie or no tie at all.', 22500, 19500, 'Textured wool blend, 270 gsm', 'Regular', 'Half lining', 'Dry clean only', 'Stitched in Rawalpindi', false, true)
  returning id into pid;

  insert into public.product_colors (product_id, name, hex, sort) values
    (pid, 'Deep Olive', '#3d4033', 0),
    (pid, 'Coffee Brown', '#5a4032', 1),
    (pid, 'Charcoal', '#3a3f47', 2);

  insert into public.product_sizes (product_id, size, qty) values
    (pid, '36', 2),
    (pid, '38', 4),
    (pid, '40', 6),
    (pid, '42', 4),
    (pid, '44', 3),
    (pid, '46', 1);

  insert into public.product_media (product_id, url, kind, sort) values
    (pid, '/assets/img/products/2p-olive-1.jpg', 'image', 0),
    (pid, '/assets/img/products/detail-tweed.jpg', 'image', 1);
end $$;

-- 9. Charcoal Formal Trouser
do $$
declare pid uuid;
begin
  insert into public.products
    (sku, name, category_slug, description, details, price, sale_price,
     fabric, fit, lining, care, origin, featured, active)
  values
    ('GG-DP-301', 'Charcoal Formal Trouser', 'dress-pants', 'Flat-front formal trouser with a clean taper and a hidden comfort waistband.', 'Our best-selling trouser. Flat-front, no pleats, with a gently tapered leg that breaks cleanly over a formal shoe.

The inner waistband has a grip lining so shirts stay tucked through a full day. Sold unhemmed by default — free hemming at the shop, or tell us your inseam in the order notes and we will finish it before dispatch.', 4500, 3800, 'Poly-viscose, 230 gsm', 'Slim taper', 'Unlined', 'Machine wash cold / dry clean', 'Stitched in Rawalpindi', true, true)
  returning id into pid;

  insert into public.product_colors (product_id, name, hex, sort) values
    (pid, 'Charcoal', '#3a3f47', 0),
    (pid, 'Jet Black', '#16181c', 1),
    (pid, 'Midnight Navy', '#1e2a44', 2),
    (pid, 'Storm Grey', '#6f757e', 3);

  insert into public.product_sizes (product_id, size, qty) values
    (pid, '30', 6),
    (pid, '32', 10),
    (pid, '34', 12),
    (pid, '36', 9),
    (pid, '38', 5),
    (pid, '40', 3);

  insert into public.product_media (product_id, url, kind, sort) values
    (pid, '/assets/img/products/dp-charcoal-1.jpg', 'image', 0),
    (pid, '/assets/img/products/2p-navy-2.jpg', 'image', 1);
end $$;

-- 10. Ivory Summer Trouser
do $$
declare pid uuid;
begin
  insert into public.products
    (sku, name, category_slug, description, details, price, sale_price,
     fabric, fit, lining, care, origin, featured, active)
  values
    ('GG-DP-302', 'Ivory Summer Trouser', 'dress-pants', 'A crisp off-white trouser for daytime functions and summer smart-casual.', 'Cotton-rich so it breathes, cut and finished like a formal trouser with a clean waistband and welt pockets.

Opaque enough to wear with confidence — we line the seat and front panels. Best worn with a navy polo, a sky blue shirt, or an ivory coat for a full daytime look.', 4800, null, 'Cotton twill, 250 gsm', 'Slim', 'Part lined', 'Machine wash cold, warm iron', 'Stitched in Rawalpindi', false, true)
  returning id into pid;

  insert into public.product_colors (product_id, name, hex, sort) values
    (pid, 'Optic White', '#f6f4ef', 0),
    (pid, 'Cream', '#ece2cd', 1),
    (pid, 'Sand Beige', '#c3ac86', 2);

  insert into public.product_sizes (product_id, size, qty) values
    (pid, '30', 4),
    (pid, '32', 8),
    (pid, '34', 9),
    (pid, '36', 6),
    (pid, '38', 3),
    (pid, '40', 1);

  insert into public.product_media (product_id, url, kind, sort) values
    (pid, '/assets/img/products/dp-ivory-1.jpg', 'image', 0),
    (pid, '/assets/img/products/dp-ivory-2.jpg', 'image', 1);
end $$;

-- 11. Sand Chino-Formal Trouser
do $$
declare pid uuid;
begin
  insert into public.products
    (sku, name, category_slug, description, details, price, sale_price,
     fabric, fit, lining, care, origin, featured, active)
  values
    ('GG-DP-303', 'Sand Chino-Formal Trouser', 'dress-pants', 'The bridge between a chino and a dress pant — smart enough for the office, easy enough for the weekend.', 'Cotton twill in a warm sand, cut with a formal waistband and welt back pockets so it still works under a blazer.

Goes with everything from a white dress shirt to a knit polo, and it is the trouser we recommend under our Deep Olive and Coffee Brown coats.', 4200, 3600, 'Cotton twill, 240 gsm', 'Slim', 'Unlined', 'Machine wash cold', 'Stitched in Rawalpindi', false, true)
  returning id into pid;

  insert into public.product_colors (product_id, name, hex, sort) values
    (pid, 'Sand Beige', '#c3ac86', 0),
    (pid, 'Coffee Brown', '#5a4032', 1),
    (pid, 'Storm Grey', '#6f757e', 2);

  insert into public.product_sizes (product_id, size, qty) values
    (pid, '30', 3),
    (pid, '32', 7),
    (pid, '34', 8),
    (pid, '36', 6),
    (pid, '38', 3),
    (pid, '40', 1);

  insert into public.product_media (product_id, url, kind, sort) values
    (pid, '/assets/img/products/dp-sand-1.jpg', 'image', 0);
end $$;

-- 12. Optic White Formal Shirt
do $$
declare pid uuid;
begin
  insert into public.products
    (sku, name, category_slug, description, details, price, sale_price,
     fabric, fit, lining, care, origin, featured, active)
  values
    ('GG-DS-401', 'Optic White Formal Shirt', 'dress-shirts', 'A crisp white shirt with a semi-spread collar — the base layer for every suit we make.', 'Woven from a fine cotton-blend poplin that stays opaque and holds a press. The semi-spread collar has removable stays and sits correctly under a suit lapel.

Single-button barrel cuff, chest pocket, and a slightly tapered body that tucks without bunching. French cuffs available on request at the shop.', 3400, 2950, 'Cotton-blend poplin, 120 gsm', 'Slim', '—', 'Machine wash cold, warm iron', 'Stitched in Rawalpindi', true, true)
  returning id into pid;

  insert into public.product_colors (product_id, name, hex, sort) values
    (pid, 'Optic White', '#f6f4ef', 0),
    (pid, 'Sky Blue', '#b8cbe0', 1),
    (pid, 'Cream', '#ece2cd', 2);

  insert into public.product_sizes (product_id, size, qty) values
    (pid, 'S', 8),
    (pid, 'M', 14),
    (pid, 'L', 16),
    (pid, 'XL', 10),
    (pid, 'XXL', 5);

  insert into public.product_media (product_id, url, kind, sort) values
    (pid, '/assets/img/products/ds-white-1.jpg', 'image', 0),
    (pid, '/assets/img/products/ds-white-3.jpg', 'image', 1),
    (pid, '/assets/img/products/ds-white-2.jpg', 'image', 2);
end $$;

-- 13. Cream Oxford Shirt
do $$
declare pid uuid;
begin
  insert into public.products
    (sku, name, category_slug, description, details, price, sale_price,
     fabric, fit, lining, care, origin, featured, active)
  values
    ('GG-DS-402', 'Cream Oxford Shirt', 'dress-shirts', 'A warm cream oxford — softer than stark white and made for beige, silver and olive suiting.', 'Oxford weave gives a subtle texture and a softer hand than poplin, and it creases far less over a long day.

A warmer neutral for men who find white too harsh. Button-down collar option available at the shop.', 3600, null, 'Cotton oxford, 135 gsm', 'Regular', '—', 'Machine wash cold, warm iron', 'Stitched in Rawalpindi', false, true)
  returning id into pid;

  insert into public.product_colors (product_id, name, hex, sort) values
    (pid, 'Cream', '#ece2cd', 0),
    (pid, 'Optic White', '#f6f4ef', 1),
    (pid, 'Sand Beige', '#c3ac86', 2);

  insert into public.product_sizes (product_id, size, qty) values
    (pid, 'S', 6),
    (pid, 'M', 11),
    (pid, 'L', 12),
    (pid, 'XL', 8),
    (pid, 'XXL', 4);

  insert into public.product_media (product_id, url, kind, sort) values
    (pid, '/assets/img/products/ds-cream-1.jpg', 'image', 0),
    (pid, '/assets/img/products/ds-white-2.jpg', 'image', 1);
end $$;

-- 14. Sage Cotton Shirt
do $$
declare pid uuid;
begin
  insert into public.products
    (sku, name, category_slug, description, details, price, sale_price,
     fabric, fit, lining, care, origin, featured, active)
  values
    ('GG-DS-403', 'Sage Cotton Shirt', 'dress-shirts', 'A muted sage green in a smooth cotton — an easy way out of the white-shirt habit.', 'Sage is quietly becoming our most requested colour. It sits well under charcoal, olive and navy, and it photographs far better than a plain white shirt at daytime events.

Cutaway collar, single-button cuff, no chest pocket for a cleaner front line.', 3800, 3300, 'Cotton poplin, 130 gsm', 'Slim', '—', 'Machine wash cold, warm iron', 'Stitched in Rawalpindi', true, true)
  returning id into pid;

  insert into public.product_colors (product_id, name, hex, sort) values
    (pid, 'Sage Green', '#b9c7b4', 0),
    (pid, 'Sky Blue', '#b8cbe0', 1),
    (pid, 'Optic White', '#f6f4ef', 2);

  insert into public.product_sizes (product_id, size, qty) values
    (pid, 'S', 5),
    (pid, 'M', 9),
    (pid, 'L', 10),
    (pid, 'XL', 7),
    (pid, 'XXL', 3);

  insert into public.product_media (product_id, url, kind, sort) values
    (pid, '/assets/img/products/ds-sage-1.jpg', 'image', 0),
    (pid, '/assets/img/products/ds-white-3.jpg', 'image', 1);
end $$;

-- 15. Tan Poplin Shirt
do $$
declare pid uuid;
begin
  insert into public.products
    (sku, name, category_slug, description, details, price, sale_price,
     fabric, fit, lining, care, origin, featured, active)
  values
    ('GG-DS-404', 'Tan Poplin Shirt', 'dress-shirts', 'A soft tan shirt that layers cleanly under a knit waistcoat or an unstructured coat.', 'Warm, low-contrast and easy to layer — this is the shirt we reach for when the look calls for a waistcoat or a cardigan over the top.

Standard point collar and a barrel cuff, cut a touch longer in the body so it stays tucked when you sit down.', 3500, null, 'Cotton poplin, 125 gsm', 'Regular', '—', 'Machine wash cold, warm iron', 'Stitched in Rawalpindi', false, true)
  returning id into pid;

  insert into public.product_colors (product_id, name, hex, sort) values
    (pid, 'Sand Beige', '#c3ac86', 0),
    (pid, 'Cream', '#ece2cd', 1),
    (pid, 'Storm Grey', '#6f757e', 2);

  insert into public.product_sizes (product_id, size, qty) values
    (pid, 'S', 4),
    (pid, 'M', 8),
    (pid, 'L', 9),
    (pid, 'XL', 6),
    (pid, 'XXL', 3);

  insert into public.product_media (product_id, url, kind, sort) values
    (pid, '/assets/img/products/ds-tan-1.jpg', 'image', 0),
    (pid, '/assets/img/products/ds-white-2.jpg', 'image', 1);
end $$;

-- 16. Violet Stripe Silk Tie
do $$
declare pid uuid;
begin
  insert into public.products
    (sku, name, category_slug, description, details, price, sale_price,
     fabric, fit, lining, care, origin, featured, active)
  values
    ('GG-TI-501', 'Violet Stripe Silk Tie', 'ties', 'A deep violet with woven black and silver stripes — our most-photographed tie.', 'Standard 7cm blade with a hand-rolled tip and a wool interlining that produces a firm, symmetrical knot with a clean dimple.

The stripe is woven rather than printed, so it keeps its depth after years of wear. Sits best against charcoal, black and midnight navy.', 2200, 1850, 'Woven silk-touch jacquard', '7cm blade / 148cm', 'Wool interlining', 'Spot clean only', 'Finished in Rawalpindi', true, true)
  returning id into pid;

  insert into public.product_colors (product_id, name, hex, sort) values
    (pid, 'Violet', '#6b4a9c', 0),
    (pid, 'Wine', '#5c1f2c', 1),
    (pid, 'Midnight Navy', '#1e2a44', 2);

  insert into public.product_sizes (product_id, size, qty) values
    (pid, 'One Size', 24);

  insert into public.product_media (product_id, url, kind, sort) values
    (pid, '/assets/img/products/ti-violet-1.jpg', 'image', 0),
    (pid, '/assets/img/products/ti-violet-2.jpg', 'image', 1);
end $$;

-- 17. Sky Stripe Silk Tie
do $$
declare pid uuid;
begin
  insert into public.products
    (sku, name, category_slug, description, details, price, sale_price,
     fabric, fit, lining, care, origin, featured, active)
  values
    ('GG-TI-502', 'Sky Stripe Silk Tie', 'ties', 'Layered blue stripes on a navy ground — the safest upgrade to a plain business suit.', 'A classic repp stripe in three tones of blue. Formal enough for an interview, relaxed enough for a Friday.

Worn here against our Midnight Navy two piece. Also works beautifully with a grey suit and a white shirt.', 1900, null, 'Woven repp stripe', '7cm blade / 148cm', 'Wool interlining', 'Spot clean only', 'Finished in Rawalpindi', true, true)
  returning id into pid;

  insert into public.product_colors (product_id, name, hex, sort) values
    (pid, 'Sky Blue', '#b8cbe0', 0),
    (pid, 'Midnight Navy', '#1e2a44', 1),
    (pid, 'Storm Grey', '#6f757e', 2);

  insert into public.product_sizes (product_id, size, qty) values
    (pid, 'One Size', 20);

  insert into public.product_media (product_id, url, kind, sort) values
    (pid, '/assets/img/products/ti-sky-1.jpg', 'image', 0),
    (pid, '/assets/img/products/ti-sky-2.jpg', 'image', 1);
end $$;

-- 18. Champagne Satin Tie
do $$
declare pid uuid;
begin
  insert into public.products
    (sku, name, category_slug, description, details, price, sale_price,
     fabric, fit, lining, care, origin, featured, active)
  values
    ('GG-TI-503', 'Champagne Satin Tie', 'ties', 'A warm champagne satin cut to match our ceremonial suiting — the groom’s tie.', 'Made in the house champagne to sit alongside our Silver Grey and Ivory suiting. The satin finish picks up warm lighting without looking metallic.

Available with a matching pocket square — ask at the shop or add a note to your order.', 2400, 2050, 'Satin-finish microfibre', '7cm blade / 148cm', 'Wool interlining', 'Spot clean only', 'Finished in Rawalpindi', true, true)
  returning id into pid;

  insert into public.product_colors (product_id, name, hex, sort) values
    (pid, 'Champagne', '#d9c295', 0),
    (pid, 'Antique Gold', '#c8a24a', 1),
    (pid, 'Cream', '#ece2cd', 2);

  insert into public.product_sizes (product_id, size, qty) values
    (pid, 'One Size', 18);

  insert into public.product_media (product_id, url, kind, sort) values
    (pid, '/assets/img/products/ti-champagne-1.jpg', 'image', 0),
    (pid, '/assets/img/products/ti-champagne-2.jpg', 'image', 1);
end $$;

-- 19. Classic Black Silk Tie
do $$
declare pid uuid;
begin
  insert into public.products
    (sku, name, category_slug, description, details, price, sale_price,
     fabric, fit, lining, care, origin, featured, active)
  values
    ('GG-TI-504', 'Classic Black Silk Tie', 'ties', 'The plain black tie every wardrobe needs — matte finish, perfect knot, no fuss.', 'A matte black with a fine woven texture that stops it going flat under camera flash. This is the tie for formal occasions where nothing should compete with the suit.

Tie a simple four-in-hand — the interlining does the rest.', 1700, 1450, 'Matte woven microfibre', '7cm blade / 148cm', 'Wool interlining', 'Spot clean only', 'Finished in Rawalpindi', false, true)
  returning id into pid;

  insert into public.product_colors (product_id, name, hex, sort) values
    (pid, 'Jet Black', '#16181c', 0),
    (pid, 'Charcoal', '#3a3f47', 1),
    (pid, 'Midnight Navy', '#1e2a44', 2);

  insert into public.product_sizes (product_id, size, qty) values
    (pid, 'One Size', 30);

  insert into public.product_media (product_id, url, kind, sort) values
    (pid, '/assets/img/products/ti-black-1.jpg', 'image', 0);
end $$;

-- 20. Maroon Silk Bow Tie
do $$
declare pid uuid;
begin
  insert into public.products
    (sku, name, category_slug, description, details, price, sale_price,
     fabric, fit, lining, care, origin, featured, active)
  values
    ('GG-TI-505', 'Maroon Silk Bow Tie', 'ties', 'A self-tie bow in deep maroon — for the groom who wants something other than a long tie.', 'Adjustable neck band fits collar sizes 14 to 18. Comes pre-shaped so it holds its form even on a first attempt.

Maroon is the single most versatile bow colour we sell — it works against charcoal, navy, black and silver grey alike.', 1600, null, 'Silk-touch microfibre', 'Self-tie, adjustable 14"–18"', 'Light interlining', 'Spot clean only', 'Finished in Rawalpindi', false, true)
  returning id into pid;

  insert into public.product_colors (product_id, name, hex, sort) values
    (pid, 'Maroon', '#6d2230', 0),
    (pid, 'Wine', '#5c1f2c', 1),
    (pid, 'Jet Black', '#16181c', 2);

  insert into public.product_sizes (product_id, size, qty) values
    (pid, 'One Size', 22);

  insert into public.product_media (product_id, url, kind, sort) values
    (pid, '/assets/img/products/ti-maroon-1.jpg', 'image', 0);
end $$;

-- ---------------------------------------------------------------- reviews
insert into public.reviews (product_id, user_id, name, rating, title, body, approved, created_at)
  select id, null, 'Usman Tariq', 5, 'Perfect for my barat', 'Got this stitched for my barat and the fit was spot on after one small alteration. The waistcoat quality is much better than what I saw at other shops in Malikabad.', true, '2026-06-14'::timestamptz
  from public.products where sku = 'GG-3P-101';
insert into public.reviews (product_id, user_id, name, rating, title, body, approved, created_at)
  select id, null, 'Hamza Sheikh', 4, 'Great value', 'Very good fabric for the price. Delivery took four days to Islamabad. Only note is that the sleeves ran slightly long for me.', true, '2026-05-28'::timestamptz
  from public.products where sku = 'GG-3P-101';
insert into public.reviews (product_id, user_id, name, rating, title, body, approved, created_at)
  select id, null, 'Bilal Ahmed', 5, 'Looks expensive', 'The windowpane check is subtle in person, exactly as described. Everyone at the wedding asked where I got it stitched.', true, '2026-07-02'::timestamptz
  from public.products where sku = 'GG-3P-102';
insert into public.reviews (product_id, user_id, name, rating, title, body, approved, created_at)
  select id, null, 'Moiz Rehman', 5, 'Ideal for a day function', 'Wore it for my walima. Light enough to sit through the whole afternoon and it photographed brilliantly.', true, '2026-07-25'::timestamptz
  from public.products where sku = 'GG-3P-103';
insert into public.reviews (product_id, user_id, name, rating, title, body, approved, created_at)
  select id, null, 'Saad Iqbal', 4, 'Stand-out colour', 'The blue is bright but not loud. Got a lot of compliments at a friend''s reception.', true, '2026-06-08'::timestamptz
  from public.products where sku = 'GG-2P-201';
insert into public.reviews (product_id, user_id, name, rating, title, body, approved, created_at)
  select id, null, 'Zeeshan Khan', 5, 'Proper tuxedo', 'The satin lapel is the real thing, not a printed finish. Worth every rupee for a nikkah suit.', true, '2026-05-19'::timestamptz
  from public.products where sku = 'GG-2P-202';
insert into public.reviews (product_id, user_id, name, rating, title, body, approved, created_at)
  select id, null, 'Ali Raza', 5, 'Office staple', 'Wearing it twice a week for two months and it still holds shape. Trouser needed hemming which they did free at the shop.', true, '2026-06-30'::timestamptz
  from public.products where sku = 'GG-2P-203';
insert into public.reviews (product_id, user_id, name, rating, title, body, approved, created_at)
  select id, null, 'Danish Nawaz', 4, 'Something different', 'Wanted a suit that was not navy or black. The olive is deep and rich, and it goes with cream shirts really well.', true, '2026-07-12'::timestamptz
  from public.products where sku = 'GG-2P-205';
insert into public.reviews (product_id, user_id, name, rating, title, body, approved, created_at)
  select id, null, 'Faizan Malik', 5, 'Bought three pairs', 'Comfortable waistband and the taper is just right. Best everyday trouser I have found in Pindi.', true, '2026-07-20'::timestamptz
  from public.products where sku = 'GG-DP-301';
insert into public.reviews (product_id, user_id, name, rating, title, body, approved, created_at)
  select id, null, 'Ahsan Javed', 5, 'Best white shirt I own', 'Collar stays sharp all day and it does not go see-through. Ordered two more the following week.', true, '2026-07-11'::timestamptz
  from public.products where sku = 'GG-DS-401';
insert into public.reviews (product_id, user_id, name, rating, title, body, approved, created_at)
  select id, null, 'Talha Aziz', 5, 'Lovely colour', 'The sage is exactly as pictured, muted and easy to wear. Fabric feels premium for the price.', true, '2026-08-02'::timestamptz
  from public.products where sku = 'GG-DS-403';
insert into public.reviews (product_id, user_id, name, rating, title, body, approved, created_at)
  select id, null, 'Waleed Anwar', 5, 'Knots beautifully', 'Makes a really clean dimple and the violet is deep, not purple-bright. Excellent quality silk feel.', true, '2026-07-29'::timestamptz
  from public.products where sku = 'GG-TI-501';
insert into public.reviews (product_id, user_id, name, rating, title, body, approved, created_at)
  select id, null, 'Hassan Raza', 4, 'Matched my suit perfectly', 'Bought it with the silver grey three piece for my wedding. The champagne shade matched exactly as the shop promised.', true, '2026-08-05'::timestamptz
  from public.products where sku = 'GG-TI-503';

commit;

-- quick check — should print 20 products, and counts for the rest
select
  (select count(*) from public.products)       as products,
  (select count(*) from public.product_colors) as colours,
  (select count(*) from public.product_sizes)  as sizes,
  (select count(*) from public.product_media)  as photos,
  (select count(*) from public.reviews)        as reviews;
