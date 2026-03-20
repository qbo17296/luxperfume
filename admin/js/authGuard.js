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
        // Kiểm tra quyền Admin
        const adminEmails = ['qvinh121205@gmail.com'];
        if (adminEmails.includes(user.email)) {
             console.log("Xác thực Quyền Admin thành công. Xin chào sếp: " + user.email);
        } else {
             alert('Khu vực này chỉ dành cho Chủ Cửa Hàng. Bạn không có quyền truy cập!');
             window.location.href = '../index.html';
        }
    }
});
