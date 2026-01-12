// ডাইনামিক হেডার ইউটিলিটি
export function updatePageHeader(productName, category, shopName = 'SootBoot') {
    // ১. পেজ টাইটেল আপডেট
    const pageTitle = `${productName} | ${category} | ${shopName}`;
    document.title = pageTitle;
    
    // ২. ডাইনামিক টাইটেল এলিমেন্ট আপডেট (যদি থাকে)
    const dynamicTitle = document.getElementById('dynamic-title');
    if (dynamicTitle) {
        dynamicTitle.innerText = `${productName} | ${shopName}`;
    }
    
    // ৩. নেভবার লোগো টেক্সট আপডেট (যদি প্রয়োজন হয়)
    const navLogo = document.getElementById('dynamic-nav-logo');
    if (navLogo && shopName !== 'SootBoot') {
        navLogo.innerText = shopName;
    }
}

// মেটা ট্যাগ আপডেট করার ফাংশন (SEO এর জন্য)
export function updateMetaTags(productName, description, imageUrl) {
    // Open Graph মেটা ট্যাগ
    updateMetaTag('og:title', productName);
    updateMetaTag('og:description', description);
    updateMetaTag('og:image', imageUrl);
    
    // Twitter Card মেটা ট্যাগ
    updateMetaTag('twitter:title', productName);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', imageUrl);
    
    // সাধারণ মেটা ট্যাগ
    updateMetaTag('description', description);
}

// হেল্পার ফাংশন: মেটা ট্যাগ আপডেট
function updateMetaTag(property, content) {
    let metaTag = document.querySelector(`meta[property="${property}"]`) || 
                  document.querySelector(`meta[name="${property}"]`);
    
    if (!metaTag) {
        metaTag = document.createElement('meta');
        if (property.startsWith('og:') || property.startsWith('twitter:')) {
            metaTag.setAttribute('property', property);
        } else {
            metaTag.setAttribute('name', property);
        }
        document.head.appendChild(metaTag);
    }
    
    metaTag.setAttribute('content', content);
}