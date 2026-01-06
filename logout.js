import { auth } from "./firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

window.logout = function () {
  signOut(auth)
    .then(() => {
      alert("Logged out successfully");
      window.location.href = "login.html";
    });
};
