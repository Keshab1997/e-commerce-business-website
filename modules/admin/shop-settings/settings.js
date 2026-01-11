import { db } from '../../../config/firebase-config.js';
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { uploadImage } from '../../../utils/image-uploader.js';

export async function initSettings() {
    const form = document.getElementById('shop-settings-form');
    const statusMsg = document.getElementById('status-msg');
    const saveBtn = document.getElementById('save-btn');

    // লোড ডেটা
    loadCurrentSettings();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        saveBtn.disabled = true;
        saveBtn.innerText = "সেভ হচ্ছে...";
        statusMsg.innerText = "";

        try {
            const shopData = {
                name: document.getElementById('shop-name').value,
                description: document.getElementById('shop-desc').value,
                phone: document.getElementById('shop-phone').value,
                email: document.getElementById('shop-email').value,
                address: document.getElementById('shop-address').value,
                facebook: document.getElementById('shop-fb').value
            };

            const fileInput = document.getElementById('shop-logo-file');
            if (fileInput.files.length > 0) {
                const imageUrl = await uploadImage(fileInput.files[0]);
                shopData.logo = imageUrl;
            } else {
                // আগের লোগো রাখা (যদি নতুন না দেয়)
                const oldLogo = document.getElementById('current-logo').src;
                if(oldLogo && oldLogo !== window.location.href) shopData.logo = oldLogo;
            }

            await setDoc(doc(db, "settings", "shopInfo"), shopData, { merge: true });

            // 👇 এই লাইনটি যোগ করা হয়েছে: লোকাল স্টোরেজ আপডেট করা যাতে রিফ্রেশ ছাড়াই নাম বদলে যায়
            localStorage.setItem('shopName', shopData.name);
            const navLogo = document.getElementById('dynamic-nav-logo');
            if (navLogo) navLogo.innerText = shopData.name; // যদি মেনুবার থাকে

            statusMsg.style.color = "green";
            statusMsg.innerText = "✅ সফলভাবে সেভ হয়েছে!";
            saveBtn.innerText = "💾 সেটিংস সেভ করুন";
            saveBtn.disabled = false;

        } catch (error) {
            console.error(error);
            statusMsg.style.color = "red";
            statusMsg.innerText = "❌ সেভ করা যায়নি।";
            saveBtn.disabled = false;
        }
    });
}

async function loadCurrentSettings() {
    try {
        const docRef = doc(db, "settings", "shopInfo");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            document.getElementById('shop-name').value = data.name || '';
            document.getElementById('shop-desc').value = data.description || '';
            document.getElementById('shop-phone').value = data.phone || '';
            document.getElementById('shop-email').value = data.email || '';
            document.getElementById('shop-address').value = data.address || '';
            document.getElementById('shop-fb').value = data.facebook || '';

            if (data.logo) {
                const img = document.getElementById('current-logo');
                img.src = data.logo;
                img.style.display = 'block';
            }
        }
    } catch (error) {
        console.log("No settings found.");
    }
}

initSettings();