# FoodieHub - Premium Online Food Ordering Platform

FoodieHub is a production-quality, responsive Online Food Ordering Web Application inspired by Zomato, Swiggy, and Uber Eats. Built using pure HTML5, CSS3, ES6 Vanilla JavaScript, and LocalStorage without any external framework dependencies.

---

## 🌟 Key Features

### 1. Dedicated Wishlist Engine (`wishlist.html`)
- **Header Wishlist Icon**: Displays a live badge counter (`❤️ 5`) alongside the Cart badge (`🛒 3`).
- **Heart Toggle Persistence**: Clicking the heart on any food card toggles wishlist state, fills the heart red (`#E74C3C`), saves to `localStorage` (`foodiehub_favorites`), and updates all navbar badges immediately.
- **Dedicated Page**: Manage saved items, move items directly from Wishlist to Cart, or clear wishlist items.
- **Empty State Screen**: Displays a user-friendly illustration screen when no items are saved.

### 2. Instant Local Dataset (100 Food Items)
- Built-in dataset in `js/foodData.js` featuring 100 dishes across 16 categories and 7 global cuisines.
- Synchronous instant rendering without external API latency.

### 3. Zomato-Style Menu Page (`menu.html`)
- Interactive popular category chips bar (Pizza, Burger, Biryani, Chinese, etc.).
- Multi-filter sidebar (Category, Cuisine, Price range slider, Veg-only checkbox, Popular-only checkbox, Rating/Price sorting).
- Dynamic heading counter (`Showing 12 of 100 dishes`, `Showing 24 of 100 dishes`).
- 12-item batch pagination with an auto-hiding "Load More" button.

### 4. Equal Height Cards & High Contrast Layout
- Enforced 1200px centered grid (`max-width: 1200px; margin: 0 auto; padding: 0 20px;`).
- All food cards use `height: 100%; object-fit: cover;`.

---

## 📁 Project Structure

```
Food_Order_Final/
├── index.html          # Homepage with Hero, Categories, Featured Foods, Partner Restaurants
├── menu.html           # Full Zomato-style Interactive Menu with Category Chips & 12-card batches
├── about.html          # About Us with 4 Culinary Experts cards (Marco, Sarah, David, Emily)
├── contact.html        # 24/7 Contact page with contact cards & form
├── wishlist.html       # Dedicated Saved Wishlist page with item management & empty state
├── cart.html           # Shopping Cart with promo code SAVER20 and 5% GST computation
├── checkout.html       # Secure Checkout page with cash on delivery / card selection
├── css/
│   ├── style.css       # Core Design System, tokens, grid layouts, card hover animations
│   └── responsive.css  # Mobile drawer queries & responsive breakpoints
├── js/
│   ├── foodData.js     # 100-item offline food dataset
│   ├── search.js       # Live search & filter engine with instant 12-item pagination
│   ├── cart.js         # Cart state engine synced to LocalStorage
│   └── main.js         # Navigation drawer, wishlist badge sync, quick view modal & toasts
└── README.md           # Documentation
```
