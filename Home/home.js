
document.getElementById("searchbtn").addEventListener("click", () => {
    window.location.href = "../NavBar/search.html";
  });

// ------- PHẦN MỚI: Fetch và render sản phẩm -------
document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("product-list");
    if (!productList) {
      console.error("Element #product-list không tìm thấy");
      return;
    }
  
    fetch("https://fakestoreapi.com/products")
      .then(res => res.json())
      .then(products => {
        products.forEach(product => {
          const card = document.createElement("div");
          card.className = "product-card";
          card.innerHTML = `
            <img src="${product.image}" 
                 alt="${product.title}" 
                 class="product-image clickable" />
            <h3 class="product-title clickable">${product.title}</h3>
            <p class="product-price">${product.price}$</p>
          `;
          // Click ảnh/tên → chuyển trang detail
          card.querySelectorAll(".clickable").forEach(el => {
            el.addEventListener("click", () => {
              localStorage.setItem("selectedProductId", product.id);
              window.location.href = "../Product/product.html";
            });
          });
          productList.appendChild(card);
        });
      })
      .catch(err => console.error("Lỗi fetch products:", err));
  });
  
  const searchInput = document.querySelector('#searchform input');
  const searchForm = document.getElementById('searchform');

if (searchForm) {
  searchForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Ngăn reload form

    const keyword = searchInput.value.trim();
    if (keyword) {
      window.location.href = `../NavBar/search.html?keyword=${encodeURIComponent(keyword)}`;
    }
  });
}
  const suggestionBox = document.getElementById('suggestionBox');
  let products = [];
  
  // Fetch dữ liệu từ Fake Store API một lần khi load
  fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(data => {
      products = data;
    })
  // Xử lý sự kiện khi nhập ký tự
  searchInput.addEventListener('input', () => {
    const value = searchInput.value.trim().toLowerCase();
    suggestionBox.innerHTML = '';
  
    if (!value) {
      suggestionBox.style.display = 'none';
      return;
    }
  
    let filtered = [];
  
    if (value.length === 1) {
      // Ưu tiên: ký tự đầu từ → ký tự nằm bên trong
      const startsWithChar = products.filter(p =>
        p.title.toLowerCase().startsWith(value)
      );
      const containsChar = products.filter(p =>
        !p.title.toLowerCase().startsWith(value) &&
        p.title.toLowerCase().includes(value)
      );
      filtered = [...startsWithChar, ...containsChar];
    } else {
      // Ưu tiên: chuỗi ở đầu → chuỗi nằm giữa
      const startsWithStr = products.filter(p =>
        p.title.toLowerCase().startsWith(value)
      );
      const containsStr = products.filter(p =>
        !p.title.toLowerCase().startsWith(value) &&
        p.title.toLowerCase().includes(value)
      );
      filtered = [...startsWithStr, ...containsStr];
    }
  
    // Giới hạn số lượng gợi ý hiển thị
    filtered = filtered.slice(0, 5);
  
    if (filtered.length === 0) {
      suggestionBox.style.display = 'none';
      return;
    }
  
    filtered.forEach(product => {
      const div = document.createElement('div');
      div.classList.add('suggestion-item');
      div.innerHTML = `
        <img id="suggest-img-${product.id}" src="${product.image}" alt="${product.title}">
        <div class="suggestion-details">
            <strong id="suggest-title-${product.id}">${product.title}</strong>
            <span id="suggest-category-${product.id}">${product.category}</span>
            <span id="suggest-price-${product.id}" style="color: green; font-weight: bold;">$${product.price}</span>
            <span id="suggest-rating-${product.id}">${product.rating.rate} ⭐</span>
        </div>
      `;
      div.addEventListener('click', () => {
        localStorage.setItem("selectedProductId", product.id);
        window.location.href = "../Product/product.html";
    });
      suggestionBox.appendChild(div);
    });
  
    suggestionBox.style.display = 'block';
  });
  
  // Ẩn gợi ý khi click ngoài
  document.addEventListener('click', (e) => {
    if (!document.getElementById('searchform').contains(e.target)) {
      suggestionBox.style.display = 'none';
    }
  });
