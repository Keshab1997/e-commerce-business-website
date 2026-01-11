// রাউট কনফিগারেশন: কোন পাথে কোন HTML ফাইল লোড হবে
export const ROUTES = {
    '/': {
        title: 'হোম - শাড়ি সম্ভার',
        template: '/modules/client/home/home.html',
        style: '/modules/client/home/home.css',
        script: '/modules/client/home/home.js'
    },
    '/shop': {
        title: 'কালেকশন - শাড়ি সম্ভার',
        template: '/modules/client/collections/gallery.html',
        style: '/modules/client/collections/gallery.css',
        script: '/modules/client/collections/gallery.js'
    },
    '/admin': {
        title: 'এডমিন লগইন',
        template: '/modules/admin/auth/login.html',
        style: '/modules/admin/auth/login.css',
        script: '/modules/admin/auth/login.js'
    },
    '/admin/dashboard': {
        title: 'ড্যাশবোর্ড',
        template: '/modules/admin/dashboard/dashboard.html',
        style: '/modules/admin/dashboard/dashboard.css',
        script: '/modules/admin/dashboard/dashboard.js'
    },
    // 👇 নতুন রাউটগুলো (আপাতত ড্যাশবোর্ডেই রাখবে, পরে পেজ বানাব)
    '/admin/settings': {
        title: 'দোকান সেটিংস',
        template: '/modules/admin/shop-settings/settings.html',
        style: '/modules/admin/shop-settings/settings.css',
        script: '/modules/admin/shop-settings/settings.js'
    },
    '/admin/products': {
        title: 'প্রোডাক্ট ম্যানেজার',
        template: '/modules/admin/product-manager/manage-product.html',
        style: '/modules/admin/product-manager/manage-product.css',
        script: '/modules/admin/product-manager/manage-product.js'
    },
    '/admin/offers': {
        title: 'অফার ব্যানার',
        template: '<h1>অফার পেজ আসছে...</h1>',
        style: '',
        script: ''
    },
    '/admin/orders': {
        title: 'অর্ডার লিস্ট',
        template: '/modules/admin/order-view/orders.html',
        style: '/modules/admin/order-view/orders.css',
        script: '/modules/admin/order-view/orders.js'
    },
    '404': {
        title: 'পাওয়া যায়নি',
        template: '<h1>৪০৪ - পেজটি পাওয়া যায়নি</h1>', // সিম্পল টেক্সট
        style: '',
        script: ''
    }
};