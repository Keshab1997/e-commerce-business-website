export async function loadCommonComponents() {
    // ১. নেভিগেশন বার লোড (পাথের আগে . যোগ করা হয়েছে)
    const navContainer = document.getElementById('navbar-container');
    if (navContainer) {
        try {
            const html = await fetch('./modules/common/navbar/navbar.html').then(res => res.text());
            navContainer.innerHTML = html;
            loadCSS('./modules/common/navbar/navbar.css');
            import('./modules/common/navbar/navbar.js');
        } catch (e) { console.error("Navbar load failed", e); }
    }

    // ২. ফুটার লোড
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        try {
            const html = await fetch('./modules/common/footer/footer.html').then(res => res.text());
            footerContainer.innerHTML = html;
            loadCSS('./modules/common/footer/footer.css');
        } catch (e) { console.error("Footer load failed", e); }
    }
}

function loadCSS(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}