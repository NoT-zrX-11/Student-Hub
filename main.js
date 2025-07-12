// Main application controller
class StudentsHubApp {
    constructor() {
        this.version = '1.0.0';
        this.isInitialized = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserPreferences();
        this.initializeComponents();
        this.setupPerformanceOptimizations();
        this.isInitialized = true;
        
        console.log(`Students Hub v${this.version} initialized successfully`);
    }

    setupEventListeners() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));

        // Handle page visibility changes
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

        // Handle online/offline status
        window.addEventListener('online', this.handleOnlineStatus.bind(this));
        window.addEventListener('offline', this.handleOfflineStatus.bind(this));

        // Global click handler for analytics
        document.addEventListener('click', this.handleGlobalClick.bind(this));
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.focusSearch();
        }

        // Escape to close modals/previews
        if (e.key === 'Escape') {
            this.closeModals();
        }

        // Number keys for navigation (1-5)
        if (e.key >= '1' && e.key <= '5' && !e.ctrlKey && !e.metaKey) {
            const pages = ['home', 'notes', 'feedback', 'subscription', 'about'];
            const pageIndex = parseInt(e.key) - 1;
            if (pages[pageIndex] && window.navigation) {
                window.navigation.setActivePage(pages[pageIndex]);
            }
        }
    }

    focusSearch() {
        const searchInput = document.getElementById('notes-search');
        if (searchInput && window.navigation.getCurrentPage() === 'notes') {
            searchInput.focus();
            searchInput.select();
        } else {
            // Navigate to notes page and focus search
            window.navigation.setActivePage('notes');
            setTimeout(() => {
                const input = document.getElementById('notes-search');
                if (input) {
                    input.focus();
                }
            }, 100);
        }
    }

    closeModals() {
        // Close PDF preview
        const preview = document.getElementById('pdf-preview');
        if (preview && preview.style.display !== 'none') {
            window.notesLibrary.hidePreview();
        }

        // Close mobile menu
        const navMenu = document.getElementById('nav-menu');
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
        }

        // Close toast
        if (window.toast) {
            window.toast.hide();
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden - save current state
            this.saveCurrentState();
        } else {
            // Page is visible - refresh if needed
            this.refreshIfNeeded();
        }
    }

    handleOnlineStatus() {
        if (window.toast) {
            window.toast.show('You are back online!', 'success', 2000);
        }
    }

    handleOfflineStatus() {
        if (window.toast) {
            window.toast.show('You are currently offline. Some features may be limited.', 'warning', 3000);
        }
    }

    handleGlobalClick(e) {
        // Track user interactions for analytics (in a real app)
        const element = e.target;
        const action = this.getActionType(element);
        
        if (action) {
            this.trackAction(action, element);
        }
    }

    getActionType(element) {
        if (element.matches('.btn')) return 'button_click';
        if (element.matches('.nav-link')) return 'navigation';
        if (element.matches('.preview-btn')) return 'preview';
        if (element.matches('.tab-btn')) return 'filter';
        return null;
    }

    trackAction(action, element) {
        // In a real application, this would send data to analytics service
        console.log(`Action tracked: ${action}`, {
            element: element.className,
            page: window.navigation?.getCurrentPage(),
            timestamp: new Date().toISOString()
        });
    }

    loadUserPreferences() {
        // Load and apply user preferences from localStorage
        const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
        
        // Apply saved preferences
        if (preferences.theme) {
            document.body.setAttribute('data-theme', preferences.theme);
        }

        if (preferences.lastPage && window.navigation) {
            window.navigation.setActivePage(preferences.lastPage);
        }
    }

    saveCurrentState() {
        const currentState = {
            page: window.navigation?.getCurrentPage(),
            theme: document.body.getAttribute('data-theme'),
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('userPreferences', JSON.stringify(currentState));
    }

    refreshIfNeeded() {
        // Check if content needs to be refreshed
        const lastRefresh = localStorage.getItem('lastRefresh');
        const now = Date.now();
        const refreshInterval = 30 * 60 * 1000; // 30 minutes

        if (!lastRefresh || (now - parseInt(lastRefresh)) > refreshInterval) {
            this.refreshContent();
            localStorage.setItem('lastRefresh', now.toString());
        }
    }

    refreshContent() {
        // In a real application, this would fetch fresh data
        console.log('Refreshing content...');
    }

    initializeComponents() {
        // Initialize any additional components that haven't been initialized
        this.initializeLazyLoading();
        this.setupProgressIndicators();
        this.initializeAccessibility();
    }

    initializeLazyLoading() {
        // Set up intersection observer for lazy loading images (if any)
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    setupProgressIndicators() {
        // Show loading indicators for async operations
        document.addEventListener('fetch-start', () => {
            this.showLoadingIndicator();
        });

        document.addEventListener('fetch-end', () => {
            this.hideLoadingIndicator();
        });
    }

    showLoadingIndicator() {
        // In a real app, show a loading spinner
        console.log('Loading...');
    }

    hideLoadingIndicator() {
        // Hide loading spinner
        console.log('Loading complete');
    }

    initializeAccessibility() {
        // Improve accessibility features
        this.setupSkipLinks();
        this.setupAriaLabels();
        this.setupFocusManagement();
    }

    setupSkipLinks() {
        // Add skip to main content link for screen readers
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-500);
            color: white;
            padding: 8px;
            text-decoration: none;
            z-index: 1000;
            border-radius: 4px;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    setupAriaLabels() {
        // Add appropriate ARIA labels where missing
        const searchInput = document.getElementById('notes-search');
        if (searchInput && !searchInput.getAttribute('aria-label')) {
            searchInput.setAttribute('aria-label', 'Search study materials');
        }

        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle && !themeToggle.getAttribute('aria-label')) {
            themeToggle.setAttribute('aria-label', 'Toggle dark mode');
        }
    }

    setupFocusManagement() {
        // Ensure proper focus management for dynamic content
        document.addEventListener('page-change', (e) => {
            const newPage = document.querySelector('.page.active');
            if (newPage) {
                const firstFocusable = newPage.querySelector('button, input, textarea, select, a[href]');
                if (firstFocusable) {
                    firstFocusable.focus();
                }
            }
        });
    }

    setupPerformanceOptimizations() {
        // Optimize performance
        this.optimizeAnimations();
    }

    optimizeAnimations() {
        // Reduce animations on low-end devices
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            document.documentElement.style.setProperty('--transition-fast', '0ms');
            document.documentElement.style.setProperty('--transition-base', '100ms');
            document.documentElement.style.setProperty('--transition-slow', '150ms');
        }
    }

    // Public API methods
    getStats() {
        return {
            version: this.version,
            isInitialized: this.isInitialized,
            currentPage: window.navigation?.getCurrentPage(),
            theme: document.body.getAttribute('data-theme'),
            onlineStatus: navigator.onLine
        };
    }

    restart() {
        // Restart the application
        this.isInitialized = false;
        this.init();
    }
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    
    // Show user-friendly error message
    if (window.toast) {
        window.toast.show('Something went wrong. Please refresh the page.', 'error', 5000);
    }
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault(); // Prevent default browser error handling
});

// Initialize the main application
document.addEventListener('DOMContentLoaded', () => {
    window.studentsHubApp = new StudentsHubApp();
});

// Service Worker registration for offline functionality (if needed)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // In a real app, register service worker here
        console.log('Service Worker support detected');
    });
}

// Expose useful debugging methods in development
if (import.meta.env.NODE_ENV === 'development' || !window.location.origin.includes('localhost')) {
    window.debug = {
        getAppStats: () => window.studentsHubApp?.getStats(),
        restartApp: () => window.studentsHubApp?.restart(),
        clearStorage: () => {
            localStorage.clear();
            sessionStorage.clear();
            location.reload();
        }
    };
}