$(document).ready(function() {
    loadProducts();

    // Load products from localStorage
    function loadProducts() {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const productsTableBody = $('#productsTable tbody');
        productsTableBody.empty(); // Clear existing rows

        products.forEach(product => {
            const productRow = `
                <tr>
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>Rs.${product.price.toFixed(2)}</td>
                    <td>${product.brand}</td>
                    <td>
                        <button onclick="editProduct(${product.id})">Edit</button>
                        <button onclick="deleteProduct(${product.id})">Delete</button>
                    </td>
                </tr>
            `;
            productsTableBody.append(productRow);
        });
    }

    // Handle form submission to add or edit product
    $('#productForm').on('submit', function(e) {
        e.preventDefault();

        const productId = $('#productId').val();
        const productName = $('#productName').val();
        const productPrice = parseFloat($('#productPrice').val());
        const productBrand = $('#productBrand').val();

        if (productId) {
            // Edit existing product
            editExistingProduct(productId, productName, productPrice, productBrand);
        } else {
            // Add new product
            addNewProduct(productName, productPrice, productBrand);
        }

        // Reset form
        $(this).trigger('reset');
        $('#productId').val('');
    });

    // Function to add a new product
    function addNewProduct(name, price, brand ) {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const newProduct = {
            id: products.length ? products[products.length - 1].id + 1 : 1,
            name: name,
            price: price,
            brand: brand
        };
        products.push(newProduct);
        localStorage.setItem('products', JSON.stringify(products));
        loadProducts();
    }

    // Function to edit an existing product
    window.editProduct = function(id) {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const product = products.find(p => p.id === id);
        if (product) {
            $('#productId').val(product.id);
            $('#productName').val(product.name);
            $('#productPrice').val(product.price);
            $('#productBrand').val(product.brand);
        }
    };

    // Function to delete a product
    window.deleteProduct = function(id) {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        products = products.filter(p => p.id !== id);
        localStorage.setItem('products', JSON.stringify(products));
        loadProducts();
    };
});
