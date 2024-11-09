// js/cart.js

// Constants
const SHIPPING_COST = 5.99;
const FREE_SHIPPING_THRESHOLD = 50.00;

// Initialize the cart from localStorage or start with an empty array
// js/cart.js

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Add to cart function
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show notification
    alert('Product added to cart!');
    
    // Update cart display
    updateCartDisplay();
}

// Display cart items
function updateCartDisplay() {
    const cartContainer = document.getElementById('cartContainer');
    if (!cartContainer) return;

    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty</p>';
        return;
    }

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>Price: Rs.${item.price.toFixed(2)}</p>
                <p>Quantity: ${item.quantity}</p>
                <div class="quantity-controls">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button onclick="removeFromCart(${item.id})" class="remove-btn">
                    Remove
                </button>
            </div>
        `;
        cartContainer.appendChild(cartItem);
    });

    updateCartSummary();
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

// Update cart summary
function updateCartSummary() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 50 ? 0 : 5.99;
    const total = subtotal + shipping;

    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalPrice').textContent = subtotal.toFixed(2);
    document.getElementById('shippingCost').textContent = shipping.toFixed(2);
    document.getElementById('finalTotal').textContent = total.toFixed(2);
}

function initializeCheckoutButton() {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (!checkoutBtn) return;

    checkoutBtn.addEventListener('click', function(e) {
        e.preventDefault();

        // Check if cart is empty
        if (cart.length === 0) {
            alert('Your cart is empty! Please add items before proceeding.');
            this.classList.add('disabled');
            return;
        }

        // Add click animation
        this.classList.add('clicked');
        
        // Add loading state
        this.classList.add('loading');
        this.innerHTML = `
            <span class="button-content">
                <i class="fas fa-spinner fa-spin"></i>
                <span class="button-text">Processing...</span>
            </span>
        `;

        // Simulate processing
        setTimeout(() => {
            // Remove loading state
            this.classList.remove('loading');
            this.classList.remove('clicked');
            
            // Add success state
            this.classList.add('success');
            this.innerHTML = `
                <span class="button-content">
                    <i class="fas fa-check"></i>
                    <span class="button-text">Proceeding to Checkout...</span>
                </span>
            `;

            // Redirect to checkout page
            setTimeout(() => {
                window.location.href = 'checkout.html';
            }, 500);
        }, 1000);
    });

    // Update button state based on cart
    updateCheckoutButtonState();
}

function updateCheckoutButtonState() {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (!checkoutBtn) return;

    if (cart.length === 0) {
        checkoutBtn.classList.add('disabled');
        checkoutBtn.setAttribute('disabled', 'disabled');
    } else { checkoutBtn.classList.remove('disabled');
        checkoutBtn.removeAttribute('disabled');
    }
}

// Initialize the checkout button when the page loads
document.addEventListener('DOMContentLoaded', initializeCheckoutButton);

// Initialize cart display when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
    
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }
});
