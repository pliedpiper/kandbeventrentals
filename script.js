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
        // Get the quote details before resetting form
        const quoteDetails = document.getElementById('quote-details').value;
        
        formMessage.innerHTML = `
            <div style="background-color: #e8f5e9; border: 1px solid #a5d6a7; border-radius: 4px; padding: 1rem; color: #2e7d32;">
                <h3 style="margin-bottom: 1rem;">Quote Request Sent Successfully!</h3>
                <p>We'll email you a detailed quote within 24 hours.</p>
                ${quoteDetails ? `
                    <div style="background: white; padding: 1rem; border-radius: 8px; margin-top: 1rem; color: #3a3a3a;">
                        <h4>Your Quote Summary:</h4>
                        <pre style="white-space: pre-wrap; font-family: inherit;">${quoteDetails}</pre>
                        <button onclick="navigator.clipboard.writeText(this.previousElementSibling.textContent).then(() => alert('Quote copied to clipboard!'))" style="background: #4caf50; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; margin-top: 0.5rem;">Copy Quote</button>
                    </div>
                ` : ''}
            </div>
        `;
        
        form.reset(); // Clear the form
        
        // Recalculate to show default values
        if (typeof calculateQuote === 'function') {
            calculateQuote();
        }
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
        const href = this.getAttribute('href');
        
        // Check if it's an internal anchor link (starts with #)
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(href);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80, // Offset for the sticky header
                    behavior: 'smooth'
                });
            }
        }
        // For links like "index.html#products", let the browser handle it naturally
    });
});

// Handle hash navigation when page loads (for links like index.html#products)
window.addEventListener('load', function() {
    if (window.location.hash) {
        const targetSection = document.querySelector(window.location.hash);
        if (targetSection) {
            setTimeout(() => {
                window.scrollTo({
                    top: targetSection.offsetTop - 80, // Offset for the sticky header
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
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

// Quote Calculator Logic
const prices = {
    whiteChairs: 1.60,
    banquetTables: 11.50,
    roundTables: 11.50,
    localDelivery: 100.00,
    nonLocalDelivery: 200.00,
    taxRate: 0.07
};

function calculateQuote() {
    // Get quantities
    const whiteChairs = parseInt(document.getElementById('white-chairs').value) || 0;
    const banquetTables = parseInt(document.getElementById('banquet-tables').value) || 0;
    const roundTables = parseInt(document.getElementById('round-tables').value) || 0;
    const deliveryType = document.getElementById('delivery-type').value;
    
    // Calculate costs
    const chairsCost = whiteChairs * prices.whiteChairs;
    const banquetCost = banquetTables * prices.banquetTables;
    const roundCost = roundTables * prices.roundTables;
    
    // Calculate subtotal (items only, no delivery)
    const subtotal = chairsCost + banquetCost + roundCost;
    
    // Calculate tax (7% on everything except delivery)
    const tax = subtotal * prices.taxRate;
    
    // Get delivery fee
    const deliveryFee = deliveryType === 'local' ? prices.localDelivery : prices.nonLocalDelivery;
    
    // Calculate total
    const total = subtotal + tax + deliveryFee;
    
    // Update display
    document.getElementById('chairs-cost').textContent = `$${chairsCost.toFixed(2)}`;
    document.getElementById('banquet-cost').textContent = `$${banquetCost.toFixed(2)}`;
    document.getElementById('round-cost').textContent = `$${roundCost.toFixed(2)}`;
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('delivery').textContent = `$${deliveryFee.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    
    // Create quote details for email
    const quoteDetails = `
QUOTE BREAKDOWN:
-----------------
${whiteChairs > 0 ? `White Plastic Folding Chairs: ${whiteChairs} @ $${prices.whiteChairs.toFixed(2)} each = $${chairsCost.toFixed(2)}\n` : ''}${banquetTables > 0 ? `8-Foot Banquet Tables: ${banquetTables} @ $${prices.banquetTables.toFixed(2)} each = $${banquetCost.toFixed(2)}\n` : ''}${roundTables > 0 ? `60-Inch Round Tables: ${roundTables} @ $${prices.roundTables.toFixed(2)} each = $${roundCost.toFixed(2)}\n` : ''}
Subtotal: $${subtotal.toFixed(2)}
Sales Tax (7%): $${tax.toFixed(2)}
Delivery Fee (${deliveryType === 'local' ? 'Local' : 'Non-Local'}): $${deliveryFee.toFixed(2)}

TOTAL: $${total.toFixed(2)}
`;
    
    // Update hidden field with quote details
    document.getElementById('quote-details').value = quoteDetails;
}

// Add event listeners to calculator inputs
document.addEventListener('DOMContentLoaded', function() {
    const calcInputs = document.querySelectorAll('.calc-input');
    if (calcInputs.length > 0) {
        calcInputs.forEach(input => {
            input.addEventListener('change', calculateQuote);
            input.addEventListener('input', calculateQuote);
        });
        
        // Calculate initial quote
        calculateQuote();
    }
});