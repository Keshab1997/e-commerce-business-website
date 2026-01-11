// এই ফাংশনটি হেডার এবং ফুটার লোড করবে
export async function loadCommonComponents() {
    // ১. নেভিগেশন বার লোড
    const navContainer = document.getElementById('navbar-container');
    if (navContainer) {
        const html = await fetch('/modules/common/navbar/navbar.html').then(res => res.text());
        navContainer.innerHTML = html;
        
        // CSS লোড
        loadCSS('/modules/common/navbar/navbar.css');
        
        // JS লোড (মডিউল হিসেবে)
        import('/modules/common/navbar/navbar.js');
    }

    // ২. ফুটার লোড
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        const html = await fetch('/modules/common/footer/footer.html').then(res => res.text());
        footerContainer.innerHTML = html;

        // CSS লোড
        loadCSS('/modules/common/footer/footer.css');
    }
}

// CSS লোড করার হেল্পার ফাংশন
function loadCSS(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}