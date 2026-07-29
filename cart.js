const CART_STORAGE_KEY = 'foodiehub_cart';
const COUPON_STORAGE_KEY = 'foodiehub_coupon';

class CartEngine {
  constructor() {
    this.cart = this.loadCart();
    this.appliedCoupon = this.loadCoupon();
    this.init();
  }

  init() {
    this.updateCartBadge();
    window.addEventListener('storage', () => {
      this.cart = this.loadCart();
      this.updateCartBadge();
      this.notifyListeners();
    });
  }

  loadCart() {
    try {
      const data = localStorage.getItem(CART_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading cart state:', e);
      return [];
    }
  }

  saveCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cart));
    this.updateCartBadge();
    this.notifyListeners();
  }

  loadCoupon() {
    return localStorage.getItem(COUPON_STORAGE_KEY) || null;
  }

  saveCoupon(code) {
    if (code) {
      localStorage.setItem(COUPON_STORAGE_KEY, code);
    } else {
      localStorage.removeItem(COUPON_STORAGE_KEY);
    }
    this.appliedCoupon = code;
    this.notifyListeners();
  }

  addItem(meal, quantity = 1) {
    const mealId = meal.id || meal.idMeal;
    const mealName = meal.name || meal.strMeal;
    const mealThumb = meal.image || meal.strMealThumb;
    const mealCategory = meal.category || meal.strCategory || 'General';

    const existingIndex = this.cart.findIndex(item => item.id === mealId || item.idMeal === mealId);
    
    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({
        id: mealId,
        idMeal: mealId,
        name: mealName,
        strMeal: mealName,
        image: mealThumb,
        strMealThumb: mealThumb,
        price: parseFloat(meal.price),
        quantity: quantity,
        category: mealCategory,
        strCategory: mealCategory
      });
    }

    this.saveCart();
    if (window.showToast) {
      window.showToast(`Added "${mealName}" to your cart!`, 'success');
    }
  }

  updateQuantity(id, change) {
    const item = this.cart.find(i => i.id === id || i.idMeal === id);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        this.removeItem(id);
      } else {
        this.saveCart();
      }
    }
  }

  removeItem(id) {
    const item = this.cart.find(i => i.id === id || i.idMeal === id);
    this.cart = this.cart.filter(i => i.id !== id && i.idMeal !== id);
    this.saveCart();
    if (item && window.showToast) {
      window.showToast(`Removed "${item.name || item.strMeal}" from cart`, 'error');
    }
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
    this.saveCoupon(null);
  }

  applyCoupon(code) {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'SAVER20') {
      this.saveCoupon('SAVER20');
      return { success: true, message: '20% Discount applied successfully!' };
    } else if (cleanCode === 'FREEDEL') {
      this.saveCoupon('FREEDEL');
      return { success: true, message: 'Free Delivery applied!' };
    } else {
      return { success: false, message: 'Invalid coupon code. Try SAVER20 or FREEDEL' };
    }
  }

  getCalculations() {
    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discount = 0;
    let deliveryFee = subtotal > 30 || subtotal === 0 ? 0 : 5.00;

    if (this.appliedCoupon === 'SAVER20') {
      discount = subtotal * 0.20;
    } else if (this.appliedCoupon === 'FREEDEL') {
      deliveryFee = 0;
    }

    const gst = (subtotal - discount) * 0.05;
    const grandTotal = Math.max(0, subtotal - discount + deliveryFee + gst);

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      discount: parseFloat(discount.toFixed(2)),
      deliveryFee: parseFloat(deliveryFee.toFixed(2)),
      gst: parseFloat(gst.toFixed(2)),
      grandTotal: parseFloat(grandTotal.toFixed(2)),
      itemCount: this.cart.reduce((total, i) => total + i.quantity, 0)
    };
  }

  updateCartBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    const totalCount = this.cart.reduce((total, item) => total + item.quantity, 0);
    badges.forEach(badge => {
      badge.textContent = totalCount;
      badge.style.display = totalCount > 0 ? 'flex' : 'none';
    });
  }

  notifyListeners() {
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: this.getCalculations() }));
  }
}

window.cartEngine = new CartEngine();
