import { auth } from "./firebase.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {

  const sellLink = document.getElementById("sellLink");
  const logoutBtn = document.getElementById("logoutBtn");
  const loginLink = document.getElementById("loginLink");

  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (sellLink) sellLink.style.display = "inline";
      if (logoutBtn) logoutBtn.style.display = "inline";
      if (loginLink) loginLink.style.display = "none";
      window.currentUser = user;
    } else {
      if (sellLink) sellLink.style.display = "none";
      if (logoutBtn) logoutBtn.style.display = "none";
      if (loginLink) loginLink.style.display = "inline";
      window.currentUser = null;
    }
  });

});
