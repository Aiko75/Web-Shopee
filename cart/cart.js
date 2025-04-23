
const vouchers = [  
  { code: 'DISCOUNT10', discount: 0.10 },  // Mã DISCOUNT10 giảm 10%
  { code: 'DISCOUNT20', discount: 0.20 },  // Mã DISCOUNT20 giảm 20%
  { code: 'FREESHIP',  discount: 0.05 },   // Mã FREESHIP giảm 5% (ví dụ freeship)
  { code: 'DISCOUNT25', discount: 0.25 },  // Mã DISCOUNT25 giảm 25%
  { code: 'DISCOUNT30', discount: 0.30 }   // Mã DISCOUNT30 giảm 30%
];

let cart = [];                    // Mảng lưu thông tin sản phẩm trong giỏ (chỉ id và qty)
let selectedVoucher = null;       // Voucher đang được chọn (null nếu chưa chọn)
const CART_KEY = 'cart';          // Khóa dùng để lưu giỏ hàng vào localStorage

// Lưu giỏ hàng vào localStorage (chỉ lưu id và qty)
function saveCart() {
  localStorage.setItem(
    CART_KEY,
    JSON.stringify(cart.map(({ id, qty }) => ({ id, qty })))  // Chuyển mảng cart thành chuỗi JSON chỉ gồm id và qty
  );
}

// --- Hàm fetch và merge dữ liệu sản phẩm trước khi render giỏ hàng ---
async function loadCartAndRender() {
  const products = await fetch('https://fakestoreapi.com/products') // Gọi API lấy tất cả sản phẩm
    .then(res => res.json());                                        // Chuyển response thành JSON array

  const rawCart = JSON.parse(localStorage.getItem(CART_KEY) || '[]'); // Lấy mảng cart từ localStorage hoặc mảng rỗng
  cart = rawCart.map(ci => {                                          // Ghép dữ liệu product vào mỗi item trong cart
    const prod = products.find(p => p.id === ci.id) || {};            // Tìm thông tin chi tiết theo id
    return { ...prod, qty: ci.qty };                                  // Trả về object chứa tất cả thuộc tính của prod + qty
  });

  renderCart();                                                       // Gọi hàm render giỏ hàng ra UI
}

document.addEventListener('DOMContentLoaded', () => { // Khi DOM đã tải xong
  initCartUI();           // Khởi tạo các sự kiện cho UI
  loadCartAndRender();    // Tải và hiển thị giỏ hàng
});

function initCartUI() {
  const buyNowBtn      = document.getElementById('buyNowBtn');      // Nút "Buy More"
  const checkoutBtn    = document.getElementById('checkoutBtn');    // Nút "Checkout"
  const openVoucherBtn = document.getElementById('openVoucherBtn'); // Nút mở modal voucher
  const voucherModal   = document.getElementById('voucherModal');   // Element modal voucher
  const modalBackdrop  = document.getElementById('modalBackdrop');  // Nền mờ modal
  const closeVoucherBtn  = document.getElementById('closeVoucherBtn');   // Nút đóng modal
  const cancelVoucherBtn = document.getElementById('cancelVoucherBtn');  // Nút hủy chọn voucher
  const applyVoucherBtn  = document.getElementById('applyVoucherBtn');   // Nút áp dụng voucher

  // Khi bấm "Buy More", xóa giỏ cũ rồi quay về trang home
  buyNowBtn.addEventListener('click', () => {
    cart = [];          // Reset mảng cart
    saveCart();         // Lưu lại vào localStorage
    window.location.href = 'home.html';  // Điều hướng về home
  });

  // Xử lý khi bấm "Checkout"
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {                   // Nếu giỏ hàng đang rỗng
      window.location.href = 'home.html';      // Quay về trang home
      return;
    }
    const addressInput = document.getElementById('shippingAddress');  // Lấy input địa chỉ
    const address = addressInput.value.trim();                       // Lấy value và bỏ khoảng trắng
    if (!address) {                                                  // Nếu địa chỉ trống
      alert('Please enter a shipping address.');                     // Yêu cầu nhập địa chỉ
      return;
    }

    // Tạo chuỗi mô tả từng item: "Title xQty ($price)"
    const itemList = cart
      .map(i => `${i.title} x${i.qty} ($${(i.price * i.qty).toFixed(2)})`)
      .join('\n');

    const rawTotal = cart.reduce((sum, i) => sum + i.qty * i.price, 0);  // Tính tổng trước giảm giá
    const finalTotal = selectedVoucher                                   
      ? (rawTotal * (1 - selectedVoucher.discount)).toFixed(2)            // Nếu có voucher, áp dụng giảm
      : rawTotal.toFixed(2);                                              // Nếu không có voucher

    // Hiển thị alert tổng kết đơn hàng
    alert(
      `🎉 Payment Successful! 🎉\n\n` +
      `Order Details:\n${itemList}\n\n` +
      `Total Paid: $${finalTotal}\n` +
      `Shipping to: ${address}`
    );

    // Sau khi thanh toán xong: reset giỏ hàng và voucher, cập nhật UI
    cart = [];
    saveCart();
    selectedVoucher = null;
    document.getElementById('voucherInfo').classList.add('hidden');
    addressInput.value = '';
    renderCart();  // Cập nhật lại giao diện giỏ hàng
  });

  // Mở modal chọn voucher
  openVoucherBtn.addEventListener('click', () => {
    voucherModal.classList.remove('hidden');  // Hiện modal
    renderVouchers();                         // Vẽ danh sách voucher ra modal
  });

  // Đóng modal khi click nền mờ hoặc nút close/cancel
  [modalBackdrop, closeVoucherBtn, cancelVoucherBtn].forEach(el =>
    el.addEventListener('click', () => voucherModal.classList.add('hidden'))
  );

  // Áp dụng voucher đã chọn
  applyVoucherBtn.addEventListener('click', () => {
    const sel = document.querySelector('input[name=voucher]:checked'); // Lấy radio đã chọn
    if (!sel) return;                                                // Nếu chưa chọn thì thôi
    selectedVoucher = vouchers[parseInt(sel.value, 10)];             // Gán voucher tương ứng
    voucherModal.classList.add('hidden');                            // Ẩn modal
    updateSummary();                                                 // Cập nhật tổng tiền
    saveCart();                                                      // Lưu giỏ hàng (có thể lưu voucher nữa nếu muốn)
  });

  // Nếu có nút Add to Cart trên trang chi tiết sản phẩm
  const addToCartBtn = document.getElementById('addToCartBtn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const id  = parseInt(addToCartBtn.dataset.id, 10);             // Lấy id từ data-id
      const qty = parseInt(addToCartBtn.dataset.qty || '1', 10);     // Lấy qty từ data-qty
      const exist = cart.find(i => i.id === id);                     // Kiểm tra đã có trong cart chưa
      if (exist) exist.qty += qty;                                   // Nếu có thì tăng qty
      else cart.push({ id, qty });                                   // Nếu chưa thì thêm mới
      saveCart();                                                    // Lưu lại
      window.location.href = 'home.html';                            // Quay về home
    });
  }
}

// Vẽ giao diện giỏ hàng
function renderCart() {
  const cartItemsEl = document.getElementById('cartItems');  // Container chứa item
  cartItemsEl.innerHTML = '';                                // Xóa nội dung cũ

  // Nếu giỏ trống: hiển thị trang empty, ẩn trang cart
  if (cart.length === 0) {
    document.getElementById('emptyCartPage').classList.remove('hidden');
    document.getElementById('cartPage').classList.add('hidden');
    return;
  }

  // Ngược lại: hiển thị trang cart, ẩn empty
  document.getElementById('emptyCartPage').classList.add('hidden');
  document.getElementById('cartPage').classList.remove('hidden');

  // Với mỗi item trong cart, tạo 1 row
  cart.forEach(item => {
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.marginBottom = '10px';

    row.innerHTML = `
      <img
        src="${item.image}"   
        alt="${item.title}"    
        width="60"             
        style="object-fit:cover; border:1px solid #ddd; border-radius:4px; margin-right:10px;"
      />
      <div style="flex:1;">
        <div style="font-weight:600;">${item.title}</div>
        <div>
          <input
            type="number"
            min="1"
            value="${item.qty}"
            data-id="${item.id}"
            style="width:50px; margin-right:5px;"
          />
          × $${item.price.toFixed(2)} = $${(item.qty * item.price).toFixed(2)}
        </div>
      </div>
      <button class="btn" data-remove="${item.id}">Remove</button>
    `;

    // Xử lý thay đổi số lượng
    row.querySelector('input').addEventListener('change', e => {
      const val = parseInt(e.target.value, 10);
      if (val < 1) return;           // Không cho < 1
      item.qty = val;                // Cập nhật qty
      updateSummary();               // Cập nhật tổng tiền
      saveCart();                    // Lưu lại
    });

    // Xử lý xóa item
    row.querySelector('[data-remove]').addEventListener('click', () => {
      cart = cart.filter(ci => ci.id !== item.id);  // Lọc bỏ item đó
      saveCart();                                    // Lưu lại
      renderCart();                                  // Render lại UI
    });

    cartItemsEl.appendChild(row);  // Thêm row vào container
  });

  updateSummary();  // Cập nhật tổng số lượng và tổng giá
}

// Cập nhật phần tóm tắt (summary) giỏ hàng
function updateSummary() {
  const totalQty     = cart.reduce((sum, i) => sum + i.qty, 0);  // Tổng số lượng
  let total          = cart.reduce((sum, i) => sum + i.qty * i.price, 0); // Tổng trước voucher
  const voucherInfo  = document.getElementById('voucherInfo');  // Element hiển thị voucher
  const totalQtyEl   = document.getElementById('totalQty');     // Element hiển thị tổng qty
  const totalPriceEl = document.getElementById('totalPrice');   // Element hiển thị tổng tiền

  if (selectedVoucher) {                                        // Nếu có voucher
    total *= (1 - selectedVoucher.discount);                    // Áp dụng giảm giá
    voucherInfo.textContent =                                  // Cập nhật text voucher
      `Voucher: ${selectedVoucher.code} (-${(selectedVoucher.discount*100).toFixed(0)}%)`;
    voucherInfo.classList.remove('hidden');                     // Hiện thông tin voucher
  }

  totalQtyEl.textContent   = totalQty;                          // Hiển thị tổng qty
  totalPriceEl.textContent = total.toFixed(2);                  // Hiển thị tổng tiền (2 chữ số)
}

// Vẽ danh sách voucher trong modal
function renderVouchers() {
  const voucherListEl = document.getElementById('voucherList'); // Container chứa radio list voucher
  voucherListEl.innerHTML = '';                                 // Xóa nội dung cũ

  vouchers.forEach((v, idx) => {                                // Với mỗi voucher
    const div = document.createElement('div');
    div.className = 'voucher-item';
    div.innerHTML = `
      <input type="radio" name="voucher" id="vc${idx}" value="${idx}">
      <label for="vc${idx}">${v.code} - ${(v.discount*100).toFixed(0)}% off</label>
    `;
    voucherListEl.appendChild(div);                            // Thêm vào container
  });
}
