// shop.js - Logic for the shop page correctly rendering products from mock data

document.addEventListener('DOMContentLoaded', () => {
    const shopGrid = document.getElementById('shop-grid');
    const productCount = document.getElementById('product-count');

    if (!shopGrid) return; // NÃªú khÃ´ng pháº£i trang shop thÃ¬ thoÃ¡t 

    function renderProducts(items) {
        if (items.length === 0) {
            shopGrid.innerHTML = '<p>Không tìm thấy sản phẩm nào.</p>';
            return;
        }

        let html = '';
        items.forEach((p, index) => {
            const delayClass = `delay-${index % 4}`;
            
            // Format price
            const priceStr = new Intl.NumberFormat('vi-VN').format(p.price) + '₫';

            html += `
            <div class="product-card fade-up ${delayClass}">
                <div class="product-img-wrapper img-reveal">
                    <a href="product.html?id=${p.id}">
                        <img src="${p.image}" alt="${p.name}" class="product-img">
                    </a>
                    <div class="product-action-overlay">
                        <button class="btn-primary btn-full" onclick="addToCart({id: '${p.id}', name: '${p.name}', price: ${p.price}, image: '${p.image}', qty: 1})">Thêm vào giỏ</button>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-tags"><span class="tag">${p.category}</span></div>
                    <h3 class="product-name"><a href="product.html?id=${p.id}">${p.name}</a></h3>
                    <p class="product-notes">${p.shortDesc}</p>
                    <p class="product-price">${priceStr}</p>
                </div>
            </div>
            `;
        });
        
        shopGrid.innerHTML = html;
        if(productCount) productCount.textContent = items.length;
        
        // Trigger animations for new elements
        setTimeout(() => {
            document.querySelectorAll('.fade-up:not(.visible)').forEach(el => {
                el.classList.add('visible');
            });
        }, 100);
    }

    // Render táº¥t cáº£ sán pháº©m
    if(window.productsData) {
        renderProducts(window.productsData);
    }
});
