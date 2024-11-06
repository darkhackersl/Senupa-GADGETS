// js/register.js
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Password validation
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

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Registration successful
            alert('Registration successful! Please login.');
            window.location.href = 'login.html';
        })
        .catch((error) => {
            // Handle errors
            alert(error.message);
            submitButton.disabled = false;
            submitButton.textContent = 'Register';
        });
});
