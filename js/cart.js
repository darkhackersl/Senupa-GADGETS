// js/cart.js

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

function updateCartSummary() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);
}

// Initialize cart display when the page loads
document.addEventListener('DOMContentLoaded', updateCartDisplay);

// cart.js

class ShoppingCart {
    constructor() {
        // Initialize cart state
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        this.recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
        
        // Cart configuration
        this.config = {
            maxQuantityPerItem: 10,
            minOrderAmount: 10,
            freeShippingThreshold: 50,
            shippingCost: 5.99,
            taxRate: 0.10,
            currency: 'USD'
        };

        // Discount codes
        this.discountCodes = {
            'WELCOME10': { type: 'percentage', value: 10, minAmount: 0 },
            'FREESHIP': { type: 'shipping', value: 100, minAmount: 30 },
            'SAVE20': { type: 'fixed', value: 20, minAmount: 100 },
            'SPECIAL50': { type: 'percentage', value: 50, minAmount: 200 }
        };

        this.appliedDiscount = null;
        this.initializeCart();
    }

    // Initialize cart and set up event listeners
    initializeCart() {
        document.addEventListener('DOMContentLoaded', () => {
            this.updateCartDisplay();
            this.updateCartIcon();
            this.setupEventListeners();
            this.displayRecentlyViewed();
        });
    }

    setupEventListeners() {
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.productId);
                this.addToCart(productId);
            });
        });

        // Quantity inputs
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const productId = parseInt(e.target.dataset.productId);
                const quantity = parseInt(e.target.value);
                this.updateQuantity(productId, quantity);
            });
        });

        // Discount form
        const discountForm = document.getElementById('discountForm');
        if (discountForm) {
            discountForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const code = document.getElementById('discountCode').value;
                this.applyDiscount(code);
            });
        }

        // Checkout button
        const checkoutButton = document.getElementById('checkoutButton');
        if (checkoutButton) {
            checkoutButton.addEventListener('click', () => this.proceedToCheckout());
        }
    }

    // Cart Operations
    addToCart(productId, quantity = 1) {
        try {
            const product = this.getProductById(productId);
            if (!product) throw new Error('Product not found');
            if (!this.isProductAvailable(product)) throw new Error('Product is out of stock');

            const existingItem = this.cart.find(item => item.id === productId);
            
            if (existingItem) {
                if (existingItem.quantity + quantity > this.config.maxQuantityPerItem) {
                    throw new Error(`Maximum quantity allowed is ${this.config.maxQuantityPerItem}`);
                }
                existingItem.quantity += quantity;
            } else {
                this.cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: quantity,
                    brand: product.brand,
                    dateAdded: new Date().toISOString()
                });
            }

            this.saveCart();
            this.updateCartDisplay();
            this.addToRecentlyViewed(productId);
            this.showNotification('Product added to cart successfully!');

        } catch (error) {
            this.showNotification(error.message, 'error');
            console.error('Add to cart error:', error);
        }
    }

    removeFromCart(productId) {
        try {
            const index = this.cart.findIndex(item => item.id === productId);
            if (index > -1) {
                const removedItem = this.cart.splice(index, 1)[0];
                this.saveCart();
                this.updateCartDisplay();
                this.addToRecentlyRemoved(removedItem);
                this.showNotification(`${removedItem.name} removed from cart`);
            }
        } catch (error) {
            this.showNotification('Error removing item from cart', 'error');
            console.error('Remove from cart error:', error);
        }
    }

    updateQuantity(productId, quantity) {
        try {
            const item = this.cart.find(item => item.id === productId);
            if (!item) throw new Error('Item not found in cart');

            if (quantity > this.config.maxQuantityPerItem) {
                throw new Error(`Maximum quantity allowed is ${this.config.maxQuantityPerItem}`);
            }

            if (quantity < 1) {
                this.removeFromCart(productId);
                return;
            }

            item.quantity = quantity;
            this.saveCart();
            this.updateCartDisplay();

        } catch (error) {
            this.showNotification(error.message, 'error');
            console.error('Update quantity error:', error);
        }
    }

    // Price Calculations
    calculateTotal() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        let discount = 0;
        let shipping = subtotal >= this.config.freeShippingThreshold ? 0 : this.config.shippingCost;

        if (this.appliedDiscount) {
            if (this.appliedDiscount.type === 'percentage') {
                discount = subtotal * (this.appliedDiscount.value / 100);
            } else if (this.appliedDiscount.type === 'fixed') {
                discount = this.appliedDiscount.value;
            } else if (this.appliedDiscount.type === 'shipping') {
                shipping = 0;
            }
        }

        const tax = (subtotal - discount) * this.config.taxRate;
        const total = subtotal - discount + shipping + tax;

        return {
            subtotal,
            discount,
            shipping,
            tax,
            total
        };
    }

    // Display Updates
    updateCartDisplay() {
        const cartContainer = document.getElementById('cartContainer');
        if (!cartContainer) return;

        if (this.cart.length === 0) {
            cartContainer.innerHTML = this.getEmptyCartHTML();
            return;
        }

        const cartHTML = `
            <div class="cart-items">
                ${this.cart.map(item => this.createCartItemHTML(item)).join('')}
            </div>
            <div class="cart-summary">
                ${this.createCartSummaryHTML()}
            </div>
        `;

        cartContainer.innerHTML = cartHTML;
        this.updateCartIcon();
    }

    createCartItemHTML(item) {
        return `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="brand">${item.brand}</p>
                    <p class="price">${this.formatPrice(item.price)}</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" onclick="shoppingCart.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <input type="number" class="quantity-input" 
                            value="${item.quantity}" 
                            min="1"  max="${this.config.maxQuantityPerItem}" 
                            data-product-id="${item.id}">
                        <button class="quantity-btn plus" onclick="shoppingCart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <button class="remove-btn" onclick="shoppingCart.removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        `;
    }

    createCartSummaryHTML() {
        const totals = this.calculateTotal();
        return `
            <h2>Cart Summary</h2>
            <p>Subtotal: ${this.formatPrice(totals.subtotal)}</p>
            <p>Discount: ${this.formatPrice(totals.discount)}</p>
            <p>Shipping: ${this.formatPrice(totals.shipping)}</p>
            <p>Tax: ${this.formatPrice(totals.tax)}</p>
            <h3>Total: ${this.formatPrice(totals.total)}</h3>
            <button id="checkoutButton">Proceed to Checkout</button>
        `;
    }

    formatPrice(amount) {
        return `${this.config.currency} ${amount.toFixed(2)}`;
    }

    // Notification System
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerText = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    // Local Storage Management
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    // Additional Methods
    getProductById(productId) {
        // This method should return the product object based on the productId
        // Placeholder implementation
        return { id: productId, name: 'Sample Product', price: 29.99, image: 'path/to/image.jpg', brand: 'Sample Brand' };
    }

    isProductAvailable(product) {
        // Placeholder implementation for product availability check
        return true;
    }

    addToRecentlyViewed(productId) {
        // Logic to add product to recently viewed
    }

    addToRecentlyRemoved(removedItem) {
        // Logic to handle recently removed items
    }

    proceedToCheckout() {
        // Logic to handle checkout process
        alert('Proceeding to checkout...');
    }

    displayRecentlyViewed() {
        // Logic to display recently viewed products
    }
}

// Initialize the shopping cart
const shoppingCart = new ShoppingCart();
