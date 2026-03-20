import { db } from '../../assets/js/firebase-config.js';
import { collection, getDocs, Timestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Format money
const formatMoney = (amount) => new Intl.NumberFormat('vi-VN').format(amount) + '₫';

async function loadDashboardData() {
    try {
        const [ordersSnap, usersSnap] = await Promise.all([
            getDocs(collection(db, "orders")),
            getDocs(collection(db, "users"))
        ]);

        let todayRevenue = 0;
        let todayOrders = 0;
        let totalCustomers = 0;

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // Mảng chứa doanh thu 12 tháng
        const monthlyRevenue = { 0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0 };

        ordersSnap.forEach(doc => {
            const data = doc.data();
            let d = new Date(); // default now if no date
            if(data.createdAt) {
                d = data.createdAt.toDate();
            }

            // Ngày hiện tại
            if(d >= startOfToday) {
                todayOrders++;
                todayRevenue += (data.billing ? data.billing.total : 0);
            }

            // Ghi nhận vào tháng
            monthlyRevenue[d.getMonth()] += (data.billing ? data.billing.total : 0);
        });

        usersSnap.forEach(doc => {
            totalCustomers++;
        });

        // 1. Cập nhật HTML UI Stats
        const statValues = document.querySelectorAll('.stats-grid .stat-value');
        if(statValues.length >= 3) {
            statValues[0].innerText = formatMoney(todayRevenue);
            statValues[1].innerText = todayOrders;
            statValues[2].innerText = totalCustomers;
        }

        // 2. Cập nhật Chart (Doanh Thu) - 6 Tháng gần nhất
        if(window.revenueChart) {
            const currentMonth = now.getMonth();
            const labels = [];
            const dataValues = [];
            for(let i = 5; i >= 0; i--) {
                let m = currentMonth - i;
                if (m < 0) m += 12; // Vòng lại năm ngoái
                labels.push('Tháng ' + (m + 1));
                dataValues.push(monthlyRevenue[m]);
            }

            window.revenueChart.data.labels = labels;
            window.revenueChart.data.datasets[0].data = dataValues;
            window.revenueChart.update();
        }

    } catch(err) {
        console.error("Lỗi cập nhật dashboard:", err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Gọi hàm fetch khi DOM load xong
    loadDashboardData();
});
