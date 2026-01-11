import { db } from '../../../config/firebase-config.js';
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { uploadImage } from '../../../utils/image-uploader.js';

export function initProductManager() {
    loadProducts();

    const form = document.getElementById('add-product-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('add-btn');
            const status = document.getElementById('p-status');
            
            btn.disabled = true;
            btn.innerText = "আপলোড হচ্ছে...";
            status.innerText = "অপেক্ষা করুন...";

            try {
                const fileInput = document.getElementById('p-image');
                const imageUrl = await uploadImage(fileInput.files[0]);

                const productData = {
                    name: document.getElementById('p-name').value,
                    price: Number(document.getElementById('p-price').value),
                    category: document.getElementById('p-category').value,
                    color: document.getElementById('p-color').value || "N/A",
                    material: document.getElementById('p-material').value || "N/A",
                    size: document.getElementById('p-size').value || "Free Size",
                    description: document.getElementById('p-desc').value,
                    image: imageUrl,
                    createdAt: new Date()
                };

                await addDoc(collection(db, "products"), productData);

                status.innerText = "✅ সফল!";
                form.reset();
                loadProducts();
                window.toggleAddForm();

            } catch (error) {
                console.error(error);
                status.innerText = "❌ এরর হয়েছে!";
            }
            btn.disabled = false;
            btn.innerText = "আপলোড করুন";
        });
    }
}

async function loadProducts() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '<div class="loading-spinner">লোড হচ্ছে...</div>';

    try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        
        let html = '';
        snapshot.forEach(doc => {
            const p = doc.data();
            html += `
                <div class="admin-card" id="card-${doc.id}">
                    <div class="card-img-wrapper">
                        <img src="${p.image}" id="img-${doc.id}">
                        <label class="img-upload-overlay">
                            📷 ছবি পরিবর্তন
                            <input type="file" hidden onchange="updateProductImage('${doc.id}', this)">
                        </label>
                    </div>

                    <div class="card-body">
                        <!-- নাম ও দাম -->
                        <label class="input-label">নাম:</label>
                        <input type="text" class="edit-input name-input" id="name-${doc.id}" value="${p.name}" disabled>
                        
                        <label class="input-label">দাম (₹):</label>
                        <input type="number" class="edit-input price-input" id="price-${doc.id}" value="${p.price}" disabled>
                        
                        <!-- 👇 নতুন: রঙ, কাপড়, সাইজ এডিট করার ফিল্ড -->
                        <div class="details-edit-grid">
                            <div>
                                <label class="input-label">রঙ:</label>
                                <input type="text" class="edit-input detail-input" id="color-${doc.id}" value="${p.color || ''}" disabled>
                            </div>
                            <div>
                                <label class="input-label">কাপড়:</label>
                                <input type="text" class="edit-input detail-input" id="material-${doc.id}" value="${p.material || ''}" disabled>
                            </div>
                            <div>
                                <label class="input-label">সাইজ:</label>
                                <input type="text" class="edit-input detail-input" id="size-${doc.id}" value="${p.size || ''}" disabled>
                            </div>
                        </div>

                        <!-- বিবরণ এডিট করার বক্স -->
                        <div style="margin-top: 10px;">
                            <label class="input-label">বিবরণ:</label>
                            <textarea class="edit-input desc-input" id="desc-${doc.id}" rows="2" disabled>${p.description || ''}</textarea>
                        </div>

                        <!-- অ্যাকশন বাটন -->
                        <div class="card-actions">
                            <button class="action-btn btn-edit" onclick="toggleEdit('${doc.id}', true)">✏️ এডিট</button>
                            <button class="action-btn btn-del" onclick="deleteProduct('${doc.id}')">🗑️ ডিলিট</button>
                            
                            <button class="action-btn btn-save" onclick="saveProduct('${doc.id}')">✅ সেভ করুন</button>
                            <button class="action-btn btn-cancel" onclick="toggleEdit('${doc.id}', false)">❌ বাতিল</button>
                        </div>
                    </div>
                </div>
            `;
        });
        grid.innerHTML = html;

    } catch (error) {
        console.error(error);
        grid.innerHTML = '<p>লোড করা যায়নি</p>';
    }
}

// ১. এডিট মোড টগল করা
window.toggleEdit = (id, isEditing) => {
    const card = document.getElementById(`card-${id}`);
    const inputs = card.querySelectorAll('.edit-input'); // শুধু এডিট ইনপুট ধরা হলো

    if (isEditing) {
        card.classList.add('editing');
        inputs.forEach(input => input.disabled = false); // সব ইনপুট চালু
        document.getElementById(`name-${id}`).focus();
    } else {
        card.classList.remove('editing');
        inputs.forEach(input => input.disabled = true); // সব ইনপুট বন্ধ
        loadProducts(); // রিসেট করার জন্য রিলোড
    }
};

// ২. সেভ করা (বিবরণ সহ)
window.saveProduct = async (id) => {
    const newName = document.getElementById(`name-${id}`).value;
    const newPrice = document.getElementById(`price-${id}`).value;
    const newColor = document.getElementById(`color-${id}`).value;
    const newMaterial = document.getElementById(`material-${id}`).value;
    const newSize = document.getElementById(`size-${id}`).value;
    const newDesc = document.getElementById(`desc-${id}`).value;

    try {
        await updateDoc(doc(db, "products", id), {
            name: newName,
            price: Number(newPrice),
            color: newColor,
            material: newMaterial,
            size: newSize,
            description: newDesc
        });
        alert("✅ আপডেট হয়েছে!");
        toggleEdit(id, false);
    } catch (error) {
        alert("আপডেট করা যায়নি!");
    }
};

window.updateProductImage = async (id, input) => {
    if (input.files && input.files[0]) {
        if(confirm("আপনি কি ছবি পরিবর্তন করতে চান?")) {
            try {
                const newImageUrl = await uploadImage(input.files[0]);
                await updateDoc(doc(db, "products", id), { image: newImageUrl });
                document.getElementById(`img-${id}`).src = newImageUrl;
                alert("✅ ছবি পরিবর্তন হয়েছে!");
            } catch (error) {
                alert("ছবি আপলোড করা যায়নি!");
            }
        }
    }
};

window.deleteProduct = async (id) => {
    if (confirm("সত্যিই ডিলিট করবেন?")) {
        try {
            await deleteDoc(doc(db, "products", id));
            document.getElementById(`card-${id}`).remove();
        } catch (error) {
            alert("ডিলিট করা যায়নি!");
        }
    }
};