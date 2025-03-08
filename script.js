document.addEventListener("DOMContentLoaded", async function () {
    // 🔐 Firebase सुरक्षित तरीके से लोड करना
    if (!window.firebase) {
        const firebaseScript = document.createElement("script");
        firebaseScript.src = "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
        document.head.appendChild(firebaseScript);

        firebaseScript.onload = () => {
            const dbScript = document.createElement("script");
            dbScript.src = "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
            dbScript.onload = initializeFirebase;
            document.head.appendChild(dbScript);
        };
    } else {
        initializeFirebase();
    }

    async function initializeFirebase() {
        try {
            const configModule = await import("./firebase-config.js");
            const firebaseConfig = configModule.default;

            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            loadJobs();
        } catch (error) {
            console.error("🔥 Firebase Initialization Failed:", error);
            alert("Firebase से कनेक्ट करने में समस्या हुई। कृपया बाद में प्रयास करें।");
        }
    }

    // 📝 Jobs लोड करने का अधिक सुरक्षित तरीका
    function loadJobs() {
        const jobsList = document.getElementById("jobsList");
        if (!jobsList) return;

        const dbRef = firebase.database().ref("jobs");
        
        dbRef.on("value", (snapshot) => {
            jobsList.innerHTML = "";
            const jobs = snapshot.val() || {};

            Object.entries(jobs).forEach(([key, job]) => {
                const deadline = job.lastDate ? `📅 ${job.lastDate}` : "📅 नहीं दिया गया";
                const jobCard = `
                    <div class="job-card">
                        <h3>${job.title || "N/A"}</h3>
                        <p>🏢 ${job.company || "N/A"}</p>
                        <p>📍 ${job.location || "N/A"}</p>
                        <p>${deadline}</p>
                        <a href="${job.applyLink || "#"}" target="_blank" class="apply-btn">🚀 Apply</a>
                    </div>
                `;
                jobsList.innerHTML += `<li class="job-item">${jobCard}</li>`;
            });
        }, (error) => {
            console.error("❌ Firebase Data Fetch Error:", error);
            jobsList.innerHTML = "<li>डेटा लोड करने में समस्या हुई।</li>";
        });
    }

    // 📚 GitHub से स्टडी मटेरियल्स (सुधार के साथ)
    async function fetchStudyMaterials(path = "study-materials", parentElement = null) {
        const targetElement = parentElement || document.getElementById("materials-list");
        if (!targetElement) return;

        try {
            const response = await fetch(`https://api.github.com/repos/rahul74603/JOBXSUCCESS/contents/${path}`);
            
            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }

            const data = await response.json();
            data.forEach(item => {
                const li = document.createElement("li");
                li.className = "study-item";

                if (item.type === "dir") {
                    li.innerHTML = `<h3>📂 ${item.name}</h3>`;
                    const sublist = document.createElement("ul");
                    li.appendChild(sublist);
                    fetchStudyMaterials(item.path, sublist);
                } else {
                    li.innerHTML = `
                        <div class="material-item">
                            <span>📄 ${item.name}</span>
                            <a href="${item.download_url}" target="_blank" class="download-btn">🔗 Download</a>
                        </div>
                    `;
                }
                targetElement.appendChild(li);
            });
        } catch (error) {
            console.error("❌ स्टडी मटेरियल लोड करने में समस्या:", error);
            targetElement.innerHTML = "<li>डेटा लोड करने में समस्या हुई।</li>";
        }
    }

    fetchStudyMaterials();

    // 🔙 Back Button को सुरक्षित बनाना
    window.goBack = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = "/";
        }
    };
});
