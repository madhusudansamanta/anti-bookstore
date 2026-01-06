import { db, auth } from "./firebase.js";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const container = document.getElementById("paymentRequests");

auth.onAuthStateChanged((user) => {
  if (!user) return;

  const q = query(
    collection(db, "payments"),
    where("sellerId", "==", user.uid),
    where("status", "==", "pending")
  );

  onSnapshot(q, (snapshot) => {
    container.innerHTML = "";

    snapshot.forEach((payment) => {
      const data = payment.data();

      container.innerHTML += `
        <div class="listing-item">
          ₹${data.amount}
          <button onclick="confirmPayment('${payment.id}')">
            Confirm
          </button>
        </div>
      `;
    });
  });
});

window.confirmPayment = async function (id) {
  await updateDoc(doc(db, "payments", id), {
    status: "confirmed"
  });

  alert("Payment confirmed!");
};
