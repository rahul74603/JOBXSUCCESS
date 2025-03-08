// script.js

document.addEventListener("DOMContentLoaded", async function () {
    console.log("Website Loaded Successfully!");

    // 🔹 Firebase Config Import
    let firebaseConfig = await getFirebaseConfig();
    if (firebaseConfig) {
        firebase.initializeApp(firebaseConfig);
        console.log("Firebase Initialized Successfully!");
    } else {
        console.error("Failed to Load Firebase Config!");
    }

    // 🔹 Jobs Data Load करना
    async function loadJobs() {
        try {
            let response = await fetch(firebaseConfig.API_URL);
            let data = await response.json();

            let jobContainer = document.getElementById("jobs-container");
            jobContainer.innerHTML = "";

            data.forEach(job => {
                let jobElement = document.createElement("div");
                jobElement.classList.add("job-item");
                jobElement.innerHTML = `
                    <h3>${job.title}</h3>
                    <p><strong>Company:</strong> ${job.company}</p>
                    <p><strong>Location:</strong> ${job.location}</p>
                    <a href="${job.link}" target="_blank">Apply Now</a>
                `;
                jobContainer.appendChild(jobElement);
            });
        } catch (error) {
            console.error("Error fetching jobs:", error);
        }
    }

    // 🔹 अगर Jobs Page है तो Data लोड करें
    if (document.getElementById("jobs-container")) {
        loadJobs();
    }
});
