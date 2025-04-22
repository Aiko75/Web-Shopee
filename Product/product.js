document.addEventListener("click", function (e) {
  const menu = document.getElementById("menu");                         //   Lấy phần tử menu theo id="menu"
  const dropdown = document.querySelector(".menudrop");                  //   Lấy dropdown menu theo class="menudrop"
  if (!menu.contains(e.target)) {                                        //   Nếu điểm click không nằm trong menu
    dropdown.style.display = "none";                                     //     Ẩn dropdown menu
  }
});

document.getElementById("product-details").innerHTML = "<p>Loading...</p>"; // Hiển thị ngay dòng “Loading...” chờ dữ liệu về

const selectedProductId = localStorage.getItem("selectedProductId");       // Lấy ID sản phẩm đã chọn từ localStorage
const comments = JSON.parse(localStorage.getItem("comments") || "[]");     // Lấy mảng bình luận (nếu chưa có thì về [])
let displayedCommentsCount = 3;                                            // Số bình luận sẽ hiển thị ban đầu

const CART_KEY = 'cart';                                                   // Khóa dùng để lưu giỏ hàng
function saveCart(arr) {
  localStorage.setItem(CART_KEY, JSON.stringify(arr));                     // Chuyển mảng giỏ hàng thành string rồi lưu
}

let currentProduct = null;                                                 // Biến toàn cục lưu thông tin sản phẩm hiện tại

// Nếu đã có ID sản phẩm thì gọi API lấy chi tiết
if (selectedProductId) {
  fetch(`https://fakestoreapi.com/products/${selectedProductId}`)          // Gọi Fake Store API
    .then(res => res.json())                                               // Chuyển response thành JSON
    .then(product => {
      currentProduct = product;                                            // Lưu về biến toàn cục
      displayProductDetails(product);                                      // Gọi hàm hiển thị chi tiết
      fetchRelatedProducts(product.category);                              // Gọi hàm lấy sản phẩm cùng loại
    })
    .catch(() => {
      document.getElementById("product-details").innerHTML =
        '<p class="error">Error detail</p>';                               // Hiển thị lỗi nếu fail
    });
} else {
  document.getElementById("product-details").innerHTML =
    '<p class="error">product not found!</p>';                             // Nếu không tìm thấy ID
}

// Hàm dựng UI chi tiết sản phẩm kèm phần bình luận và related products
function displayProductDetails(product) {
  const pd = document.getElementById("product-details");                  // Container chính
  pd.innerHTML = `                                                        // Chèn thẳng HTML
    <div class="product-container">
      <img src="${product.image}" alt="${product.title}" class="product-image"/>
      <div class="product-info">
        <h2>${product.title}</h2>
        <p class="price">$${product.price.toFixed(2)}</p>
        <p class="category">Category: ${product.category}</p>
        <p class="description">Description: ${product.description}</p>
        <label>Number of items:
          <input type="number" min="1" value="1" class="quantity-input" id="quantity-${product.id}"/>
        </label>
        <p class="stock">In stock: ${product.rating.count}</p>
        <p class="rating">Rating: ${product.rating.rate} ⭐ (${product.rating.count} reviews)</p>
        <div class="button-container">
          <button onclick="addToCart(${product.id})">Add to cart</button>
          <button onclick="buyNow(${product.id})">Buy now</button>
        </div>
      </div>
    </div>
    <div class="comments-container">
      <h1>Comments</h1>
      <ul class="comments-list" id="comments-list-all"></ul>
      <button id="show-more-comments" class="show-more-button">Show more comments</button>
      <button id="show-less-comments" class="show-less-button">Show less comments</button>
      <form onsubmit="addComment(event, ${product.id})" class="comment-form">
        <input type="text" id="comment-author-${product.id}" placeholder="Your name" required />
        <input type="number" min="1" max="5" step="0.1" id="rating-${product.id}" value="1" required/>
        <input type="text" id="comment-text-${product.id}" placeholder="Write comment..." required />
        <button type="submit">Send</button>
      </form>
    </div>
    <div class="related-products">
      <h1>Related Products</h1>
      <div id="related-products-list" class="related-products-list"></div>
      <button id="load-more-related" class="show-more-button">See more</button>
    </div>
  `;                                                                      // End innerHTML

  renderComments();                                                        // Hiển thị comment lần đầu
  document.getElementById("show-more-comments")
    .addEventListener('click', () => {                                     // Nút “Show more comments”
      displayedCommentsCount += 3;                                         // Tăng thêm 3 bình luận
      renderComments();                                                    // Render lại
    });
  document.getElementById("show-less-comments")
    .addEventListener('click', () => {                                     // Nút “Show less comments”
      displayedCommentsCount = 3;                                          // Reset về 3
      renderComments();                                                    // Render lại
    });
}

// Hàm render (vẽ) danh sách bình luận ra giao diện
function renderComments() {
  const list = document.getElementById("comments-list-all");              // <ul> chứa bình luận
  list.innerHTML = "";                                                     // Xóa nội dung cũ
  if (!comments.length) {                                                  // Nếu chưa có bình luận nào
    list.innerHTML = "<li>There is no comment.</li>";                     // Thông báo không có
    return;
  }
  comments.slice(0, displayedCommentsCount).forEach(c => {                 // Lấy số comment cần hiển thị
    const li = document.createElement("li");                               // Tạo <li>
    li.innerHTML = `<strong>${c.author}</strong> (${c.star} ⭐): ${c.text}`;// Điền nội dung
    list.appendChild(li);                                                  // Thêm vào ul
  });
}

// Thêm bình luận mới vào mảng và localStorage
function addComment(e, pid) {
  e.preventDefault();                                                      // Ngăn form reload page
  const author = document.getElementById(`comment-author-${pid}`).value;    // Lấy tên
  const text = document.getElementById(`comment-text-${pid}`).value;        // Lấy nội dung
  const star = parseFloat(document.getElementById(`rating-${pid}`).value)  // Lấy điểm
                 .toFixed(1);
  comments.push({                                                          // Thêm object comment
    commentId: comments.length + 1,
    productId: pid,
    author,
    star,
    text
  });
  localStorage.setItem("comments", JSON.stringify(comments));              // Lưu lại localStorage
  renderComments();                                                        // Render lại
  e.target.reset();                                                        // Reset form inputs
}

const RELATED_PRODUCTS_PER_LOAD = 8;                                        // Số item mỗi lần load thêm
let relatedProductsPage = 1;                                                // Page hiện tại
let allRelatedProducts = [];                                                // Chứa toàn bộ sản phẩm liên quan

// Lấy danh sách sản phẩm cùng loại (category)
function fetchRelatedProducts(cat) {
  fetch(`https://fakestoreapi.com/products/category/${cat}`)               // Gọi API theo category
    .then(r => r.json())                                                    // Chuyển thành JSON
    .then(arr => {
      allRelatedProducts = arr;                                             // Lưu mảng kết quả
      renderPageRelatedProducts();                                          // Hiển thị trang đầu tiên
    });
}

// Hiển thị một “page” sản phẩm liên quan
function renderPageRelatedProducts() {
  const list = document.getElementById("related-products-list");           // Container
  list.innerHTML = '';                                                      // Xóa cũ
  allRelatedProducts
    .slice(0, relatedProductsPage * RELATED_PRODUCTS_PER_LOAD)              // Lấy đến page hiện tại
    .forEach(p => {
      const div = document.createElement("div");                            // Tạo div cho 1 sp
      div.innerHTML = `<img src="${p.image}" alt=""><p>$${p.price.toFixed(2)}</p>`; // Ảnh + giá
      list.appendChild(div);                                                // Thêm vào container
    });
  const loadBtn = document.getElementById("load-more-related");             // Nút “See more”
  loadBtn.style.display = allRelatedProducts.length > relatedProductsPage * RELATED_PRODUCTS_PER_LOAD
    ? 'block' : 'none';                                                     // Ẩn/hiện tùy số item còn lại
  loadBtn.onclick = () => {                                                 // Bắt sự kiện click nút
    relatedProductsPage++;                                                  // Tăng page
    renderPageRelatedProducts();                                            // Render lại
  };
}

// Thêm sản phẩm vào giỏ hàng (không chuyển trang)
function addToCart(productId) {
  const qty = parseInt(document.getElementById(`quantity-${productId}`).value, 10) || 1;
                                                                           // Lấy số lượng (mặc định 1)
  let cartArr = JSON.parse(localStorage.getItem(CART_KEY)) || [];          // Lấy mảng giỏ hàng
  const idx = cartArr.findIndex(i => i.id === productId);                  // Tìm sp đã có sẵn
  if (idx > -1) cartArr[idx].qty += qty;                                   // Nếu có rồi thì cộng qty
  else cartArr.push({                                                       // Nếu chưa có thì thêm mới
    id: productId,
    title: currentProduct.title,
    price: currentProduct.price,
    qty
  });
  saveCart(cartArr);                                                        // Gọi hàm lưu giỏ hàng
  alert(`✅ Added ${currentProduct.title} (Quantity: ${qty}) to cart.`);    // Thông báo cho user
}

// Chức năng “Buy Now”: lưu vào giỏ rồi chuyển thẳng sang cart.html
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
  window.location.href = 'cart.html';                                       // Điều hướng sang trang giỏ hàng
}
  
