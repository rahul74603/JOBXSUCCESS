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
    window.API_URL = `https://script.google.com/macros/s/AKfycbyQqKOScQRE9Zt0l0tzplgnYoNnhrBT1HxfQhx-qqZdnVfZOdoa88hBsHh4vd0BzPUI/exec?key=${apiKey}`;
    console.log("✅ API_URL Loaded:", window.API_URL);

    // ✅ Check if `jobs-container` Exists
    let jobContainer = document.getElementById("jobs-container");
    if (!jobContainer) {
        console.error("❌ jobs-container एलिमेंट नहीं मिला!");
        return;
    }

    // ✅ 2️⃣ Jobs Data Load करना (LocalStorage Cache के साथ)
    async function loadJobs() {
        try {
            jobContainer.innerHTML = `<p>⏳ नौकरी की जानकारी लोड हो रही है...</p>`;

            // 🔹 पहले LocalStorage से Cache चेक करें
            let cachedJobs = localStorage.getItem("jobsData");
            if (cachedJobs) {
                console.log("🟢 Cached Jobs Loaded...");
                displayJobs(JSON.parse(cachedJobs));
            }

            // 🔹 API से नया डेटा लाएं
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
            jobContainer.innerHTML = `<p class="error-message">❌ नौकरी की जानकारी लोड करने में समस्या आई।</p>`;
        }
    }

    // ✅ 3️⃣ Jobs Show करने का Function
    function displayJobs(data) {
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

    // ✅ 4️⃣ Load Jobs on Page Load
    loadJobs();
});
