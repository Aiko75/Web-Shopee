// lấy form container chính
const form = document.querySelector('.container');                                      // form chính

// lấy các input theo placeholder
const nameinput = document.querySelector('input[placeholder="Name"]');                 // ô nhập họ tên
const usernameinput = document.querySelector('input[placeholder="Username"]');         // ô nhập tên đăng nhập
const emailinput = document.querySelector('input[placeholder="Email"]');               // ô nhập email
const passwordinput = document.querySelector('input[placeholder="Password"]');         // ô nhập mật khẩu
const confirmpasswordinput = document.querySelector('input[placeholder="Confirm Password"]'); // ô xác nhận lại mật khẩu

// checkbox đồng ý điều khoản
const agreecheckbox = document.getElementById('agree');

// nút đăng ký
const submitbutton = document.querySelector('.btn');

// icon mạng xã hội
const fbicon = document.querySelector('.fa-facebook-f');                                // icon facebook
const googleicon = document.querySelector('.fa-google');                                // icon google

// hàm kiểm tra định dạng email có hợp lệ không
function isvalidemail(email) {
  const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;                                       // regex kiểm tra email
  return emailregex.test(email);                                                        // true nếu hợp lệ
}

// hàm kiểm tra độ mạnh của mật khẩu
function isstrongpassword(password) {
  const passwordregex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
  return passwordregex.test(password);                                                  // true nếu mạnh
}

// bắt sự kiện click vào nút đăng ký
submitbutton.addEventListener('click', (e) => {
  e.preventDefault();                                                                   // ngăn reload form

  // kiểm tra có ô nào bị trống không
  if (!nameinput.value || !usernameinput.value || !emailinput.value || 
      !passwordinput.value || !confirmpasswordinput.value) {
    alert('please fill in all required fields!');
    return;
  }

  // kiểm tra định dạng email
  if (!isvalidemail(emailinput.value)) {
    alert('invalid email format!');
    return;
  }

  // kiểm tra độ mạnh của mật khẩu
  if (!isstrongpassword(passwordinput.value)) {
    alert('password must be at least 8 characters and include uppercase, lowercase, number, and special character!');
    return;
  }

  // kiểm tra mật khẩu xác nhận có trùng không
  if (passwordinput.value !== confirmpasswordinput.value) {
    alert('passwords do not match!');
    return;
  }

  // kiểm tra đã tick đồng ý điều khoản chưa
  if (!agreecheckbox.checked) {
    alert('you must agree to the terms and conditions!');
    return;
  }

  // nếu mọi thứ hợp lệ thì hiển thị thông báo thành công và chuyển hướng
  alert('registration successful!');
  window.location.href = "log_in.html";                                                 // chuyển sang trang login
});

// sự kiện click icon facebook
fbicon.addEventListener('click', () => {
  alert('login with facebook');

});

// sự kiện click icon google
googleicon.addEventListener('click', () => {
  alert('login with google');
});