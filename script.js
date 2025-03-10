import config from './config.js';

document.addEventListener("DOMContentLoaded", async function () {
    console.log("🚀 Website Loaded Successfully!");

    // ✅ 1️⃣ Secure API Key Load करना
    let apiKey = localStorage.getItem("API_KEY");
    if (!apiKey) {
        console.error("❌ API Key Not Found in Local Storage!");
    } else {
        console.log("✅ API Key Loaded from Local Storage:", apiKey);
    }

    // ✅ 2️⃣ Jobs Data Load करना
    async function loadJobs() {
        try {
            let apiUrl = `${config.API_URL}?key=${apiKey}`;
            let response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            let data = await response.json();

            let jobContainer = document.getElementById("jobs-container");
            jobContainer.innerHTML = ""; // Clear Old Jobs

            if (Array.isArray(data)) {
                data.forEach(job => {
                    let jobElement = document.createElement("div");
                    jobElement.classList.add("job-item");
                    jobElement.innerHTML = `
                        <h3>${job.title}</h3>
                        <p><strong>Company:</strong> ${job.company}</p>
                        <p><strong>Location:</strong> ${job.location}</p>
                        <a href="${job.link}" target="_blank" class="apply-button">Apply Now</a>
                    `;
                    jobContainer.appendChild(jobElement);
                });
            } else {
                throw new Error("Invalid Data Format Received from API");
            }
        } catch (error) {
            console.error("❌ Error Fetching Jobs:", error);
            let jobContainer = document.getElementById("jobs-container");
            jobContainer.innerHTML = `<p class="error-message">❌ नौकरी की जानकारी लोड करने में त्रुटि। कृपया बाद में पुनः प्रयास करें।</p>`;
        }
    }

    // ✅ 3️⃣ अगर Jobs Page है तो Data लोड करें
    if (document.getElementById("jobs-container")) {
        loadJobs();
    }
});
