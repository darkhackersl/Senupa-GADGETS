// Constants
const SHIPPING_COST = 5.99;
const FREE_SHIPPING_THRESHOLD = 50.00;

// Initialize EmailJS
(function() {
    emailjs.init("FfaX8DQ1nRiTBL-gs");
})();

// Get cart from localStorage or initialize empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

class OrderManager {
    constructor() {
        this.orders = JSON.parse(localStorage.getItem('orders')) || [];
        this.currentOrderId = parseInt(localStorage.getItem('lastOrderId') || '0');
    }

    generateOrderId() {
        this.currentOrderId += 1;
        localStorage.setItem('lastOrderId', this.currentOrderId);
        return `ORD${String(this.currentOrderId).padStart(6, '0')}`;
    }

    placeOrder(orderData) {
        const order = {
            orderId: this.generateOrderId(),
            orderDate: new Date().toISOString(),
            status: 'Pending',
            ...orderData
        };

        this.orders.push(order);
        localStorage.setItem('orders', JSON.stringify(this.orders));
        return order;
    }
}

// Create a single instance of OrderManager
const orderManager = new OrderManager();

document.addEventListener("DOMContentLoaded", () => {
    updateCartSummary();
    setupCheckoutForm();
});

function setupCheckoutForm() {
    const checkoutForm = document.getElementById("checkoutForm");
    if (!checkoutForm) return;

    checkoutForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const submitButton = this.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

        try {
            const orderData = {
                customerInfo: {
                    name: document.getElementById("name").value,
                    email: document.getElementById("email").value,
                    address: document.getElementById("address").value,
                    phone: document.getElementById("phone").value
                },
                items: cart,
                totalAmount: parseFloat(document.getElementById("finalTotal").textContent),
                shippingCost: parseFloat(document.getElementById("shippingCost").textContent),
                paymentMethod: "Cash on Delivery"
            };

            const order = orderManager.placeOrder(orderData);
            
            // Send confirmation email
            try {
                await sendOrderConfirmationEmail(order);
                console.log('Email sent successfully');
            } catch (emailError) {
                console.error('Email sending failed:', emailError);
                // Continue with order process even if email fails
            }

            // Show success message
            showOrderConfirmation(order);

            // Clear cart
            localStorage.removeItem('cart');
            cart = [];

            // Redirect after delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);

        } catch (error) {
            console.error('Order placement failed:', error);
            showErrorMessage("There was an error placing your order. Please try again.");
            submitButton.disabled = false;
            submitButton.innerHTML = 'Place Order';
        }
    });
}

function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const total = subtotal + shipping;

    // Update DOM elements if they exist
    const elements = {
        'totalItems': totalItems,
        'totalPrice': subtotal.toFixed(2),
        'shippingCost': shipping.toFixed(2),
        'finalTotal': total.toFixed(2)
    };

    for (const [id, value] of Object.entries(elements)) {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    }
}

function showOrderConfirmation(order) {
    const orderMessage = document.getElementById("orderMessage");
    if (!orderMessage) return;

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
    if (!orderMessage) return;

    orderMessage.innerHTML = `
        <div class="order-error">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
        </div>
    `;
    orderMessage.classList.add("error");
}

async function sendOrderConfirmationEmail(order) {
    try {
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

        console.log('Sending email with params:', templateParams); // Debug log

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

// Add this to handle errors globally
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
});

// Add this to handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
});

