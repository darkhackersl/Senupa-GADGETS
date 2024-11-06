// filter.js
const products = []; // Replace with your products data

// js/filter.js

function filterProducts() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const priceFilter = parseFloat(document.getElementById('priceFilter').value);

    const filteredProducts = products.filter(product => {
        return (categoryFilter === '' || product.category === categoryFilter) &&
               (isNaN(priceFilter) || product.price <= priceFilter);
    });

    displayProducts(filteredProducts);
}

// Add event listeners to your filter elements
document.getElementById('categoryFilter').addEventListener('change', filterProducts);
document.getElementById('priceFilter').addEventListener('input', filterProducts);

function sortProducts() {
    const sortBy = document.getElementById('sortBy').value;
    const sortedProducts = [...products].sort((a, b) => {
        return sortBy === 'price' ? a.price - b.price : b.popularity - a.popularity;
    });
    displayProducts(sortedProducts);
}

function displayProducts(filteredProducts) {
    const productContainer = document.getElementById('productContainer');
    productContainer.innerHTML = '';
    filteredProducts.forEach(product => {
        const productCard = `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Price: $${product.price}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        productContainer.innerHTML += productCard;
    });
}
