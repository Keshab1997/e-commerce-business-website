import { loginWithGoogle } from '../../../config/firebase-config.js';
import { getShopDetails } from '../../../utils/shop-handler.js'; // নতুন ইম্পোর্ট

export async function initLogin() {
    // ১. দোকানের নাম লোড করা
    const shopNameElement = document.getElementById('dynamic-shop-name');
    const footerNameElement = document.getElementById('footer-shop-name');
    
    if (shopNameElement) {
        // ডেটাবেস থেকে নাম আনা
        const shopInfo = await getShopDetails();
        
        // নাম বসিয়ে দেওয়া
        shopNameElement.innerText = shopInfo.name;
        shopNameElement.classList.remove('loading-text'); // লোডিং স্টাইল সরিয়ে দেওয়া
        
        if(footerNameElement) footerNameElement.innerText = shopInfo.name;
    }

    // ২. লগইন লজিক (আগের মতোই)
    const loginBtn = document.getElementById('google-login-btn');
    const messageBox = document.getElementById('login-message');

    // যদি বাটন না পাওয়া যায় (অন্য পেজে থাকলে), তাহলে কোড থামিয়ে দেবে
    if (!loginBtn) return;

    loginBtn.addEventListener('click', async () => {
        try {
            // ১. লোডিং অবস্থা
            loginBtn.disabled = true;
            loginBtn.style.opacity = "0.7";
            loginBtn.innerHTML = '<span class="loading-spinner">⏳</span> লগইন হচ্ছে...';
            messageBox.style.color = '#666';
            messageBox.innerText = 'অনুগ্রহ করে পপআপ উইন্ডোতে কনফার্ম করুন...';

            // ২. ফায়ারবেস লগইন কল করা
            const user = await loginWithGoogle();

            // ৩. সফল হলে
            messageBox.style.color = 'green';
            messageBox.innerHTML = `✅ স্বাগতম! ড্যাশবোর্ডে নেওয়া হচ্ছে...`;

            // ৪. ড্যাশবোর্ডে রিডাইরেক্ট (১.৫ সেকেন্ড পর)
            setTimeout(() => {
                // SPA রাউটিং ব্যবহার করে পেজ চেঞ্জ
                window.history.pushState({}, "", "/admin/dashboard");
                
                // ম্যানুয়ালি রাউটার ইভেন্ট ট্রিগার করা যাতে পেজ লোড হয়
                window.dispatchEvent(new Event('popstate'));
            }, 1500);

        } catch (error) {
            // ৫. এরর হলে
            console.error("Login Error:", error);
            
            // বাটন রিসেট
            loginBtn.disabled = false;
            loginBtn.style.opacity = "1";
            loginBtn.innerHTML = '<img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G"> <span>Google দিয়ে লগইন করুন</span>';
            
            // এরর মেসেজ দেখানো
            messageBox.style.color = 'red';
            messageBox.innerText = 'লগইন ব্যর্থ হয়েছে।';
        }
    });
}

// পেজ লোড হলে ফাংশনটি রান করবে
initLogin();