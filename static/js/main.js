/**
 * Universidad Marítima del Caribe - Marine Engineering
 * Main JavaScript file
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    initNavigation();
    
    // Initialize scroll effects
    initScrollEffects();
    
    // Initialize animations
    initAnimations();
    
    // Initialize custom components
    initComponents();
});

/**
 * Initialize navigation functionality
 */
function initNavigation() {
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    
    // Mobile menu toggle
    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', function() {
            navbarToggle.classList.toggle('active');
            navbarMenu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navbarMenu.contains(event.target) && !navbarToggle.contains(event.target)) {
                navbarMenu.classList.remove('active');
                navbarToggle.classList.remove('active');
            }
        });
    }
    
    // Dropdown functionality for mobile
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            // Only for mobile view
            if (window.innerWidth <= 992) {
                e.preventDefault();
                this.classList.toggle('show');
                
                // Close other dropdowns
                dropdownToggles.forEach(otherToggle => {
                    if (otherToggle !== this) {
                        otherToggle.classList.remove('show');
                    }
                });
            }
        });
    });
    
    // Close dropdowns when window is resized beyond mobile breakpoint
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992) {
            navbarMenu.classList.remove('active');
            navbarToggle.classList.remove('active');
            dropdownToggles.forEach(toggle => {
                toggle.classList.remove('show');
            });
        }
    });
    
    // Add active class to current page link
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link, .dropdown-item');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPage || 
            (currentPage === '/' && linkPath === '/index') || 
            (linkPath !== '/' && linkPath !== '#' && currentPage.includes(linkPath))) {
            
            link.classList.add('active');
            
            // If active link is in dropdown, add active class to parent dropdown toggle
            if (link.classList.contains('dropdown-item')) {
                const parentDropdown = link.closest('.dropdown');
                if (parentDropdown) {
                    const dropdownToggle = parentDropdown.querySelector('.dropdown-toggle');
                    if (dropdownToggle) {
                        dropdownToggle.classList.add('active');
                    }
                }
            }
        }
    });
}

/**
 * Initialize scroll effects
 */
function initScrollEffects() {
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
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]:not(.dropdown-toggle)').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                scrollToAnchor(targetId);
            }
        });
    });
}

/**
 * Initialize animations
 */
function initAnimations() {
    // Add animation classes when elements enter viewport
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const checkIfInView = () => {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                const animation = element.getAttribute('data-animation') || 'fade-in';
                element.classList.add(animation);
            }
        });
    };
    
    // Check on scroll
    window.addEventListener('scroll', checkIfInView);
    // Check on load
    checkIfInView();
}

/**
 * Initialize custom components
 */
function initComponents() {
    initTabs();
    initAccordion();
    initAlertDismissal();
    
    // Tooltips initialization
    const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
    tooltipTriggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            
            document.body.appendChild(tooltip);
            
            const triggerRect = this.getBoundingClientRect();
            tooltip.style.left = triggerRect.left + (triggerRect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = triggerRect.top - tooltip.offsetHeight - 10 + 'px';
            
            tooltip.classList.add('show');
            
            this.addEventListener('mouseleave', function() {
                tooltip.remove();
            }, { once: true });
        });
    });
}

/**
 * Initialize tabs component
 */
function initTabs() {
    const tabContainers = document.querySelectorAll('.tabs-container');
    
    tabContainers.forEach(container => {
        const tabLinks = container.querySelectorAll('.tab-link');
        const tabContents = container.querySelectorAll('.tab-content');
        
        tabLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all tabs
                tabLinks.forEach(link => link.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to current tab
                this.classList.add('active');
                
                const targetId = this.getAttribute('data-tab');
                const targetContent = container.querySelector(`#${targetId}`);
                
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
        
        // Activate first tab by default
        if (tabLinks.length > 0 && tabContents.length > 0) {
            tabLinks[0].classList.add('active');
            tabContents[0].classList.add('active');
        }
    });
}

/**
 * Initialize accordion component
 */
function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        
        if (header && content) {
            header.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all accordion items
                if (!event.ctrlKey) {
                    document.querySelectorAll('.accordion-item').forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                            const otherContent = otherItem.querySelector('.accordion-content');
                            if (otherContent) {
                                otherContent.style.maxHeight = null;
                            }
                        }
                    });
                }
                
                // Toggle current item
                item.classList.toggle('active');
                
                if (!isActive) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                } else {
                    content.style.maxHeight = null;
                }
            });
        }
    });
}

/**
 * Initialize alert dismissal functionality
 */
function initAlertDismissal() {
    const alerts = document.querySelectorAll('.alert');
    
    alerts.forEach(alert => {
        const closeBtn = alert.querySelector('.alert-close');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                alert.classList.add('fade-out');
                
                setTimeout(() => {
                    alert.remove();
                }, 300);
            });
        }
        
        // Auto close alerts after 5 seconds if they have auto-close class
        if (alert.classList.contains('auto-close')) {
            setTimeout(() => {
                alert.classList.add('fade-out');
                
                setTimeout(() => {
                    alert.remove();
                }, 300);
            }, 5000);
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
    notification.className = `notification ${type}`;
    
    const icon = document.createElement('span');
    icon.className = 'notification-icon';
    
    switch(type) {
        case 'success':
            icon.innerHTML = '<i class="fas fa-check-circle"></i>';
            break;
        case 'error':
            icon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
            break;
        case 'warning':
            icon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
            break;
        case 'info':
            icon.innerHTML = '<i class="fas fa-info-circle"></i>';
            break;
    }
    
    const textSpan = document.createElement('span');
    textSpan.textContent = message;
    
    notification.appendChild(icon);
    notification.appendChild(textSpan);
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    notification.appendChild(closeBtn);
    
    // Append notification to body
    document.body.appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Hide notification after duration
    setTimeout(() => {
        notification.classList.add('fade-out');
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
    const targetElement = document.querySelector(target);
    
    if (targetElement) {
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = targetPosition - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

/**
 * Inicializar las animaciones de elementos al hacer scroll
 */
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar las animaciones al hacer scroll
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const checkIfInView = () => {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('animated');
                const animation = element.getAttribute('data-animation') || 'fade-in';
                element.classList.add(animation);
            }
        });
    };
    
    // Verificar elementos al cargar la página
    checkIfInView();
    
    // Verificar elementos al hacer scroll
    window.addEventListener('scroll', checkIfInView);
});
