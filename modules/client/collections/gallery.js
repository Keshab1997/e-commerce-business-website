import { db } from '../../../config/firebase-config.js';
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let allProducts = [];
let currentCategory = 'all';

export async function initGallery() {
    const grid = document.getElementById('gallery-grid');
    try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        allProducts = [];
        querySnapshot.forEach((doc) => {
            allProducts.push({ id: doc.id, ...doc.data() });
        });

        applyFilters(); // শুরুতে সব দেখাবে

    } catch (error) {
        grid.innerHTML = '<p>লোড করা যায়নি।</p>';
    }
}

// ক্যাটাগরি সেট করা
window.setCategory = (cat, event) => {
    currentCategory = cat;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    applyFilters();
};

// মেইন ফিল্টার ফাংশন (সার্চ + ক্যাটাগরি + সর্ট)
window.applyFilters = () => {
    const searchTerm = document.getElementById('customer-search').value.toLowerCase();
    const sortOrder = document.getElementById('price-sort').value;

    // ১. ক্যাটাগরি ও সার্চ অনুযায়ী ফিল্টার
    let filtered = allProducts.filter(p => {
        const matchesCategory = currentCategory === 'all' || p.category === currentCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchTerm) || 
                             (p.description && p.description.toLowerCase().includes(searchTerm));
        return matchesCategory && matchesSearch;
    });

    // ২. দাম অনুযায়ী সর্টিং
    if (sortOrder === 'low') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'high') {
        filtered.sort((a, b) => b.price - a.price);
    }

    renderProducts(filtered);
};

function renderProducts(products) {
    const grid = document.getElementById('gallery-grid');
    if (products.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1; text-align:center; padding:50px;">দুঃখিত, কোনো প্রোডাক্ট পাওয়া যায়নি।</p>';
        return;
    }

    grid.innerHTML = products.map(p => `
        <div class="product-card" onclick="window.location.href='product.html?id=${p.id}'">
            <div class="card-img-box">
                <img src="${p.image}" alt="${p.name}" loading="lazy">
            </div>
            <div class="card-info">
                <h3 class="card-title">${p.name}</h3>
                <p class="card-price">₹ ${p.price}</p>
                <span class="btn-view">বিস্তারিত দেখুন</span>
            </div>
        </div>
    `).join('');
}

initGallery();