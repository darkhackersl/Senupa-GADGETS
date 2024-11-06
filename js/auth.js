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

// Listen for auth state changes
firebase.auth().onAuthStateChanged((user) => {
    updateNavigation();
    
    // Protect certain pages
    const protectedPages = ['cart.html', 'profile.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (!user && protectedPages.includes(currentPage)) {
        window.location.href = 'login.html';
    }
});
