// utils/cart.js
export function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // চেক করা প্রোডাক্টটি ইতিমধ্যে আছে কিনা
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        alert("এই পণ্যটি ইতিমধ্যে কার্টে আছে!");
        return;
    }

    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // কার্টে যোগ করার পর একটি কনফার্মেশন বক্স দেখানো
    if(confirm("✅ Added to bag! Do you want to view your cart now?")) {
        window.location.href = 'cart.html';
    }
}

export function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

export function clearCart() {
    localStorage.removeItem('cart');
    updateCartCount();
}

export function updateCartCount() {
    const cart = getCart();
    const badges = document.querySelectorAll('.cart-count');
    badges.forEach(b => b.innerText = cart.length);
}

// পেজ লোড হলে কাউন্ট আপডেট হবে
updateCartCount();