document.addEventListener("DOMContentLoaded", async function () {
    console.log("🚀 Website Loaded Successfully!");

    // ✅ `localStorage` से API Key लोड करें
    let apiKey = localStorage.getItem("apiKey");

    if (!apiKey) {
        console.error("❌ API Key Not Found in LocalStorage!");
        alert("⚠️ API Key सेट नहीं है! पहले API Key सेट करें।");
        return;
    }

    // ✅ API_URL को Define करें (Google Apps Script URL + API Key)
    let API_URL = `https://script.google.com/macros/s/AKfycbxnx750QfVkitn4Aoft2II7L-mw0DkzdN4I1OjW1vuEjODVt0uu8XvPlww80St5Txd37Q/exec?key=${apiKey}`;

    // ✅ 2️⃣ Jobs Data Load करना (LocalStorage के साथ)
    async function loadJobs() {
        try {
            // 🔹 पहले LocalStorage से Cache चेक करें
            let cachedJobs = localStorage.getItem("jobsData");
            if (cachedJobs) {
                console.log("🟢 Loading Cached Jobs...");
                displayJobs(JSON.parse(cachedJobs));
            }

            // 🔹 फिर API से नया डेटा लाएं
            console.log("🌍 Fetching Jobs from API...");
            let response = await fetch(API_URL + `&t=${new Date().getTime()}`); // Cache Bypass
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            let result = await response.json();
            let data = result.data || result; // अगर डेटा `data` key में हो

            if (Array.isArray(data)) {
                // 🔹 LocalStorage में Save करें
                localStorage.setItem("jobsData", JSON.stringify(data));

                // 🔹 UI पर Show करें
                displayJobs(data);
            } else {
                throw new Error("Invalid Data Format Received from API");
            }
        } catch (error) {
            console.error("❌ Error Fetching Jobs:", error);
            let jobContainer = document.getElementById("jobs-container");
            jobContainer.innerHTML = `<p class="error-message">❌ नौकरी की जानकारी लोड करने में त्रुटि। कृपया बाद में पुनः प्रयास करें।</p>`;
        }
    }

    // ✅ 3️⃣ Jobs Show करने का Function
    function displayJobs(data) {
        let jobContainer = document.getElementById("jobs-container");
        jobContainer.innerHTML = ""; // पुराना डेटा साफ करें

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
    }

    // ✅ 4️⃣ अगर Jobs Page है तो Data लोड करें
    if (document.getElementById("jobs-container")) {
        loadJobs();
    }
});
