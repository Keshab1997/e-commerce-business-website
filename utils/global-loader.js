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
function updateNameElements(name) {
    document.title = name + " | অনলাইন শপ";
    
    const navLogo = document.getElementById('dynamic-nav-logo');
    if (navLogo) navLogo.innerText = name;

    const footerName = document.getElementById('f-name');
    if (footerName) footerName.innerText = name;
    
    // এডমিন প্যানেলের জন্য
    const adminPageTitle = document.getElementById('admin-page-title');
    if (adminPageTitle) adminPageTitle.innerText = name + " - এডমিন প্যানেল";
}

// 👇 ফুটার ডিটেইলস আপডেট করার ফাংশন
function updateFooterDetails(data) {
    // ১. নাম ও বিবরণ
    if(data.name) {
        const nameEl = document.getElementById('f-name');
        if(nameEl) nameEl.innerText = data.name;
        const copyrightName = document.getElementById('f-copyright-name');
        if(copyrightName) copyrightName.innerText = data.name;
    }
    if(data.description) {
        const descEl = document.getElementById('f-desc');
        if(descEl) descEl.innerText = data.description;
    }
    
    // ২. যোগাযোগ আপডেট
    if(data.phone) {
        const phoneEl = document.getElementById('f-phone');
        if(phoneEl) phoneEl.innerHTML = `📞 ${data.phone}`;
    }
    if(data.email) {
        const emailEl = document.getElementById('f-email');
        if(emailEl) emailEl.innerHTML = `✉️ ${data.email}`;
    }
    if(data.address) {
        const addressEl = document.getElementById('f-address');
        if(addressEl) addressEl.innerHTML = `📍 ${data.address}`;
    }

    // ৩. সোশ্যাল লিঙ্ক আপডেট
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
        if(waEl) waEl.href = `https://wa.me/${data.phone}`;
    }
    
    // ৪. বছর আপডেট
    const yearEl = document.getElementById('year');
    if(yearEl) yearEl.innerText = new Date().getFullYear();
}

// অটোমেটিক রান
loadShopBranding();