// cart.js

class ShoppingCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.updateCartDisplay();
            this.updateCartIcon();
            this.setupCheckoutButton();
            this.setupAddToCartButtons();
        });
    }

    setupCheckoutButton() {
        const checkoutButton = document.getElementById('checkoutButton');
        if (checkoutButton) {
            checkoutButton.addEventListener('click', () => this.proceedToCheckout());
        }
    }

    setupAddToCartButtons() {
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = parseInt(event.target.dataset.productId);
                this.addToCart(productId);
            });
        });
    }

    addToCart(productId) {
        try {
            const product = this.getProductById(productId);
            
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
                    brand: product.brand || 'Generic'
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

    removeFromCart(productId) {
        try {
            const index = this.cart.findIndex(item => item.id === productId);
            
            if (index > -1) {
                this.cart.splice(index, 1);
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

    updateQuantity(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            const newQuantity = item.quantity + change;
            if (newQuantity > 0) {
                item.quantity = newQuantity;
            } else {
                this.removeFromCart(productId);
            }
            this.saveCart();
            this.updateCartDisplay();
            this.updateCartIcon();
        }
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartDisplay();
        this.updateCartIcon();
        this.showNotification('Cart cleared');
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

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

        const cartItemsContainer = document.createElement('div');
        cartItemsContainer.className = 'cart-items';

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
                        <button class="quantity-btn minus" onclick="shoppingCart.updateQuantity(${item.id}, -1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" onclick="shoppingCart.updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <p class="item-total">Total: $${itemTotal.toFixed(2)}</p>
                </div>
                <button class="remove-item" onclick="shoppingCart.removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        cartContainer.appendChild(cartItemsContainer);

        const summarySection = document.createElement('div');
        summarySection.className = 'cart-summary';
        summarySection.innerHTML = `
            <h3>Cart Summary</h3>
            <div class="summary-details">
                <p>Total Items: <span id="totalItems">${this.getTotalItems()}</span></p>
                <p>Subtotal: <span>$${totalAmount.toFixed(2)}</span></p>
                <p>Tax (10%): <span>$${(totalAmount * 0.1).toFixed(2)}</span></p>
                <p class="total">Total Amount: <span id="totalPrice">$${(totalAmount * 1.1).toFixed(2)}</span></p>
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

    updateCartIcon() {
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            const totalItems = this.getTotalItems();
            cartIcon.setAttribute('data-count', totalItems);
            cartIcon.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }

    getTotalItems() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    proceedToCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty', 'error');
            return;
        } const isLoggedIn = localStorage.getItem('userEmail');
        if (!isLoggedIn) {
            this.showNotification('Please login to checkout', 'error'); 
            window.location.href = 'login.html';
            return;
        }

        window.location.href = 'checkout.html';
    }

    getProductById(productId) {
        // This method should return the product object based on the productId
        // Assuming products is a global variable or can be fetched from an API
        return products.find(product => product.id === productId);
    }
}

const shoppingCart = new ShoppingCart();
window.shoppingCart = shoppingCart; ```javascript
// cart.js

class ShoppingCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.updateCartDisplay();
            this.updateCartIcon();
            this.setupCheckoutButton();
            this.setupAddToCartButtons();
        });
    }

    setupCheckoutButton() {
        const checkoutButton = document.getElementById('checkoutButton');
        if (checkoutButton) {
            checkoutButton.addEventListener('click', () => this.proceedToCheckout());
        }
    }

    setupAddToCartButtons() {
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = parseInt(event.target.dataset.productId);
                this.addToCart(productId);
            });
        });
    }

    addToCart(productId) {
        try {
            const product = this.getProductById(productId);
            
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
                    brand: product.brand || 'Generic'
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

    removeFromCart(productId) {
        try {
            const index = this.cart.findIndex(item => item.id === productId);
            
            if (index > -1) {
                this.cart.splice(index, 1);
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

    updateQuantity(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            const newQuantity = item.quantity + change;
            if (newQuantity > 0) {
                item.quantity = newQuantity;
            } else {
                this.removeFromCart(productId);
            }
            this.saveCart();
            this.updateCartDisplay();
            this.updateCartIcon();
        }
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartDisplay();
        this.updateCartIcon();
        this.showNotification('Cart cleared');
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

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

        const cartItemsContainer = document.createElement('div');
        cartItemsContainer.className = 'cart-items';

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
                        <button class="quantity-btn minus" onclick="shoppingCart.updateQuantity(${item.id}, -1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" onclick="shoppingCart.updateQuantity(${item.id}, 1)">+</button>
 </div>
                    <p class="item-total">Total: $${itemTotal.toFixed(2)}</p>
                </div>
                <button class="remove-item" onclick="shoppingCart.removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        cartContainer.appendChild(cartItemsContainer);

        const summarySection = document.createElement('div');
        summarySection.className = 'cart-summary';
        summarySection.innerHTML = `
            <h3>Cart Summary</h3>
            <div class="summary-details">
                <p>Total Items: <span id="totalItems">${this.getTotalItems()}</span></p>
                <p>Subtotal: <span>$${totalAmount.toFixed(2)}</span></p>
                <p>Tax (10%): <span>$${(totalAmount * 0.1).toFixed(2)}</span></p>
                <p class="total">Total Amount: <span id="totalPrice">$${(totalAmount * 1.1).toFixed(2)}</span></p>
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

    updateCartIcon() {
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            const totalItems = this.getTotalItems();
            cartIcon.setAttribute('data-count', totalItems);
            cartIcon.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }

    getTotalItems() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    proceedToCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty', 'error');
            return;
        }
        const isLoggedIn = localStorage.getItem('userEmail');
        if (!isLoggedIn) {
            this.showNotification('Please login to checkout', 'error'); 
            window.location.href = 'login.html';
            return;
        }

        window.location.href = 'checkout.html';
    }

    getProductById(productId) {
        // This method should return the product object based on the productId
        // Assuming products is a global variable or can be fetched from an API
        return products.find(product => product.id === productId);
    }
}

const shoppingCart = new ShoppingCart();
window.shoppingCart = shoppingCart;
