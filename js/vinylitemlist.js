(function () {
    let currentPage = 1; // Initialize currentPage
    let totalPages = 0;  // Initialize totalPages
    const brandsPerPage = 12; // Set max brands per page
    const itemsPerRow = 4;    // Set max items per row
    let brandsData = []; // Array to hold brand data
    const cart = []; // Array to hold cart items

    document.addEventListener('DOMContentLoaded', function () {
        fetch('data/vinyl-data.json') // Fetch the JSON file
            .then(response => response.json())
            .then(data => {
                brandsData = data.brands;
                totalPages = Math.ceil(brandsData.length / brandsPerPage);
                if (totalPages > 0) {
                    generateBrandList(brandsData);
                    showBrand(currentPage); // Initially show the first page
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    });

    // Function to filter brands based on search input
    function filterBrands() {
        const searchInput = document.getElementById('searchInput').value.toLowerCase();
        const brandContents = document.querySelectorAll('.brand-content');

        brandContents.forEach(brand => {
            const brandName = brand.querySelector('h5').innerText.toLowerCase(); // Get the brand name
            brand.style.display = brandName.includes(searchInput) ? 'block' : 'none'; // Show or hide brand based on match
        });
    }

    // Add event listeners for search input and clear button
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    if (searchInput) {
        searchInput.addEventListener('keyup', filterBrands);
    }
    if (clearSearch) {
        clearSearch.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = ''; // Clear input
                filterBrands(); // Reset display of brands
            }
        });
    }

    function showBrand(pageIndex) {
        // Correct page range and set currentPage
        pageIndex = Math.max(1, Math.min(pageIndex, totalPages));
        currentPage = pageIndex;
    
        const brands = document.querySelectorAll('.brand-content');
        const startIndex = (currentPage - 1) * brandsPerPage;
        const endIndex = startIndex + brandsPerPage;
    
        // Loop to display only the items for the current page
        brands.forEach((brand, index) => {
            brand.style.display = (index >= startIndex && index < endIndex) ? 'block' : 'none';
        });

    updatePaginationButtons();

    const brandsContainer = document.getElementById('brandsContainer'); // Ensure this ID is correct
    if (brandsContainer) {
        brandsContainer.scrollIntoView({ behavior: 'smooth' });
    }

    // Scroll to the top of the page when the brand is shown
    window.scrollTo(0, 0); // This line ensures the page scrolls to the top
}


function updatePaginationButtons() {
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const pageInfo = document.getElementById('pageInfo');

    // Display the correct page information
    pageInfo.innerText = `Page ${currentPage} of ${totalPages}`;

    // Enable or disable navigation buttons based on the current page
    prevButton.classList.toggle('disabled', currentPage === 1);
    nextButton.classList.toggle('disabled', currentPage === totalPages);

    // Adjust pointer events for better user experience
    prevButton.style.pointerEvents = currentPage === 1 ? 'none' : 'auto';
    nextButton.style.pointerEvents = currentPage === totalPages ? 'none' : 'auto';
}
// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Check if elements exist before adding event listeners
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');

    if (prevButton) {
        prevButton.addEventListener('click', () => showBrand(currentPage - 1));
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => showBrand(currentPage + 1));
    }

    updatePaginationButtons(); // Initial state
});


   // Update only once during DOMContentLoaded
    function generateBrandList(brands) {
        const container = document.getElementById('brandsContainer');
        container.innerHTML = ''; // Clear existing brands

        // Create a title for the brand list
        const brandListTitle = document.createElement('h1');
        brandListTitle.className = 'text-center';
        brandListTitle.innerText = 'Brands';
        brandListTitle.style.display = 'none'; // Initially hide the title
        container.appendChild(brandListTitle);

        // Create filter controls
        const filterContainer = document.createElement('div');
        filterContainer.className = 'mb-3';

        // Price Filter
        const priceFilter = document.createElement('select');
        priceFilter.id = 'priceFilter';
        priceFilter.className = 'form-control d-inline w-auto';
        priceFilter.innerHTML = `
            <option value="">Sort by price</option>
            <option value="lowToHigh" selected>Lowest Price</option>
            <option value="highToLow">Highest Price</option>
        `;
        filterContainer.appendChild(priceFilter);

        // Name Filter
        const nameFilter = document.createElement('select');
        nameFilter.id = 'nameFilter';
        nameFilter.className = 'form-control d-inline w-auto ml-3';
        nameFilter.innerHTML = `
            <option value="">Sort by Name</option>
            <option value="aToZ">A-Z</option>
            <option value="zToA">Z-A</option>
        `;
        filterContainer.appendChild(nameFilter);

        // Append filter controls to the container
        container.appendChild(filterContainer);

        // Function to sort brands based on selected filters
        const sortBrands = () => {
            const priceValue = priceFilter.value;
            const nameValue = nameFilter.value;

            return brands.slice().sort((a, b) => {
                // Get the lowest price for each brand's items
                const aPrice = Math.min(...a.items.map(item => parseFloat(item.price.replace('€', '').trim())));
                const bPrice = Math.min(...b.items.map(item => parseFloat(item.price.replace('€', '').trim())));

                // Sort by price if price filter is applied
                if (priceValue === 'lowToHigh') {
                    return aPrice - bPrice;
                } else if (priceValue === 'highToLow') {
                    return bPrice - aPrice;
                }

                // If price filter is not applied, sort by name if name filter is applied
                if (nameValue === 'aToZ') {
                    return a.brandName.localeCompare(b.brandName);
                } else if (nameValue === 'zToA') {
                    return b.brandName.localeCompare(a.brandName);
                }

                // Default case, if no sorting criteria is selected
                return 0;
            });
        };
    
        // Function to render brands based on the sorted list
        const renderBrands = () => {
            const sortedBrands = sortBrands();
    
            // Clear previously displayed brands (not the filters)
            const brandListContainer = document.getElementById('brandListContainer');
            brandListContainer.innerHTML = ''; // Clear existing brands
    
            let rowDiv = document.createElement('div');
            rowDiv.className = 'row'; // Create a row container for grid layout
    
            sortedBrands.forEach((brand, brandIndex) => {
                const brandDiv = document.createElement('div');
                brandDiv.id = `brand-${brandIndex + 1}`;
                brandDiv.className = 'brand-content col-md-3 col-sm-6 mb-4'; // Bootstrap layout with 4 columns per row
    
                // Use the first item of the brand for its display info
                const firstItem = brand.items[0];
    
                // Display brand name only (no brand number)
                const brandTitle = document.createElement('h5');
                brandTitle.className = 'text-center w-100';
                brandTitle.innerText = brand.brandName; // Show brand name only
                brandDiv.appendChild(brandTitle);
    
                // Brand image (from the first item)
                const img = document.createElement('img');
                img.className = 'card-img-top img-fluid mb-2';
                img.src = firstItem.image; // Set image from the first item
                img.alt = `${brand.brandName} Image`;
                brandDiv.appendChild(img);
    
                // Add click event to the entire brandDiv to show items
                brandDiv.onclick = () => {
                    displayBrandItems(brand);
                     // Show brand items when the brandDiv is clicked
                };
    
                // Brand details from the first item
                const details = [
                    { label: 'Width', value: firstItem.width },
                    { label: 'Backing', value: firstItem.backing },
                    { label: 'Use', value: firstItem.use },
                ];
    
                details.forEach(detail => {
                    const p = document.createElement('p');
                    p.innerHTML = `<strong>${detail.label}:</strong> ${detail.value}`;
                    brandDiv.appendChild(p);
                });
    
                // Price display
                const priceLabel = document.createElement('p');
                priceLabel.innerHTML = `<strong>Price:</strong> <strong class="price-display">${firstItem.price}</strong> sy`; // Format price
                brandDiv.appendChild(priceLabel);
    
                // Append brandDiv to row
                rowDiv.appendChild(brandDiv);
    
                // After each row (4 brands), append the row to container and create a new row
                if ((brandIndex + 1) % 4 === 0) { // Assuming 4 brands per row
                    brandListContainer.appendChild(rowDiv);
                    rowDiv = document.createElement('div');
                    rowDiv.className = 'row';
                }
            });
    
            // Append the last row if it contains any items
            if (rowDiv.hasChildNodes()) {
                brandListContainer.appendChild(rowDiv);
            }
        };
    
        // Create a container for the brand list
        const brandListContainer = document.createElement('div');
        brandListContainer.id = 'brandListContainer';
        container.appendChild(brandListContainer);
    
        // Render brands initially
        renderBrands();
    
        // Update the brand list when filters change
        priceFilter.addEventListener('change', () => {
            nameFilter.value = ''; // Clear the name filter
            renderBrands(); // Render brands based on price filter
            nameFilter.style.display = 'none'; // Hide name filter
            priceFilter.style.display = ''; // Show price filter
        });
    
        nameFilter.addEventListener('change', () => {
            priceFilter.value = ''; // Clear the price filter
            renderBrands(); // Render brands based on name filter
            priceFilter.style.display = 'none'; // Hide price filter
            nameFilter.style.display = ''; // Show name filter
        });
    
        // Initial state: hide name filter and show price filter
        nameFilter.style.display = 'none';
    }
    
    // Example usage with your brand data
    generateBrandList(brandsData); // Call this function with your brands data


    let lastScrollPosition = 0; // Save last scroll position
    let lastPage = 1;            // Save last page number

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

// Hide other elements on the item page
document.getElementById('searchInput').style.display = 'none'; // Hide search input
document.getElementById('Calculator').style.display = 'none';
document.getElementById('pagination').style.display = 'none';
document.getElementById('brandstext').style.display = 'none';

// Set the brand title text
brandTitle.innerText = brand.brandName;

// Append the brand title to the container
document.getElementById('brandsContainer').appendChild(brandTitle);

// Scroll to the top of the page
window.scrollTo({
    top: 0,
    behavior: 'smooth' // Optional: for smooth scrolling
});

    // Create a message div for displaying messages
    const messageDiv = document.createElement('div');
    messageDiv.id = 'messageDiv';
    messageDiv.className = 'alert alert-success';
    messageDiv.style.display = 'none'; // Initially hide it
    container.appendChild(messageDiv); // Append it to the container

    // Loop through the items of the brand and create cards for each
    brand.items.forEach((item, itemIndex) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'col-md-3 col-sm-6 mb-4';

        const cardDiv = document.createElement('div');
        cardDiv.className = 'card border-0 mb-2';

        const imgLink = document.createElement('a');
        imgLink.href = '#';
        imgLink.onclick = (event) => {
            event.preventDefault();
            showImageModal(item.image);
        };

        const img = document.createElement('img');
        img.className = 'card-img-top img-fluid';
        img.src = item.image;
        img.alt = item.itemName;
        imgLink.appendChild(img);
        cardDiv.appendChild(imgLink);

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body bg-white p-2';

        const itemName = document.createElement('h6');
        itemName.className = 'm-0 mb-2 text-truncate';
        itemName.innerText = item.itemName;
        cardBody.appendChild(itemName);

        const details = [
            { label: 'Width', value: item.width },
            { label: 'Backing', value: item.backing },
            { label: 'Use', value: item.use },
            { label: 'Price', value: item.price },
        ];

        details.forEach(detail => {
            const p = document.createElement('p');
            p.innerHTML = `<strong>${detail.label}:</strong> ${detail.value}`;
            cardBody.appendChild(p);
        });

        // Length selection
        const lengthLabel = document.createElement('label');
        lengthLabel.setAttribute('for', `length-item-${itemIndex}`);
        lengthLabel.className = 'form-label';
        lengthLabel.innerText = 'Select Length (in feet):';
        cardBody.appendChild(lengthLabel);

        const lengthSelect = document.createElement('select');
        lengthSelect.id = `length-item-${itemIndex}`;
        lengthSelect.className = 'form-control form-control-sm mb-2';
        lengthSelect.onchange = () => {
            calculateItemPrice(parseFloat(item.price.replace('€', '')), lengthSelect.value, item.width, `priceDisplay-${itemIndex}`);
        };

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        defaultOption.innerText = 'Select Length';
        lengthSelect.appendChild(defaultOption);

        item.lengthOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.split('x')[0];
            optionElement.innerText = option;
            lengthSelect.appendChild(optionElement);
        });
        cardBody.appendChild(lengthSelect);

        // Create a price display element
        const priceDisplay = document.createElement('div');
        priceDisplay.className = 'd-flex justify-content-between';
        priceDisplay.innerHTML = `<span class="price-display" id="priceDisplay-${itemIndex}">€${parseFloat(item.price.replace('€', '')).toFixed(2)}</span>`;
        cardBody.appendChild(priceDisplay);

        // Create the order button
        const orderButton = document.createElement('button');
        orderButton.id = `orderNow-${itemIndex}`;
        orderButton.className = 'btn btn-primary btn-sm order-btn';
        orderButton.innerHTML = '<i class="fa fa-shopping-cart"></i> Add to Cart';

        // Add click event to the order button to call addToCart
        orderButton.onclick = () => {
            addToCart(item, lengthSelect, itemIndex, messageDiv);
        };

        cardBody.appendChild(orderButton); // Append the order button to cardBody
        cardDiv.appendChild(cardBody);
        itemDiv.appendChild(cardDiv);
        container.appendChild(itemDiv);
    });

    // Add a button to go back to the brand list
    const backButton = document.createElement('button');
    backButton.className = 'btn btn-secondary mt-4';
    backButton.innerText = 'Back to Brands';
    backButton.onclick = () => {
        goBackToBrands();
    };
    container.appendChild(backButton);
}

function goBackToBrands() {
    const container = document.getElementById('brandsContainer');
    container.innerHTML = ''; // Clear the current items display

    generateBrandList(brandsData); // Regenerate the brand list

    document.getElementById('searchInput').style.display = 'block'; // Show search input
    document.getElementById('Calculator').style.display = 'block';
    document.getElementById('pagination').style.display = 'flex';
    document.getElementById('brandstext').style.display = 'block';  // Show calculator

    showBrand(lastPage); // Show the saved page

    // Scroll back to the saved position
    window.scrollTo(0, lastScrollPosition);
}


function calculateItemPrice(basePrice, selectedLength, width, priceElementId) {
    const priceElement = document.getElementById(priceElementId);
    const selectedLengthInFeet = parseFloat(selectedLength);

    if (selectedLengthInFeet) {
        const totalPrice = (selectedLengthInFeet * 13 / 9) * basePrice; // Your pricing formula
        priceElement.innerText = `€${totalPrice.toFixed(2)}`; // Display formatted price
    } else {
        priceElement.innerText = `€${basePrice.toFixed(2)}`; // Reset price display to base price
    }
}


// Function to add item to the cart
    
function showImageModal(image) {
    // Set the image source to the modal image element
    const modalImage = document.getElementById('modalImage');
    modalImage.src = image;

    // Use Bootstrap's modal methods to show the modal
    const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
    imageModal.show();
}


document.addEventListener('DOMContentLoaded', function () {
    fetch('data/vinyl-data.json') // Fetch the JSON file
        .then(response => response.json())
        .then(data => {
            brandsData = data.brands;
            totalPages = Math.ceil(brandsData.length / brandsPerPage);
            if (totalPages > 0) {
                createFilterDropdown(document.getElementById('brandsContainer')); // Add filter dropdown
                generateBrandList(brandsData);
                showBrand(currentPage); // Initially show the first page
            }
        })
        .catch(error => console.error('Error fetching data:', error));
});



function createFilterDropdown() {
    // Your dropdown creation logic here
    console.log("Filter dropdown created");
}

// Call createFilterDropdown when your script runs
createFilterDropdown();




})();
