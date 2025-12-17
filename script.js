// ===== Wedding Website JavaScript =====

// ===== Password Protection =====
const validPasswords = ['Wedding2026', 'wedding2026'];

function checkPassword() {
    const passwordInput = document.getElementById('password-input');
    const enteredPassword = passwordInput.value.trim();
    
    if (validPasswords.includes(enteredPassword)) {
        // Get video and overlay elements
        const loginVideo = document.getElementById('login-video');
        const passwordOverlay = document.querySelector('.password-overlay');
        const passwordPage = document.getElementById('password-page');
        const mainWebsite = document.getElementById('main-website');
        
        // Start playing the video
        loginVideo.play();
        
        // Fade out the overlay
        passwordOverlay.classList.add('fade-out');
        
        // Start expanding video after overlay fades
        setTimeout(() => {
            loginVideo.classList.add('expanding');
        }, 400);
        
        // After video expansion, switch to main website instantly
        setTimeout(() => {
            passwordPage.classList.add('hidden');
            mainWebsite.classList.remove('hidden');
            mainWebsite.style.opacity = '1';
        }, 6400);
        
        // Clear password input
        passwordInput.value = '';
    } else {
        // Show error feedback
        passwordInput.style.borderColor = '#e74c3c';
        passwordInput.style.backgroundColor = '#fdf2f2';
        passwordInput.value = '';
        passwordInput.placeholder = 'Incorrect password, try again';
        
        // Reset after 3 seconds
        setTimeout(() => {
            passwordInput.style.borderColor = '';
            passwordInput.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            passwordInput.placeholder = 'Enter password';
        }, 3000);
        
        // Shake animation
        passwordInput.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            passwordInput.style.animation = '';
        }, 500);
    }
}

// Allow Enter key to submit password
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password-input');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkPassword();
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initCountdown();
    initScrollEffects();
    initRSVPForm();
});

// ===== Navigation =====
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Scroll effect for navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== Countdown Timer =====
function initCountdown() {
    // Wedding date: August 8, 2026 at 12:00 (ceremony time)
    const weddingDate = new Date('August 8, 2026 12:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            // Wedding has passed
            document.getElementById('days').textContent = '0';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days.toString().padStart(3, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }

    // Update immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ===== Scroll Effects =====
function initScrollEffects() {
    // Fade in elements on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe sections for animation
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });

    // Observe event cards for staggered animation
    const eventCards = document.querySelectorAll('.event-card');
    eventCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
        observer.observe(card);
    });

    // Add CSS for fade-in animation
    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .fade-in.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    // Parallax effect for hero
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero');
        const scrolled = window.scrollY;
        if (hero && scrolled < window.innerHeight) {
            hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
        }
    });
}

// ===== RSVP Form =====
function initRSVPForm() {
    const form = document.getElementById('rsvp-form');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            
            // Get selected events
            const selectedEvents = [];
            formData.getAll('events').forEach(event => selectedEvents.push(event));
            
            // Map event values to readable names for consistency with main site
            const eventNames = {
                'birthday': 'Friday - Adam\'s Birthday Party',
                'wedding': 'Saturday - Wedding Ceremony & Reception',
                'farewell': 'Sunday - Farewell Brunch'
            };
            const eventsFormatted = selectedEvents.map(e => eventNames[e] || e).join(', ');
            
            const rsvpData = {
                name: formData.get('name'),
                email: formData.get('email'),
                attendance: formData.get('attending'), // 'yes' or 'no'
                events: eventsFormatted,
                dietary: formData.get('dietary'),
                questions: formData.get('message'), // Map 'message' to 'questions' for consistency
                timestamp: new Date().toISOString(),
                submittedAt: new Date().toLocaleString('en-US', {
                    timeZone: 'Europe/Stockholm',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };

            // Validate required fields
            if (!rsvpData.name || !rsvpData.email || !rsvpData.attendance) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            // Show loading state
            const submitBtn = form.querySelector('.btn-submit');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                // Send to Google Sheets (same as main website)
                await sendToGoogleSheets(rsvpData);
                
                showNotification('Thank you for your RSVP! We look forward to celebrating with you.', 'success');
                form.reset();
            } catch (error) {
                showNotification('Something went wrong. Please try again or contact us directly.', 'error');
                console.error('RSVP Error:', error);
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// Send RSVP data to Google Sheets (same implementation as main website)
async function sendToGoogleSheets(data) {
    // Google Apps Script Web App URL (same as main website)
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzBBqsrhRcNOeNE1zk7I8GiVTeyCxU9wMg9sYpLcm_cfxFQO9Ak6S4ieyzE-dQZpA4a/exec';
    
    try {
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        // With no-cors mode, we can't read the response, but if no error was thrown, it succeeded
        // Wait a moment to ensure the data is written
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { status: 'success' };
    } catch (error) {
        console.error('Error details:', error);
        
        // Fallback: Try to open email client with RSVP details
        const emailSubject = encodeURIComponent('RSVP - Saga & Adam Wedding');
        const emailBody = encodeURIComponent(`
Hi Saga & Adam,

Here is my RSVP for your wedding:

Name: ${data.name}
Email: ${data.email}
Attendance: ${data.attendance}
Events: ${data.events || 'Not specified'}
Dietary Restrictions: ${data.dietary || 'None'}
Message: ${data.questions || 'None'}

Looking forward to celebrating with you!

Submitted on: ${data.submittedAt}
        `);
        
        // Open default email client as fallback
        window.location.href = `mailto:saga.m.carle@gmail.com,adamdwalker91@gmail.com?subject=${emailSubject}&body=${emailBody}`;
        
        // Still throw error to show user the fallback was used
        throw new Error('Used email fallback');
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Add styles
    const styles = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 20px 30px;
            background: white;
            border-radius: 4px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 15px;
            animation: slideIn 0.3s ease;
            max-width: 400px;
            font-family: 'Libre Baskerville', Georgia, serif;
        }
        .notification-success {
            border-left: 4px solid #0B6623;
        }
        .notification-error {
            border-left: 4px solid #e74c3c;
        }
        .notification-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #999;
            padding: 0;
            line-height: 1;
        }
        .notification-close:hover {
            color: #333;
        }
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;

    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styleEl = document.createElement('style');
        styleEl.id = 'notification-styles';
        styleEl.textContent = styles;
        document.head.appendChild(styleEl);
    }

    // Add to page
    document.body.appendChild(notification);

    // Close button handler
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// ===== Utility Functions =====

// Smooth scroll to element
function scrollToElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
        const offsetTop = element.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
