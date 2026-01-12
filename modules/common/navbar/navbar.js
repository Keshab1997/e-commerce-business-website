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
            
            <!-- হ্যামবার্গার বাটন (মোবাইলের জন্য) -->
            <div class="hamburger" id="mobile-menu-btn">
                <span></span>
                <span></span>
                <span></span>
            </div>
            
            <!-- মেনু আইটেম -->
            <ul class="nav-menu" id="nav-menu">
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
    // ১. মোবাইল মেনু টগল
    const hamburger = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // ২. কার্ট কাউন্ট আপডেট
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const cart = getCart();
        cartCount.innerText = cart.length;
    }

    // ৩. লগইন বাটন লজিক
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', async () => {
            try { await loginWithGoogle(); } catch (e) { console.log(e); }
        });
    }

    // ৪. ইউজার চেক (প্রোফাইল ছবি ও নাম দেখানো)
    onAuthStateChanged(auth, (user) => {
        const menu = document.getElementById('auth-menu');
        if (user) {
            // ইউজারের ছবি না থাকলে ডিফল্ট ছবি
            const userImg = user.photoURL || 'https://via.placeholder.com/40';
            const userName = user.displayName.split(' ')[0]; // শুধু প্রথম নাম

            let html = `
                <a href="profile.html" class="nav-link profile-link" style="display:flex; align-items:center; gap:10px;">
                    <img src="${userImg}" style="width:35px; height:35px; border-radius:50%; border:2px solid white;">
                    <span>${userName}</span>
                </a>
            `;
            
            // এডমিন চেক
            if(user.email === "keshabsarkar2018@gmail.com") {
                html += `
                    <a href="dashboard.html" class="nav-link dashboard-link">
                        🔒 Dashboard
                    </a>
                `;
            }
            menu.innerHTML = html;
        }
    });
}

// অটোমেটিক রান
loadNavbar();