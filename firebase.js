// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA5rv9df4U4TwAVGZSZ_pJzfLIGA74v9Z0",
  authDomain: "anti-bookstore.firebaseapp.com",
  projectId: "anti-bookstore",
  storageBucket: "anti-bookstore.firebasestorage.app",
  messagingSenderId: "262879506028",
  appId: "1:262879506028:web:ad8b9ceeebccf3d526f249",
  measurementId: "G-X1CXJGWBFL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const db = getFirestore(app);
export const auth = getAuth(app);
