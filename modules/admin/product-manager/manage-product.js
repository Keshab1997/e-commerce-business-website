import { db } from '../../../config/firebase-config.js';
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc, query, orderBy, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
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

            // ছবি আপলোড হেল্পার ফাংশন
            async function uploadFile(fileInput) {
                if (fileInput.files.length > 0) {
                    return await uploadImage(fileInput.files[0]);
                }
                return null;
            }

            try {
                // সব ছবি আপলোড করা
                const img1 = await uploadFile(document.getElementById('p-image'));
                const img2 = await uploadFile(document.getElementById('p-img2'));
                const img3 = await uploadFile(document.getElementById('p-img3'));
                const videoLink = document.getElementById('p-video').value;

                const productData = {
                    name: document.getElementById('p-name').value,
                    price: Number(document.getElementById('p-price').value),
                    qty: Number(document.getElementById('p-qty').value), // নতুন
                    barcode: document.getElementById('p-barcode').value || "N/A", // নতুন
                    category: document.getElementById('p-category').value,
                    color: document.getElementById('p-color').value || "N/A",
                    material: document.getElementById('p-material').value || "N/A",
                    size: document.getElementById('p-size').value || "Free Size",
                    description: document.getElementById('p-desc').value,
                    image: img1,       // মেইন ছবি
                    images: [img1, img2, img3].filter(i => i !== null), // সব ছবির লিস্ট
                    video: videoLink,  // ভিডিও লিঙ্ক
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
            
            // গ্যালারি ইমেজগুলো লোড করা
            let galleryHtml = '';
            if (p.images && p.images.length > 0) {
                galleryHtml = '<div class="gallery-edit-row">';
                p.images.forEach((img, index) => {
                    galleryHtml += `
                        <div class="gallery-thumb">
                            <img src="${img}" id="g-img-${doc.id}-${index}">
                            <label class="thumb-overlay">
                                ✏️
                                <input type="file" hidden onchange="replaceGalleryImage('${doc.id}', ${index}, this)">
                            </label>
                        </div>
                    `;
                });
                galleryHtml += '</div>';
            }
            html += `
                <div class="admin-card" id="card-${doc.id}">
                    <!-- মেইন ছবি -->
                    <div class="card-img-wrapper">
                        <img src="${p.image}" id="img-${doc.id}">
                        <label class="img-upload-overlay">
                            📷 মেইন ছবি বদলান
                            <input type="file" hidden onchange="updateProductImage('${doc.id}', this, 'main')">
                        </label>
                    </div>

                    <div class="card-body">
                        <!-- নাম ও দাম -->
                        <label class="input-label">নাম:</label>
                        <input type="text" class="edit-input name-input" id="name-${doc.id}" value="${p.name}" disabled>
                        
                        <label class="input-label">দাম (₹):</label>
                        <input type="number" class="edit-input price-input" id="price-${doc.id}" value="${p.price}" disabled>
                        
                        <!-- 👇 নতুন: Qty ও Barcode রো -->
                        <div class="qty-barcode-row">
                            <span>📦 Qty: <input type="number" class="edit-input qty-input" id="qty-${doc.id}" value="${p.qty || 0}" disabled></span>
                            <span class="barcode-text">🆔 Barcode: <input type="text" class="edit-input barcode-input" id="barcode-${doc.id}" value="${p.barcode || 'N/A'}" disabled></span>
                        </div>
                        
                        <!-- ডিটেইলস -->
                        <div class="details-edit-grid">
                            <div><label class="input-label">রঙ:</label><input type="text" class="edit-input detail-input" id="color-${doc.id}" value="${p.color || ''}" disabled></div>
                            <div><label class="input-label">কাপড়:</label><input type="text" class="edit-input detail-input" id="material-${doc.id}" value="${p.material || ''}" disabled></div>
                            <div><label class="input-label">সাইজ:</label><input type="text" class="edit-input detail-input" id="size-${doc.id}" value="${p.size || ''}" disabled></div>
                        </div>

                        <!-- বিবরণ -->
                        <div style="margin-top: 10px;">
                            <label class="input-label">বিবরণ:</label>
                            <textarea class="edit-input desc-input" id="desc-${doc.id}" rows="2" disabled>${p.description || ''}</textarea>
                        </div>

                        <!-- নতুন: ভিডিও এবং গ্যালারি এডিট সেকশন -->
                        <div class="extra-edit-section" style="display:none;" id="extra-${doc.id}">
                            <label class="input-label">ভিডিও লিঙ্ক:</label>
                            <input type="text" class="edit-input" id="video-${doc.id}" value="${p.video || ''}" placeholder="YouTube বা Instagram Reels লিঙ্ক">
                            
                            <label class="input-label" style="margin-top:10px;">গ্যালারি ছবি (ক্লিক করে বদলান):</label>
                            ${galleryHtml}
                            
                            <label class="input-label" style="margin-top:5px;">আরও ছবি যোগ করুন:</label>
                            <input type="file" multiple onchange="addExtraImages('${doc.id}', this)" style="font-size:0.8rem;">
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

// ১. এডিট মোড টগল করা (ভিডিও সেকশন দেখানো/লুকানো)
window.toggleEdit = (id, isEditing) => {
    const card = document.getElementById(`card-${id}`);
    const inputs = card.querySelectorAll('input, textarea');
    const extraSection = document.getElementById(`extra-${id}`);

    if (isEditing) {
        card.classList.add('editing');
        inputs.forEach(input => input.disabled = false);
        extraSection.style.display = 'block'; // ভিডিও সেকশন দেখাবে
        document.getElementById(`name-${id}`).focus();
    } else {
        card.classList.remove('editing');
        inputs.forEach(input => input.disabled = true);
        extraSection.style.display = 'none'; // ভিডিও সেকশন লুকাবে
        loadProducts();
    }
};

// ২. সেভ করা (ভিডিও লিঙ্ক সহ)
window.saveProduct = async (id) => {
    const newName = document.getElementById(`name-${id}`).value;
    const newPrice = document.getElementById(`price-${id}`).value;
    const newQty = document.getElementById(`qty-${id}`).value; // নতুন
    const newBarcode = document.getElementById(`barcode-${id}`).value; // নতুন
    const newColor = document.getElementById(`color-${id}`).value;
    const newMaterial = document.getElementById(`material-${id}`).value;
    const newSize = document.getElementById(`size-${id}`).value;
    const newDesc = document.getElementById(`desc-${id}`).value;
    const newVideo = document.getElementById(`video-${id}`).value; // ভিডিও লিঙ্ক

    try {
        await updateDoc(doc(db, "products", id), {
            name: newName,
            price: Number(newPrice),
            qty: Number(newQty), // নতুন
            barcode: newBarcode, // নতুন
            color: newColor,
            material: newMaterial,
            size: newSize,
            description: newDesc,
            video: newVideo // ভিডিও আপডেট
        });
        alert("✅ আপডেট হয়েছে!");
        toggleEdit(id, false);
    } catch (error) {
        alert("আপডেট করা যায়নি!");
    }
};

window.updateProductImage = async (id, input, type) => {
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

// ৩. অতিরিক্ত ছবি যোগ করা
window.addExtraImages = async (id, input) => {
    if (input.files.length > 0) {
        if(confirm("আপনি কি এই ছবিগুলো গ্যালারিতে যোগ করতে চান?")) {
            try {
                const newImages = [];
                for (let i = 0; i < input.files.length; i++) {
                    const url = await uploadImage(input.files[i]);
                    newImages.push(url);
                }
                
                // আগের ছবির সাথে নতুনগুলো যোগ করা
                const docRef = doc(db, "products", id);
                const docSnap = await getDoc(docRef);
                let currentImages = docSnap.data().images || [];
                
                await updateDoc(docRef, { 
                    images: [...currentImages, ...newImages] 
                });
                
                alert("✅ ছবি যোগ হয়েছে!");
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

// গ্যালারি ইমেজ রিপ্লেস করার ফাংশন
window.replaceGalleryImage = async (id, index, input) => {
    if (input.files && input.files[0]) {
        if(confirm("আপনি কি এই ছবিটি পরিবর্তন করতে চান?")) {
            try {
                const newUrl = await uploadImage(input.files[0]);
                
                const docRef = doc(db, "products", id);
                const docSnap = await getDoc(docRef);
                let currentImages = docSnap.data().images || [];
                
                currentImages[index] = newUrl;
                
                await updateDoc(docRef, { images: currentImages });
                
                document.getElementById(`g-img-${id}-${index}`).src = newUrl;
                alert("✅ ছবি পরিবর্তন হয়েছে!");
            } catch (error) {
                alert("ছবি আপলোড করা যায়নি!");
            }
        }
    }
};

// ৩. সার্চ ফাংশন (নতুন)
window.searchProducts = () => {
    const term = document.getElementById('product-search').value.toLowerCase();
    const cards = document.querySelectorAll('.admin-card');

    cards.forEach(card => {
        const name = card.querySelector('.name-input').value.toLowerCase();
        const barcode = card.querySelector('.barcode-input').value.toLowerCase();
        
        if (name.includes(term) || barcode.includes(term)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
};