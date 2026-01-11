import { db } from '../../../config/firebase-config.js';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { uploadImage } from '../../../utils/image-uploader.js';

export function initProductManager() {
    const form = document.getElementById('add-product-form');
    const statusMsg = document.getElementById('p-status');
    const addBtn = document.getElementById('add-btn');
    const fileInput = document.getElementById('p-image');
    const previewDiv = document.getElementById('p-preview');

    if (fileInput) {
        fileInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewDiv.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                }
                reader.readAsDataURL(file);
            }
        });
    }

    loadProducts();

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            addBtn.disabled = true;
            addBtn.innerText = "আপলোড হচ্ছে...";
            statusMsg.innerText = "ছবি আপলোড হচ্ছে... দয়া করে অপেক্ষা করুন।";
            statusMsg.style.color = "blue";

            try {
                const imageUrl = await uploadImage(fileInput.files[0]);

                const productData = {
                    name: document.getElementById('p-name').value,
                    price: Number(document.getElementById('p-price').value),
                    category: document.getElementById('p-category').value,
                    description: document.getElementById('p-desc').value,
                    image: imageUrl,
                    createdAt: new Date()
                };

                await addDoc(collection(db, "products"), productData);

                statusMsg.style.color = "green";
                statusMsg.innerText = "✅ প্রোডাক্ট সফলভাবে যোগ হয়েছে!";
                form.reset();
                previewDiv.innerHTML = "";
                addBtn.innerText = "➕ প্রোডাক্ট যোগ করুন";
                addBtn.disabled = false;

                loadProducts();

            } catch (error) {
                console.error(error);
                statusMsg.style.color = "red";
                statusMsg.innerText = "❌ সমস্যা হয়েছে। আবার চেষ্টা করুন।";
                addBtn.disabled = false;
                addBtn.innerText = "➕ প্রোডাক্ট যোগ করুন";
            }
        });
    }
}

async function loadProducts() {
    const listContainer = document.getElementById('product-list-container');
    const totalCount = document.getElementById('total-products');
    
    if (!listContainer) return;

    try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        let html = '';
        let count = 0;

        querySnapshot.forEach((doc) => {
            const p = doc.data();
            count++;
            
            const categoryMap = {
                'saree': 'শাড়ি',
                'suit': 'সুট/থ্রি-পিস',
                'panjabi': 'পাঞ্জাবি',
                'jewelry': 'গয়না'
            };
            const categoryBangla = categoryMap[p.category] || p.category;

            // 👇 পরিবর্তন: এখানে ৳ এর বদলে ₹ দেওয়া হয়েছে
            html += `
                <div class="product-item">
                    <img src="${p.image}" class="thumb-img" alt="${p.name}">
                    <div class="p-info">
                        <div class="p-title">${p.name}</div>
                        <div class="p-price">₹ ${p.price} | ${categoryBangla}</div>
                    </div>
                    <button class="btn-delete" onclick="deleteProduct('${doc.id}')" title="ডিলিট করুন">🗑️</button>
                </div>
            `;
        });

        if (count === 0) {
            listContainer.innerHTML = '<p style="text-align:center; color:#999; padding: 20px;">কোনো প্রোডাক্ট নেই।</p>';
        } else {
            listContainer.innerHTML = html;
        }
        if (totalCount) totalCount.innerText = count;

    } catch (error) {
        console.error("Error loading products:", error);
        listContainer.innerHTML = '<p style="color:red;">লিস্ট লোড করা যায়নি।</p>';
    }
}

window.deleteProduct = async (id) => {
    if (confirm("আপনি কি নিশ্চিত এই প্রোডাক্টটি ডিলিট করতে চান?")) {
        try {
            await deleteDoc(doc(db, "products", id));
            loadProducts();
        } catch (error) {
            alert("ডিলিট করা যায়নি!");
        }
    }
};

initProductManager();