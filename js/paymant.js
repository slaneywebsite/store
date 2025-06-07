document.addEventListener('DOMContentLoaded', function () {
    let paypalButtonRendered = false;

    const showDeliveryFormButton = document.getElementById('showDeliveryFormButton');
    const deliveryForm = document.getElementById('delivery-form');
    const showPayPalButton = document.getElementById('showPayPalButton');
    const paypalButtonContainer = document.getElementById('paypal-button-container');

    // Ensure required elements exist
    if (!showDeliveryFormButton || !paypalButtonContainer || !deliveryForm || !showPayPalButton) {
        console.error('Required elements not found');
        return;
    }

    showDeliveryFormButton.addEventListener('click', function () {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Check if the cart is empty
        if (cart.length === 0) {
            document.getElementById('formError').innerText = "Your cart is empty. Please add items to the cart before placing an order.";
            document.getElementById('formError').style.display = 'block'; // Show the error message
            deliveryForm.classList.add('d-none'); // Ensure the form is hidden
            showPayPalButton.classList.add('d-none'); // Ensure the PayPal button is hidden
        } else {
            // Clear any previous error message if cart is not empty
            document.getElementById('formError').style.display = 'none';
            deliveryForm.classList.remove('d-none'); // Show the delivery form
            showPayPalButton.classList.remove('d-none'); // Show the PayPal button
        }
    });

    showPayPalButton.addEventListener('click', function () {
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const address = document.getElementById('address').value.trim();
        const city = document.getElementById('city').value.trim();
        const postalCode = document.getElementById('postalCode').value.trim();
        const country = document.getElementById('country').value.trim();
        const phone = document.getElementById('phone').value.trim();

        // Check for empty fields
        if (!fullName || !email || !address || !city || !postalCode || !country || !phone) {
            document.getElementById('formError').innerText = "Please fill out all delivery fields.";
            document.getElementById('formError').style.display = 'block';
            return;
        } else {
            document.getElementById('formError').style.display = 'none';
        }

        // Validate email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailError = document.getElementById('emailError');

        if (!emailPattern.test(email)) {
            emailError.style.display = 'block'; // Show error message
            return;
        } else {
            emailError.style.display = 'none'; // Hide error message if valid
        }

        // Validate phone number
        const phonePattern = /^(?:\+353|0)?\d{7,9}$/;
        const phoneError = document.getElementById('phoneError');

        if (!phonePattern.test(phone)) {
            phoneError.style.display = 'block'; // Show error message
            return;
        } else {
            phoneError.style.display = 'none'; // Hide error message if valid
        }

        // Validate postal code
        const postcodePattern = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9 ]+$/; // Allows letters, numbers, and spaces
        const postalCodeError = document.getElementById('postalCodeError');

        if (!postcodePattern.test(postalCode)) {
            postalCodeError.style.display = 'block'; // Show error message
            return;
        } else {
            postalCodeError.style.display = 'none'; // Hide error message if valid
        }

        // Show PayPal button and render it if not already rendered
        paypalButtonContainer.classList.remove('d-none');
        if (!paypalButtonRendered) {
            setupPayPalButton();
            paypalButtonRendered = true;
        }
    });
});

function sendPaymentEmail(details, cart) {
    const userDetails = {
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        address: document.getElementById('address').value.trim(),
        city: document.getElementById('city').value.trim(),
        postalCode: document.getElementById('postalCode').value.trim(),
        country: document.getElementById('country').value.trim()
    };

    const emailParams = {
        user_name: userDetails.fullName,
        user_email: userDetails.email,
        user_phone: userDetails.phone,
        payment_id: details.id,
        payment_status: details.status,
        transaction_amount: details.purchase_units[0].amount.value,
        items: cart.map(item => 
             `${item.itemName} - ${item.length} ft - ${item.quantity}x - €${(item.price * item.quantity).toFixed(2)}`
        ).join(', '),
        shipping_address: `${userDetails.address}, ${userDetails.city}, ${userDetails.postalCode}, ${userDetails.country}`
    };

    console.log('Email parameters:', emailParams);

    emailjs.send('default_service', 'template_it2ccgd', emailParams)
        .then(function(response) {
            console.log('Email sent successfully!', response.status, response.text);
        }, function(error) {
            console.error('Email sending failed...', error);
            alert('Failed to send email: ' + JSON.stringify(error));
        });
}

function setupPayPalButton() {
    console.log('PayPal button setup started.');

    if (paypal && paypal.Buttons) {
        paypal.Buttons({
            createOrder: function (data, actions) {
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                let cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: cartTotal.toFixed(2)
                        }
                    }],
                    payer: {
                        address: {
                            country_code: 'IE'
                        }
                    },
                    shipping_preference: 'SET_PROVIDED_ADDRESS'
                });
            },
            onApprove: function (data, actions) {
                return actions.order.capture().then(function (details) {
                    // Remove or comment out the alert
                    // alert('Transaction completed by ' + details.payer.name.given_name);

                    const cart = JSON.parse(localStorage.getItem('cart')) || [];
                    sendPaymentEmail(details, cart); 
                    handleSuccessfulPayment(details);
                });
            },
            onError: function (err) {
                console.error('PayPal error:', err);
            }
        }).render('#paypal-button-container');
    } else {
        console.error('PayPal SDK not available.');
    }
}

function handleSuccessfulPayment(details) {
    // Remove the cart from localStorage
    localStorage.removeItem('cart');

    // Clear the page content and display a thank you message
    document.body.innerHTML = `
        <div class="thank-you-message" style="position: relative; padding: 20px; text-align: center; font-size: 1.5em; color: green; border: 2px solid green; max-width: 600px; margin: 50px auto; background-color: #f9f9f9; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
            <button id="closeWindowButton" style="position: absolute; top: 10px; right: 10px; border: none; background: none; font-size: 1.5em; cursor: pointer; color: red;">&times;</button>
            <h1>Thank You for Your Purchase, ${details.payer.name.given_name}!</h1>
            <p>Your order has been successfully completed.</p>
            <p><strong>Order Summary:</strong></p>
            <p>Order ID: ${details.id}</p>
            <p>Transaction Amount: €${details.purchase_units[0].amount.value}</p>
            <p>Shipping Address: ${details.purchase_units[0].shipping.address.address_line_1}, ${details.purchase_units[0].shipping.address.admin_area_2}, ${details.purchase_units[0].shipping.address.postal_code}, ${details.purchase_units[0].shipping.address.country_code}</p>
            <button id="backToShop" style="margin-top: 20px; padding: 10px 20px; font-size: 1.2em;">Back to Carpet Shop</button>
            <p id="redirectMessage" style="margin-top: 20px;">You will be redirected in <span id="countdown">15</span> seconds.</p>
        </div>
    `;

    // Add event listener to the "Back to Carpet Shop" button
    document.getElementById('backToShop').addEventListener('click', function () {
        window.location.href = 'carpet.html'; // Redirect to the carpet page
    });

    // Add event listener to the close button ("X") to close the window
    document.getElementById('closeWindowButton').addEventListener('click', function () {
        window.close(); // Close the current window
    });

    // Start countdown timer for automatic redirect after 15 seconds
    let countdown = 15;
    const countdownElement = document.getElementById('countdown');
    const interval = setInterval(() => {
        countdown--;
        countdownElement.innerText = countdown;
        if (countdown <= 0) {
            clearInterval(interval);
            window.location.href = 'carpet.html'; // Automatically redirect to the carpet page
        }
    }, 1000); // Update every second
}
