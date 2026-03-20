// main.js - Xử lý logic chung và micro-animations
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SCROLL OFFSETS (Navbar glassmorphism effect)
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. INTERSECTION OBSERVER (Fade-up on scroll)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Kích hoạt khi hi�!n khoảng 15% di�!n tích element
    };

    const fadeInElements = document.querySelectorAll('.fade-up');
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Nếu không mu�n lặp lại animation thì unobserve
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeInElements.forEach(el => observer.observe(el));
    
});
