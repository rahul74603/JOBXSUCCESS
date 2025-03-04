// ✅ DOM Load होने के बाद Code Execute होगा
document.addEventListener("DOMContentLoaded", async function () {
    const jobsList = document.getElementById("jobsList");

    try {
        // ✅ firebase-config.js से Firebase config import करना
        const configModule = await import("./firebase-config.js");
        const firebaseConfig = configModule.default;

        // ✅ Firebase Modules Import करना
        import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
        import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

        // ✅ Firebase Initialize (Duplication से बचने के लिए)
        const app = initializeApp(firebaseConfig);
        const db = getDatabase(app);
        const jobsRef = ref(db, "Jobs"); // ✅ 'Jobs' Database का सही Path

        // ✅ Firebase से Realtime Data Listen करना
        onValue(jobsRef, (snapshot) => {
            jobsList.innerHTML = ""; // 🔹 पहले की लिस्ट क्लियर करें
            const jobs = snapshot.val();

            if (jobs) {
                Object.keys(jobs).forEach((key) => {
                    const job = jobs[key];
                    const jobElement = document.createElement("li");

                    // ✅ अगर कोई डेटा Missing है तो Default Value दें
                    const title = job.title || "No Title";
                    const company = job.company || "Unknown";
                    const location = job.location || "N/A";
                    const applyLink = job.applyLink || "#";

                    jobElement.innerHTML = `
                        <strong>${title}</strong> - ${company}, ${location} 
                        <a href="${applyLink}" target="_blank">Apply</a>
                    `;
                    jobsList.appendChild(jobElement);
                });
            } else {
                jobsList.innerHTML = "<li>⚠️ कोई सरकारी नौकरी उपलब्ध नहीं</li>";
            }
        });
    } catch (error) {
        console.error("🔥 Error loading Firebase config:", error);
    }
});
