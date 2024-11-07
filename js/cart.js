// js/cart.js

// Constants
const SHIPPING_COST = 5.99;
const FREE_SHIPPING_THRESHOLD = 50.00;

// Initialize the cart from localStorage or start with an empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to add an item to the cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found');
        return;
    }

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateLocalStorage();
    updateCartDisplay();
}

// Function to remove an item from the cart
function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
        updateLocalStorage();
        updateCartDisplay();
    }
}

// Function to update the cart data in localStorage
function updateLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to display the cart items and update totals
function updateCartDisplay() {
    const cartContainer = document.getElementById('cartContainer');
    if (!cartContainer) {
        console.error("Cart container not found in HTML.");
        return;
    }

    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
        updateCartSummary();
        return;
    }

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>Price: $${item.price.toFixed(2)}</p>
                <p>Quantity: ${item.quantity}</p>
                <button onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartContainer.appendChild(cartItem);
    });

    updateCartSummary();
}

// Function to update the cart summary including shipping
function updateCartSummary() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const finalTotal = totalPrice + shippingCost;

    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);
    document.getElementById('shippingCost').textContent = shippingCost.toFixed(2);
    document.getElementById('finalTotal').textContent = finalTotal.toFixed(2);

    // Update the checkout button visibility
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.style.display = cart.length > 0 ? 'block' : 'none';
    }
}

// Function to handle checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items before checking out.');
        return;
    }
    // Redirect to checkout page
    window.location.href = "checkout.html";
}

// Initialize cart display on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartDisplay();

    // Add event listener to checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }
});
}

// Initialize cart display on page load
document.addEventListener('DOMContentLoaded', updateCartDisplay);

