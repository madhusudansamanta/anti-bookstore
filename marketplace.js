import { db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const productList = document.getElementById("productList");

const querySnapshot = await getDocs(collection(db, "products"));

productList.innerHTML = "";

querySnapshot.forEach(doc => {
  const data = doc.data();

  productList.innerHTML += `
    <div class="product-card">
      <img src="${data.imageURL}" alt="Product">
      <h3>${data.title}</h3>
      <p class="price">₹${data.price}</p>
      <p class="condition">Condition: ${data.condition}</p>

      <!-- BUY NOW BUTTON -->
      <a href="product.html?id=${doc.id}" class="btn">Buy Now</a>
    </div>
  `;
});
