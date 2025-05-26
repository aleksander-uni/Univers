// Дані про товари
const products = [
    {
        id: 1,
        name: "iPhone 14 Pro",
        price: 41999,
        stock: 10,
        image: "https://content1.rozetka.com.ua/goods/images/big/284920820.jpg"
    },
    {
        id: 2,
        name: "Samsung Galaxy S23",
        price: 39999,
        stock: 8,
        image: "https://content.rozetka.com.ua/goods/images/big/310649358.jpg"
    },
    {
        id: 3,
        name: "MacBook Air M2",
        price: 49999,
        stock: 5,
        image: "https://content2.rozetka.com.ua/goods/images/big/269257932.jpg"
    },
    {
        id: 4,
        name: "AirPods Pro 2",
        price: 9999,
        stock: 15,
        image: "https://content.rozetka.com.ua/goods/images/big/284651619.jpg"
    }
];

// Корзина
let cart = [];

// Відображення товарів
function displayProducts() {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = '';

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-card';
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">${product.price} грн</p>
                <p class="product-stock">В наявності: ${product.stock} шт.</p>
                <button 
                    class="add-to-cart" 
                    onclick="addToCart(${product.id})"
                    ${product.stock === 0 ? 'disabled' : ''}
                >
                    ${product.stock === 0 ? 'Немає в наявності' : 'Додати в кошик'}
                </button>
            </div>
        `;
        productsContainer.appendChild(productElement);
    });
}

// Додавання товару в корзину
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (product.stock > 0) {
        product.stock--;
        
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        updateCartCount();
        displayProducts();
        updateCart();
    }
}

// Оновлення кількості товарів в іконці корзини
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Відображення вмісту корзини
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    cartItems.innerHTML = '';
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        cartItems.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">${item.price} грн x ${item.quantity} = ${itemTotal} грн</p>
                </div>
            </div>
        `;
    });
    
    cartTotal.textContent = total;
}

// Показати/приховати корзину
function toggleCart() {
    const cartModal = document.getElementById('cart-modal');
    cartModal.style.display = cartModal.style.display === 'block' ? 'none' : 'block';
}

// Ініціалізація сторінки
window.onload = () => {
    displayProducts();
    updateCartCount();
    updateCart();
};