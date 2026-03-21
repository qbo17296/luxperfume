// cart.js - Vanilla JS LocalStorage Cart Logic

// Lấy giỏ hàng từ LocalStorage
function getCart() {
    const stored = localStorage.getItem('lux_cart');
    return stored ? JSON.parse(stored) : [];
}

// Lưu giỏ hàng vào LocalStorage
function saveCart(cartItems) {
    localStorage.setItem('lux_cart', JSON.stringify(cartItems));
    updateCartCount();
    renderCartPage(); 
}

// Global addToCart (Dùng chung cho Trang chủ và Trang Chi tiết)
window.addToCart = function(product) {
    let cartItems = getCart();
    const existing = cartItems.find(item => item.id === product.id);
    if(existing) {
        existing.qty += product.qty || 1;
    } else {
        cartItems.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            qty: product.qty || 1
        });
    }
    saveCart(cartItems);
    if (typeof openCartDrawer === 'function') openCartDrawer();
}

function removeFromCart(id) {
    let cartItems = getCart();
    cartItems = cartItems.filter(item => item.id !== id);
    saveCart(cartItems);
}

window.removeFromCart = removeFromCart;

function updateQty(id, delta) {
    let cartItems = getCart();
    const item = cartItems.find(item => item.id === id);
    if(item) {
        item.qty += delta;
        if(item.qty < 1) item.qty = 1;
        if(item.qty > 10) item.qty = 10;
        saveCart(cartItems);
    }
}

window.updateQty = updateQty;

// Cập nhật số lượng trên icon Header (badge)
function updateCartCount() {
    let cartItems = getCart();
    const countNodes = document.querySelectorAll('.cart-count');
    const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0);
    
    countNodes.forEach(node => {
        node.textContent = totalQty;
        // Animation hiệu ứng nhấp nháy
        node.style.transform = 'scale(1.5)';
        setTimeout(() => {
            node.style.transform = 'scale(1)';
        }, 300);
    });
}

// Hàm format tiền tệ VNĐ
function formatVND(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
}

// Render dữ liệu ra HTML trong trang Giỏ Hàng
function renderCartPage() {
    const cartList = document.getElementById('cart-list');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryTotal = document.getElementById('summary-total');

    if(!cartList) return; // Nếu không đứng ở trang giỏ hàng thì thoát

    let cartItems = getCart();

    if(cartItems.length === 0) {
        cartList.innerHTML = `<div class="empty-cart-msg">Giỏ hàng đang trống. <br><br> <a href="../index.html" class="btn-primary">Tiếp tục mua sắm</a></div>`;
        summarySubtotal.textContent = '0₫';
        summaryTotal.textContent = '0₫';
        return;
    }

    let html = '';
    let totalValue = 0;

    cartItems.forEach(item => {
        const itemTotal = item.price * item.qty;
        totalValue += itemTotal;

        html += `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div>
                <h4 class="item-info-name">${item.name}</h4>
                <p class="item-price">${formatVND(item.price)}</p>
            </div>
            <div class="qty-control">
                <button onclick="updateQty('${item.id}', -1)">−</button>
                <input type="text" value="${item.qty}" readonly style="width:40px; text-align:center;">
                <button onclick="updateQty('${item.id}', 1)">+</button>
            </div>
            <div class="item-subtotal">${formatVND(itemTotal)}</div>
            <button class="delete-btn" title="Xóa" onclick="removeFromCart('${item.id}')">&times;</button>
        </div>
        `;
    });

    cartList.innerHTML = html;
    summarySubtotal.textContent = formatVND(totalValue);
    summaryTotal.textContent = formatVND(totalValue); 
}

// Chạy 1 lần khi trang được load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderCartPage(); 
});

window.openCartDrawer = function() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if(drawer && overlay) {
        drawer.classList.add('open');
        overlay.classList.add('open');
        renderCartDrawer();
    }
}
window.closeCartDrawer = function() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if(drawer && overlay) {
        drawer.classList.remove('open');
        overlay.classList.remove('open');
    }
}
window.renderCartDrawer = function() {
    const list = document.getElementById('cartDrawerList');
    const subtotalNode = document.getElementById('cartDrawerSubtotal');
    if(!list) return;

    let cartItems = getCart();
    if(cartItems.length === 0) {
        list.innerHTML = '<div class="cart-drawer-empty">Giỏ hàng của bạn đang trống.</div>';
        if(subtotalNode) subtotalNode.textContent = '0₫';
        return;
    }

    let html = '';
    let totalValue = 0;
    cartItems.forEach(item => {
        totalValue += item.price * item.qty;
        html += `
        <div class="cart-drawer-item">
            <img src="${item.image}" alt="${item.name}" class="cart-drawer-item-img">
            <div class="cart-drawer-item-info">
                <div style="display:flex; justify-content:space-between">
                    <div class="cart-drawer-item-title">${item.name}</div>
                    <button class="cart-drawer-item-remove" onclick="removeFromCart('${item.id}'); renderCartDrawer()">&times;</button>
                </div>
                <div class="cart-drawer-item-price">${formatVND(item.price)}</div>
                <div class="cart-drawer-item-qty">
                    <button onclick="updateQty('${item.id}', -1); renderCartDrawer()">-</button>
                    <input type="text" value="${item.qty}" readonly>
                    <button onclick="updateQty('${item.id}', 1); renderCartDrawer()">+</button>
                </div>
            </div>
        </div>
        `;
    });
    list.innerHTML = html;
    if(subtotalNode) subtotalNode.textContent = formatVND(totalValue);
}
