// admin/js/authGuard.js
import { app } from '../../assets/js/firebase-config.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js';

const auth = getAuth(app);

// Lắng nghe trạng thái đăng nhập
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Nếu chưa đăng nhập, đá văng ra trang Login
        console.warn("Truy cập Admin bị từ chối. Vui lòng đăng nhập.");
        window.location.href = '../pages/login.html';
    } else {
        // Nếu đã đăng nhập, cho phép truy cập.
        // Tương lai có thể verify thêm Custom Claims (Role Admin) ở đây.
        console.log("Xác thực thành công. Tài khoản: " + user.email);
    }
});
