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
            // Ensure products is defined and accessible
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

    // ... (rest of the methods remain the same)

}

const shoppingCart = new ShoppingCart();
window.shoppingCart = shoppingCart;
// Initialize cart display when the page loads
document.addEventListener('DOMContentLoaded', updateCartDisplay);
