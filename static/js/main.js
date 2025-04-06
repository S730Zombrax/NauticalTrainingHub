/**
 * Universidad Marítima del Caribe - Marine Engineering
 * Main JavaScript file
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    initNavigation();
    
    // Initialize animations
    initAnimations();
    
    // Initialize custom components
    initComponents();
    
    // Initialize scroll effects
    initScrollEffects();
});

/**
 * Initialize navigation functionality
 */
function initNavigation() {
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    
    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', function() {
            navbarMenu.classList.toggle('active');
            
            // Toggle hamburger animation
            const spans = this.querySelectorAll('span');
            if (spans.length >= 3) {
                spans[0].classList.toggle('rotate-45');
                spans[1].classList.toggle('opacity-0');
                spans[2].classList.toggle('rotate-negative-45');
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navbarMenu.contains(event.target) && !navbarToggle.contains(event.target)) {
                navbarMenu.classList.remove('active');
                
                // Reset hamburger
                const spans = navbarToggle.querySelectorAll('span');
                if (spans.length >= 3) {
                    spans[0].classList.remove('rotate-45');
                    spans[1].classList.remove('opacity-0');
                    spans[2].classList.remove('rotate-negative-45');
                }
            }
        });
    }
    
    // Set active nav link based on current page
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '/' && href === '/index.html')) {
            link.classList.add('active');
        } else if (href !== '/' && currentPath.includes(href)) {
            link.classList.add('active');
        }
    });
}

/**
 * Initialize scroll effects
 */
function initScrollEffects() {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // Scroll reveal animation for elements
    const revealElements = document.querySelectorAll('.reveal');
    
    if (revealElements.length > 0) {
        const revealElement = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        };
        
        const observer = new IntersectionObserver(revealElement, {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        });
        
        revealElements.forEach(element => {
            observer.observe(element);
        });
    }
}

/**
 * Initialize animations
 */
function initAnimations() {
    // Add animation classes with delay
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach((element, index) => {
        element.style.animationDelay = (index * 0.1) + 's';
    });
    
    const slideElements = document.querySelectorAll('.slide-up');
    slideElements.forEach((element, index) => {
        element.style.animationDelay = (index * 0.1) + 's';
    });
}

/**
 * Initialize custom components
 */
function initComponents() {
    // Initialize tabs if present
    initTabs();
    
    // Initialize accordion if present
    initAccordion();
    
    // Initialize form validation
    initFormValidation();
    
    // Initialize alert dismissal
    initAlertDismissal();
}

/**
 * Initialize tabs component
 */
function initTabs() {
    const tabContainers = document.querySelectorAll('.tabs');
    
    tabContainers.forEach(container => {
        const tabButtons = container.querySelectorAll('.tab-button');
        const tabPanels = container.querySelectorAll('.tab-panel');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const target = button.getAttribute('data-target');
                
                // Toggle active class on buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Toggle active class on panels
                tabPanels.forEach(panel => {
                    if (panel.getAttribute('id') === target) {
                        panel.classList.add('active');
                    } else {
                        panel.classList.remove('active');
                    }
                });
            });
        });
    });
}

/**
 * Initialize accordion component
 */
function initAccordion() {
    const accordions = document.querySelectorAll('.accordion');
    
    accordions.forEach(accordion => {
        const items = accordion.querySelectorAll('.accordion-item');
        
        items.forEach(item => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');
            
            header.addEventListener('click', () => {
                // Check if this accordion allows multiple open items
                const allowMultiple = accordion.getAttribute('data-allow-multiple') === 'true';
                
                if (!allowMultiple) {
                    items.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                        }
                    });
                }
                
                item.classList.toggle('active');
            });
        });
    });
}

/**
 * Initialize alert dismissal functionality
 */
function initAlertDismissal() {
    const alerts = document.querySelectorAll('.alert');
    
    alerts.forEach(alert => {
        const dismissButton = alert.querySelector('.alert-dismiss');
        
        if (dismissButton) {
            dismissButton.addEventListener('click', () => {
                alert.classList.add('fade-out');
                
                setTimeout(() => {
                    alert.remove();
                }, 300);
            });
        }
    });
}

/**
 * Utility function to show a notification
 * @param {string} message - The notification message
 * @param {string} type - The notification type (success, error, warning)
 * @param {number} duration - Duration in milliseconds
 */
function showNotification(message, type = 'success', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add visible class after a short delay for animation
    setTimeout(() => {
        notification.classList.add('visible');
    }, 10);
    
    // Remove notification after duration
    setTimeout(() => {
        notification.classList.remove('visible');
        
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, duration);
}

/**
 * Utility function for smooth scrolling to anchor
 * @param {string} target - Target element selector
 * @param {number} offset - Offset from the top in pixels
 */
function scrollToAnchor(target, offset = 80) {
    const element = document.querySelector(target);
    
    if (element) {
        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
            top: targetPosition - offset,
            behavior: 'smooth'
        });
    }
}
