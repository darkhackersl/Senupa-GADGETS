// js/login.js
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Show loading state
    const submitButton = this.querySelector('button');
    submitButton.disabled = true;
    submitButton.textContent = 'Logging in...';

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Login successful
            const user = userCredential.user;
            localStorage.setItem('userEmail', user.email);
            window.location.href = 'index.html'; // Redirect to home page
        })
        .catch((error) => {
            // Handle errors
            alert(error.message);
            submitButton.disabled = false;
            submitButton.textContent = 'Login';
        });
});

// Check if user is already logged in
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        localStorage.setItem('userEmail', user.email);
    } else {
        // User is signed out
        localStorage.removeItem('userEmail');
    }
});
