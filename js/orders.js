// orders.js
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
        this.saveOrders();
        return order;
    }

    getOrders() {
        return this.orders;
    }

    getOrderById(orderId) {
        return this.orders.find(order => order.orderId === orderId);
    }

    updateOrderStatus(orderId, status) {
        const order = this.getOrderById(orderId);
        if (order) {
            order.status = status;
            this.saveOrders();
            return true;
        }
        return false;
    }

    saveOrders() {
        localStorage.setItem('orders', JSON.stringify(this.orders));
    }
}

const orderManager = new OrderManager();
