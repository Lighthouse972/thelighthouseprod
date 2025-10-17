document.addEventListener('DOMContentLoaded', function() {
  // Navigation
  const header = document.querySelector('.header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link');
  const contactForm = document.getElementById('contact-form');

  // Toggle mobile
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
    document.addEventListener('click', function(e) {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }

  // Gestion du formulaire de contact
  function showFormMessage(message, type) {
    const existingMessages = contactForm.querySelectorAll('.form-success, .form-error');
    existingMessages.forEach(msg => msg.remove());
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-${type}`;
    messageDiv.textContent = message;
    contactForm.insertBefore(messageDiv, contactForm.firstChild);
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (type === 'success') {
      setTimeout(() => {
        messageDiv.remove();
      }, 5000);
    }
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        projectType: formData.get('project-type'),
        surface: formData.get('surface'),
        message: formData.get('message')
      };

      if (!data.name || !data.email || !data.message || !data.projectType) {
        showFormMessage('Veuillez remplir tous les champs obligatoires.', 'error');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        showFormMessage('Veuillez entrer une adresse email valide.', 'error');
        return;
      }
      console.log("Données envoyées :", data);

      fetch('https://script.google.com/macros/s/AKfycby9nx5vWr45EUbLAR254xuUZAGmqJx-qAGpiGplNN8MiaLoHuLW1o4Id2MsL6cR4SzV/exec', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      .then(response => response.text())
      .then(result => {
        showFormMessage('Votre demande a bien été envoyée !', 'success');
        contactForm.reset();
      })
      .catch(err => {
        showFormMessage("Erreur d'envoi, essayez à nouveau.", 'error');
      });
    });
  }
  
  // (Ajoute ici les autres fonctionnalités JS comme l'animation, la gestion du menu, etc.)
});
