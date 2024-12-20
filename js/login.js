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
        
        const email = document.getElementById('email').value;
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

        // Assuming this is part of your login function
firebase.auth().signInWithEmailAndPassword(email, password)
.then((userCredential) => {
    const user = userCredential.user;
    // Store user email in localStorage
    localStorage.setItem('userEmail', user.email);
    // Optionally store user name or other info if available
    localStorage.setItem('userName', user.displayName || 'User '); // Adjust as necessary
    // Redirect to the orders page
    window.location.href = 'orders.html'; // Redirect to orders page
})
.catch((error) => {
    console.error('Login Error:', error);
});


        // Perform login
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                
                // Check email verification
                if (!user.emailVerified) {
                    // Send verification email
                    return user.sendEmailVerification({
                        url: window.location.origin + '/login.html',
                        handleCodeInApp: true
                    }).then(() => {
                        showError('Please verify your email. A new verification link has been sent.');
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
                                name: userData.username || 'User',
                                email: user.email,
                                uid: user.uid
                            }));

                            // Redirect to home page
                            window.location.href = 'orders.html';
                        } else {
                            showError('User data not found');
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
