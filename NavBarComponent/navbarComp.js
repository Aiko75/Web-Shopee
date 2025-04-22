let allProducts = [];
let currentSort = ''; // lưu giá trị sắp xếp hiện tại

fetch("https://fakestoreapi.com/products")
  .then(res => res.json())
  .then(data => {
    allProducts = data;
    applyAllFilters(); // Hiển thị ban đầu
  });

// ========================== SORT HANDLER ==========================
function handleSortChange(value) {
  currentSort = value;
  applyAllFilters();
}

function sortList(list, type) {
  switch (type) {
    case 'price-asc':
      return [...list].sort((a, b) => a.price - b.price);
    case 'price-desc':
      return [...list].sort((a, b) => b.price - a.price);
    case 'name-asc':
      return [...list].sort((a, b) => a.title.localeCompare(b.title));
    case 'name-desc':
      return [...list].sort((a, b) => b.title.localeCompare(a.title));
    case 'rating-asc':
      return [...list].sort((a, b) => a.rating.rate - b.rating.rate);
    case 'rating-desc':
      return [...list].sort((a, b) => b.rating.rate - a.rating.rate);
    default:
      return list;
  }
}

// ========================== FILTER BY CATEGORY ==========================
const checkboxes = document.querySelectorAll('.category-checkbox');
checkboxes.forEach(cb => cb.addEventListener('change', applyAllFilters));

function getSelectedCategories() {
  return Array.from(checkboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);
}

// ========================== FILTER BY PRICE ==========================
function getPriceRange() {
  const min = parseFloat(document.getElementById("minValue")?.value || 0);
  const max = parseFloat(document.getElementById("maxValue")?.value || Infinity);
  return { min, max };
}

// ========================== MASTER FILTER FUNCTION ==========================
function applyAllFilters() {
  const { min, max } = getPriceRange();
  const categories = getSelectedCategories();

  let filtered = allProducts;

  // Lọc theo category (nếu có chọn)
  if (categories.length > 0) {
    filtered = filtered.filter(product => categories.includes(product.category.replace("jewelery", "jewelry")));
  }

  // Lọc theo khoảng giá
  filtered = filtered.filter(product => product.price >= min && product.price <= max);

  // Sắp xếp cuối cùng
  const sorted = sortList(filtered, currentSort);

  const flex = document.querySelector('.product-flex');
  if (sorted.length === 0) {
    flex.innerHTML = "<p>There is no suitable result!</p>";
    return;
  }

  renderProducts(sorted);
}

// ========================== RENDER ==========================
function renderProducts(list) {
  const flex = document.querySelector('.product-flex');
  flex.innerHTML = '';

  list.forEach(item => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <div class="product-info">
        <h2>${item.title}</h2>
        <p class="price">$${item.price.toLocaleString()}</p>
        <p class="rating">${item.rating.rate}⭐ (${item.rating.count} reviews)</p>
        <button class="buy-btn">Buy</button>
      </div>
    `;
    flex.appendChild(card);
  });
}
