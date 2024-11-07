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
    const userInfoContainer = document.getElementById('userInfoContainer');
    const userNameDisplay = document.getElementById('userNameDisplay');
    const userEmailDisplay = document.getElementById('userEmailDisplay');
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const logoutLink = document.getElementById('logoutLink');

    // Check authentication state
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log('User is logged in:', user.email); // Debug log
            
            // Get user data from Firestore
            firebase.firestore().collection('users').doc(user.uid).get()
                .then((doc) => {
                    if (doc.exists) {
                        const userData = doc.data();
                        console.log('User data:', userData); // Debug log

                        // Update display
                        userInfoContainer.style.display = 'inline-block';
                        userNameDisplay.textContent = `Welcome, ${userData.username}`;
                        userEmailDisplay.textContent = user.email;
                        
                        // Update navigation links
                        if (loginLink) loginLink.style.display = 'none';
                        if (registerLink) registerLink.style.display = 'none';
                        if (logoutLink) logoutLink.style.display = 'inline-block';
                    }
                })
                .catch((error) => {
                    console.error("Error getting user data:", error);
                });
        } else {
            console.log('No user logged in'); // Debug log
            
            // Reset display for logged out state
            if (userInfoContainer) userInfoContainer.style.display = 'none';
            if (loginLink) loginLink.style.display = 'inline-block';
            if (registerLink) registerLink.style.display = 'inline-block';
            if (logoutLink) logoutLink.style.display = 'none';
        }
    });

    // Handle logout
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            firebase.auth().signOut()
                .then(() => {
                    console.log('User signed out successfully'); // Debug log
                    window.location.href = 'login.html';
                })
                .catch((error) => {
                    console.error('Logout error:', error);
                });
        });
    }
});
