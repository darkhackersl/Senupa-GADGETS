$(document).ready(function() {
    // Load user settings when the page is ready
    loadUser Settings();

    function loadUser Settings() {
        const userData = JSON.parse(localStorage.getItem('userData')) || {};
        $('#username').val(userData.name || '');
        $('#email').val(userData.email || '');
    }

    // Handle form submission to save user settings
    $('#userSettingsForm').on('submit', function(e) {
        e.preventDefault();

        const updatedUser Data = {
            name: $('#username').val(),
            email: $('#email').val(),
            password: $('#password').val() // Handle password update logic as needed
        };

        // Save updated data to localStorage (or send to server)
        localStorage.setItem('userData', JSON.stringify(updatedUser Data));
        alert('User  settings updated successfully!');

        // Optionally, you can clear the password fields after saving
        $('#password').val('');
        $('#confirm-password').val('');
    });
});
