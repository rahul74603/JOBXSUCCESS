document.addEventListener("DOMContentLoaded", async function () {
    const jobsList = document.getElementById("jobsList");

    try {
        // ✅ firebase-config.js से Firebase config import करना
        const configModule = await import("./firebase-config.js");
        const firebaseConfig = configModule.default;

        // ✅ Firebase Initialize
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        const db = firebase.database().ref("Jobs"); // ✅ 'Jobs' Firebase में सही नोड है

        // ✅ Firebase से जॉब्स लोड करना
        db.once("value")
            .then((snapshot) => {
                const jobs = snapshot.val();
                console.log("Fetched Jobs:", jobs); // 🔹 Debugging के लिए Console में Check करें

                if (jobs) {
                    jobsList.innerHTML = ""; // पहले से मौजूद लिस्ट हटाना

                    Object.keys(jobs).forEach((key) => {
                        const job = jobs[key];
                        const jobElement = document.createElement("li");
                        jobElement.innerHTML = `<strong>${job.title}</strong> - ${job.company}, ${job.location} <a href="${job.applyLink}" target="_blank">Apply</a>`;
                        jobsList.appendChild(jobElement);
                    });
                } else {
                    jobsList.innerHTML = "<li>कोई सरकारी नौकरी उपलब्ध नहीं</li>";
                }
            })
            .catch((error) => {
                console.error("Error fetching jobs:", error);
            });
    } catch (error) {
        console.error("Error loading Firebase config:", error);
    }
});
