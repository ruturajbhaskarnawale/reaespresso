// ==========================================================================
// Salesforce Apps Slider
// ==========================================================================

// Select slider elements
const cards = document.querySelectorAll('.salesforce-card');
const cardContainer = document.querySelector('.card-slider');
let currentIndex = 0; // Track current slide
let autoPlayInterval; // Auto-play interval
const prevButton = document.querySelector('#salesforce-apps .prev-btn');
const nextButton = document.querySelector('#salesforce-apps .next-btn');
const paginationDotsContainer = document.querySelector('#salesforce-apps .pagination-dots');
let touchStartX = 0; // Touch start position
let touchEndX = 0; // Touch end position

// Prevent scrolling during swipe
cardContainer.addEventListener('touchmove', (e) => {
  e.preventDefault();
}, { passive: false });

// Capture touch start position
cardContainer.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

// Capture touch end position and handle swipe
cardContainer.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, { passive: true });

// Handle swipe gestures
function handleSwipe() {
  const swipeThreshold = 30; // Sensitivity for swipe
  const swipeDistance = touchStartX - touchEndX;
  if (swipeDistance > swipeThreshold && currentIndex < cards.length - 1) {
    // Swipe left: next slide
    currentIndex++;
    updateSlider();
    resetAutoPlay();
  } else if (swipeDistance < -swipeThreshold && currentIndex > 0) {
    // Swipe right: previous slide
    currentIndex--;
    updateSlider();
    resetAutoPlay();
  }
}

// Create pagination dots dynamically
function createPaginationDots() {
  cards.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      currentIndex = index;
      updateSlider();
      resetAutoPlay();
    });
    paginationDotsContainer.appendChild(dot);
  });
}

// Update slider position and UI
function updateSlider() {
  cardContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
  prevButton.disabled = currentIndex === 0;
  nextButton.disabled = currentIndex === cards.length - 1;
  const dots = document.querySelectorAll('#salesforce-apps .dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentIndex);
  });
}

// Start auto-play
function startAutoPlay() {
  autoPlayInterval = setInterval(() => {
    currentIndex = (currentIndex < cards.length - 1) ? currentIndex + 1 : 0;
    updateSlider();
  }, 5000);
}

// Stop auto-play
function stopAutoPlay() {
  clearInterval(autoPlayInterval);
}

// Reset auto-play timer
function resetAutoPlay() {
  stopAutoPlay();
  startAutoPlay();
}

// Previous button click
prevButton.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateSlider();
    resetAutoPlay();
  }
});

// Next button click
nextButton.addEventListener('click', () => {
  if (currentIndex < cards.length - 1) {
    currentIndex++;
    updateSlider();
    resetAutoPlay();
  }
});

// Pause auto-play on hover
cardContainer.addEventListener('mouseenter', stopAutoPlay);
cardContainer.addEventListener('mouseleave', startAutoPlay);

// Initialize slider
if (cardContainer && cards.length > 0 && prevButton && nextButton && paginationDotsContainer) {
  createPaginationDots();
  updateSlider();
  startAutoPlay();
} else {
  console.error('Salesforce Apps slider initialization failed: Missing elements');
}

// ==========================================================================
// Projects Section (Grid)
// ==========================================================================

// Select project cards
const projectCards = document.querySelectorAll('.project-card');

// Add click-to-toggle functionality
projectCards.forEach(card => {
  card.addEventListener('click', (e) => {
    e.stopPropagation();
    // Toggle active state
    if (card.classList.contains('active')) {
      card.classList.remove('active');
    } else {
      projectCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    }
  });

  // Keyboard accessibility (Enter/Space)
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.click();
    }
  });
});

// Close cards when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.project-card')) {
    projectCards.forEach(card => card.classList.remove('active'));
  }
});

// ==========================================================================
// Stats Animation
// ==========================================================================

// Select stats elements
const statsSection = document.querySelector('.stats-grid');
const statNumbers = document.querySelectorAll('.stat-number');

// Animate stats on scroll
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const countUp = new CountUp(stat, 0, target, 0, 2, { useEasing: true });
        if (!countUp.error) {
          countUp.start();
        }
      });
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

// Observe stats section
if (statsSection) {
  observer.observe(statsSection);
}

// ==========================================================================
// Back to Top Button
// ==========================================================================

// Select back-to-top button
const backToTopButton = document.querySelector('.back-to-top');

// Smooth scroll to top
backToTopButton.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// ==========================================================================
// Navbar Functionality
// ==========================================================================

// Select navbar elements
const hamburger = document.querySelector('.hamburger');
const navbarRight = document.querySelector('.navbar-right');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navbarRight.classList.toggle('active');
});

// Close mobile menu on link click
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navbarRight.classList.remove('active');
  });
});

// Smooth scrolling for nav links
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    // e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    if (targetId === 'home') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - 60,
          behavior: 'smooth'
        });
      } else {
        console.warn(`Section with ID "${targetId}" not found`);
      }
    }
  });
});

// Highlight active section on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 60;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').substring(1) === current) {
      link.classList.add('active');
    }
  });
});

// ==========================================================================
// Scroll Animations
// ==========================================================================

// Animate About Section cards
const aboutCards = document.querySelectorAll('.about-card');

const cardObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

aboutCards.forEach(card => {
  cardObserver.observe(card);
});

// Animate Founders Section
const foundersSection = document.querySelector('.founders-section');

const foundersObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

if (foundersSection) {
  foundersObserver.observe(foundersSection);
}


// ==========================================================================
// WhatsApp Contact
// ==========================================================================

const whatsappContact = document.querySelector('.whatsapp-contact');

if (whatsappContact) {
  // Toggle tooltip on click (optional for mobile)
  whatsappContact.addEventListener('click', (e) => {
    // Allow default link behavior (open WhatsApp)
    // Optionally add tracking or custom behavior
  });

  // Ensure tooltip hides on blur
  whatsappContact.addEventListener('blur', () => {
    const tooltip = whatsappContact.querySelector('.whatsapp-tooltip');
    if (tooltip) {
      tooltip.style.display = 'none';
    }
  });
} else {
  console.warn('WhatsApp contact element not found');
}

// ==========================================================================
// Contact Form
// ==========================================================================

const contactForm = document.getElementById('contactForm');
const formMessage = document.querySelector('.form-message');

if (contactForm && formMessage) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      // Simulate form submission (replace with actual API call if needed)
      // Example: const response = await fetch('/api/submit', { method: 'POST', body: new FormData(contactForm) });
      // For demo, we'll assume success after a short delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Clear form
      contactForm.reset();

      // Show success message
      formMessage.textContent = 'Thank you! Your message has been sent.';
      formMessage.classList.add('success');
      formMessage.classList.remove('error');
      formMessage.style.display = 'block';

      // Hide message after 3 seconds
      setTimeout(() => {
        formMessage.style.opacity = '0';
        setTimeout(() => {
          formMessage.style.display = 'none';
          formMessage.style.opacity = '1';
        }, 300);
      }, 3000);
    } catch (error) {
      // Show error message
      formMessage.textContent = 'Oops! Something went wrong. Please try again.';
      formMessage.classList.add('error');
      formMessage.classList.remove('success');
      formMessage.style.display = 'block';

      // Hide message after 3 seconds
      setTimeout(() => {
        formMessage.style.opacity = '0';
        setTimeout(() => {
          formMessage.style.display = 'none';
          formMessage.style.opacity = '1';
        }, 300);
      }, 3000);
    }
  });
} else {
  console.warn('Contact form or message element not found');
}