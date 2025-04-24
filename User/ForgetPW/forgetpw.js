// đợi cho tài liệu được tải xong hoàn toàn trước khi chạy script
document.addEventListener('DOMContentLoaded', () => {

  // lấy các phần tử tương ứng với các bước trong quy trình
  const step1 = document.getElementById('step1');                  // bước 1: nhập email
  const step2 = document.getElementById('step2');                  // bước 2: nhập otp
  const step3 = document.getElementById('step3');                  // bước 3: đặt lại mật khẩu

  // lấy các input và nút cần thao tác trong flow
  const email = document.getElementById('email');                  // ô input email
  const otp = document.getElementById('otp');                      // ô input otp
  const password = document.getElementById('password');            // ô input mật khẩu mới
  const confirmpassword = document.getElementById('confirmpassword'); // ô nhập lại mật khẩu mới
  const btnget = document.getElementById('btnget');                // nút gửi otp
  const btnverifyotp = document.getElementById('btnverifyotp');    // nút xác minh otp
  const btnreset = document.getElementById('btnreset');            // nút đặt lại mật khẩu

  // lấy các phần tử thông báo và đồng hồ đếm ngược
  const sendmessage = document.getElementById('sendmessage');      // thông báo đã gửi otp
  const countdown = document.getElementById('countdown');          // khối đếm ngược
  const timer = document.getElementById('timer');                  // số giây còn lại

  // hàm tạo delay dùng để mô phỏng chờ xử lý (gửi email, v.v.)
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));        // trả về promise chờ ms mili-giây
  }

  // khi người dùng nhấn gửi mã otp
  btnget.addEventListener('click', async e => {
    e.preventDefault();                                            // ngăn reload form

    if (!email.checkValidity()) {                                  // nếu email không hợp lệ
      email.reportValidity();                                      // hiển thị lỗi HTML5
      return;                                                      // thoát khỏi hàm
    }

    step1.classList.add('hidden');                                 // ẩn bước 1
    step2.classList.remove('hidden');                              // hiện bước 2

    await delay(2000);                                             // giả lập gửi otp trong 5 giây

    sendmessage.classList.remove('hidden');                        // hiển thị thông báo đã gửi otp

    otp.disabled = false;                                          // bật ô nhập otp
    btnverifyotp.disabled = false;                                 // bật nút xác minh otp

    let remaining = 60;                                            // thời gian đếm ngược (giây)
    countdown.classList.remove('hidden');                          // hiện phần countdown
    timer.textContent = remaining;                                 // gán giá trị ban đầu

    const countdowninterval = setInterval(() => {                  // tạo interval đếm ngược mỗi giây
      remaining--;                                                 // giảm 1 giây
      timer.textContent = remaining;                               // cập nhật giao diện

      if (remaining <= 0) {                                        // khi hết thời gian
        clearInterval(countdowninterval);                          // dừng interval
        countdown.textContent = 'You may now send the OTP again.';     // hiển thị thông báo có thể gửi lại
        // todo: thêm nút gửi lại nếu cần
      }
    }, 1000);

    console.log('The OTP has been sent to your email:', email.value);       // log ra email để test
  });

  // khi người dùng nhấn xác minh otp
  btnverifyotp.addEventListener('click', e => {
    e.preventDefault();                                            // ngăn reload

    if (!otp.checkValidity()) {                                    // kiểm tra otp rỗng
      otp.reportValidity();                                        // báo lỗi nếu có
      return;
    }

    const mockotp = '123456';                                      // otp mẫu cố định

    if (otp.value !== mockotp) {                                   // nếu nhập sai otp
      alert('Incorrect OTP. Please try again.');                   // báo lỗi
      return;
    }

    alert('Verification successful!');                                   // xác minh thành công

    step2.classList.add('hidden');                                 // ẩn bước 2
    step3.classList.remove('hidden');                              // hiện bước 3
  });

  // khi người dùng nhấn đặt lại mật khẩu
  btnreset.addEventListener('click', e => {
    e.preventDefault();                                            // ngăn reload

    if (!password.checkValidity() || !confirmpassword.checkValidity()) {
      password.reportValidity();                                   // kiểm tra cả hai ô mật khẩu
      confirmpassword.reportValidity();
      return;
    }

    if (password.value !== confirmpassword.value) {                // kiểm tra khớp mật khẩu
      alert('Password do not match!');                            // báo lỗi nếu không khớp
      password.value = '';                                         // xóa input
      confirmpassword.value = '';
      return;
    }

    alert('Your password has been reset successfully!');           // thành công

    document.getElementById('formstep3').reset();                  // reset form mật khẩu
    step3.classList.add('hidden');                                 // ẩn bước 3

    window.location.href = '../Log In/log_in.html';                          // chuyển đến trang đăng nhập
  });
});
