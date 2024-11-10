/* General Styles for Manage Products Page */
body {
    font-family: 'Lato', sans-serif;
    background-color: #f4f4f4; /* Light background color */
    margin: 0;
    padding: 0;
}

.container {
    width: 80%;
    margin: 0 auto;
    padding: 20px;
    background-color: #fff; /* White background for the container */
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
}

/* Header Styles */
h1 {
    color: #742d2d; /* Darker color for main heading */
    margin-bottom: 20px;
}

h2 {
    color: #333; /* Darker color for subheadings */
    margin-top: 20px;
}

/* Table Styles */
table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

th, td {
    padding: 12px;
    text-align: left;
    border: 1px solid #ddd; /* Light border for table */
}

th {
    background-color: #742d2d; /* Header background color */
    color: #fff; /* White text for header */
}

tr:nth-child(even) {
    background-color: #f9f9f9; /* Zebra striping for table rows */
}

tr:hover {
    background-color: #f1f1f1; /* Highlight on row hover */
}

/* Form Styles */
form {
    margin-top: 20px;
    padding: 20px;
    background-color: #f9f9f9; /* Light background for form */
    border-radius: 5px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2); /* Subtle shadow for form */
}

form div {
    margin-bottom: 15px; /* Space between form groups */
}

label {
    display: block;
    margin-bottom: 5px; /* Space between label and input */
    color: #333; /* Darker text for labels */
}

input[type="text"],
input[type="number"] {
    width: 100%; /* Full width for inputs */
    padding: 10px;
    border: 1px solid #ddd; /* Light border for inputs */
    border-radius: 5px; /* Rounded corners */
    box-sizing: border-box; /* Include padding in width */
}

/* Button Styles */
button {
    background-color: #5bc0de; /* Bootstrap info color */
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #31b0d5; /* Darker shade on hover */
}

/* Responsive Styles */
@media (max-width: 768px) {
    .container {
        width: 95%; /* Adjust container width on smaller screens */
    }

    table {
        font-size: 14px; /* Smaller font size for table on smaller screens */
    }

    input[type="text"],
    input[type="number"] {
        font-size: 14px; /* Smaller font size for inputs */
    }
}
