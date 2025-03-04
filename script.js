import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// 🔥 **अपनी Firebase Config यहाँ डालो** 🔥
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Firebase Initialize
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// **Jobs Load करना**
const jobsContainer = document.getElementById("jobs-container");

const jobsRef = ref(db, "jobs");
onValue(jobsRef, (snapshot) => {
    const data = snapshot.val();
    jobsContainer.innerHTML = ""; // पुराना Data हटाएँ

    if (data) {
        Object.keys(data).forEach((key) => {
            const job = data[key];
            const jobDiv = document.createElement("div");
            jobDiv.classList.add("job");
            jobDiv.innerHTML = `
                <h3>${job.title}</h3>
                <p><strong>विभाग:</strong> ${job.department}</p>
                <p><strong>अंतिम तिथि:</strong> ${job.lastDate}</p>
            `;
            jobsContainer.appendChild(jobDiv);
        });
    } else {
        jobsContainer.innerHTML = "<p>कोई नौकरी उपलब्ध नहीं है</p>";
    }
});
