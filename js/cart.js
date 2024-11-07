// js/cart.js

// Constants
const SHIPPING_COST = 5.99;
const FREE_SHIPPING_THRESHOLD = 50.00;

class ShoppingCart {
    constructor() {
        this.cart = [];
        this.loadCartFromStorage();
        this.updateCartDisplay();
    }

    loadCartFromStorage() {
        try {
            const savedCart = localStorage.getItem('cart');
            this.cart = savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error('Error loading cart from storage:', error);
            this.cart = [];
        }
    }

    saveCartToStorage() {
        try {
            localStorage.setItem('cart', JSON.stringify(this.cart));
        } catch (error) {
            console.error('Error saving cart to storage:', error);
            this.showNotification('Error saving cart', 'error');
        }
    }

    addToCart(productId) {
        try {
            if (typeof products === 'undefined' || !Array.isArray(products)) {
                throw new Error('Products data is not available');
            }

            const product = products.find(p => p.id === productId);
            if (!product) {
                throw new Error('Product not found');
            }

            const existingItem = this.cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.cart.push({ ...product, quantity: 1 });
            }

            this.saveCartToStorage();
            this.updateCartDisplay();
            this.showNotification('Product added to cart', 'success');
        } catch (error) {
            console.error('Error adding to cart:', error);
            this.showNotification(error.message, 'error');
        }
    }

    removeFromCart(productId) {
        try {
            const index = this.cart.findIndex(item => item.id === productId);
            if (index !== -1) {
                if (this.cart[index].quantity > 1) {
                    this.cart[index].quantity -= 1;
                } else {
                    this.cart.splice(index, 1);
                }
                this.saveCartToStorage();
                this.updateCartDisplay();
                this.showNotification('Product removed from cart', 'success');
            } else {
                throw new Error('Product not found in cart');
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
            this.showNotification(error.message, 'error');
        }
    }

    updateCartDisplay() {
        const cartContainer = document.getElementById('cartContainer');
        if (!cartContainer) {
            console.error("Cart container not found in HTML.");
            return;
        }

        cartContainer.innerHTML = '';

        if (this.cart.length === 0) {
            cartContainer.innerHTML = '<p>Your cart is empty.</p>';
            return;
        }

        this.cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>Price: $${item.price.toFixed(2)}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <button onclick="shoppingCart.removeFromCart(${item.id})">Remove</button>
                </div>
            `;
            cartContainer.appendChild(cartItem);
        });

        this.updateCartSummary();
    }

    updateCartSummary() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
        const finalTotal = subtotal + shippingCost;

        document.getElementById('totalItems').textContent = totalItems;
        document.getElementById('totalPrice').textContent = subtotal.toFixed(2);
        document.getElementById('shippingCost').textContent = shippingCost.toFixed(2);
        document.getElementById('finalTotal').textContent = finalTotal.toFixed(2);
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    checkout() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty', 'error');
            return;
        }

        // Here you would typically integrate with a payment gateway
        // For this example, we'll just simulate a successful checkout
        this.showNotification('Checkout successful! Thank you for your purchase.', 'success');
        this.cart = [];
        this.saveCartToStorage();
        this.updateCartDisplay();

        // Redirect to a thank you page or order confirmation page
        setTimeout(() => {
            window.location.href = 'checkout.html';
        }, 2000);
    }
}

// Initialize the shopping cart
const shoppingCart = new ShoppingCart();

// Event listener for the checkout button
document.addEventListener('DOMContentLoaded', function() {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => shoppingCart.checkout());
    }
});

// Function to add an item to the cart (to be called from product pages)
function addToCart(productId) {
    shoppingCart.addToCart(productId);
}
}

// Initialize cart display on page load
document.addEventListener('DOMContentLoaded', updateCartDisplay);

