// register.js
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    firebase.auth().createUser WithEmailAndPassword(email, password)
        .then(() => {
            // Registration successful
            window.location.href = 'login.html';
        })
        .catch(error => {
            console.error("Error:", error);
        });
});
