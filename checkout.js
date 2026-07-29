document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('checkout-form')) {
    initCheckoutPage();
  }
});

function initCheckoutPage() {
  renderCheckoutSummary();
  initPaymentMethodTabs();
  initFormValidation();

  // Listen for cart changes if updated elsewhere
  window.addEventListener('cartUpdated', () => {
    renderCheckoutSummary();
  });
}

function renderCheckoutSummary() {
  const summaryContainer = document.getElementById('checkout-items-list');
  const totalsContainer = document.getElementById('checkout-totals');

  if (!summaryContainer || !totalsContainer) return;

  const cart = cartEngine.cart;
  const calcs = cartEngine.getCalculations();

  if (cart.length === 0) {
    summaryContainer.innerHTML = `<p style="color: var(--text-muted); text-align: center;">Your cart is empty. <a href="menu.html" style="color: var(--primary); text-decoration: underline;">Browse Menu</a></p>`;
    totalsContainer.innerHTML = '';
    const placeBtn = document.getElementById('place-order-btn');
    if (placeBtn) placeBtn.disabled = true;
    return;
  }

  summaryContainer.innerHTML = cart.map(item => `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <img src="${item.strMealThumb}" alt="${item.strMeal}" style="width: 44px; height: 44px; border-radius: 8px; object-fit: cover;">
        <div>
          <h4 style="font-size: 0.95rem; font-weight: 600; margin: 0;">${item.strMeal}</h4>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Qty: ${item.quantity} x $${item.price.toFixed(2)}</span>
        </div>
      </div>
      <span style="font-weight: 700; color: var(--text-main);">$${(item.price * item.quantity).toFixed(2)}</span>
    </div>
  `).join('');

  totalsContainer.innerHTML = `
    <div class="summary-row"><span>Subtotal</span><span>$${calcs.subtotal.toFixed(2)}</span></div>
    <div class="summary-row"><span>Discount</span><span style="color: var(--accent-green);">-$${calcs.discount.toFixed(2)}</span></div>
    <div class="summary-row"><span>Delivery Fee</span><span>${calcs.deliveryFee === 0 ? 'FREE' : '$' + calcs.deliveryFee.toFixed(2)}</span></div>
    <div class="summary-row"><span>GST (5%)</span><span>$${calcs.gst.toFixed(2)}</span></div>
    <div class="summary-row total"><span>Grand Total</span><span style="color: var(--primary);">$${calcs.grandTotal.toFixed(2)}</span></div>
  `;
}

function initPaymentMethodTabs() {
  const paymentOptions = document.querySelectorAll('.payment-option');
  const paymentDetails = document.querySelectorAll('.payment-details');

  paymentOptions.forEach(option => {
    option.addEventListener('click', () => {
      paymentOptions.forEach(opt => opt.classList.remove('active'));
      paymentDetails.forEach(det => det.style.display = 'none');

      option.classList.add('active');
      const method = option.dataset.method;
      const targetDetails = document.getElementById(`payment-${method}`);
      if (targetDetails) {
        targetDetails.style.display = 'block';
      }
    });
  });
}

function initFormValidation() {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const email = document.getElementById('cust-email').value.trim();
    const address = document.getElementById('cust-address').value.trim();
    const city = document.getElementById('cust-city').value.trim();
    const pincode = document.getElementById('cust-pincode').value.trim();

    if (!fullName || !phone || !email || !address || !city || !pincode) {
      showToast('Please fill in all required delivery fields.', 'error');
      return;
    }

    if (phone.length < 8) {
      showToast('Please enter a valid phone number.', 'error');
      return;
    }

    const calcs = cartEngine.getCalculations();
    const activePayment = document.querySelector('.payment-option.active');
    const paymentMethod = activePayment ? activePayment.dataset.method.toUpperCase() : 'CASH ON DELIVERY';

    const orderObj = {
      orderId: 'FH-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleString(),
      customer: { fullName, phone, email, address, city, pincode },
      items: [...cartEngine.cart],
      summary: calcs,
      paymentMethod
    };

    // Save order to history
    saveOrderToHistory(orderObj);

    // Clear active cart
    cartEngine.clearCart();

    // Show Success Modal
    showOrderSuccessModal(orderObj);
  });
}

function saveOrderToHistory(order) {
  try {
    const orders = JSON.parse(localStorage.getItem('foodiehub_orders')) || [];
    orders.unshift(order);
    localStorage.setItem('foodiehub_orders', JSON.stringify(orders));
  } catch (e) {
    console.error('Error saving order:', e);
  }
}

function showOrderSuccessModal(order) {
  const modalOverlay = document.getElementById('order-success-modal');
  if (!modalOverlay) return;

  const orderIdSpan = document.getElementById('success-order-id');
  const amountSpan = document.getElementById('success-total-amount');

  if (orderIdSpan) orderIdSpan.textContent = order.orderId;
  if (amountSpan) amountSpan.textContent = `$${order.summary.grandTotal.toFixed(2)}`;

  modalOverlay.classList.add('active');
}
