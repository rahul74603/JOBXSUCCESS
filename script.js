// Firebase SDKs Import
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { firebaseConfig } from "./secrets.js";  // 🔹 API Key को Secure तरीके से Import किया

// Firebase Initialize
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Firebase से Data लाने के लिए
const jobsRef = ref(db, "jobs");
onValue(jobsRef, (snapshot) => {
    const data = snapshot.val();
    console.log(data);  // 🔹 Console में चेक करने के लिए
});
