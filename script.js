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
    const studyList = document.getElementById("studyList");

    async function fetchGitHubFolders() {
        const githubRepo = "https://api.github.com/repos/jobxsuccess/study-materials/contents";

        try {
            const response = await fetch(githubRepo);
            if (!response.ok) throw new Error(`GitHub API Error: ${response.status}`);

            const folders = await response.json();
            studyList.innerHTML = ""; // ✅ पहले की लिस्ट हटाएँ

            if (Array.isArray(folders)) {
                folders.forEach(folder => {
                    if (folder.type === "dir") {
                        const folderElement = document.createElement("li");
                        folderElement.innerHTML = `
                            <a href="#" onclick="loadCategory('${folder.name}')">${folder.name}</a>
                        `;
                        studyList.appendChild(folderElement);
                    }
                });
            } else {
                studyList.innerHTML = "<li>कोई स्टडी मटेरियल उपलब्ध नहीं</li>";
            }
        } catch (error) {
            console.error("❌ Error fetching GitHub folders:", error);
        }
    }

    fetchGitHubFolders(); // ✅ GitHub से Study Materials लोड करो

    // ✅ जब कोई कैटेगरी खुले, तो अंदर के सब-फोल्डर्स लोड करें
    window.loadCategory = async function (category) {
        const categoryRepo = `https://api.github.com/repos/jobxsuccess/study-materials/contents/${category}`;

        try {
            const response = await fetch(categoryRepo);
            if (!response.ok) throw new Error(`GitHub API Error: ${response.status}`);

            const subFolders = await response.json();
            studyList.innerHTML = `<h3>${category}</h3>`; // ✅ Header अपडेट करें

            if (Array.isArray(subFolders)) {
                subFolders.forEach(subFolder => {
                    if (subFolder.type === "dir") {
                        const subFolderElement = document.createElement("li");
                        subFolderElement.innerHTML = `
                            <a href="#" onclick="loadFiles('${category}', '${subFolder.name}')">${subFolder.name}</a>
                        `;
                        studyList.appendChild(subFolderElement);
                    }
                });
            } else {
                studyList.innerHTML += "<li>इस कैटेगरी में कुछ नहीं मिला</li>";
            }
        } catch (error) {
            console.error("❌ Error fetching category:", error);
        }
    };

    // ✅ जब कोई फ़ोल्डर खुले, तो फ़ाइलें लोड करें
    window.loadFiles = async function (category, subCategory) {
        const filesRepo = `https://api.github.com/repos/jobxsuccess/study-materials/contents/${category}/${subCategory}`;

        try {
            const response = await fetch(filesRepo);
            if (!response.ok) throw new Error(`GitHub API Error: ${response.status}`);

            const files = await response.json();
            studyList.innerHTML = `<h3>${subCategory} (📂 ${category})</h3>`; // ✅ Header अपडेट करें

            if (Array.isArray(files)) {
                files.forEach(file => {
                    if (file.type === "file") {
                        const fileElement = document.createElement("li");
                        fileElement.innerHTML = `
                            <a href="${file.download_url}" target="_blank">📄 ${file.name}</a>
                        `;
                        studyList.appendChild(fileElement);
                    }
                });
            } else {
                studyList.innerHTML += "<li>इस फोल्डर में कुछ नहीं मिला</li>";
            }
        } catch (error) {
            console.error("❌ Error fetching files:", error);
        }
    };
});
