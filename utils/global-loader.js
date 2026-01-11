import { db } from '../config/firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// এই ফাংশনটি সব পেজে কল হবে
export async function loadShopBranding() {
    // ১. প্রথমে লোকাল স্টোরেজ চেক করা (যাতে পেজ লোড হওয়ার সাথে সাথে নাম দেখায়)
    const cachedName = localStorage.getItem('shopName');
    if (cachedName) {
        updateDomElements(cachedName);
    }

    try {
        // ২. ব্যাকগ্রাউন্ডে ফায়ারবেস থেকে লেটেস্ট নাম আনা
        const docRef = doc(db, "settings", "shopInfo");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const shopName = data.name || "শাড়ি সম্ভার";
            
            // লোকাল স্টোরেজে আপডেট করা
            localStorage.setItem('shopName', shopName);
            
            // স্ক্রিনে আপডেট করা
            updateDomElements(shopName);
        }
    } catch (error) {
        console.error("Branding load error:", error);
    }
}

// HTML এ নাম বসানোর ফাংশন
function updateDomElements(name) {
    // ১. ব্রাউজার ট্যাব টাইটেল (Page Title)
    document.title = name + " | অনলাইন শপ";

    // ২. নেভিগেশন বার লোগো
    const navLogo = document.getElementById('dynamic-nav-logo');
    if (navLogo) navLogo.innerText = name;

    // ৩. ফুটার ব্র্যান্ড নাম
    const footerName = document.getElementById('f-name');
    if (footerName) footerName.innerText = name;

    // ৪. লগইন পেজ বা ড্যাশবোর্ড হেডার
    const adminHeader = document.getElementById('admin-page-title');
    if (adminHeader) adminHeader.innerText = name;
}

// অটোমেটিক রান হবে
loadShopBranding();