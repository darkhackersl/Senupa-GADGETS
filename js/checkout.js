document.addEventListener("DOMContentLoaded", () => {
    // Display the current cart summary
    updateCartSummary();

    // Handle form submission
    const checkoutForm = document.getElementById("checkoutForm");
    checkoutForm.addEventListener("submit", function(event) {
        event.preventDefault();

        // Collect user information
        const name = document.getElementById("name").value;
        const address = document.getElementById("address").value;
        const phone = document.getElementById("phone").value;
        const orderMessage = document.getElementById("orderMessage");

        // Basic form validation
        if (!name || !address || !phone) {
            orderMessage.textContent = "Please fill out all the fields.";
            orderMessage.style.color = "red";
            return;
        }

        // Confirm the order
        orderMessage.textContent = "Order placed successfully! You will pay upon delivery.";
        orderMessage.style.color = "green";

        // Clear the cart
        localStorage.removeItem('cart');
        cart = [];
        updateCartSummary();

        // Optionally, redirect to a thank-you page or back to the homepage
        setTimeout(() => {
            window.location.href = "index.html";
        }, 3000);
    });
});
