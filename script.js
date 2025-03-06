document.addEventListener("DOMContentLoaded", async function () {
    // ✅ Firebase SDK लोड करना
    if (typeof firebase === "undefined") {
        const firebaseScript = document.createElement("script");
        firebaseScript.src = "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
        firebaseScript.onload = () => {
            const dbScript = document.createElement("script");
            dbScript.src = "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
            dbScript.onload = initializeFirebase;
            document.head.appendChild(dbScript);
        };
        document.head.appendChild(firebaseScript);
    } else {
        initializeFirebase();
    }

    function initializeFirebase() {
        import("./firebase-config.js")
            .then((configModule) => {
                const firebaseConfig = configModule.default;

                if (!firebase.apps.length) {
                    firebase.initializeApp(firebaseConfig);
                }

                loadJobs();
            })
            .catch((error) => console.error("❌ Firebase config लोड करने में समस्या:", error));
    }

    // ✅ सरकारी नौकरियों की लिस्ट लोड करना
    function loadJobs() {
        const jobsList = document.getElementById("jobsList");
        const db = firebase.database().ref("jobs");

        db.on("value", (snapshot) => {
            jobsList.innerHTML = "";
            const jobs = snapshot.val();

            if (jobs) {
                Object.keys(jobs).forEach((key) => {
                    const job = jobs[key];
                    const deadlineText = job.lastDate ? `📅 अंतिम तिथि: ${job.lastDate}` : "";

                    const jobElement = document.createElement("li");
                    jobElement.classList.add("job-item");
                    jobElement.innerHTML = `
                        <div class="job-card">
                            <h3>${job.title}</h3>
                            <p>🏢 <strong>${job.company}</strong></p>
                            <p>📍 <strong>${job.location}</strong></p>
                            <p>${deadlineText}</p>
                            <a class="apply-btn" href="${job.applyLink}" target="_blank">🚀 आवेदन करें</a>
                        </div>
                    `;
                    jobsList.appendChild(jobElement);
                });
            } else {
                jobsList.innerHTML = "<li>कोई सरकारी नौकरी उपलब्ध नहीं</li>";
            }
        });
    }

    // ✅ GitHub से स्टडी मैटेरियल लोड करना
    async function fetchStudyMaterials(path = "study-materials", parentElement = null) {
        try {
            const url = `https://api.github.com/repos/rahul74603/JOBXSUCCESS/contents/${path}`;
            const response = await fetch(url);

            if (!response.ok) throw new Error(`❌ HTTP Error! Status: ${response.status}`);

            const data = await response.json();
            let materialsList = parentElement || document.getElementById("materials-list");

            data.forEach(item => {
                const li = document.createElement("li");
                li.classList.add("study-item");

                if (item.type === "dir") {
                    li.innerHTML = `<h3>📂 ${item.name}</h3>`;
                    const sublist = document.createElement("ul");
                    li.appendChild(sublist);
                    fetchStudyMaterials(item.path, sublist);
                } else {
                    li.innerHTML = `<h3>📄 ${item.name}</h3>
                                    <a href="${item.html_url}" target="_blank" class="download-btn">🔗 Open</a>`;
                }
                materialsList.appendChild(li);
            });

        } catch (error) {
            console.error("❌ स्टडी मटेरियल लोड करने में समस्या:", error);
        }
    }

    fetchStudyMaterials();

    // ✅ Back Button Fix
    window.goBack = function () {
        window.history.back();
    };
});
