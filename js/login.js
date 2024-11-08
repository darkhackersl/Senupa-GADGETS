document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const submitButton = this.querySelector('button[type="submit"]');

        // Disable button and show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        errorMessage.textContent = '';

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                
                if (!user.emailVerified) {
                    // Send verification email if not verified
                    user.sendEmailVerification({
                        url: window.location.origin + '/login.html',
                        handleCodeInApp: true
                    }).then(() => {
                        errorMessage.textContent = 'Please verify your email. A new verification link has been sent.';
                        firebase.auth().signOut();
                    });
                    return;
                }

                // Fetch additional user data from Firestore
                return firebase.firestore().collection('users').doc(user.uid).get()
                    .then((doc) => {
                        if (doc.exists) {
                            const userData = doc.data();
                            
                            // Store user data in localStorage
                            localStorage.setItem('userData', JSON.stringify({
                                name: userData.username || 'User',
                                email: user.email,
                                uid: user.uid
                            }));

                            // Redirect to home page
                            window.location.href = 'index.html';
                        }
                    });
            })
            .catch((error) => {
                // Handle Errors
                errorMessage.textContent = getErrorMessage(error.code);
                console.error('Login Error:', error);
            })
            .finally(() => {
                // Re-enable button
                submitButton.disabled = false;
                submitButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
            });
    });

    // Forgot Password
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        
        if (!email) {
            errorMessage.textContent = 'Please enter your email address first';
            return;
        }

        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                errorMessage.textContent = 'Password reset email sent. Please check your inbox.';
            })
            .catch((error) => {
                errorMessage.textContent = getErrorMessage(error.code);
            });
    });

    // Error message helper function
    function getErrorMessage(errorCode) {
        switch (errorCode) {
            case 'auth/wrong-password':
                return 'Incorrect password. Please try again.';
            case 'auth/user-not-found':
                return 'No account found with this email.';
            case 'auth/invalid-email':
                return 'Invalid email address.';
            case 'auth/too-many-requests':
                return 'Too many login attempts. Please try again later.';
            default:
                return 'Login failed. Please try again.';
        }
    }
});
