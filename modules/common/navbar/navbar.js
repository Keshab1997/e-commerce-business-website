// মোবাইল মেনু টগল করার লজিক
export function initNavbar() {
    const hamburger = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav-menu');

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
        });

        // লিঙ্কে ক্লিক করলে মেনু বন্ধ হয়ে যাবে
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
            });
        });
    }
}

// ফাংশনটি কল করা হলো যাতে লোড হওয়ার সাথে সাথে কাজ করে
initNavbar();