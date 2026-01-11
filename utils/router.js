import { ROUTES } from '../config/app-constants.js';
import { loadCommonComponents } from './ui-renderer.js';

// ১. রাউটার ইনিশিয়ালাইজ করা
const initRouter = () => {
    loadCommonComponents(); // হেডার এবং ফুটার লোড করা
    // ব্রাউজারের ব্যাক/ফরওয়ার্ড বাটন হ্যান্ডেল করা
    window.addEventListener('popstate', handleLocation);
    
    // প্রথমবার লোড হওয়ার সময় পেজ রেন্ডার করা
    handleLocation();
};

// ২. লিঙ্কে ক্লিক করলে পেজ রিলোড না করে URL বদলানো
window.route = (event) => {
    event = event || window.event;
    event.preventDefault();
    
    // href থেকে লিঙ্ক নেওয়া
    const href = event.target.getAttribute('href');
    
    // ব্রাউজারের হিস্ট্রিতে নতুন লিঙ্ক যোগ করা
    window.history.pushState({}, "", href);
    
    // নতুন পেজ লোড করা
    handleLocation();
};

// ৩. বর্তমান URL অনুযায়ী সঠিক HTML ফাইল লোড করা
const handleLocation = async () => {
    const path = window.location.pathname;
    let route = ROUTES[path];

    // ডাইনামিক রাউট চেকিং (যেমন: /product/xyz)
    if (!route && path.startsWith('/product/')) {
        const productId = path.split('/')[2];
        localStorage.setItem('currentProductId', productId); // আইডি সেভ রাখা
        
        route = {
            title: 'প্রোডাক্ট বিস্তারিত',
            template: '/modules/client/product-view/view.html',
            style: '/modules/client/product-view/view.css',
            script: '/modules/client/product-view/view.js'
        };
    }

    // যদি তাও না পাওয়া যায়, তবে 404
    if (!route) route = ROUTES['404'];
    
    // পেজের টাইটেল সেট করা
    document.title = route.title;

    const mainContent = document.getElementById('main-content');

    try {
        // HTML ফাইল ফেচ করা (যদি টেমপ্লেট স্ট্রিং না হয়)
        let html;
        if (route.template.endsWith('.html')) {
            const response = await fetch(route.template);
            html = await response.text();
        } else {
            html = route.template;
        }

        // HTML ইনজেক্ট করা
        mainContent.innerHTML = html;

        // CSS লোড করা (যদি থাকে)
        if (route.style) {
            loadStyle(route.style);
        }

        // JS মডিউল লোড করা (যদি থাকে)
        if (route.script) {
            loadScript(route.script);
        }

    } catch (error) {
        console.error("Page Load Error:", error);
        mainContent.innerHTML = "<h1>দুঃখিত, পেজটি লোড করা যাচ্ছে না।</h1>";
    }
};

// সাহায্যকারী ফাংশন: CSS লোড করা
const loadStyle = (href) => {
    // আগের ডাইনামিক স্টাইল রিমুভ করা (যাতে কনফ্লিক্ট না হয়)
    const oldLink = document.getElementById('dynamic-style');
    if (oldLink) oldLink.remove();

    const link = document.createElement('link');
    link.id = 'dynamic-style';
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
};

// সাহায্যকারী ফাংশন: JS লোড করা
const loadScript = async (src) => {
    try {
        // ডাইনামিক ইম্পোর্ট ব্যবহার করে মডিউল লোড করা
        await import(src + '?t=' + Date.now()); // ক্যাশ এড়াতে টাইমস্ট্যাম্প
    } catch (e) {
        console.log("No script or script error for this page", e);
    }
};

// রাউটার চালু করা
initRouter();