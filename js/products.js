// js/products.js

const products = [
    {
        id: 1,
        name: "iPhone 14 Pro",
        category: "Smartphones",
        price: 999.99,
        brand: "Apple",
        image: "https://files.cdn-files-a.com/uploads/9822430/2000_670c970c850a4.jpg",
        description: "The iPhone 14 Pro and ",
         stock: 10,
         additionalDescription: "🔥 G9 Gold Ultra 2
⭐High Quality Watch
⭐Brand G9 Ultra FENDIOR
⭐New Sealed Pack
⭐Best Gold Strip & Other
⭐Ultra Black Strip Available
⭐Hight Qulity Brand
⭐Voluem Controler
⭐Blutooth Call & Music
⭐Mini Control Button Best
⭐Hight Speaker Sound
⭐Softwear & Notification
⭐Qulity & Best Condition
⭐Best Charge Life
⭐Sport Sensor Available
⭐Premium Qulity Item
⭐Best Controler
🚛 Free Delivery (COD)
💳 Bank Payment & Cash on Deliver
🪀 WhatsApp for more details...
⭕ 0716389339
😱 Special Offer!",
         additionalImages: [
            "https://files.cdn-files-a.com/uploads/9822430/2000_670c970c850a4.jpg",
            "https://example.com/image2.jpg",
            "https://example.com/image3.jpg"
        ]
    },
    {
        id: 2,
        name: "Samsung Galaxy S23 Ultra",
        category: "Smartphones",
        price: 1199.99,
        brand: "Samsung",
        image: "https://images.samsung.com/us/smartphones/galaxy-s23-ultra/images/galaxy-s23-ultra-highlights-kv.jpg",
        description: "Premium Android smartphone with S Pen functionality.",
        stock: 8
    },
    {
        id: 3,
        name: "MacBook Pro 14",
        category: "Laptops",
        price: 1999.99,
        brand: "Apple",
        image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp-14-spacegray-select-202301?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1671304673229",
        description: "Powerful laptop with M2 Pro chip for professionals.",
        stock: 5
    },
    {
        id: 4,
        name: "Dell XPS 15",
        category: "Laptops",
        price: 1799.99,
        brand: "Dell",
        image: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9520/media-gallery/black/notebook-xps-15-9520-t-black-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=402&qlt=100,0&resMode=sharp2&size=402,402",
        description: "Premium Windows laptop with 4K OLED display.",
        stock: 6
    },
    {
        id: 5,
        name: "AirPods Pro",
        category: "Audio",
        price: 249.99,
        brand: "Apple",
        image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1660803972361",
        description: "Wireless earbuds with active noise cancellation.",
        stock: 15
    },
    {
        id: 6,
        name: "Sony WH-1000XM4",
        category: "Audio",
        price: 349.99,
        brand: "Sony",
        image: "https://electronics.sony.com/image/5d02da5c70a68500c8f18805dd85106f/1686x950/Sony_WH-1000XM4_Black_hero.png",
        description: "Premium wireless headphones with industry-leading noise cancellation.",
        stock: 12
    },
    {
        id: 7,
        name: "iPad Pro 12.9",
        category: "Tablets",
        price: 1099.99,
        brand: "Apple",
        image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-12-select-wifi-spacegray-202104_FMT_WHH?wid=1945&hei=2000&fmt=jpeg&qlt=90&.v=1617126635000",
        description: "Large tablet with M2 chip and mini-LED display.",
        stock: 7
    },
    {
        id: 8,
        name: "PlayStation 5",
        category: "Gaming",
        price: 499.99,
        brand: "Sony",
        image: "https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21",
        description: "Next-gen gaming console with 4K gaming capabilities.",
        stock: 4
    }
];
function displayProducts() {
    const productList = document.getElementById('productList');
    if (!productList) return;

    productList.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">Rs.${product.price.toFixed(2)}</p>
                <p>${product.description}</p>
                <button onclick="addToCart(${product.id})" class="add-to-cart">
                    Add to Cart
                </button>
            </div>
        `;
        productList.appendChild(productCard);
    });
}

// Initialize products when page loads
document.addEventListener('DOMContentLoaded', displayProducts);
