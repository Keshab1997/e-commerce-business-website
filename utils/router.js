import { ROUTES } from '../config/app-constants.js';
import { loadCommonComponents } from './ui-renderer.js';

// GitHub Pages এর রিপোজিটরির নাম (আপনার URL থেকে নেওয়া)
const REPO_NAME = '/e-commerce-business-website';

const initRouter = () => {
    loadCommonComponents();
    window.addEventListener('popstate', handleLocation);
    handleLocation();
};

window.route = (event) => {
    event = event || window.event;
    event.preventDefault();
    
    // href পাওয়ার সময় খেয়াল রাখতে হবে
    let href = event.target.getAttribute('href');
    
    // GitHub Pages এ থাকলে পাথের আগে রিপোর নাম যোগ করতে হবে (যদি না থাকে)
    if (window.location.hostname.includes('github.io') && !href.startsWith(REPO_NAME)) {
        // লোকাল রাউটিং এর জন্য আমরা ব্রাউজারের হিস্ট্রিতে পুশ করব
        window.history.pushState({}, "", REPO_NAME + href);
    } else {
        window.history.pushState({}, "", href);
    }
    
    handleLocation();
};

const handleLocation = async () => {
    let path = window.location.pathname;

    // GitHub Pages ফিক্স: রিপোর নাম পাথ থেকে সরিয়ে ফেলা
    if (path.startsWith(REPO_NAME)) {
        path = path.replace(REPO_NAME, '');
    }
    // যদি রুট পাথ ফাঁকা হয়ে যায়, সেটাকে '/' করা
    if (path === '') path = '/';

    let route = ROUTES[path];

    // ডাইনামিক রাউট চেকিং (যেমন: /product/xyz)
    if (!route && path.startsWith('/product/')) {
        const productId = path.split('/')[2];
        localStorage.setItem('currentProductId', productId);
        
        route = {
            title: 'প্রোডাক্ট বিস্তারিত',
            template: './modules/client/product-view/view.html',
            style: './modules/client/product-view/view.css',
            script: './modules/client/product-view/view.js'
        };
    }

    if (!route) route = ROUTES['404'];

    document.title = route.title;
    const mainContent = document.getElementById('main-content');

    try {
        let html;
        if (route.template.endsWith('.html')) {
            const response = await fetch(route.template);
            if (!response.ok) throw new Error("File not found");
            html = await response.text();
        } else {
            html = route.template;
        }

        mainContent.innerHTML = html;

        if (route.style) loadStyle(route.style);
        if (route.script) loadScript(route.script);

    } catch (error) {
        console.error("Page Load Error:", error);
        mainContent.innerHTML = "<h1>দুঃখিত, পেজটি লোড করা যাচ্ছে না।</h1><p>Check console for details.</p>";
    }
};

const loadStyle = (href) => {
    const oldLink = document.getElementById('dynamic-style');
    if (oldLink) oldLink.remove();
    const link = document.createElement('link');
    link.id = 'dynamic-style';
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
};

const loadScript = async (src) => {
    try {
        await import(src + '?t=' + Date.now());
    } catch (e) {
        console.log("Script load error", e);
    }
};

initRouter();