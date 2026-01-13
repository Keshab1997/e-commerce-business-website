import { auth } from '../config/firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

export function initChat() {
    // ১. Tawk.to মেইন স্ক্রিপ্ট (আপনার আইডি সহ)
    var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
    (function () {
        var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
        s1.async = true;
        // আপনার দেওয়া লিঙ্কটি এখানে বসানো হয়েছে
        s1.src = 'https://embed.tawk.to/6965d60db5ffaf19820cc735/1jeqso9s7'; 
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin', '*');
        s0.parentNode.insertBefore(s1, s0);
    })();

    // ২. কাস্টমার লগইন থাকলে তার নাম ও ইমেইল অটোমেটিক চ্যাটে সেট করা
    onAuthStateChanged(auth, (user) => {
        if (user) {
            window.Tawk_API = window.Tawk_API || {};
            window.Tawk_API.onLoad = function () {
                window.Tawk_API.setAttributes({
                    'name': user.displayName,
                    'email': user.email
                }, function (error) { });
            };
        }
    });
}

// চ্যাট চালু করা
initChat();