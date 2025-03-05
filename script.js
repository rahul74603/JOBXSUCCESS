document.addEventListener("DOMContentLoaded", async function () {
    // ✅ Government Jobs Load करने का Code
    const jobsList = document.getElementById("jobsList");
    
    try {
        // 🔹 firebase-config.js से Firebase config import करना
        const configModule = await import("./firebase-config.js");
        const firebaseConfig = configModule.default;

        // 🔹 Firebase Initialize (अगर पहले से नहीं हुआ हो)
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        const db = firebase.database().ref("jobs"); // ✅ 'jobs' सही Database Path

        // 🔹 Firebase से Jobs तेजी से लोड करें
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

    // ✅ Study Materials Load करने का Code (GitHub से)
    const studyList = document.getElementById("studyList");
    
    async function fetchGitHubFolders() {
        const githubRepo = "https://api.github.com/repos/तुम्हारा-गिटहब-यूज़रनेम/तुम्हारा-रिपॉ-नेम/contents/study%20materials";
        
        try {
            const response = await fetch(githubRepo);
            const folders = await response.json();

            studyList.innerHTML = ""; // 🔹 पहले की लिस्ट हटाना

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

    fetchGitHubFolders(); // 🔹 GitHub से Study Materials लोड करो

    // ✅ जब कोई कैटेगरी खुले, तो अंदर के सब-फोल्डर्स लोड करें
    window.loadCategory = async function (category) {
        const categoryRepo = `https://api.github.com/repos/तुम्हारा-गिटहब-यूज़रनेम/तुम्हारा-रिपॉ-नेम/contents/study%20materials/${category}`;

        try {
            const response = await fetch(categoryRepo);
            const subFolders = await response.json();

            studyList.innerHTML = `<h3>${category}</h3>`; // 🔹 Header अपडेट करें

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
        const filesRepo = `https://api.github.com/repos/तुम्हारा-गिटहब-यूज़रनेम/तुम्हारा-रिपॉ-नेम/contents/study%20materials/${category}/${subCategory}`;

        try {
            const response = await fetch(filesRepo);
            const files = await response.json();

            studyList.innerHTML = `<h3>${subCategory} (📂 ${category})</h3>`; // 🔹 Header अपडेट करें

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
