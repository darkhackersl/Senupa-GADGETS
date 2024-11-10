$(document).ready(function() {
    // Load orders when the page is ready
    loadOrders();

    function loadOrders() {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const ordersTableBody = $('#ordersTable tbody');
        ordersTableBody.empty(); // Clear existing rows

        orders.forEach(order => {
            const orderRow = `
                <tr>
                    <td>${order.orderId}</td>
                    <td>${order.customerInfo.name}</td>
                    <td>$${order.totalAmount.toFixed(2)}</td>
                    <td>
                        <select onchange="updateOrderStatus('${order.orderId}', this.value)">
                            <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                            <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
                            <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                            <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                        </select>
                    </td>
                    <td><button onclick="viewOrderDetails('${order.orderId}')">View</button></td>
                </tr>
            `;
            ordersTableBody.append(orderRow);
        });
    }

    // Function to update order status
    window.updateOrderStatus = function(orderId, status) {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const order = orders.find(o => o.orderId === orderId);
        if (order) {
            order.status = status;
            localStorage.setItem('orders', JSON.stringify(orders));
            loadOrders(); // Refresh the order list
        }
    }

    // Function to view order details (placeholder)
    window.viewOrderDetails = function(orderId) {
        alert(`Viewing details for Order ID: ${orderId}`);
        // You can implement a modal or redirect to a detailed order page
    }
});
