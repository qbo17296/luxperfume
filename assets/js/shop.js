// shop.js - Logic for the shop page correctly rendering products from mock data

document.addEventListener('DOMContentLoaded', () => {
    const shopGrid = document.getElementById('shop-grid');
    const productCount = document.getElementById('product-count');

    if (!shopGrid) return;

    function renderSkeleton() {
        let html = '';
        for(let i=0; i<4; i++) {
            html += `
            <div class="skeleton-card">
                <div class="skeleton-img"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-text short"></div>
                <div class="skeleton-text price"></div>
            </div>
            `;
        }
        shopGrid.innerHTML = html;
        if(productCount) productCount.textContent = '...';
    }

    function renderProducts(items) {
        renderSkeleton(); // Bật Skeleton trước

        setTimeout(() => { // Đợi 500ms cho sang trọng
            if (items.length === 0) {
                shopGrid.innerHTML = '<p>Không tìm thấy sản phẩm nào.</p>';
                if(productCount) productCount.textContent = 0;
                return;
            }

            let html = '';
            items.forEach((p, index) => {
                const delayClass = `delay-${index % 4}`;
                const priceStr = new Intl.NumberFormat('vi-VN').format(p.price) + '₫';

                html += `
                <div class="product-card fade-up ${delayClass}">
                    <div class="product-img-wrapper img-reveal">
                        <a href="/pages/product.html?id=${p.id}">
                            <img src="${p.image}" alt="${p.name}" class="product-img">
                        </a>
                        <div class="product-action-overlay">
                            <button class="btn-primary btn-full" onclick="addToCart({id: '${p.id}', name: '${p.name}', price: ${p.price}, image: '${p.image}', qty: 1})">Thêm vào giỏ</button>
                        </div>
                    </div>
                    <div class="product-info">
                        <div class="product-tags"><span class="tag">${p.category}</span><span class="tag">${p.scent}</span></div>
                        <h3 class="product-name"><a href="/pages/product.html?id=${p.id}">${p.name}</a></h3>
                        <p class="product-notes">${p.shortDesc}</p>
                        <p class="product-price">${priceStr}</p>
                    </div>
                </div>
                `;
            });
            
            shopGrid.innerHTML = html;
            if(productCount) productCount.textContent = items.length;
            
            // Trigger animations
            setTimeout(() => {
                document.querySelectorAll('.fade-up:not(.visible)').forEach(el => {
                    el.classList.add('visible');
                });
            }, 50);
        }, 500);
    }

    function initFilters(items) {
        const tags = document.querySelectorAll('.filter-tag');
        tags.forEach(tag => {
            tag.addEventListener('click', (e) => {
                tags.forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                
                const filter = e.target.getAttribute('data-filter');
                let filtered = items;
                if(filter !== 'all') {
                    filtered = items.filter(p => p.scent === filter);
                }
                renderProducts(filtered);
            });
        });
    }

    if(window.productsData) {
        initFilters(window.productsData);
        renderProducts(window.productsData);
    }
});