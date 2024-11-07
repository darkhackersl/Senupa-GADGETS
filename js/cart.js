// cart.js

class ShoppingCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        this.maxQuantityPerItem = 10;
        this.minOrderAmount = 10; // Minimum order amount for checkout
        this.freeShippingThreshold = 50; // Free shipping above this amount
        this.shippingCost = 5.99;
        this.taxRate = 0.10; // 10% tax
        this.discountCodes = {
            'WELCOME10': { type: 'percentage', value: 10 },
            'FREESHIP': { type: 'shipping', value: 100 },
            'SAVE20': { type: 'fixed', value: 20 }
        };
        this.appliedDiscount = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.updateCartDisplay();
            this.updateCartIcon();
            this.setupCheckoutButton();
            this.setupAddToCartButtons();
            this.setupDiscountForm();
            this.setupWishlistButtons();
            this.setupQuantityControls();
            this.setupSearchFilter();
        });
    }

    // Setup Methods
    setupDiscountForm() {
        const discountForm = document.getElementById('discountForm');
        if (discountForm) {
            discountForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const code = document.getElementById('discountCode').value;
                this.applyDiscount(code);
            });
        }
    }

    setupWishlistButtons() {
        const wishlistButtons = document.querySelectorAll('.wishlist-btn');
        wishlistButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.productId);
                this.toggleWishlist(productId);
            });
        });
    }

    setupQuantityControls() {
        const quantityInputs = document.querySelectorAll('.quantity-input');
        quantityInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const productId = parseInt(e.target.dataset.productId);
                const quantity = parseInt(e.target.value);
                this.updateQuantityDirectly(productId, quantity);
            });
        });
    }

    setupSearchFilter() {
        const searchInput = document.getElementById('cartSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterCartItems(e.target.value);
            });
        }
    }

    // Cart Operations
    addToCart(productId, quantity = 1) {
        try {
            const product = this.getProductById(productId);
            
            if (!product) {
                throw new Error('Product not found');
            }

            if (!this.isProductAvailable(product)) {
                throw new Error('Product is out of stock');
            }

            const existingItem = this.cart.find(item => item.id === productId);

            if (existingItem) {
                if (existingItem.quantity + quantity > this.maxQuantityPerItem) {
                    throw new Error(`Maximum quantity per item is ${this.maxQuantityPerItem}`);
                }
                existingItem.quantity += quantity;
            } else {
                this.cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: quantity,
                    brand: product.brand || 'Generic',
                    dateAdded: new Date().toISOString()
                });
            }

            this.saveCart();
            this.updateCartDisplay();
            this.updateCartIcon();
            this.showNotification('Product added to cart successfully!');
            this.removeFromWishlist(productId); // If item was in wishlist

        } catch (error) {
            console.error('Error adding to cart:', error);
            this.showNotification(error.message, 'error');
        }
    }

    removeFromCart(productId) {
        try {
            const index = this.cart.findIndex(item => item.id === productId);
            
            if (index > -1) {
                const removedItem = this.cart.splice(index, 1)[0];
                this.saveCart();
                this.updateCartDisplay();
                this.updateCartIcon();
                this.showNotification(`${removedItem.name} removed from cart`);
                
                // Add to recently removed items
                this.addToRecentlyRemoved(removedItem);
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
            this.showNotification('Failed to remove product', 'error');
        }
    }

    // Wishlist Operations
    toggleWishlist(productId) {
        const index = this.wishlist.indexOf(productId);
        if (index === -1) {
            this.wishlist.push(productId);
            this.showNotification('Added to wishlist');
        } else {
            this.wishlist.splice(index, 1);
            this.showNotification('Removed from wishlist');
        }
        localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
        this.updateWishlistDisplay();
    }

    // Discount and Pricing
    applyDiscount(code) {
        const discount = this.discountCodes[code];
        if (!discount) {
            this.showNotification('Invalid discount code', 'error');
            return;
        }

        this.appliedDiscount = { code, ...discount };
        this.updateCartDisplay();
        this.showNotification('Discount applied successfully!');
    }

    calculateTotal() {
        let subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        let shipping = subtotal >= this.freeShippingThreshold ? 0 : this.shippingCost;
        let discount = 0;

        if (this.appliedDiscount) {
            if (this.appliedDiscount.type === 'percentage') {
                discount = subtotal * (this.appliedDiscount.value / 100);
            } else if (this.appliedDiscount.type === 'fixed') {
                discount = this.appliedDiscount.value;
            } else if (this.appliedDiscount.type === 'shipping') {
                shipping = 0;
            }
        }

        const tax = (subtotal - discount) * this.taxRate;
        const total = subtotal - discount + shipping + tax;

        return {
            subtotal,
            shipping,
            discount,
            tax,
            total
        };
    }

    // Display Updates
    updateCartDisplay() {
        const cartContainer = document.getElementById('cartContainer');
        if (!cartContainer) return;

        cartContainer.innerHTML = '';

        if (this.cart.length === 0) {
            cartContainer.innerHTML = this.getEmptyCartHTML();
            return;
        }

        const cartItemsContainer = document.createElement('div');
        cartItemsContainer.className = 'cart-items';

        // Sort cart items by date added (newest first)
        const sortedCart = [...this.cart].sort((a, b) => 
            new Date(b.dateAdded) - new Date(a.dateAdded)
        );

        sortedCart.forEach(item => {
            cartItemsContainer.appendChild(this.createCartItemElement(item));
        });

        cartContainer.appendChild(cartItemsContainer);
        cartContainer.appendChild(this.createCartSummaryElement());
    }

    createCartItemElement(item) {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt ="${item.name}">
            </div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="brand">${item.brand}</p>
                <p class="price">$${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <input type="number" class="quantity-input" data-product-id="${item.id}" value="${item.quantity}" min="1" max="${this.maxQuantityPerItem}">
                    <button class="remove-item" onclick="shoppingCart.removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <p class="item-total">Total: $${(item.price * item.quantity).toFixed(2)}</p>
            </div>
        `;
        return cartItem;
    }

    createCartSummaryElement() {
        const summary = this.calculateTotal();
        const summarySection = document.createElement('div');
        summarySection.className = 'cart-summary';
        summarySection.innerHTML = `
            <h3>Cart Summary</h3>
            <div class="summary-details">
                <p>Total Items: <span id="totalItems">${this.getTotalItems()}</span></p>
                <p>Subtotal: <span>$${summary.subtotal.toFixed(2)}</span></p>
                <p>Shipping: <span>$${summary.shipping.toFixed(2)}</span></p>
                <p>Discount: <span>-$${summary.discount.toFixed(2)}</span></p>
                <p>Tax: <span>$${summary.tax.toFixed(2)}</span></p>
                <p class="total">Total Amount: <span id="totalPrice">$${summary.total.toFixed(2)}</span></p>
            </div>
            <form id="discountForm">
                <input type="text" id="discountCode" placeholder="Enter discount code">
                <button type="submit">Apply</button>
            </form>
            <button id="checkoutButton" class="checkout-button">
                Proceed to Checkout
            </button>
            <button onclick="shoppingCart.clearCart()" class="clear-cart-button">
                Clear Cart
            </button>
        `;
        return summarySection;
    }

    getEmptyCartHTML() {
        return `
            <div class="empty-cart">
                <h3>Your cart is empty</h3>
                <p>Add some products to your cart</p>
                <a href="products.html" class="continue-shopping">Continue Shopping</a>
            </div>`;
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

        const total = this.calculateTotal().total;
        if (total < this.minOrderAmount) {
            this.showNotification(`Minimum order amount is $${this.minOrderAmount}`, 'error');
            return;
        }

        window.location.href = 'checkout.html';
    }

    getProductById(productId) {
        // This method should return the product object based on the productId
        // Assuming products is a global variable or can be fetched from an API
        return products.find(product => product.id === productId);
    }

    isProductAvailable(product) {
        // Check if the product is available in stock
        return product.stock > 0;
    }

    updateQuantityDirectly(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (quantity > this.maxQuantityPerItem) {
                this.showNotification(`Maximum quantity per item is ${this.maxQuantityPerItem}`, 'error');
                return;
            }
            item.quantity = quantity;
            this.saveCart();
            this.updateCartDisplay();
            this.updateCartIcon();
        }
    }

    addToRecentlyRemoved(item) {
        // Logic to handle recently removed items can be implemented here
        console.log(`${item.name} has been removed from the cart.`);
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
}

const shoppingCart = new ShoppingCart();
window.shoppingCart = shoppingCart;
