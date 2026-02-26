(function () {
    'use strict';

    /* ── Dark mode (respects system preference, togglable) ── */
    function initTheme() {
        var stored = localStorage.getItem('theme');
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (stored === 'dark' || (!stored && prefersDark)) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }
    initTheme();

    /* ── Navbar scroll effect ── */
    var navbar = document.getElementById('navbar');
    var lastScroll = 0;

    function onScroll() {
        var y = window.scrollY;
        navbar.classList.toggle('scrolled', y > 40);
        lastScroll = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ── Mobile hamburger menu ── */
    var hamburger = document.getElementById('hamburger');
    var navLinks  = document.getElementById('nav-links');

    function closeMenu() {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
    }

    hamburger.addEventListener('click', function () {
        var isOpen = navLinks.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    /* Close on link click or outside click */
    navLinks.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', closeMenu);
    });
    document.addEventListener('click', function (e) {
        if (!navbar.contains(e.target)) closeMenu();
    });

    /* ── Scroll reveal (IntersectionObserver) ── */
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

        reveals.forEach(function (el) { observer.observe(el); });
    } else {
        /* Fallback: show all immediately */
        reveals.forEach(function (el) { el.classList.add('visible'); });
    }

    /* ── Cookie banner ── */
    var cookieBanner = document.getElementById('cookie-banner');
    var cookieAccept = document.getElementById('cookie-accept');

    if (!localStorage.getItem('cookie-consent')) {
        setTimeout(function () {
            cookieBanner.classList.add('show');
        }, 1800);
    }

    if (cookieAccept) {
        cookieAccept.addEventListener('click', function () {
            localStorage.setItem('cookie-consent', '1');
            cookieBanner.classList.remove('show');
        });
    }

    /* ── Contact form feedback ── */
    var contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function () {
            var btn = contactForm.querySelector('[type="submit"]');
            if (btn) {
                btn.textContent = 'Odesílám…';
                btn.disabled = true;
            }
        });
    }

    /* ── Smooth scroll for anchor links ── */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            var offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h')) || 72;
            var top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: top, behavior: 'smooth' });
        });
    });

})();
