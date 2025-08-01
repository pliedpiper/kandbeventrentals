// Wait until the entire HTML page is loaded and ready
document.addEventListener('DOMContentLoaded', function() {

    // --- 1. DEFINE PRICES AND THE CALCULATOR FUNCTION ---
    const prices = {
        whiteChair: 1.60,
        banquetTable: 11.50,
        roundTable: 11.50,
        delivery: {
            pickup: 0,
            local: 100,
            nonLocal: 200
        },
        taxRate: 0.07 // 7%
    };

    function calculateQuote() {
        // Get elements we need to read from and write to
        const numChairs = parseInt(document.getElementById('white-chairs').value) || 0;
        const numBanquet = parseInt(document.getElementById('banquet-tables').value) || 0;
        const numRound = parseInt(document.getElementById('round-tables').value) || 0;
        const deliveryType = document.getElementById('delivery-type').value;

        // Calculate costs
        const chairsCost = numChairs * prices.whiteChair;
        const banquetCost = numBanquet * prices.banquetTable;
        const roundCost = numRound * prices.roundTable;
        const subtotal = chairsCost + banquetCost + roundCost;
        const tax = subtotal * prices.taxRate;
        const deliveryCost = prices.delivery[deliveryType] || 0;
        const total = subtotal + tax + deliveryCost;

        // Update the price display on the page
        document.getElementById('chairs-cost').textContent = `$${chairsCost.toFixed(2)}`;
        document.getElementById('banquet-cost').textContent = `$${banquetCost.toFixed(2)}`;
        document.getElementById('round-cost').textContent = `$${roundCost.toFixed(2)}`;
        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('delivery').textContent = `$${deliveryCost.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;

        // Create the detailed text for the email
        const quoteDetailsText = `
Quote Breakdown:
----------------
White Chairs: ${numChairs} x $${prices.whiteChair.toFixed(2)} = $${chairsCost.toFixed(2)}
Banquet Tables: ${numBanquet} x $${prices.banquetTable.toFixed(2)} = $${banquetCost.toFixed(2)}
Round Tables: ${numRound} x $${prices.roundTable.toFixed(2)} = $${roundCost.toFixed(2)}
Subtotal: $${subtotal.toFixed(2)}
Sales Tax (7%): $${tax.toFixed(2)}
Delivery: $${deliveryCost.toFixed(2)}
----------------
Total: $${total.toFixed(2)}
        `;
        
        // Put the detailed text into the hidden form field
        document.getElementById('quote-details').value = quoteDetailsText.trim();
    }


    // --- 2. SET UP THE FORM SUBMISSION ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Stop the page from reloading

            const formMessage = document.getElementById('form-message');
            const submitButton = contactForm.querySelector('.submit-button');

            // Make sure the final quote numbers are calculated before submitting
            calculateQuote();

            // Show a "Sending..." message
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            const formData = new FormData(contactForm);

            // Send the data to Formspree
            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    formMessage.textContent = "Thank you! Your quote request has been sent successfully.";
                    formMessage.style.color = 'green';
                    contactForm.reset(); // Clear the form fields
                } else {
                    // If something went wrong with Formspree (e.g., bad email)
                    formMessage.textContent = "Oops! There was a problem. Please check your details and try again.";
                    formMessage.style.color = 'red';
                }
            })
            .catch(error => {
                // If there was a network error (e.g., no internet)
                formMessage.textContent = "Oops! A network error occurred. Please try again.";
                formMessage.style.color = 'red';
            })
            .finally(() => {
                // This part runs whether it succeeded or failed
                submitButton.disabled = false;
                submitButton.textContent = 'Send Quote Request';
                calculateQuote(); // Reset the calculator display to $0.00
            });
        });
    }


    // --- 3. MAKE THE CALCULATOR WORK IN REAL-TIME ---
    const calcInputs = document.querySelectorAll('.calc-input');
    calcInputs.forEach(input => {
        // Run the calculation when user types or selects a new option
        input.addEventListener('input', calculateQuote);
    });

    // Run the calculation once when the page first loads
    calculateQuote();


    // --- 4. OTHER PAGE HELPERS (like setting min date) ---
    const today = new Date().toISOString().split('T')[0];
    const eventDateInput = document.getElementById('event-date');
    if (eventDateInput) {
        eventDateInput.setAttribute('min', today);
    }
    
    // NOTE: Your other code for smooth scrolling and animations can be added here as well, inside this main 'DOMContentLoaded' block.
});