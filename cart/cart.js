 // === Cấu hình voucher ===
 const vouchers = [                                // Mảng voucher mẫu
  { code: 'DISCOUNT10', discount: 0.10 },         // Giảm 10%
  { code: 'DISCOUNT20', discount: 0.20 },         // Giảm 20%
  { code: 'FREESHIP',    discount: 0.05 }          // Miễn phí ship (5%)
];

let cart = [];             // Lưu các mục trong giỏ hàng
let selectedVoucher = null; // Voucher đã chọn

document.addEventListener('DOMContentLoaded', initCartUI); // Khi DOM sẵn sàng

function initCartUI() {  // Khởi tạo logic giỏ hàng & voucher
  const buyNowBtn      = document.getElementById('buyNowBtn');      // Nút Buy Now
  const checkoutBtn    = document.getElementById('checkoutBtn');    // Nút Checkout
  const openVoucherBtn = document.getElementById('openVoucherBtn'); // Nút mở modal
  const voucherModal   = document.getElementById('voucherModal');   // Modal voucher
  const modalBackdrop  = document.getElementById('modalBackdrop');  // Nền modal
  const closeVoucherBtn  = document.getElementById('closeVoucherBtn'); // Nút đóng
  const cancelVoucherBtn = document.getElementById('cancelVoucherBtn'); // Nút hủy
  const applyVoucherBtn  = document.getElementById('applyVoucherBtn'); // Nút OK
  const voucherListEl    = document.getElementById('voucherList');    // Danh sách voucher
  const voucherInfoEl    = document.getElementById('voucherInfo');    // Hiển thị voucher
  const cartItemsEl      = document.getElementById('cartItems');      // Nơi render giỏ
  const totalQtyEl       = document.getElementById('totalQty');       // Tổng số lượng
  const totalPriceEl     = document.getElementById('totalPrice');     // Tổng giá tiền

  // Nếu giỏ hàng rỗng, nút Buy Now chuyển sang trang navbarelectronic
  buyNowBtn.addEventListener('click', () => {
    window.location.href = 'navbarelectronic.html'; // Redirect
  });

  // Xử lý Checkout khi nhấn nút
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {                       // Nếu giỏ trống
      window.location.href = 'navbarelectronic.html'; // Redirect
      return;
    }

    const itemList = cart                         // Tạo chuỗi mô tả đơn hàng
      .map(i => `${i.title} x${i.qty}`)
      .join(', ');
    alert(`You purchased: ${itemList}\nTotal Paid: $${totalPriceEl.textContent}`); // Thông báo

    cart = [];                                    // Xóa giỏ
    selectedVoucher = null;                       // Reset voucher
    voucherInfoEl.classList.add('hidden');        // Ẩn info voucher
    window.location.href = 'navbarelectronic.html'; // Quay về
  });

  // Mở modal voucher và render list
  openVoucherBtn.addEventListener('click', () => {
    voucherModal.classList.remove('hidden');     // Hiện modal
    renderVouchers();                            // Hiển thị voucher
  });

  // Đóng modal khi click backdrop hoặc nút hủy/đóng
  [modalBackdrop, closeVoucherBtn, cancelVoucherBtn]
    .forEach(el => el.addEventListener('click', () => voucherModal.classList.add('hidden')));

  // Áp dụng voucher
  applyVoucherBtn.addEventListener('click', () => {
    const sel = document.querySelector('input[name=voucher]:checked'); // Lấy chọn
    if (!sel) return;                              // Nếu không chọn thì thoát
    selectedVoucher = vouchers[parseInt(sel.value, 10)]; // Gán voucher
    voucherModal.classList.add('hidden');          // Ẩn modal
    updateSummary();                               // Cập nhật tổng
  });

  renderCart(); // Khi load, hiển thị giỏ (nếu có dữ liệu lưu)
}

// === Hiển thị giỏ hàng ===
function renderCart() {
  const cartItemsEl = document.getElementById('cartItems'); // Container giỏ
  cartItemsEl.innerHTML = '';                             // Xóa cũ

  if (cart.length === 0) {                                // Nếu trống
    document.getElementById('emptyCartPage').classList.remove('hidden');
    document.getElementById('cartPage').classList.add('hidden');
    return;
  }

  document.getElementById('emptyCartPage').classList.add('hidden');
  document.getElementById('cartPage').classList.remove('hidden');

  cart.forEach(item => {                                  // Duyệt từng mục
    const row = document.createElement('div');
    row.className = 'cart-item';                         // Class
    row.innerHTML = `
      <div>${item.title}</div>
      <div>
        <input type="number" min="1" value="${item.qty}" data-id="${item.id}"> <!-- Số lượng -->
        x $${item.price.toFixed(2)} <!-- Giá -->
      </div>
      <button class="btn" data-remove="${item.id}">Remove</button> <!-- Xóa -->
    `;

    // Thay đổi số lượng
    row.querySelector('input').addEventListener('change', e => {
      const newQty = parseInt(e.target.value, 10);
      if (newQty < 1) return;
      item.qty = newQty;
      updateSummary();
    });

    // Xóa sản phẩm
    row.querySelector('[data-remove]').addEventListener('click', () => {
      cart = cart.filter(ci => ci.id !== item.id);
      renderCart();
    });

    cartItemsEl.appendChild(row);                        // Thêm vào DOM
  });

  updateSummary();                                       // Cập nhật tổng
}

// === Cập nhật tổng tiền & số lượng ===
function updateSummary() {
  const totalQty    = cart.reduce((sum, i) => sum + i.qty, 0);               // Tổng số lượng
  let total         = cart.reduce((sum, i) => sum + i.qty * i.price, 0);     // Tổng giá gốc
  const voucherInfo = document.getElementById('voucherInfo');
  const totalQtyEl  = document.getElementById('totalQty');
  const totalPriceEl= document.getElementById('totalPrice');

  if (selectedVoucher) {                      // Nếu có voucher
    total *= (1 - selectedVoucher.discount); // Áp dụng giảm
    voucherInfo.textContent =                
      `Voucher: ${selectedVoucher.code} (-${(selectedVoucher.discount*100).toFixed(0)}%)`; // Hiển thị
    voucherInfo.classList.remove('hidden');  // Hiện info voucher
  }

  totalQtyEl.textContent   = totalQty;        // Hiển thị số lượng
  totalPriceEl.textContent = total.toFixed(2); // Hiển thị giá
}

// === Hiển thị danh sách voucher ===
function renderVouchers() {
  const voucherListEl = document.getElementById('voucherList');
  voucherListEl.innerHTML = '';                            // Xóa cũ
  vouchers.forEach((v, idx) => {                          // Duyệt voucher
    const div = document.createElement('div');
    div.className = 'voucher-item';                       // Class
    div.innerHTML = `
      <input type="radio" name="voucher" id="vc${idx}" value="${idx}"> <!-- Radio -->
      <label for="vc${idx}">${v.code} - ${(v.discount*100).toFixed(0)}% off</label> <!-- Nhãn -->
    `;
    voucherListEl.appendChild(div);
  });
}