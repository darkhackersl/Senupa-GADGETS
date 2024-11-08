// js/login.js
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Disable submit button and show loading state
        const submitButton = this.querySelector('button');
        submitButton.disabled = true;
        submitButton.textContent = 'Logging in...';

        // Firebase Authentication
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                
                // Check email verification
                if (!user.emailVerified) {
                    // Send verification email
                    user.sendEmailVerification({
                        url: 'https://scintillating-gnome-48c89a.netlify.app/login',
                        handleCodeInApp: true
                    }).then(() => {
                        alert('Please verify your email. A new verification link has been sent.');
                        firebase.auth().signOut();
                        submitButton.disabled = false;
                        submitButton.textContent = 'Login';
                    });
                    return;
                }

                // Fetch additional user data from Firestore
                return firebase.firestore().collection('users').doc(user.uid).get()
                    .then((doc) => {
                        if (doc.exists) {
                            const userData = doc.data();
                            
                            // Store user data in localStorage
                            localStorage.setItem('userEmail', user.email);
                            localStorage.setItem('userId', user.uid);
                            localStorage.setItem('userName', userData.username || 'User');

                            // Redirect to home page
                            window.location.href = 'index.html';
                        }
                    });
            })
            .catch((error) => {
                // Handle different error types
                let errorMessage = 'Login failed. Please try again.';
                
                switch(error.code) {
                    case 'auth/wrong-password':
                        errorMessage = 'Incorrect password. Please try again.';
                        break;
                    case 'auth/user-not-found':
                        errorMessage = 'No account found with this email.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Invalid email address.';
                        break;
                    case 'auth/too-many-requests':
                        errorMessage = 'Too many login attempts. Please try again later.';
                        break;
                }

                // Show error message
                alert(errorMessage);
                
                // Reset button
                submitButton.disabled = false;
                submitButton.textContent = 'Login';
                
                console.error('Login error:', error);
            });
    });

    // Resend Verification Email
    const resendVerificationBtn = document.getElementById('resendVerificationBtn');
    if (resendVerificationBtn) {
        resendVerificationBtn.addEventListener('click', function() {
            const user = firebase.auth().currentUser;
            if (user) {
                user.sendEmailVerification({
                    url: 'https://scintillating-gnome-48c89a.netlify.app/login',
                    handleCodeInApp: true
                }).then(() => {
                    alert('Verification email sent. Please check your inbox.');
                }).catch((error) => {
                    console.error('Error sending verification email:', error);
                    alert('Failed to send verification email. Please try again.');
                });
            }
        });
    }
});
