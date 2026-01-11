import { db } from '../../../config/firebase-config.js';
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { uploadImage } from '../../../utils/image-uploader.js';

export async function initSettings() {
    const form = document.getElementById('shop-settings-form');
    const statusMsg = document.getElementById('status-msg');
    const saveBtn = document.getElementById('save-btn');

    // ১. আগের সেভ করা তথ্য লোড করা
    loadCurrentSettings();

    // ২. ফর্ম সাবমিট হলে
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        saveBtn.disabled = true;
        saveBtn.innerText = "সেভ হচ্ছে...";
        statusMsg.innerText = "";

        try {
            // ইনপুট থেকে ভ্যালু নেওয়া
            const shopData = {
                name: document.getElementById('shop-name').value,
                tagline: document.getElementById('shop-tagline').value,
                phone: document.getElementById('shop-phone').value,
                address: document.getElementById('shop-address').value,
                facebook: document.getElementById('shop-fb').value
            };

            // ছবি আপলোড (যদি নতুন ছবি দেয়)
            const fileInput = document.getElementById('shop-logo-file');
            if (fileInput.files.length > 0) {
                statusMsg.innerText = "লোগো আপলোড হচ্ছে...";
                const imageUrl = await uploadImage(fileInput.files[0]);
                shopData.logo = imageUrl; // ইমেজের লিঙ্ক ডেটায় যোগ করা
            }

            // ফায়ারবেসে সেভ করা
            await setDoc(doc(db, "settings", "shopInfo"), shopData, { merge: true });

            statusMsg.style.color = "green";
            statusMsg.innerText = "✅ সফলভাবে সেভ হয়েছে!";
            saveBtn.innerText = "💾 পরিবর্তন সেভ করুন";
            saveBtn.disabled = false;

            // পেজ রিফ্রেশ না করে হেডার আপডেট করা (অপশনাল)
            alert("সেটিংস আপডেট হয়েছে! পেজটি একবার রিফ্রেশ দিন।");

        } catch (error) {
            console.error(error);
            statusMsg.style.color = "red";
            statusMsg.innerText = "❌ সেভ করা যায়নি। আবার চেষ্টা করুন।";
            saveBtn.disabled = false;
            saveBtn.innerText = "💾 পরিবর্তন সেভ করুন";
        }
    });
}

// ডেটাবেস থেকে তথ্য এনে ফর্মে বসানো
async function loadCurrentSettings() {
    try {
        const docRef = doc(db, "settings", "shopInfo");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            document.getElementById('shop-name').value = data.name || '';
            document.getElementById('shop-tagline').value = data.tagline || '';
            document.getElementById('shop-phone').value = data.phone || '';
            document.getElementById('shop-address').value = data.address || '';
            document.getElementById('shop-fb').value = data.facebook || '';

            if (data.logo) {
                const img = document.getElementById('current-logo');
                img.src = data.logo;
                img.style.display = 'block';
            }
        }
    } catch (error) {
        console.log("No settings found yet.");
    }
}

// অটোমেটিক রান
initSettings();