import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import getFirebaseConfig from "./config.js"; // ✅ Secure Firebase Config Import

async function initializeFirebase() {
    try {
        const firebaseConfig = await getFirebaseConfig();
        if (!firebaseConfig) throw new Error("⚠️ Firebase Config Load नहीं हुआ!");

        // ✅ Firebase Init
        const app = initializeApp(firebaseConfig);
        return getDatabase(app);
    } catch (error) {
        console.error("❌ Firebase Initialization Error:", error);
        alert("🚨 Firebase लोड करने में दिक्कत आ रही है!");
    }
}

async function loadJobs() {
    try {
        const db = await initializeFirebase();
        if (!db) return;

        const jobsRef = ref(db, "Jobs");
        const snapshot = await get(jobsRef);

        if (snapshot.exists()) {
            const jobsData = snapshot.val();
            const jobsContainer = document.getElementById("jobs-container");
            jobsContainer.innerHTML = ""; // पहले का डेटा क्लियर करें

            Object.keys(jobsData).forEach(jobKey => {
                const job = jobsData[jobKey];
                const jobElement = document.createElement("div");
                jobElement.classList.add("job");

                // ✅ अगर कोई lastDate नहीं है, तो "No Deadline" दिखाएं
                const deadlineText = job.lastDate ? job.lastDate : "⏳ No Deadline";

                jobElement.innerHTML = `
                    <h3>${job.title}</h3>
                    <p><strong>कंपनी:</strong> ${job.company}</p>
                    <p><strong>स्थान:</strong> ${job.location}</p>
                    <p><strong>अंतिम तिथि:</strong> ${deadlineText}</p>
                    <a href="${job.applyLink}" target="_blank">🔗 Apply Now</a>
                `;

                jobsContainer.appendChild(jobElement);
            });
        } else {
            console.log("⚠️ कोई जॉब डेटा नहीं मिला!");
        }
    } catch (error) {
        console.error("❌ Error Loading Jobs:", error);
        alert("🚨 जॉब डेटा लोड करने में दिक्कत आ रही है!");
    }
}

// ✅ जब पेज लोड हो, तब जॉब्स लोड करें
document.addEventListener("DOMContentLoaded", loadJobs);
