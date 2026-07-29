class SearchFilterEngine {
  constructor() {
    this.allFoods = [];
    this.filteredFoods = [];
    this.currentQuery = '';
    this.currentCategory = 'All';
    this.currentCuisine = 'All';
    this.maxPrice = 50;
    this.vegOnly = false;
    this.popularOnly = false;
    this.sortBy = 'default';

    // Pagination: 12 cards per batch
    this.pageSize = 12;
    this.currentPage = 1;
  }

  setFoods(foods) {
    this.allFoods = foods || [];
    this.currentPage = 1;
    this.applyFilters();
  }

  setQuery(query) {
    this.currentQuery = query.toLowerCase().trim();
    this.currentPage = 1;
    this.applyFilters();
  }

  setCategory(cat) {
    this.currentCategory = cat;
    this.currentPage = 1;
    this.applyFilters();
  }

  setCuisine(cuisine) {
    this.currentCuisine = cuisine;
    this.currentPage = 1;
    this.applyFilters();
  }

  setMaxPrice(price) {
    this.maxPrice = parseFloat(price);
    this.currentPage = 1;
    this.applyFilters();
  }

  setVegOnly(isVeg) {
    this.vegOnly = isVeg;
    this.currentPage = 1;
    this.applyFilters();
  }

  setPopularOnly(isPopular) {
    this.popularOnly = isPopular;
    this.currentPage = 1;
    this.applyFilters();
  }

  setSortBy(sortOption) {
    this.sortBy = sortOption;
    this.applyFilters();
  }

  loadMore() {
    this.currentPage++;
    this.notifyListeners();
  }

  applyFilters() {
    this.filteredFoods = this.allFoods.filter(food => {
      // 1. Query Search
      const matchesQuery = !this.currentQuery || 
        food.name.toLowerCase().includes(this.currentQuery) ||
        food.category.toLowerCase().includes(this.currentQuery) ||
        food.cuisine.toLowerCase().includes(this.currentQuery) ||
        food.description.toLowerCase().includes(this.currentQuery);

      // 2. Category
      const matchesCategory = this.currentCategory === 'All' || food.category === this.currentCategory;

      // 3. Cuisine
      const matchesCuisine = this.currentCuisine === 'All' || food.cuisine === this.currentCuisine;

      // 4. Price
      const matchesPrice = food.price <= this.maxPrice;

      // 5. Veg Only
      const isVeg = food.veg !== undefined ? food.veg : food.isVeg;
      const matchesVeg = !this.vegOnly || isVeg;

      // 6. Popular Only
      const isPopular = food.popular !== undefined ? food.popular : food.isPopular;
      const matchesPopular = !this.popularOnly || isPopular;

      return matchesQuery && matchesCategory && matchesCuisine && matchesPrice && matchesVeg && matchesPopular;
    });

    // Sorting
    if (this.sortBy === 'rating-desc') {
      this.filteredFoods.sort((a, b) => b.rating - a.rating);
    } else if (this.sortBy === 'price-asc') {
      this.filteredFoods.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'price-desc') {
      this.filteredFoods.sort((a, b) => b.price - a.price);
    }

    this.notifyListeners();
  }

  notifyListeners() {
    const maxVisible = this.currentPage * this.pageSize;
    const paginatedFoods = this.filteredFoods.slice(0, maxVisible);
    const hasMore = paginatedFoods.length < this.filteredFoods.length;

    window.dispatchEvent(new CustomEvent('searchFiltersUpdated', { 
      detail: { 
        foods: paginatedFoods, 
        visibleCount: paginatedFoods.length,
        totalCount: this.filteredFoods.length, 
        hasMore: hasMore 
      } 
    }));
  }
}

window.searchEngine = new SearchFilterEngine();
