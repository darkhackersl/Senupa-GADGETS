// login.js
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }

        // Show loading state
        const submitButton = this.querySelector('button');
        submitButton.disabled = true;
        submitButton.textContent = 'Logging in...';

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                
                if (!user.emailVerified) {
                    // If email isn't verified, send a new verification email
                    user.sendEmailVerification({
                        url: 'https://scintillating-gnome-48c89a.netlify.app/login',
                        handleCodeInApp: true
                    }).then(() => {
                        alert('Please verify your email. A new verification link has been sent.');
                        submitButton.disabled = false;
                        submitButton.textContent = 'Login';
                        firebase.auth().signOut();
                    });
                    throw new Error('Please verify your email before logging in.');
                }

                                // Fetch user additional details from Firestore
                return firebase.firestore().collection('users').doc(user.uid).get()
                    .then((doc) => {
                        if (doc.exists) {
                            const userData = doc.data();
                            
                            // Store user data in localStorage
                            localStorage.setItem('userData', JSON.stringify({
                                uid: user.uid,
                                email: user.email,
                                name: userData.name || 'User'
                            }));

                            // Redirect to index with user info
                            window.location.href = 'index.html';
                        }
                    });
            })
            .catch((error) => {
                console.error('Login error:', error);
                alert(error.message);
                submitButton.disabled = false;
                submitButton.textContent = 'Login';
            });
    });
});
// Add this to login.js
document.getElementById('resendVerificationBtn')?.addEventListener('click', function() {
    const email = document.getElementById('email').value;
    if (!email) {
        alert('Please enter your email address');
        return;
    }

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            return userCredential.user.sendEmailVerification({
                url: 'https://scintillating-gnome-48c89a.netlify.app/login',
                handleCodeInApp: true
            });
        })
        .then(() => {
            alert('Verification email has been resent. Please check your inbox.');
        })
        .catch((error) => {
            console.error('Error sending verification email:', error);
            alert(error.message);
        });
});
