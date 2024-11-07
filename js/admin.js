// admin.js
document.addEventListener('DOMContentLoaded', () => {
    displayOrders();

    // Add event listeners for filters
    document.getElementById('statusFilter').addEventListener('change', filterOrders);
    document.getElementById('dateFilter').addEventListener('change', filterOrders);
});

function displayOrders(orders = orderManager.getOrders()) {
    const ordersList = document.getElementById('ordersList');
    ordersList.innerHTML = '';

    orders.forEach(order => {
        const orderElement = createOrderElement(order);
        ordersList.appendChild(orderElement);
    });
}

function createOrderElement(order) {
    const orderDiv = document.createElement('div');
    orderDiv.className = 'order-card';
    orderDiv.innerHTML = `
        <div class="order-header">
            <h3>Order ID: ${order.orderId}</h3>
            <span class="order-date">${new Date(order.orderDate).toLocaleDateString()}</span>
        </div>
        <div class="customer-info">
            <p><strong>Customer:</strong> ${order.customerInfo.name}</p>
            <p><strong>Phone:</strong> ${order.customerInfo.phone}</p>
            <p><strong>Address:</strong> ${order.customerInfo.address}</p>
        </div>
        <div class="order-items">
            ${createOrderItemsList(order.items)}
        </div>
        <div class="order-summary">
            <p><strong>Total Amount:</strong> $${order.totalAmount.toFixed(2)}</p>
            <p><strong>Status:</strong> 
                <select onchange="updateStatus('${order.orderId}', this.value)">
                    <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
                    <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                </select>
            </p>
        </div>
    `;
    return orderDiv;
}

function createOrderItemsList(items) {
    return items.map(item => `
        <div class="order-item">
            <span>${item.name}</span>
            <span>x${item.quantity}</span>
            <span>$${(item.price * item.quantity ).toFixed(2)}</span>
        </div>
    `).join('');
}

function updateStatus(orderId, status) {
    if (orderManager.updateOrderStatus(orderId, status)) {
        displayOrders();
    }
}

function filterOrders() {
    const status = document.getElementById('statusFilter').value;
    const date = document.getElementById('dateFilter').value;
    let filteredOrders = orderManager.getOrders();

    if (status !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === status);
    }

    if (date) {
        filteredOrders = filteredOrders.filter(order => new Date(order.orderDate).toISOString().split('T')[0] === date);
    }

    displayOrders(filteredOrders);
}

function resetFilters() {
    document.getElementById('statusFilter').value = 'all';
    document.getElementById('dateFilter').value = '';
    displayOrders();
}
