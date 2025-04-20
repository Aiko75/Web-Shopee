document.addEventListener("click", function (e) {
    const menu = document.getElementById("menu");
    const dropdown = document.querySelector(".menudrop");

    if (!menu.contains(e.target)) {
        dropdown.style.display = "none";
    }
});

document.getElementById("product-details").innerHTML = "<p>Loading...</p>";

// Lấy ID sản phẩm đã chọn từ localStorage
const selectedProductId = localStorage.getItem("selectedProductId"); // ✅ Giữ lại dòng này

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

let relatedProductsFetched = false; // Thêm lại flag để chắc chắn chỉ fetch related 1 lần

// Fetch sản phẩm từ API dựa theo ID (CHỈ GỌI MỘT LẦN)
if (selectedProductId) {
    fetch(`https://fakestoreapi.com/products/${selectedProductId}`)
        .then(res => res.json())
        .then(product => {
            console.log("Product loaded:", product.id, typeof product.id);
            displayProductDetails(product); // Hiển thị thông tin sản phẩm
            if (!relatedProductsFetched) {
                fetchRelatedProducts(product.category); // Tải sản phẩm liên quan
                relatedProductsFetched = true;
            }
        })
        .catch(error => {
            console.error('Error fetching product:', error);
            document.getElementById("product-details").innerHTML =
                '<p class="error">Không thể tải thông tin sản phẩm</p>';
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
            Name:
            <input type="text" id="comment-author-${product.id}" placeholder="Your name" required />
            <br/>
            Rates:
            <input type="number" min="1" max="5" value="1" class="rating-input" id="rating-${product.id}" required step="0.1"/>
            <br/>
            Comment:
            <input type="text" id="comment-text-${product.id}" placeholder="Write comment..." required />
            <button type="submit">Sent</button>
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
     // Store product globally so addToCart can access its title.
    window.currentProduct = product;
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

const RELATED_PRODUCTS_PER_LOAD = 8;
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
        list.innerHTML = '<p class="error">Không thể tải sản phẩm liên quan.</p>';
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
          <p class="related-product-price">$${product.price.toFixed(2)}</p>
        `;
        list.appendChild(div);
      });
  }


  function renderLoadMoreButton() {
    const list = document.getElementById("related-products-list");
    // nếu còn page tiếp theo
    if (allRelatedProducts.length > relatedProductsPage * RELATED_PRODUCTS_PER_LOAD) {
      let btn = document.getElementById("load-more-related");
      if (!btn) {
        btn = document.createElement("button");
        btn.id = "load-more-related";
        btn.classList.add("show-more-button");
        btn.textContent = "Xem thêm sản phẩm liên quan";
        btn.addEventListener('click', loadMoreRelatedProducts);
        list.appendChild(btn);
      } else {
        btn.style.display = "block";
      }
    } else {
      const btn = document.getElementById("load-more-related");
      if (btn) btn.style.display = "none";
    }
  }


  function loadMoreRelatedProducts() {
    relatedProductsPage++;
    renderPageRelatedProducts();
    renderLoadMoreButton();
  }

function addToCart(productId) {
    const quantityInput = document.getElementById(`quantity-${productId}`);
    const quantity = quantityInput ? quantityInput.value : 1;
    alert(`Add ${window.currentProduct.title} (Quantity: ${quantity}) to cart`);
}


function buyNow(productId) {
    window.location.href = "../Cart/pay.html?id=" + encodeURIComponent(productId);
}
