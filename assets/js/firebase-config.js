import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
// Thêm các dịch vụ khác ở đây nếu cần (ví dụ: auth, firestore)
// import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDyElyW7NnfqZmYHq1XJtT93G8Ze5bsc2Q",
  authDomain: "luxperfume-4f373.firebaseapp.com",
  projectId: "luxperfume-4f373",
  storageBucket: "luxperfume-4f373.firebasestorage.app",
  messagingSenderId: "276984393497",
  appId: "1:276984393497:web:b4329472c59b24ea9e5f88",
  measurementId: "G-69PB0SNHTY"
};

// Khởi tạo Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
