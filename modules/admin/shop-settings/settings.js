import { db } from '../../../config/firebase-config.js';
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { uploadImage } from '../../../utils/image-uploader.js';

export async function initSettings() {
    const form = document.getElementById('shop-settings-form');
    const statusMsg = document.getElementById('status-msg');
    const saveBtn = document.getElementById('save-btn');

    if (!form) return;

    loadCurrentSettings();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.innerText = "সেভ হচ্ছে...";
        }
        if (statusMsg) statusMsg.innerText = "";

        try {
            const shopData = {
                name: document.getElementById('shop-name').value,
                description: document.getElementById('shop-desc').value,
                phone: document.getElementById('shop-phone').value,
                email: document.getElementById('shop-email').value,
                address: document.getElementById('shop-address').value,
                facebook: document.getElementById('shop-fb').value,
                instagram: document.getElementById('shop-insta') ? document.getElementById('shop-insta').value : ""
            };

            const fileInput = document.getElementById('shop-logo-file');
            if (fileInput && fileInput.files.length > 0) {
                const imageUrl = await uploadImage(fileInput.files[0]);
                shopData.logo = imageUrl;
            } else {
                const currentLogoImg = document.getElementById('current-logo');
                if (currentLogoImg && currentLogoImg.src && !currentLogoImg.src.includes(window.location.host)) {
                    shopData.logo = currentLogoImg.src;
                }
            }

            await setDoc(doc(db, "settings", "shopInfo"), shopData, { merge: true });

            localStorage.setItem('shopName', shopData.name);

            const navLogo = document.getElementById('dynamic-nav-logo');
            if (navLogo) navLogo.innerText = shopData.name;

            if (statusMsg) {
                statusMsg.style.color = "green";
                statusMsg.innerText = "✅ সফলভাবে সেভ হয়েছে!";
            }

        } catch (error) {
            console.error("Save Error:", error);
            if (statusMsg) {
                statusMsg.style.color = "red";
                statusMsg.innerText = "❌ সেভ করা যায়নি।";
            }
        } finally {
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.innerText = "💾 সেটিংস সেভ করুন";
            }
        }
    });
}

async function loadCurrentSettings() {
    try {
        const docRef = doc(db, "settings", "shopInfo");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            if(document.getElementById('shop-name')) document.getElementById('shop-name').value = data.name || '';
            if(document.getElementById('shop-desc')) document.getElementById('shop-desc').value = data.description || '';
            if(document.getElementById('shop-phone')) document.getElementById('shop-phone').value = data.phone || '';
            if(document.getElementById('shop-email')) document.getElementById('shop-email').value = data.email || '';
            if(document.getElementById('shop-address')) document.getElementById('shop-address').value = data.address || '';
            if(document.getElementById('shop-fb')) document.getElementById('shop-fb').value = data.facebook || '';
            if(document.getElementById('shop-insta')) document.getElementById('shop-insta').value = data.instagram || '';

            const img = document.getElementById('current-logo');
            if (img && data.logo) {
                img.src = data.logo;
                img.style.display = 'block';
            }
        }
    } catch (error) {
        console.log("Load Error:", error);
    }
}

initSettings();