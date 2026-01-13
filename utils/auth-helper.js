import { db } from '../config/firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function isAdmin(email) {
    if (!email) return false;
    const docRef = doc(db, "admins", email.toLowerCase().trim());
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
}