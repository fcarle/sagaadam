// Password Protection
const validPasswords = ['fabian007', 'Fabian007'];

function checkPassword() {
    const passwordInput = document.getElementById('password-input');
    const enteredPassword = passwordInput.value.trim();
    
    if (validPasswords.includes(enteredPassword)) {
        // Hide password page and show main website
        document.getElementById('password-page').classList.add('hidden');
        document.getElementById('main-website').classList.remove('hidden');
        
        // Clear password input
        passwordInput.value = '';
        
        // Add smooth entrance animation
        document.getElementById('main-website').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('main-website').style.transition = 'opacity 0.8s ease-out';
            document.getElementById('main-website').style.opacity = '1';
        }, 100);
    } else {
        // Show error feedback
        passwordInput.style.borderColor = '#e74c3c';
        passwordInput.style.backgroundColor = '#fdf2f2';
        passwordInput.value = '';
        passwordInput.placeholder = 'Incorrect password, try again';
        
        // Reset after 3 seconds
        setTimeout(() => {
            passwordInput.style.borderColor = '#e1e8ed';
            passwordInput.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
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
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });
});

// Button-based page flipping system
let currentPageIndex = 0;
let isTransitioning = false;
const pages = ['welcome', 'schedule', 'rsvp', 'contact'];

function showPage(pageId) {
    const pageElements = document.querySelectorAll('.page');
    
    // Remove active states
    pageElements.forEach(page => {
        page.classList.remove('active');
        page.classList.add('flipped-left');
    });
    
    // Show target page with flip animation
    setTimeout(() => {
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.remove('flipped-left', 'flipped-right');
            targetPage.classList.add('active');
        }
        updateNavigationButtons();
    }, 100);
}

function nextPage() {
    if (isTransitioning || currentPageIndex >= pages.length - 1) return;
    
    isTransitioning = true;
    currentPageIndex++;
    showPage(pages[currentPageIndex]);
    
    setTimeout(() => {
        isTransitioning = false;
    }, 800);
}

function previousPage() {
    if (isTransitioning || currentPageIndex <= 0) return;
    
    isTransitioning = true;
    currentPageIndex--;
    showPage(pages[currentPageIndex]);
    
    setTimeout(() => {
        isTransitioning = false;
    }, 800);
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    // Disable/enable buttons based on current page
    if (currentPageIndex === 0) {
        prevBtn.disabled = true;
        prevBtn.style.opacity = '0.3';
    } else {
        prevBtn.disabled = false;
        prevBtn.style.opacity = '0.8';
    }
    
    if (currentPageIndex === pages.length - 1) {
        nextBtn.disabled = true;
        nextBtn.style.opacity = '0.3';
    } else {
        nextBtn.disabled = false;
        nextBtn.style.opacity = '0.8';
    }
}

// Handle keyboard navigation (optional)
function handleKeyboard(event) {
    if (isTransitioning) return;
    
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        nextPage();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        previousPage();
    }
}

// Initialize button system
document.addEventListener('DOMContentLoaded', function() {
    // Show first page
    showPage('welcome');
    
    // Add keyboard listeners (optional)
    document.addEventListener('keydown', handleKeyboard);
    
    // Restore normal scrolling within pages
    document.body.style.overflow = 'hidden';
});

// RSVP Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const attendanceSelect = document.getElementById('attendance');
    const eventsGroup = document.getElementById('events-group');
    const rsvpForm = document.getElementById('rsvp-form');
    
    // Show/hide events checkboxes based on attendance selection
    attendanceSelect.addEventListener('change', function() {
        if (this.value === 'yes-partial') {
            eventsGroup.style.display = 'block';
        } else {
            eventsGroup.style.display = 'none';
        }
    });
    
    // Handle form submission
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitRSVP();
    });
});

function submitRSVP() {
    const form = document.getElementById('rsvp-form');
    const formData = new FormData(form);
    
    // Collect form data
    const rsvpData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        attendance: formData.get('attendance'),
        guests: formData.get('guests'),
        dietary: formData.get('dietary'),
        message: formData.get('message'),
        events: formData.getAll('events').join(', '),
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
    
    // Show loading state
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Send to Google Sheets
    sendToGoogleSheets(rsvpData)
        .then(() => {
            // Show success message
            document.getElementById('rsvp-form').classList.add('hidden');
            document.getElementById('rsvp-success').classList.remove('hidden');
            
            // Scroll to success message
            document.getElementById('rsvp-success').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        })
        .catch((error) => {
            console.error('Error submitting RSVP:', error);
            alert('Sorry, there was an error submitting your RSVP. Please try again or contact us directly.');
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
}

async function sendToGoogleSheets(data) {
    // Google Apps Script Web App URL (you'll need to replace this with your actual URL)
    const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
    
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        return await response.json();
    } catch (error) {
        // Fallback: Try to open email client with RSVP details
        const emailSubject = encodeURIComponent('RSVP - Saga & Adam Wedding');
        const emailBody = encodeURIComponent(`
Hi Saga & Adam,

Here is my RSVP for your wedding:

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Attendance: ${data.attendance}
Number of Guests: ${data.guests}
Events: ${data.events || 'All events'}
Dietary Restrictions: ${data.dietary || 'None'}
Message: ${data.message || 'None'}

Looking forward to celebrating with you!

Submitted on: ${data.submittedAt}
        `);
        
        // Open default email client as fallback
        window.location.href = `mailto:saga@email.com,adam@email.com?subject=${emailSubject}&body=${emailBody}`;
        
        // Still throw error to show user the fallback was used
        throw new Error('Used email fallback');
    }
}

// Add CSS for shake animation
const shakeCSS = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}
`;

// Inject shake animation CSS
const style = document.createElement('style');
style.textContent = shakeCSS;
document.head.appendChild(style);

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.schedule-card, .contact-card, .rsvp-form');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.welcome-section');
        if (parallax) {
            const speed = scrolled * 0.5;
            parallax.style.backgroundPosition = `center ${speed}px`;
        }
    });
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe sections for fade-in effect
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(section);
    });
});

// Mobile menu toggle (for future mobile menu implementation)
function toggleMobileMenu() {
    // Implementation for mobile hamburger menu if needed
    console.log('Mobile menu toggle');
}

// Add some Easter eggs
let clickCount = 0;
document.addEventListener('DOMContentLoaded', function() {
    const logo = document.querySelector('.nav-logo');
    if (logo) {
        logo.addEventListener('click', function() {
            clickCount++;
            if (clickCount === 5) {
                // Easter egg: Create floating hearts
                createFloatingHearts();
                clickCount = 0;
            }
        });
    }
});

function createFloatingHearts() {
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = '❤️';
            heart.style.position = 'fixed';
            heart.style.left = Math.random() * window.innerWidth + 'px';
            heart.style.top = window.innerHeight + 'px';
            heart.style.fontSize = '2rem';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '9999';
            heart.style.animation = 'floatUp 3s ease-out forwards';
            
            document.body.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
            }, 3000);
        }, i * 200);
    }
}

// Add float up animation for hearts
const floatUpCSS = `
@keyframes floatUp {
    0% {
        transform: translateY(0) scale(0);
        opacity: 1;
    }
    100% {
        transform: translateY(-100vh) scale(1);
        opacity: 0;
    }
}
`;

const floatStyle = document.createElement('style');
floatStyle.textContent = floatUpCSS;
document.head.appendChild(floatStyle);