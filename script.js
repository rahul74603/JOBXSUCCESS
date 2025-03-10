document.addEventListener("DOMContentLoaded", async function () {
    console.log("🚀 Website Loaded Successfully!");

    // ✅ API_URL को Global Scope से एक्सेस करो
    let API_URL = window.config.API_URL;

    // ✅ 2️⃣ Jobs Data Load करना
    async function loadJobs() {
        try {
            let response = await fetch(https://script.google.com/macros/s/AKfycbxnx750QfVkitn4Aoft2II7L-mw0DkzdN4I1OjW1vuEjODVt0uu8XvPlww80St5Txd37Q/exec);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            let result = await response.json();

            // ✅ Google Sheets API से डेटा सही तरीके से एक्सेस करना
            let data = result.data || result; // अगर डेटा `data` key में हो

            let jobContainer = document.getElementById("jobs-container");
            jobContainer.innerHTML = ""; // पुराना डेटा साफ करें

            if (Array.isArray(data)) {
                data.forEach(job => {
                    let jobElement = document.createElement("div");
                    jobElement.classList.add("job-item");
                    jobElement.innerHTML = `
                        <h3>${job.title}</h3>
                        <p><strong>🏢 कंपनी:</strong> ${job.company}</p>
                        <p><strong>📍 स्थान:</strong> ${job.location}</p>
                        <p><strong>💼 प्रकार:</strong> ${job.type}</p>
                        <a href="${job.link}" target="_blank" class="apply-button">➡️ अभी आवेदन करें</a>
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
