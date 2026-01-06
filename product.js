import { db, auth } from "./firebase.js";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ===== GET PRODUCT ID =====
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

if (!productId) {
  alert("Product not found");
}

// ===== GLOBAL PRODUCT DATA =====
let productData = null;

// ===== FETCH PRODUCT =====
const productRef = doc(db, "products", productId);
const productSnap = await getDoc(productRef);

if (!productSnap.exists()) {
  alert("Product does not exist");
  throw new Error("Invalid product");
}

productData = productSnap.data();

// ===== FILL UI =====
document.getElementById("productTitle").innerText = productData.title;
document.getElementById("productPrice").innerText = "₹" + productData.price;
document.getElementById("productCategory").innerText = productData.category;
document.getElementById("productCondition").innerText = productData.condition;
document.getElementById("productDescription").innerText = productData.description;

if (productData.imageURL) {
  document.getElementById("productImage").src = productData.imageURL;
}

// ===== CONTACT SELLER =====
document.getElementById("contactSellerBtn").addEventListener("click", () => {
  if (!auth.currentUser) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  window.location.href =
    `chat.html?product=${productId}&seller=${productData.sellerId}`;
});

// ===== BUY NOW (HTML BUTTON) =====
document.getElementById("buyNowBtn").addEventListener("click", () => {
  if (!auth.currentUser) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  document.getElementById("upiSection").style.display = "block";
  document.getElementById("sellerUpi").innerText = productData.upiId;
  document.getElementById("upiAmount").innerText = productData.price;

  document.getElementById("upiLink").href =
    `upi://pay?pa=${productData.upiId}&pn=AntiBookstore&am=${productData.price}&cu=INR`;
});

// ===== BUYER CONFIRM PAYMENT =====
const paidBtn = document.getElementById("paidBtn");

paidBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  paidBtn.disabled = true;

  await addDoc(collection(db, "payments"), {
    productId: productId,
    buyerId: user.uid,
    sellerId: productData.sellerId,
    amount: productData.price,
    status: "pending",
    createdAt: serverTimestamp()
  });

  const statusText = document.getElementById("paymentStatus");
  statusText.innerText =
    "⏳ Payment sent. Waiting for seller confirmation.";
  statusText.style.color = "orange";
});
