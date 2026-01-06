import { db, auth } from "./firebase.js";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// URL params
const params = new URLSearchParams(window.location.search);
const productId = params.get("product");
const sellerId = params.get("seller");

if (!productId || !sellerId) {
  alert("Invalid chat link");
  window.location.href = "marketplace.html";
}

// 🔥 WAIT for auth properly
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  const buyerId = user.uid;
  const chatId = `${productId}_${buyerId}_${sellerId}`;

  const chatRef = doc(db, "chats", chatId);
  const messagesRef = collection(db, "chats", chatId, "messages");

  // Create chat if not exists
  const chatSnap = await getDoc(chatRef);
  if (!chatSnap.exists()) {
    await setDoc(chatRef, {
      productId,
      buyerId,
      sellerId,
      createdAt: serverTimestamp()
    });
  }

  // Fetch seller email
  const productSnap = await getDoc(doc(db, "products", productId));
  if (productSnap.exists()) {
    document.getElementById("sellerEmail").innerText =
      "Seller: " + (productSnap.data().sellerEmail || "Seller");
  }

  // Load messages
  const q = query(messagesRef, orderBy("timestamp"));
  onSnapshot(q, (snapshot) => {
    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = "";

    snapshot.forEach((doc) => {
      const msg = doc.data();
      const div = document.createElement("div");

      div.className =
        msg.senderId === user.uid ? "my-msg" : "their-msg";

      div.innerHTML = `<p>${msg.text}</p>`;
      messagesDiv.appendChild(div);
    });

    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });

  // Send message
  document.getElementById("chatForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const text =
        document.getElementById("messageInput").value.trim();

      if (!text) return;

      await addDoc(messagesRef, {
        text,
        senderId: user.uid,
        timestamp: serverTimestamp()
      });

      document.getElementById("messageInput").value = "";
    });
});