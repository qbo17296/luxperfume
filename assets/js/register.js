import { app, db } from './firebase-config.js';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js';
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const pwdStrength = document.getElementById('pwd-strength');
    const pwdTrack = document.getElementById('pwd-bar-track');
    
    // Function: Show localized error message
    const showError = (inputElement, message) => {
        const errorSpan = inputElement.parentElement.querySelector('.error-msg');
        if(errorSpan) {
            errorSpan.textContent = message;
            errorSpan.classList.add('show');
        }
        inputElement.style.borderBottomColor = '#ef4444'; // Red indication
    };

    // Function: Clear error state
    const clearError = (inputElement) => {
        const errorSpan = inputElement.parentElement.querySelector('.error-msg');
        if(errorSpan) {
            errorSpan.textContent = '';
            errorSpan.classList.remove('show');
        }
        inputElement.style.borderBottomColor = '#e5e7eb'; // Reset to standard layout border
    };

    // Email validation Regex
    const isValidEmail = (val) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    };

    // 1. Real-time Email validation listener
    email.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        if(val === '') {
            clearError(email);
        } else if(!isValidEmail(val)) {
            showError(email, 'Email không đúng định dạng. Yêu cầu có @ và tên miền.');
        } else {
            clearError(email);
            // Highlight success subtlely
            email.style.borderBottomColor = '#d4af37'; 
        }
    });

    // 2. Real-time Password Validation & Complex Strength Algorithm
    password.addEventListener('input', (e) => {
        const val = e.target.value;
        let score = 0;
        
        if(val.length === 0) {
            pwdTrack.classList.remove('active');
            pwdStrength.style.width = '0';
            clearError(password);
            return;
        }

        // Show track right away
        pwdTrack.classList.add('active');

        // Scoring rules
        if(val.length >= 8) score += 1; // rule 1: length
        if(/[A-Z]/.test(val)) score += 1; // rule 2: uppercase
        if(/[0-9]/.test(val)) score += 1; // rule 3: digit
        if(/[^A-Za-z0-9]/.test(val)) score += 1; // rule 4: special char (optional length bonus)

        // Visual mapping
        if(score <= 1) {
            pwdStrength.style.width = '33%';
            pwdStrength.style.backgroundColor = '#ef4444'; // Đỏ = Yếu
        } else if(score === 2) {
            pwdStrength.style.width = '66%';
            pwdStrength.style.backgroundColor = '#f59e0b'; // Vàng = Trung Bình
        } else {
            pwdStrength.style.width = '100%';
            pwdStrength.style.backgroundColor = '#10b981'; // Xanh lá = Mạnh
        }

        // Output error text constraint
        if(val.length < 8 || !/[A-Z]/.test(val) || !/[0-9]/.test(val)) {
            showError(password, 'Bắt buộc: Tối thiểu 8 ký tự, 1 chữ hoa và 1 số.');
        } else {
            clearError(password);
            password.style.borderBottomColor = '#d4af37';
        }
    });

    // 3. Prevent form submit if criteria incomplete
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Final Sweep checks
        let valid = true;
        const emailVal = email.value.trim();
        const pwdVal = password.value;

        if(!isValidEmail(emailVal)) {
            showError(email, 'Vui lòng cung cấp email hợp lệ trước khi gia nhập.');
            valid = false;
        }
        
        if(pwdVal.length < 8 || !/[A-Z]/.test(pwdVal) || !/[0-9]/.test(pwdVal)) {
            showError(password, 'Chưa đạt mức an toàn. Yêu cầu ít nhất 8 ký tự, chữ hoa & số.');
            valid = false;
        }

        // On completely green submission: Fake a majestic redirect
        if(valid) {
            const btn = document.querySelector('.btn-gold-submit');
            const originalText = 'Đăng Ký';
            btn.innerHTML = '<svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>';
            
            // Check username uniqueness first
            const usernameVal = document.getElementById('username').value.trim();
            const usernameDocRef = doc(db, "users", usernameVal.toLowerCase());
            
            try {
                const usernameSnap = await getDoc(usernameDocRef);
                if (usernameSnap.exists()) {
                    showError(document.getElementById('username'), 'Tên đăng nhập này đã có người sử dụng.');
                    btn.innerHTML = originalText;
                    return;
                }
            } catch (err) {
                showError(document.getElementById('username'), 'Lỗi kiểm tra Tên đăng nhập.');
                btn.innerHTML = originalText;
                return;
            }

            createUserWithEmailAndPassword(auth, emailVal, pwdVal)
                .then(async (userCredential) => {
                    const user = userCredential.user;
                    
                    const fullnameVal = document.getElementById('fullname').value.trim();
                    const phoneVal = document.getElementById('phone').value.trim();
                    const scentVal = document.getElementById('favorite-scent').value;

                    // Save to Firestore
                    try {
                        await setDoc(usernameDocRef, {
                            uid: user.uid,
                            email: emailVal,
                            username: usernameVal,
                            fullname: fullnameVal,
                            phone: phoneVal,
                            favoriteScent: scentVal,
                            createdAt: new Date().toISOString()
                        });
                    } catch (e) {
                        console.error("Error saving user info:", e);
                    }

                    localStorage.setItem('isLoggedIn', 'true');
                    btn.innerHTML = 'Thành công!';
                    btn.style.backgroundColor = '#10b981';
                    setTimeout(() => {
                        // Redirect to the luxurious welcome payload
                        window.location.href = 'welcome.html';
                    }, 800);
                })
                .catch((error) => {
                    btn.innerHTML = originalText;
                    const errorCode = error.code;
                    let errorMsg = 'Lỗi: ' + (error.message || errorCode);
                    if (errorCode === 'auth/email-already-in-use') {
                        errorMsg = 'Email này đã được sử dụng.';
                        showError(email, errorMsg);
                    } else if (errorCode === 'auth/operation-not-allowed') {
                        errorMsg = 'Hệ thống chưa mở tính năng đăng ký (Operation Not Allowed). Vui lòng báo Admin.';
                        showError(password, errorMsg);
                    } else {
                        showError(password, errorMsg);
                    }
                    console.error("Registration Error details:", error);
                });
        }
    });

    // Google Sign In integration
    const btnGoogle = document.getElementById('btn-google-register');
    if (btnGoogle) {
        btnGoogle.addEventListener('click', async () => {
            const provider = new GoogleAuthProvider();
            try {
                const result = await signInWithPopup(auth, provider);
                const user = result.user;
                
                // Lưu dữ liệu vào Firestore nếu là User mới
                const userDocRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userDocRef);
                
                if (!userSnap.exists()) {
                    await setDoc(userDocRef, {
                        uid: user.uid,
                        email: user.email,
                        username: user.email.split('@')[0], 
                        fullname: user.displayName || user.email.split('@')[0],
                        phone: user.phoneNumber || 'Chưa cập nhật',
                        favoriteScent: 'Chưa cập nhật',
                        createdAt: new Date().toISOString()
                    });
                }
                
                localStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'welcome.html';
            } catch (error) {
                console.error("Lỗi đăng ký Google:", error);
                alert("Không thể kết nối với Google: " + error.message);
            }
        });
    }

});
