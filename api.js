async function fetchFoods(query = '') {
  return new Promise((resolve) => {
    // Simulate instantaneous local response
    setTimeout(() => {
      const allFoods = window.FOOD_DATASET || [];
      const cleanQuery = query.toLowerCase().trim();

      if (!cleanQuery) {
        resolve(allFoods);
        return;
      }

      const filtered = allFoods.filter(food => 
        food.name.toLowerCase().includes(cleanQuery) ||
        food.category.toLowerCase().includes(cleanQuery) ||
        food.cuisine.toLowerCase().includes(cleanQuery) ||
        food.description.toLowerCase().includes(cleanQuery)
      );

      resolve(filtered);
    }, 100);
  });
}

async function fetchCategories() {
  const categories = Array.from(new Set((window.FOOD_DATASET || []).map(f => f.category)));
  return categories.map(cat => ({ strCategory: cat }));
}
