// register.js
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const phone = document.getElementById('number').value;

        // Form validation
        if (!email || !username || !password || !confirmPassword || !phone) {
            alert('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        if (password.length < 6) {
            alert("Password should be at least 6 characters long!");
            return;
        }

        // Show loading state
        const submitButton = this.querySelector('button');
        submitButton.disabled = true;
        submitButton.textContent = 'Creating account...';

        // Create user in Firebase
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Add additional user info to Firebase
                return firebase.firestore().collection('users').doc(userCredential.user.uid).set({
                    username: username,
                    email: email,
                    phone: phone,
                    createdAt: new Date()
                });
            })
            .then(() => {
                alert('Registration successful! Please login.');
                window.location.href = 'login.html';
            })
            .catch((error) => {
                console.error('Registration error:', error);
                alert(error.message);
                submitButton.disabled = false;
                submitButton.textContent = 'Register';
            });
    });
});
