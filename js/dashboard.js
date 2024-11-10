$(document).ready(function() {
    // Check if user is logged in
    const userEmail = localStorage.getItem('userEmail');
    console.log('User  Email from localStorage:', userEmail); // Debugging line
    if (userEmail) {
        $('#userInfo').text(`Welcome, ${userEmail}`).show();
        $('#userIcon').show(); // Show only the user icon
        $('#loginBtn').hide();
        $('#logoutBtn').show();
    } else {
        console.log('User  is not logged in.'); // Debugging line
        $('#userInfo').hide();
        $('#logoutBtn').hide();
    }

    // Logout functionality
    $('#logoutBtn').click(function() {
        localStorage.removeItem('userEmail');
        location.reload(); // Reload the page to update the UI
    });

    // Load dashboard data
    loadDashboardData();

    // Example function to load dashboard data
    function loadDashboardData() {
        // You can replace this with an AJAX call to fetch data from your server
        console.log('Loading dashboard data...');

        // Placeholder data - replace with actual data fetching logic
        const dashboardData = {
            totalProducts: 120,
            totalOrders: 85,
            totalUsers: 300,
        };

        // Update the dashboard with the fetched data
        $('#dashboardContent').html(`
            <h3>Dashboard Overview</h3>
            <p>Total Products: ${dashboardData.totalProducts}</p>
            <p>Total Orders: ${dashboardData.totalOrders}</p>
            <p>Total Users: ${dashboardData.totalUsers}</p>
        `);
    }

    // Placeholder function for managing products
    function manageProducts() {
        console.log('Managing products...');
        // Add your product management logic here
    }

    // Placeholder function for managing orders
    function manageOrders() {
        console.log('Managing orders...');
        // Add your order management logic here
    }

    // Example event listeners for managing products and orders
    $('#manageProductsBtn').click(manageProducts);
    $('#manageOrdersBtn').click(manageOrders);
});
