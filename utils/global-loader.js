import { db } from '../config/firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function loadShopBranding() {
    // ১. লোকাল স্টোরেজ থেকে নাম চেক (ফাস্ট লোডিংয়ের জন্য)
    const cachedName = localStorage.getItem('shopName');
    if (cachedName) {
        updateNameElements(cachedName);
    }

    try {
        // ২. ফায়ারবেস থেকে সব তথ্য আনা
        const docRef = doc(db, "settings", "shopInfo");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            
            // নাম আপডেট
            const shopName = data.name || "শাড়ি সম্ভার";
            localStorage.setItem('shopName', shopName);
            updateNameElements(shopName);

            // 👇 নতুন: ফুটার এবং অন্যান্য তথ্য আপডেট
            updateFooterDetails(data);
        }
    } catch (error) {
        console.error("Branding load error:", error);
    }
}

// নাম আপডেট করার ফাংশন
function updateNameElements(name, logoUrl) {
    document.title = name + " | Online Shop";
    
    setTimeout(() => {
        const navLogoText = document.getElementById('dynamic-nav-logo');
        const navLogoImg = document.getElementById('nav-logo-img');
        
        // ১. নাম সব সময় দেখাবে
        if (navLogoText) {
            navLogoText.innerText = name;
            navLogoText.style.display = 'block';
        }
        
        // ২. লোগো থাকলে সেটি গোল হয়ে নামের বামে দেখাবে
        if (navLogoImg && logoUrl) {
            navLogoImg.src = logoUrl;
            navLogoImg.style.display = 'block';
        }
    }, 500);

    const footerName = document.getElementById('f-name');
    if (footerName) footerName.innerText = name;
    
    // এডমিন প্যানেলের জন্য
    const adminPageTitle = document.getElementById('admin-page-title');
    if (adminPageTitle) adminPageTitle.innerText = name + " - Admin Panel";
}

// ফুটার ডিটেইলস আপডেট করার ফাংশন
function updateFooterDetails(data) {
    // ১. নাম ও বিবরণ
    if(data.name) {
        updateNameElements(data.name, data.logo);
        const copyrightName = document.getElementById('f-copyright-name');
        if(copyrightName) copyrightName.innerText = data.name;
    }
    if(data.description) {
        const descEl = document.getElementById('f-desc');
        if(descEl) descEl.innerText = data.description;
    }
    
    // ২. ফুটারের লোগো আপডেট
    const footerLogoImg = document.getElementById('f-logo-img');
    if (footerLogoImg && data.logo) {
        footerLogoImg.src = data.logo;
        footerLogoImg.style.display = 'block';
    }
    
    // ৩. যোগাযোগ আপডেট (English Labels)
    if(data.phone) {
        const phoneEl = document.getElementById('f-phone');
        const phoneLink = document.getElementById('f-phone-link');
        if(phoneEl) phoneEl.innerText = `📞 ${data.phone}`;
        if(phoneLink) {
            const cleanPhone = data.phone.replace(/\D/g,'');
            phoneLink.href = `tel:${cleanPhone}`;
        }
    }
    if(data.email) {
        const emailEl = document.getElementById('f-email');
        const emailLink = document.getElementById('f-email-link');
        if(emailEl) emailEl.innerText = `✉️ ${data.email}`;
        if(emailLink) emailLink.href = `mailto:${data.email}`;
    }
    if(data.address) {
        const addressEl = document.getElementById('f-address');
        if(addressEl) addressEl.innerText = `📍 ${data.address}`;
    }

    // ৪. সোশ্যাল লিঙ্ক আপডেট
    if(data.facebook) {
        const fbEl = document.getElementById('f-fb');
        if(fbEl) fbEl.href = data.facebook;
    }
    if(data.instagram) {
        const instaEl = document.getElementById('f-insta');
        if(instaEl) instaEl.href = data.instagram;
    }
    if(data.phone) {
        const waEl = document.getElementById('f-wa');
        if(waEl) waEl.href = `https://wa.me/${data.phone.replace(/\D/g,'')}`;
    }
    
    // ৫. বছর আপডেট
    const yearEl = document.getElementById('year');
    if(yearEl) yearEl.innerText = new Date().getFullYear();
}

// অটোমেটিক রান
loadShopBranding();