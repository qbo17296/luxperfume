import { db } from '../../assets/js/firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Global data scope
let customersData = [];

// Hàm lấy Avatar
const getTierAvatar = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f4f6f8&color=d4af37&font-size=0.4&bold=true`;

// Hàm định dạng tiền
const formatCurrency = (amount) => amount === 0 ? '0₫' : new Intl.NumberFormat('vi-VN').format(amount) + '₫';

// Logic Phân hạng Tự động theo Spending
function computeTier(spentAmount) {
    if (spentAmount > 30000000) return 'VVIP';
    if (spentAmount > 15000000) return 'VIP';
    if (spentAmount > 5000000) return 'Thân thiết';
    return 'Mới';
}

// Bảng màu cho từng nhóm hương
const scentColors = {
    'Woody': '#854d0e',     // Gỗ - Nâu đậm
    'Floral': '#ec4899',    // Hoa cỏ - Hồng
    'Citrus': '#eab308',    // Cam chanh - Vàng
    'Oriental': '#d946ef',  // Phương Đông - Tím
    'Mixed': '#64748b'      // Hỗn hợp - Xám
};

const scentNames = {
    'Woody': 'Hương Gỗ (Woody)',
    'Floral': 'Hương Hoa Cỏ (Floral)',
    'Citrus': 'Hương Cam Chanh (Citrus)',
    'Oriental': 'Hương Phương Đông (Oriental)',
    'Mixed': 'Hỗn hợp (Mixed)'
};

// Panel Control Functions
let currentOpenedCustomerId = null;

window.openCustomerPanel = function(customerId) {
    const customer = customersData.find(c => c.id === customerId);
    if(!customer) return;

    currentOpenedCustomerId = customerId;
    document.getElementById('panel-customer-name').innerText = customer.name;
    document.getElementById('video-script-container').style.display = 'none';

    // 1. Phân tích Gu Hương (Scent Preferences)
    const scentBarsContainer = document.getElementById('scent-bars-container');
    scentBarsContainer.innerHTML = '';

    if (customer.history.length === 0) {
        scentBarsContainer.innerHTML = '<p class="text-secondary text-sm">Khách hàng chưa có lịch sử mua sắm để phân tích.</p>';
    } else {
        // Gom nhóm đếm số lượng mua theo Family
        const familyCounts = {};
        let totalItems = 0;
        customer.history.forEach(item => {
            familyCounts[item.family] = (familyCounts[item.family] || 0) + 1;
            totalItems++;
        });

        // Sắp xếp theo tỷ lệ giảm dần
        const sortedFamilies = Object.keys(familyCounts).sort((a, b) => familyCounts[b] - familyCounts[a]);

        sortedFamilies.forEach(family => {
            const percentage = Math.round((familyCounts[family] / totalItems) * 100);
            const color = scentColors[family] || '#d4af37';
            const label = scentNames[family] || family;

            const barHtml = `
                <div class="scent-bar-wrap">
                    <div class="scent-bar-header">
                        <span>${label}</span>
                        <span>${percentage}%</span>
                    </div>
                    <div class="progress-bg">
                        <div class="progress-fill" style="width: 0%; background: ${color};" data-width="${percentage}%"></div>
                    </div>
                </div>
            `;
            scentBarsContainer.innerHTML += barHtml;
        });
    }

    // 2. Lịch sử Mua hàng
    const historyList = document.getElementById('purchase-history-list');
    historyList.innerHTML = '';
    
    if (customer.history.length === 0) {
        historyList.innerHTML = '<p class="text-secondary text-sm">Chưa có giao dịch.</p>';
    } else {
        customer.history.forEach(item => {
            historyList.innerHTML += `
                <li class="history-item">
                    <div class="history-item-info">
                        <span class="history-name">${item.item}</span>
                        <span class="history-date">${item.date}</span>
                    </div>
                    <span class="text-gold" style="font-weight: 500;">${formatCurrency(item.price)}</span>
                </li>
            `;
        });
    }

    // Mở Panel
    document.getElementById('customer-panel-overlay').classList.add('show');
    document.getElementById('customer-panel').classList.add('show');

    // Kích hoạt Animation Progress Bar sau khi Panel mở 1 chút
    setTimeout(() => {
        document.querySelectorAll('.progress-fill').forEach(bar => {
            bar.style.width = bar.getAttribute('data-width');
        });
    }, 100);
}

window.closeCustomerPanel = function() {
    document.getElementById('customer-panel-overlay').classList.remove('show');
    document.getElementById('customer-panel').classList.remove('show');
    
    // Reset widths for next animation
    setTimeout(() => {
        document.querySelectorAll('.progress-fill').forEach(bar => {
            bar.style.width = '0%';
        });
    }, 300);
}

// Logic Tạo Kịch Bản Video Tri Ân
window.generateTributeVideo = function() {
    if(!currentOpenedCustomerId) return;
    const customer = customersData.find(c => c.id === currentOpenedCustomerId);
    
    // Tìm chai nước hoa mua nhiều nhất
    let favoritePerfume = 'những tuyệt tác mùi hương';
    if(customer.history && customer.history.length > 0) {
        const itemCounts = {};
        customer.history.forEach(item => {
            itemCounts[item.item] = (itemCounts[item.item] || 0) + 1;
        });
        const sortedItems = Object.keys(itemCounts).sort((a,b) => itemCounts[b] - itemCounts[a]);
        favoritePerfume = sortedItems[0];
    }
    
    const script = `Xin chào tất cả mọi người! 🎉
Hôm nay Lux Perfume làm video này để gửi lời cảm ơn chân thành nhất tới vị khách hàng vô cùng đáng quý của chúng ta: Anh/Chị ${customer.name}.

Chúng mình cực kỳ ấn tượng vì anh/chị đã nhiều lần tin tưởng và lựa chọn dòng sản phẩm ${favoritePerfume} tại Lux Perfume. Sự ủng hộ của những khách hàng tuyệt vời như anh/chị ${customer.name} chính là động lực lớn nhất để Lux Perfume tiếp tục mang về những mùi hương đẳng cấp thế giới!

-----------------
- theo dõi, thả tim, lưu video, bình luận,...
- Cảm ơn đã xem`;
    
    const container = document.getElementById('video-script-container');
    const textarea = document.getElementById('tribute-script-textarea');
    
    textarea.value = script;
    container.style.display = 'flex';
}

window.copyTributeScript = function() {
    const textarea = document.getElementById('tribute-script-textarea');
    textarea.select();
    navigator.clipboard.writeText(textarea.value).then(() => {
        alert('Đã copy kịch bản tri ân thành công!');
    }).catch(err => {
        console.error('Lỗi khi copy', err);
    });
}

// Hàm render bảng
const tbody = document.querySelector('#customers-table tbody');

function renderCustomersTable(data) {
    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center" style="padding: 2rem;">Không tìm thấy khách hàng nào</td></tr>';
        return;
    }

    data.forEach((c, i) => {
        // Tự động tính hạng dựa trên chi tiêu thực tế
        const computedTier = computeTier(c.spent);
        
        let tierBadgeHtml = '';
        let royalCrownHtml = '';

        if (computedTier === 'VVIP') {
            tierBadgeHtml = `<span class="badge" style="background-color: var(--admin-text-primary); color: var(--gold-primary); border: 1px solid var(--gold-primary); font-weight: 600; letter-spacing: 0.05em;"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none" style="margin-right:4px; margin-bottom:1px"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>VVIP</span>`;
            royalCrownHtml = `<svg class="animated-crown" style="animation-delay: ${i * 0.15}s" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
        } 
        else if (computedTier === 'VIP') {
            tierBadgeHtml = `<span class="badge" style="background-color: #fdf6e3; color: #b7791f; font-weight: 600;"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none" style="margin-right:2px; margin-bottom:1px"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>VIP</span>`;
            royalCrownHtml = `<svg class="animated-crown" style="animation-delay: ${i * 0.15}s" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
        } 
        else if (computedTier === 'Thân thiết') {
            tierBadgeHtml = `<span class="badge" style="background-color: #eff6ff; color: #2563eb;">Thân thiết</span>`;
        } 
        else {
            tierBadgeHtml = `<span class="badge" style="background-color: #f1f5f9; color: #64748b;">Mới</span>`;
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="padding-left: 1.5rem; font-family: monospace; font-weight: 600;">${c.id}</td>
            <td>
                <div class="customer-cell">
                    <img src="${getTierAvatar(c.name)}" alt="${c.name}" class="customer-avatar">
                    <span class="customer-name customer-name-link" style="white-space: nowrap; position: relative;" onclick="openCustomerPanel('${c.id}')">
                        ${c.name}
                        ${royalCrownHtml}
                    </span>
                </div>
            </td>
            <td>
                <div style="display: flex; flex-direction: column; gap: 0.15rem;">
                    <span style="font-weight: 500;">${c.phone}</span>
                    <span style="font-size: 0.8125rem; color: var(--admin-text-secondary);">${c.email}</span>
                </div>
            </td>
            <td><span style="font-weight: 600; font-size: 1.1em;">${c.orders}</span> đơn</td>
            <td class="text-gold" style="font-weight: 600;">${formatCurrency(c.spent)}</td>
            <td>${tierBadgeHtml}</td>
            <td style="padding-right: 1.5rem; text-align: right;">
                <button class="btn-text" style="color: var(--gold-primary);" title="Chi tiết Khách hàng" onclick="openCustomerPanel('${c.id}')">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Render Chart.js Analytics (Khách hàng mới 6 tháng qua)
function renderCustomerChart() {
    const ctx = document.getElementById('crmCustomersChart');
    if (!ctx) return;

    // Fake data cho 6 tháng
    const labels = ['Tháng 10', 'Tháng 11', 'Tháng 12', 'Tháng 1', 'Tháng 2', 'Tháng 3'];
    const dataPoints = [45, 60, 110, 85, 130, 160];

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Khách Hàng Mới',
                data: dataPoints,
                backgroundColor: 'rgba(212, 175, 55, 0.8)', // Gold color
                borderRadius: 4,
                hoverBackgroundColor: '#b7791f'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1a1a1a',
                    titleFont: { family: 'Inter', size: 13 },
                    bodyFont: { family: 'Inter', size: 13 },
                    padding: 10,
                    displayColors: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#f1f5f9', drawBorder: false },
                    ticks: { font: { family: 'Inter' }, color: '#64748b', stepSize: 50 }
                },
                x: {
                    grid: { display: false, drawBorder: false },
                    ticks: { font: { family: 'Inter' }, color: '#64748b' }
                }
            }
        }
    });
}

// Lấy dữ liệu thật từ Firestore thay vì load mảng giả
async function loadCustomersAndOrders() {
    try {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center" style="padding: 2rem;">Đang tải dữ liệu khách hàng từ máy chủ...</td></tr>';
        
        // Load đồng thời Users và Orders
        const [usersSnap, ordersSnap] = await Promise.all([
            getDocs(collection(db, "users")),
            getDocs(collection(db, "orders"))
        ]);

        const allUsers = {};
        
        // Ánh xạ Users
        usersSnap.forEach(doc => {
            const data = doc.data();
            allUsers[doc.id] = {
                id: data.username ? data.username.toUpperCase() : doc.id.substring(0,6).toUpperCase(),
                uid: doc.id,
                name: data.fullName || data.username || 'Thành Viên Ẩn Danh',
                email: data.email || 'N/A',
                phone: data.phone || 'N/A',
                orders: 0,
                spent: 0,
                history: []
            };
        });

        // Loop orders data để cộng dồn cho User tương ứng
        ordersSnap.forEach(doc => {
            const data = doc.data();
            const uid = data.uid;
            
            // Note: Guest orders without an ID or an unmapped ID won't appear under users
            if(uid && allUsers[uid]) {
                allUsers[uid].orders += 1;
                allUsers[uid].spent += (data.billing ? data.billing.total : 0);
                
                if(data.items && Array.isArray(data.items)) {
                    data.items.forEach(item => {
                        let dateStr = 'Unknown';
                        if(data.createdAt) {
                            dateStr = data.createdAt.toDate().toLocaleDateString('vi-VN');
                        }
                        
                        // Fake một nhóm họ hương (vì data sản phẩm trong giỏ lúc đó ko lưu nhánh mồi)
                        // Trong hệ thống thật, family được pull từ Product docs.
                        let simulatedFamily = 'Mixed';
                        if(item.name.includes('Rose') || item.name.includes('Iris')) simulatedFamily = 'Floral';
                        else if(item.name.includes('Oud') || item.name.includes('Santal')) simulatedFamily = 'Woody';
                        else if(item.name.includes('Citrus')) simulatedFamily = 'Citrus';

                        allUsers[uid].history.push({
                            date: dateStr,
                            item: item.name,
                            price: item.price * item.quantity,
                            family: simulatedFamily
                        });
                    });
                }
            }
        });

        customersData = Object.values(allUsers);
        
        renderCustomersTable(customersData);
        renderCustomerChart(); 
    } catch (err) {
        console.error("Lỗi lấy dữ liệu Khách hàng:", err);
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-danger" style="padding: 2rem;">Lỗi lấy dữ liệu. Vui lòng F5.</td></tr>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Gọi hàm fetch dữ liệu thực
    loadCustomersAndOrders();
});

// Search integration
document.getElementById('search-customer').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = customersData.filter(c => 
        c.name.toLowerCase().includes(term) || 
        c.email.toLowerCase().includes(term) ||
        c.phone.includes(term)
    );
    renderCustomersTable(filtered);
});
