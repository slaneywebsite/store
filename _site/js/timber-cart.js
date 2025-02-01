let cart = [];
let currentPage = 1;

function showBrand(brandIndex) {
    const brands = document.querySelectorAll('.brand-content');
    brands.forEach((brand, index) => {
        brand.style.display = (index + 1 === brandIndex) ? 'block' : 'none';
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    // Fetch data from JSON file
    fetch('data/timber-data.json')
        .then(response => response.json())
        .then(data => {
            // Show first brand when data is loaded
            showBrand(1); 
        })
        .catch(error => console.error('Error fetching data:', error));

    // Load cart from localStorage if it exists
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCartDisplay(); // Update the cart display
    }
});

// Function to calculate price based on selected length
function calculateItemPrice(brandPrice, priceDisplayId, orderButtonId, lengthElement, quantity) {
    const length = parseFloat(lengthElement.value);
    if (!isNaN(length) && length > 0) {
        const price = quantity * brandPrice;
        document.getElementById(priceDisplayId).innerHTML = '€' + price.toFixed(2);
        document.getElementById(orderButtonId).style.display = 'block';
    } else {
        document.getElementById(priceDisplayId).innerHTML = '€0.00';
        document.getElementById(orderButtonId).style.display = 'none';
    }
}
function addToCart(item, quantity) {
    // Extract the price from the item and convert it to a number
    const brandPrice = parseFloat(item.price.replace('€', ''));

    if (!isNaN(brandPrice) && brandPrice > 0) {
        // Fetch the current cart from localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        console.log('Current cart before adding:', cart);

        // Check if item already exists in the cart
        const existingItemIndex = cart.findIndex(cartItem => cartItem.itemName === item.itemName);

        if (existingItemIndex > -1) {
            // Update the existing cart item's quantity
            cart[existingItemIndex].quantity += quantity;
        } else {
            // Add a new item to the cart
            const cartItem = {
                itemName: item.itemName,
                price: brandPrice.toFixed(2), // Price for a single unit
                quantity: quantity,
                acRating: item.acRating,  // Additional properties
                boardSize: item.boardSize,
                piece: item.piece,
                coverage: item.coverage,
            };
            cart.push(cartItem);
        }

        // Update localStorage with the new cart
        localStorage.setItem('cart', JSON.stringify(cart));

        // Debugging to see cart updates
        console.log('Cart after adding item:', cart);

        updateCartDisplay(); // Update the cart display

        // Trigger flash animation
        const cartIcon = document.querySelector('.ec-minicart');
        if (cartIcon) {
            cartIcon.classList.add('flash-cart');
            setTimeout(() => cartIcon.classList.remove('flash-cart'), 1000); // Remove flash class after animation
        }
    } else {
        console.error('Invalid price value');
    }
}


function updateCartDisplay() {
    console.log('Updating cart display...');
    
    const cartItemsList = document.getElementById('cartItems');
    const cartTotalDisplay = document.getElementById('cartTotal');
    const cartCounter = document.getElementById('cartCounter');
    
    if (!cartItemsList || !cartTotalDisplay || !cartCounter) {
        console.error('One or more cart elements are missing in the HTML.');
        return;
    }
    
    cartItemsList.innerHTML = ''; // Clear previous items
    let cartTotal = 0;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log('Cart data being used to update display:', cart); // Log cart data

    cart.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItem.innerHTML = `
            <div class="d-flex">
                <div class="ms-3">
                    <p class="mb-0">${item.itemName}</p>
                </div>
            </div>
            <div class="d-flex flex-column flex-md-row align-items-center justify-content-between mt-2">
                <div class="d-flex flex-row align-items-center mb-2 mb-md-0">
                    <button class="btn btn-danger btn-sm me-2" onclick="removeFromCart(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="btn btn-secondary btn-sm me-2" onclick="decreaseQuantity(${index})">-</button>
                    <span class="mx-2">${item.quantity}</span>
                    <button class="btn btn-secondary btn-sm me-2" onclick="increaseQuantity(${index})">+</button>
                </div>
                <span class="fw-bold">€${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
        
        // Only add length information for non-timber items (if length exists)
        if (item.length) {
            listItem.querySelector('.ms-3').innerHTML += `<p class="mb-0">${item.length} ft</p>`;
        }

        cartItemsList.appendChild(listItem);
        cartTotal += item.price * item.quantity;
    });

    cartTotalDisplay.innerText = `Total: €${cartTotal.toFixed(2)}`;
    cartCounter.innerText = cart.length;

    console.log('Cart display updated.');
}

// Function to remove item from cart
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1); // Remove the item at the specified index
    localStorage.setItem('cart', JSON.stringify(cart)); // Update localStorage
    updateCartDisplay(); // Update the cart display after removing the item
}

// Function to increase item quantity in cart
function increaseQuantity(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart[index]) {
        cart[index].quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart)); // Update localStorage
        updateCartDisplay(); // Update the cart display
    }
}

// Function to decrease item quantity in cart
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
