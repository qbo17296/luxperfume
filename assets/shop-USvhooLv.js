import{t as e}from"./modulepreload-polyfill-yVhJf0Pe.js";/* empty css              */import{t}from"./main-DePMuh0t.js";var n=e((()=>{window.productsData=[{id:`p1`,name:`Rose Mystique`,brand:`Lux Exclusif`,price:45e5,category:`unisex`,scent:`floral`,shortDesc:`Hồng Đan Mạch • Trầm Hương • Hổ Phách`,image:`/assets/images/p1.png`},{id:`p2`,name:`Oud Éternel`,brand:`Lux Exclusif`,price:62e5,category:`nam`,scent:`woody`,shortDesc:`Gỗ Đàn Hương • Vani • Xạ Hương`,image:`/assets/images/p2.png`},{id:`p3`,name:`Midnight Citrus`,brand:`Lux Exclusif`,price:38e5,category:`nam`,scent:`citrus`,shortDesc:`Cam Bergamot • Oải Hương • Cỏ Hương Bài`,image:`/assets/images/p3.png`},{id:`p4`,name:`Velvet Iris`,brand:`Lux Exclusif`,price:59e5,category:`nữ`,scent:`floral`,shortDesc:`Hoa Diên Vĩ • Cacao • Gỗ Tuyết Tùng`,image:`/assets/images/p4.png`},{id:`p5`,name:`Jasmine Noir`,brand:`Lux Exclusif`,price:42e5,category:`nữ`,scent:`floral`,shortDesc:`Hoa Nhài • Trà Đen • Xạ Hương`,image:`/assets/images/p1.png`},{id:`p6`,name:`Aqua Celestia`,brand:`Lux Exclusif`,price:35e5,category:`unisex`,scent:`citrus`,shortDesc:`Bạc Hà • Hoa Linh Lan • Xạ Trắng`,image:`/assets/images/p2.png`},{id:`p7`,name:`Leather & Wood`,brand:`Lux Exclusif`,price:55e5,category:`nam`,scent:`woody`,shortDesc:`Da Thuộc • Thảo Quả • Đàn Hương`,image:`/assets/images/p3.png`},{id:`p8`,name:`Vanilla Dream`,brand:`Lux Exclusif`,price:48e5,category:`nữ`,scent:`oriental`,shortDesc:`Vani Madagascar • Caramel • Hạnh Nhân`,image:`/assets/images/p4.png`}]})),r=e((()=>{n(),document.addEventListener(`DOMContentLoaded`,()=>{let e=document.getElementById(`shop-grid`),t=document.getElementById(`product-count`);if(!e)return;function n(){let n=``;for(let e=0;e<4;e++)n+=`
            <div class="skeleton-card">
                <div class="skeleton-img"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-text short"></div>
                <div class="skeleton-text price"></div>
            </div>
            `;e.innerHTML=n,t&&(t.textContent=`...`)}function r(r){n(),setTimeout(()=>{if(r.length===0){e.innerHTML=`<p>Không tìm thấy sản phẩm nào.</p>`,t&&(t.textContent=0);return}let n=``;r.forEach((e,t)=>{let r=`delay-${t%4}`,i=new Intl.NumberFormat(`vi-VN`).format(e.price)+`₫`;n+=`
                <div class="product-card fade-up ${r}">
                    <div class="product-img-wrapper img-reveal">
                        <a href="/pages/product.html?id=${e.id}">
                            <img src="${e.image}" alt="${e.name}" class="product-img">
                        </a>
                        <div class="product-action-overlay">
                            <button class="btn-primary btn-full" onclick="addToCart({id: '${e.id}', name: '${e.name}', price: ${e.price}, image: '${e.image}', qty: 1})">Thêm vào giỏ</button>
                        </div>
                    </div>
                    <div class="product-info">
                        <div class="product-tags"><span class="tag">${e.category}</span><span class="tag">${e.scent}</span></div>
                        <h3 class="product-name"><a href="/pages/product.html?id=${e.id}">${e.name}</a></h3>
                        <p class="product-notes">${e.shortDesc}</p>
                        <p class="product-price">${i}</p>
                    </div>
                </div>
                `}),e.innerHTML=n,t&&(t.textContent=r.length),setTimeout(()=>{document.querySelectorAll(`.product-card`).forEach(e=>{e.style.transformStyle=`preserve-3d`,e.addEventListener(`mousemove`,t=>{e.style.transition=`none`;let n=e.getBoundingClientRect(),r=t.clientX-n.left,i=t.clientY-n.top,a=n.width/2,o=n.height/2,s=(i-o)/o*-8,c=(r-a)/a*8;e.style.transform=`perspective(1000px) rotateX(${s}deg) rotateY(${c}deg) scale3d(1.02, 1.02, 1.02)`,e.style.boxShadow=`${-c*2}px ${s*2}px 20px rgba(212, 175, 55, 0.1)`}),e.addEventListener(`mouseleave`,()=>{e.style.transition=`transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.6s`,e.style.transform=`perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,e.style.boxShadow=`none`})})},600),setTimeout(()=>{document.querySelectorAll(`.fade-up:not(.visible)`).forEach(e=>{e.classList.add(`visible`)})},50)},500)}function i(e){let t=document.querySelectorAll(`.filter-tag`);t.forEach(n=>{n.addEventListener(`click`,n=>{t.forEach(e=>e.classList.remove(`active`)),n.target.classList.add(`active`);let i=n.target.getAttribute(`data-filter`),a=e;i!==`all`&&(a=e.filter(e=>e.scent===i)),r(a)})})}window.productsData&&(i(window.productsData),r(window.productsData))})}));t(),r();