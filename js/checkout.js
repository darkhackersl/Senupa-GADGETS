// Constants
const SHIPPING_COST = 5.99;
const FREE_SHIPPING_THRESHOLD = 50.00;

// Initialize EmailJS
(function() {
    emailjs.init("FfaX8DQ1nRiTBL-gs");
})();

// Get cart from localStorage or initialize empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Check if cart is empty and redirect if necessary
document.addEventListener('DOMContentLoaded', function() {
    if (!cart || cart.length === 0) {
        alert('Your cart is empty! Please add items before checkout.');
        window.location.href = 'products.html';
        return;
    }

    // Initialize the page
    updateCartSummary();
    setupCheckoutForm();
    displayCartItems();
});

function displayCartItems() {
    const cartContainer = document.getElementById('cartItems');
    if (!cartContainer) return;

    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>Quantity: ${item.quantity}</p>
                <p>Price: $${(item.price * item.quantity).toFixed(2)}</p>
            </div>
        </div>
    `).join('');
}

function updateCartSummary() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const total = subtotal + shipping;

    // Update DOM elements
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalPrice').textContent = subtotal.toFixed(2);
    document.getElementById('shippingCost').textContent = shipping.toFixed(2);
    document.getElementById('finalTotal').textContent = total.toFixed(2);
}

function setupCheckoutForm() {
    const form = document.getElementById('checkoutForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitButton = this.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

        try {
            const orderData = {
                customerInfo: {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    address: document.getElementById('address').value,
                    phone: document.getElementById('phone').value
                },
                items: cart,
                totalAmount: parseFloat(document.getElementById('finalTotal').textContent),
                shippingCost: parseFloat(document.getElementById('shippingCost').textContent),
                paymentMethod: 'Cash on Delivery',
                orderDate: new Date().toISOString()
            };

            // Save order to localStorage
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            const orderId = `ORD${Date.now()}`;
            const order = { ...orderData, orderId };
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));

            // Try to send confirmation email
            try {
                await sendOrderConfirmationEmail(order);
            } catch (emailError) {
                console.error('Email sending failed:', emailError);
                // Continue with order process even if email fails
            }

            // Show order confirmation to customer
            showOrderConfirmation(order);

            // Clear cart
            localStorage.removeItem('cart');
            cart = [];

            // Redirect after delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 5000); // Increased to 5 seconds to give customer time to read the message

        } catch (error) {
            console.error('Order processing failed:', error);
            showErrorMessage('Failed to process order. Please try again.');
            submitButton.disabled = false;
            submitButton.innerHTML = 'Place Order';
        }
    });
}
// Add this function in checkout.js
function showOrderConfirmation(order) {
    const messageDiv = document.getElementById('orderMessage');
    if (!messageDiv) return;

    messageDiv.innerHTML = `
        <div class="success-message">
            <i class="fas fa-check-circle"></i>
            <h3>Order Placed Successfully!</h3>
            <p>Order ID: ${order.orderId}</p>
            <p>Thank you for your order, ${order.customerInfo.name}!</p>
            <p>We've sent a confirmation email to ${order.customerInfo.email}.</p>
            <p>You will be redirected to the homepage shortly.</p>
        </div>
    `;
    messageDiv.classList.add('show');
}

async function sendOrderConfirmationEmail(order) {
    const itemsList = order.items.map(item => 
        `${item.name} - Quantity: ${item.quantity} - Price: $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const templateParams = {
        to_name: "MR Gadgets", // Change this to your name or "Admin"
        to_email: "thenulapanapiti219@gmail.com", // Change this to your email address
        customer_name: order.customerInfo.name,
        customer_email: order.customerInfo.email,
        order_id: order.orderId,
        order_date: new Date().toLocaleDateString(),
        items: itemsList,
        subtotal: (order.totalAmount - order.shippingCost).toFixed(2),
        shipping: order.shippingCost.toFixed(2),
        total: order.totalAmount.toFixed(2),
        shipping_address: order.customerInfo.address,
        phone: order.customerInfo.phone

    };

    try {
        const response = await emailjs.send(
            'service_lu798jf', // Your EmailJS service ID
            'template_4wlv4tf', // Your EmailJS template ID
            templateParams
        );
        console.log('Email sent successfully:', response);
        return response;
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
}

function showSuccessMessage(message) {
    const messageDiv = document.getElementById('orderMessage');
    if (!messageDiv) return;

    messageDiv.innerHTML = `
        <div class="success-message">
            <i class="fas fa-check-circle"></i>
            <p>${message}</p>
        </div>
    `;
    messageDiv.classList.add('show');
}

function showErrorMessage(message) {
    const messageDiv = document.getElementById('orderMessage');
    if (!messageDiv) return;

    messageDiv.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
        </div>
    `;
    messageDiv.classList.add('show');
}

// Add this to handle errors globally
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
});
