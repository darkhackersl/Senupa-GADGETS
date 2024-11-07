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
                // Login successful
                const user = userCredential.user;
                localStorage.setItem('userEmail', user.email);
                localStorage.setItem('userId', user.uid);
                window.location.href = 'index.html'; // Redirect to home page
            })
            .catch((error) => {
                console.error('Login error:', error);
                alert(error.message);
                submitButton.disabled = false;
                submitButton.textContent = 'Login';
            });
    });
});
