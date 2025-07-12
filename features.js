// Theme management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.bindEvents();
    }

    bindEvents() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
        }
    }
}

// Notes Library functionality
class NotesLibrary {
    constructor() {
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.notes = this.getAllNotes();
    }

    init() {
        this.bindEvents();
        this.renderNotes();
    }

    bindEvents() {
        // Search functionality
        const searchInput = document.getElementById('notes-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.renderNotes();
            });
        }

        // Filter tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.getAttribute('data-semester');
                this.renderNotes();
            });
        });

        // Preview buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.preview-btn')) {
                const pdfName = e.target.getAttribute('data-pdf');
                this.showPreview(pdfName);
            }
        });

        // Close preview
        const closePreview = document.getElementById('close-preview');
        if (closePreview) {
            closePreview.addEventListener('click', () => {
                this.hidePreview();
            });
        }
    }

    getAllNotes() {
        return document.querySelectorAll('.note-item');
    }

    renderNotes() {
        this.notes.forEach(note => {
            const semester = note.getAttribute('data-semester');
            const subject = note.getAttribute('data-subject');
            const title = note.querySelector('h3').textContent.toLowerCase();
            const description = note.querySelector('p').textContent.toLowerCase();

            let show = true;

            // Filter by semester
            if (this.currentFilter !== 'all' && semester !== this.currentFilter) {
                show = false;
            }

            // Filter by search term
            if (this.searchTerm && !title.includes(this.searchTerm) && 
                !description.includes(this.searchTerm) && !subject.includes(this.searchTerm)) {
                show = false;
            }

            note.style.display = show ? 'flex' : 'none';
        });
    }

    // In js/features.js, update the showPreview method:
showPreview(pdfName) {
    const preview = document.getElementById('pdf-preview');
    const title = document.getElementById('preview-title');
    const content = document.querySelector('.preview-content');
    
    if (preview && title && content) {
        title.textContent = `Preview: ${pdfName}`;
        
        // Replace placeholder with actual PDF embed
        content.innerHTML = `
            <embed src="pdfs/${pdfName}" 
                   type="application/pdf" 
                   width="100%" 
                   height="500px"
                   style="border: none;">
            <p style="margin-top: 10px;">
                <a href="pdfs/${pdfName}" target="_blank" class="btn btn-primary">
                    Open in New Tab
                </a>
            </p>
        `;
        
        preview.style.display = 'block';
        preview.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

}

// Feedback Form functionality
class FeedbackForm {
    constructor() {
        this.rating = 0;
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Star rating
        document.querySelectorAll('.star').forEach(star => {
            star.addEventListener('click', (e) => {
                this.rating = parseInt(e.target.getAttribute('data-rating'));
                this.updateStars();
            });

            star.addEventListener('mouseenter', (e) => {
                this.highlightStars(parseInt(e.target.getAttribute('data-rating')));
            });
        });

        const ratingContainer = document.getElementById('rating-stars');
        if (ratingContainer) {
            ratingContainer.addEventListener('mouseleave', () => {
                this.updateStars();
            });
        }

        // Form submission
        const form = document.getElementById('feedback-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit(e);
            });
        }
    }

    highlightStars(rating) {
        document.querySelectorAll('.star').forEach((star, index) => {
            star.classList.toggle('active', index < rating);
        });
    }

    updateStars() {
        this.highlightStars(this.rating);
    }

    handleSubmit(e) {
        const formData = new FormData(e.target);
        const feedback = {
            name: formData.get('name'),
            email: formData.get('email'),
            materialName: formData.get('materialName'),
            message: formData.get('message'),
            rating: this.rating,
            timestamp: new Date().toISOString()
        };

        // Store in localStorage
        const existingFeedback = JSON.parse(localStorage.getItem('feedback') || '[]');
        existingFeedback.push(feedback);
        localStorage.setItem('feedback', JSON.stringify(existingFeedback));

        // Show success message
        this.showToast('Feedback submitted successfully! Thank you for your input.');

        // Reset form
        e.target.reset();
        this.rating = 0;
        this.updateStars();
    }

    showToast(message) {
        if (window.toast) {
            window.toast.show(message);
        }
    }
}

// Subscription Page functionality
class SubscriptionPage {
    constructor() {
        this.selectedPlan = null;
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        const subscribeBtn = document.getElementById('subscribe-btn');
        if (subscribeBtn) {
            subscribeBtn.addEventListener('click', () => {
                this.showPaymentSection();
            });
        }

        // Payment form submission
        const paymentSection = document.getElementById('payment-section');
        if (paymentSection) {
            const form = paymentSection.querySelector('form');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handlePayment(e);
                });
            }
        }
    }

    showPaymentSection() {
        const paymentSection = document.getElementById('payment-section');
        if (paymentSection) {
            paymentSection.style.display = 'block';
            paymentSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    handlePayment(e) {
        const formData = new FormData(e.target);
        const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
        const mobileNumber = formData.get('mobile');

        if (!mobileNumber) {
            this.showToast('Please enter your mobile number.');
            return;
        }

        // Simulate payment processing
        this.showToast('Processing payment...');
        
        setTimeout(() => {
            this.showToast(`Payment successful! Welcome to Premium. Receipt sent to your ${paymentMethod} account.`);
            
            // Update UI to show premium status
            const currentPlanBtn = document.querySelector('.pricing-card .btn-outline');
            if (currentPlanBtn) {
                currentPlanBtn.textContent = 'Premium Active';
                currentPlanBtn.style.background = 'var(--accent-500)';
                currentPlanBtn.style.color = 'white';
            }

            // Hide payment section
            const paymentSection = document.getElementById('payment-section');
            if (paymentSection) {
                paymentSection.style.display = 'none';
            }
        }, 2000);
    }

    showToast(message) {
        if (window.toast) {
            window.toast.show(message);
        }
    }
}

// Toast notification system
class Toast {
    constructor() {
        this.toastElement = document.getElementById('toast');
        this.bindEvents();
    }

    bindEvents() {
        if (this.toastElement) {
            const closeBtn = this.toastElement.querySelector('.toast-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.hide();
                });
            }
        }
    }

    show(message, type = 'success', duration = 4000) {
        if (!this.toastElement) return;

        const messageElement = this.toastElement.querySelector('.toast-message');
        if (messageElement) {
            messageElement.textContent = message;
        }

        // Set toast type styles
        this.toastElement.className = `toast ${type}`;
        
        // Show toast
        this.toastElement.classList.add('show');

        // Auto hide
        setTimeout(() => {
            this.hide();
        }, duration);
    }

    hide() {
        if (this.toastElement) {
            this.toastElement.classList.remove('show');
        }
    }
}

// Smooth scrolling and animations
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.observeElements();
    }

    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe cards and sections
        document.querySelectorAll('.card, .note-card, .subject-card, .step-card, .mission-card').forEach(el => {
            observer.observe(el);
        });
    }
}

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
    window.notesLibrary = new NotesLibrary();
    window.feedbackForm = new FeedbackForm();
    window.subscriptionPage = new SubscriptionPage();
    window.toast = new Toast();
    window.scrollAnimations = new ScrollAnimations();
});