// Navigation functionality
class Navigation {
    constructor() {
        this.currentPage = 'home';
        this.init();
    }

    init() {
        this.bindEvents();
        this.setActivePage('home');
    }

    bindEvents() {
        // Navigation links
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-page]')) {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.setActivePage(page);
            }
        });

        // Mobile menu toggle
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const navMenu = document.getElementById('nav-menu');

        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileToggle.classList.toggle('active');
            });

            // Close mobile menu when clicking on a link
            navMenu.addEventListener('click', (e) => {
                if (e.target.matches('.nav-link')) {
                    navMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                }
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                    navMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                }
            });
        }

        // Smooth scroll for anchor links
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const href = e.target.getAttribute('href');
                if (href && href !== '#') {
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                } else {
                    // Scroll to top for # or empty href
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }

    setActivePage(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show target page
        const targetPage = document.getElementById(`${pageId}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            
            // Add fade-in animation
            targetPage.style.opacity = '0';
            setTimeout(() => {
                targetPage.style.opacity = '1';
                targetPage.style.transition = 'opacity 0.3s ease';
            }, 10);
        }

        // Update navigation active state
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        const activeLink = document.querySelector(`[data-page="${pageId}"]`);
        if (activeLink && activeLink.classList.contains('nav-link')) {
            activeLink.classList.add('active');
        }

        // Update page title
        const pageTitles = {
            'home': 'Students Hub - Your One-Stop Study Companion',
            'notes': 'Notes Library - Students Hub',
            'feedback': 'Feedback - Students Hub',
            'subscription': 'Subscription Plans - Students Hub',
            'about': 'About Us - Students Hub'
        };

        document.title = pageTitles[pageId] || 'Students Hub';
        this.currentPage = pageId;

        // Scroll to top when changing pages
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Trigger page-specific initialization
        this.initializePage(pageId);
    }

    initializePage(pageId) {
        switch (pageId) {
            case 'notes':
                if (window.notesLibrary) {
                    window.notesLibrary.init();
                }
                break;
            case 'feedback':
                if (window.feedbackForm) {
                    window.feedbackForm.init();
                }
                break;
            case 'subscription':
                if (window.subscriptionPage) {
                    window.subscriptionPage.init();
                }
                break;
        }
    }

    getCurrentPage() {
        return this.currentPage;
    }
}

// Navbar scroll effect
class NavbarScroll {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.lastScrollY = window.scrollY;
        this.init();
    }

    init() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }

    handleScroll() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            this.navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            this.navbar.style.backdropFilter = 'blur(20px)';
            this.navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            this.navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            this.navbar.style.boxShadow = 'none';
        }

        // Update for dark mode
        if (document.body.getAttribute('data-theme') === 'dark') {
            if (currentScrollY > 100) {
                this.navbar.style.background = 'rgba(31, 41, 55, 0.98)';
            } else {
                this.navbar.style.background = 'rgba(31, 41, 55, 0.95)';
            }
        }

        this.lastScrollY = currentScrollY;
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.navigation = new Navigation();
    window.navbarScroll = new NavbarScroll();
});