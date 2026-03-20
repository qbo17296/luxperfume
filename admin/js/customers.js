// Dữ liệu Khách hàng giả lập (Có thêm lịch sử mua hàng)
const customersData = [
    { 
        id: 'KH001', name: 'Nguyễn Văn Quang', email: 'quangnv_luxury@gmail.com', phone: '0901 234 567', orders: 24, spent: 34500000,
        history: [
            { date: '15/03/2026', item: 'Oud Éternel', price: 6200000, family: 'Woody' },
            { date: '01/02/2026', item: 'Midnight Citrus', price: 3800000, family: 'Citrus' },
            { date: '10/12/2025', item: 'Amber Glow', price: 4100000, family: 'Oriental' },
            { date: '05/11/2025', item: 'Oud Éternel', price: 6200000, family: 'Woody' },
            { date: '20/09/2025', item: 'Santál Royal', price: 5500000, family: 'Woody' }
        ]
    },
    { 
        id: 'KH002', name: 'Đặng Mai Phương', email: 'maiphuong.dang@yahoo.com', phone: '0987 654 321', orders: 9, spent: 16400000,
        history: [
            { date: '20/03/2026', item: 'Rose Mystique', price: 4500000, family: 'Floral' },
            { date: '14/01/2026', item: 'Velvet Iris', price: 5900000, family: 'Floral' },
            { date: '02/11/2025', item: 'Jasmine Noir', price: 6000000, family: 'Floral' }
        ]
    },
    { 
        id: 'KH003', name: 'Lê Hoàng Tâm', email: 'tamle99@hotmail.com', phone: '0933 445 566', orders: 4, spent: 6500000,
        history: [
            { date: '10/02/2026', item: 'Rose Mystique', price: 4500000, family: 'Floral' },
            { date: '01/12/2025', item: 'Discovery Set', price: 2000000, family: 'Mixed' }
        ]
    },
    { id: 'KH004', name: 'Trần Cẩm Nhung', email: 'nhungtran.beauty@gmail.com', phone: '0912 345 678', orders: 0, spent: 0, history: [] },
    { 
        id: 'KH005', name: 'Vương Vĩnh Phát', email: 'phatvv_ceo@gmail.com', phone: '0909 999 888', orders: 50, spent: 85000000,
        history: [
            { date: '19/03/2026', item: 'Oud Éternel', price: 6200000, family: 'Woody' },
            { date: '10/03/2026', item: 'Rose Mystique', price: 4500000, family: 'Floral' },
            { date: '01/03/2026', item: 'Velvet Iris', price: 5900000, family: 'Floral' },
            { date: '15/02/2026', item: 'Amber Glow', price: 4100000, family: 'Oriental' }
        ]
    }
];

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

function openCustomerPanel(customerId) {
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

function closeCustomerPanel() {
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
function generateTributeVideo() {
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

function copyTributeScript() {
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

// Build list on load
document.addEventListener('DOMContentLoaded', () => {
    renderCustomersTable(customersData);
    renderCustomerChart();
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
