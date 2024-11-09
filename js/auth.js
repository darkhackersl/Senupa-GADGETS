// js/auth.js

// Function to update navigation based on auth state
function updateNavigation() {
    const user = firebase.auth().currentUser;
    const loginLink = document.querySelector('nav a[href="login.html"]');
    const registerLink = document.querySelector('nav a[href="register.html"]');
    const logoutLink = document.getElementById('logoutButton');

    if (user) {
        if (loginLink) loginLink.style.display = 'none';
        if (registerLink) registerLink.style.display = 'none';
        if (!logoutLink) {
            // Add logout button if it doesn't exist
            const nav = document.querySelector('nav');
            const logoutBtn = document.createElement('a');
            logoutBtn.id = 'logoutButton';
            logoutBtn.href = '#';
            logoutBtn.textContent = 'Logout';
            logoutBtn.onclick = logout;
            nav.appendChild(logoutBtn);
        }
    } else {
        if (loginLink) loginLink.style.display = '';
        if (registerLink) registerLink.style.display = '';
        if (logoutLink) logoutLink.remove();
    }
}

// Function to handle logout
function logout() {
    firebase.auth().signOut()
        .then(() => {
            localStorage.removeItem('userEmail');
            window.location.href = 'login.html';
        })
        .catch((error) => {
            alert('Error logging out: ' + error.message);
        });
}

// auth.js
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const userInfo = document.getElementById('userInfo');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const userEmailDisplay = document.getElementById('userEmail');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    // Check authentication state
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is logged in
            console.log('User logged in:', user.email);
            
            // Get user data from Firestore
            firebase.firestore().collection('users').doc(user.uid).get()
                .then((doc) => {
                    if (doc.exists) {
                        const userData = doc.data();
                        
                        // Show user info
                        userInfo.style.display = 'block';
                        welcomeMessage.textContent = `Welcome, ${userData.username}!`;
                        userEmailDisplay.textContent = user.email;
                        
                        // Update navigation buttons
                        loginBtn.style.display = 'none';
                        registerBtn.style.display = 'none';
                        logoutBtn.style.display = 'inline-block';
                    }
                })
                .catch((error) => {
                    console.error("Error getting user data:", error);
                });
        } else {
            // User is logged out
            userInfo.style.display = 'none';
            loginBtn.style.display = 'inline-block';
            registerBtn.style.display = 'inline-block';
            logoutBtn.style.display = 'none';
        }
    });

    // Handle logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            firebase.auth().signOut()
                .then(() => {
                    console.log('User signed out successfully');
                    window.location.href = 'login.html';
                })
                .catch((error) => {
                    console.error('Logout error:', error);
                    alert('Error signing out: ' + error.message);
                });
        });
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // Initialize orders for testing
    const orders = [
        {
            customerInfo: { email: 'user@example.com' },
            orderId: 'ORD12345',
            orderDate: '2023-01-01T00:00:00Z',
            total: 100.00,
            status: 'Delivered'
        },
        // More orders...
    ];
    localStorage.setItem('orders', JSON.stringify(orders));

    // Your existing login code...
});
