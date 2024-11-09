document.addEventListener('DOMContentLoaded', function() {
    // Ensure Firebase is initialized
    if (!firebase.apps.length) {
        console.error('Firebase is not initialized');
        return;
    }

    const loginForm = document.getElementById('loginForm');
    if (!loginForm) {
        console.error('Login form not found');
        return;
    }

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const submitButton = this.querySelector('button[type="submit"]');
        const errorMessageEl = document.getElementById('errorMessage');

        // Validate inputs
        if (!email || !password) {
            showError('Please enter both email and password');
            return;
        }

        // Disable button and show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        clearError();

        // Perform login
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                
                // Check email verification
                if (!user.emailVerified) {
                    showError('Please verify your email. A verification link has been sent to your email.');
                    return user.sendEmailVerification({
                        url: window.location.origin + '/login.html',
                        handleCodeInApp: true
                    }).then(() => {
                        return firebase.auth().signOut();
                    });
                }

                // Fetch user additional data
                return firebase.firestore().collection('users').doc(user.uid).get()
                    .then((doc) => {
                        if (doc.exists) {
                            const userData = doc.data();
                            
                            // Store user data
                            localStorage.setItem('userData', JSON.stringify({
                                name: userData.username || 'User ',
                                email: user.email,
                                uid: user.uid
                            }));

                            // Fetch and display user orders
                            fetchUser Orders(user.email).then(orders => {
                                displayUser Orders(orders);
                            });

                        } else {
                            showError('User  data not found');
                        }
                    });
            })
            .catch((error) => {
                // Detailed error handling
                console.error('Login Error:', error);
                
                let errorMessage = 'Login failed. Please try again.';
                switch (error.code) {
                    case 'auth/invalid-email':
                        errorMessage = 'Invalid email address format.';
                        break;
                    case 'auth/user-not-found':
                        errorMessage = 'No account found with this email.';
                        break;
                    case 'auth/wrong-password':
                        errorMessage = 'Incorrect password.';
                        break;
                    case 'auth/too-many-requests':
                        errorMessage = 'Too many login attempts. Please try again later.';
                        break;
                    default:
                        errorMessage = error.message || 'An unexpected error occurred.';
                }
                
                showError(errorMessage);
            })
            .finally(() => {
                // Re-enable button
                submitButton.disabled = false;
                submitButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
            });
    });

    // Fetch user orders
    function fetchUser Orders(email) {
        return new Promise((resolve) => {
            // Fetch orders from localStorage
            const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
            const userOrders = allOrders.filter(order => order.customerInfo.email === email);
            resolve(userOrders);
        });
    }

    // Display user orders
    function displayUser Orders(orders) {
        const ordersContainer = document.getElementById('ordersContainer'); // Ensure you have this element in your HTML
        if (!ordersContainer) {
            console.error('Orders container not found');
            return;
        }

        if (orders.length === 0) {
            ordersContainer.innerHTML = '<p>You have no orders yet.</p>';
            return;
        }

        const ordersHTML = orders.map(order => `
            <div class="order-card">
                <h3>Order ID: ${order.orderId}</h3>
                <p>Date: ${new Date(order.orderDate).toLocaleDateString()}</ <p>Total: $${order.total.toFixed(2)}</p>
                <p>Status: ${order.status}</p>
            </div>
        `).join('');

        ordersContainer.innerHTML = ordersHTML;
    }

    // Error handling functions
    function showError(message) {
        const errorMessageEl = document.getElementById('errorMessage');
        if (errorMessageEl) {
            errorMessageEl.textContent = message;
            errorMessageEl.style.display = 'block';
        } else {
            console.error('Error message element not found');
            alert(message);
        }
    }

    function clearError() {
        const errorMessageEl = document.getElementById('errorMessage');
        if (errorMessageEl) {
            errorMessageEl.textContent = '';
            errorMessageEl.style.display = 'none';
        }
    }

    // Forgot Password
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            
            if (!email) {
                showError('Please enter your email address');
                return;
            }

            firebase.auth().sendPasswordResetEmail(email)
                .then(() => {
                    showError('Password reset email sent. Please check your inbox.');
                })
                .catch((error) => {
                    console.error('Password Reset Error:', error);
                    showError(error.message);
                });
        });
    }
});
