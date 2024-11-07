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
