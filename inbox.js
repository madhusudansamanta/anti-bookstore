import { db, auth } from "./firebase.js";
import {
  collection,
  query,
  where,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (!user) return;

  const chatList = document.getElementById("chatList");

  const q = query(
    collection(db, "chats"),
    where("sellerId", "==", user.uid)
  );

  onSnapshot(q, (snapshot) => {
    chatList.innerHTML = "";

    snapshot.forEach((doc) => {
      const chat = doc.data();

      const div = document.createElement("div");
      div.className = "chat-item";

      div.innerHTML = `
        <p><b>Product:</b> ${chat.productId}</p>
        <button>Open Chat</button>
      `;

      div.onclick = () => {
        window.location.href =
          `chat.html?product=${chat.productId}&seller=${chat.sellerId}`;
      };

      chatList.appendChild(div);
    });
  });
});
