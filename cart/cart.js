// === Cấu hình voucher === 
const vouchers = [                                              // Danh sách mã giảm giá và mức giảm
  { code: 'DISCOUNT10', discount: 0.10 },                       // Giảm 10%
  { code: 'DISCOUNT20', discount: 0.20 },                       // Giảm 20%
  { code: 'FREESHIP',  discount: 0.05 },                        // Giảm 5% (ví dụ freeship)
  { code: 'DISCOUNT 25', discount: 0.25 },                      // Giảm 25%
  { code: 'DISCOUNT 30', discount: 0.30 }                       // Giảm 30%
];

let cart = [];                                                  // Mảng lưu thông tin sản phẩm trong giỏ
let selectedVoucher = null;                                     // Mã giảm giá đang được chọn
const CART_KEY = 'cart';                                        // Khóa để lưu vào localStorage

function saveCart() {                                           // Lưu giỏ hàng vào localStorage
  localStorage.setItem(CART_KEY, JSON.stringify(cart));         // Chuyển mảng cart thành chuỗi
}

document.addEventListener('DOMContentLoaded', initCartUI);      // Khi trang tải xong thì khởi tạo UI

function initCartUI() {
  const buyNowBtn      = document.getElementById('buyNowBtn');      // Nút mua thêm
  const checkoutBtn    = document.getElementById('checkoutBtn');    // Nút thanh toán
  const openVoucherBtn = document.getElementById('openVoucherBtn'); // Nút mở modal mã giảm giá
  const voucherModal   = document.getElementById('voucherModal');   // Modal chọn mã giảm giá
  const modalBackdrop  = document.getElementById('modalBackdrop');  // Nền mờ đằng sau modal
  const closeVoucherBtn  = document.getElementById('closeVoucherBtn');  // Nút đóng modal
  const cancelVoucherBtn = document.getElementById('cancelVoucherBtn'); // Nút hủy
  const applyVoucherBtn  = document.getElementById('applyVoucherBtn');  // Nút áp dụng mã

  cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];         // Lấy dữ liệu giỏ từ localStorage

  buyNowBtn.addEventListener('click', () => {                      // Nếu bấm "Buy Now"
    window.location.href = 'home.html';                            // Chuyển về trang mua hàng
  });

  checkoutBtn.addEventListener('click', () => {                    // Khi người dùng bấm thanh toán
    if (cart.length === 0) {
      window.location.href = 'home.html';                          // Nếu giỏ trống → chuyển về trang chính
      return;
    }

    const addressInput = document.getElementById('shippingAddress'); // Lấy input địa chỉ giao hàng
    const address = addressInput.value.trim();                     // Bỏ khoảng trắng 2 đầu
    if (!address) {
      alert('Please enter a shipping address.');                   // Thông báo nếu thiếu địa chỉ
      return;
    }

    const itemList = cart                                          // Tạo danh sách sản phẩm trong giỏ
      .map(i => `${i.title} x${i.qty} ($${(i.price * i.qty).toFixed(2)})`)
      .join('\n');

    const rawTotal = cart.reduce((sum, i) => sum + i.qty * i.price, 0); // Tổng chưa giảm giá
    const finalTotal = selectedVoucher                              // Áp dụng mã giảm nếu có
      ? (rawTotal * (1 - selectedVoucher.discount)).toFixed(2)
      : rawTotal.toFixed(2);

    alert(                                                           // Thông báo thành công
      `🎉 Payment Successful! 🎉\n\n` +
      `Order Details:\n${itemList}\n\n` +
      `Total Paid: $${finalTotal}\n` +
      `Shipping to: ${address}`
    );

    cart = [];                                                       // Reset giỏ hàng
    saveCart();                                                      // Lưu lại giỏ hàng trống
    selectedVoucher = null;                                          // Xóa mã giảm giá
    document.getElementById('voucherInfo').classList.add('hidden');  // Ẩn thông tin mã giảm giá
    addressInput.value = '';                                         // Xóa địa chỉ
    renderCart();                                                    // Vẽ lại giỏ hàng
  });

  openVoucherBtn.addEventListener('click', () => {              // Khi mở chọn mã giảm giá
    voucherModal.classList.remove('hidden');                    // Hiện modal
    renderVouchers();                                           // Hiện danh sách mã
  });

  [modalBackdrop, closeVoucherBtn, cancelVoucherBtn].forEach(el =>
    el.addEventListener('click', () => voucherModal.classList.add('hidden')) // Đóng modal khi click ra ngoài
  );

  applyVoucherBtn.addEventListener('click', () => {             // Khi bấm nút áp dụng mã
    const sel = document.querySelector('input[name=voucher]:checked'); // Tìm mã được chọn
    if (!sel) return;
    selectedVoucher = vouchers[parseInt(sel.value, 10)];        // Lấy thông tin mã từ mảng
    voucherModal.classList.add('hidden');                       // Ẩn modal
    updateSummary();                                            // Cập nhật tổng tiền
    saveCart();                                                 // Lưu lại
  });

  renderCart();                                                 // Hiện giỏ hàng ban đầu
}

function renderCart() {
  const cartItemsEl = document.getElementById('cartItems');     // Element chứa danh sách sản phẩm
  cartItemsEl.innerHTML = '';                                   // Xóa nội dung cũ

  if (cart.length === 0) {
    document.getElementById('emptyCartPage').classList.remove('hidden'); // Nếu trống thì hiển thị giao diện trống
    document.getElementById('cartPage').classList.add('hidden');         // Ẩn phần chi tiết giỏ
    return;
  }

  document.getElementById('emptyCartPage').classList.add('hidden');
  document.getElementById('cartPage').classList.remove('hidden');

  cart.forEach(item => {
    const row = document.createElement('div');                  // Tạo dòng hiển thị
    row.className = 'cart-item';
    row.innerHTML = `
      <div>${item.title}</div>
      <div>
        <input type="number" min="1" value="${item.qty}" data-id="${item.id}"> x $${item.price.toFixed(2)}
      </div>
      <button class="btn" data-remove="${item.id}">Remove</button>
    `;

    row.querySelector('input').addEventListener('change', e => { // Xử lý khi thay đổi số lượng
      const val = parseInt(e.target.value, 10);
      if (val < 1) return;
      item.qty = val;
      updateSummary();                                           // Cập nhật tổng tiền
      saveCart();                                                // Lưu lại
    });

    row.querySelector('[data-remove]').addEventListener('click', () => { // Xử lý khi bấm "Remove"
      cart = cart.filter(ci => ci.id !== item.id);
      saveCart();
      renderCart();                                              // render lại
    });

    cartItemsEl.appendChild(row);                                // Thêm dòng vào giao diện
  });

  updateSummary();                                               // Cập nhật tổng tiền
}

function updateSummary() {
  const totalQty    = cart.reduce((sum, i) => sum + i.qty, 0);   // Tổng số lượng
  let total         = cart.reduce((sum, i) => sum + i.qty * i.price, 0); // Tổng tiền
  const voucherInfo = document.getElementById('voucherInfo');
  const totalQtyEl  = document.getElementById('totalQty');
  const totalPriceEl= document.getElementById('totalPrice');

  if (selectedVoucher) {
    total *= (1 - selectedVoucher.discount);                     // Giảm giá nếu có
    voucherInfo.textContent = `Voucher: ${selectedVoucher.code} (-${(selectedVoucher.discount*100).toFixed(0)}%)`;
    voucherInfo.classList.remove('hidden');                      // Hiện phần thông tin mã
  }

  totalQtyEl.textContent   = totalQty;                           // Cập nhật số lượng
  totalPriceEl.textContent = total.toFixed(2);                   // Cập nhật giá
}

function renderVouchers() {                                      // Hiện danh sách mã trong modal
  const voucherListEl = document.getElementById('voucherList');
  voucherListEl.innerHTML = '';
  vouchers.forEach((v, idx) => {
    const div = document.createElement('div');
    div.className = 'voucher-item';
    div.innerHTML = `
      <input type="radio" name="voucher" id="vc${idx}" value="${idx}">
      <label for="vc${idx}">${v.code} - ${(v.discount*100).toFixed(0)}% off</label>
    `;
    voucherListEl.appendChild(div);
  });
}

