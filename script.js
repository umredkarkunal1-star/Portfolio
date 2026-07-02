// ==========================================================================
// Spline 3D Scene Initialization (Hero Background)
// ==========================================================================
const MIN_SCREEN_WIDTH_FOR_SPLINE = 1024;
let splineSceneLoaded = false;
let splineCanvas = null;

const isDesktopOrLaptop = () =>
    window.matchMedia(`(min-width: ${MIN_SCREEN_WIDTH_FOR_SPLINE}px)`).matches;

const hideSplineCanvas = () => {
    if (!splineCanvas) return;
    splineCanvas.style.display = 'none';
    splineCanvas.style.visibility = 'hidden';
    splineCanvas.style.opacity = '0';
    splineCanvas.setAttribute('aria-hidden', 'true');
};

const initSplineScene = async () => {
    if (!isDesktopOrLaptop() || splineSceneLoaded) {
        return;
    }

    try {
        splineCanvas = splineCanvas || document.getElementById('splineCanvas3D');
        if (!splineCanvas) {
            console.error('Canvas element not found');
            return;
        }

        const heroSection = document.getElementById('home');
        if (!heroSection) {
            console.error('Hero section not found');
            return;
        }

        const { Application } = await import('https://esm.sh/@splinetool/runtime');

        const updateCanvasDimensions = () => {
            splineCanvas.width = window.innerWidth;
            splineCanvas.height = heroSection.offsetHeight || window.innerHeight;
        };

        updateCanvasDimensions();
        window.addEventListener('resize', updateCanvasDimensions);

        const spline = new Application(splineCanvas);
        const sceneUrl = 'https://prod.spline.design/DpgtbC7Q76a3FppV/scene.splinecode';

        console.log('Loading Spline scene...');
        await spline.load(sceneUrl);
        splineSceneLoaded = true;
        console.log('✓ Spline 3D scene loaded successfully');

        splineCanvas.style.display = 'block';
        splineCanvas.style.visibility = 'visible';
        splineCanvas.style.opacity = '0.8';
        splineCanvas.style.transition = 'opacity 0.6s ease';
        splineCanvas.removeAttribute('aria-hidden');
    } catch (error) {
        console.error('Error initializing Spline:', error);
    }
};

const handleScreenSizeChange = (event) => {
    if (event.matches) {
        initSplineScene();
    } else {
        hideSplineCanvas();
    }
};

const setupSplineLoading = () => {
    splineCanvas = document.getElementById('splineCanvas3D');

    if (!isDesktopOrLaptop()) {
        hideSplineCanvas();
        return;
    }

    setTimeout(initSplineScene, 500);
};

const splineMediaQuery = window.matchMedia(`(min-width: ${MIN_SCREEN_WIDTH_FOR_SPLINE}px)`);
if (splineMediaQuery.addEventListener) {
    splineMediaQuery.addEventListener('change', handleScreenSizeChange);
} else if (splineMediaQuery.addListener) {
    splineMediaQuery.addListener(handleScreenSizeChange);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupSplineLoading);
} else {
    setupSplineLoading();
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // ==========================================================================
    // Custom Cursor Glow Tracker (Desktop Only)
    // ==========================================================================
    const cursorGlow = document.getElementById('cursorGlow');
    
    if (cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
            cursorGlow.style.opacity = '1';
        });

        document.addEventListener('mouseleave', () => {
            cursorGlow.style.opacity = '0';
        });
    }

    // ==========================================================================
    // Sticky Header and Scroll Progress Bar
    // ==========================================================================
    const header = document.querySelector('.header');
    const scrollProgressBar = document.getElementById('scrollProgress');

    window.addEventListener('scroll', () => {
        // Sticky class
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Progress Bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (scrollProgressBar) {
            scrollProgressBar.style.width = `${scrolled}%`;
        }
    });

    // ==========================================================================
    // Mobile Hamburger Navigation Menu
    // ==========================================================================
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        hamburgerBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    };

    const closeMenu = () => {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    };

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', toggleMenu);
    }

    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMenu);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // ==========================================================================
    // Role Typing Animation (Hero Section)
    // ==========================================================================
    const roleTextContainer = document.getElementById('role-text');
    const roles = [
        "Data Analyst",
        "Web Developer",
        "Cybersecurity Enthusiast"
    ];
    
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const typeRoles = () => {
        if (!roleTextContainer) return;

        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            // Remove one character at a time for the delete animation
            roleTextContainer.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // faster backspacing for natural deletion
        } else {
            // Add one character at a time for the typing animation
            roleTextContainer.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // normal typing speed
        }

        // When the phrase is fully typed, pause before deleting
        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 2000; // pause duration at the completed phrase
        } else if (isDeleting && charIndex === 0) {
            // When deletion finishes, move to the next phrase
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // pause before typing the next phrase
        }

        setTimeout(typeRoles, typingSpeed);
    };

    if (roleTextContainer) {
        setTimeout(typeRoles, 1000);
    }

    // ==========================================================================
    // Scroll Reveal & Active Section Tracker (Intersection Observer)
    // ==========================================================================
    
    // Add Scroll Classes to Sections dynamically for animations
    const animatedSections = document.querySelectorAll('section');
    animatedSections.forEach((section, index) => {
        section.classList.add('reveal-up');
    });

    // Setup animated skill cards dynamically
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach((card, index) => {
        card.classList.add('reveal-up');
        card.classList.add(`stagger-delay-${(index % 3) + 1}`);
    });

    // Setup animated project cards dynamically
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.classList.add('reveal-up');
        card.classList.add(`stagger-delay-${(index % 2) + 1}`);
    });

    // Setup Info Cards inside About
    const infoCards = document.querySelectorAll('.info-card');
    infoCards.forEach((card, index) => {
        card.classList.add('reveal-up');
        card.classList.add(`stagger-delay-${(index % 2) + 1}`);
    });

    const aboutCol1 = document.querySelector('.about-content');
    const aboutCol2 = document.querySelector('.about-image-wrapper');
    if (aboutCol1) aboutCol1.classList.add('reveal-left');
    if (aboutCol2) aboutCol2.classList.add('reveal-right');

    const contactCol1 = document.querySelector('.contact-info');
    const contactCol2 = document.querySelector('.contact-form-wrapper');
    if (contactCol1) contactCol1.classList.add('reveal-left');
    if (contactCol2) contactCol2.classList.add('reveal-right');

    const collabCard = document.querySelector('.collab-card');
    if (collabCard) collabCard.classList.add('reveal-zoom-in');

    const revealElements = document.querySelectorAll('.reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-zoom-in, .reveal-zoom-out');

    // General scroll reveals
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                
                // Specific action: Animate progress bars in skill cards
                if (entry.target.classList.contains('skill-card')) {
                    if (!entry.target.classList.contains('skill-card-hidden')) {
                        animateProgressAndCounter(entry.target);
                    }
                }
                
                // Specific action: Run stats counters
                if (entry.target.id === 'about') {
                    animateCounters();
                }

                // Stop observing after reveal
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Active Navigation Highlighting
    const activeObserverOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // check when section covers middle viewport
        threshold: 0
    };

    const activeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, activeObserverOptions);

    animatedSections.forEach(section => {
        activeObserver.observe(section);
    });

    // ==========================================================================
    // Stat Counters Animation (About Section)
    // ==========================================================================
    let countersAnimated = false;
    const animateCounters = () => {
        if (countersAnimated) return;
        const stats = document.querySelectorAll('.stat-number');
        
        stats.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            let count = 0;
            const speed = 100; // The lower the slower
            
            const updateCount = () => {
                const inc = target / speed;
                
                if (count < target) {
                    count = Math.min(target, count + Math.max(1, Math.floor(inc)));
                    stat.textContent = count;
                    setTimeout(updateCount, 15);
                } else {
                    stat.textContent = target;
                }
            };
            
            updateCount();
        });
        countersAnimated = true;
    };

    // ==========================================================================
    // 3D Card Tilt Effect (Projects Section)
    // ==========================================================================
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x coordinate inside the card
            const y = e.clientY - rect.top;  // y coordinate inside the card
            
            // Calculate relative rotation angles
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((centerY - y) / centerY) * 8; // Max 8 degrees X
            const rotateY = ((x - centerX) / centerX) * 8;  // Max 8 degrees Y
            
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            // Smoothly reset back
            card.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        });

        card.addEventListener('mouseenter', () => {
            // Remove transitions temporarily on hover to make tilts snappy
            card.style.transition = 'none';
        });
    });

    // ==========================================================================
    // Contact Form Validation and WhatsApp Redirection
    // ==========================================================================
    const contactForm = document.getElementById('contactForm');
    const userNameInput = document.getElementById('userName');
    const userEmailInput = document.getElementById('userEmail');
    const userMessageInput = document.getElementById('userMessage');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateInput = (input, errorElId, validationFn) => {
        const value = input.value.trim();
        const isValid = validationFn(value);
        const group = input.closest('.form-group');

        if (!isValid) {
            group.classList.add('invalid');
            return false;
        } else {
            group.classList.remove('invalid');
            return true;
        }
    };

    // Live validation triggers
    if (userNameInput) {
        userNameInput.addEventListener('input', () => {
            validateInput(userNameInput, 'nameError', val => val.length > 0);
        });
    }

    if (userEmailInput) {
        userEmailInput.addEventListener('input', () => {
            validateInput(userEmailInput, 'emailError', val => emailRegex.test(val));
        });
    }

    if (userMessageInput) {
        userMessageInput.addEventListener('input', () => {
            validateInput(userMessageInput, 'messageError', val => val.length > 0);
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Validate all fields
            const isNameValid = validateInput(userNameInput, 'nameError', val => val.length > 0);
            const isEmailValid = validateInput(userEmailInput, 'emailError', val => emailRegex.test(val));
            const isMessageValid = validateInput(userMessageInput, 'messageError', val => val.length > 0);

            if (isNameValid && isEmailValid && isMessageValid) {
                // Success - prepare WhatsApp message content
                const name = userNameInput.value.trim();
                const email = userEmailInput.value.trim();
                const msg = userMessageInput.value.trim();

                const waNumber = "918767373962";
                
                // Format matching user instruction
                const textMessage = `Hello Kunal,\n\nI would like to collaborate with you.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${msg}\n\nPlease contact me regarding this opportunity.`;
                const encodedMessage = encodeURIComponent(textMessage);
                const waUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`;

                // Animate Send button to success state
                const submitBtn = contactForm.querySelector('.btn-submit');
                const btnSpan = submitBtn.querySelector('span');
                const btnIcon = submitBtn.querySelector('i');

                submitBtn.disabled = true;
                submitBtn.style.background = '#25D366'; // Green color for success
                submitBtn.style.color = 'white';
                submitBtn.style.borderColor = 'transparent';
                btnSpan.textContent = 'Opening WhatsApp...';
                if (btnIcon) {
                    btnIcon.setAttribute('data-lucide', 'check-circle');
                    lucide.createIcons();
                }

                // Redirect to WhatsApp
                setTimeout(() => {
                    window.open(waUrl, '_blank');

                    // Reset form and button
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.style.background = ''; // Reverts to default CSS definitions
                    submitBtn.style.color = '';
                    submitBtn.style.borderColor = '';
                    btnSpan.textContent = 'Send Message';
                    if (btnIcon) {
                        btnIcon.setAttribute('data-lucide', 'send');
                        lucide.createIcons();
                    }
                }, 1200);
            }
        });
    }

    // ==========================================================================
    // Back to Top and Floating Widgets Toggle
    // ==========================================================================
    const backToTopBtn = document.getElementById('backToTopBtn');
    const whatsappFloat = document.getElementById('whatsappFloat');

    window.addEventListener('scroll', () => {
        // Toggle visibility
        if (window.scrollY > 400) {
            if (backToTopBtn) backToTopBtn.style.opacity = '1';
            if (backToTopBtn) backToTopBtn.style.pointerEvents = 'auto';
        } else {
            if (backToTopBtn) backToTopBtn.style.opacity = '0';
            if (backToTopBtn) backToTopBtn.style.pointerEvents = 'none';
        }
    });

    if (backToTopBtn) {
        // Initial setup
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.pointerEvents = 'none';
        backToTopBtn.style.transition = 'opacity 0.3s ease';

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================================================
    // Mock Resume Download Alert / Action
    // ==========================================================================
    const downloadResumeBtn = document.getElementById('downloadResume');
    if (downloadResumeBtn) {
        downloadResumeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Create a temporary modern glassmorphic toast notification
            const toast = document.createElement('div');
            toast.className = 'toast-notification';
            toast.innerHTML = `
                <div class="toast-content">
                    <i data-lucide="info" class="toast-icon"></i>
                    <div>
                        <h4>Resume Download</h4>
                        <p>Simulating resume PDF download (Placeholder link)</p>
                    </div>
                </div>
            `;
            document.body.appendChild(toast);
            lucide.createIcons();

            // Style toast in JS or CSS (CSS is already loaded, but let's add quick style rules)
            toast.style.position = 'fixed';
            toast.style.bottom = '110px';
            toast.style.right = '30px';
            toast.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            toast.style.border = '1px solid var(--color-quaternary)';
            toast.style.borderRadius = '12px';
            toast.style.padding = '16px 24px';
            toast.style.boxShadow = '0 10px 30px rgba(197, 186, 255, 0.25)';
            toast.style.backdropFilter = 'blur(10px)';
            toast.style.zIndex = '1000';
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            toast.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            
            // Trigger animation
            setTimeout(() => {
                toast.style.opacity = '1';
                toast.style.transform = 'translateY(0)';
            }, 50);

            // Remove toast after 4 seconds
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    toast.remove();
                }, 500);
            }, 4000);
        });
    }

    // ==========================================================================
    // Skills Section Dynamic Grid, Custom Animations, and See All Toggle
    // ==========================================================================
    function animateProgressAndCounter(card) {
        // 1. Animate progress bar fill
        const fill = card.querySelector('.progress-fill');
        if (fill) {
            const percent = fill.getAttribute('data-percent');
            fill.style.width = `${percent}%`;
        }

        // 2. Animate count-up percentage value
        const percentVal = card.querySelector('.skill-percentage-val');
        if (percentVal && !percentVal.classList.contains('counter-animated')) {
            percentVal.classList.add('counter-animated');
            const target = parseInt(percentVal.getAttribute('data-target'), 10);
            let current = 0;
            const duration = 1200; // Match CSS transitions
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Cubic ease-out
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                current = Math.floor(easeProgress * target);
                percentVal.textContent = `${current}%`;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    percentVal.textContent = `${target}%`;
                }
            }
            requestAnimationFrame(updateCounter);
        }
    }

    function initSkillsSection() {
        const grid = document.getElementById('skillsGrid');
        const container = document.querySelector('.skills-grid-container');
        const btn = document.getElementById('btnSeeAll');
        if (!grid || !container || !btn) return;

        let isExpanded = false;
        let resizeTimeout = null;

        // Card mouse movement glow effect
        const setupCardGlows = () => {
            const cards = grid.querySelectorAll('.skill-card');
            cards.forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    card.style.setProperty('--mouse-x', `${x}px`);
                    card.style.setProperty('--mouse-y', `${y}px`);
                });
            });
        };

        // Determine which cards fall into row 3 or below
        const getRow3StartIndex = (cards) => {
            if (cards.length === 0) return 0;
            const firstTop = cards[0].offsetTop;
            let secondTop = -1;
            
            for (let i = 0; i < cards.length; i++) {
                const top = cards[i].offsetTop;
                if (top > firstTop) {
                    if (secondTop === -1) {
                        secondTop = top;
                    } else if (top > secondTop) {
                        return i; // First card of row 3
                    }
                }
            }
            return cards.length; // No row 3 exists
        };

        // Recalculate layout heights based on visibility state
        const updateSkillsVisibility = (collapseOnly = false) => {
            const cards = Array.from(grid.querySelectorAll('.skill-card'));
            if (cards.length === 0) return;

            // Reset container height & remove classes to perform clean offset checks
            container.style.maxHeight = '';
            cards.forEach(card => {
                card.style.transition = 'none';
                card.classList.remove('skill-card-hidden');
            });

            // Force browser reflow to read correct offsetTops
            grid.offsetHeight;

            const row3StartIndex = getRow3StartIndex(cards);

            // Re-enable transitions
            cards.forEach(card => {
                card.style.transition = '';
            });

            if (!isExpanded || collapseOnly) {
                // Collapsed state: Hide row 3+ cards
                for (let i = row3StartIndex; i < cards.length; i++) {
                    cards[i].classList.add('skill-card-hidden');
                }

                // Compute exact height for the first 2 rows
                const lastVisibleIndex = Math.min(row3StartIndex - 1, cards.length - 1);
                const lastVisibleCard = cards[lastVisibleIndex];
                const gridRect = grid.getBoundingClientRect();
                const cardRect = lastVisibleCard.getBoundingClientRect();
                const collapsedHeight = (cardRect.bottom - gridRect.top) + 6; // slightly pad

                container.style.maxHeight = `${collapsedHeight}px`;
                isExpanded = false;
                btn.classList.remove('active');
                btn.querySelector('span').textContent = 'See All Skills';
                container.classList.remove('expanded');
            } else {
                // Expanded state: Set height to fit everything
                container.style.maxHeight = `${grid.scrollHeight + 10}px`;
                container.classList.add('expanded');
                btn.classList.add('active');
                btn.querySelector('span').textContent = 'Show Less';

                // Stagger reveal animation for hidden cards
                let delay = 0;
                cards.forEach((card, index) => {
                    if (index >= row3StartIndex) {
                        setTimeout(() => {
                            if (isExpanded) {
                                card.classList.remove('skill-card-hidden');
                                card.classList.add('reveal-visible');
                                animateProgressAndCounter(card);
                            }
                        }, delay);
                        delay += 120; // Stagger delay
                    }
                });
            }
        };

        // Set up event listeners
        btn.addEventListener('click', () => {
            isExpanded = !isExpanded;
            updateSkillsVisibility();
        });

        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                updateSkillsVisibility();
            }, 150);
        });

        // Initialize state
        setupCardGlows();
        // Slightly delay initial calculation to ensure DOM is fully rendered
        setTimeout(() => {
            updateSkillsVisibility(true);
        }, 100);
    }

    // Initialize Skills Section
    initSkillsSection();
});
