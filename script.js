// Wizard Travel Club Quiz and Website Functionality
class WizardTravelClub {
    constructor() {
        this.currentQuestion = 0;
        this.answers = [];
        this.userArchetype = null;
        this.currentCommunity = null;
        this.currentSort = 'hot';
        this.posts = [];
        this.communities = {};
        this.currentUser = null;
        this.isAuthenticated = false;
        this.tripPackages = [];
        this.bookings = [];
        this.currentPackage = null;
        
        // Initialize the application
        this.initializeApplication();
    }

    async initializeApplication() {
        // Initialize quiz data first
        await this.initializeQuiz();
        
        // Bind all events
        this.bindEvents();
        
        // Initialize authentication
        this.initializeAuthentication();
        
        // Initialize travel agent features
        this.initializeTravelAgentFeatures();
        
        // Check if user should see quiz or main website
        this.checkFirstVisit();
        
        console.log('Wizard Travel Club initialized successfully!');
    }

    async initializeQuiz() {
        return new Promise((resolve) => {
            // Quiz data is already loaded in global scope from quiz-data.js
            if (typeof quizData !== 'undefined' && typeof archetypeInfo !== 'undefined') {
                this.quizData = quizData;
                this.archetypeInfo = archetypeInfo;
                
                // Set total questions
                const totalQuestionsElement = document.getElementById('total-questions');
                if (totalQuestionsElement) {
                    totalQuestionsElement.textContent = this.quizData.questions.length;
                }
                
                // Initialize communities
                this.initializeCommunities();
                
                console.log('Quiz data loaded successfully:', this.quizData.questions.length, 'questions');
                resolve();
            } else {
                console.error('Quiz data not found in global scope, using fallback data');
                // Fallback: use inline data
                this.loadFallbackData();
                resolve();
            }
        });
    }

    loadFallbackData() {
        // Fallback quiz data if external file fails to load
        this.quizData = {
            "archetypes": ["Pathfinder", "Connector", "Time Traveler", "Hedonist", "Digital Drifter", "Culture Hacker", "Escape Artist", "Luxe Nomad", "Local Whisperer", "Chaos Pilot", "Spiritual Nomad", "Builder"],
            "questions": [
                {
                    "id": 1,
                    "question": "What's your ideal first day in a new country?",
                    "options": [
                        { "text": "Wake up early, hike to a hidden spot", "archetype": "Pathfinder" },
                        { "text": "Find a street food vendor and chat with locals", "archetype": "Connector" },
                        { "text": "Take a guided tour through the old town and museums", "archetype": "Time Traveler" },
                        { "text": "Check into a luxury stay, order room service", "archetype": "Luxe Nomad" }
                    ]
                }
                // Add more questions as needed
            ]
        };
        
        this.archetypeInfo = {
            "Pathfinder": {
                description: "You seek adventure, discovery, and the road less traveled.",
                benefits: ["Exclusive access to off-the-beaten-path destinations", "Adventure travel packages"]
            }
            // Add more archetype info as needed
        };
        
        // Initialize communities even with fallback data
        this.initializeCommunities();
    }

    checkFirstVisit() {
        // If user is authenticated, check their profile
        if (this.isAuthenticated && this.currentUser) {
            if (this.currentUser.archetype) {
                this.userArchetype = this.currentUser.archetype;
                this.showMainWebsite();
            } else {
                this.showQuiz();
            }
        } else {
            // Check for anonymous quiz completion
            const hasCompletedQuiz = localStorage.getItem('wizard_quiz_completed');
            const userArchetype = localStorage.getItem('wizard_user_archetype');
            
            if (hasCompletedQuiz && userArchetype) {
                this.userArchetype = userArchetype;
                this.showMainWebsite();
            } else {
                this.showQuiz();
            }
        }
    }

    showQuiz() {
        document.getElementById('quiz-overlay').style.display = 'flex';
        document.getElementById('main-website').classList.add('hidden');
    }

    showMainWebsite() {
        document.getElementById('quiz-overlay').style.display = 'none';
        document.getElementById('main-website').classList.remove('hidden');
        
        // Display user archetype in navigation
        if (this.userArchetype) {
            const userArchetypeDisplay = document.getElementById('user-archetype-display');
            if (userArchetypeDisplay) {
                userArchetypeDisplay.textContent = this.userArchetype;
            }
        }
        
        // Initialize main website functionality
        this.initializeMainWebsite();
        
        // Initialize community section
        this.initializeCommunitySection();
    }

    bindEvents() {
        console.log('Binding events...');
        
        // Quiz start button
        const startQuizBtn = document.getElementById('start-quiz-btn');
        console.log('Start quiz button found:', startQuizBtn);
        if (startQuizBtn) {
            startQuizBtn.addEventListener('click', () => {
                console.log('Start quiz button clicked');
                this.showQuizQuestions();
            });
            console.log('Start quiz button event listener attached');
        } else {
            console.error('Start quiz button not found!');
        }

        // Quiz navigation
        const prevQuestionBtn = document.getElementById('prev-question');
        if (prevQuestionBtn) {
            prevQuestionBtn.addEventListener('click', () => {
                this.previousQuestion();
            });
        }

        const nextQuestionBtn = document.getElementById('next-question');
        if (nextQuestionBtn) {
            nextQuestionBtn.addEventListener('click', () => {
                this.nextQuestion();
            });
        }

        // Enter site button
        const enterSiteBtn = document.getElementById('enter-site-btn');
        if (enterSiteBtn) {
            enterSiteBtn.addEventListener('click', () => {
                this.completeQuiz();
            });
        }
        
        console.log('All events bound successfully');
    }

    showQuizQuestions() {
        console.log('Showing quiz questions');
        this.showScreen('quiz-questions');
        this.displayQuestion();
    }

    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.quiz-screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
    }

    displayQuestion() {
        if (!this.quizData || !this.quizData.questions[this.currentQuestion]) {
            console.error('Quiz data not loaded');
            return;
        }

        const question = this.quizData.questions[this.currentQuestion];
        
        // Update question text
        const questionTextElement = document.getElementById('question-text');
        if (questionTextElement) {
            questionTextElement.textContent = question.question;
        }
        
        // Update progress
        const currentQuestionNumElement = document.getElementById('current-question-num');
        if (currentQuestionNumElement) {
            currentQuestionNumElement.textContent = this.currentQuestion + 1;
        }
        
        const progressFillElement = document.getElementById('quiz-progress-fill');
        if (progressFillElement) {
            const progress = ((this.currentQuestion + 1) / this.quizData.questions.length) * 100;
            progressFillElement.style.width = `${progress}%`;
        }
        
        // Display options
        const optionsContainer = document.getElementById('options-container');
        if (optionsContainer) {
            optionsContainer.innerHTML = '';
            
            question.options.forEach((option, index) => {
                const optionElement = document.createElement('div');
                optionElement.className = 'quiz-option';
                optionElement.textContent = option.text;
                
                // Check if this option was previously selected
                if (this.answers[this.currentQuestion] && 
                    this.answers[this.currentQuestion].selected_option_text === option.text) {
                    optionElement.classList.add('selected');
                }
                
                optionElement.addEventListener('click', () => this.selectOption(option, optionElement));
                optionsContainer.appendChild(optionElement);
            });
        }
        
        // Update navigation buttons
        this.updateNavigationButtons();
    }

    selectOption(option, element) {
        // Remove selection from all options
        document.querySelectorAll('.quiz-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Select clicked option
        element.classList.add('selected');
        
        // Store answer
        this.answers[this.currentQuestion] = {
            question_id: this.quizData.questions[this.currentQuestion].id,
            selected_option_text: option.text
        };
        
        // Enable next button
        const nextBtn = document.getElementById('next-question');
        if (nextBtn) {
            nextBtn.disabled = false;
        }
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-question');
        const nextBtn = document.getElementById('next-question');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentQuestion === 0;
        }
        
        if (nextBtn) {
            nextBtn.disabled = !this.answers[this.currentQuestion];
            
            if (this.currentQuestion === this.quizData.questions.length - 1) {
                nextBtn.textContent = 'See Results';
            } else {
                nextBtn.textContent = 'Next';
            }
        }
    }

    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.displayQuestion();
        }
    }

    nextQuestion() {
        if (this.currentQuestion < this.quizData.questions.length - 1) {
            this.currentQuestion++;
            this.displayQuestion();
        } else {
            this.showResults();
        }
    }

    showResults() {
        const result = this.analyzeArchetype();
        this.displayResults(result);
        this.showScreen('quiz-results');
    }

    analyzeArchetype() {
        // Count archetype selections
        const archetypeCounts = {};
        
        this.answers.forEach(answer => {
            const question = this.quizData.questions.find(q => q.id === answer.question_id);
            if (question) {
                const option = question.options.find(opt => opt.text === answer.selected_option_text);
                if (option) {
                    archetypeCounts[option.archetype] = (archetypeCounts[option.archetype] || 0) + 1;
                }
            }
        });

        // Find archetype(s) with highest count
        const maxCount = Math.max(...Object.values(archetypeCounts));
        const primaryArchetypes = Object.keys(archetypeCounts).filter(
            archetype => archetypeCounts[archetype] === maxCount
        );

        return {
            result: primaryArchetypes,
            description: primaryArchetypes.map(archetype => 
                this.archetypeInfo[archetype]?.description || "Your unique travel personality"
            )
        };
    }

    displayResults(result) {
        const resultContainer = document.getElementById('archetype-result');
        const benefitsContainer = document.getElementById('archetype-benefits-list');
        
        if (resultContainer) {
            resultContainer.innerHTML = '';
        }
        
        if (benefitsContainer) {
            benefitsContainer.innerHTML = '';
        }
        
        result.result.forEach((archetype, index) => {
            // Display archetype name and description
            if (resultContainer) {
                const archetypeElement = document.createElement('div');
                archetypeElement.className = 'archetype-result';
                archetypeElement.innerHTML = `
                    <div class="archetype-name">${archetype}</div>
                    <div class="archetype-description">${result.description[index]}</div>
                `;
                resultContainer.appendChild(archetypeElement);
            }
            
            // Display benefits
            if (benefitsContainer) {
                const archetypeBenefits = this.archetypeInfo[archetype]?.benefits || [];
                archetypeBenefits.forEach(benefit => {
                    const benefitElement = document.createElement('div');
                    benefitElement.className = 'benefit-item';
                    benefitElement.innerHTML = `
                        <div class="benefit-icon">
                            <i class="fas fa-star"></i>
                        </div>
                        <div class="benefit-text">${benefit}</div>
                    `;
                    benefitsContainer.appendChild(benefitElement);
                });
            }
        });
        
        // Store the primary archetype
        this.userArchetype = result.result[0];
    }

    completeQuiz() {
        // Store quiz completion and user archetype
        localStorage.setItem('wizard_quiz_completed', 'true');
        localStorage.setItem('wizard_user_archetype', this.userArchetype);
        
        // If user is authenticated, save archetype to their profile
        if (this.isAuthenticated && this.currentUser) {
            this.currentUser.archetype = this.userArchetype;
            localStorage.setItem('wizard_user', JSON.stringify(this.currentUser));
            
            // Update user in users array
            const users = JSON.parse(localStorage.getItem('wizard_users') || '[]');
            const userIndex = users.findIndex(u => u.id === this.currentUser.id);
            if (userIndex !== -1) {
                users[userIndex] = this.currentUser;
                localStorage.setItem('wizard_users', JSON.stringify(users));
            }
            
            // Update UI
            this.updateAuthUI();
        }
        
        // Show main website
        this.showMainWebsite();
        
        // Show welcome message
        this.showWelcomeMessage();
    }

    showWelcomeMessage() {
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'welcome-message';
        welcomeMessage.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(39, 174, 96, 0.3);
            z-index: 10000;
            font-size: 14px;
            max-width: 300px;
        `;
        
        welcomeMessage.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">Welcome to Wizard Travel Club!</div>
            <div>Your archetype: <strong>${this.userArchetype}</strong></div>
            <div style="font-size: 12px; margin-top: 5px;">We'll personalize your experience based on your travel style.</div>
        `;
        
        document.body.appendChild(welcomeMessage);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (welcomeMessage.parentElement) {
                welcomeMessage.remove();
            }
        }, 5000);
    }

    initializeMainWebsite() {
        // Add smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add interactive features
        this.addInteractiveFeatures();
        
        // Display trip packages for travelers
        this.displayTripPackagesForTravelers();
    }

    addInteractiveFeatures() {
        // Add scroll animations
        this.addScrollAnimations();
        
        // Add floating action button
        this.addFloatingActionButton();
        
        // Add scroll to top button
        this.addScrollToTopButton();
        
        // Add parallax effects
        this.addParallaxEffects();
        
        // Add interactive cards
        this.addInteractiveCards();
        
        // Add loading animations
        this.addLoadingAnimations();
        
        // Add mobile menu functionality
        this.addMobileMenu();
        
        // Add newsletter form handling
        this.addNewsletterForm();
        
        // Add navbar scroll effects
        this.addNavbarScrollEffects();

        // Add dropdown interactions
        this.addDropdownInteractions();

        // Add smooth scrolling
        this.addSmoothScrolling();

        // Add typing effect
        this.addTypingEffect();
    }

    addScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all sections for animation
        document.querySelectorAll('section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });

        // Observe cards for staggered animation
        document.querySelectorAll('.benefit-card, .destination-card, .testimonial-card').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(card);
        });
    }

    addFloatingActionButton() {
        const fab = document.createElement('div');
        fab.className = 'floating-action-button';
        fab.innerHTML = '<i class="fas fa-comments"></i>';
        fab.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
            z-index: 1000;
        `;

        fab.addEventListener('click', () => {
            this.showSuccessMessage('Chat feature coming soon! 💬');
        });

        document.body.appendChild(fab);
    }

    addScrollToTopButton() {
        const scrollTopBtn = document.createElement('div');
        scrollTopBtn.className = 'scroll-to-top';
        scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollTopBtn.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: rgba(44, 62, 80, 0.8);
            color: white;
            border-radius: 50%;
            display: none;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 1000;
        `;

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Show/hide scroll to top button
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollTopBtn.style.display = 'flex';
            } else {
                scrollTopBtn.style.display = 'none';
            }
        });

        document.body.appendChild(scrollTopBtn);
    }

    addParallaxEffects() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hero-background, .benefit-image img, .destination-image img');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    addInteractiveCards() {
        // Add hover effects to cards
        document.querySelectorAll('.benefit-card, .destination-card, .testimonial-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Add click effects to buttons
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', function(e) {
                // Create ripple effect
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    addLoadingAnimations() {
        // Add loading animation for images
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('load', () => {
                img.style.opacity = '1';
                img.style.transform = 'scale(1)';
            });
            
            img.style.opacity = '0';
            img.style.transform = 'scale(0.9)';
            img.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });

        // Add skeleton loading for content
        this.addSkeletonLoading();
    }

    addSkeletonLoading() {
        const skeletonElements = document.querySelectorAll('.benefit-card, .destination-card, .testimonial-card');
        
        skeletonElements.forEach(element => {
            element.style.position = 'relative';
            element.style.overflow = 'hidden';
            
            const skeleton = document.createElement('div');
            skeleton.className = 'skeleton';
            skeleton.style.cssText = `
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                animation: skeleton-loading 1.5s infinite;
            `;
            
            element.appendChild(skeleton);
            
            // Remove skeleton after content loads
            setTimeout(() => {
                skeleton.remove();
            }, 2000);
        });
    }

    addMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
                
                // Animate hamburger lines
                const spans = hamburger.querySelectorAll('span');
                spans.forEach((span, index) => {
                    if (hamburger.classList.contains('active')) {
                        if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                        if (index === 1) span.style.opacity = '0';
                        if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                    } else {
                        span.style.transform = 'none';
                        span.style.opacity = '1';
                    }
                });
            });

            // Close menu when clicking on a link
            navMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }
    }

    addNewsletterForm() {
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = newsletterForm.querySelector('input[type="email"]').value;
                const button = newsletterForm.querySelector('button');
                
                // Animate button
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
                button.disabled = true;
                
                // Simulate API call
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
                    newsletterForm.querySelector('input[type="email"]').value = '';
                    
                    setTimeout(() => {
                        button.innerHTML = 'SUBSCRIBE';
                        button.disabled = false;
                    }, 2000);
                }, 1500);
            });
        }
    }

    addNavbarScrollEffects() {
        const navbar = document.querySelector('.navbar');
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            
            // Change navbar background on scroll
            if (scrollTop > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.backdropFilter = 'blur(10px)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            }
            
            // Hide/show navbar on scroll
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
    }

    displayTripPackagesForTravelers() {
        const packagesGrid = document.getElementById('trip-packages-grid');
        if (!packagesGrid) return;

        // Show only active packages to travelers
        const activePackages = this.tripPackages.filter(pkg => pkg.status === 'active');

        packagesGrid.innerHTML = activePackages.map(pkg => `
            <div class="trip-package-card">
                <div class="package-image">
                    <img src="${pkg.image}" alt="${pkg.title}">
                    <div class="package-badge">${pkg.status}</div>
                </div>
                <div class="package-content">
                    <div class="package-header">
                        <div>
                            <div class="package-title">${pkg.title}</div>
                            <div class="package-destination">${pkg.destination}</div>
                        </div>
                        <div class="package-price">$${pkg.price.toLocaleString()}</div>
                    </div>
                    <div class="package-dates">
                        <i class="fas fa-calendar"></i> ${this.formatDate(pkg.startDate)} - ${this.formatDate(pkg.endDate)}
                    </div>
                    <div class="package-description">${pkg.description}</div>
                    <div class="package-meta">
                        <div class="package-agent">
                            <div class="agent-avatar">
                                <i class="fas fa-user"></i>
                            </div>
                            <span>${pkg.agent}</span>
                        </div>
                        <div class="package-capacity">
                            <i class="fas fa-users"></i> ${pkg.booked}/${pkg.capacity} booked
                        </div>
                    </div>
                    <div class="package-actions">
                        <a href="#" class="btn-view-package" onclick="wizardApp.viewPackageDetails(${pkg.id}); return false;">
                            View Details
                        </a>
                        <a href="#" class="btn-book-now" onclick="wizardApp.viewPackageDetails(${pkg.id}); return false;">
                            Book Now
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    }

    deletePackage(packageId) {
        if (confirm('Are you sure you want to delete this package? This action cannot be undone.')) {
            // Remove package from array
            this.tripPackages = this.tripPackages.filter(pkg => pkg.id !== packageId);
            
            // Update display
            this.displayTripPackages();
            this.updateAgentDashboard();
            
            this.showSuccessMessage('Package deleted successfully!');
        }
    }

    showAllPackages() {
        // This could open a modal or navigate to a dedicated packages page
        this.showSuccessMessage('All packages view coming soon!');
    }

    initializeCommunities() {
        this.communities = {
            "Pathfinder": {
                name: "Pathfinders",
                description: "Adventure seekers and off-the-beaten-path explorers",
                icon: "fas fa-mountain",
                color: "#e67e22",
                members: 1247,
                posts: []
            },
            "Connector": {
                name: "Connectors",
                description: "Social butterflies who build relationships through travel",
                icon: "fas fa-users",
                color: "#3498db",
                members: 2156,
                posts: []
            },
            "Time Traveler": {
                name: "Time Travelers",
                description: "History buffs and cultural heritage enthusiasts",
                icon: "fas fa-landmark",
                color: "#9b59b6",
                members: 892,
                posts: []
            },
            "Hedonist": {
                name: "Hedonists",
                description: "Luxury seekers and pleasure travelers",
                icon: "fas fa-champagne-glasses",
                color: "#f1c40f",
                members: 1567,
                posts: []
            },
            "Digital Drifter": {
                name: "Digital Drifters",
                description: "Remote workers and digital nomads",
                icon: "fas fa-laptop",
                color: "#1abc9c",
                members: 3421,
                posts: []
            },
            "Culture Hacker": {
                name: "Culture Hackers",
                description: "Language learners and cultural immersion seekers",
                icon: "fas fa-language",
                color: "#e74c3c",
                members: 1134,
                posts: []
            },
            "Escape Artist": {
                name: "Escape Artists",
                description: "Solitude seekers and digital detox enthusiasts",
                icon: "fas fa-tree",
                color: "#34495e",
                members: 678,
                posts: []
            },
            "Luxe Nomad": {
                name: "Luxe Nomads",
                description: "High-end travelers and luxury experience seekers",
                icon: "fas fa-crown",
                color: "#f39c12",
                members: 945,
                posts: []
            },
            "Local Whisperer": {
                name: "Local Whisperers",
                description: "Insider experts and local experience finders",
                icon: "fas fa-map-marker-alt",
                color: "#27ae60",
                members: 1834,
                posts: []
            },
            "Chaos Pilot": {
                name: "Chaos Pilots",
                description: "Spontaneous adventurers and thrill seekers",
                icon: "fas fa-random",
                color: "#8e44ad",
                members: 1123,
                posts: []
            },
            "Spiritual Nomad": {
                name: "Spiritual Nomads",
                description: "Mindfulness seekers and spiritual travelers",
                icon: "fas fa-om",
                color: "#16a085",
                members: 756,
                posts: []
            },
            "Builder": {
                name: "Builders",
                description: "Impact travelers and community builders",
                icon: "fas fa-hammer",
                color: "#d35400",
                members: 567,
                posts: []
            }
        };
        
        // Generate sample posts for each community
        this.generateSamplePosts();
    }

    generateSamplePosts() {
        const samplePosts = [
            {
                title: "Just discovered an amazing hidden waterfall in Bali!",
                content: "After 3 hours of hiking through the jungle, we found this incredible waterfall that's not on any tourist maps. The locals call it 'Air Terjun Rahasia' (Secret Waterfall). Totally worth the trek!",
                author: "AdventureSarah",
                community: "Pathfinder",
                tags: ["bali", "waterfall", "hiking", "hidden-gems"],
                likes: 47,
                comments: 12,
                timestamp: Date.now() - 3600000, // 1 hour ago
                liked: false
            },
            {
                title: "Made friends with a local family in Morocco",
                content: "They invited us for tea and we ended up spending the entire evening together. The hospitality was incredible! They even taught us how to make traditional mint tea. This is why I travel - for these genuine human connections.",
                author: "SocialButterfly",
                community: "Connector",
                tags: ["morocco", "local-experience", "hospitality", "friendship"],
                likes: 89,
                comments: 23,
                timestamp: Date.now() - 7200000, // 2 hours ago
                liked: true
            },
            {
                title: "Visited the ancient ruins of Petra today",
                content: "Walking through the Siq and seeing the Treasury emerge was absolutely magical. The history here is palpable. I spent hours just sitting and imagining what life was like here 2000 years ago.",
                author: "HistoryBuff",
                community: "Time Traveler",
                tags: ["jordan", "petra", "ancient-ruins", "history"],
                likes: 156,
                comments: 34,
                timestamp: Date.now() - 10800000, // 3 hours ago
                liked: false
            },
            {
                title: "Best spa experience in Thailand",
                content: "Just had a 4-hour luxury spa treatment at the Banyan Tree in Bangkok. The hot stone massage was divine, and the infinity pool overlooking the city was the perfect way to end the day.",
                author: "LuxuryLover",
                community: "Hedonist",
                tags: ["thailand", "spa", "luxury", "bangkok"],
                likes: 67,
                comments: 15,
                timestamp: Date.now() - 14400000, // 4 hours ago
                liked: false
            },
            {
                title: "Working from a beachfront cafe in Bali",
                content: "Got my laptop, got my coffee, got the ocean view. This is the digital nomad life! The wifi is surprisingly good here. Anyone else working remotely from paradise?",
                author: "DigitalNomad",
                community: "Digital Drifter",
                tags: ["bali", "remote-work", "digital-nomad", "beach"],
                likes: 234,
                comments: 45,
                timestamp: Date.now() - 18000000, // 5 hours ago
                liked: true
            },
            {
                title: "Learning Spanish through immersion",
                content: "After 2 weeks of living with a local family in Mexico, my Spanish has improved dramatically! Nothing beats learning a language in its natural environment.",
                author: "CultureLearner",
                community: "Culture Hacker",
                tags: ["mexico", "spanish", "language-learning", "immersion"],
                likes: 123,
                comments: 28,
                timestamp: Date.now() - 21600000, // 6 hours ago
                liked: false
            },
            {
                title: "Found complete solitude in the Scottish Highlands",
                content: "No phone signal, no internet, just me and the mountains. This is exactly what I needed to recharge. Sometimes you need to disconnect to reconnect with yourself.",
                author: "SolitudeSeeker",
                community: "Escape Artist",
                tags: ["scotland", "highlands", "solitude", "disconnect"],
                likes: 78,
                comments: 19,
                timestamp: Date.now() - 25200000, // 7 hours ago
                liked: false
            },
            {
                title: "Private helicopter tour over the Grand Canyon",
                content: "Absolutely breathtaking experience! The views were incredible and the service was impeccable. This is how luxury travel should be done.",
                author: "LuxuryTraveler",
                community: "Luxe Nomad",
                tags: ["usa", "grand-canyon", "helicopter", "luxury"],
                likes: 145,
                comments: 31,
                timestamp: Date.now() - 28800000, // 8 hours ago
                liked: false
            },
            {
                title: "Local fisherman took us to his secret fishing spot",
                content: "We met this amazing local fisherman who invited us to his favorite fishing spot. Caught the freshest fish I've ever tasted and learned so much about local fishing techniques.",
                author: "LocalExplorer",
                community: "Local Whisperer",
                tags: ["fishing", "local-experience", "seafood", "authentic"],
                likes: 92,
                comments: 21,
                timestamp: Date.now() - 32400000, // 9 hours ago
                liked: true
            },
            {
                title: "Booked a one-way ticket to nowhere",
                content: "Just bought a one-way ticket to a random destination. No plan, no expectations, just pure adventure. Let's see where life takes me!",
                author: "ChaosPilot",
                community: "Chaos Pilot",
                tags: ["adventure", "spontaneous", "one-way-ticket", "unknown"],
                likes: 167,
                comments: 38,
                timestamp: Date.now() - 36000000, // 10 hours ago
                liked: false
            },
            {
                title: "Meditation retreat in the Himalayas",
                content: "Spent 10 days in complete silence at a Buddhist monastery. The spiritual awakening I experienced here was profound. Sometimes you need to go to the mountains to find yourself.",
                author: "SpiritualSeeker",
                community: "Spiritual Nomad",
                tags: ["himalayas", "meditation", "spiritual", "retreat"],
                likes: 198,
                comments: 42,
                timestamp: Date.now() - 39600000, // 11 hours ago
                liked: false
            },
            {
                title: "Building a school in rural Nepal",
                content: "Spent 3 weeks helping build a school in a remote village. The gratitude from the children and community was overwhelming. This is what meaningful travel is all about.",
                author: "ImpactBuilder",
                community: "Builder",
                tags: ["nepal", "volunteering", "school-building", "impact"],
                likes: 289,
                comments: 56,
                timestamp: Date.now() - 43200000, // 12 hours ago
                liked: true
            }
        ];
        
        // Distribute posts to communities
        samplePosts.forEach(post => {
            if (this.communities[post.community]) {
                this.communities[post.community].posts.push(post);
            }
        });
        
        // Combine all posts for the main feed
        this.posts = samplePosts;
    }

    // Community functionality methods
    initializeCommunitySection() {
        if (!this.userArchetype) return;
        
        // Update user profile in community section
        this.updateCommunityProfile();
        
        // Populate communities
        this.populateCommunities();
        
        // Load posts
        this.loadPosts();
        
        // Bind community events
        this.bindCommunityEvents();
    }

    updateCommunityProfile() {
        const userNameElement = document.getElementById('community-user-name');
        const archetypeElement = document.getElementById('community-user-archetype');
        
        if (userNameElement) {
            userNameElement.textContent = `Traveler_${Math.floor(Math.random() * 1000)}`;
        }
        
        if (archetypeElement) {
            archetypeElement.textContent = this.userArchetype;
        }
    }

    populateCommunities() {
        const userCommunitiesContainer = document.getElementById('user-communities');
        const discoverCommunitiesContainer = document.getElementById('discover-communities');
        
        if (!userCommunitiesContainer || !discoverCommunitiesContainer) return;
        
        userCommunitiesContainer.innerHTML = '';
        discoverCommunitiesContainer.innerHTML = '';
        
        Object.entries(this.communities).forEach(([archetype, community]) => {
            const communityElement = this.createCommunityElement(archetype, community);
            
            if (archetype === this.userArchetype) {
                communityElement.classList.add('active');
                userCommunitiesContainer.appendChild(communityElement);
            } else {
                discoverCommunitiesContainer.appendChild(communityElement);
            }
        });
    }

    createCommunityElement(archetype, community) {
        const element = document.createElement('div');
        element.className = `community-item community-${archetype.toLowerCase().replace(' ', '')}`;
        element.innerHTML = `
            <div class="community-icon">
                <i class="${community.icon}"></i>
            </div>
            <div class="community-info">
                <div class="community-name">${community.name}</div>
                <div class="community-count">${community.members} members</div>
            </div>
        `;
        
        element.addEventListener('click', () => {
            this.selectCommunity(archetype);
        });
        
        return element;
    }

    selectCommunity(archetype) {
        // Update active state
        document.querySelectorAll('.community-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const selectedElement = document.querySelector(`.community-${archetype.toLowerCase().replace(' ', '')}`);
        if (selectedElement) {
            selectedElement.classList.add('active');
        }
        
        this.currentCommunity = archetype;
        this.loadPosts();
    }

    loadPosts() {
        const postsContainer = document.getElementById('posts-container');
        if (!postsContainer) return;
        
        let postsToShow = this.posts;
        
        // Filter by community if one is selected
        if (this.currentCommunity) {
            postsToShow = this.communities[this.currentCommunity].posts;
        }
        
        // Sort posts
        postsToShow = this.sortPosts(postsToShow, this.currentSort);
        
        // Display posts
        this.displayPosts(postsToShow);
    }

    sortPosts(posts, sortType) {
        const sortedPosts = [...posts];
        
        switch (sortType) {
            case 'hot':
                return sortedPosts.sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments));
            case 'new':
                return sortedPosts.sort((a, b) => b.timestamp - a.timestamp);
            case 'top':
                return sortedPosts.sort((a, b) => b.likes - a.likes);
            default:
                return sortedPosts;
        }
    }

    displayPosts(posts) {
        const postsContainer = document.getElementById('posts-container');
        if (!postsContainer) return;
        
        if (posts.length === 0) {
            postsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-comments"></i>
                    <h3>No posts yet</h3>
                    <p>Be the first to share your travel story!</p>
                    <button class="btn-primary" onclick="document.getElementById('create-post-btn').click()">
                        Create First Post
                    </button>
                </div>
            `;
            return;
        }
        
        postsContainer.innerHTML = posts.map(post => this.createPostElement(post)).join('');
    }

    createPostElement(post) {
        const timeAgo = this.getTimeAgo(post.timestamp);
        
        return `
            <div class="post" data-post-id="${post.title}">
                <div class="post-header">
                    <div class="post-meta">
                        <span class="post-author">${post.author}</span>
                        <span class="post-community">r/${this.communities[post.community].name}</span>
                    </div>
                    <span class="post-time">${timeAgo}</span>
                </div>
                <div class="post-content">
                    <div class="post-title">${post.title}</div>
                    <div class="post-text">${post.content}</div>
                </div>
                <div class="post-actions">
                    <div class="post-action ${post.liked ? 'liked' : ''}" onclick="window.wizardApp.toggleLike('${post.title}')">
                        <i class="fas fa-heart"></i>
                        <span>${post.likes}</span>
                    </div>
                    <div class="post-action">
                        <i class="fas fa-comment"></i>
                        <span>${post.comments}</span>
                    </div>
                    <div class="post-action">
                        <i class="fas fa-share"></i>
                        <span>Share</span>
                    </div>
                </div>
            </div>
        `;
    }

    getTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    }

    toggleLike(postTitle) {
        const post = this.posts.find(p => p.title === postTitle);
        if (post) {
            post.liked = !post.liked;
            post.likes += post.liked ? 1 : -1;
            this.loadPosts(); // Refresh display
        }
    }

    bindCommunityEvents() {
        // Sort buttons
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentSort = btn.dataset.sort;
                this.loadPosts();
            });
        });
        
        // Create post button
        const createPostBtn = document.getElementById('create-post-btn');
        if (createPostBtn) {
            createPostBtn.addEventListener('click', () => {
                this.showCreatePostModal();
            });
        }
        
        // Modal events
        const modal = document.getElementById('create-post-modal');
        const closeBtn = document.getElementById('close-create-post-modal');
        const cancelBtn = document.getElementById('cancel-create-post');
        const form = document.getElementById('create-post-form');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideCreatePostModal();
            });
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.hideCreatePostModal();
            });
        }
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createPost();
            });
        }
        
        // Close modal when clicking outside
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideCreatePostModal();
                }
            });
        }
    }

    showCreatePostModal() {
        const modal = document.getElementById('create-post-modal');
        const communitySelect = document.getElementById('post-community');
        
        if (modal) {
            modal.classList.add('show');
            
            // Populate community select
            if (communitySelect) {
                communitySelect.innerHTML = '<option value="">Choose a community...</option>';
                Object.entries(this.communities).forEach(([archetype, community]) => {
                    const option = document.createElement('option');
                    option.value = archetype;
                    option.textContent = community.name;
                    if (archetype === this.userArchetype) {
                        option.selected = true;
                    }
                    communitySelect.appendChild(option);
                });
            }
        }
    }

    hideCreatePostModal() {
        const modal = document.getElementById('create-post-modal');
        const form = document.getElementById('create-post-form');
        
        if (modal) {
            modal.classList.remove('show');
        }
        
        if (form) {
            form.reset();
        }
    }

    createPost() {
        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;
        const community = document.getElementById('post-community').value;
        
        if (!title || !content || !community) return;
        
        const newPost = {
            title: title,
            content: content,
            author: `Traveler_${Math.floor(Math.random() * 1000)}`,
            community: community,
            tags: [],
            likes: 0,
            comments: 0,
            timestamp: Date.now(),
            liked: false
        };
        
        // Add to posts array
        this.posts.unshift(newPost);
        
        // Add to community posts
        if (this.communities[community]) {
            this.communities[community].posts.unshift(newPost);
        }
        
        // Hide modal and show success message
        this.hideCreatePostModal();
        this.showSuccessMessage('Post created successfully!');
        
        // Refresh posts display
        this.loadPosts();
    }

    showSuccessMessage(message) {
        // Remove existing success message if any
        const existingMessage = document.querySelector('.success-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = message;
        
        document.body.appendChild(successMessage);
        
        // Show the message
        setTimeout(() => {
            successMessage.classList.add('show');
        }, 100);
        
        // Hide and remove the message after 3 seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
            setTimeout(() => {
                successMessage.remove();
            }, 300);
        }, 3000);
    }

    // Authentication methods
    initializeAuthentication() {
        // Check if user is already logged in
        const savedUser = localStorage.getItem('wizard_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.isAuthenticated = true;
            this.updateAuthUI();
        }
        
        // Bind authentication events
        this.bindAuthEvents();
    }

    bindAuthEvents() {
        // Login button
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                this.showLoginModal();
            });
        }
        
        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }
        
        // Login modal events
        const loginModal = document.getElementById('login-modal');
        const closeLoginBtn = document.getElementById('close-login-modal');
        
        if (closeLoginBtn) {
            closeLoginBtn.addEventListener('click', () => {
                this.hideLoginModal();
            });
        }
        
        if (loginModal) {
            loginModal.addEventListener('click', (e) => {
                if (e.target === loginModal) {
                    this.hideLoginModal();
                }
            });
        }
        
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchAuthTab(btn.dataset.tab);
            });
        });
        
        // Form switching links
        document.querySelectorAll('.switch-tab').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchAuthTab(link.dataset.tab);
            });
        });
        
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
        
        // Signup form
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignup();
            });
        }
    }

    switchAuthTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update forms
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });
        document.getElementById(`${tabName}-form`).classList.add('active');
    }

    showLoginModal() {
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.style.display = 'block';
            // Reset forms
            document.getElementById('login-form').reset();
            document.getElementById('signup-form').reset();
            // Switch to login tab
            this.switchAuthTab('login');
        }
    }

    hideLoginModal() {
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        if (!email || !password) {
            this.showErrorMessage('Please fill in all fields');
            return;
        }
        
        // Simulate login (in a real app, this would be an API call)
        const users = JSON.parse(localStorage.getItem('wizard_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.loginUser(user);
        } else {
            this.showErrorMessage('Invalid email or password');
        }
    }

    handleSignup() {
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        
        if (!name || !email || !password || !confirmPassword) {
            this.showErrorMessage('Please fill in all fields');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showErrorMessage('Passwords do not match');
            return;
        }
        
        if (password.length < 6) {
            this.showErrorMessage('Password must be at least 6 characters long');
            return;
        }
        
        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('wizard_users') || '[]');
        if (users.find(u => u.email === email)) {
            this.showErrorMessage('User with this email already exists');
            return;
        }
        
        // Create new user
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            password: password,
            archetype: null,
            createdAt: new Date().toISOString()
        };
        
        // Save user
        users.push(newUser);
        localStorage.setItem('wizard_users', JSON.stringify(users));
        
        // Log in the new user
        this.loginUser(newUser);
    }

    loginUser(user) {
        this.currentUser = user;
        this.isAuthenticated = true;
        
        // Save user to localStorage
        localStorage.setItem('wizard_user', JSON.stringify(user));
        
        // Hide modal
        this.hideLoginModal();
        
        // Update UI
        this.updateAuthUI();
        
        // Show welcome message
        this.showSuccessMessage(`Welcome back, ${user.name}!`);
        
        // Check if user has completed quiz
        if (!user.archetype) {
            this.showQuiz();
        }
    }

    logout() {
        // Clear user data
        this.currentUser = null;
        this.isAuthenticated = false;
        this.userArchetype = null;
        
        // Clear localStorage
        localStorage.removeItem('wizard_user');
        localStorage.removeItem('wizard_quiz_completed');
        localStorage.removeItem('wizard_user_archetype');
        
        // Update UI
        this.updateAuthUI();
        
        // Show quiz again
        this.showQuiz();
        
        // Show logout message
        this.showSuccessMessage('You have been logged out successfully');
    }

    updateAuthUI() {
        const loginBtn = document.getElementById('login-btn');
        const logoutBtn = document.getElementById('logout-btn');
        const userArchetypeDisplay = document.getElementById('user-archetype-display');
        const travelAgentNav = document.getElementById('travel-agent-nav');
        const travelAgentSection = document.getElementById('travel-agent');

        if (this.currentUser) {
            // User is logged in
            if (loginBtn) loginBtn.classList.add('hidden');
            if (logoutBtn) logoutBtn.classList.remove('hidden');

            // Update user display
            if (userArchetypeDisplay) {
                const roleText = this.currentUser.role === 'travel_agent' ? 'Travel Agent' : 'Traveler';
                userArchetypeDisplay.textContent = `${this.currentUser.name} (${roleText})`;
            }

            // Show/hide travel agent navigation and section
            if (this.currentUser.role === 'travel_agent') {
                if (travelAgentNav) travelAgentNav.classList.remove('hidden');
                if (travelAgentSection) travelAgentSection.classList.remove('hidden');
            } else {
                if (travelAgentNav) travelAgentNav.classList.add('hidden');
                if (travelAgentSection) travelAgentSection.classList.add('hidden');
            }

            // Update community profile
            this.updateCommunityProfile();
        } else {
            // User is not logged in
            if (loginBtn) loginBtn.classList.remove('hidden');
            if (logoutBtn) logoutBtn.classList.add('hidden');

            if (userArchetypeDisplay) {
                userArchetypeDisplay.textContent = '';
            }

            // Hide travel agent navigation and section
            if (travelAgentNav) travelAgentNav.classList.add('hidden');
            if (travelAgentSection) travelAgentSection.classList.add('hidden');
        }
    }

    showErrorMessage(message) {
        const errorMessage = document.createElement('div');
        errorMessage.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #e74c3c;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(231, 76, 60, 0.3);
            z-index: 10000;
            font-size: 14px;
            animation: slideIn 0.5s ease;
        `;
        errorMessage.textContent = message;
        
        document.body.appendChild(errorMessage);
        
        setTimeout(() => {
            if (errorMessage.parentElement) {
                errorMessage.remove();
            }
        }, 3000);
    }

    initializeTravelAgentFeatures() {
        // Load sample trip packages
        this.loadSampleTripPackages();
        
        // Bind travel agent events
        this.bindTravelAgentEvents();
        
        // Initialize travel agent section if user is an agent
        if (this.currentUser && this.currentUser.role === 'travel_agent') {
            this.initializeTravelAgentSection();
        }
    }

    loadSampleTripPackages() {
        this.tripPackages = [
            {
                id: 1,
                title: "Luxury Bali Adventure",
                destination: "Bali, Indonesia",
                startDate: "2024-08-15",
                endDate: "2024-08-22",
                price: 2499,
                capacity: 12,
                booked: 8,
                description: "Experience the perfect blend of luxury and adventure in beautiful Bali. Stay at premium resorts, explore ancient temples, and enjoy world-class spa treatments.",
                includes: "Round-trip flights, 5-star hotel accommodation, daily breakfast, guided tours, spa treatments, airport transfers",
                image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
                agent: "Sarah Johnson",
                agentId: "agent1",
                status: "active"
            },
            {
                id: 2,
                title: "European Cultural Tour",
                destination: "Paris, Rome, Florence",
                startDate: "2024-09-10",
                endDate: "2024-09-20",
                price: 3899,
                capacity: 15,
                booked: 12,
                description: "Immerse yourself in European culture with visits to iconic museums, historical sites, and authentic local experiences.",
                includes: "Multi-city flights, boutique hotels, museum passes, guided tours, wine tasting, local cuisine experiences",
                image: "https://images.unsplash.com/photo-1502602898534-47d3c0c4b0e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
                agent: "Michael Chen",
                agentId: "agent2",
                status: "upcoming"
            }
        ];
    }

    bindTravelAgentEvents() {
        // Create package button
        const createPackageBtn = document.getElementById('create-package-btn');
        if (createPackageBtn) {
            createPackageBtn.addEventListener('click', () => {
                this.showCreatePackageModal();
            });
        }

        // Package filters
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                this.handlePackageFilter(filter);
            });
        });

        // Create package form
        const createPackageForm = document.getElementById('create-package-form');
        if (createPackageForm) {
            createPackageForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCreatePackage();
            });
        }

        // Close package modal
        const closePackageModal = document.getElementById('close-package-modal');
        if (closePackageModal) {
            closePackageModal.addEventListener('click', () => {
                this.hideCreatePackageModal();
            });
        }

        // Cancel package creation
        const cancelPackage = document.getElementById('cancel-package');
        if (cancelPackage) {
            cancelPackage.addEventListener('click', () => {
                this.hideCreatePackageModal();
            });
        }

        // Package details modal
        const closePackageDetailsModal = document.getElementById('close-package-details-modal');
        if (closePackageDetailsModal) {
            closePackageDetailsModal.addEventListener('click', () => {
                this.hidePackageDetailsModal();
            });
        }

        // Booking form
        const bookingForm = document.getElementById('booking-form');
        if (bookingForm) {
            bookingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleBooking();
            });
        }

        // Cancel booking
        const cancelBooking = document.getElementById('cancel-booking');
        if (cancelBooking) {
            cancelBooking.addEventListener('click', () => {
                this.hidePackageDetailsModal();
            });
        }
    }

    initializeTravelAgentSection() {
        if (!this.currentUser || this.currentUser.role !== 'travel_agent') return;

        // Update agent dashboard
        this.updateAgentDashboard();

        // Display trip packages
        this.displayTripPackages();

        // Show travel agent section
        const travelAgentSection = document.getElementById('travel-agent');
        if (travelAgentSection) {
            travelAgentSection.classList.remove('hidden');
        }
    }

    updateAgentDashboard() {
        const agentPackages = this.tripPackages.filter(pkg => pkg.agentId === this.currentUser.id);
        const totalPackages = agentPackages.length;
        const totalBookings = this.bookings.filter(booking => 
            agentPackages.some(pkg => pkg.id === booking.packageId)
        ).length;
        const totalRevenue = this.bookings
            .filter(booking => agentPackages.some(pkg => pkg.id === booking.packageId))
            .reduce((sum, booking) => sum + booking.totalPrice, 0);

        const totalPackagesElement = document.getElementById('total-packages');
        const totalBookingsElement = document.getElementById('total-bookings');
        const totalRevenueElement = document.getElementById('total-revenue');

        if (totalPackagesElement) totalPackagesElement.textContent = totalPackages;
        if (totalBookingsElement) totalBookingsElement.textContent = totalBookings;
        if (totalRevenueElement) totalRevenueElement.textContent = `$${totalRevenue.toLocaleString()}`;
    }

    displayTripPackages() {
        const packagesContainer = document.getElementById('packages-container');
        if (!packagesContainer) return;

        const agentPackages = this.tripPackages.filter(pkg => pkg.agentId === this.currentUser.id);

        if (agentPackages.length === 0) {
            packagesContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-plane"></i>
                    <h3>No packages yet</h3>
                    <p>Create your first trip package to get started!</p>
                    <button class="btn-primary" onclick="document.getElementById('create-package-btn').click()">
                        Create First Package
                    </button>
                </div>
            `;
            return;
        }

        packagesContainer.innerHTML = agentPackages.map(pkg => `
            <div class="package-item">
                <div class="package-item-header">
                    <div>
                        <div class="package-item-title">${pkg.title}</div>
                        <div class="package-item-meta">
                            <span><i class="fas fa-map-marker-alt"></i> ${pkg.destination}</span>
                            <span><i class="fas fa-calendar"></i> ${this.formatDate(pkg.startDate)} - ${this.formatDate(pkg.endDate)}</span>
                            <span><i class="fas fa-users"></i> ${pkg.booked}/${pkg.capacity} booked</span>
                        </div>
                    </div>
                    <span class="package-item-status ${pkg.status}">${pkg.status}</span>
                </div>
                <div class="package-item-description">${pkg.description.substring(0, 150)}...</div>
                <div class="package-item-actions">
                    <button class="btn-edit" onclick="wizardApp.viewPackageDetails(${pkg.id})">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    <button class="btn-edit" onclick="wizardApp.editPackage(${pkg.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete" onclick="wizardApp.deletePackage(${pkg.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    showCreatePackageModal() {
        const modal = document.getElementById('create-package-modal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    hideCreatePackageModal() {
        const modal = document.getElementById('create-package-modal');
        if (modal) {
            modal.classList.remove('show');
            // Reset form
            const form = document.getElementById('create-package-form');
            if (form) {
                form.reset();
            }
        }
    }

    handleCreatePackage() {
        const title = document.getElementById('package-title').value;
        const destination = document.getElementById('package-destination').value;
        const startDate = document.getElementById('package-start-date').value;
        const endDate = document.getElementById('package-end-date').value;
        const price = parseFloat(document.getElementById('package-price').value);
        const capacity = parseInt(document.getElementById('package-capacity').value);
        const description = document.getElementById('package-description').value;
        const includes = document.getElementById('package-includes').value;
        const image = document.getElementById('package-image').value;

        // Validation
        if (!title || !destination || !startDate || !endDate || !price || !capacity || !description || !includes) {
            this.showErrorMessage('Please fill in all required fields');
            return;
        }

        if (price <= 0 || capacity <= 0) {
            this.showErrorMessage('Price and capacity must be positive numbers');
            return;
        }

        if (new Date(startDate) >= new Date(endDate)) {
            this.showErrorMessage('End date must be after start date');
            return;
        }

        // Create new package
        const newPackage = {
            id: Date.now(),
            title,
            destination,
            startDate,
            endDate,
            price,
            capacity,
            booked: 0,
            description,
            includes,
            image: image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            agent: this.currentUser.name,
            agentId: this.currentUser.id,
            status: 'active'
        };

        this.tripPackages.push(newPackage);

        // Update display
        this.updateAgentDashboard();
        this.displayTripPackages();

        // Close modal and reset form
        this.hideCreatePackageModal();

        this.showSuccessMessage('Trip package created successfully!');
    }

    handlePackageFilter(filter) {
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeFilterBtn = document.querySelector(`[data-filter="${filter}"]`);
        if (activeFilterBtn) {
            activeFilterBtn.classList.add('active');
        }

        // Filter packages based on status
        const agentPackages = this.tripPackages.filter(pkg => pkg.agentId === this.currentUser.id);
        let filteredPackages = [...agentPackages];

        switch (filter) {
            case 'active':
                filteredPackages = agentPackages.filter(pkg => pkg.status === 'active');
                break;
            case 'upcoming':
                filteredPackages = agentPackages.filter(pkg => pkg.status === 'upcoming');
                break;
            case 'completed':
                filteredPackages = agentPackages.filter(pkg => pkg.status === 'completed');
                break;
        }

        // Update display with filtered packages
        const packagesContainer = document.getElementById('packages-container');
        if (packagesContainer) {
            packagesContainer.innerHTML = filteredPackages.map(pkg => `
                <div class="package-item">
                    <div class="package-item-header">
                        <div>
                            <div class="package-item-title">${pkg.title}</div>
                            <div class="package-item-meta">
                                <span><i class="fas fa-map-marker-alt"></i> ${pkg.destination}</span>
                                <span><i class="fas fa-calendar"></i> ${this.formatDate(pkg.startDate)} - ${this.formatDate(pkg.endDate)}</span>
                                <span><i class="fas fa-users"></i> ${pkg.booked}/${pkg.capacity} booked</span>
                            </div>
                        </div>
                        <span class="package-item-status ${pkg.status}">${pkg.status}</span>
                    </div>
                    <div class="package-item-description">${pkg.description.substring(0, 150)}...</div>
                    <div class="package-item-actions">
                        <button class="btn-edit" onclick="wizardApp.viewPackageDetails(${pkg.id})">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                        <button class="btn-edit" onclick="wizardApp.editPackage(${pkg.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-delete" onclick="wizardApp.deletePackage(${pkg.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }

    viewPackageDetails(packageId) {
        const tripPackage = this.tripPackages.find(pkg => pkg.id === packageId);
        if (!tripPackage) return;

        // Populate modal
        const titleElement = document.getElementById('package-details-title');
        const imageElement = document.getElementById('package-details-image');
        const destinationElement = document.getElementById('package-details-destination');
        const datesElement = document.getElementById('package-details-dates');
        const priceElement = document.getElementById('package-details-price');
        const descriptionElement = document.getElementById('package-details-description');
        const includesElement = document.getElementById('package-details-includes');
        const agentElement = document.getElementById('package-details-agent');

        if (titleElement) titleElement.textContent = tripPackage.title;
        if (imageElement) imageElement.src = tripPackage.image;
        if (destinationElement) destinationElement.textContent = tripPackage.destination;
        if (datesElement) datesElement.textContent = `${this.formatDate(tripPackage.startDate)} - ${this.formatDate(tripPackage.endDate)}`;
        if (priceElement) priceElement.textContent = `$${tripPackage.price.toLocaleString()} per person`;
        if (descriptionElement) descriptionElement.textContent = tripPackage.description;
        if (includesElement) includesElement.textContent = tripPackage.includes;
        if (agentElement) agentElement.textContent = `Travel Agent: ${tripPackage.agent}`;

        // Set up booking form
        const bookingGuests = document.getElementById('booking-guests');
        const bookingTotal = document.getElementById('booking-total');

        if (bookingGuests && bookingTotal) {
            bookingGuests.addEventListener('input', () => {
                const guests = parseInt(bookingGuests.value) || 1;
                const total = guests * tripPackage.price;
                bookingTotal.value = `$${total.toLocaleString()}`;
            });

            // Trigger initial calculation
            bookingGuests.dispatchEvent(new Event('input'));
        }

        // Store current package for booking
        this.currentPackage = tripPackage;

        // Show modal
        const modal = document.getElementById('package-details-modal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    hidePackageDetailsModal() {
        const modal = document.getElementById('package-details-modal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    handleBooking() {
        if (!this.currentUser) {
            this.showErrorMessage('Please log in to book this trip');
            return;
        }

        if (!this.currentPackage) {
            this.showErrorMessage('No package selected');
            return;
        }

        const guests = parseInt(document.getElementById('booking-guests').value);
        const notes = document.getElementById('booking-notes').value;
        const totalPrice = guests * this.currentPackage.price;

        // Check availability
        if (this.currentPackage.booked + guests > this.currentPackage.capacity) {
            this.showErrorMessage('Sorry, not enough spots available for this number of guests');
            return;
        }

        // Create booking
        const booking = {
            id: Date.now(),
            packageId: this.currentPackage.id,
            userId: this.currentUser.id,
            userName: this.currentUser.name,
            guests,
            totalPrice,
            notes,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        this.bookings.push(booking);

        // Update package booking count
        this.currentPackage.booked += guests;

        // Close modal
        this.hidePackageDetailsModal();

        this.showSuccessMessage(`Booking successful! Total: $${totalPrice.toLocaleString()}. The travel agent will contact you soon.`);
    }

    editPackage(packageId) {
        this.showSuccessMessage('Edit functionality coming soon!');
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    addDropdownInteractions() {
        // Handle dropdown menu interactions
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            const dropdownMenu = dropdown.querySelector('.dropdown-menu');
            
            // For desktop: hover interactions
            dropdown.addEventListener('mouseenter', () => {
                if (window.innerWidth > 768) {
                    dropdownMenu.style.opacity = '1';
                    dropdownMenu.style.visibility = 'visible';
                    dropdownMenu.style.transform = 'translateY(0)';
                }
            });
            
            dropdown.addEventListener('mouseleave', () => {
                if (window.innerWidth > 768) {
                    dropdownMenu.style.opacity = '0';
                    dropdownMenu.style.visibility = 'hidden';
                    dropdownMenu.style.transform = 'translateY(-10px)';
                }
            });
            
            // For mobile: click interactions
            dropdown.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        });
    }

    addSmoothScrolling() {
        // Add smooth scrolling to all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    addTypingEffect() {
        // Add typing effect to hero title
        const heroTitle = document.querySelector('.hero-content h1');
        if (heroTitle) {
            const text = heroTitle.textContent;
            heroTitle.textContent = '';
            heroTitle.style.borderRight = '2px solid white';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    heroTitle.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                } else {
                    heroTitle.style.borderRight = 'none';
                }
            };
            
            // Start typing effect after a short delay
            setTimeout(typeWriter, 500);
        }
    }

    // Mobile-specific enhancements
    initializeMobileFeatures() {
        this.setupMobileNavigation();
        this.setupTouchGestures();
        this.setupMobileScrollOptimizations();
        this.setupMobileFormHandling();
        this.setupMobileModalHandling();
    }

    setupMobileNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-menu a');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
                document.body.classList.toggle('nav-open');
            });

            // Close mobile menu when clicking on a link
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('nav-open');
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('nav-open');
                }
            });

            // Handle dropdown menus on mobile
            const dropdowns = document.querySelectorAll('.dropdown');
            dropdowns.forEach(dropdown => {
                const dropdownToggle = dropdown.querySelector('a');
                const dropdownMenu = dropdown.querySelector('.dropdown-menu');
                
                dropdownToggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                });
            });
        }
    }

    setupTouchGestures() {
        // Add touch feedback for buttons
        const touchButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline, .quiz-option, .community-item');
        
        touchButtons.forEach(button => {
            button.addEventListener('touchstart', () => {
                button.style.transform = 'scale(0.98)';
            });
            
            button.addEventListener('touchend', () => {
                button.style.transform = '';
            });
        });

        // Swipe gestures for quiz navigation
        let touchStartX = 0;
        let touchEndX = 0;
        
        const quizContainer = document.querySelector('.quiz-container');
        if (quizContainer) {
            quizContainer.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });
            
            quizContainer.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe();
            });
        }
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next question
                this.nextQuestion();
            } else {
                // Swipe right - previous question
                this.previousQuestion();
            }
        }
    }

    setupMobileScrollOptimizations() {
        // Smooth scrolling for mobile
        const scrollElements = document.querySelectorAll('a[href^="#"]');
        scrollElements.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Optimize scroll performance
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateScrollEffects();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        // Scroll to top functionality
        const scrollToTopBtn = document.getElementById('scroll-to-top');
        if (scrollToTopBtn) {
            scrollToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    updateScrollEffects() {
        // Update navbar on scroll
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Show/hide scroll to top button
        const scrollToTop = document.querySelector('.scroll-to-top');
        if (scrollToTop) {
            if (window.scrollY > 500) {
                scrollToTop.classList.add('show');
            } else {
                scrollToTop.classList.remove('show');
            }
        }
    }

    setupMobileFormHandling() {
        // Prevent zoom on input focus (iOS)
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.style.fontSize = '16px';
            });
            
            input.addEventListener('blur', () => {
                input.style.fontSize = '';
            });
        });

        // Better mobile form validation
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateMobileForm(form)) {
                    e.preventDefault();
                    this.showMobileFormError(form);
                }
            });
        });
    }

    validateMobileForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
        
        return isValid;
    }

    showMobileFormError(form) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'mobile-form-error';
        errorMessage.textContent = 'Please fill in all required fields';
        errorMessage.style.cssText = `
            background: #ff6b6b;
            color: white;
            padding: 10px;
            border-radius: 8px;
            margin: 10px 0;
            text-align: center;
            font-size: 14px;
        `;
        
        form.insertBefore(errorMessage, form.firstChild);
        
        setTimeout(() => {
            errorMessage.remove();
        }, 3000);
    }

    setupMobileModalHandling() {
        // Better mobile modal handling
        const modals = document.querySelectorAll('.modal, .create-post-modal');
        
        modals.forEach(modal => {
            const closeBtn = modal.querySelector('.modal-close, .close-modal');
            const modalContent = modal.querySelector('.modal-content, .create-post-content');
            
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.closeModal(modal);
                });
            }
            
            // Close modal when clicking outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
            
            // Prevent modal content clicks from closing modal
            if (modalContent) {
                modalContent.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }
        });

        // Handle mobile keyboard
        const modalInputs = document.querySelectorAll('.modal input, .modal textarea');
        modalInputs.forEach(input => {
            input.addEventListener('focus', () => {
                setTimeout(() => {
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            });
        });
    }

    closeModal(modal) {
        modal.classList.remove('show');
        document.body.classList.remove('modal-open');
        
        // Reset form if exists
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
    }

    // Enhanced mobile quiz experience
    setupMobileQuiz() {
        const quizOptions = document.querySelectorAll('.quiz-option');
        
        quizOptions.forEach(option => {
            option.addEventListener('touchstart', () => {
                option.style.transform = 'scale(0.98)';
            });
            
            option.addEventListener('touchend', () => {
                option.style.transform = '';
                this.selectOption(option);
            });
        });
    }

    // Mobile-optimized post interactions
    setupMobilePostInteractions() {
        const postActions = document.querySelectorAll('.post-action');
        
        postActions.forEach(action => {
            action.addEventListener('touchstart', () => {
                action.style.transform = 'scale(0.95)';
            });
            
            action.addEventListener('touchend', () => {
                action.style.transform = '';
            });
        });
    }

    // Mobile-optimized package interactions
    setupMobilePackageInteractions() {
        const packageActions = document.querySelectorAll('.package-item-actions button');
        
        packageActions.forEach(button => {
            button.addEventListener('touchstart', () => {
                button.style.transform = 'scale(0.95)';
            });
            
            button.addEventListener('touchend', () => {
                button.style.transform = '';
            });
        });
    }

    // Mobile performance optimizations
    optimizeForMobile() {
        // Lazy load images for mobile
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));

        // Debounce scroll events
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.updateScrollEffects();
            }, 16);
        }, { passive: true });

        // Optimize animations for mobile
        if (window.matchMedia('(max-width: 768px)').matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.2s');
        }
    }

    // Mobile-specific utility methods
    isMobile() {
        return window.innerWidth <= 768;
    }

    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .floating-action-button:hover {
        transform: scale(1.1) !important;
    }
    
    .scroll-to-top:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(44, 62, 80, 0.4);
    }
    
    .welcome-message {
        animation: slideIn 0.5s ease;
    }
`;
document.head.appendChild(style);

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing Wizard Travel Club...');
    window.wizardApp = new WizardTravelClub();
    // The initialization will happen automatically in the constructor
});
