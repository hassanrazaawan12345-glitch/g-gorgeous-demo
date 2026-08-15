/* ==========================================================================
   G.GORGEOUS — brand config + vector artwork engine
   The seed catalogue lives in catalog.js
   ========================================================================== */

const SITE = {
  name: 'G.Gorgeous',
  tagline: 'Gents Wear',
  blurb: 'Bespoke-feel tailoring for the modern gentleman — cut, stitched and finished in Rawalpindi.',
  phone: '0342 5714108',
  phoneRaw: '+923425714108',
  address: 'Shop #G77, Malikabad Shopping Mall, Rawalpindi, Pakistan',
  instagram: 'https://instagram.com/g.gorgeous2255',
  instagramHandle: '@g.gorgeous2255',
  tiktok: 'https://www.tiktok.com/@g.gorgeous_1.0',
  tiktokHandle: '@g.gorgeous_1.0',
  currency: 'Rs',
  freeShipOver: 15000,
  shipFlat: 350,
  taxRate: 0,
  adminPin: 'gorgeous2255'
};

const CATEGORIES = [
  { slug: 'three-piece-suits', name: 'Three Piece Suits', art: 'suit3', blurb: 'Coat, waistcoat & trouser' },
  { slug: 'two-piece-suits',   name: 'Two Piece Suits',   art: 'suit2', blurb: 'Coat & trouser' },
  { slug: 'dress-pants',       name: 'Dress Pants',       art: 'pants', blurb: 'Formal trousers' },
  { slug: 'dress-shirts',      name: 'Dress Shirts',      art: 'shirt', blurb: 'Cotton formals' },
  { slug: 'ties',              name: 'Ties',              art: 'tie',   blurb: 'Silk neckwear' }
];

const SIZE_SETS = {
  'three-piece-suits': ['36', '38', '40', '42', '44', '46'],
  'two-piece-suits':   ['36', '38', '40', '42', '44', '46'],
  'dress-pants':       ['30', '32', '34', '36', '38', '40'],
  'dress-shirts':      ['S', 'M', 'L', 'XL', 'XXL'],
  'ties':              ['One Size']
};

/* ---------- colour helpers ---------- */

function shade(hex, pct) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const t = pct < 0 ? 0 : 255, p = Math.abs(pct);
  r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b);
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}
function isLight(hex) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  return (((n >> 16) & 255) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000 > 150;
}

/* ==========================================================================
   Vector artwork — the fallback whenever a product has no uploaded photos,
   so the store never shows a broken image and works with no internet.
   ========================================================================== */

const ART = {};

ART.frame = (bg1, bg2) => `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#e7d7ac"/><stop offset=".5" stop-color="#c8a24a"/><stop offset="1" stop-color="#a8842f"/>
    </linearGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#0d0d0d" flood-opacity=".16"/>
    </filter>
  </defs>
  <rect width="800" height="1000" fill="url(#bg)"/>
  <circle cx="400" cy="440" r="340" fill="#ffffff" opacity=".45"/>
  <rect x="26" y="26" width="748" height="948" fill="none" stroke="url(#gold)" stroke-width="1.2" opacity=".55"/>`;

ART.mark = () => `
  <g opacity=".5" transform="translate(400,930)">
    <path d="M-92 0h58" stroke="url(#gold)" stroke-width="1"/>
    <path d="M34 0h58" stroke="url(#gold)" stroke-width="1"/>
    <path d="M0 -13 L9 0 L0 13 L-9 0 Z" fill="url(#gold)"/>
  </g>`;

/* shared sleeve — drawn over the body so the armhole seam stays visible */
ART._sleeve = (fill, seam, cuff, B, outline) => `
  <path d="M292 232 C256 252 240 322 234 422 C229 502 231 ${B - 100} 237 ${B}
           L300 ${B - 6} C296 ${B - 80} 296 480 302 400 C306 340 312 288 318 252 Z" fill="${fill}"
        ${outline ? `stroke="${outline}" stroke-width="1.6" stroke-opacity=".3"` : ''}/>
  <path d="M234 ${B - 42} L300 ${B - 48} L301 ${B - 6} L237 ${B} Z" fill="${cuff}"/>
  <path d="M296 240 C303 300 297 470 300 ${B - 10}" fill="none" stroke="${seam}" stroke-width="2" opacity=".5"/>`;

ART._lapel = (fill, edge) => `
  <path d="M334 214 L400 542 L376 550 L298 250 L314 228 Z" fill="${fill}"/>
  <path d="M334 214 L400 542" fill="none" stroke="${edge}" stroke-width="1.6" opacity=".45"/>`;

ART.suit = function (c, threePiece) {
  const jacket = c.base;
  const dark = shade(jacket, -0.22);
  const sleeve = shade(jacket, isLight(jacket) ? -0.07 : 0.06);
  const light = shade(jacket, isLight(jacket) ? -0.13 : 0.15);
  const vest = c.vest || shade(jacket, -0.08);
  const shirt = c.shirt || '#f7f5ef';
  const tie = c.accent || '#8d1c2b';
  const vB = threePiece ? 392 : 470;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
    ${ART.frame(c.bg1 || '#f6f3ec', c.bg2 || '#eae5da')}
    <g filter="url(#soft)">
      <!-- torso -->
      <path d="M400 198 C356 198 316 212 292 232 L280 268 C272 356 270 466 274 566
               L272 790 L528 790 L526 566 C530 466 528 356 520 268 L508 232
               C484 212 444 198 400 198 Z" fill="${jacket}"/>

      <!-- open front: shirt / waistcoat -->
      <path d="M334 216 L466 216 L400 546 Z" fill="${shirt}"/>
      ${threePiece ? `<path d="M342 216 L458 216 L400 538 Z" fill="${vest}"/>
        <path d="M366 216 L434 216 L400 368 Z" fill="${shirt}"/>
        <circle cx="400" cy="400" r="6" fill="${shade(vest, -0.38)}"/>
        <circle cx="400" cy="442" r="6" fill="${shade(vest, -0.38)}"/>
        <circle cx="400" cy="484" r="6" fill="${shade(vest, -0.38)}"/>` : ''}

      <!-- collar + tie -->
      <path d="M372 208 L400 252 L384 268 L354 228 Z" fill="${shade(shirt, -0.07)}"/>
      <g transform="translate(800,0) scale(-1,1)"><path d="M372 208 L400 252 L384 268 L354 228 Z" fill="${shade(shirt, -0.07)}"/></g>
      <path d="M386 240 L414 240 L420 274 L380 274 Z" fill="${shade(tie, 0.12)}"/>
      <path d="M384 274 L416 274 L410 ${vB} L400 ${vB + 18} L390 ${vB} Z" fill="${tie}"/>

      <!-- lapels -->
      ${ART._lapel(light, dark)}
      <g transform="translate(800,0) scale(-1,1)">${ART._lapel(light, dark)}</g>
      <path d="M400 546 L400 790" stroke="${dark}" stroke-width="2" opacity=".5"/>

      <!-- sleeves over the body, armhole seam showing -->
      ${ART._sleeve(sleeve, dark, shade(jacket, -0.3), 648)}
      <g transform="translate(800,0) scale(-1,1)">${ART._sleeve(sleeve, dark, shade(jacket, -0.3), 648)}</g>

      <!-- pockets + buttons -->
      <rect x="316" y="614" width="72" height="9" rx="3" fill="${dark}" opacity=".7"/>
      <rect x="412" y="614" width="72" height="9" rx="3" fill="${dark}" opacity=".7"/>
      <rect x="330" y="356" width="46" height="6" rx="3" fill="${dark}" opacity=".45"/>
      <circle cx="400" cy="550" r="8" fill="${shade(jacket, -0.45)}"/>
      <circle cx="400" cy="622" r="8" fill="${shade(jacket, -0.45)}"/>
      <path d="M274 790 L270 820 L530 820 L526 790 Z" fill="${dark}" opacity=".32"/>
    </g>
    ${ART.mark()}
  </svg>`;
};

ART.pants = function (c) {
  const base = c.base, dark = shade(base, -0.24), light = shade(base, 0.1);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
    ${ART.frame(c.bg1 || '#f6f3ec', c.bg2 || '#eae5da')}
    <g filter="url(#soft)">
      <path d="M282 232 L392 232 L384 892 L306 892 Z" fill="${base}"/>
      <path d="M408 232 L518 232 L494 892 L416 892 Z" fill="${base}"/>
      <path d="M392 232 L408 232 L404 470 L396 470 Z" fill="${dark}" opacity=".5"/>
      <path d="M344 246 L338 886" stroke="${light}" stroke-width="3" opacity=".8"/>
      <path d="M456 246 L462 886" stroke="${light}" stroke-width="3" opacity=".8"/>
      <rect x="272" y="176" width="256" height="60" rx="8" fill="${shade(base, -0.1)}"/>
      <rect x="272" y="176" width="256" height="60" rx="8" fill="none" stroke="${dark}" stroke-width="2" opacity=".5"/>
      <rect x="316" y="170" width="12" height="72" rx="4" fill="${dark}" opacity=".55"/>
      <rect x="472" y="170" width="12" height="72" rx="4" fill="${dark}" opacity=".55"/>
      <circle cx="400" cy="206" r="9" fill="${shade(base, -0.45)}"/>
      <path d="M400 240 L400 322" stroke="${dark}" stroke-width="2.5" opacity=".6"/>
      <path d="M296 300 q34 -18 62 4" stroke="${dark}" stroke-width="2" fill="none" opacity=".5"/>
      <path d="M504 300 q-34 -18 -62 4" stroke="${dark}" stroke-width="2" fill="none" opacity=".5"/>
      <path d="M306 892 L384 892 L382 916 L308 916 Z" fill="${dark}" opacity=".4"/>
      <path d="M416 892 L494 892 L492 916 L418 916 Z" fill="${dark}" opacity=".4"/>
    </g>
    ${ART.mark()}
  </svg>`;
};

ART.shirt = function (c) {
  const base = c.base, dark = shade(base, isLight(base) ? -0.14 : -0.28), light = shade(base, 0.14);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
    ${ART.frame(c.bg1 || '#f7f5f0', c.bg2 || '#e9e6de')}
    <g filter="url(#soft)">
      <path d="M400 198 C356 198 316 212 292 232 L280 268 C272 356 270 466 274 566
               L272 812 L528 812 L526 566 C530 466 528 356 520 268 L508 232
               C484 212 444 198 400 198 Z" fill="${base}"
            stroke="${dark}" stroke-width="1.8" stroke-opacity=".3"/>

      <rect x="384" y="228" width="32" height="584" fill="${light}"/>
      <path d="M384 228 L384 812M416 228 L416 812" stroke="${dark}" stroke-width="1.4" opacity=".45"/>

      <path d="M368 206 L400 264 L378 286 L340 230 Z" fill="${light}"/>
      <g transform="translate(800,0) scale(-1,1)"><path d="M368 206 L400 264 L378 286 L340 230 Z" fill="${light}"/></g>
      <path d="M340 204 q60 -22 120 0 l-8 26 q-52 -18 -104 0 Z" fill="${shade(base, -0.1)}"/>

      <path d="M306 380 h70 l-6 72 h-58 Z" fill="none" stroke="${dark}" stroke-width="2" opacity=".5"/>
      ${[300, 372, 444, 516, 588, 660, 732].map(y => `<circle cx="400" cy="${y}" r="6.5" fill="${shade(base, -0.42)}"/>`).join('')}

      ${ART._sleeve(shade(base, isLight(base) ? -0.05 : 0.06), dark, shade(base, -0.16), 786, dark)}
      <g transform="translate(800,0) scale(-1,1)">${ART._sleeve(shade(base, isLight(base) ? -0.05 : 0.06), dark, shade(base, -0.16), 786, dark)}</g>

      <path d="M274 812 L270 840 L530 840 L526 812 Z" fill="${dark}" opacity=".28"/>
    </g>
    ${ART.mark()}
  </svg>`;
};

ART.tie = function (c) {
  const base = c.base, dark = shade(base, -0.3), acc = c.accent || '#c8a24a';
  const blade = 'M356 262 L444 262 L470 726 L400 818 L330 726 Z';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
    ${ART.frame(c.bg1 || '#f6f3ec', c.bg2 || '#eae5da')}
    <defs>
      <pattern id="tiestripe" width="64" height="64" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
        <rect width="64" height="64" fill="${base}"/>
        <rect width="20" height="64" fill="${acc}" opacity=".8"/>
        <rect x="26" width="6" height="64" fill="${shade(base, 0.16)}" opacity=".7"/>
      </pattern>
    </defs>
    <g filter="url(#soft)">
      <!-- neck loop -->
      <path d="M368 150 L358 214 L386 214 L390 150 Z" fill="${shade(base, -0.14)}"/>
      <path d="M432 150 L442 214 L414 214 L410 150 Z" fill="${shade(base, -0.2)}"/>
      <!-- back tail -->
      <path d="M436 268 L472 268 L494 600 L462 618 Z" fill="${dark}" opacity=".3"/>
      <!-- blade -->
      <path d="${blade}" fill="url(#tiestripe)"/>
      <path d="${blade}" fill="none" stroke="${dark}" stroke-width="1.6" opacity=".35"/>
      <path d="M400 268 L400 810" stroke="${dark}" stroke-width="1.2" opacity=".18"/>
      <!-- knot -->
      <path d="M374 196 q26 -12 52 0 l20 66 q-46 -14 -92 0 Z" fill="${shade(base, 0.14)}"/>
      <path d="M374 196 q26 -12 52 0 l20 66 q-46 -14 -92 0 Z" fill="none" stroke="${dark}" stroke-width="1.6" opacity=".4"/>
      <path d="M362 250 q38 -12 76 0" fill="none" stroke="${dark}" stroke-width="2" opacity=".35"/>
    </g>
    ${ART.mark()}
  </svg>`;
};

/* fabric close-up used as the third gallery shot */
ART.fabric = function (c) {
  const base = c.base, dark = shade(base, -0.16), light = shade(base, 0.1);
  const kind = c.weave || 'twill';
  let pattern = '';
  if (kind === 'check') {
    pattern = `<g opacity=".55">
      ${Array.from({ length: 9 }, (_, i) => `<rect x="${i * 96}" y="0" width="26" height="1000" fill="${light}"/>`).join('')}
      ${Array.from({ length: 11 }, (_, i) => `<rect x="0" y="${i * 96}" width="800" height="26" fill="${light}"/>`).join('')}
    </g>`;
  } else if (kind === 'stripe') {
    pattern = `<g opacity=".5">${Array.from({ length: 20 }, (_, i) =>
      `<rect x="${i * 42}" y="-200" width="10" height="1400" fill="${light}" transform="rotate(14 400 500)"/>`).join('')}</g>`;
  } else if (kind === 'plain') {
    pattern = `<g opacity=".28">${Array.from({ length: 40 }, (_, i) =>
      `<rect x="0" y="${i * 25}" width="800" height="12" fill="${light}"/>`).join('')}</g>`;
  } else {
    pattern = `<g opacity=".42">${Array.from({ length: 46 }, (_, i) =>
      `<rect x="-300" y="${i * 26}" width="1400" height="11" fill="${light}" transform="rotate(-34 400 500)"/>`).join('')}</g>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
    <rect width="800" height="1000" fill="${base}"/>
    ${pattern}
    <rect width="800" height="1000" fill="none" stroke="${dark}" stroke-width="60" opacity=".18"/>
    <g transform="translate(400,500)" opacity=".9">
      <circle r="112" fill="#0d0d0d" opacity=".72"/>
      <circle r="112" fill="none" stroke="#c8a24a" stroke-width="1.5"/>
      <circle r="98" fill="none" stroke="#c8a24a" stroke-width="1" opacity=".6"/>
      <text x="0" y="-8" text-anchor="middle" font-family="Georgia,serif" font-size="42" fill="#c8a24a">G.</text>
      <text x="0" y="34" text-anchor="middle" font-family="Georgia,serif" font-size="17" letter-spacing="4" fill="#e7d7ac">FABRIC</text>
    </g>
  </svg>`;
};

function svgURI(svg) {
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.replace(/\s{2,}/g, ' '));
}

/* Build the fallback gallery for a product that has no uploaded photos */
function generatedArt(product) {
  const colors = product.colors && product.colors.length ? product.colors : [{ name: 'Classic', hex: '#2b2f38' }];
  const c0 = colors[0].hex, c1 = (colors[1] || colors[0]).hex;
  const a = product.artOpts || {};
  const mk = (hex, bg1, bg2) => ({ base: hex, accent: a.accent, vest: a.vest, shirt: a.shirt, bg1, bg2 });
  let one, two;
  switch (product.category) {
    case 'three-piece-suits':
      one = ART.suit(mk(c0, '#f6f3ec', '#e8e3d7'), true);
      two = ART.suit(mk(c1, '#f2efe8', '#e2ddd2'), true); break;
    case 'two-piece-suits':
      one = ART.suit(mk(c0, '#f6f3ec', '#e8e3d7'), false);
      two = ART.suit(mk(c1, '#f2efe8', '#e2ddd2'), false); break;
    case 'dress-pants':
      one = ART.pants(mk(c0, '#f7f4ee', '#e9e4d9'));
      two = ART.pants(mk(c1, '#f3f0e9', '#e3ded3')); break;
    case 'dress-shirts':
      one = ART.shirt(mk(c0, '#efe9dd', '#ded7c8'));
      two = ART.shirt(mk(c1, '#eae4d8', '#d8d1c2')); break;
    default:
      one = ART.tie(mk(c0, '#f7f4ee', '#e9e4d9'));
      two = ART.tie(mk(c1, '#f3f0e9', '#e3ded3'));
  }
  const three = ART.fabric({ base: c0, weave: a.weave || 'twill' });
  return [svgURI(one), svgURI(two), svgURI(three)];
}

/* small icons for the category strip */
const CAT_ICON = {
  suit3: `<svg viewBox="0 0 60 70" fill="none"><path d="M30 6 18 11 12 20v42h36V20l-6-9L30 6Z" fill="#0d0d0d"/><path d="M22 11 30 40 38 11" fill="#fff"/><path d="M25 11 30 34 35 11" fill="#c8a24a"/><circle cx="30" cy="44" r="2.4" fill="#c8a24a"/><circle cx="30" cy="52" r="2.4" fill="#c8a24a"/></svg>`,
  suit2: `<svg viewBox="0 0 60 70" fill="none"><path d="M30 6 18 11 12 20v42h36V20l-6-9L30 6Z" fill="#0d0d0d"/><path d="M22 11 30 42 38 11" fill="#fff"/><path d="M28 13h4l2 8-4 16-4-16 2-8Z" fill="#c8a24a"/><circle cx="30" cy="46" r="2.4" fill="#c8a24a"/></svg>`,
  pants: `<svg viewBox="0 0 60 70" fill="none"><rect x="16" y="8" width="28" height="7" rx="2" fill="#c8a24a"/><path d="M17 15h12l-1 47h-9l-2-47Z" fill="#0d0d0d"/><path d="M31 15h12l-2 47h-9l-1-47Z" fill="#0d0d0d"/></svg>`,
  shirt: `<svg viewBox="0 0 60 70" fill="none"><path d="M30 7 20 11l-8 8v43h36V19l-8-8-10-4Z" fill="#0d0d0d"/><path d="M24 11 30 20l6-9-6-4-6 4Z" fill="#fff"/><rect x="28" y="20" width="4" height="42" fill="#c8a24a"/></svg>`,
  tie: `<svg viewBox="0 0 60 70" fill="none"><path d="M24 6h12l4 8H20l4-8Z" fill="#c8a24a"/><path d="M21 16h18l4 34-13 16-13-16 4-34Z" fill="#0d0d0d"/></svg>`
};
