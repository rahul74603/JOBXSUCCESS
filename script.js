document.addEventListener("DOMContentLoaded", async function () {
    const jobsList = document.getElementById("jobsList");

    try {
        // ✅ firebase-config.js से Firebase config import करना
        const configModule = await import("./firebase-config.js");
        const firebaseConfig = configModule.default;

        // ✅ Firebase Initialize (अगर पहले से नहीं हुआ हो)
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        const db = firebase.database().ref("jobs"); // ✅ 'jobs' सही Database Path

        // ✅ Firebase से Jobs तेजी से लोड करें
        db.on("value", (snapshot) => {
            jobsList.innerHTML = ""; // 🔹 पहले की लिस्ट हटाना
            const jobs = snapshot.val();

            if (jobs) {
                Object.keys(jobs).forEach((key) => {
                    const job = jobs[key];

                    // 🔹 Deadline चेक करना (अगर नहीं है तो छिपा दो)
                    const deadlineText = job.lastDate ? `📅 Last Date: ${job.lastDate}` : "";

                    // 🔹 HTML Structure
                    const jobElement = document.createElement("li");
                    jobElement.innerHTML = `
                        <div class="job-card">
                            <strong>${job.title}</strong> - <i>${job.company}</i>
                            <br> 📍 Location: ${job.location}
                            <br> ${deadlineText}
                            <br> <a class="apply-btn" href="${job.applyLink}" target="_blank">🚀 Apply Now</a>
                        </div>
                    `;
                    jobsList.appendChild(jobElement);
                });
            } else {
                jobsList.innerHTML = "<li>कोई सरकारी नौकरी उपलब्ध नहीं</li>";
            }
        });
    } catch (error) {
        console.error("❌ Error loading Firebase config:", error);
    }
});
