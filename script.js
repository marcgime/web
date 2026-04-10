// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {

    /* --- HEADER SCROLL EFFECT --- */
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* --- MOBILE MANU TOGGLE --- */
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            // Prevent scrolling when menu is open
            if (navLinks.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = 'auto';
            }
        });
    }

    // Close mobile menu when a link is clicked
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('active');
                body.style.overflow = 'auto';
            }
        });
    });



    /* --- SCROLL REVEAL ANIMATIONS USING INTERSECTION OBSERVER --- */
    const revealElements = document.querySelectorAll('.fade-in-up, .reveal-up, .reveal-left, .reveal-right');

    // Initial triggers for elements already in viewport (hero section)
    setTimeout(() => {
        document.querySelectorAll('.hero .fade-in-up').forEach(el => {
            el.classList.add('active');
        });
    }, 100);

    const revealOptions = {
        threshold: 0.15, // Trigger when 15% of element is visible
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before it comes fully into view
    };

    const revealOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        // Skip hero elements as they animate on load
        if (!el.closest('.hero')) {
            revealOnScroll.observe(el);
        }
    });

    /* --- SMOOTH SCROLLING FOR INTERNAL LINKS --- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust for sticky header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* --- SKILL HINT --- */
    const skillCards = document.querySelectorAll('.skill-flip-card');
    const skillHint = document.getElementById('skill-hint');
    if (skillHint && skillCards.length > 0) {
        const removeHint = () => {
            skillHint.style.opacity = '0';
            setTimeout(() => { if (skillHint.parentElement) skillHint.remove(); }, 300);
            skillCards.forEach(card => {
                card.removeEventListener('mouseenter', removeHint);
                card.removeEventListener('touchstart', removeHint);
            });
        };
        skillCards.forEach(card => {
            card.addEventListener('mouseenter', removeHint);
            card.addEventListener('touchstart', removeHint);
        });
    }

    /* --- SKILL FLIP TAP (MOBILE) --- */
    // En móvil no hay hover: un tap activa la clase .flipped, otro la quita
    if (skillCards.length > 0) {
        skillCards.forEach(card => {
            card.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    card.classList.toggle('flipped');
                }
            });
        });
    }

    // Actualizar texto del hint en móvil
    if (skillHint && window.innerWidth <= 768) {
        skillHint.setAttribute('data-es', 'Toca cada tarjeta para explorar');
        skillHint.setAttribute('data-en', 'Tap each card to explore');
        skillHint.textContent = 'Toca cada tarjeta para explorar';
    }

    /* --- LANGUAGE TOGGLE --- */
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        let currentLang = 'es';
        const translatableElements = document.querySelectorAll('[data-en][data-es]');

        langToggle.addEventListener('click', () => {
            currentLang = currentLang === 'es' ? 'en' : 'es';

            // update toggle buttons active class
            if (currentLang === 'es') {
                langToggle.querySelector('.lang-es').classList.add('active');
                langToggle.querySelector('.lang-en').classList.remove('active');
            } else {
                langToggle.querySelector('.lang-en').classList.add('active');
                langToggle.querySelector('.lang-es').classList.remove('active');
            }

            // update all translatable elements
            translatableElements.forEach(el => {
                el.innerHTML = currentLang === 'es' ? el.getAttribute('data-es') : el.getAttribute('data-en');
            });

            // update html lang attribute
            document.documentElement.lang = currentLang;
        });
    }

    /* --- SPOTLIGHT EFFECT --- */
    document.addEventListener('mousemove', (e) => {
        document.documentElement.style.setProperty('--x', e.clientX + 'px');
        document.documentElement.style.setProperty('--y', e.clientY + 'px');

        if (e.target) {
            const isDark = e.target.closest('.section-dark, header, .gradient-bg');
            document.documentElement.style.setProperty('--spotlight-opacity', isDark ? '1' : '0');
        }
    });

    /* --- HERO VIDEO ENDED TRANSITION --- */
    const heroVideo = document.getElementById('hero-video');
    const heroFinalImage = document.getElementById('hero-final-image');
    
    if (heroVideo && heroFinalImage) {
        heroVideo.addEventListener('ended', () => {
            heroFinalImage.classList.add('visible');
        });
    }
    /* --- TIMELINE TAP TO EXPAND (MOBILE) --- */
    // En móvil no hay hover: se inyecta un botón "Ver logros" que hace toggle
    if (window.innerWidth <= 768) {
        document.querySelectorAll('.timeline-item').forEach(item => {
            const content = item.querySelector('.timeline-content');
            if (!item.querySelector('.achievements') || !content) return;

            const btn = document.createElement('button');
            btn.className = 'timeline-expand-btn';
            btn.setAttribute('aria-expanded', 'false');
            btn.innerHTML = '<span class="expand-label">Ver logros</span> <span class="expand-icon">▾</span>';
            content.appendChild(btn);

            btn.addEventListener('click', () => {
                const isExpanded = item.classList.toggle('expanded');
                btn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
                const label = btn.querySelector('.expand-label');
                const lang = document.documentElement.lang || 'es';
                if (isExpanded) {
                    label.textContent = lang === 'es' ? 'Ocultar' : 'Hide';
                } else {
                    label.textContent = lang === 'es' ? 'Ver logros' : 'See achievements';
                }
            });
        });
    }

});
