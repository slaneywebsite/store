(function () {
    let currentPage = 1; // Initialize current page
    let totalPages = 0;  // Initialize total pages
    const brandsPerPage = 12; // Max brands per page
    const itemsPerRow = 4;    // Items per row
    let brandsData = []; // Hold brand data

    // Function to convert price string to number
    function parsePrice(priceString) {
        // Remove the euro symbol and parse the remaining part as a float
        return parseFloat(priceString.replace('€', '').trim());
    }
    
    function showImageModal(image) {
        // Set the image source to the modal image element
        const modalImage = document.getElementById('modalImage');
        modalImage.src = image;
    
        // Use Bootstrap's modal methods to show the modal
        const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
        imageModal.show();
    }
    
    // Fetch JSON data and initialize
    document.addEventListener('DOMContentLoaded', function () {
        fetch('data/timber-data.json') // Path to your JSON file
            .then(response => response.json())
            .then(data => {
                brandsData = data.brands;
                totalPages = Math.ceil(brandsData.length / brandsPerPage);
                showBrand(currentPage); // Initialize display
            })
            .catch(error => console.error('Error fetching data:', error));
    });

    // Show brands based on the current page
    function showBrand(page) {
        currentPage = page;
        const startIndex = (currentPage - 1) * brandsPerPage;
        const endIndex = startIndex + brandsPerPage;
        const brandsToShow = brandsData.slice(startIndex, endIndex);

        generateBrandList(brandsToShow);
        updatePaginationButtons();
    }


    // Update pagination controls
    function updatePaginationButtons() {
        const prevButton = document.getElementById('prev');
        const nextButton = document.getElementById('next');
        const pageInfo = document.getElementById('pageInfo');

        pageInfo.innerText = `Page ${currentPage} of ${totalPages}`;
        prevButton.classList.toggle('disabled', currentPage === 1);
        nextButton.classList.toggle('disabled', currentPage === totalPages);
    }

   // Generate brand list
function generateBrandList(brands) {
    const container = document.getElementById('brandsContainer');
    container.innerHTML = ''; // Clear existing content

    const brandListContainer = document.createElement('div');
    brandListContainer.id = 'brandListContainer';
    container.appendChild(brandListContainer);

    let rowDiv = document.createElement('div');
    rowDiv.className = 'row';

    brands.forEach((brand, brandIndex) => {
        const brandDiv = document.createElement('div');
        brandDiv.className = 'brand-content col-lg-2 col-md-6 mb-4';

        // Get details from the first item in the brand
        const firstItem = brand.items[0];

        // Brand title
        const brandTitle = document.createElement('h5');
        brandTitle.innerText = brand.brandName;

        // Brand image
        const brandImage = document.createElement('img');
        brandImage.src = firstItem.image;
        brandImage.alt = firstItem.itemName;
        brandImage.className = 'card-img-top img-fluid mb-2'; // Adjust size if needed

        // Brand details
        const details = [
            { label: 'Price', value: firstItem.price },
            { label: 'AC Rating', value: firstItem.acRating },
            { label: 'Board Size', value: firstItem.boardSize },
            { label: 'Piece', value: firstItem.piece },
            { label: 'Coverage', value: firstItem.coverage }
        ];

        // Details container
        const detailsContainer = document.createElement('div');
        detailsContainer.className = 'details-container';

        details.forEach(detail => {
            const detailItem = document.createElement('p');
            detailItem.innerHTML = `<strong>${detail.label}:</strong> ${detail.value}`;
            detailsContainer.appendChild(detailItem);
        });

        // Add elements to brandDiv
        brandDiv.appendChild(brandTitle);
        brandDiv.appendChild(brandImage);
        brandDiv.appendChild(detailsContainer);

        // Add click event to display brand items
        brandDiv.onclick = () => displayBrandItems(brand);

        // Add brandDiv to rowDiv
        rowDiv.appendChild(brandDiv);

        // Handle row wrapping
        if ((brandIndex + 1) % itemsPerRow === 0) {
            brandListContainer.appendChild(rowDiv);
            rowDiv = document.createElement('div');
            rowDiv.className = 'row';
        }
    });

    // Append remaining row if it has children
    if (rowDiv.hasChildNodes()) {
        brandListContainer.appendChild(rowDiv);
    }
}



function displayBrandItems(brand) {
    // Save the current scroll position and page
    lastScrollPosition = window.scrollY; // Save the scroll position
    lastPage = currentPage; // Save the current page

    // Clear the current brand content
    const container = document.getElementById('brandsContainer');
    container.innerHTML = '';

    // Create a brand title
    const brandTitle = document.createElement('h1');
    brandTitle.className = 'text-center w-100';

    // Set the brand title text
    brandTitle.innerText = brand.brandName;
    // Append the brand title to the container
    document.getElementById('brandsContainer').appendChild(brandTitle);

    // Loop through the brand's items and display them
    brand.items.forEach((item, itemIndex) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'col-lg-2 col-md-6 mb-4';

        const cardDiv = document.createElement('div');
        cardDiv.className = 'card border-0 mb-2';

        // Create an anchor link to wrap the image
        const imgLink = document.createElement('a');
        imgLink.href = '#'; // Prevent default link behavior
        imgLink.onclick = (event) => {
            event.preventDefault(); // Prevent page navigation
            showImageModal(item.image); // Show modal when image is clicked
        };

        // Create the image element
        const img = document.createElement('img');
        img.className = 'card-img-top img-fluid'; // Add classes for size and responsiveness
        img.src = item.image;
        img.alt = item.itemName;

        // Append the image to the anchor link
        imgLink.appendChild(img);

        // Append the anchor link (with the image) to the card
        cardDiv.appendChild(imgLink);

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body bg-white p-2';

        const itemName = document.createElement('h6');
        itemName.innerText = item.itemName;
        cardBody.appendChild(itemName);

        // Compact information block
        const infoBlock = document.createElement('div');
        infoBlock.className = 'item-info';

        const details = [
            { label: 'Price per box', value: item.price },
            { label: 'AC Rating', value: item.acRating },
            { label: 'Board Size', value: item.boardSize },
            { label: 'Piece', value: item.piece },
            { label: 'Coverage', value: item.coverage }
        ];

        details.forEach(detail => {
            const p = document.createElement('p');
            p.innerHTML = `<strong>${detail.label}:</strong> <span class="text-muted">${detail.value}</span>`;
            infoBlock.appendChild(p);
        });

        cardBody.appendChild(infoBlock);

        // Quantity input field with spinner controls and centered alignment
        const quantityInputContainer = document.createElement('div');
        quantityInputContainer.style.display = 'flex';
        quantityInputContainer.style.justifyContent = 'center';
        quantityInputContainer.style.alignItems = 'center';
        quantityInputContainer.style.margin = '10px 0';

        // Create the number input field
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number'; // Use number for spinner controls
        quantityInput.value = 1; // Default quantity
        quantityInput.min = 1; // Minimum value
        quantityInput.step = 1; // Increment/Decrement by 1
        quantityInput.className = 'form-control';
        quantityInput.style.width = '80px'; // Compact size
        quantityInput.style.textAlign = 'center'; // Center align text
        quantityInput.title = 'Enter quantity (only positive numbers)';
        quantityInput.id = `quantity_${itemIndex}`;

        // Dynamic price display
        const dynamicPrice = document.createElement('p');
        dynamicPrice.className = 'dynamic-price';
        dynamicPrice.style.margin = '10px 0';
        dynamicPrice.style.textAlign = 'center'; // Center align price
        dynamicPrice.innerHTML = `<strong>Total Price:</strong> ${item.price}`;

        // Update price dynamically based on quantity
        quantityInput.addEventListener('input', () => {
            let quantity = parseInt(quantityInput.value, 10);

            // Ensure the value is at least 1
            if (isNaN(quantity) || quantity < 1) {
                quantity = 1;
            }

            quantityInput.value = quantity;

            // Calculate and update total price
            const totalPrice = (parseFloat(item.price.replace('€', '')) * quantity).toFixed(2);
            dynamicPrice.innerHTML = `<strong>Total Price:</strong> €${totalPrice}`;
        });

        // Prevent invalid keys (e.g., 'e', '+', '-', '.')
        quantityInput.addEventListener('keydown', (event) => {
            const invalidKeys = ['e', 'E', '.', '+', '-'];
            if (invalidKeys.includes(event.key)) {
                event.preventDefault();
            }
        });

        // Add quantity input and dynamic price to the container
        quantityInputContainer.appendChild(quantityInput);
        cardBody.appendChild(quantityInputContainer);
        cardBody.appendChild(dynamicPrice);

        // Create the order button
        const orderButton = document.createElement('button');
        orderButton.id = `orderNow-${itemIndex}`;
        orderButton.className = 'btn btn-primary btn-sm order-btn';
        orderButton.innerHTML = '<i class="fa fa-shopping-cart"></i> Add to Cart';

        // Add click event to call addToCart
        orderButton.onclick = () => {
            const quantity = parseInt(quantityInput.value, 10); // Get quantity
            if (quantity > 0) {
                addToCart(item, quantity);
            } else {
                alert('Please enter a valid quantity!');
            }
        };

        // Append input, dynamic price, and button to cardBody
        cardBody.appendChild(quantityInput);
        cardBody.appendChild(dynamicPrice);
        cardBody.appendChild(orderButton);
        cardDiv.appendChild(cardBody);

        itemDiv.appendChild(cardDiv);
        container.appendChild(itemDiv);
    });

    // Add a button to go back to the brand list
    const backButton = document.createElement('button');
    backButton.className = 'btn btn-secondary mt-4';
    backButton.innerText = 'Back to Brands';
    backButton.onclick = () => {
        // Clear the current content and return to the brand list
        const container = document.getElementById('brandsContainer');
        container.innerHTML = '';
        showBrand(lastPage); // Return to the last viewed brand page
        
        // Scroll back to the previous position
        window.scrollTo(0, lastScrollPosition);  // Restore the previous scroll position
    };
    container.appendChild(backButton);
}


    // Pagination control: Previous button
    document.getElementById('prev').addEventListener('click', function () {
        if (currentPage > 1) {
            showBrand(currentPage - 1);
        }
    });

    // Pagination control: Next button
    document.getElementById('next').addEventListener('click', function () {
        if (currentPage < totalPages) {
            showBrand(currentPage + 1);
        }
    });
})();
