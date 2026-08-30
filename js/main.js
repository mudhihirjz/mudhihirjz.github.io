// ============================================
// DE TRAVELS - Main JavaScript
// ============================================

// ---------- DARK MODE ----------
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icon
    const icon = document.querySelector('.theme-toggle i');
    if (icon) {
        icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const icon = document.querySelector('.theme-toggle i');
    if (icon) {
        icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// ---------- MOBILE MENU ----------
function toggleMenu() {
    const links = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger');
    if (links) {
        links.classList.toggle('open');
    }
    if (hamburger) {
        hamburger.classList.toggle('active');
    }
}

// ---------- SLIDER ----------
class Slider {
    constructor(container) {
        this.container = container;
        this.wrapper = container.querySelector('.slider-wrapper');
        this.slides = container.querySelectorAll('.slide');
        this.dots = container.querySelectorAll('.slider-dot');
        this.prevBtn = container.querySelector('.slider-arrow.prev');
        this.nextBtn = container.querySelector('.slider-arrow.next');
        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000;
        
        this.init();
    }
    
    init() {
        this.goTo(0);
        this.startAutoPlay();
        
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.prev();
                this.resetAutoPlay();
            });
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.next();
                this.resetAutoPlay();
            });
        }
        
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goTo(index);
                this.resetAutoPlay();
            });
        });
        
        // Pause on hover
        this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.container.addEventListener('mouseleave', () => this.startAutoPlay());
    }
    
    goTo(index) {
        if (index < 0) index = this.totalSlides - 1;
        if (index >= this.totalSlides) index = 0;
        this.currentIndex = index;
        this.wrapper.style.transform = `translateX(-${index * 100}%)`;
        
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
    
    next() {
        this.goTo(this.currentIndex + 1);
    }
    
    prev() {
        this.goTo(this.currentIndex - 1);
    }
    
    startAutoPlay() {
        if (this.autoPlayInterval) return;
        this.autoPlayInterval = setInterval(() => this.next(), this.autoPlayDelay);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
}

// ---------- STATS COUNTER ----------
function animateCounters() {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count') || stat.textContent.replace(/[^0-9]/g, ''));
        if (!target) return;
        
        const duration = 2000;
        const startTime = performance.now();
        const startValue = 0;
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            stat.textContent = current + (stat.textContent.includes('+') ? '+' : '');
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target + (stat.textContent.includes('+') ? '+' : '');
            }
        }
        requestAnimationFrame(updateCounter);
    });
}

// ---------- INTERSECTION OBSERVER ----------
function setupIntersectionObserver() {
    const elements = document.querySelectorAll('.fade-in, .stat-card, .feature-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.classList.contains('stat-card')) {
                    animateCounters();
                }
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => observer.observe(el));
}

// ---------- FORM HELPERS ----------
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    return /^(\+255|0)[0-9]{9}$/.test(phone);
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 16px 24px;
        border-radius: 12px;
        background: ${type === 'success' ? '#2ECC71' : type === 'error' ? '#E74C3C' : '#3498DB'};
        color: white;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 12px;
        animation: slideUp 0.4s ease;
        max-width: 400px;
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideDown 0.4s ease forwards';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// ---------- LOCAL STORAGE HELPERS ----------
function getBookings() {
    return JSON.parse(localStorage.getItem('de_travels_bookings') || '[]');
}

function saveBooking(booking) {
    const bookings = getBookings();
    bookings.push(booking);
    localStorage.setItem('de_travels_bookings', JSON.stringify(bookings));
}

function generateBookingId() {
    return 'DE' + Date.now().toString().slice(-8) + Math.random().toString(36).substring(2, 6).toUpperCase();
}

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', function() {
    // Load theme
    loadTheme();
    
    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Mobile menu
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
    }
    
    // Initialize slider
    const slider = document.querySelector('.hero-slider');
    if (slider) {
        new Slider(slider);
    }
    
    // Intersection observer for animations
    setupIntersectionObserver();
    
    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            const links = document.querySelector('.nav-links');
            const hamburger = document.querySelector('.hamburger');
            if (links) links.classList.remove('open');
            if (hamburger) hamburger.classList.remove('active');
        });
    });
    
    // Add slideUp animation styles if not exists
    if (!document.querySelector('#toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            @keyframes slideUp {
                from { opacity: 0; transform: translateY(30px) scale(0.95); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
            @keyframes slideDown {
                from { opacity: 1; transform: translateY(0) scale(1); }
                to { opacity: 0; transform: translateY(30px) scale(0.95); }
            }
            .visible {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            .stat-card, .feature-card {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .stat-card.visible, .feature-card.visible {
                opacity: 1;
                transform: translateY(0);
            }
            .stat-card:nth-child(2) { transition-delay: 0.1s; }
            .stat-card:nth-child(3) { transition-delay: 0.2s; }
            .stat-card:nth-child(4) { transition-delay: 0.3s; }
        `;
        document.head.appendChild(style);
    }
});

// ---------- EXPOSE FOR OTHER PAGES ----------
window.DETravels = {
    toggleTheme,
    loadTheme,
    toggleMenu,
    validateEmail,
    validatePhone,
    showToast,
    getBookings,
    saveBooking,
    generateBookingId,
    Slider
};