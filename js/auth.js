document.addEventListener('DOMContentLoaded', function() {
    // Ensure Firebase is initialized
    if (!firebase.apps.length) {
        console.error('Firebase is not initialized');
        return;
    }

    const userInfo = document.getElementById('userInfo');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const userEmailDisplay = document.getElementById('userEmail');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    // Check authentication state
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log('User  logged in:', user.email);
            firebase.firestore().collection('users').doc(user.uid).get()
                .then((doc) => {
                    if (doc.exists) {
                        const userData = doc.data();
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
                    console.log('User  signed out successfully');
                    window.location.href = 'login.html';
                })
                .catch((error) => {
                    console.error('Logout error:', error);
                    alert('Error signing out: ' + error.message);
                });
        });
    }
});

