// Navigation et interactions
document.addEventListener('DOMContentLoaded', function() {
    // Éléments du DOM
    const header = document.querySelector('.header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    const contactForm = document.getElementById('contact-form');

    // Toggle menu mobile
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Fermer le menu mobile au clic à l'extérieur
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Effet de scroll sur le header + mise à jour du lien actif
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        updateActiveNavLink();
    });

    // Fonction pour mettre à jour le lien actif
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Scroll fluide vers une section
    window.scrollToSection = function(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = header.offsetHeight;
            const sectionTop = section.offsetTop - headerHeight;
            window.scrollTo({
                top: sectionTop,
                behavior: 'smooth'
            });
        }
    };

    // Gestion des clics sur les liens de navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                scrollToSection(targetId);
                if (navToggle) navToggle.classList.remove('active');
                if (navMenu) navMenu.classList.remove('active');
            } else {
                if (navToggle) navToggle.classList.remove('active');
                if (navMenu) navMenu.classList.remove('active');
            }
        });
    });

    // Animation des éléments au scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.card, .advantage-card, .service-card, .pricing-card, .testimonial-card, .gallery-category');

        elements.forEach((element, index) => {
            element.classList.add('animate-on-scroll');
            element.style.transitionDelay = `${index * 0.1}s`;
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(element => observer.observe(element));
    }

    animateOnScroll();

    // Gestion du formulaire de contact
    if (contactForm) {
        const submitBtn = document.getElementById('submit-btn');

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(contactForm);

            // Validation
            if (!formData.get('name') || !formData.get('email') || !formData.get('message') || !formData.get('project-type')) {
                showFormMessage('Veuillez remplir tous les champs obligatoires.', 'error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.get('email'))) {
                showFormMessage('Veuillez entrer une adresse email valide.', 'error');
                return;
            }

            // Feedback visuel : bouton désactivé + texte
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Envoi en cours...';

            fetch('https://script.google.com/macros/s/AKfycbxOQ30a8kiDJsk8k6ROkysz8TEW5t4uQ5qvgGQApBc8J_Ibaf2CjarRRp5jciq8nTDt/exec', {
                method: 'POST',
                body: formData
            })
            .then(response => response.text())
            .then(result => {
                if (result.trim().toLowerCase().includes('ok')) {
                    showFormMessage('Votre demande a bien été envoyée ! Nous vous recontacterons rapidement.', 'success');
                    contactForm.reset();
                    hidePriceEstimate();
                } else {
                    showFormMessage("Erreur d'envoi ou réponse inattendue du serveur.", 'error');
                }
            })
            .catch(err => {
                showFormMessage("Erreur d'envoi, veuillez réessayer ou nous contacter par WhatsApp.", 'error');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            });
        });
    }

    function showFormMessage(message, type) {
        if (!contactForm) return;
        const existingMessages = contactForm.querySelectorAll('.form-success, .form-error');
        existingMessages.forEach(msg => msg.remove());
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-${type}`;
        messageDiv.setAttribute('role', type === 'error' ? 'alert' : 'status');
        messageDiv.textContent = message;
        contactForm.insertBefore(messageDiv, contactForm.firstChild);
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (type === 'success') {
            setTimeout(() => messageDiv.remove(), 6000);
        }
    }

    // Estimation de prix affichée à l'écran
    const surfaceInput = document.getElementById('surface');
    const projectTypeSelect = document.getElementById('project-type');
    const priceEstimateDiv = document.getElementById('price-estimate');

    function hidePriceEstimate() {
        if (priceEstimateDiv) {
            priceEstimateDiv.classList.remove('active');
            priceEstimateDiv.textContent = '';
        }
    }

    window.calculateEstimatedPrice = function() {
        if (!projectTypeSelect || !surfaceInput || !priceEstimateDiv) return;
        const projectType = projectTypeSelect.value;
        const surface = parseFloat(surfaceInput.value);

        if (!projectType || !surface || surface <= 0) {
            hidePriceEstimate();
            return;
        }

        let pricePerM2;
        let minPrice;
        switch (projectType) {
            case 'residentiel':
                pricePerM2 = 4;
                minPrice = 200;
                break;
            case 'commercial':
                pricePerM2 = 2.5;
                minPrice = 1100;
                break;
            case 'industriel':
                priceEstimateDiv.classList.add('active');
                priceEstimateDiv.innerHTML = '💡 Projet industriel : tarif sur devis personnalisé.';
                return;
            default:
                hidePriceEstimate();
                return;
        }

        const estimatedPrice = Math.max(minPrice, surface * pricePerM2);
        priceEstimateDiv.classList.add('active');
        priceEstimateDiv.innerHTML = `💡 Estimation indicative : <strong>${estimatedPrice.toLocaleString('fr-FR')} €</strong> <br><small style="font-weight:400;">Devis définitif après visite technique ou appel.</small>`;
    };

    if (surfaceInput && projectTypeSelect) {
        [surfaceInput, projectTypeSelect].forEach(element => {
            element.addEventListener('change', calculateEstimatedPrice);
            element.addEventListener('input', calculateEstimatedPrice);
        });
    }

    // Accessibilité : fermer le menu mobile avec Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    if (navToggle) {
        navToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navToggle.click();
            }
        });
    }

    // Redimensionnement fenêtre
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navToggle && navMenu) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Optimisations après chargement complet
    window.addEventListener('load', function() {
        document.body.classList.add('animations-ready');
        updateActiveNavLink();

        if ('IntersectionObserver' in window) {
            const lazyElements = document.querySelectorAll('.lazy-load');
            const lazyObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('loaded');
                        lazyObserver.unobserve(entry.target);
                    }
                });
            });
            lazyElements.forEach(element => lazyObserver.observe(element));
        }
    });
});
