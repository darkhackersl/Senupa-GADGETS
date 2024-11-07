// login.js
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const submitButton = this.querySelector('button');
        submitButton.disabled = true;
        submitButton.textContent = 'Logging in...';

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                
                if (!user.emailVerified) {
                    alert('Please verify your email before logging in.');
                    submitButton.disabled = false;
                    submitButton.textContent = 'Login';
                    return firebase.auth().signOut();
                }

                // Store user info in localStorage
                localStorage.setItem('userEmail', user.email);
                
                // Get additional user data from Firestore
                firebase.firestore().collection('users').doc(user.uid).get()
                    .then((doc) => {
                        if (doc.exists) {
                            const userData = doc.data();
                            localStorage.setItem('userName', userData.username);
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
