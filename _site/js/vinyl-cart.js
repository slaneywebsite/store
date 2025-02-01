function showBrand(brandIndex) {
    const brands = document.querySelectorAll('.brand-content');
    brands.forEach((brand, index) => {
        brand.style.display = (index + 1 === brandIndex) ? 'block' : 'none';
    });
}


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

            // Trigger flash animation
            const cartIcon = document.querySelector('.ec-minicart');
            if (cartIcon) {
                cartIcon.classList.add('flash-cart');
                setTimeout(() => cartIcon.classList.remove('flash-cart'), 10000); // Remove flash class after animation
            }
        } else {
            console.error('Invalid length value');
        }
    } else {
        alert('Please select a length.');
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
    cart.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItem.innerHTML = `
           ${item.itemName} - ${item.length} ft
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
        cartItemsList.appendChild(listItem);
        cartTotal += item.price * item.quantity;
    });

    cartTotalDisplay.innerText = `Total: €${cartTotal.toFixed(2)}`;
    cartCounter.innerText = cart.length;

    console.log('Cart display updated.');
}


function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1); // Remove the item at the specified index
    localStorage.setItem('cart', JSON.stringify(cart)); // Update localStorage
    updateCartDisplay(); // Update the cart display after removing the item
}

function increaseQuantity(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart[index]) {
        cart[index].quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart)); // Update localStorage
        updateCartDisplay(); // Update the cart display
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