// checkout.js
document.addEventListener("DOMContentLoaded", () => {
    updateCartSummary();

    const checkoutForm = document.getElementById("checkoutForm");
    checkoutForm.addEventListener("submit", function(event) {
        event.preventDefault();

        // Collect user information
        const orderData = {
            customerInfo: {
                name: document.getElementById("name").value,
                address: document.getElementById("address").value,
                phone: document.getElementById("phone").value
            },
            items: cart,
            totalAmount: parseFloat(document.getElementById("finalTotal").textContent),
            shippingCost: parseFloat(document.getElementById("shippingCost").textContent),
            paymentMethod: "Cash on Delivery"
        };

        try {
            // Place the order
            const order = orderManager.placeOrder(orderData);
            
            // Show success message
            showOrderConfirmation(order);

            // Clear the cart
            localStorage.removeItem('cart');
            cart = [];
            updateCartSummary();

            // Redirect to order confirmation page after a short delay
            setTimeout(() => {
                window.location.href = `index.html`;
            }, 2000);

        } catch (error) {
            console.error('Error placing order:', error);
            showErrorMessage("There was an error placing your order. Please try again.");
        }
    });
});

function showOrderConfirmation(order) {
    const orderMessage = document.getElementById("orderMessage");
    orderMessage.innerHTML = `
        <div class="order-success">
            <i class="fas fa-check-circle"></i>
            <h3>Order Placed Successfully!</h3>
            <p>Order ID: ${order.orderId}</p>
            <p>Thank you for shopping with us!</p>
        </div>
    `;
    orderMessage.classList.add("success");
}

function showErrorMessage(message) {
    const orderMessage = document.getElementById("orderMessage");
    orderMessage.innerHTML = `
        <div class="order-error">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
        </div>
    `;
    orderMessage.classList.add("error");
}

function updateCartSummary() {
    // Get cart from localStorage
    cart = JSON.parse(localStorage.getItem('cart')) || [];

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const total = subtotal + shipping;

    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalPrice').textContent = subtotal.toFixed(2);
    document.getElementById('shippingCost').textContent = shipping.toFixed(2);
    document.getElementById('finalTotal').textContent = total.toFixed(2);
}
// Add this to show loading and success/error states
async function handleOrderSubmission(orderData) {
    const submitButton = document.querySelector('#checkoutForm button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = 'Processing...';

    try {
        const order = orderManager.placeOrder(orderData);
        await sendOrderConfirmationEmail(order);
        
        showSuccessMessage('Order placed and confirmation email sent!');
        // Clear cart and redirect
    } catch (error) {
        showErrorMessage('Order placed but email could not be sent. Please check your email address.');
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Place Order';
    }
}
// checkout.js

// Initialize EmailJS
(function() {
    emailjs.init("FfaX8DQ1nRiTBL-gs"); // Add your EmailJS public key here
})();

document.addEventListener("DOMContentLoaded", () => {
    updateCartSummary();

    const checkoutForm = document.getElementById("checkoutForm");
    checkoutForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        // Collect user information
        const orderData = {
            customerInfo: {
                name: document.getElementById("name").value,
                address: document.getElementById("address").value,
                phone: document.getElementById("phone").value,
                email: document.getElementById("email").value // Make sure you have an email input field
            },
            items: cart,
            totalAmount: parseFloat(document.getElementById("finalTotal").textContent),
            shippingCost: parseFloat(document.getElementById("shippingCost").textContent),
            paymentMethod: "Cash on Delivery"
        };

        try {
            // Place the order
            const order = orderManager.placeOrder(orderData);
            
            // Show success message
            showOrderConfirmation(order);

            // Send confirmation email
            await sendOrderConfirmationEmail(order);

            // Clear the cart
            localStorage.removeItem('cart');
            cart = [];
            updateCartSummary();

            // Redirect to home page after a short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);

        } catch (error) {
            console.error('Error placing order:', error);
            showErrorMessage("There was an error placing your order. Please try again.");
        }
    });
});

async function sendOrderConfirmationEmail(order) {
    try {
        // Format items for email
        const itemsList = order.items.map(item => 
            `${item.name} - Quantity: ${item.quantity} - Price: $${(item.price * item.quantity).toFixed(2)}`
        ).join('\n');

        const templateParams = {
            to_name: order.customerInfo.name,
            to_email: order.customerInfo.email,
            order_id: order.orderId,
            order_date: new Date(order.orderDate).toLocaleDateString(),
            items: itemsList,
            subtotal: (order.totalAmount - order.shippingCost).toFixed(2),
            shipping: order.shippingCost.toFixed(2),
            total: order.totalAmount.toFixed(2),
            shipping_address: order.customerInfo.address,
            phone: order.customerInfo.phone
        };

        const response = await emailjs.send(
            'service_lu798jf', // Add your EmailJS service ID
            'template_4wlv4tf', // Add your EmailJS template ID
            templateParams
        );

        console.log('Email sent successfully:', response);
        return response;

    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
}
