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

// Timeline scroll animation - FIXED FOR MOBILE
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
    // Vertical line for mobile
    line.style.height = `${percentage}%`;
    line.style.width = '2px';
  } else {
    // Horizontal line for desktop
    line.style.width = `${percentage}%`;
    line.style.height = '2px';
  }
}

// FIXED: Enable scroll animation for both mobile and desktop
function initScrollAnimation() {
  const isMobile = window.innerWidth <= 768;
  
  if (isMobile) {
    // Mobile: Use Intersection Observer for scroll-based animation
    const stepObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const stepIndex = Array.from(steps).indexOf(entry.target);
            if (stepIndex !== -1 && stepIndex !== currentStep) {
              currentStep = stepIndex;
              updateTimeline();
            }
          }
        });
      },
      { 
        threshold: 0.5,
        rootMargin: '-20% 0px -20% 0px'
      }
    );
    
    steps.forEach(step => stepObserver.observe(step));
    
  } else {
    // Desktop: Use wheel event for scroll hijacking
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
      // const shouldScrollDown = e.deltaY > 0 && currentStep < dots.length - 1;
      const shouldScrollUp = e.deltaY < 0 && currentStep > 0;

      // Only prevent default if we're actually animating
      if (shouldScrollDown) {
        e.preventDefault();
        locked = true;

        if (shouldScrollDown) {
          currentStep++;
        } 

        updateTimeline();
        setTimeout(() => locked = false, 250);
      }
    }, { passive: false });
  }
}

// // Handle window resize
// let resizeTimer;
// window.addEventListener('resize', () => {
//   clearTimeout(resizeTimer);
//   resizeTimer = setTimeout(() => {
//     updateTimeline();
//     // Reinitialize scroll animation if switching between mobile/desktop
//     initScrollAnimation();
//   }, 250);
// });

// Initialize on load
updateTimeline();
initScrollAnimation();

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

// Handle modal form submission - FIXED VERSION
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
    location: document.getElementById('modal-location').value,
    project: document.getElementById('modal-project').value
  };

  // Debug logging - check browser console
  console.log('Modal form data being sent:', data);

  try {
    await fetch('https://script.google.com/macros/s/AKfycbxgGnfM6yi0HPgcszBu0NvsVX4sZozgbjwJWiLTaUaOXPW6eCK8O-HUKj5T0Gtg78_4/exec', {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    console.log('Modal form submitted successfully');
    modalStatus.textContent = "Thank you! We'll be in touch shortly.";
    modalStatus.className = 'form-status success';
    modalForm.reset();
  } catch (error) {
    console.error('Modal form submission error:', error);
    modalStatus.textContent = "Something went wrong. Please try again.";
    modalStatus.className = 'form-status error';
  }

  submitBtn.textContent = 'Submit Inquiry';
  submitBtn.disabled = false;
});

// Handle CTA form submission - FIXED VERSION
const ctaForm = document.getElementById('cta-contact-form');
const ctaStatus = document.getElementById('cta-form-status');

if (ctaForm) {
  ctaForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = ctaForm.querySelector('.form-submit');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const data = {
      name: document.getElementById('cta-name').value,
      email: document.getElementById('cta-email').value,
      firm: document.getElementById('cta-firm').value,
      phone: document.getElementById('cta-phone').value,
      location: document.getElementById('cta-location').value,
      project: document.getElementById('cta-project').value
    };

    // Debug logging - check browser console
    console.log('CTA form data being sent:', data);

    try {
      await fetch('https://script.google.com/macros/s/AKfycbxgGnfM6yi0HPgcszBu0NvsVX4sZozgbjwJWiLTaUaOXPW6eCK8O-HUKj5T0Gtg78_4/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      console.log('CTA form submitted successfully');
      ctaStatus.textContent = "Thank you! We'll be in touch shortly.";
      ctaStatus.className = 'form-status success';
      ctaForm.reset();

    } catch (error) {
      console.error('CTA form submission error:', error);
      ctaStatus.textContent = "Something went wrong. Please try again.";
      ctaStatus.className = 'form-status error';
    }

    submitBtn.textContent = 'Submit Inquiry';
    submitBtn.disabled = false;
  });
}