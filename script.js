document.addEventListener("DOMContentLoaded", async function () {
    console.log("🚀 Website Loaded Successfully!");

    // ✅ `localStorage` से API Key लोड करें
    let apiKey = localStorage.getItem("apiKey");

    if (!apiKey) {
        console.error("❌ API Key Not Found in LocalStorage!");
        alert("⚠️ API Key सेट नहीं है! पहले API Key सेट करें।");
        return;
    }

    // ✅ API_URL को Global Scope में Define करें
    window.API_URL = `https://script.google.com/macros/s/AKfycbxnx750QfVkitn4Aoft2II7L-mw0DkzdN4I1OjW1vuEjODVt0uu8XvPlww80St5Txd37Q/exec?key=${apiKey}`;
    console.log("✅ API_URL Loaded:", window.API_URL);

    // ✅ 2️⃣ Jobs Data Load करना (LocalStorage Cache के साथ)
    async function loadJobs() {
        try {
            let jobContainer = document.getElementById("jobs-container");
            jobContainer.innerHTML = `<p>⏳ नौकरी की जानकारी लोड हो रही है...</p>`;

            // 🔹 पहले LocalStorage से Cache चेक करें
            let cachedJobs = localStorage.getItem("jobsData");
            if (cachedJobs) {
                console.log("🟢 Cached Jobs Loaded...");
                displayJobs(JSON.parse(cachedJobs));
            }

            // 🔹 API से नया डेटा लाएं (Cache Bypass करने के लिए टाइमस्टैम्प जोड़ें)
            console.log("🌍 Fetching Jobs from API...");
            let response = await fetch(`${window.API_URL}&t=${new Date().getTime()}`);

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            let result = await response.json();
            let data = result.data || result; // अगर डेटा `data` key में है, तो उसे लें

            if (!Array.isArray(data)) throw new Error("Invalid Data Format Received from API");

            // 🔹 LocalStorage में Save करें
            localStorage.setItem("jobsData", JSON.stringify(data));

            // 🔹 UI पर Show करें
            displayJobs(data);
        } catch (error) {
            console.error("❌ Error Fetching Jobs:", error);
            document.getElementById("jobs-container").innerHTML = `<p class="error-message">❌ नौकरी की जानकारी लोड करने में समस्या आई।</p>`;
        }
    }

    // ✅ 3️⃣ Jobs Show करने का Function
    function displayJobs(data) {
        let jobContainer = document.getElementById("jobs-container");
        jobContainer.innerHTML = ""; // पुराना डेटा साफ करें

        if (data.length === 0) {
            jobContainer.innerHTML = `<p>⚠️ अभी कोई नौकरियाँ उपलब्ध नहीं हैं।</p>`;
            return;
        }

        data.forEach(job => {
            let jobElement = document.createElement("div");
            jobElement.classList.add("job-item");
            jobElement.innerHTML = `
                <h3>${job.title}</h3>
                <p><strong>🏢 कंपनी:</strong> ${job.organization || "N/A"}</p>
                <p><strong>📅 अंतिम तिथि:</strong> ${job.lastDate || "N/A"}</p>
                <a href="${job.applyLink}" target="_blank" class="apply-button">➡️ अभी आवेदन करें</a>
            `;
            jobContainer.appendChild(jobElement);
        });
    }

    // ✅ 4️⃣ अगर Jobs Page है तो Data लोड करें
    if (document.getElementById("jobs-container")) {
        loadJobs();
    }
});
