import { auth, loginWithGoogle } from '../../../config/firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getCart } from '../../../utils/cart.js';

// মেনুবার লোড করার ফাংশন
export function loadNavbar() {
    const navContainer = document.querySelector('.navbar');
    if (!navContainer) return;

    navContainer.innerHTML = `
        <div class="nav-container">
            <!-- লোগো -->
            <a href="index.html" class="nav-logo" id="dynamic-nav-logo">SootBoot</a>
            
            <!-- মেনু আইটেম -->
            <ul class="nav-menu">
                <li>
                    <a href="index.html" class="nav-link">
                        <span class="icon">🏠</span> <span>Home</span>
                    </a>
                </li>
                <li>
                    <a href="shop.html" class="nav-link">
                        <span class="icon">🛍️</span> <span>Collection</span>
                    </a>
                </li>
                
                <!-- কার্ট -->
                <li>
                    <a href="cart.html" class="nav-link cart-btn">
                        <span class="icon">🛒</span> <span>Cart</span>
                        <span class="cart-badge" id="cart-count">0</span>
                    </a>
                </li>

                <!-- লগইন / প্রোফাইল (ডাইনামিক) -->
                <li id="auth-menu">
                    <button id="login-btn" class="btn-login">
                        <span class="icon">🔑</span> <span>Login</span>
                    </button>
                </li>
            </ul>
        </div>
    `;

    // ইভেন্ট লিসেনার এবং লজিক সেটআপ
    setupNavbarLogic();
}

function setupNavbarLogic() {
    // ১. কার্ট কাউন্ট আপডেট
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const cart = getCart();
        cartCount.innerText = cart.length;
    }

    // ২. লগইন বাটন লজিক
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', async () => {
            try { await loginWithGoogle(); } catch (e) { console.log(e); }
        });
    }

    // ৩. ইউজার চেক (প্রোফাইল ও ড্যাশবোর্ড দেখানো)
    onAuthStateChanged(auth, (user) => {
        const menu = document.getElementById('auth-menu');
        if (user) {
            let html = `
                <a href="profile.html" class="nav-link">
                    <span class="icon">👤</span> <span>Profile</span>
                </a>
            `;
            
            // এডমিন চেক
            if(user.email === "keshabsarkar2018@gmail.com") {
                html += `
                    <a href="dashboard.html" class="nav-link dashboard-link">
                        <span class="icon">🔒</span> <span>Dashboard</span>
                    </a>
                `;
            }
            menu.innerHTML = html;
        }
    });
}

// অটোমেটিক রান
loadNavbar();