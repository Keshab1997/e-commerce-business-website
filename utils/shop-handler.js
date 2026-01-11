import { db } from '../config/firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// দোকানের তথ্য আনার ফাংশন
export async function getShopDetails() {
    try {
        // ডেটাবেসের 'settings' কালেকশন থেকে 'shopInfo' ডকুমেন্ট খুঁজবে
        const docRef = doc(db, "settings", "shopInfo");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data(); // ডেটাবেসে যা নাম আছে তা ফেরত দেবে
        } else {
            // যদি ডেটাবেসে এখনো নাম সেট না করেন, তবে ডিফল্ট নাম দেখাবে
            return { name: "শাড়ি সম্ভার (ডিফল্ট)", address: "ঠিকানা সেট করা হয়নি" };
        }
    } catch (error) {
        console.error("দোকানের নাম লোড করতে সমস্যা:", error);
        return { name: "আমার দোকান", address: "" };
    }
}