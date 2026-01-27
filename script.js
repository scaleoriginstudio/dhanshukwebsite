const video = document.querySelector('.explainer-video');
const toggle = document.querySelector('.video-toggle');

toggle.addEventListener('click', () => {
  if (video.paused) {
    video.play();
    toggle.textContent = '❚❚';
  } else {
    video.pause();
    toggle.textContent = '▶';
  }
});

const fadeElements = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.15 }
);

fadeElements.forEach(el => observer.observe(el));

// Timeline scroll animation
// Timeline scroll animation
const section = document.querySelector('.how-it-works');
const dots = document.querySelectorAll('.timeline-dot');
const line = document.querySelector('.timeline-line');
const steps = document.querySelectorAll('.hiw-step');

let currentStep = 0;
let locked = false;

function updateTimeline() {
  // Update dots
  dots.forEach((dot, index) => {
    if (index <= currentStep) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });

  // Update content steps
  steps.forEach((step, index) => {
    if (index === currentStep) {
      step.classList.add('active');
    } else {
      step.classList.remove('active');
    }
  });

  // Check if mobile or desktop
  const isMobile = window.innerWidth <= 768;
  const percentage = (currentStep / (dots.length - 1)) * 100;
  
  if (isMobile) {
    // On mobile, show all steps and make all dots active
    dots.forEach(dot => dot.classList.add('active'));
    steps.forEach(step => step.classList.add('active'));
    line.style.height = '100%';
    line.style.width = '2px';
  } else {
    // Horizontal line for desktop
    line.style.width = `${percentage}%`;
    line.style.height = '2px';
  }
}

// Only enable scroll animation on desktop
if (window.innerWidth > 768) {
  window.addEventListener('wheel', (e) => {
    if (!section) return;

    const rect = section.getBoundingClientRect();

    // Check if the section is in the middle of viewport
    const isActive =
      rect.top < window.innerHeight * 0.5 &&
      rect.bottom > window.innerHeight * 0.5;

    if (!isActive) return;

    if (locked) return;

    // Determine if we should animate
    const shouldScrollDown = e.deltaY > 0 && currentStep < dots.length - 1;
    const shouldScrollUp = e.deltaY < 0 && currentStep > 0;

    // Only prevent default if we're actually animating
    if (shouldScrollDown || shouldScrollUp) {
      e.preventDefault();
      locked = true;

      if (shouldScrollDown) {
        currentStep++;
      } else if (shouldScrollUp) {
        currentStep--;
      }

      updateTimeline();
      setTimeout(() => locked = false, 450);
    }
  }, { passive: false });
}

// Handle window resize
window.addEventListener('resize', () => {
  updateTimeline();
});

// Initialize on load
updateTimeline();

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  
  question.addEventListener('click', () => {
    // Close other items
    faqItems.forEach(otherItem => {
      if (otherItem !== item) {
        otherItem.classList.remove('active');
      }
    });
    
    // Toggle current item
    item.classList.toggle('active');
  });
});

// Contact Modal Functionality
const modal = document.getElementById('contactModal');
const modalClose = document.getElementById('modalClose');
const getStartedButtons = document.querySelectorAll('.get-started-btn, .primary-btn[href="#get-started"]');
const modalOverlay = document.querySelector('.modal-overlay');
const modalForm = document.getElementById('modal-contact-form');
const modalStatus = document.getElementById('modal-form-status');

// Open modal when any "Get Started" button is clicked
getStartedButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    modal.classList.add('active');
    document.body.classList.add('modal-open');
  });
});

// Close modal
function closeModal() {
  modal.classList.remove('active');
  document.body.classList.remove('modal-open');
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) {
    closeModal();
  }
});

// Handle modal form submission
modalForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const submitBtn = modalForm.querySelector('.form-submit');
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  const data = {
    name: document.getElementById('modal-name').value,
    email: document.getElementById('modal-email').value,
    firm: document.getElementById('modal-firm').value,
    phone: document.getElementById('modal-phone').value,
    location: document.getElementById('modal-location').value
  };

  try {
    await fetch('https://script.google.com/macros/s/AKfycbxViy5Q6Iq3nkN9GI5PKG-xEw7EupNdMkNeTpO7t3YTcoNiDCqXcp7dHxLpkrRSL-e3/exec', {

      method: 'POST',
      body: JSON.stringify(data)
    });

    modalStatus.textContent = "Thank you! We'll be in touch shortly.";
    modalStatus.className = 'form-status success';
    modalForm.reset();
  } catch {
    modalStatus.textContent = "Something went wrong. Please try again.";
    modalStatus.className = 'form-status error';
  }

  submitBtn.textContent = 'Submit Inquiry';
  submitBtn.disabled = false;
});
