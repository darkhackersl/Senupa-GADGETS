// Shipping constants
const SHIPPING_COST = 5.99;
const FREE_SHIPPING_THRESHOLD = 50.00;

// Initialize the cart from localStorage or start with an empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to add an item to the cart
function addToCart(productId) {
    // Ensure 'products' array is defined and accessible
    if (typeof products === 'undefined') {
        console.error('Products array is not defined.');
        return;
    }
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found');
        return;
    }

    // Check if product is already in the cart
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
document.addEventListener('DOMContentLoaded', function () {
    // Get the checkout button by its ID
    const checkoutBtn = document.getElementById('checkout-btn');

    // Ensure the button exists
    if (!checkoutBtn) {
        console.error('Checkout button not found!');
        return;
    }

    // Add event listener to handle checkout button click
    checkoutBtn.addEventListener('click', function (event) {
        // Prevent default action (e.g., form submission)
        event.preventDefault();

        // Retrieve the cart from localStorage (or use an empty array if nothing is stored)
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

        // Check if the cart is empty
        if (cartItems.length === 0) {
            alert('Your cart is empty! Please add items before proceeding.');
            return;
        }

        // Confirm with the user before proceeding to checkout
        const confirmCheckout = confirm('Are you sure you want to proceed to checkout?');

        // If the user confirms, redirect to the checkout page
        if (confirmCheckout) {
            // Redirecting to the checkout page
            window.location.href = '/checkout';  // Modify the path to your checkout page if needed
        }
    });

    // Optionally, update the cart display on page load
    updateCartDisplay();

    // Function to update the cart display (show number of items in cart, etc.)
    function updateCartDisplay() {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCount = cartItems.length;
        const cartCountDisplay = document.getElementById('cart-count');

        if (cartCountDisplay) {
            // Update the number of items in the cart on the page
            cartCountDisplay.textContent = cartCount;
        }
    }

    // Example: Function to add items to the cart (just for testing or future use)
    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Check if the product is already in the cart
        const existingProductIndex = cart.findIndex(item => item.id === product.id);
        if (existingProductIndex >= 0) {
            // If it exists, update the quantity or any other data
            cart[existingProductIndex].quantity += product.quantity;
        } else {
            // If it doesn't exist, add the product to the cart
            cart.push(product);
        }

        // Save the updated cart back to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Update the cart display
        updateCartDisplay();
    }

    // For example, you can use the addToCart function like this (you might already have a button for this):
    // addToCart({ id: 1, name: 'Product Name', price: 29.99, quantity: 1 });

    // Optional: Handle cart removal (if you have a button for removing items from the cart)
    function removeFromCart(productId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Filter out the product from the cart
        cart = cart.filter(item => item.id !== productId);

        // Save the updated cart back to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Update the cart display
        updateCartDisplay();
    }
});


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

    // Check if cart is empty and show a message if it is
if (cartItems.length === 0) {
  alert('Your cart is empty! Please add items before proceeding.');
  return;
}

    // Display each item in the cart
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

    // Update the cart summary with totals
    updateCartSummary();

   
}


// Function to update the cart summary including shipping
function updateCartSummary() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Determine shipping cost based on the threshold
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

// Initialize cart display on page load
document.addEventListener('DOMContentLoaded', updateCartDisplay);

