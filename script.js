/* ==========================================================================
   PORTFOLIO INTERACTIVE LOGIC (Vanilla JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    /* -----------------------------------------
       1. THEME TOGGLER (Local Storage cached)
       ----------------------------------------- */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check saved theme or default to light
    const savedTheme = localStorage.getItem('portfolio-theme') || 'light-theme';
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
        "Full Stack Wizard 🧙‍♀️",
        "AI Prompt Whisperer 🤖",
        "Cloud Tech Explorer ☁️",
        "Boba Tea Powered Coder 🧋",
        "Aesthetic Web Artisan ✨",
        "Problem Solver 🧩"
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

    /* -----------------------------------------
       8. CHATBOT WIDGET
       ----------------------------------------- */
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatSend = document.getElementById('chat-send');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const chatBadge = chatToggle ? chatToggle.querySelector('.chat-badge') : null;
    const chatOptions = document.querySelectorAll('.chat-opt-btn');

    if (chatToggle && chatWindow) {
        // Toggle Chat Window
        chatToggle.addEventListener('click', () => {
            chatWindow.classList.toggle('active');
            if (chatWindow.classList.contains('active') && chatBadge) {
                chatBadge.style.display = 'none'; // Hide badge once opened
            }
        });

        // Close Chat Window
        if (chatClose) {
            chatClose.addEventListener('click', () => {
                chatWindow.classList.remove('active');
            });
        }

        // Handle Quick Option Clicks
        chatOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                const query = opt.getAttribute('data-query');
                const label = opt.textContent;
                addUserMessage(label);
                setTimeout(() => {
                    respondToUser(query);
                }, 600);
            });
        });

        // Handle Input Submit
        const submitInput = () => {
            const text = chatInput.value.trim();
            if (!text) return;
            addUserMessage(text);
            chatInput.value = '';
            setTimeout(() => {
                respondToUser(text.toLowerCase());
            }, 600);
        };

        if (chatSend) {
            chatSend.addEventListener('click', submitInput);
        }
        if (chatInput) {
            chatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') submitInput();
            });
        }
    }

    function addUserMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-msg user';
        msgDiv.innerHTML = `<p>${text}</p>`;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addBotMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-msg bot';
        msgDiv.innerHTML = `<p>${text}</p>`;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function respondToUser(query) {
        let response = "";
        
        // Match cheerful greetings
        if (query === 'hi' || query === 'hello' || query === 'hey' || query === 'hola' || query === 'yo' || query.startsWith('hi ') || query.startsWith('hello ')) {
            const greetings = [
                "Yoooo! Sweta's digital assistant here! 🍡 I was just organizing her codebase, but I'm pausing that to chat with you! What's up? 🚀",
                "Hey, hey! Welcome to Sweta's portfolio! 🌸 I'm Mochi.js, your tour guide. Ready to explore her projects, college life, or plant propagation? Let's do this! ✨",
                "Konnichiwa! 🇯🇵 Mochi.js in the house! 🍡 Sweta is currently writing code, but I'm here to answer all your questions. What's on your mind? 🤖",
                "Oooooh, a visitor! Yay! 🌟 I'm Mochi.js, Sweta's coding companion. Ask me anything about her skills, project details, or what plants she's propagating! 🌿"
            ];
            const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
            
            addBotMessage(randomGreeting);
            return;
        }

        if (query.includes('skill') || query.includes('languages') || query.includes('tool') || query === 'skills') {
            response = "Sweta specializes in <strong>Frontend</strong> (React, TS, Tailwind), <strong>Backend</strong> (Flask, Python, SQLite), and <strong>AI &amp; ML</strong> (LLM APIs, OpenRouter, Prompt Engineering)! 💻";
        } else if (query.includes('project') || query.includes('build') || query === 'projects' || query.includes('work')) {
            response = "She has built some amazing stuff! 🚀<br><br>• <strong>Attestr</strong>: Decentralized media authenticator (Solidity &amp; AI deepfake detection).<br>• <strong>StudyNest</strong>: AI-powered university syllabus milestones manager.<br>• <strong>CodeAlpha Chatbot</strong>: Intelligent chatbot assistant.";
        } else if (query.includes('plant') || query.includes('mom') || query === 'plants' || query.includes('hobby')) {
            response = "Yes! Sweta is a certified <strong>Plant Mom</strong> 🌱. She propagates pothos and maintains indoor ivy partition walls to keep her workspace fresh!";
        } else if (query.includes('contact') || query.includes('hire') || query.includes('email') || query === 'contact' || query.includes('social')) {
            response = "You can reach Sweta at <a href='mailto:sweta.dollysharma@gmail.com' class='email-link'>sweta.dollysharma@gmail.com</a> or connect on LinkedIn at <a href='https://www.linkedin.com/in/swetasharmaa/' target='_blank' rel='noopener noreferrer'>swetasharmaa</a>! 📬";
        } else if (query.includes('college') || query.includes('noida') || query.includes('niet') || query.includes('education') || query.includes('study')) {
            response = "Sweta is studying at the <strong>Noida Institute of Engineering and Technology (NIET)</strong>, pursuing an <strong>Integrated Degree in Computer Science</strong>! 🎓";
        } else if (query.includes('solidity') || query.includes('blockchain') || query.includes('attestr') || query.includes('diablo') || query.includes('hackathon')) {
            response = "At the <strong>Innovate Bharat Hackathon 2026</strong>, Sweta's team (Ctrl+Alt+Diablo) built <strong>Attestr</strong>—a decentralized media authenticator using Solidity smart contracts and AI deepfake detection! 🛡️🔗";
        } else {
            response = "I'm Mochi.js, a simple assistant, but I'd love to help! Ask me about Sweta's <strong>skills</strong>, <strong>projects</strong>, <strong>college</strong>, or her plants! 🍡🤖";
        }
        addBotMessage(response);
    }
});
