/* ==========================================================================
   G.GORGEOUS — cart page
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  mountChrome('cart');
  render();
  suggestions();
});

function render() {
  const t = cartTotals();
  $('#cart-sub').textContent = t.lines.length
    ? `${cartCount()} item${cartCount() > 1 ? 's' : ''} ready to go`
    : '';

  if (!t.lines.length) {
    $('#cart-wrap').innerHTML = `<div class="empty-state">
      <h3>Your cart is empty</h3>
      <p>Nothing added yet — the collection is waiting.</p>
      <a class="btn" href="index.html#shop">Browse the collection</a>
    </div>`;
    return;
  }

  $('#cart-wrap').innerHTML = `
    <div class="cart-layout">
      <div>
        ${t.lines.map(l => {
          const max = sizeStock(l.product, l.size);
          return `<div class="cart-row">
            <a class="cart-img" href="product.html?id=${l.productId}"><img src="${productCover(l.product)}" alt=""></a>
            <div>
              <h4><a href="product.html?id=${l.productId}">${esc(l.product.name)}</a></h4>
              <div class="cart-opts">
                <span>${esc(l.color || '—')}</span>
                <span>Size ${esc(l.size)}</span>
                <span>${esc(l.product.sku || '')}</span>
              </div>
              <div class="flex items-center gap-16 wrap-flex">
                <div class="qty-picker">
                  <button data-dec="${l.index}" aria-label="Decrease">−</button>
                  <input type="number" value="${l.qty}" min="1" max="${max}" data-qty="${l.index}">
                  <button data-inc="${l.index}" aria-label="Increase">+</button>
                </div>
                <span class="muted" style="font-size:.8rem">${money(l.unit)} each</span>
              </div>
              <div class="cart-actions" style="margin-top:10px">
                <button class="link-btn" data-rm="${l.index}">Remove</button>
                <button class="link-btn" data-fav="${l.productId}" style="text-decoration:underline">Save to favourites</button>
                ${max <= 3 ? `<span class="badge badge-warn">Only ${max} left</span>` : ''}
              </div>
            </div>
            <div class="line-total">${money(l.lineTotal)}</div>
          </div>`;
        }).join('')}

        <div class="flex between items-center mt-24 wrap-flex gap-12">
          <a class="btn btn-ghost btn-sm" href="index.html#shop">← Continue shopping</a>
          <button class="link-btn" id="clear-cart">Clear cart</button>
        </div>
      </div>

      <aside class="summary">
        <h3>Order Summary</h3>

        <div class="promo">
          <input type="text" id="promo-input" placeholder="Promo code" value="${esc(t.promoCode || '')}">
          <button class="btn btn-sm" id="promo-apply">Apply</button>
        </div>
        ${t.promo ? `<p class="hint" style="color:var(--ok)">✓ ${esc(t.promoCode)} applied — ${esc(t.promo.label)}</p>`
                  : `<p class="hint">Try <b>GG10</b>, <b>GORGEOUS</b> or <b>SHADI25</b></p>`}

        <div class="sum-row"><span class="muted">Subtotal</span><span>${money(t.subtotal)}</span></div>
        ${t.discount ? `<div class="sum-row"><span class="muted">Discount</span><span style="color:var(--ok)">− ${money(t.discount)}</span></div>` : ''}
        <div class="sum-row"><span class="muted">Delivery</span><span>${t.shipping ? money(t.shipping) : 'Free'}</span></div>
        ${t.shipping ? `<p class="hint">Add ${money(SITE.freeShipOver - (t.subtotal - t.discount))} more for free delivery</p>` : ''}
        <div class="sum-row total"><span>Total</span><span>${money(t.total)}</span></div>

        <a class="btn btn-gold btn-block mt-24" href="checkout.html">Proceed to checkout</a>
        <p class="hint center mt-16">Cash on delivery available · 7-day exchange</p>
      </aside>
    </div>`;

  bind();
}

function bind() {
  $$('[data-inc]').forEach(b => b.onclick = () => {
    const i = +b.dataset.inc;
    setCartQty(i, getCart()[i].qty + 1); render();
  });
  $$('[data-dec]').forEach(b => b.onclick = () => {
    const i = +b.dataset.dec;
    const line = getCart()[i];
    if (line.qty <= 1) { removeCartLine(i); toast('Item removed'); }
    else setCartQty(i, line.qty - 1);
    render();
  });
  $$('[data-qty]').forEach(inp => inp.onchange = () => {
    setCartQty(+inp.dataset.qty, parseInt(inp.value) || 1); render();
  });
  $$('[data-rm]').forEach(b => b.onclick = () => {
    removeCartLine(+b.dataset.rm); toast('Item removed'); render();
  });
  $('#clear-cart').onclick = () => confirmBox('Clear the cart?', 'This removes every item from your cart.', () => {
    clearCart(); toast('Cart cleared'); render();
  }, 'Clear cart');

  $('#promo-apply').onclick = () => {
    const code = $('#promo-input').value.trim().toUpperCase();
    if (!code) { setPromo(null); toast('Promo removed'); return render(); }
    if (PROMOS[code]) { setPromo(code); toast(`Promo applied — ${PROMOS[code].label}`); }
    else { setPromo(null); toast('That code is not valid', 'err'); }
    render();
  };
}

function suggestions() {
  const inCart = new Set(getCart().map(l => l.productId));
  const list = getProducts()
    .filter(p => !inCart.has(p.id) && (p.category === 'ties' || p.category === 'dress-shirts'))
    .slice(0, 4);
  if (!list.length) { $('#cart-suggest').style.display = 'none'; return; }
  $('#suggest-grid').innerHTML = list.map(productCard).join('');
}
