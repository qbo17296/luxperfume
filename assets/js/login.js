import { app, db } from './firebase-config.js';
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    const showError = (inputElement, message) => {
        const errorSpan = inputElement.parentElement.querySelector('.error-msg');
        if(errorSpan) {
            errorSpan.textContent = message;
            errorSpan.classList.add('show');
        }
        inputElement.style.borderBottomColor = '#ef4444'; // Red border
    };

    const clearError = (inputElement) => {
        const errorSpan = inputElement.parentElement.querySelector('.error-msg');
        if(errorSpan) {
            errorSpan.textContent = '';
            errorSpan.classList.remove('show');
        }
        inputElement.style.borderBottomColor = '#e5e7eb'; // Default border
    };

    // Remove errors upon typing
    if(email) email.addEventListener('input', () => clearError(email));
    if(password) password.addEventListener('input', () => clearError(password));

    if(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            let valid = true;
            const emailVal = email.value.trim();
            const pwdVal = password.value;

            // Empty checks
            if(emailVal === '') {
                showError(email, 'Vui lòng nhập Email hoặc Username của bạn.');
                valid = false;
            }
            
            if(pwdVal === '') {
                showError(password, 'Vui lòng nhập mật khẩu.');
                valid = false;
            }

            if(!valid) return;

            // Simulating Backend Verification
            const btn = document.querySelector('.btn-black-submit');
            const originalText = btn.innerHTML;
            
            // Loading spinner
            btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>';

            let loginEmail = emailVal;
            
            // Nếu không có '@', hiểu là Username
            if (!loginEmail.includes('@')) {
                const usernameDocRef = doc(db, "users", loginEmail.toLowerCase());
                try {
                    const docSnap = await getDoc(usernameDocRef);
                    if (docSnap.exists()) {
                        loginEmail = docSnap.data().email;
                    } else {
                        btn.innerHTML = originalText;
                        showError(email, 'Tài khoản (Username) không tồn tại.');
                        return;
                    }
                } catch (e) {
                    btn.innerHTML = originalText;
                    showError(email, 'Lỗi kết nối máy chủ dữ liệu.');
                    return;
                }
            }

            signInWithEmailAndPassword(auth, loginEmail, pwdVal)
                .then((userCredential) => {
                    // Success Path
                    localStorage.setItem('isLoggedIn', 'true');
                    btn.innerHTML = 'Thành công!';
                    btn.style.backgroundColor = '#10b981';
                    btn.style.borderColor = '#10b981';
                    btn.style.color = '#fff';
                    
                    setTimeout(() => {
                        window.location.href = '../index.html';
                    }, 800);
                })
                .catch((error) => {
                    // Fail Path
                    btn.innerHTML = originalText;
                    const errorCode = error.code;
                    let errorMsg = 'Tài khoản hoặc Mật khẩu không chính xác.';
                    if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential') {
                        errorMsg = 'Tài khoản hoặc Mật khẩu không chính xác.';
                    } else if (errorCode === 'auth/too-many-requests') {
                        errorMsg = 'Quá nhiều lần thử. Vui lòng thử lại sau.';
                    }
                    showError(password, errorMsg);
                });
        });
    }
});
