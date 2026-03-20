// assets/js/checkout.js
import { db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const summaryItemsList = document.getElementById('summaryItemsList');
    const summarySubtotal = document.getElementById('summarySubtotal');
    const summaryShipping = document.getElementById('summaryShipping');
    const summaryTotal = document.getElementById('summaryTotal');
    const summaryOldTotal = document.getElementById('summaryOldTotal');
    const checkoutSummaryWrapper = document.getElementById('checkoutSummaryWrapper');
    
    // Khai báo DOM cho Mã giảm giá
    const discountInput = document.getElementById('discountInput');
    const applyDiscountBtn = document.getElementById('applyDiscountBtn');
    const discountMsg = document.getElementById('discountMsg');
    const discountLine = document.getElementById('discountLine');
    const discountLabel = document.getElementById('discountLabel');
    const discountValue = document.getElementById('discountValue');
    
    // Biến toàn cục để tính toán
    const BASE_SHIPPING = 30000;
    let currentSubtotal = 0;
    let currentShipping = BASE_SHIPPING;
    let currentDiscountAmt = 0;
    let appliedCode = '';
    
    // Logic Render Data
    function loadCheckout() {
        const cartStr = localStorage.getItem('lux_cart');
        let cart = [];
        if(cartStr) {
            try { cart = JSON.parse(cartStr); } catch(e) { console.error(e); }
        }
        
        if(!cart || cart.length === 0) {
            if(checkoutSummaryWrapper) {
                checkoutSummaryWrapper.innerHTML = `
                    <div class="empty-checkout">
                        <h3 style="font-family: 'Playfair Display', serif; margin-bottom: 1.5rem; font-size: 1.5rem; color: var(--jet-black, #111111);">Giỏ hàng trống</h3>
                        <p style="color: #6b7280; margin-bottom: 2rem; line-height: 1.5;">Vui lòng quay lại Cửa hàng và thêm sản phẩm trước khi thanh toán.</p>
                        <a href="shop.html" style="display: inline-block; padding: 0.875rem 2rem; background: var(--jet-black, #111111); color: var(--gold-primary); text-decoration: none; border-radius: 6px; font-weight: 500;">Tiếp tục khám phá</a>
                    </div>
                `;
            }
            const inputs = document.querySelectorAll('.min-input, input[type="radio"]');
            inputs.forEach(input => { input.disabled = true; input.style.opacity = '0.5'; });
            const pMethods = document.querySelector('.payment-methods');
            if(pMethods) {
                pMethods.style.pointerEvents = 'none';
                pMethods.style.opacity = '0.5';
            }
            return;
        }
        
        let html = '';
        currentSubtotal = 0;
        
        cart.forEach(item => {
            currentSubtotal += (item.price * item.qty);
            html += `
                <div class="summary-item">
                    <div class="item-img-container">
                        <img src="${item.image}" alt="${item.name}">
                        <span class="item-qty-badge">${item.qty}</span>
                    </div>
                    <div class="item-info">
                        <div class="item-name">${item.name}</div>
                        <div class="item-price">${item.price.toLocaleString('vi-VN')}₫</div>
                    </div>
                </div>
            `;
        });
        
        if (summaryItemsList) summaryItemsList.innerHTML = html;
        updateTotalsDOM();
    }
    
    // Hàm Update UI Calculator
    function updateTotalsDOM() {
        if (!summarySubtotal) return;
        
        // Tạm tính & Giá Ship hiện tại
        summarySubtotal.innerText = `${currentSubtotal.toLocaleString('vi-VN')}₫`;
        summaryShipping.innerText = currentShipping === 0 ? 'Miễn phí' : `${currentShipping.toLocaleString('vi-VN')}₫`;
        
        // Tính tổng gốc
        const originalTotal = currentSubtotal + BASE_SHIPPING;
        let finalTotal = currentSubtotal + currentShipping - currentDiscountAmt;
        if (finalTotal < 0) finalTotal = 0;
        
        // Nếu có mã trừ tiền hoặc free ship, hiển thị gạch tên Giá cũ
        if (currentDiscountAmt > 0 || currentShipping === 0) {
            summaryOldTotal.style.display = 'block';
            summaryOldTotal.innerText = `${originalTotal.toLocaleString('vi-VN')}₫`;
            
            // Hiện dòng Chiết khấu
            if (currentDiscountAmt > 0) {
                discountLine.style.display = 'flex';
                discountLabel.innerText = `(${appliedCode})`;
                discountValue.innerText = `-${currentDiscountAmt.toLocaleString('vi-VN')}₫`;
            }
        } else {
            summaryOldTotal.style.display = 'none';
            discountLine.style.display = 'none';
        }
        
        summaryTotal.innerText = `${finalTotal.toLocaleString('vi-VN')}₫`;
    }

    // Khởi chạy khi load trang
    loadCheckout();
    
    // --- LOGIC MÃ GIẢM GIÁ (COUPON) ---
    if(applyDiscountBtn) {
        applyDiscountBtn.addEventListener('click', () => {
            const code = discountInput.value.trim().toUpperCase();
            
            // Xử lý State Validation ban đầu
            discountInput.style.borderColor = '#d1d5db';
            discountMsg.style.display = 'block';
            
            if (code === 'LUXVIP') {
                // Áp dụng: Giảm 10% Tạm tính
                appliedCode = 'LUXVIP';
                currentDiscountAmt = Math.floor(currentSubtotal * 0.1);
                currentShipping = BASE_SHIPPING; // reset pass
                
                // Hiệu ứng xanh
                discountInput.style.borderColor = '#10b981';
                discountInput.style.color = '#10b981';
                discountInput.style.fontWeight = '600';
                discountMsg.style.color = '#10b981';
                discountMsg.innerText = 'Áp dụng thành công! (Giảm 10%)';
                
                summaryShipping.style.textDecoration = 'none';
                summaryShipping.style.color = 'var(--jet-black, #111111)';
                
                updateTotalsDOM();
            } else if (code === 'FREESHIP') {
                // Áp dụng: Trừ tiền Ship về 0
                appliedCode = 'FREESHIP';
                currentDiscountAmt = 0; // Không trừ Tạm tính
                currentShipping = 0;
                
                // Hiệu ứng xanh
                discountInput.style.borderColor = '#10b981';
                discountInput.style.color = '#10b981';
                discountInput.style.fontWeight = '600';
                discountMsg.style.color = '#10b981';
                discountMsg.innerText = 'Áp dụng thành công! (Miễn phí Giao hàng)';
                
                summaryShipping.style.textDecoration = 'line-through';
                summaryShipping.style.color = '#9ca3af';
                
                updateTotalsDOM();
            } else {
                // Thất bại: Từ chối thẻ đỏ
                appliedCode = '';
                currentDiscountAmt = 0;
                currentShipping = BASE_SHIPPING; // revert
                
                summaryShipping.style.textDecoration = 'none';
                summaryShipping.style.color = 'var(--jet-black, #111111)';
                
                // Hiệu ứng đỏ
                discountInput.style.borderColor = '#ef4444';
                discountInput.style.color = 'inherit';
                discountInput.style.fontWeight = '500';
                discountMsg.style.color = '#ef4444';
                discountMsg.innerText = 'Mã không hợp lệ hoặc đã hết hạn.';
                
                updateTotalsDOM();
            }
        });
    }

    // --- XỬ LÝ SỰ KIỆN NÚT "XÁC NHẬN ĐẶT HÀNG" ---
    const form = document.getElementById('checkoutForm');
    if(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // --- VALIDATION LÕI ---
            const nameEl = document.getElementById('chkName');
            const phoneEl = document.getElementById('chkPhone');
            const addressEl = document.getElementById('chkAddress');
            const cityEl = document.getElementById('chkCity');
            
            // Helper function báo lỗi
            const showError = (el, msgTxt) => {
                el.style.borderColor = '#ef4444';
                // Cuộn mượt mà
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Hiển thị text lỗi
                const oldMsg = el.parentElement.querySelector('.err-msg');
                if(oldMsg) oldMsg.remove();
                
                const msg = document.createElement('div');
                msg.className = 'err-msg';
                msg.style.color = '#ef4444';
                msg.style.fontSize = '0.8rem';
                msg.style.marginTop = '0.4rem';
                msg.innerText = msgTxt;
                el.parentElement.appendChild(msg);
                
                // Xóa lỗi khi người dùng sửa
                el.addEventListener('input', function clearErr() {
                    el.style.borderColor = '#10b981'; // Xanh lá pass
                    if(msg.parentElement) msg.remove();
                    el.removeEventListener('input', clearErr);
                });
            };

            // 1. Kiểm tra Họ Tên
            if(!nameEl.value.trim()) {
                showError(nameEl, 'Vui lòng nhập Họ và Tên.');
                return;
            }
            
            // 2. Kiểm tra Số Điện Thoại (Regex đúng 10 số)
            const phoneRegex = /^[0-9]{10}$/;
            if(!phoneRegex.test(phoneEl.value.trim())) {
                showError(phoneEl, 'Số điện thoại không hợp lệ (Bắt buộc 10 chữ số).');
                return;
            }
            
            // 3. Kiểm tra Địa chỉ
            if(!addressEl.value.trim()) {
                showError(addressEl, 'Vui lòng nhập chi tiết Địa chỉ nhận hàng.');
                return;
            }
            
            // 4. Kiểm tra Tỉnh/Thành
            if(!cityEl.value.trim()) {
                showError(cityEl, 'Vui lòng nhập Tỉnh / Thành phố.');
                return;
            }
            
            // --- NẾU HỢP LỆ THEO YÊU CẦU ---
            const btn = document.querySelector('.btn-checkout-submit');
            
            // Đổi Loading Spinner
            btn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite; margin: 0 auto; display: block;"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>`;
            btn.style.pointerEvents = 'none'; 
            
            // Build the Order Object
            const cartStr = localStorage.getItem('lux_cart');
            const cart = cartStr ? JSON.parse(cartStr) : [];
            let finalTotal = currentSubtotal + currentShipping - currentDiscountAmt;
            if (finalTotal < 0) finalTotal = 0;

            const auth = getAuth();
            const user = auth.currentUser;

            const orderData = {
                uid: user ? user.uid : 'guest',
                customerInfo: {
                    name: nameEl.value.trim(),
                    phone: phoneEl.value.trim(),
                    address: addressEl.value.trim(),
                    city: cityEl.value.trim()
                },
                items: cart,
                billing: {
                    subtotal: currentSubtotal,
                    shipping: currentShipping,
                    discount: currentDiscountAmt,
                    discountCode: appliedCode,
                    total: finalTotal
                },
                status: 'pending',
                createdAt: serverTimestamp()
            };
            
            try {
                // Save Order to Firestore
                await addDoc(collection(db, "orders"), orderData);
                
                // Clear Cart
                localStorage.removeItem('lux_cart');
                
                // Redirect to Success Page
                window.location.href = 'success.html';
            } catch (err) {
                console.error("Lỗi đặt hàng: ", err);
                btn.innerHTML = 'Xác Nhận Đặt Hàng';
                btn.style.pointerEvents = 'auto';
                alert("Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại sau.");
            }
        });
    }
});
