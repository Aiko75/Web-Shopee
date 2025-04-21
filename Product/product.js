// Đóng dropdown menu nếu click ra ngoài                              
document.addEventListener("click", function (e) {
  const menu = document.getElementById("menu");                     // Lấy phần tử menu
  const dropdown = document.querySelector(".menudrop");            // Lấy dropdown menu
  if (!menu.contains(e.target)) {                                  // Nếu click ra ngoài menu
      dropdown.style.display = "none";                             // Ẩn dropdown
  }
});

document.getElementById("product-details").innerHTML = "<p>Loading...</p>"; // Hiển thị dòng loading

// Lấy ID sản phẩm đã chọn từ localStorage                         
const selectedProductId = localStorage.getItem("selectedProductId"); // Lấy ID sản phẩm đã lưu
const comments = JSON.parse(localStorage.getItem("comments") || "[]"); // Lấy comment từ localStorage
let displayedCommentsCount = 3;                                      // Số comment hiển thị ban đầu

const CART_KEY = 'cart';                                             // Khóa lưu giỏ hàng trong localStorage
function saveCart(arr) {
  localStorage.setItem(CART_KEY, JSON.stringify(arr));            // Lưu giỏ hàng vào localStorage
}

let currentProduct = null;                                           // Biến chứa thông tin sản phẩm hiện tại

// Lấy thông tin sản phẩm từ API                                      
if (selectedProductId) {
  fetch(`https://fakestoreapi.com/products/${selectedProductId}`) // Gọi API lấy thông tin sản phẩm
      .then(res => res.json())                                    // Chuyển kết quả thành JSON
      .then(product => {
          currentProduct = product;                               // Gán sản phẩm hiện tại
          displayProductDetails(product);                         // Hiển thị chi tiết sản phẩm
          fetchRelatedProducts(product.category);                 // Lấy sản phẩm liên quan
      })
      .catch(() => {
          document.getElementById("product-details").innerHTML = // Hiển thị lỗi nếu thất bại
              '<p class="error">Error detail</p>';
      });
} else {
  document.getElementById("product-details").innerHTML =          // Không có ID sản phẩm
      '<p class="error">product not found!</p>';
}

// Hàm hiển thị thông tin chi tiết sản phẩm                         
function displayProductDetails(product) {
  const pd = document.getElementById("product-details");
  pd.innerHTML = `
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
  `;

  renderComments();                                                                      // Hiển thị bình luận
  document.getElementById("show-more-comments")
      .addEventListener('click', () => { displayedCommentsCount += 3; renderComments(); });
  document.getElementById("show-less-comments")
      .addEventListener('click', () => { displayedCommentsCount = 3; renderComments(); });
}

// Hiển thị danh sách bình luận
function renderComments() {
  const list = document.getElementById("comments-list-all");
  list.innerHTML = "";
  if (!comments.length) {
      list.innerHTML = "<li>There is no comment.</li>";                                  // Không có bình luận
      return;
  }
  comments.slice(0, displayedCommentsCount).forEach(c => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${c.author}</strong> (${c.star} ⭐): ${c.text}`;            // Hiển thị từng comment
      list.appendChild(li);
  });
}

// Thêm bình luận mới vào danh sách và lưu vào localStorage
function addComment(e, pid) {
  e.preventDefault();
  const author = document.getElementById(`comment-author-${pid}`).value;
  const text = document.getElementById(`comment-text-${pid}`).value;
  const star = parseFloat(document.getElementById(`rating-${pid}`).value).toFixed(1);
  comments.push({ commentId: comments.length+1, productId: pid, author, star, text });   // Thêm vào mảng
  localStorage.setItem("comments", JSON.stringify(comments));                           // Lưu lại
  renderComments();                                                                      // Render lại
  e.target.reset();                                                                      // Reset form
}

const RELATED_PRODUCTS_PER_LOAD = 8;                                                       // Số sản phẩm liên quan mỗi lần load
let relatedProductsPage = 1;                                                               // Trang hiện tại
let allRelatedProducts = [];                                                               // Mảng chứa toàn bộ sản phẩm liên quan

// Gọi API lấy các sản phẩm cùng loại (liên quan)
function fetchRelatedProducts(cat) {
  fetch(`https://fakestoreapi.com/products/category/${cat}`)
      .then(r => r.json())
      .then(arr => {
          allRelatedProducts = arr;
          renderPageRelatedProducts();                                                   // Hiển thị trang đầu
      });
}

// Hiển thị danh sách sản phẩm liên quan theo trang
function renderPageRelatedProducts() {
  const list = document.getElementById("related-products-list");
  list.innerHTML = '';
  allRelatedProducts
      .slice(0, relatedProductsPage * RELATED_PRODUCTS_PER_LOAD)                         // Chia trang
      .forEach(p => {
          const div = document.createElement("div");
          div.innerHTML = `<img src="${p.image}" alt=""><p>$${p.price.toFixed(2)}</p>`;  // Hiển thị ảnh và giá
          list.appendChild(div);
      });
  document.getElementById("load-more-related")
      .style.display = allRelatedProducts.length > relatedProductsPage * RELATED_PRODUCTS_PER_LOAD
          ? 'block' : 'none';                                                            // Ẩn hiện nút "xem thêm"
  document.getElementById("load-more-related")
      .onclick = () => { relatedProductsPage++; renderPageRelatedProducts(); };          // Tăng trang
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
  window.location.href = 'home.html';                                                    // Chuyển về trang chủ
}

// Mua ngay: chỉ mua 1 sản phẩm, chuyển tới trang giỏ
function buyNow(productId) {
  const qty = parseInt(document.getElementById(`quantity-${productId}`).value, 10) || 1;
  const singleCart = [{ id: productId, title: currentProduct.title, price: currentProduct.price, qty }];
  saveCart(singleCart);                                                                  // Lưu sản phẩm vừa chọn
  window.location.href = 'cart.html';                                                    // Chuyển tới giỏ hàng
}

  
