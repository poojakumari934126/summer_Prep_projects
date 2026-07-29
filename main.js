document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initFavoritesSystem();
  initScrollTopBtn();
  initQuickViewModal();
  updateWishlistBadge();
});

// Sync Badges on Storage Events
window.addEventListener('storage', (e) => {
  if (e.key === 'foodiehub_favorites') {
    updateWishlistBadge();
    window.dispatchEvent(new CustomEvent('wishlistUpdated'));
  }
});

/* --------------------------------------------------------------------------
   1. WISHLIST BADGE ENGINE
   -------------------------------------------------------------------------- */
function updateWishlistBadge() {
  const favs = JSON.parse(localStorage.getItem('foodiehub_favorites')) || [];
  const badges = document.querySelectorAll('.wishlist-badge');
  badges.forEach(badge => {
    badge.textContent = favs.length;
  });
}

function initFavoritesSystem() {
  updateWishlistBadge();
}

function toggleFavorite(id) {
  let favs = JSON.parse(localStorage.getItem('foodiehub_favorites')) || [];
  const numId = typeof id === 'number' ? id : parseInt(id, 10);
  const targetId = isNaN(numId) ? id : numId;

  const index = favs.findIndex(item => item === targetId || String(item) === String(targetId));

  if (index > -1) {
    favs.splice(index, 1);
    showToast('Removed from Wishlist', 'error');
  } else {
    favs.push(targetId);
    showToast('Added to Wishlist ❤️', 'success');
  }

  localStorage.setItem('foodiehub_favorites', JSON.stringify(favs));
  updateWishlistBadge();
  window.dispatchEvent(new CustomEvent('wishlistUpdated'));

  // Update Heart Icons on page
  document.querySelectorAll(`.fav-btn[data-id="${targetId}"]`).forEach(btn => {
    if (index > -1) {
      btn.classList.remove('active');
    } else {
      btn.classList.add('active');
    }
  });
}

/* --------------------------------------------------------------------------
   2. MOBILE NAVIGATION DRAWER
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = hamburgerBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });

    document.addEventListener('click', (e) => {
      if (!hamburgerBtn.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        const icon = hamburgerBtn.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      }
    });
  }
}

/* --------------------------------------------------------------------------
   3. SCROLL TO TOP BUTTON
   -------------------------------------------------------------------------- */
function initScrollTopBtn() {
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* --------------------------------------------------------------------------
   4. TOAST NOTIFICATION ENGINE
   -------------------------------------------------------------------------- */
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');

  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const iconClass = type === 'success' ? 'fa-check-circle' : 'fa-info-circle';
  const iconColor = type === 'success' ? 'var(--accent-green)' : '#E74C3C';

  toast.innerHTML = `
    <i class="fas ${iconClass}" style="color: ${iconColor}; font-size: 1.2rem;"></i>
    <span style="font-weight: 500; font-size: 0.95rem;">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 2800);
}

/* --------------------------------------------------------------------------
   5. QUICK VIEW MODAL
   -------------------------------------------------------------------------- */
function initQuickViewModal() {
  const modal = document.getElementById('quick-view-modal');
  const closeBtn = document.getElementById('modal-close-btn');

  if (modal && closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }
}

function openQuickView(meal) {
  const modal = document.getElementById('quick-view-modal');
  const modalBody = document.getElementById('modal-body');

  if (!modal || !modalBody || !meal) return;

  const favs = JSON.parse(localStorage.getItem('foodiehub_favorites')) || [];
  const isFav = favs.includes(meal.id);
  const isVeg = meal.veg !== undefined ? meal.veg : meal.isVeg;
  const prepTime = meal.time || meal.preparationTime || '20 min';

  modalBody.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: center;">
      <div style="position: relative;">
        <img src="${meal.image}" alt="${meal.name}" style="width: 100%; height: 260px; object-fit: cover; border-radius: var(--radius-md);">
        <span class="badge ${isVeg ? 'badge-green' : 'badge-primary'}" style="position: absolute; top: 12px; left: 12px;">
          ${isVeg ? 'Veg 🌱' : 'Non-Veg 🍗'}
        </span>
      </div>
      <div>
        <span style="color: var(--primary); font-size: 0.85rem; font-weight: 700; text-transform: uppercase;">${meal.category} • ${meal.cuisine}</span>
        <h2 style="font-size: 1.6rem; font-weight: 800; margin: 6px 0 10px 0;">${meal.name}</h2>
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 14px;">
          <span class="rating-badge"><i class="fas fa-star"></i> ${meal.rating}</span>
          <span style="font-size: 0.85rem; color: var(--text-muted);"><i class="far fa-clock"></i> ${prepTime}</span>
        </div>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 18px;">${meal.description || 'Delicious gourmet meal cooked fresh to order using finest organic ingredients.'}</p>
        <div style="font-size: 1.8rem; font-weight: 800; color: var(--primary); margin-bottom: 20px;">$${meal.price.toFixed(2)}</div>
        <div style="display: flex; gap: 12px;">
          <button class="btn btn-primary" onclick='cartEngine.addItem(${JSON.stringify(meal).replace(/'/g, "&apos;")}); document.getElementById("quick-view-modal").classList.remove("active");'>
            <i class="fas fa-shopping-bag"></i> Add to Cart
          </button>
          <button class="btn btn-secondary fav-btn ${isFav ? 'active' : ''}" data-id="${meal.id}" onclick="toggleFavorite('${meal.id}')" title="Wishlist">
            <i class="fas fa-heart"></i>
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
}
