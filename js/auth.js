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
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userId', user.uid);
        
        // Update UI for logged in user
        const loginLinks = document.querySelectorAll('a[href="login.html"]');
        const registerLinks = document.querySelectorAll('a[href="register.html"]');
        
        loginLinks.forEach(link => {
            link.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
            link.href = '#';
            link.onclick = (e) => {
                e.preventDefault();
                firebase.auth().signOut()
                    .then(() => {
                        localStorage.removeItem('userEmail');
                        localStorage.removeItem('userId');
                        window.location.href = 'index.html';
                    })
                    .catch((error) => {
                        console.error('Logout error:', error);
                    });
            };
        });
        
        registerLinks.forEach(link => {
            link.style.display = 'none';
        });
    } else {
        // User is signed out
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
    }
});
