document.addEventListener("click", function (e) {
  const menu = document.getElementById("menu");
  const dropdown = document.querySelector(".menudrop");

  if (!menu.contains(e.target)) {
      dropdown.style.display = "none";
  }
});

document.getElementById("logo").addEventListener("click", (event) => {
  event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ a
  window.location.href = "../Home/home.html";
});

document.getElementById("search").addEventListener("click", (event) => {
  event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ a
  window.location.href = "../Search/search.html";
});


document.getElementById("cart").addEventListener("click", (event) => {
  event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ a
  window.location.href = "../Cart/cart.html";
});

document.getElementById("login").addEventListener("click", (event) => {
  event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ a
  window.location.href = "../Person/log_in.html";
});

const searchInput = document.querySelector('#searchform input');
const suggestionBox = document.getElementById('suggestionBox');
let products = [];

// Fetch dữ liệu từ Fake Store API một lần khi load
fetch('https://fakestoreapi.com/products')
  .then(res => res.json())
  .then(data => {
    products = data;
  });

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

document.getElementById("product-details").innerHTML = "<p>Loading...</p>";

// Lấy ID sản phẩm đã chọn từ localStorage
const selectedProductId = localStorage.getItem("selectedProductId");

const comments = [
  { commentId: 1, productId: "1", author: "Nam", star: "4.5", text: "Good product!" },
  { commentId: 2, productId: "1", author: "Linh", star: "3.0", text: "Good price, good quality" },
  { commentId: 3, productId: "1", author: "Huy", star: "2.5", text: "Hope to buy this again!" }
];

let displayedCommentsCount = 3; // Số lượng bình luận hiển thị ban đầu

function renderComments() {
  const commentList = document.getElementById("comments-list-all");
  const showMoreButton = document.getElementById("show-more-comments");
  const showLessButton = document.getElementById("show-less-comments");
  commentList.innerHTML = "";

  if (comments.length === 0) {
      commentList.innerHTML = "<li>There is no comment.</li>";
      showMoreButton.style.display = "none"; // Ẩn nút nếu không có bình luận
      showLessButton.style.display = "none"; // Ẩn nút nếu không có bình luận
      return;
  }

  const commentsToDisplay = comments.slice(0, displayedCommentsCount); // Lấy 3 bình luận đầu tiên hoặc số lượng đã hiển thị

  commentsToDisplay.forEach(c => {
      const li = document.createElement("li");
      li.innerHTML = `
          <img src="https://pbs.twimg.com/media/FkbajedXgAE1BuG?format=jpg&name=4096x4096" alt="User" class="user-image"/>
          <strong class="user-name">${c.author}</strong><br/>
          <span>Rates: ${c.star} ⭐</span><br/>
          <strong>Comment</strong>: ${c.text}
          `;
      commentList.appendChild(li);
  });
  if (comments.length > displayedCommentsCount) {
      showMoreButton.style.display = "block"; // Hiển thị nút nếu có nhiều bình luận hơn
  } else {
      showMoreButton.style.display = "none"; // Ẩn nút nếu không còn bình luận để xem thêm
  }
   // Hiển thị nút "Ẩn bớt" nếu đã hiển thị nhiều hơn 3 bình luận
  if (displayedCommentsCount > 3) {
      showLessButton.style.display = "block";
  } else {
      showLessButton.style.display = "none";
  }
}

// Load saved comments from localStorage if any
const savedComments = localStorage.getItem("comments");
if (savedComments) {
  const parsedComments = JSON.parse(savedComments);
  if (Array.isArray(parsedComments)) {
      // Replace the in-memory comments array with saved ones
      while(comments.length > 0) {
          comments.pop();
      }
      parsedComments.forEach(c => comments.push(c));
  }
}

const CART_KEY = 'cart';                                             // Khóa lưu giỏ hàng trong localStorage
function saveCart(arr) {
 localStorage.setItem(CART_KEY, JSON.stringify(arr)); 
}

let currentProduct = null;

let relatedProductsFetched = false; // Thêm lại flag để chắc chắn chỉ fetch related 1 lần

// Fetch sản phẩm từ API dựa theo ID (CHỈ GỌI MỘT LẦN)
if (selectedProductId) {
  fetch(`https://fakestoreapi.com/products/${selectedProductId}`)
      .then(res => res.json())
      .then(product => {
          console.log("Product loaded:", product.id, typeof product.id);
          currentProduct = product;
          displayProductDetails(product); // Hiển thị thông tin sản phẩm
          if (!relatedProductsFetched) {
              fetchRelatedProducts(product.category); // Tải sản phẩm liên quan
              relatedProductsFetched = true;
          }
      })
      .catch(error => {
          console.error('Error fetching product:', error);
          document.getElementById("product-details").innerHTML =
              `<p class="error">Product not found!</p>`;
      });
} else {
  document.getElementById("product-details").innerHTML =
      '<p class="error">Không tìm thấy sản phẩm</p>';
}

// Tạo hàm để hiển thị chi tiết sản phẩm
function displayProductDetails(product) {
  const productDetails = document.getElementById("product-details");
  productDetails.innerHTML = `
      <div class="product-container">
          <img src="${product.image}" alt="${product.title}" class="product-image"/>
          <div class="product-info">
              <h2>${product.title}</h2>
              <p class="price">$${product.price.toFixed(2)}</p>
              <p class="category">Category: ${product.category}</p>
              <p class="description">Description: ${product.description}</p>
              Number of items:
              <input type="number" min="1" value="1" class="quantity-input" id="quantity-${product.id}"/>
              <p class="stock">In stock: ${product.stock || Math.floor(Math.random() * 50 + 1)}</p>
              <p class="rating">Rating: ${product.rating.rate} ⭐ (${product.rating.count} reviews)</p>
              <div class="button-container">
                  <button onclick="addToCart(${product.id})">Add to cart</button>
                  <button onclick="buyNow(${product.id})">Buy now</button>
              </div>
          </div>
      </div>

  <div class="comments-container">
      <h1>Comments</h1>
      <h3 class="rating">Rating: ${product.rating.rate} ⭐ (${product.rating.count} reviews)</h3>
      <form onsubmit="addComment(event, ${product.id})" class="comment-form">
          <div class="form-row">
              <label for="comment-author-${product.id}">Name:</label>
              <input
              type="text"
              id="comment-author-${product.id}"
              class="comment-name"
              placeholder="Your name"
              required
              />
          </div>

          <div class="form-row">
              <label for="rating-${product.id}">Rates:</label>
              <input
              type="number"
              id="rating-${product.id}"
              class="rating-input"
              min="1"
              max="5"
              value="1"
              step="0.1"
              required
              />
          </div>

          <div class="form-row">
              <label for="comment-text-${product.id}">Comment:</label>
              <input
              type="text"
              id="comment-text-${product.id}"
              class="comment-text"
              placeholder="Write comment..."
              required
              />
          </div>

          <div class="form-row">
              <button type="submit" class="comment-submit">Send</button>
          </div>
      </form>
      <ul class="comments-list" id="comments-list-all"></ul>
      <button id="show-more-comments" class="show-more-button">Show more comments</button>
      <button id="show-less-comments" class="show-less-button">Show less comments</button>
  </div>

  <div class="related-products">
      <h1>Related Products</h1>
      <div class="related-products-list" id="related-products-list"></div>
  </div>
  `;
   // ✅ Chạy sau khi HTML đã render xong
  renderComments();

   // ✅ Thêm trình lắng nghe sự kiện cho nút "Thêm bình luận"
  const showMoreButton = document.getElementById("show-more-comments");
  if (showMoreButton) {
      showMoreButton.addEventListener('click', function() {
          console.log("Show more comments button clicked");
          displayedCommentsCount += 3; // Tăng số lượng bình luận hiển thị thêm 3
          renderComments(); // Gọi lại hàm render để hiển thị thêm bình luận
      });
  }

   // ✅ Thêm trình lắng nghe sự kiện cho nút "Ẩn bớt"
  const showLessButton = document.getElementById("show-less-comments");
  if (showLessButton) {
      showLessButton.addEventListener('click', function() {
          console.log("Show less comments button clicked");
          displayedCommentsCount = 3; // Đặt lại số lượng bình luận hiển thị về 3
          renderComments();
      });
  }
  console.log("Product ID:", product.id, "Type:", typeof product.id);
}

function addComment(event, productId) {
  event.preventDefault();
  const authorInput = document.getElementById(`comment-author-${productId}`);
  const textInput = document.getElementById(`comment-text-${productId}`);
  const ratingInput = document.getElementById(`rating-${productId}`);
  const ratingValue = parseFloat(ratingInput.value); // Chuyển giá trị input thành số thực

  let formattedRating = "";
   if (!isNaN(ratingValue)) {
  formattedRating = ratingValue.toFixed(1); // Định dạng với một chữ số thập phân
   } else {
  formattedRating = "0.0"; // Hoặc một giá trị mặc định khác nếu input không hợp lệ
   }

  // Create a new comment with a generated id based on current array length
  const newComment = {
      commentId: comments.length + 1,
      star: formattedRating,
      productId: productId,
      author: authorInput.value,
      text: textInput.value
  };

  // Add new comment to the array
  comments.push(newComment);

  // Save updated comments to localStorage
  localStorage.setItem("comments", JSON.stringify(comments));
  console.log("New comment added:", newComment);

  // Render updated comment list to show it immediately
  renderComments();

  // Reset input
  authorInput.value = "";
  textInput.value = "";
}

const RELATED_PRODUCTS_PER_LOAD = 2;
let relatedProductsPage = 1;
let currentProductCategory = "";
let allRelatedProducts = [];  // sẽ chứa toàn bộ sản phẩm của 1 category


function fetchRelatedProducts(category) {
  currentProductCategory = category;
  relatedProductsPage = 1;
  allRelatedProducts = [];
  const list = document.getElementById("related-products-list");
  list.innerHTML = "";     // xóa hết cũ
  // fetch không limit, lấy tất
  fetch(`https://fakestoreapi.com/products/category/${category}`)
      .then(res => res.json())
      .then(products => {
          allRelatedProducts = products;
          console.log("Số lượng sản phẩm liên quan:", allRelatedProducts.length); // Thêm dòng này
          renderPageRelatedProducts();
          renderLoadMoreButton();
      })
    .catch(err => {
      console.error(err);
      list.innerHTML = '<p class="error">Cannot load these related-products.</p>';
    });
}


function renderPageRelatedProducts() {
  const list = document.getElementById("related-products-list");
  const start = (relatedProductsPage - 1) * RELATED_PRODUCTS_PER_LOAD;
  const end = start + RELATED_PRODUCTS_PER_LOAD;
  // chỉ render items trong slice
  allRelatedProducts.slice(start, end)
    .forEach(product => {
      const div = document.createElement("div");
      div.classList.add("related-product-item");
      div.innerHTML = `
        <img src="${product.image}" alt="${product.title}" class="related-product-image"/>
        <h3 class="related-product-title">${product.title}</h3>
        <p class="related-product-category">${product.category}</p>
        <p class="related-product-price">$${product.price.toFixed(2)}</p>
      `;
      list.appendChild(div);
    });
}


function renderLoadMoreButton() {
  const list = document.getElementById("related-products-list");

  // Manage "Load More" button
  if (allRelatedProducts.length > relatedProductsPage * RELATED_PRODUCTS_PER_LOAD) {
      let btn = document.getElementById("load-more-related");
      if (!btn) {
          btn = document.createElement("button");
          btn.id = "load-more-related";
          btn.classList.add("show-more-button");
          btn.textContent = "Show more related products";
          btn.addEventListener('click', loadMoreRelatedProducts);
          list.appendChild(btn);
      } else {
          btn.style.display = "block";
      }
  } else {
      const btn = document.getElementById("load-more-related");
      if (btn) btn.style.display = "none";
  }

  // Manage "Show Less" button
  if (relatedProductsPage > 1) {
      let btnLess = document.getElementById("show-less-related");
      if (!btnLess) {
          btnLess = document.createElement("button");
          btnLess.id = "show-less-related";
          btnLess.classList.add("show-less-button");
          btnLess.textContent = "Show less related products";
          btnLess.addEventListener('click', showLessRelatedProducts);
          list.appendChild(btnLess);
      } else {
          btnLess.style.display = "block";
      }
  } else {
      const btnLess = document.getElementById("show-less-related");
      if (btnLess) btnLess.style.display = "none";
  }
}

function loadMoreRelatedProducts() {
  relatedProductsPage++;
  renderPageRelatedProducts();
  renderLoadMoreButton();
}

  // New: Function to show less related products
  function showLessRelatedProducts() {
      relatedProductsPage = 1;
      const list = document.getElementById("related-products-list");
      list.innerHTML = ""; // Clear related products container
      renderPageRelatedProducts();
      renderLoadMoreButton();
  }

// Thêm sản phẩm vào giỏ hàng
function addToCart(productId) {
const qty = parseInt(document.getElementById(`quantity-${productId}`).value, 10) || 1; // Lấy số lượng
let cartArr = JSON.parse(localStorage.getItem(CART_KEY)) || [];                        // Lấy giỏ hàng cũ
const idx = cartArr.findIndex(i => i.id === productId);
if (idx > -1) cartArr[idx].qty += qty;                                                 // Nếu có rồi thì cộng số lượng
else cartArr.push({ id: productId, title: currentProduct.title, price: currentProduct.price, qty }); // Thêm mới
saveCart(cartArr);                                                                     // Lưu giỏ hàng
alert(`Added ${currentProduct.title} (số lượng: ${qty}) to cart.`);                 // Thông báo 
}

// Mua ngay: chỉ mua 1 sản phẩm, chuyển tới trang giỏ
function buyNow(productId) {
const qty = parseInt(document.getElementById(`quantity-${productId}`).value, 10) || 1;
let cartArr = JSON.parse(localStorage.getItem(CART_KEY)) || [];
const idx = cartArr.findIndex(i => i.id === productId);
if (idx > -1) cartArr[idx].qty += qty;
else cartArr.push({
  id: productId,
  title: currentProduct.title,
  price: currentProduct.price,
  qty
});
saveCart(cartArr);                                                        // Lưu giỏ
window.location.href = '../Cart/cart.html';   
}
