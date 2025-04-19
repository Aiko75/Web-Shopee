// đợi tài liệu tải xong mới bắt đầu xử lý
document.addEventListener('DOMContentLoaded', () => {

  //  lấy tham chiếu đến các phần tử trong trang
  const form = document.getElementById('login-form');                   // form đăng nhập
  const emailinput = document.getElementById('email');                  // ô nhập email
  const passwordinput = document.getElementById('password');            // ô nhập mật khẩu
  const remembercheckbox = document.getElementById('remember');         // checkbox remember me
  const errorcontainer = document.getElementById('error-message');      // nơi hiển thị lỗi
  const fbicon = document.querySelector('.fa-facebook-f');              // icon facebook
  const googleicon = document.querySelector('.fa-google');              // icon google

  // nếu đã lưu user trước đó, tự động điền vào form
  const savedemail = localStorage.getItem('remembereduser');            // lấy email đã lưu
  if (savedemail) {
    emailinput.value = savedemail;                                      // gán vào ô email
    remembercheckbox.checked = true;                                    // tự check ô remember
  }

  // hàm kiểm tra email đúng định dạng
  function isvalidemail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;                             // regex kiểm tra định dạng email
    return re.test(email);                                              // trả về true/false
  }

  //  xử lý khi người dùng submit form
  form.addEventListener('submit', event => {
    event.preventDefault();                                             // ngăn reload trang
    errorcontainer.textContent = '';                                    // xóa lỗi cũ

    const email = emailinput.value.trim();                              // lấy và loại bỏ khoảng trắng
    const password = passwordinput.value.trim();
    let errors = [];                                                    // mảng chứa lỗi nếu có

    // kiểm tra hợp lệ email
    if (!email) {
      errors.push('please enter your email or username.');              // không nhập email
    } else if (!isvalidemail(email)) {
      errors.push('invalid email format.');                             // sai định dạng
    }

    //  nếu có lỗi thì hiển thị ra và dừng xử lý
    if (errors.length) {
      errorcontainer.innerHTML = errors.map(e => `<p>• ${e}</p>`).join('');//  nếu có lỗi thì hiển thị ra và dừng xử lý
      return;
    }
    const btn = form.querySelector('button[type="submit"]');            // lấy nút submit
    btn.disabled = true;                                                // tạm khóa nút
    btn.textContent = 'processing...';                                  // đổi chữ nút

    setTimeout(() => {
      // dữ liệu mẫu để so sánh
      const dummy_email = 'admin@example.com';// email mẫu
      const dummy_pass = '@Abcd1234';// mật khẩu mẫu
       // so sánh với dữ liệu mẫu
      if (email === dummy_email && password === dummy_pass) {            // nếu đúng thì lưu thông tin vào localStorage
        if (remembercheckbox.checked) {
          localStorage.setItem('remembereduser', email);                // lưu email
        } else {
          localStorage.removeItem('remembereduser');                    // xóa nếu không chọn
        }

        alert('login successful!');                                     // báo đăng nhập thành công
        window.location.href = 'home.html';                             // chuyển đến trang chính
      } else {
        errorcontainer.innerHTML = '<p>email or username are not correct!</p>';// báo lỗi nếu không đúng
        passwordinput.value = '';                                       // xóa ô mật khẩu
        btn.disabled = false;                                           // mở lại nút
        btn.textContent = 'login';                                      // khôi phục lại nút
      }
    }, 1000);                                                           // delay 1 giây giả lập xử lý
  });

  fbicon.addEventListener('click', () => {
    alert('login with facebook');
  });
  googleicon.addEventListener('click', () => {
    alert('login with google');
  });

});