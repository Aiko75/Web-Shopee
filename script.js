document.addEventListener("click", function (e) {
    const menu = document.getElementById("menu");
    const dropdown = document.querySelector(".menudrop");

    if (!menu.contains(e.target)) {
        dropdown.style.display = "none";
    }
});

document.getElementById("product-details").innerHTML = "<p>Loading...</p>";

// Lấy ID sản phẩm đã chọn từ localStorage
const selectedProductId = localStorage.getItem("selectedProductId");

const comments = [
    { productId: 1, author: "Nam", text: "Sản phẩm tốt!" },
    { productId: 2, author: "Linh", text: "Giá ổn, chất lượng ổn." },
    { productId: 1, author: "Huy", text: "Dùng rồi vẫn muốn mua tiếp." }
];

function renderComments() {
    const commentList = document.getElementById("comments-list-all");
    commentList.innerHTML = "";

    if (comments.length === 0) {
        commentList.innerHTML = "<li>Chưa có bình luận nào.</li>";
        return;
    }

    comments.forEach(c => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${c.author}</strong> (Sản phẩm #${c.productId}): ${c.text}`;
        commentList.appendChild(li);
    });
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
                <p class="rating">Rating: ${product.rating.rate} (${product.rating.count} reviews)</p>
                <div class="button-container">
                    <button onclick="addToCart(${product.id})">Add to cart</button>
                    <button onclick="buyNow(${product.id})">Buy now</button>
                </div>
            </div>
        </div>
        
    <div class="comments-container">
        <h3>Comments</h3>
        <ul class="comments-list" id="comments-list-all"></ul>
        <form onsubmit="addComment(event, ${product.id})" class="comment-form">
            <input type="text" id="comment-author-${product.id}" placeholder="Tên bạn" required />
            <input type="text" id="comment-text-${product.id}" placeholder="Viết bình luận..." required />
            <button type="submit">Gửi</button>
        </form>
    </div>
    `;
        // ✅ Chạy sau khi HTML đã render xong
        renderComments();
        console.log("Product ID:", product.id, "Type:", typeof product.id);
}

function addComment(event, productId) {
    event.preventDefault();
    const authorInput = document.getElementById(`comment-author-${productId}`);
    const textInput = document.getElementById(`comment-text-${productId}`);

    const newComment = {
        productId: productId,
        author: authorInput.value,
        text: textInput.value
    };

    comments.push(newComment);
    renderComments(productId);

    // Reset input
    authorInput.value = "";
    textInput.value = "";
}


// Fetch sản phẩm từ API dựa theo ID
if (selectedProductId) {
    fetch(`https://fakestoreapi.com/products/${selectedProductId}`)
        .then(res => res.json())
        .then(product => {
            displayProductDetails(product);
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

function addToCart(id) {
    alert(`Đã thêm sản phẩm ${id} vào giỏ hàng`);
}


