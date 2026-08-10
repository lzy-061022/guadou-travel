// ============================================
// Gua Dou Travel - Main JavaScript
// ============================================

// Current language
let currentLang = localStorage.getItem('guadou_lang') || 'zh';

// ============================================
// Internationalization
// ============================================
function applyTranslations(lang) {
    currentLang = lang;
    localStorage.setItem('guadou_lang', lang);
    document.documentElement.lang = lang;

    const t = translations[lang];
    if (!t) return;

    // Translate all data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            el.textContent = t[key];
        }
    });

    // Translate placeholders
    const placeholderMap = {
        name_placeholder: ['contactName'],
        phone_placeholder: ['contactPhone'],
        email_placeholder: ['contactEmail'],
        message_placeholder: ['contactMessage'],
    };

    Object.entries(placeholderMap).forEach(([key, ids]) => {
        if (t[key]) {
            ids.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.placeholder = t[key];
            });
        }
    });

    // Update select options
    const subjectSelect = document.getElementById('contactSubject');
    if (subjectSelect) {
        subjectSelect.options[0].textContent = t.subject_default || 'Select';
        subjectSelect.options[1].textContent = t.subject_package || '';
        subjectSelect.options[2].textContent = t.subject_visa || '';
        subjectSelect.options[3].textContent = t.subject_custom || '';
        subjectSelect.options[4].textContent = t.subject_other || '';
    }

    // Update lang buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
}

// ============================================
// Toast Notification
// ============================================
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ============================================
// Navigation
// ============================================
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

// Scroll effect
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 50;
    navbar.classList.toggle('scrolled', scrolled);

    // Back to top
    const backToTop = document.getElementById('backToTop');
    backToTop.classList.toggle('visible', window.scrollY > 400);
});

// Mobile menu toggle
mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Back to top
document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================
// Language Switcher
// ============================================
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        applyTranslations(btn.dataset.lang);
    });
});

// ============================================
// Modal Controls
// ============================================
const registerModal = document.getElementById('registerModal');
const loginModal = document.getElementById('loginModal');
const btnRegister = document.getElementById('btnRegister');
const btnLogin = document.getElementById('btnLogin');
const registerClose = document.getElementById('registerClose');
const loginClose = document.getElementById('loginClose');
const switchToLogin = document.getElementById('switchToLogin');
const switchToRegister = document.getElementById('switchToRegister');

function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

btnRegister.addEventListener('click', () => openModal(registerModal));
btnLogin.addEventListener('click', () => openModal(loginModal));

// Mobile auth buttons
const btnRegisterMobile = document.getElementById('btnRegisterMobile');
const btnLoginMobile = document.getElementById('btnLoginMobile');
if (btnRegisterMobile) btnRegisterMobile.addEventListener('click', () => { navLinks.classList.remove('active'); openModal(registerModal); });
if (btnLoginMobile) btnLoginMobile.addEventListener('click', () => { navLinks.classList.remove('active'); openModal(loginModal); });

registerClose.addEventListener('click', () => closeModal(registerModal));
loginClose.addEventListener('click', () => closeModal(loginModal));

switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(registerModal);
    setTimeout(() => openModal(loginModal), 200);
});

switchToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(loginModal);
    setTimeout(() => openModal(registerModal), 200);
});

// Close modal on overlay click
[registerModal, loginModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
    });
});

// Close modal on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal(registerModal);
        closeModal(loginModal);
    }
});

// ============================================
// Send Verification Code
// ============================================
const btnSendCode = document.getElementById('btnSendCode');
let codeCountdown = 0;

btnSendCode.addEventListener('click', () => {
    const phone = document.getElementById('regPhone').value;
    if (!phone) {
        const t = translations[currentLang];
        alert(t.phone_label ? `${t.phone_label}!` : 'Please enter phone number');
        return;
    }

    // Simulate sending code
    codeCountdown = 60;
    btnSendCode.disabled = true;
    const t = translations[currentLang];
    const originalText = t.send_code || 'Send Code';
    const resendText = t.code_resend || 'Resend';

    const timer = setInterval(() => {
        codeCountdown--;
        btnSendCode.textContent = `${resendText} (${codeCountdown}s)`;
        if (codeCountdown <= 0) {
            clearInterval(timer);
            btnSendCode.disabled = false;
            btnSendCode.textContent = originalText;
        }
    }, 1000);

    showToast(t.code_sent || 'Code sent', 'info');
});

// ============================================
// Registration Form
// ============================================
document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const t = translations[currentLang];
    const country = document.getElementById('phoneCountry').value;
    const phone = document.getElementById('regPhone').value.trim();
    const name = document.getElementById('regName').value.trim();
    const password = document.getElementById('regPassword').value;

    if (!phone || !name || !password) return;

    const fullPhone = country + phone;

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('guadou_users') || '[]');
    if (users.find(u => u.phone === fullPhone)) {
        showToast(t.phone_label ? t.phone_label + ' ' + (t.has_account || '') : 'Phone already registered');
        return;
    }

    // Save user
    users.push({ phone: fullPhone, name, password });
    localStorage.setItem('guadou_users', JSON.stringify(users));

    // Auto-login
    localStorage.setItem('guadou_current_user', JSON.stringify({ phone: fullPhone, name }));
    showToast(t.register_success || 'Registration successful!');
    closeModal(registerModal);
    updateAuthUI();
});

// ============================================
// Login Form
// ============================================
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const t = translations[currentLang];
    const country = document.getElementById('loginCountry').value;
    const phone = document.getElementById('loginPhone').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!phone || !password) return;

    const fullPhone = country + phone;

    // Find user
    const users = JSON.parse(localStorage.getItem('guadou_users') || '[]');
    const user = users.find(u => u.phone === fullPhone && u.password === password);
    if (!user) {
        showToast(t.chat_resp_unknown ? 'Sai thông tin đăng nhập' : 'Invalid phone or password', 'info');
        return;
    }

    // Login
    localStorage.setItem('guadou_current_user', JSON.stringify({ phone: user.phone, name: user.name }));
    showToast(t.login_success || 'Login successful!');
    closeModal(loginModal);
    updateAuthUI();
});

// ============================================
// Auth UI Update
// ============================================
function updateAuthUI() {
    const currentUser = JSON.parse(localStorage.getItem('guadou_current_user') || 'null');
    if (currentUser) {
        btnRegister.textContent = currentUser.name;
        btnRegister.style.background = 'var(--secondary)';
        btnLogin.textContent = '✕';
        btnLogin.style.borderColor = 'var(--primary)';
        btnLogin.style.color = 'var(--primary)';
        btnLogin.onclick = () => {
            localStorage.removeItem('guadou_current_user');
            btnRegister.textContent = translations[currentLang].register || '注册';
            btnRegister.style.background = '';
            btnLogin.textContent = translations[currentLang].login || '登录';
            btnLogin.style.borderColor = '';
            btnLogin.style.color = '';
            btnLogin.onclick = null;
            showToast(translations[currentLang].code_sent || '已退出登录', 'info');
        };
    }
}

// ============================================
// Contact Form
// ============================================
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const t = translations[currentLang];
    showToast(t.consult_success || 'Inquiry submitted!');
    e.target.reset();
});

// ============================================
// Book Now Buttons
// ============================================
document.querySelectorAll('.btn-book').forEach(btn => {
    btn.addEventListener('click', () => {
        openModal(registerModal);
    });
});

// ============================================
// Smooth Scroll for anchor links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ============================================
// Scroll Animation (Intersection Observer)
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements
function initScrollAnimations() {
    const animateElements = document.querySelectorAll(
        '.stat-item, .dest-card, .package-card, .service-card, .testimonial-card, .about-feature, .contact-item, .itinerary-mini, .pricing-table'
    );
    animateElements.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${i % 4 * 0.1}s, transform 0.6s ease ${i % 4 * 0.1}s`;
        observer.observe(el);
    });
}

// ============================================
// Route Filter (Two-row: Region + Duration)
// ============================================
let activeRegion = 'all';
let activeDuration = 'all';

function initRouteFilter() {
    const regionTabs = document.querySelectorAll('.route-tab[data-type="region"]');
    const durationTabs = document.querySelectorAll('.route-tab[data-type="duration"]');
    const cards = document.querySelectorAll('.package-card[data-days]');

    regionTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            regionTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeRegion = tab.dataset.filter;
            // Reset duration when changing region
            durationTabs.forEach(t => t.classList.remove('active'));
            activeDuration = 'all';
            applyFilter(cards);
        });
    });

    durationTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            durationTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeDuration = tab.dataset.filter;
            applyFilter(cards);
        });
    });
}

function applyFilter(cards) {
    cards.forEach(card => {
        // Skip pricing card
        if (card.dataset.days === 'all') {
            card.style.display = '';
            return;
        }

        const regionMatch = activeRegion === 'all' || card.dataset.region === activeRegion;
        const durationMatch = activeDuration === 'all' || card.dataset.days === activeDuration;

        if (regionMatch && durationMatch) {
            card.style.display = '';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        } else {
            card.style.display = 'none';
        }
    });

    // Show/hide region headers based on filter
    const borderHeader = document.querySelector('[data-i18n="route_header_border"]');
    const yunnanHeader = document.querySelector('[data-i18n="route_header_yunnan"]');

    if (borderHeader) {
        const borderParent = borderHeader.parentElement;
        if (borderParent) {
            // Always show headers unless filtering to opposite region
            if (activeRegion === 'yunnan') {
                borderHeader.style.display = 'none';
                // Hide border cards too
                borderParent.querySelectorAll('.package-card[data-region="border"]').forEach(c => c.style.display = 'none');
            } else {
                borderHeader.style.display = '';
            }
        }
    }

    if (yunnanHeader) {
        if (activeRegion === 'border') {
            yunnanHeader.style.display = 'none';
        } else {
            yunnanHeader.style.display = '';
        }
    }
}

// ============================================
// Landmark Lightbox
// ============================================
let currentLandmarks = [];
let currentLandmarkIndex = 0;

function openLightbox(el) {
    const grid = el.closest('.landmarks-grid');
    if (!grid) return;
    const items = grid.querySelectorAll('.landmark-item');
    currentLandmarks = Array.from(items).map(item => {
        const img = item.querySelector('img');
        return {
            src: img.src,
            name: item.querySelector('.landmark-name') ? item.querySelector('.landmark-name').textContent : ''
        };
    });
    currentLandmarkIndex = Array.from(items).indexOf(el);
    showLightboxImage();
    document.getElementById('landmarkLightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function showLightboxImage() {
    const item = currentLandmarks[currentLandmarkIndex];
    const img = document.getElementById('lightboxImg');
    img.src = item.src;
    document.getElementById('lightboxName').textContent = item.name;
    // Update counter
    const counter = document.getElementById('lightboxCounter');
    if (counter) counter.textContent = `${currentLandmarkIndex + 1} / ${currentLandmarks.length}`;
}

document.getElementById('lightboxClose').addEventListener('click', () => {
    document.getElementById('landmarkLightbox').classList.remove('active');
    document.body.style.overflow = '';
});

document.getElementById('landmarkLightbox').addEventListener('click', (e) => {
    if (e.target === document.getElementById('landmarkLightbox')) {
        document.getElementById('landmarkLightbox').classList.remove('active');
        document.body.style.overflow = '';
    }
});

document.getElementById('lightboxPrev').addEventListener('click', () => {
    currentLandmarkIndex = (currentLandmarkIndex - 1 + currentLandmarks.length) % currentLandmarks.length;
    showLightboxImage();
});

document.getElementById('lightboxNext').addEventListener('click', () => {
    currentLandmarkIndex = (currentLandmarkIndex + 1) % currentLandmarks.length;
    showLightboxImage();
});

document.addEventListener('keydown', (e) => {
    if (!document.getElementById('landmarkLightbox').classList.contains('active')) return;
    if (e.key === 'Escape') {
        document.getElementById('landmarkLightbox').classList.remove('active');
        document.body.style.overflow = '';
    }
    if (e.key === 'ArrowLeft') {
        currentLandmarkIndex = (currentLandmarkIndex - 1 + currentLandmarks.length) % currentLandmarks.length;
        showLightboxImage();
    }
    if (e.key === 'ArrowRight') {
        currentLandmarkIndex = (currentLandmarkIndex + 1) % currentLandmarks.length;
        showLightboxImage();
    }
});

// Event delegation for landmark clicks (more reliable than inline onclick)
document.addEventListener('click', (e) => {
    const landmarkItem = e.target.closest('.landmark-item');
    if (landmarkItem) {
        openLightbox(landmarkItem);
    }
});

// ============================================
// Initialize
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    applyTranslations(currentLang);
    initScrollAnimations();
    initRouteFilter();
    updateAuthUI();
});
