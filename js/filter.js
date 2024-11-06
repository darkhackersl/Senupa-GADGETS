// filter.js
const products = []; // Replace with your products data

function filterProducts() {
    const category = document.getElementById('categoryFilter').value;
    const priceRange = document.getElementById('priceRange').value;
    const filteredProducts = products.filter(product => {
        return (category === "" || product.category === category) &&
               (product.price <= priceRange);
    });
    displayProducts(filteredProducts);
}

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
