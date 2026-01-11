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
}

// 👇 ফুটার ডিটেইলস আপডেট করার ফাংশন
function updateFooterDetails(data) {
    // বিবরণ
    const descEl = document.getElementById('f-desc');
    if (descEl && data.description) descEl.innerText = data.description;

    // ফোন নম্বর
    const phoneEl = document.getElementById('f-phone');
    if (phoneEl && data.phone) {
        phoneEl.innerHTML = `📞 ${data.phone}`;
        phoneEl.href = `tel:${data.phone}`; // ক্লিকেবল লিঙ্ক
    }

    // ঠিকানা
    const addressEl = document.getElementById('f-address');
    if (addressEl && data.address) {
        addressEl.innerText = `📍 ${data.address}`;
    }

    // ইমেইল (যদি থাকে)
    const emailEl = document.getElementById('f-email');
    if (emailEl && data.email) {
        emailEl.innerText = `✉️ ${data.email}`;
    }
}

// অটোমেটিক রান
loadShopBranding();