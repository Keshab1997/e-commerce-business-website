import { auth, loginWithGoogle } from '../../../config/firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getCart } from '../../../utils/cart.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from '../../../config/firebase-config.js';

// মেনুবার লোড করার ফাংশন
export async function loadNavbar() {
    const navContainer = document.querySelector('.navbar');
    if (!navContainer) return;

    // দোকানের তথ্য লোড করা
    let shopName = 'SootBoot';
    let shopLogo = '';
    
    try {
        const shopRef = doc(db, "settings", "shopInfo");
        const shopSnap = await getDoc(shopRef);
        if (shopSnap.exists()) {
            const shopData = shopSnap.data();
            shopName = shopData.name || 'SootBoot';
            shopLogo = shopData.logo || '';
        }
    } catch (error) {
        console.log('Shop info load error:', error);
    }

    navContainer.innerHTML = `
        <div class="nav-container">
            <!-- লোগো এবং নাম একসাথে -->
            <a href="index.html" class="nav-logo">
                <img id="nav-logo-img" src="${shopLogo}" alt="Logo" style="${shopLogo ? 'display:inline; max-height:40px; margin-right:8px;' : 'display:none;'}">
                <span id="dynamic-nav-logo">${shopName}</span>
            </a>
            
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
            const userImg = user.photoURL || 'https://via.placeholder.com/35';
            const userName = user.displayName.split(' ')[0];

            let html = `
                <a href="profile.html" class="nav-link profile-link" title="My Profile">
                    <img src="${userImg}" class="nav-user-img">
                    <span>${userName}</span>
                </a>
            `;
            
            if(user.email === "keshabsarkar2018@gmail.com") {
                html += `
                    <a href="dashboard.html" class="admin-badge" title="Admin Dashboard">
                        ⚙️
                    </a>
                `;
            }
            menu.innerHTML = html;
        }
    });
}

// অটোমেটিক রান
// loadNavbar(); // এটি কমেন্ট করা হলো কারণ এখন এটি async function