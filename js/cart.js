// js/cart.js

class ShoppingCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.initializeEventListeners();
    }

    // Initialize event listeners
    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.updateCartDisplay();
            this.updateCartIcon();
        });

        // Add event listener for checkout button if it exists
        const checkoutButton = document.getElementById('checkoutButton');
        if (checkoutButton) {
            checkoutButton.addEventListener('click', () => this.proceedToCheckout());
        }
    }

    // Add item to cart
    addToCart(productId) {
        try {
            const product = products.find(p => p.id === productId);
            
            if (!product) {
                throw new Error('Product not found');
            }

            const existingItem = this.cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1,
                    brand: product.brand
                });
            }

            this.saveCart();
            this.updateCartDisplay();
            this.updateCartIcon();
            this.showNotification('Product added to cart successfully!');

        } catch (error) {
            console.error('Error adding to cart:', error);
            this.showNotification('Failed to add product to cart', 'error');
        }
    }

    // Remove item from cart
    removeFromCart(productId) {
        try {
            const index = this.cart.findIndex(item => item.id === productId);
            
            if (index > -1) {
                if (this.cart[index].quantity > 1) {
                    this.cart[index].quantity -= 1;
                } else {
                    this.cart.splice(index, 1);
                }
                
                this.saveCart();
                this.updateCartDisplay();
                this.updateCartIcon();
                this.showNotification('Product removed from cart');
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
            this.showNotification('Failed to remove product', 'error');
        }
    }

    // Clear entire cart
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartDisplay();
        this.updateCartIcon();
        this.showNotification('Cart cleared');
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    // Update cart display
    updateCartDisplay() {
        const cartContainer = document.getElementById('cartContainer');
        if (!cartContainer) return;

        cartContainer.innerHTML = '';

        if (this.cart.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-cart">
                    <h3>Your cart is empty</h3>
                    <p>Add some products to your cart</p>
                    <a href="products.html" class="continue-shopping">Continue Shopping</a>
                </div>`;
            return;
        }

        let totalAmount = 0;

        this.cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalAmount += itemTotal;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="brand">${item.brand}</p>
                    <p class="price">$${item.price.toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button onclick="shoppingCart.removeFromCart(${item.id})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="shoppingCart.addToCart(${item.id})">+</button>
                    </div>
                    <p class="item-total">Total: $${itemTotal.toFixed(2)}</p>
                </div>
                <button class="remove-item" onclick="shoppingCart.removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartContainer.appendChild(cartItem);
        });

        // Add cart summary
        const summarySection = document.createElement('div');
        summarySection.className = 'cart-summary';
        summarySection.innerHTML = `
            <h3>Cart Summary</h3>
            <div class="summary-details">
                <p>Total Items: <span id="totalItems">${this.getTotalItems()}</span></p>
                <p>Total Amount: <span id="totalPrice">$${totalAmount.toFixed(2)}</span></p>
            </div>
            <button id="checkoutButton" class="checkout-button">
                Proceed to Checkout
            </button>
            <button onclick="shoppingCart.clearCart()" class="clear-cart-button">
                Clear Cart
            </button>
        `;
        cartContainer.appendChild(summarySection);
    }

    // Update cart icon in header
    updateCartIcon() {
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            const totalItems = this.getTotalItems();
            cartIcon.setAttribute('data-count', totalItems);
            cartIcon.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }

    // Get total number of items in cart
    getTotalItems() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Show notification
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Proceed to checkout
    proceedToCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty', 'error');
            return;
        }

        // Check if user is logged in
        const isLoggedIn = localStorage.getItem('userEmail');
        if (!isLoggedIn) {
            this.showNotification('Please login to checkout', 'error');
            window.location.href = 'login.html';
            return;
        }

        // Proceed to checkout page
        window.location.href = 'checkout.html';
    }
}

// Initialize shopping cart
const shoppingCart = new ShoppingCart();

// Make it globally accessible
window.shoppingCart = shoppingCart;
