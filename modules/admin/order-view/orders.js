import { db } from '../../../config/firebase-config.js';
import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function initOrderView() {
    const tableBody = document.getElementById('orders-table-body');
    if (!tableBody) return;

    try {
        const q = query(collection(db, "orders"), orderBy("orderDate", "desc"));
        const querySnapshot = await getDocs(q);

        let html = '';
        let count = 0;

        querySnapshot.forEach((doc) => {
            const order = doc.data();
            count++;
            
            const date = order.orderDate ? new Date(order.orderDate.seconds * 1000).toLocaleDateString('bn-BD') : 'N/A';

            // 👇 পরিবর্তন: এখানে ৳ এর বদলে ₹ দেওয়া হয়েছে
            html += `
                <tr>
                    <td>${date}</td>
                    <td>${order.customerName}</td>
                    <td><a href="tel:${order.phone}">${order.phone}</a></td>
                    <td>${order.productName}</td>
                    <td>₹ ${order.price}</td>
                    <td>${order.address}</td>
                    <td>
                        <span class="badge badge-${order.status}" onclick="toggleStatus('${doc.id}', '${order.status}')" style="cursor:pointer">
                            ${order.status === 'pending' ? 'অপেক্ষমান' : 'সম্পন্ন'}
                        </span>
                    </td>
                    <td>
                        <button class="btn-del" onclick="deleteOrder('${doc.id}')">🗑️</button>
                    </td>
                </tr>
            `;
        });

        if (count === 0) {
            tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:20px;">কোনো অর্ডার নেই।</td></tr>';
        } else {
            tableBody.innerHTML = html;
        }

    } catch (error) {
        console.error("Error loading orders:", error);
        tableBody.innerHTML = '<tr><td colspan="8" style="color:red; text-align:center;">অর্ডার লোড করা যায়নি।</td></tr>';
    }
}

window.deleteOrder = async (id) => {
    if (confirm("আপনি কি নিশ্চিত এই অর্ডারটি মুছে ফেলতে চান?")) {
        try {
            await deleteDoc(doc(db, "orders", id));
            initOrderView();
        } catch (error) {
            alert("ডিলিট করা যায়নি!");
        }
    }
};

window.toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    try {
        await updateDoc(doc(db, "orders", id), { status: newStatus });
        initOrderView();
    } catch (error) {
        console.error(error);
    }
};

initOrderView();