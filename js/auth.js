// auth.js
document.addEventListener('DOMContentLoaded', function() {
    // Ensure Firebase is initialized
    if (!firebase.apps.length) {
        console.error('Firebase is not initialized');
        return;
    }

    const loginForm = document.getElementById('loginForm');
    const registrationForm = document.getElementById('registrationForm');
    const errorMessageEl = document.getElementById('errorMessage');

    // Handle user login
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const submitButton = this.querySelector('button[type="submit"]');

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
                .then(() => {
                    // Redirect to home page after successful login
                    window.location.href = 'index.html';
                })
                .catch((error) => {
                    console.error('Login Error:', error);
                    showError(error.message);
                })
                .finally(() => {
                    // Re-enable button
                    submitButton.disabled = false;
                    submitButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
                });
        });
    }

    // Handle user registration
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = document.getElementById('registerEmail').value.trim();
            const password = document.getElementById('registerPassword').value;

            // Validate inputs
            if (!email || !password) {
                showError('Please enter both email and password');
                return;
            }

            // Perform registration
            firebase.auth().createUser ;WithEmailAndPassword(email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    showError('Registration successful! Please verify your email.');
                    return user.sendEmailVerification({
                        url: window.location.origin + '/login.html',
                        handleCodeInApp: true
                    });
                })
                .catch((error) => {
                    console.error('Registration Error:', error);
                    showError(error.message);
                });
        });
    }

    // Error handling functions
    function showError(message) {
        if (errorMessageEl) {
            errorMessageEl.textContent = message;
            errorMessageEl.style.display = 'block';
        } else {
            console.error('Error message element not found');
            alert(message);
        }
    }

    function clearError() {
        if (errorMessageEl) {
            errorMessageEl.textContent = '';
            errorMessageEl.style.display = 'none';
        }
    }
});

