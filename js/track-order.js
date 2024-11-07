function trackOrder() {
    const orderId = document.getElementById('orderIdInput').value.trim();
    if (!orderId) {
        showError('Please enter an order ID');
        return;
    }

    // Get orders from localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.orderId === orderId);

    if (!order) {
        showError('Order not found. Please check the order ID and try again.');
        return;
    }

    displayOrderTracking(order);
}

function displayOrderTracking(order) {
    const trackingResult = document.getElementById('trackingResult');
    trackingResult.classList.remove('hidden');

    // Calculate the order status based on time passed (this is a simple example)
    const orderDate = new Date(order.orderDate);
    const now = new Date();
    const hoursPassed = (now - orderDate) / (1000 * 60 * 60);
    
    let status;
    if (hoursPassed < 1) status = 'Order Placed';
    else if (hoursPassed < 24) status = 'Processing';
    else if (hoursPassed < 48) status = 'Shipped';
    else status = 'Delivered';

    const steps = [
        { title: 'Order Placed', date: formatDate(orderDate), completed: true },
        { title: 'Processing', date: formatDate(addHours(orderDate, 24)), completed: hoursPassed >= 24 },
        { title: 'Shipped', date: formatDate(addHours(orderDate, 48)), completed: hoursPassed >= 48 },
        { title: 'Delivered', date: formatDate(addHours(orderDate, 72)), completed: hoursPassed >= 72 }
    ];

    trackingResult.innerHTML = `
        <div class="order-info">
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> ${order.orderId}</p>
            <p><strong>Order Date:</strong> ${formatDate(orderDate)}</p>
            <p><strong>Status:</strong> ${status}</p>
        </div>
        <div class="tracking-timeline">
            ${steps.map((step, index) => `
