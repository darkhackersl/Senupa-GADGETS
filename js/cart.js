// cart.js
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId) {
    cart.push(productId);
    localStorage.setItem('cart', JSON.stringify(cart));
}

function displayCart() {
    const cartContainer = document.getElementById('cartContainer');
    cartContainer.innerHTML = '';
    cart.forEach(productId => {
        const product = products.find(p => p.id === productId);
        const cartItem = `
            <div class="cart-item">
                <img src="${product.image}" alt="${product.name}" class="cart-item-image">
                <h3>${product.name}</h3>
                <p>Price: $${product.price}</p>
            </div>
        `;
        cartContainer.innerHTML += cartItem;
    });
}
