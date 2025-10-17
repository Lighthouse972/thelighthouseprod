// Navigation et interactions
document.addEventListener('DOMContentLoaded', function() {
    // Éléments du DOM
    const header = document.querySelector('.header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    const contactForm = document.getElementById('contact-form');

    // Toggle menu mobile
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Fermer le menu mobile au clic sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Fermer le menu mobile au clic à l'extérieur
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Effet de scroll sur le header
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Mise à jour du lien actif dans la navigation
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

    // Fonction de scroll fluide vers une section
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

    navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');

    // Si c'est un lien vers une ancre locale (commence par '#'), on intercepte pour scroll smooth
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      scrollToSection(targetId);
      
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    } 
    // Si c'est un lien vers une autre page + ancre, on ne bloque pas
    else if (href.includes('#')) {
      // Fermer juste le menu.
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
      // Ne PAS faire preventDefault
      // Le navigateur fera la navigation et scroll normalement.
    } 
    // Sinon lien normal
    else {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
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

        elements.forEach(element => {
            observer.observe(element);
        });
    }

    // Initialiser les animations
    animateOnScroll();

    document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contact-form');

  function showFormMessage(message, type) {
    // Supprime les anciens messages
    const existingMessages = contactForm.querySelectorAll('.form-success, .form-error');
    existingMessages.forEach(msg => msg.remove());

    // Crée le nouveau message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-${type}`;
    messageDiv.textContent = message;

    // Insère le message en haut du formulaire
    contactForm.insertBefore(messageDiv, contactForm.firstChild);

    // Scroll automatique vers le message
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Supprime le message après 5 sec si succès
    if (type === 'success') {
      setTimeout(() => {
        messageDiv.remove();
      }, 5000);
    }
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Récupère les données du formulaire
      const formData = new FormData(contactForm);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        projectType: formData.get('project-type'),
        surface: formData.get('surface'),
        message: formData.get('message')
      };

      // Validation
      if (!data.name || !data.email || !data.message || !data.projectType) {
        showFormMessage('Veuillez remplir tous les champs obligatoires.', 'error');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        showFormMessage('Veuillez entrer une adresse email valide.', 'error');
        return;
      }

      // Affiche en debug (optionnel)
      console.log("Données envoyées :", data);

      // Envoi vers Apps Script
      fetch('https://script.google.com/macros/s/AKfycby9nx5vWr45EUbLAR254xuUZAGmqJx-qAGpiGplNN8MiaLoHuLW1o4Id2MsL6cR4SzV/exec', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      .then(response => response.text())
      .then(result => {
        showFormMessage('Votre demande a bien été envoyée !', 'success');
        contactForm.reset();
      })
      .catch(err => {
        showFormMessage("Erreur d'envoi, essayez à nouveau.", 'error');
      });
    });
  }
});



    // Gestion du redimensionnement de la fenêtre
    window.addEventListener('resize', function() {
        // Fermer le menu mobile si la fenêtre devient plus large
        if (window.innerWidth > 768) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Fonction utilitaire pour calculer le prix estimatif (bonus)
    window.calculateEstimatedPrice = function() {
        const projectType = document.getElementById('project-type').value;
        const surface = document.getElementById('surface').value;

        if (!projectType || !surface) return;

        let pricePerM2;
        switch (projectType) {
            case 'residentiel':
                pricePerM2 = 4; // 4€/m²
                break;
            case 'commercial':
                pricePerM2 = 2.5; // 2.5€/m²
                break;
            case 'industriel':
                pricePerM2 = 2; // 2€/m²
                break;
            default:
                return;
        }

        const estimatedPrice = Math.max(800, surface * pricePerM2);
        
        // Afficher le prix estimatif (vous pouvez personnaliser ceci)
        console.log(`Prix estimatif: ${estimatedPrice.toLocaleString('fr-FR')}€`);
    };

    // Ajouter l'écouteur pour le calcul automatique du prix
    const surfaceInput = document.getElementById('surface');
    const projectTypeSelect = document.getElementById('project-type');
    
    if (surfaceInput && projectTypeSelect) {
        [surfaceInput, projectTypeSelect].forEach(element => {
            element.addEventListener('change', calculateEstimatedPrice);
        });
    }

    // Gestion des touches clavier pour l'accessibilité
    document.addEventListener('keydown', function(e) {
        // Fermer le menu mobile avec Escape
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Amélioration de l'accessibilité pour le menu mobile
    navToggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navToggle.click();
        }
    });

    // Fonction pour précharger les animations
    function preloadAnimations() {
        // Ajouter des classes CSS pour optimiser les performances des animations
        document.body.classList.add('animations-ready');
    }

    // Initialiser les optimisations après le chargement complet
    window.addEventListener('load', function() {
        preloadAnimations();
        
        // Mettre à jour le lien actif initial
        updateActiveNavLink();

        // Performance: lazy loading pour les éléments non critiques
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

            lazyElements.forEach(element => {
                lazyObserver.observe(element);
            });
        }
    });

    // Fonction utilitaire pour déboguer (à supprimer en production)
    window.debugInfo = function() {
        console.log('État actuel de l\'application:');
        console.log('- Menu mobile actif:', navMenu.classList.contains('active'));
        console.log('- Header scrolled:', header.classList.contains('scrolled'));
        console.log('- Position de scroll:', window.scrollY);
        console.log('- Largeur de fenêtre:', window.innerWidth);
    };
});

