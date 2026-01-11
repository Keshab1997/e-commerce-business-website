import { db, auth } from '../../../config/firebase-config.js';
import { doc, getDoc, collection, getDocs, query, limit, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { loadShopBranding } from '../../../utils/global-loader.js';

// ডিফল্ট ডেটা (যদি এডমিন প্যানেলে কিছু সেট না করেন)
const DEFAULT_HOME = {
    slide1: { img: "https://images.unsplash.com/photo-1610189012906-4783fdae2c26?q=80&w=1920", title: "এক্সক্লুসিভ বেনারসি" },
    slide2: { img: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=1920", title: "ছেলেদের প্রিমিয়াম পাঞ্জাবি" },
    slide3: { img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1920", title: "স্টাইলিশ ব্লেজার ও সুট" },
    offer: { img: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1600", title: "ওয়েডিং কালেকশন - ৩০% ছাড়" }
};

// মেইন ফাংশন যা সব লোড করবে
export async function initHome() {
    loadShopBranding(); // দোকানের নাম লোড
    checkAdmin();       // এডমিন বাটন চেক
    loadHomeContent();  // স্লাইডার ও ব্যানার
    renderCategories(); // ক্যাটাগরি
    loadFeatured();     // প্রোডাক্ট
}

// ১. এডমিন চেক
function checkAdmin() {
    const ADMIN_EMAIL = "keshabsarkar2018@gmail.com";
    onAuthStateChanged(auth, (user) => {
        if (user && user.email === ADMIN_EMAIL) {
            const adminBtn = document.getElementById('admin-nav-item');
            if(adminBtn) adminBtn.style.display = 'block';
        }
    });
}

// ২. স্লাইডার ও ব্যানার লোড
async function loadHomeContent() {
    let data = DEFAULT_HOME;
    try {
        const docSnap = await getDoc(doc(db, "settings", "homeConfig"));
        if (docSnap.exists()) data = docSnap.data();
    } catch (e) { console.log("Using default data"); }

    // স্লাইডার রেন্ডার
    const sliderContainer = document.getElementById('hero-slider');
    if (!sliderContainer) return;

    const slidesData = [data.slide1, data.slide2, data.slide3];
    
    sliderContainer.innerHTML = ''; 
    slidesData.forEach((slide, index) => {
        const div = document.createElement('div');
        div.className = `slide ${index === 0 ? 'active' : ''}`;
        div.style.backgroundImage = `url('${slide.img}')`;
        div.innerHTML = `
            <div class="slide-content">
                <h1>${slide.title}</h1>
                <a href="shop.html" class="btn-hero">কালেকশন দেখুন</a>
            </div>
        `;
        sliderContainer.appendChild(div);
    });

    // স্লাইডার টাইমার
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    if(slides.length > 0) {
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000);
    }

    // অফার ব্যানার
    const offerSection = document.getElementById('offer-banner');
    if (offerSection) {
        offerSection.style.backgroundImage = `url('${data.offer.img}')`;
        document.getElementById('offer-title').innerText = data.offer.title;
    }
}

// ৩. ক্যাটাগরি রেন্ডার
function renderCategories() {
    const categories = [
        { name: "শাড়ি", img: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=300" },
        { name: "পাঞ্জাবি", img: "https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?q=80&w=300" },
        { name: "ব্লেজার", img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=300" },
        { name: "গয়না", img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=300" },
        { name: "কুর্তা", img: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=300" },
        { name: "লেহেঙ্গা", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=300" }
    ];

    const catContainer = document.getElementById('category-container');
    if (catContainer) {
        catContainer.innerHTML = '';
        categories.forEach(cat => {
            catContainer.innerHTML += `
                <a href="shop.html" class="cat-item">
                    <img src="${cat.img}" alt="${cat.name}">
                    <p>${cat.name}</p>
                </a>
            `;
        });
    }
}

// ৪. ফিচারড প্রোডাক্ট লোড
async function loadFeatured() {
    const grid = document.getElementById('featured-grid');
    if (!grid) return;

    const q = query(collection(db, "products"), orderBy("createdAt", "desc"), limit(4));
    const snap = await getDocs(q);
    let html = '';
    snap.forEach(doc => {
        const p = doc.data();
        html += `
            <div class="product-card" onclick="window.location.href='product.html?id=${doc.id}'">
                <div class="card-img-box"><img src="${p.image}"></div>
                <div class="card-info">
                    <h3>${p.name}</h3>
                    <p class="price">₹ ${p.price}</p>
                </div>
            </div>
        `;
    });
    grid.innerHTML = html;
}

// পেজ লোড হলে রান হবে
initHome();