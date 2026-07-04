/* ==========================================================================
   PORTFOLIO INTERACTIVE LOGIC (Vanilla JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    /* -----------------------------------------
       1. THEME TOGGLER (Local Storage cached)
       ----------------------------------------- */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check saved theme or default to dark
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark-theme';
    document.body.className = savedTheme;
    updateThemeIcon(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        if (document.body.classList.contains('light-theme')) {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            localStorage.setItem('portfolio-theme', 'dark-theme');
            updateThemeIcon('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            localStorage.setItem('portfolio-theme', 'light-theme');
            updateThemeIcon('light-theme');
        }
    });

    function updateThemeIcon(theme) {
        if (theme === 'light-theme') {
            themeIcon.className = 'fa-solid fa-sun';
        } else {
            themeIcon.className = 'fa-solid fa-moon';
        }
    }

    /* -----------------------------------------
       2. SCROLL REVEALS & ACTIVE NAV
       ----------------------------------------- */
    const revealElements = document.querySelectorAll('[data-reveal]');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const header = document.querySelector('.header');

    const revealOnScroll = () => {
        // Sticky Header Check
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Element Reveals
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const revealPoint = 150;
            if (elementTop < window.innerHeight - revealPoint) {
                element.classList.add('revealed');
            }
        });

        // Active Navigation Link Check
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger initial check on load

    /* -----------------------------------------
       3. TYPEWRITER EFFECT
       ----------------------------------------- */
    const typewriterElement = document.getElementById('typewriter');
    const words = [
        "Full Stack Developer.",
        "AI & ML Enthusiast.",
        "Problem Solver.",
        "Lifelong Learner."
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 120;

    const runTypewriter = () => {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeDelay = 60; // Delete faster
        } else {
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeDelay = 120; // Normal typing speed
        }

        // Handle transitions
        if (!isDeleting && charIndex === currentWord.length) {
            // Full word typed, pause
            typeDelay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // Word deleted, move to next
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeDelay = 500; // Small break before typing next
        }

        setTimeout(runTypewriter, typeDelay);
    };

    if (typewriterElement) {
        setTimeout(runTypewriter, 1000);
    }

    /* -----------------------------------------
       4. ABOUT TABS
       ----------------------------------------- */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(`tab-${targetTab}`).classList.add('active');
        });
    });

    /* -----------------------------------------
       5. PROJECTS GRID FILTERING
       ----------------------------------------- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Active Button styling
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.style.display = 'flex';
                    // Trigger dynamic animation reload
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.85)';
                    // Delay display:none to let fadeout happen
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    /* -----------------------------------------
       6. MOBILE BURGER NAVIGATION MENU
       ----------------------------------------- */
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            document.body.classList.toggle('mobile-nav-active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking nav link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                document.body.classList.remove('mobile-nav-active');
                navMenu.classList.remove('active');
            });
        });
    }

    /* -----------------------------------------
       7. CONTACT FORM VALIDATION & SUBMISSION
       ----------------------------------------- */
    const contactForm = document.getElementById('portfolio-contact-form');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            const formName = document.getElementById('form-name');
            const formEmail = document.getElementById('form-email');
            const formSubject = document.getElementById('form-subject');
            const formMessage = document.getElementById('form-message');

            // Reset Error States
            const resetError = (input) => {
                const group = input.parentElement;
                group.classList.remove('error');
            };

            const setError = (input) => {
                const group = input.parentElement;
                group.classList.add('error');
                isValid = false;
            };

            [formName, formEmail, formSubject, formMessage].forEach(resetError);

            // Name validation
            if (!formName.value.trim()) {
                setError(formName);
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!formEmail.value.trim() || !emailRegex.test(formEmail.value)) {
                setError(formEmail);
            }

            // Subject validation
            if (!formSubject.value.trim()) {
                setError(formSubject);
            }

            // Message validation
            if (!formMessage.value.trim()) {
                setError(formMessage);
            }

            if (isValid) {
                // Mock form submission success
                const submitBtn = contactForm.querySelector('.submit-btn');
                const submitBtnText = submitBtn.querySelector('span');
                const submitBtnIcon = submitBtn.querySelector('i');

                // Animate sending state
                submitBtnText.textContent = 'Sending...';
                submitBtnIcon.className = 'fa-solid fa-circle-notch fa-spin';
                submitBtn.disabled = true;

                setTimeout(() => {
                    // Show success modal
                    successModal.classList.add('active');
                    
                    // Reset Button
                    submitBtnText.textContent = 'Send Message';
                    submitBtnIcon.className = 'fa-solid fa-paper-plane';
                    submitBtn.disabled = false;
                    
                    // Clear fields
                    contactForm.reset();
                }, 1500);
            }
        });

        // Live input validation listeners to remove error classes
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.value.trim()) {
                    input.parentElement.classList.remove('error');
                }
            });
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            successModal.classList.remove('active');
        });
        
        // Close modal when clicking on overlay
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.remove('active');
            }
        });
    }
});
