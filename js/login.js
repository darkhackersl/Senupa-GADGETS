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

// login.js
firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        
        if (!user.emailVerified) {
            // Handle unverified email...
        } else {
            // Store user data
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem('userId', user.uid);
            
            // Get additional user data from Firestore
            return firebase.firestore().collection('users').doc(user.uid).get()
                .then((doc) => {
                    if (doc.exists) {
                        const userData = doc.data();
                        localStorage.setItem('userName', userData.username);
                    }
                    window.location.href = 'index.html';
                });
        }
    })
    .catch((error) => {
        console.error('Login error:', error);
        alert(error.message);
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
