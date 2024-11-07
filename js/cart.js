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
