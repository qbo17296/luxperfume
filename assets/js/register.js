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
    form.addEventListener('submit', (e) => {
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
            btn.innerHTML = '<svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>';
            
            setTimeout(() => {
                btn.innerHTML = 'Thành công!';
                btn.style.backgroundColor = '#10b981';
                setTimeout(() => {
                    // Redirect to the luxurious welcome payload
                    window.location.href = 'welcome.html';
                }, 800);
            }, 1200);
        }
    });

});
