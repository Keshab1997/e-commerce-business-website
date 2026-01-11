// Firebase লাইব্রেরি ইম্পোর্ট (ভার্সন ১০.৭.১ - এটি ব্রাউজারের জন্য খুব স্টেবল)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ⚠️ আপনার দেওয়া কনফিগারেশন
const firebaseConfig = {
    apiKey: "AIzaSyAwnFilgXxe-mMynkvwq4C5dtuDc_PnJIs",
    authDomain: "e-commerce-7b99d.firebaseapp.com",
    projectId: "e-commerce-7b99d",
    storageBucket: "e-commerce-7b99d.firebasestorage.app",
    messagingSenderId: "341644548538",
    appId: "1:341644548538:web:75cbf3712a2aca51046583",
    measurementId: "G-SFDK9PYGZB"
};

// ১. অ্যাপ ইনিশিয়ালাইজ করা
const app = initializeApp(firebaseConfig);

// ২. অথেনটিকেশন এবং ডেটাবেস এক্সপোর্ট করা
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// ৩. লগইন ফাংশন (Google Popup)
export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        console.log("লগইন সফল:", user.displayName);
        return user;
    } catch (error) {
        console.error("লগইন এরর:", error.message);
        throw error;
    }
};

// ৪. লগআউট ফাংশন
export const logoutUser = async () => {
    try {
        await signOut(auth);
        console.log("লগআউট সফল");
        window.location.href = '/'; // হোম পেজে পাঠিয়ে দেবে
    } catch (error) {
        console.error("লগআউট এরর:", error);
    }
};

// ৫. ইউজার লগইন অবস্থায় আছে কিনা চেক করা (Auth State Observer)
export const monitorAuthState = (callback) => {
    onAuthStateChanged(auth, (user) => {
        callback(user);
    });
};