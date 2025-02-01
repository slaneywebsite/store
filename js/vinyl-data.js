const CarpetApp = (function () {
    let cart = []; // Keep cart scoped here
    let currentPage = 1; // Keep it private to CarpetApp

    // Add all your existing code here, but scoped to CarpetApp

    // Expose any methods you need outside the module
    return {
        updateCartDisplay: updateCartDisplay
        // Add any other functions you need to expose
    };

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
