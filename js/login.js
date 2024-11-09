document.addEventListener('DOMContentLoaded', function() {
    // Check if Firebase is initialized
    if (!firebase.apps.length) {
        console.error('Firebase is not initialized');
        return;
    }

    const loginForm = document.getElementById('loginForm');
    const errorMessageEl = document.getElementById('errorMessage');

    if (!loginForm) {
        console.error('Login form not found');
        return;
    }

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const submitButton = this.querySelector('button[type="submit"]');

        // Clear previous error messages
        clearError();

        // Validate inputs
        if (!email || !password) {
            showError('Please enter both email and password');
            return;
        }

        // Disable button and show loading state
        toggleSubmitButton(submitButton, true, 'Logging in...');

        // Perform login
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(userCredential => {
                const user = userCredential.user;

                // Check email verification
                if (!user.emailVerified) {
                    showError('Please verify your email before logging in.');
                    firebase.auth().signOut(); // Sign out the user
                    toggleSubmitButton(submitButton, false, 'Login');
                    return;
                }

                // Successful login, redirect to home page or user dashboard
                window.location.href = 'user-orders.html'; // Change to your desired redirection
            })
            .catch(error => {
                handleLoginError(error);
                toggleSubmitButton(submitButton, false, 'Login');
            });
    });

    // Function to display error messages
    function showError(message) {
        errorMessageEl.textContent = message;
        errorMessageEl.style.display = 'block';
    }

    // Function to clear error messages
    function clearError() {
        errorMessageEl.textContent = '';
        errorMessageEl.style.display = 'none';
    }

    // Function to toggle the submit button state
    function toggleSubmitButton(button, isLoading, text) {
        button.disabled = isLoading;
        button.innerHTML = isLoading ? '<i class="fas fa-spinner fa-spin"></i> ' + text : '<i class="fas fa-sign-in-alt"></i> ' + text;
    }

    // Function to handle login errors
    function handleLoginError(error) {
        console.error('Login Error:', error);
        let errorMessage;

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
    }

    // Forgot Password link functionality
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();

            if (!email) {
                showError('Please enter your email address');
                return;
            }

            firebase.auth().sendPasswordResetEmail(email)
                .then(() => {
                    showError('Password reset email sent. Please check your inbox.');
                })
                .catch(error => {
                    console.error('Password Reset Error:', error);
                    showError(error.message);
                });
        });
    }
});
