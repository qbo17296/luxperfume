// interactions.js - Micro-interactions (Phase 4)

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Magnetic Buttons
    // Make primary buttons slightly move towards cursor
    const mBtns = document.querySelectorAll('.btn-primary, .magnetic');
    mBtns.forEach(btn => {
        // We set transition via JS to override inline cleanly
        btn.style.transition = 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.3s';
        
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            // strength ratio
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.3s';
            btn.style.transform = `translate(0px, 0px)`;
            setTimeout(() => {
                btn.style.transition = 'transform 0.1s linear, background-color 0.3s';
            }, 500);
        });
    });

    // 2. 3D Hover Tilt on Product Cards
    const cards = document.querySelectorAll('.product-card, .main-image-wrapper');
    cards.forEach(card => {
        card.style.transformStyle = 'preserve-3d';
        
        card.addEventListener('mousemove', (e) => {
            card.style.transition = 'none'; // remove transition for snappy follow
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Limits tilt to 8 degrees
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            
            // Add subtle glow
            card.style.boxShadow = `${-rotateY * 2}px ${rotateX * 2}px 20px rgba(212, 175, 55, 0.1)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.6s';
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.boxShadow = 'none';
        });
    });

    // 3. Text Reveal Animation for Titles
    // We only apply this to h1 and h2 .section-title that are not yet revealed
    const revealTitles = document.querySelectorAll('.section-title');
    
    // Inject keyframes if not exists
    if(!document.getElementById('reveal-keyframes')) {
        const style = document.createElement('style');
        style.id = 'reveal-keyframes';
        style.innerHTML = `
        @keyframes charReveal {
            0% { transform: translateY(100%); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
        }
        .reveal-word { display: inline-block; overflow: hidden; vertical-align: bottom; }
        .reveal-char { display: inline-block; transform: translateY(100%); opacity: 0; animation: charReveal 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        `;
        document.head.appendChild(style);
    }

    revealTitles.forEach(title => {
        const words = title.innerText.trim().split(/\s+/);
        let charDelay = 0;
        const newHtml = words.map(word => {
            const chars = word.split('').map(char => {
                charDelay += 0.03; // stagger each char
                return `<span class="reveal-char" style="animation-delay: ${charDelay}s">${char}</span>`;
            }).join('');
            return `<span class="reveal-word">${chars}</span>`;
        }).join('&nbsp;');
        
        title.innerHTML = newHtml;
        title.style.opacity = 1; // Ensure visible container
    });

});
