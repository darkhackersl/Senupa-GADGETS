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
    // Get UI elements
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const logoutBtn = document.getElementById('logoutBtn');

    // Function to update UI based on auth state
    function updateUI(user) {
        if (user) {
            // User is signed in
            if (userInfo) userInfo.style.display = 'inline-flex';
            if (loginLink) loginLink.style.display = 'none';
            if (registerLink) registerLink.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'inline-block';

            // Get user data from Firestore
            firebase.firestore().collection('users').doc(user.uid).get()
                .then((doc) => {
                    if (doc.exists) {
                        const userData = doc.data();
                        if (userName) userName.textContent = userData.username || 'User';
                        if (userEmail) userEmail.textContent = user.email;
                    }
                })
                .catch((error) => {
                    console.error("Error getting user data:", error);
                });
        } else {
            // User is signed out
            if (userInfo) userInfo.style.display = 'none';
            if (loginLink) loginLink.style.display = 'inline-block';
            if (registerLink) registerLink.style.display = 'inline-block';
            if (logoutBtn) logoutBtn.style.display = 'none';
        }
    }

    // Listen for auth state changes
    firebase.auth().onAuthStateChanged((user) => {
        updateUI(user);
    });

    // Handle logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            firebase.auth().signOut().then(() => {
                // Clear any stored user data
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userId');
                window.location.href = 'login.html';
            }).catch((error) => {
                console.error('Logout error:', error);
                alert('Error logging out: ' + error.message);
            });
        });
    }
});

