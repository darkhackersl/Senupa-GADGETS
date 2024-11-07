// Constants for shipping
const SHIPPING_COST = 5.99;  // Flat shipping fee
const FREE_SHIPPING_THRESHOLD = 50.00;  // Minimum cart total for free shipping

let cart = JSON.parse(localStorage.getItem('cart')) || [];

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

function updateLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartDisplay() {
    const cartContainer = document.getElementById('cartContainer');
    if (!cartContainer) return;

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

 // Add the checkout button at the end of the cart items
    const checkoutButton = document.checkoutButton class="add-to-cart">Proceed to Checkout</button>
    checkoutButton.textContent = "Proceed to Checkout";
    checkoutButton.onclick = () => window.location.href = "checkout.html";
    checkoutButton.className = 'checkout-button'; // Optionally, add a class for styling
    cartContainer.appendChild(checkoutButton);
     <button id="checkoutButton" class="add-to-cart">Proceed to Checkout</button>

    updateCartSummary();
}


function updateCartSummary() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Determine shipping cost based on cart total
    const shippingCost = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const finalTotal = totalPrice + shippingCost;

    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);
    document.getElementById('shippingCost').textContent = shippingCost.toFixed(2);
    document.getElementById('finalTotal').textContent = finalTotal.toFixed(2);
}
    // Redirect to checkout page
function proceedToCheckout() {
    window.location.href = "checkout.html";
}

// Initialize cart display when the page loads
document.addEventListener('DOMContentLoaded', updateCartDisplay);

