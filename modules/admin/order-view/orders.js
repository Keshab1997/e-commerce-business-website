import { db } from '../../../config/firebase-config.js';
import { collection, getDocs, query, orderBy, doc, getDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let currentOrderId = null;

export async function initOrderView() {
    const grid = document.getElementById('orders-grid');
    
    try {
        const q = query(collection(db, "orders"), orderBy("orderDate", "desc"));
        const snapshot = await getDocs(q);
        
        let html = '';
        if (snapshot.empty) {
            grid.innerHTML = '<p style="text-align:center; width:100%;">কোনো অর্ডার নেই।</p>';
            return;
        }

        snapshot.forEach(doc => {
            const order = doc.data();
            const date = order.orderDate ? new Date(order.orderDate.seconds * 1000).toLocaleDateString('bn-BD') : 'N/A';
            
            html += `
                <div class="order-card">
                    <div class="order-header">
                        <span>📅 ${date}</span>
                        <span>ID: #${doc.id.slice(0,6)}</span>
                    </div>
                    <div class="order-body">
                        <h4>${order.customerName}</h4>
                        <p>📞 ${order.phone}</p>
                        <p>🛍️ ${order.productName}</p>
                        <span class="status-badge status-${order.status}">
                            ${getStatusText(order.status)}
                        </span>
                    </div>
                    <button class="btn-view" onclick="viewOrderDetails('${doc.id}')">👁️ বিস্তারিত দেখুন</button>
                </div>
            `;
        });
        grid.innerHTML = html;

    } catch (error) {
        console.error(error);
        grid.innerHTML = '<p>লোড করা যায়নি</p>';
    }
}

// স্ট্যাটাস টেক্সট কনভার্টার
function getStatusText(status) {
    const map = {
        'pending': 'অপেক্ষমান',
        'shipped': 'শিপড',
        'delivered': 'ডেলিভারড',
        'cancelled': 'বাতিল'
    };
    return map[status] || status;
}

// ১. অর্ডার ডিটেইলস দেখা (মোডাল ওপেন)
window.viewOrderDetails = async (id) => {
    currentOrderId = id;
    const modal = document.getElementById('order-details-modal');
    
    try {
        // অর্ডার ডেটা আনা
        const orderSnap = await getDoc(doc(db, "orders", id));
        const order = orderSnap.data();

        // ছবির লজিক (প্রথমে অর্ডারে সেভ করা ছবি, তারপর প্রোডাক্ট থেকে)
        let productImg = 'https://via.placeholder.com/60';
        
        if (order.productImage) {
            // নতুন অর্ডারে ছবি আছে
            productImg = order.productImage;
        } else if (order.productId) {
            // পুরানো অর্ডার - প্রোডাক্ট আইডি দিয়ে ছবি আনা
            try {
                const prodSnap = await getDoc(doc(db, "products", order.productId));
                if (prodSnap.exists()) {
                    productImg = prodSnap.data().image;
                }
            } catch (err) {
                console.log('Product not found:', err);
            }
        }

        // ডেটা বসানো
        document.getElementById('m-date').innerText = new Date(order.orderDate.seconds * 1000).toLocaleString();
        document.getElementById('m-pname').innerText = order.productName;
        document.getElementById('m-price').innerText = order.price;
        document.getElementById('m-img').src = productImg;
        
        document.getElementById('m-cname').innerText = order.customerName;
        document.getElementById('m-phone').innerText = order.phone;
        document.getElementById('m-phone').href = `tel:${order.phone}`;
        document.getElementById('m-address').innerText = order.address;
        
        document.getElementById('m-status').value = order.status;

        modal.style.display = 'flex';

    } catch (error) {
        console.error(error);
        alert("ডিটেইলস লোড করা যায়নি!");
    }
};

// ২. স্ট্যাটাস আপডেট
window.updateOrderStatus = async () => {
    const newStatus = document.getElementById('m-status').value;
    if (currentOrderId) {
        await updateDoc(doc(db, "orders", currentOrderId), { status: newStatus });
        alert("✅ স্ট্যাটাস আপডেট হয়েছে!");
        initOrderView(); // রিফ্রেশ
    }
};

// ৩. অর্ডার অ্যাকসেপ্ট
window.acceptOrder = async () => {
    if (!currentOrderId) return;

    const confirmAccept = confirm("আপনি কি এই অর্ডারটি অ্যাকসেপ্ট করতে চান?");
    if (confirmAccept) {
        try {
            // স্ট্যাটাস আপডেট করে 'shipped' করা
            await updateDoc(doc(db, "orders", currentOrderId), { 
                status: 'shipped' 
            });
            
            alert("✅ অর্ডার সফলভাবে অ্যাকসেপ্ট করা হয়েছে!");
            closeOrderModal();
            initOrderView(); // লিস্ট রিফ্রেশ
        } catch (error) {
            console.error(error);
            alert("সমস্যা হয়েছে!");
        }
    }
};

// ৪. অর্ডার ডিলিট
window.deleteCurrentOrder = async () => {
    if (confirm("আপনি কি নিশ্চিত এই অর্ডারটি ডিলিট করতে চান?")) {
        await deleteDoc(doc(db, "orders", currentOrderId));
        closeOrderModal();
        initOrderView();
    }
};

// মোডাল বন্ধ করা
window.closeOrderModal = () => {
    document.getElementById('order-details-modal').style.display = 'none';
};

// অটোমেটিক রান
initOrderView();