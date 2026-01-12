import { db, auth } from '../../../config/firebase-config.js';
import { doc, getDoc, collection, getDocs, query, limit, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { loadShopBranding } from '../../../utils/global-loader.js';

// ডিফল্ট ডেটা (যদি এডমিন প্যানেলে কিছু সেট না করেন)
const DEFAULT_HOME = {
    slide1: { img: "https://images.unsplash.com/photo-1610189012906-4783fdae2c26?q=80&w=1920", title: "এক্সক্লুসিভ বেনারসি" },
    slide2: { img: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=1920", title: "ছেলেদের প্রিমিয়াম পাঞ্জাবি" },
    slide3: { img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1920", title: "স্টাইলিশ ব্লেজার ও সুট" },
    offer: { img: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1600", title: "ওয়েডিং কালেকশন - ৩০% ছাড়" },
    videoGallery: [
        "https://assets.mixkit.co/videos/preview/mixkit-woman-wearing-a-sari-walking-slowly-1234-large.mp4",
        "https://assets.mixkit.co/videos/preview/mixkit-indian-bride-posing-for-photos-1235-large.mp4",
        "",
        ""
    ],
    reviews: [
        { name: "রুমা খাতুন", text: "অসাধারণ শাড়ি! কোয়ালিটি খুবই ভালো।" },
        { name: "সারা আক্তার", text: "দাম অনুযায়ী প্রোডাক্ট ভালো। সবাইকে সাজেস্ট করব।" },
        { name: "নাজমা বেগম", text: "ডেলিভারি খুব দ্রুত। প্যাকিং ও ভালো ছিল।" }
    ],
    services: [
        "ফ্রি হোম ডেলিভারি",
        "প্রিমিয়াম কোয়ালিটি",
        "২৪/৭ কাস্টমার সাপোর্ট"
    ]
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

    // ১০টি স্লাইডার চেক করে অ্যারে তৈরি করা
    const slidesData = [];
    for (let i = 1; i <= 10; i++) {
        if (data[`slide${i}`] && data[`slide${i}`].img) {
            slidesData.push(data[`slide${i}`]);
        }
    }
    
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

    // অফার ব্যানারগুলো লোড করা (১০টি)
    const offerContainer = document.getElementById('offer-banner-container');
    if (offerContainer) {
        offerContainer.innerHTML = ''; // লোডিং টেক্সট মুছে ফেলা
        
        let hasOffer = false;
        for (let i = 1; i <= 10; i++) {
            const off = data[`offer${i}`];
            // যদি ছবি এবং টাইটেল থাকে তবেই দেখাবে
            if (off && off.img && off.img.trim() !== "") {
                hasOffer = true;
                offerContainer.innerHTML += `
                    <div class="offer-card-item" style="background-image: url('${off.img}')">
                        <div class="offer-mini-content">
                            <h3>${off.title || 'Special Offer'}</h3>
                            <a href="shop.html" class="btn-offer-sm">এখনই কিনুন</a>
                        </div>
                    </div>
                `;
            }
        }

        // যদি কোনো অফার না থাকে
        if (!hasOffer) {
            offerContainer.innerHTML = '<p style="grid-column: 1/-1; color:#888; text-align:center; padding:40px;">বর্তমানে কোনো অফার নেই।</p>';
        }
    }

    // ভিডিও গ্যালারি লোড (Instagram Embed)
    const videoContainer = document.getElementById('video-container');
    if (videoContainer && data.videoGallery) {
        videoContainer.innerHTML = '';
        
        data.videoGallery.forEach(vidUrl => {
            if(vidUrl) {
                // লিঙ্ক থেকে এম্বেড কোড তৈরি
                const embedHtml = `
                    <div class="insta-card">
                        <blockquote class="instagram-media" 
                            data-instgrm-permalink="${vidUrl}" 
                            data-instgrm-version="14">
                        </blockquote>
                    </div>
                `;
                videoContainer.innerHTML += embedHtml;
            }
        });

        // ইন্সটাগ্রাম স্ক্রিপ্ট রি-লোড করা (যাতে নতুন ভিডিও রেন্ডার হয়)
        if(window.instgrm) {
            window.instgrm.Embeds.process();
        } else {
            const script = document.createElement('script');
            script.src = "//www.instagram.com/embed.js";
            script.async = true;
            document.body.appendChild(script);
        }
    }

    // সার্ভিস লোড
    const serviceContainer = document.getElementById('service-container');
    if (serviceContainer && data.services) {
        serviceContainer.innerHTML = '';
        const icons = ['🚚', '💎', '🎧']; // ডিফল্ট আইকন
        data.services.forEach((serv, index) => {
            if(serv) {
                serviceContainer.innerHTML += `
                    <div class="service-box">
                        <div class="s-icon">${icons[index] || '✨'}</div>
                        <h3>${serv}</h3>
                    </div>
                `;
            }
        });
    }

    // রিভিউ লোড
    const reviewContainer = document.getElementById('review-container');
    if (reviewContainer && data.reviews) {
        reviewContainer.innerHTML = '';
        data.reviews.forEach(rev => {
            if(rev.name && rev.text) {
                reviewContainer.innerHTML += `
                    <div class="review-card">
                        <div class="stars">⭐⭐⭐⭐⭐</div>
                        <p class="rev-text">"${rev.text}"</p>
                        <h4 class="rev-name">- ${rev.name}</h4>
                    </div>
                `;
            }
        });
    }
}

// ৩. ক্যাটাগরি রেন্ডার (ডাইনামিক)
async function renderCategories() {
    let categories = [
        { name: "শাড়ি", img: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=300" },
        { name: "পাঞ্জাবি", img: "https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?q=80&w=300" },
        { name: "ব্লেজার", img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=300" },
        { name: "গয়না", img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=300" },
        { name: "কুর্তা", img: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=300" },
        { name: "লেহেঙ্গা", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=300" }
    ];

    // ডেটাবেস থেকে ক্যাটাগরি নেওয়া
    try {
        const docSnap = await getDoc(doc(db, "settings", "homeConfig"));
        if (docSnap.exists() && docSnap.data().categories) {
            const dbCategories = docSnap.data().categories.filter(cat => cat.name && cat.img);
            if (dbCategories.length > 0) {
                categories = dbCategories;
            }
        }
    } catch (e) { console.log("Using default categories"); }

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