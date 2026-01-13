import { auth } from '../config/firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

export function initChat() {
    var Tawk_API = Tawk_API || {};
    var Tawk_LoadStart = new Date();

    (function () {
        var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
        s1.async = true;
        s1.src = 'https://embed.tawk.to/6965d60db5ffaf19820cc735/1jeqso9s7'; 
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin', '*');
        s0.parentNode.insertBefore(s1, s0);
    })();

    // ইউজার আইডেন্টিফিকেশন লজিক (উন্নত ভার্সন)
    onAuthStateChanged(auth, (user) => {
        if (user) {
            window.Tawk_API = window.Tawk_API || {};
            
            // যদি চ্যাট বক্স অলরেডি লোড হয়ে থাকে
            if (typeof window.Tawk_API.setAttributes === 'function') {
                window.Tawk_API.setAttributes({
                    'name': user.displayName,
                    'email': user.email
                }, function(error){});
            } else {
                // লোড হওয়ার জন্য অপেক্ষা করা
                window.Tawk_API.onLoad = function () {
                    window.Tawk_API.setAttributes({
                        'name': user.displayName,
                        'email': user.email
                    }, function(error){});
                };
            }
        }
    });
}

initChat();