// js/cart.js

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId) {
    cart.push(productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartSummary();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartSummary();
}

function displayCart() {
    const cartContainer = document.getElementById('cartContainer');
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    cart.forEach((productId, index) => {
        const product = products.find(p => p.id === productId);
        if (product) {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="cart-item-info">
                    <h3>${product.name}</h3>
                    <p>Price: $${product.price.toFixed(2)}</p>
                    <button onclick="removeFromCart(${index})">Remove</button>
                </div>
            `;
            cartContainer.appendChild(cartItem);
        }
    });
}

function updateCartSummary() {
    const totalItems = cart.length;
    const totalPrice = cart.reduce((total, productId) => {
        const product = products.find(p => p.id === productId);
        return total + (product ? product.price : 0);
    }, 0);

    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);
}

// Checkout function (you can expand this as needed)
document.getElementById('checkoutButton').addEventListener('click', function() {
    alert('Proceeding to checkout. This feature is not yet implemented.');
    // Here you would typically redirect to a checkout page or open a checkout modal
});
