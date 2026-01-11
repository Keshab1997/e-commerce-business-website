import { db } from '../../../config/firebase-config.js';
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let allProducts = []; // সব প্রোডাক্ট এখানে জমা থাকবে ফিল্টারিংয়ের জন্য

export async function initGallery() {
    const grid = document.getElementById('gallery-grid');
    
    try {
        // ডেটাবেস থেকে প্রোডাক্ট আনা
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        allProducts = [];
        querySnapshot.forEach((doc) => {
            allProducts.push({ id: doc.id, ...doc.data() });
        });

        // প্রথমে সব প্রোডাক্ট দেখানো
        renderProducts(allProducts);

    } catch (error) {
        console.error("Error loading gallery:", error);
        grid.innerHTML = '<p>দুঃখিত, প্রোডাক্ট লোড করা যাচ্ছে না।</p>';
    }
}

// প্রোডাক্ট রেন্ডার করার ফাংশন
function renderProducts(products) {
    const grid = document.getElementById('gallery-grid');
    
    if (products.length === 0) {
        grid.innerHTML = '<p style="text-align:center; width:100%;">কোনো প্রোডাক্ট পাওয়া যায়নি।</p>';
        return;
    }

    let html = '';
    products.forEach(p => {
        html += `
            <div class="product-card" onclick="viewProduct('${p.id}')">
                <div class="card-img-box">
                    <img src="${p.image}" alt="${p.name}" loading="lazy">
                </div>
                <div class="card-info">
                    <h3 class="card-title">${p.name}</h3>
                    <p class="card-price">৳ ${p.price}</p>
                    <span class="btn-view">বিস্তারিত দেখুন</span>
                </div>
            </div>
        `;
    });

    grid.innerHTML = html;
}

// ফিল্টার ফাংশন (গ্লোবাল)
window.filterProducts = (category) => {
    // বাটন স্টাইল চেঞ্জ
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (category === 'all') {
        renderProducts(allProducts);
    } else {
        const filtered = allProducts.filter(p => p.category === category);
        renderProducts(filtered);
    }
};

// প্রোডাক্ট ডিটেইলস পেজে যাওয়ার ফাংশন
window.viewProduct = (id) => {
    window.history.pushState({}, "", `/product/${id}`);
    window.dispatchEvent(new Event('popstate'));
};

// অটোমেটিক রান
initGallery();