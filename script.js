document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Stop default form submission

    const form = event.target;
    const formData = new FormData(form);

    fetch('https://formspree.io/f/your-unique-id', { // Replace with your Formspree URL
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            document.getElementById('form-message').textContent = 'Message sent successfully!';
            form.reset(); // Clear the form
        } else {
            document.getElementById('form-message').textContent = 'Something went wrong. Try again.';
        }
    })
    .catch(error => {
        document.getElementById('form-message').textContent = 'Error: ' + error.message;
    });
});