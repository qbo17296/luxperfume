import { app } from './firebase-config.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js';

const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const userProfile = document.getElementById('userProfile');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            if (loginBtn) loginBtn.style.display = 'none';
            if (userProfile) {
                userProfile.style.display = 'flex';
                
                // Thay đổi Tên Khách VIP thành Tên User thật
                const nameSpan = userProfile.querySelector('.hide-on-mobile');
                if(nameSpan) {
                    const displayIdentity = user.displayName || user.email.split('@')[0];
                    nameSpan.innerHTML = `Xin chào, <span style="font-weight: 600; color: #d4af37;">${displayIdentity}</span>`;
                }

                // Cập nhật giao diện Nút Đăng xuất (Chuyên nghiệp hơn)
                const authSection = document.getElementById('auth-section');
                if (authSection && !document.getElementById('logoutBtn')) {
                    const logoutBtn = document.createElement('button');
                    logoutBtn.id = 'logoutBtn';
                    logoutBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 5px; margin-bottom: -2px;"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>Đăng Xuất';
                    
                    // Style Button Chuyên nghiệp
                    logoutBtn.style.backgroundColor = '#fff';
                    logoutBtn.style.color = '#ef4444';
                    logoutBtn.style.border = '1px solid #fee2e2';
                    logoutBtn.style.padding = '6px 14px';
                    logoutBtn.style.borderRadius = '20px';
                    logoutBtn.style.fontSize = '0.75rem';
                    logoutBtn.style.marginLeft = '1.2rem';
                    logoutBtn.style.fontWeight = '600';
                    logoutBtn.style.cursor = 'pointer';
                    logoutBtn.style.display = 'inline-flex';
                    logoutBtn.style.alignItems = 'center';
                    logoutBtn.style.transition = 'all 0.2s';
                    logoutBtn.style.boxShadow = '0 2px 4px rgba(239, 68, 68, 0.05)';
                    
                    // Hiệu ứng Hover
                    logoutBtn.addEventListener('mouseenter', () => {
                        logoutBtn.style.backgroundColor = '#fef2f2';
                        logoutBtn.style.borderColor = '#ef4444';
                    });
                    logoutBtn.addEventListener('mouseleave', () => {
                        logoutBtn.style.backgroundColor = '#fff';
                        logoutBtn.style.borderColor = '#fee2e2';
                    });
                    logoutBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        signOut(auth).then(() => {
                            localStorage.removeItem('isLoggedIn');
                            window.location.reload();
                        });
                    });
                    authSection.appendChild(logoutBtn);
                }
            }
        } else {
            // User is signed out
            if (loginBtn) loginBtn.style.display = 'inline-block';
            if (userProfile) userProfile.style.display = 'none';
            
            const logoutBtn = document.getElementById('logoutBtn');
            if(logoutBtn) logoutBtn.remove();
        }
    });
});
