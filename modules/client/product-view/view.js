import { db } from '../../../config/firebase-config.js';
import { doc, getDoc, addDoc, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let currentProduct = {};

export async function initProductView() {
    const productId = localStorage.getItem('currentProductId');
    
    if (!productId) {
        document.querySelector('.product-view-container').innerHTML = '<h1>প্রোডাক্ট পাওয়া যায়নি</h1>';
        return;
    }

    try {
        // ডেটাবেস থেকে প্রোডাক্ট আনা
        const docRef = doc(db, "products", productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            currentProduct = { id: docSnap.id, ...docSnap.data() };
            renderProductDetails(currentProduct);
        } else {
            document.querySelector('.product-view-container').innerHTML = '<h1>প্রোডাক্টটি ডিলিট করা হয়েছে।</h1>';
        }
    } catch (error) {
        console.error("Error:", error);
    }

    // অর্ডার ফর্ম সাবমিট
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', submitOrder);
    }
}

function renderProductDetails(p) {
    const categoryMap = {
        'saree': 'শাড়ি',
        'suit': 'সুট/থ্রি-পিস',
        'panjabi': 'পাঞ্জাবি',
        'jewelry': 'গয়না'
    };

    document.getElementById('view-img').src = p.image;
    document.getElementById('view-name').innerText = p.name;
    document.getElementById('view-price').innerText = p.price;
    document.getElementById('view-category').innerText = categoryMap[p.category] || p.category;
    document.getElementById('view-desc').innerText = p.description || "কোনো বিবরণ নেই।";
}

// ১. অর্ডার মোডাল ওপেন করা
window.orderNow = () => {
    document.getElementById('order-modal').style.display = 'flex';
};

window.closeModal = () => {
    document.getElementById('order-modal').style.display = 'none';
};

// ২. হোয়াটসঅ্যাপে অর্ডার (সরাসরি মেসেজ যাবে)
window.orderOnWhatsApp = () => {
    // আপনার ফোন নম্বর এখানে দিন (কান্ট্রি কোড সহ)
    const phoneNumber = "8801711000000"; 
    
    const message = `হাই! আমি এই প্রোডাক্টটি কিনতে চাই:
    
নাম: ${currentProduct.name}
দাম: ${currentProduct.price} টাকা
লিঙ্ক: ${window.location.href}`;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
};

// ৩. অর্ডার ডেটাবেসে সেভ করা
async function submitOrder(e) {
    e.preventDefault();
    
    const btn = e.target.querySelector('button');
    btn.innerText = "অর্ডার হচ্ছে...";
    btn.disabled = true;

    const orderData = {
        customerName: document.getElementById('cust-name').value,
        phone: document.getElementById('cust-phone').value,
        address: document.getElementById('cust-address').value,
        productName: currentProduct.name,
        price: currentProduct.price,
        productId: currentProduct.id,
        status: 'pending', // নতুন অর্ডার
        orderDate: new Date()
    };

    try {
        await addDoc(collection(db, "orders"), orderData);
        
        alert("✅ আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে! আমরা শীঘ্রই যোগাযোগ করব।");
        closeModal();
        e.target.reset();
    } catch (error) {
        console.error(error);
        alert("অর্ডার করতে সমস্যা হয়েছে।");
    } finally {
        btn.innerText = "অর্ডার কনফার্ম করুন";
        btn.disabled = false;
    }
}

// অটোমেটিক রান
initProductView();