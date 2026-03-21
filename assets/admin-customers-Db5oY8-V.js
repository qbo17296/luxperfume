import{t as e}from"./modulepreload-polyfill-yVhJf0Pe.js";import{n as t,r as n}from"./firebase-config-BaseM2aD.js";/* empty css              */import{t as r}from"./authGuard-NPMyxOLT.js";import{collection as i,getDocs as a}from"https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";e((()=>{n();var e=[],r=e=>`https://ui-avatars.com/api/?name=${encodeURIComponent(e)}&background=f4f6f8&color=d4af37&font-size=0.4&bold=true`,o=e=>e===0?`0₫`:new Intl.NumberFormat(`vi-VN`).format(e)+`₫`;function s(e){return e>3e7?`VVIP`:e>15e6?`VIP`:e>5e6?`Thân thiết`:`Mới`}var c={Woody:`#854d0e`,Floral:`#ec4899`,Citrus:`#eab308`,Oriental:`#d946ef`,Mixed:`#64748b`},l={Woody:`Hương Gỗ (Woody)`,Floral:`Hương Hoa Cỏ (Floral)`,Citrus:`Hương Cam Chanh (Citrus)`,Oriental:`Hương Phương Đông (Oriental)`,Mixed:`Hỗn hợp (Mixed)`},u=null;window.openCustomerPanel=function(t){let n=e.find(e=>e.id===t);if(!n)return;u=t,document.getElementById(`panel-customer-name`).innerText=n.name,document.getElementById(`video-script-container`).style.display=`none`;let r=document.getElementById(`scent-bars-container`);if(r.innerHTML=``,n.history.length===0)r.innerHTML=`<p class="text-secondary text-sm">Khách hàng chưa có lịch sử mua sắm để phân tích.</p>`;else{let e={},t=0;n.history.forEach(n=>{e[n.family]=(e[n.family]||0)+1,t++}),Object.keys(e).sort((t,n)=>e[n]-e[t]).forEach(n=>{let i=Math.round(e[n]/t*100),a=c[n]||`#d4af37`,o=`
                <div class="scent-bar-wrap">
                    <div class="scent-bar-header">
                        <span>${l[n]||n}</span>
                        <span>${i}%</span>
                    </div>
                    <div class="progress-bg">
                        <div class="progress-fill" style="width: 0%; background: ${a};" data-width="${i}%"></div>
                    </div>
                </div>
            `;r.innerHTML+=o})}let i=document.getElementById(`purchase-history-list`);i.innerHTML=``,n.history.length===0?i.innerHTML=`<p class="text-secondary text-sm">Chưa có giao dịch.</p>`:n.history.forEach(e=>{i.innerHTML+=`
                <li class="history-item">
                    <div class="history-item-info">
                        <span class="history-name">${e.item}</span>
                        <span class="history-date">${e.date}</span>
                    </div>
                    <span class="text-gold" style="font-weight: 500;">${o(e.price)}</span>
                </li>
            `}),document.getElementById(`customer-panel-overlay`).classList.add(`show`),document.getElementById(`customer-panel`).classList.add(`show`),setTimeout(()=>{document.querySelectorAll(`.progress-fill`).forEach(e=>{e.style.width=e.getAttribute(`data-width`)})},100)},window.closeCustomerPanel=function(){document.getElementById(`customer-panel-overlay`).classList.remove(`show`),document.getElementById(`customer-panel`).classList.remove(`show`),setTimeout(()=>{document.querySelectorAll(`.progress-fill`).forEach(e=>{e.style.width=`0%`})},300)},window.generateTributeVideo=function(){if(!u)return;let t=e.find(e=>e.id===u),n=`những tuyệt tác mùi hương`;if(t.history&&t.history.length>0){let e={};t.history.forEach(t=>{e[t.item]=(e[t.item]||0)+1}),n=Object.keys(e).sort((t,n)=>e[n]-e[t])[0]}let r=`Xin chào tất cả mọi người! 🎉
Hôm nay Lux Perfume làm video này để gửi lời cảm ơn chân thành nhất tới vị khách hàng vô cùng đáng quý của chúng ta: Anh/Chị ${t.name}.

Chúng mình cực kỳ ấn tượng vì anh/chị đã nhiều lần tin tưởng và lựa chọn dòng sản phẩm ${n} tại Lux Perfume. Sự ủng hộ của những khách hàng tuyệt vời như anh/chị ${t.name} chính là động lực lớn nhất để Lux Perfume tiếp tục mang về những mùi hương đẳng cấp thế giới!

-----------------
- theo dõi, thả tim, lưu video, bình luận,...
- Cảm ơn đã xem`,i=document.getElementById(`video-script-container`),a=document.getElementById(`tribute-script-textarea`);a.value=r,i.style.display=`flex`},window.copyTributeScript=function(){let e=document.getElementById(`tribute-script-textarea`);e.select(),navigator.clipboard.writeText(e.value).then(()=>{alert(`Đã copy kịch bản tri ân thành công!`)}).catch(e=>{console.error(`Lỗi khi copy`,e)})};var d=document.querySelector(`#customers-table tbody`);function f(e){if(d.innerHTML=``,e.length===0){d.innerHTML=`<tr><td colspan="7" class="text-center" style="padding: 2rem;">Không tìm thấy khách hàng nào</td></tr>`;return}e.forEach((e,t)=>{let n=s(e.spent),i=``,a=``;n===`VVIP`?(i=`<span class="badge" style="background-color: var(--admin-text-primary); color: var(--gold-primary); border: 1px solid var(--gold-primary); font-weight: 600; letter-spacing: 0.05em;"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none" style="margin-right:4px; margin-bottom:1px"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>VVIP</span>`,a=`<svg class="animated-crown" style="animation-delay: ${t*.15}s" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`):n===`VIP`?(i=`<span class="badge" style="background-color: #fdf6e3; color: #b7791f; font-weight: 600;"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none" style="margin-right:2px; margin-bottom:1px"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>VIP</span>`,a=`<svg class="animated-crown" style="animation-delay: ${t*.15}s" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`):i=n===`Thân thiết`?`<span class="badge" style="background-color: #eff6ff; color: #2563eb;">Thân thiết</span>`:`<span class="badge" style="background-color: #f1f5f9; color: #64748b;">Mới</span>`;let c=document.createElement(`tr`);c.innerHTML=`
            <td style="padding-left: 1.5rem; font-family: monospace; font-weight: 600;">${e.id}</td>
            <td>
                <div class="customer-cell">
                    <img src="${r(e.name)}" alt="${e.name}" class="customer-avatar">
                    <span class="customer-name customer-name-link" style="white-space: nowrap; position: relative;" onclick="openCustomerPanel('${e.id}')">
                        ${e.name}
                        ${a}
                    </span>
                </div>
            </td>
            <td>
                <div style="display: flex; flex-direction: column; gap: 0.15rem;">
                    <span style="font-weight: 500;">${e.phone}</span>
                    <span style="font-size: 0.8125rem; color: var(--admin-text-secondary);">${e.email}</span>
                </div>
            </td>
            <td><span style="font-weight: 600; font-size: 1.1em;">${e.orders}</span> đơn</td>
            <td class="text-gold" style="font-weight: 600;">${o(e.spent)}</td>
            <td>${i}</td>
            <td style="padding-right: 1.5rem; text-align: right;">
                <button class="btn-text" style="color: var(--gold-primary);" title="Chi tiết Khách hàng" onclick="openCustomerPanel('${e.id}')">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </button>
            </td>
        `,d.appendChild(c)})}function p(){let e=document.getElementById(`crmCustomersChart`);e&&new Chart(e,{type:`bar`,data:{labels:[`Tháng 10`,`Tháng 11`,`Tháng 12`,`Tháng 1`,`Tháng 2`,`Tháng 3`],datasets:[{label:`Khách Hàng Mới`,data:[45,60,110,85,130,160],backgroundColor:`rgba(212, 175, 55, 0.8)`,borderRadius:4,hoverBackgroundColor:`#b7791f`}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},tooltip:{backgroundColor:`#1a1a1a`,titleFont:{family:`Inter`,size:13},bodyFont:{family:`Inter`,size:13},padding:10,displayColors:!1}},scales:{y:{beginAtZero:!0,grid:{color:`#f1f5f9`,drawBorder:!1},ticks:{font:{family:`Inter`},color:`#64748b`,stepSize:50}},x:{grid:{display:!1,drawBorder:!1},ticks:{font:{family:`Inter`},color:`#64748b`}}}}})}async function m(){try{d.innerHTML=`<tr><td colspan="7" class="text-center" style="padding: 2rem;">Đang tải dữ liệu khách hàng từ máy chủ...</td></tr>`;let[n,r]=await Promise.all([a(i(t,`users`)),a(i(t,`orders`))]),o={};n.forEach(e=>{let t=e.data();o[e.id]={id:t.username?t.username.toUpperCase():e.id.substring(0,6).toUpperCase(),uid:e.id,name:t.fullName||t.username||`Thành Viên Ẩn Danh`,email:t.email||`N/A`,phone:t.phone||`N/A`,orders:0,spent:0,history:[]}}),r.forEach(e=>{let t=e.data(),n=t.uid;n&&o[n]&&(o[n].orders+=1,o[n].spent+=t.billing?t.billing.total:0,t.items&&Array.isArray(t.items)&&t.items.forEach(e=>{let r=`Unknown`;t.createdAt&&(r=t.createdAt.toDate().toLocaleDateString(`vi-VN`));let i=`Mixed`;e.name.includes(`Rose`)||e.name.includes(`Iris`)?i=`Floral`:e.name.includes(`Oud`)||e.name.includes(`Santal`)?i=`Woody`:e.name.includes(`Citrus`)&&(i=`Citrus`),o[n].history.push({date:r,item:e.name,price:e.price*e.quantity,family:i})}))}),e=Object.values(o),f(e),p()}catch(e){console.error(`Lỗi lấy dữ liệu Khách hàng:`,e),d.innerHTML=`<tr><td colspan="7" class="text-center text-danger" style="padding: 2rem;">Lỗi lấy dữ liệu. Vui lòng F5.</td></tr>`}}document.addEventListener(`DOMContentLoaded`,()=>{m()}),document.getElementById(`search-customer`).addEventListener(`input`,t=>{let n=t.target.value.toLowerCase();f(e.filter(e=>e.name.toLowerCase().includes(n)||e.email.toLowerCase().includes(n)||e.phone.includes(n)))})}))(),r();