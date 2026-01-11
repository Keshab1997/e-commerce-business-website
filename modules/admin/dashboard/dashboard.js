import { auth, logoutUser } from '../../../config/firebase-config.js';

export function initDashboard() {
    // ১. লগইন চেক করা (কেউ যেন লগইন ছাড়া ঢুকতে না পারে)
    const user = auth.currentUser;
    
    if (user) {
        const nameElement = document.getElementById('admin-name');
        if (nameElement) nameElement.innerText = user.displayName.split(' ')[0]; // শুধু প্রথম নাম দেখাবে
    } else {
        // ইউজার না থাকলে লগইন পেজে পাঠিয়ে দেবে (একটু সময় নিয়ে যাতে ফায়ারবেস লোড হতে পারে)
        setTimeout(() => {
            if (!auth.currentUser) {
                window.history.pushState({}, "", "/admin");
                window.dispatchEvent(new Event('popstate'));
            }
        }, 1000);
    }

    // ২. লগআউট বাটন
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if(confirm("আপনি কি লগআউট করতে চান?")) {
                logoutUser();
            }
        });
    }

    // ৩. কার্ডে ক্লিক করলে পেজ চেঞ্জ করার ফাংশন
    window.routeTo = (path) => {
        window.history.pushState({}, "", path);
        window.dispatchEvent(new Event('popstate'));
    };
}

// ড্যাশবোর্ড চালু
initDashboard();