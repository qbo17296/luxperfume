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
                
                // Cập nhật giao diện Nút Đăng xuất
                const authSection = document.getElementById('auth-section');
                if (authSection && !document.getElementById('logoutBtn')) {
                    const logoutBtn = document.createElement('a');
                    logoutBtn.id = 'logoutBtn';
                    logoutBtn.href = '#';
                    logoutBtn.innerText = 'Đăng xuất';
                    logoutBtn.style.color = '#ef4444';
                    logoutBtn.style.fontSize = '0.875rem';
                    logoutBtn.style.marginLeft = '1rem';
                    logoutBtn.style.fontWeight = '500';
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
