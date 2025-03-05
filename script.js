document.addEventListener("DOMContentLoaded", async function () {
    // ✅ Firebase SDK लोड करना (जरूरी)
    if (typeof firebase === "undefined") {
        const firebaseScript = document.createElement("script");
        firebaseScript.src = "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
        firebaseScript.onload = () => {
            const dbScript = document.createElement("script");
            dbScript.src = "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
            dbScript.onload = initializeFirebase; // ✅ Firebase लोड होने के बाद इनिशियलाइज़ करें
            document.head.appendChild(dbScript);
        };
        document.head.appendChild(firebaseScript);
    } else {
        initializeFirebase(); // ✅ अगर Firebase पहले से लोड है तो इनिशियलाइज़ करें
    }

    function initializeFirebase() {
        import("./firebase-config.js")
            .then((configModule) => {
                const firebaseConfig = configModule.default;

                if (!firebase.apps.length) {
                    firebase.initializeApp(firebaseConfig);
                }

                loadJobs(); // ✅ Firebase से Jobs लोड करना
            })
            .catch((error) => console.error("❌ Error loading Firebase config:", error));
    }

    // ✅ Jobs लोड करने का फंक्शन
    function loadJobs() {
        const jobsList = document.getElementById("jobsList");
        const db = firebase.database().ref("jobs");

        db.on("value", (snapshot) => {
            jobsList.innerHTML = ""; // ✅ पहले की लिस्ट हटाएँ
            const jobs = snapshot.val();

            if (jobs) {
                Object.keys(jobs).forEach((key) => {
                    const job = jobs[key];
                    const deadlineText = job.lastDate ? `📅 Last Date: ${job.lastDate}` : "";
                    
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
    }

    // ✅ Study Materials Load करने का Code (GitHub से)
    async function fetchStudyMaterials() {
        try {
            const url = "https://api.github.com/repos/rahul74603/JOBXSUCCESS/contents/study-materials";
            const response = await fetch(url);
            
            if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
            
            const data = await response.json();
            const materialsList = document.getElementById("materials-list");

            materialsList.innerHTML = ""; // पुरानी लिस्ट क्लियर करें

            data.forEach(item => {
                const li = document.createElement("li");
                li.innerHTML = `<h3>📁 ${item.name}</h3>
                                <a href="${item.html_url}" target="_blank" class="download-btn">🔗 Open</a>`;
                materialsList.appendChild(li);
            });

        } catch (error) {
            console.error("Error fetching study materials:", error);
        }
    }

    fetchStudyMaterials(); // ✅ GitHub से Study Materials लोड करो
});
