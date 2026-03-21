import{t as e}from"./modulepreload-polyfill-yVhJf0Pe.js";var t=e((()=>{function e(){let e=localStorage.getItem(`lux_cart`);return e?JSON.parse(e):[]}function t(e){localStorage.setItem(`lux_cart`,JSON.stringify(e)),i(),o()}window.addToCart=function(n){let r=e(),i=r.find(e=>e.id===n.id);i?i.qty+=n.qty||1:r.push({id:n.id,name:n.name,price:n.price,image:n.image,qty:n.qty||1}),t(r),typeof openCartDrawer==`function`&&openCartDrawer()};function n(n){let r=e();r=r.filter(e=>e.id!==n),t(r)}window.removeFromCart=n;function r(n,r){let i=e(),a=i.find(e=>e.id===n);a&&(a.qty+=r,a.qty<1&&(a.qty=1),a.qty>10&&(a.qty=10),t(i))}window.updateQty=r;function i(){let t=e(),n=document.querySelectorAll(`.cart-count`),r=t.reduce((e,t)=>e+t.qty,0);n.forEach(e=>{e.textContent=r,e.style.transform=`scale(1.5)`,setTimeout(()=>{e.style.transform=`scale(1)`},300)})}function a(e){return new Intl.NumberFormat(`vi-VN`).format(e)+`₫`}function o(){let t=document.getElementById(`cart-list`),n=document.getElementById(`summary-subtotal`),r=document.getElementById(`summary-total`);if(!t)return;let i=e();if(i.length===0){t.innerHTML=`<div class="empty-cart-msg">Giỏ hàng đang trống. <br><br> <a href="../index.html" class="btn-primary">Tiếp tục mua sắm</a></div>`,n.textContent=`0₫`,r.textContent=`0₫`;return}let o=``,s=0;i.forEach(e=>{let t=e.price*e.qty;s+=t,o+=`
        <div class="cart-item">
            <img src="${e.image}" alt="${e.name}" class="cart-item-img">
            <div>
                <h4 class="item-info-name">${e.name}</h4>
                <p class="item-price">${a(e.price)}</p>
            </div>
            <div class="qty-control">
                <button onclick="updateQty('${e.id}', -1)">−</button>
                <input type="text" value="${e.qty}" readonly style="width:40px; text-align:center;">
                <button onclick="updateQty('${e.id}', 1)">+</button>
            </div>
            <div class="item-subtotal">${a(t)}</div>
            <button class="delete-btn" title="Xóa" onclick="removeFromCart('${e.id}')">&times;</button>
        </div>
        `}),t.innerHTML=o,n.textContent=a(s),r.textContent=a(s)}document.addEventListener(`DOMContentLoaded`,()=>{i(),o()}),window.openCartDrawer=function(){let e=document.getElementById(`cartDrawer`),t=document.getElementById(`cartOverlay`);e&&t&&(e.classList.add(`open`),t.classList.add(`open`),renderCartDrawer())},window.closeCartDrawer=function(){let e=document.getElementById(`cartDrawer`),t=document.getElementById(`cartOverlay`);e&&t&&(e.classList.remove(`open`),t.classList.remove(`open`))},window.renderCartDrawer=function(){let t=document.getElementById(`cartDrawerList`),n=document.getElementById(`cartDrawerSubtotal`);if(!t)return;let r=e();if(r.length===0){t.innerHTML=`<div class="cart-drawer-empty">Giỏ hàng của bạn đang trống.</div>`,n&&(n.textContent=`0₫`);return}let i=``,o=0;r.forEach(e=>{o+=e.price*e.qty,i+=`
        <div class="cart-drawer-item">
            <img src="${e.image}" alt="${e.name}" class="cart-drawer-item-img">
            <div class="cart-drawer-item-info">
                <div style="display:flex; justify-content:space-between">
                    <div class="cart-drawer-item-title">${e.name}</div>
                    <button class="cart-drawer-item-remove" onclick="removeFromCart('${e.id}'); renderCartDrawer()">&times;</button>
                </div>
                <div class="cart-drawer-item-price">${a(e.price)}</div>
                <div class="cart-drawer-item-qty">
                    <button onclick="updateQty('${e.id}', -1); renderCartDrawer()">-</button>
                    <input type="text" value="${e.qty}" readonly>
                    <button onclick="updateQty('${e.id}', 1); renderCartDrawer()">+</button>
                </div>
            </div>
        </div>
        `}),t.innerHTML=i,n&&(n.textContent=a(o))}})),n=e((()=>{document.addEventListener(`DOMContentLoaded`,()=>{document.querySelectorAll(`.btn-primary, .magnetic`).forEach(e=>{e.style.transition=`transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.3s`,e.addEventListener(`mousemove`,t=>{let n=e.getBoundingClientRect(),r=t.clientX-n.left-n.width/2,i=t.clientY-n.top-n.height/2;e.style.transform=`translate(${r*.15}px, ${i*.15}px)`}),e.addEventListener(`mouseleave`,()=>{e.style.transition=`transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.3s`,e.style.transform=`translate(0px, 0px)`,setTimeout(()=>{e.style.transition=`transform 0.1s linear, background-color 0.3s`},500)})}),document.querySelectorAll(`.product-card, .main-image-wrapper`).forEach(e=>{e.style.transformStyle=`preserve-3d`,e.addEventListener(`mousemove`,t=>{e.style.transition=`none`;let n=e.getBoundingClientRect(),r=t.clientX-n.left,i=t.clientY-n.top,a=n.width/2,o=n.height/2,s=(i-o)/o*-8,c=(r-a)/a*8;e.style.transform=`perspective(1000px) rotateX(${s}deg) rotateY(${c}deg) scale3d(1.02, 1.02, 1.02)`,e.style.boxShadow=`${-c*2}px ${s*2}px 20px rgba(212, 175, 55, 0.1)`}),e.addEventListener(`mouseleave`,()=>{e.style.transition=`transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.6s`,e.style.transform=`perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,e.style.boxShadow=`none`})});let e=document.querySelectorAll(`.section-title`);if(!document.getElementById(`reveal-keyframes`)){let e=document.createElement(`style`);e.id=`reveal-keyframes`,e.innerHTML=`
        @keyframes charReveal {
            0% { transform: translateY(100%); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
        }
        .reveal-word { display: inline-block; overflow: hidden; vertical-align: bottom; }
        .reveal-char { display: inline-block; transform: translateY(100%); opacity: 0; animation: charReveal 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        `,document.head.appendChild(e)}e.forEach(e=>{let t=e.innerText.trim().split(/\s+/),n=0;e.innerHTML=t.map(e=>`<span class="reveal-word">${e.split(``).map(e=>(n+=.03,`<span class="reveal-char" style="animation-delay: ${n}s">${e}</span>`)).join(``)}</span>`).join(`&nbsp;`),e.style.opacity=1})})})),r=e((()=>{t(),n(),document.addEventListener(`DOMContentLoaded`,()=>{let e=document.getElementById(`navbar`);window.addEventListener(`scroll`,()=>{window.scrollY>50?e.classList.add(`scrolled`):e.classList.remove(`scrolled`)});let t={root:null,rootMargin:`0px`,threshold:.15},n=document.querySelectorAll(`.fade-up`),r=new IntersectionObserver((e,t)=>{e.forEach(e=>{e.isIntersecting&&(e.target.classList.add(`visible`),t.unobserve(e.target))})},t);n.forEach(e=>r.observe(e))})}));export{r as t};