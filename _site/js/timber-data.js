const CarpetApp = (function () {
    let cart = []; // Private cart
    let currentPage = 1; // Private current page

    function updateCartDisplay() {
        // Add code to update the cart UI
        console.log('Cart updated:', cart);
    }

    function calculateItemPrice(brandPrice, priceDisplayId, orderButtonId, quantityInput) {
        const quantity = parseInt(quantityInput.value);
        if (!isNaN(quantity) && quantity > 0) {
            const price = quantity * brandPrice;
            document.getElementById(priceDisplayId).innerHTML = '€' + price.toFixed(2);
            document.getElementById(orderButtonId).style.display = 'block';
        } else {
            document.getElementById(priceDisplayId).innerHTML = '€0.00';
            document.getElementById(orderButtonId).style.display = 'none';
        }
    }

    function addToCart(item, quantityInput) {
        const quantity = quantityInput.value;
        if (quantity) {
            const brandPrice = parseFloat(item.price.replace('€', ''));
            const quantityValue = parseInt(quantity);
            if (!isNaN(quantityValue) && quantityValue > 0) {
                const price = quantityValue * brandPrice;
                const cartItem = {
                    itemName: item.itemName,
                    quantity: quantityValue,
                    price: price.toFixed(2),
                };

                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const existingItemIndex = cart.findIndex(cartItem => cartItem.itemName === item.itemName);
                if (existingItemIndex > -1) {
                    cart[existingItemIndex].quantity += quantityValue;
                } else {
                    cart.push(cartItem);
                }

                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartDisplay(); // Update the cart display
            } else {
                console.error('Invalid quantity value');
            }
        } else {
            alert('Please enter a quantity.');
        }
    }

    return {
        updateCartDisplay: updateCartDisplay
        // Expose other necessary functions here
    };

})();

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    // Fetch data from JSON file
    fetch('data/timber-data.json')
        .then(response => response.json())
    

    // Load cart from localStorage if it exists
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
        CarpetApp.updateCartDisplay(); // Update the cart display
    }
});
