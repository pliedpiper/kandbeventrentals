// Form submission handling
document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Stop default form submission

    // Show loading state
    const submitButton = this.querySelector('.submit-button');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    const formMessage = document.getElementById('form-message');
    formMessage.textContent = ''; // Clear previous messages
    formMessage.style = ''; // Clear previous styling

    const form = this;
    const formData = new FormData(form);
    
    // Get the action URL from the form
    const action = form.getAttribute('action');

    // Submit the form data to Formspree
    fetch(action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    })
    .then(data => {
        formMessage.textContent = 'Message sent successfully! We\'ll be in touch soon.';
        form.reset(); // Clear the form
        
        // Add success styling
        formMessage.style.backgroundColor = '#e8f5e9';
        formMessage.style.border = '1px solid #a5d6a7';
        formMessage.style.borderRadius = '4px';
        formMessage.style.padding = '1rem';
        formMessage.style.color = '#2e7d32';
    })
    .catch(error => {
        formMessage.textContent = 'Something went wrong. Please try again or contact us directly.';
        console.error('Error:', error);
        
        // Add error styling
        formMessage.style.backgroundColor = '#ffebee';
        formMessage.style.border = '1px solid #ef9a9a';
        formMessage.style.borderRadius = '4px';
        formMessage.style.padding = '1rem';
        formMessage.style.color = '#c62828';
    })
    .finally(() => {
        // Reset button state
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
        
        // Scroll to form message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        window.scrollTo({
            top: targetSection.offsetTop - 80, // Offset for the sticky header
            behavior: 'smooth'
        });
    });
});

// Add current date to event date field as min attribute
const today = new Date().toISOString().split('T')[0];
const eventDateInput = document.getElementById('event-date');
if (eventDateInput) {
    eventDateInput.setAttribute('min', today);
}

// Add active class to current navigation section
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - 100)) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === currentSection) {
            link.classList.add('active');
        }
    });
});

// Add fade-in animation for products when they come into view
const observeElements = document.querySelectorAll('.product-item, .pricing-item');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

observeElements.forEach(element => {
    observer.observe(element);
});