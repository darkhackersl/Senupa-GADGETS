// js/auth.js
function logout() {
    firebase.auth().signOut()
        .then(() => {
            localStorage.removeItem('userEmail');
            window.location.href = 'login.html';
        })
        .catch((error) => {
            alert('Error logging out: ' + error.message);
        });
}

// Add this to check auth state on each page
firebase.auth().onAuthStateChanged((user) => {
    const protectedPages = ['cart.html', 'profile.html']; // Add your protected pages
    const currentPage = window.location.pathname.split('/').pop();
    
    if (!user && protectedPages.includes(currentPage)) {
        window.location.href = 'login.html';
    }
});
