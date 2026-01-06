import { db, auth } from "./firebase.js";
import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const storage = getStorage();

// 🔥 GLOBAL FUNCTION (IMPORTANT)
window.addProduct = async function () {

  const user = auth.currentUser;

  if (!user) {
    alert("Please login first");
    return;
  }

  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;
  const price = document.getElementById("price").value;
  const condition = document.getElementById("condition").value;
  const description = document.getElementById("description").value;
  const upiId = document.getElementById("upiId").value;
  const imageFile = document.getElementById("image").files[0];

  if (!title || !price || !upiId || !imageFile) {
    alert("Please fill all required fields");
    return;
  }

  try {
    // ✅ Upload Image
    const imageRef = ref(
      storage,
      `products/${user.uid}_${Date.now()}`
    );

    await uploadBytes(imageRef, imageFile);
    const imageURL = await getDownloadURL(imageRef);

    // ✅ Save Product in Firestore
    await addDoc(collection(db, "products"), {
      title,
      category,
      price,
      condition,
      description,
      imageURL,

      // 🔥 VERY IMPORTANT
      sellerId: user.uid,
      upiId: upiId,

      createdAt: new Date()
    });

    alert("Product posted successfully!");
    window.location.href = "marketplace.html";

  } catch (error) {
    alert(error.message);
    console.error(error);
  }
};
