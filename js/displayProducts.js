// js/displayProducts.js

function displayProducts(productsToDisplay = products) {
    const productList = document.getElementById('productList');
    if (!productList) {
        console.error('Product list container not found');
        return;
    }

    productList.innerHTML = '';

    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="brand">Brand: ${product.brand}</p>
                <p class="price">Price: Rs.${product.price.toFixed(2)}</p>
                <p class="description" onclick="showProductDetails(${product.id})" style="cursor: pointer; color: blue; text-decoration: underline;">${product.description}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        productList.appendChild(productCard);
    });
}

// Function to handle showing product details
// Function to handle showing product details
// Function to handle showing product details
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Populate modal with product details
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalProductBrand').textContent = `Brand: ${product.brand}`;
    document.getElementById('modalProductPrice').textContent = `Price: Rs.${product.price.toFixed(2)}`;
    document.getElementById('modalProductDescription').textContent = product.description;

    // Populate modal with additional images
    const modalProductImages = document.getElementById('modalProductImages');
    modalProductImages.innerHTML = ''; // Clear previous images
    product.additionalImages.forEach(image => {
        const imgElement = document.createElement('img');
        imgElement.src = image;
        imgElement.style.width = '100px'; // Set a width for the images
        imgElement.style.margin = '5px';
        modalProductImages.appendChild(imgElement);
    });

    // Show the modal
    document.getElementById('productModal').style.display = 'block';
}

// Function to close the modal
function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}
// Function to handle the search functionality
function searchProducts() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.toLowerCase();

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm)
    );

    displayProducts(filteredProducts);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    displayProducts();

    const searchButton = document.getElementById('search-button');
    if (searchButton) {
        searchButton.addEventListener('click', searchProducts);
    }

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                searchProducts();
            }
        });
    }
});
