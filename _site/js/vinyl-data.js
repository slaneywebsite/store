const CarpetApp = (function () {
    let cart = []; // Keep cart scoped here
    let currentPage = 1; // Keep it private to CarpetApp

    // Add all your existing code here, but scoped to CarpetApp

    // Expose any methods you need outside the module
    return {
        updateCartDisplay: updateCartDisplay
        // Add any other functions you need to expose
    };


// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    // Fetch data from JSON file
    fetch('data/vinyl-data.json')
        .then(response => response.json())
        .then(data => {
            generateBrandContent(data.brands); // Generate content for each brand
            showBrand(1); // Display the first brand
        })
        .catch(error => console.error('Error fetching data:', error));

});

function calculateItemPrice(brandPrice, priceDisplayId, orderButtonId, lengthElement) {
    const length = parseFloat(lengthElement.value);
    if (!isNaN(length) && length > 0) {
        const price = (length * 13 / 9) * brandPrice;
        document.getElementById(priceDisplayId).innerHTML = '€' + price.toFixed(2);
        document.getElementById(orderButtonId).style.display = 'block';
    } else {
        document.getElementById(priceDisplayId).innerHTML = '€0.00';
        document.getElementById(orderButtonId).style.display = 'none';
    }
}

function addToCart(item, lengthSelect) {
    const length = lengthSelect.value;
    if (length) {
        const brandPrice = parseFloat(item.price.replace('€', ''));
        const lengthValue = parseFloat(length);
        if (!isNaN(lengthValue) && lengthValue > 0) {
            const price = (lengthValue * 13 / 9) * brandPrice;
            const cartItem = {
                itemName: item.itemName,
                length: length,
                price: price.toFixed(2),
                quantity: 1
            };

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingItemIndex = cart.findIndex(cartItem => cartItem.itemName === item.itemName && cartItem.length === length);
            if (existingItemIndex > -1) {
                cart[existingItemIndex].quantity += 1;
            } else {
                cart.push(cartItem);
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay(); // Update the cart display
        } else {
            console.error('Invalid length value');
        }
    } else {
        alert('Please select a length.');
    }
}
function decreaseQuantity(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart[index]) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            removeFromCart(index); // Remove the item if the quantity is 1 and decrease is clicked
        }
        localStorage.setItem('cart', JSON.stringify(cart)); // Update localStorage
        updateCartDisplay(); // Update the cart display
    }
}
})();
