async function fetchJobData() {
    try {
        let apiKey = localStorage.getItem("apiKey"); // Local Storage से API Key लो
        if (!apiKey) {
            console.error("❌ API Key नहीं मिली! पहले इसे Local Storage में Save करो।");
            return;
        }

        let apiUrl = `https://script.google.com/macros/s/AKfycbxnx750QfVkitn4Aoft2II7L-mw0DkzdN4I1OjW1vuEjODVt0uu8XvPlww80St5Txd37Q/exec?key=${apiKey}`;

        let response = await fetch(apiUrl);
        let data = await response.json();

        let jobList = document.getElementById("job-list");
        jobList.innerHTML = ""; // पुराना डेटा हटाओ

        data.forEach(job => {
            let jobItem = document.createElement("div");
            jobItem.innerHTML = `<h3>${job.Title}</h3><p>${job.Description}</p><a href="${job.Link}" target="_blank">Apply Now</a>`;
            jobList.appendChild(jobItem);
        });

    } catch (error) {
        console.error("❌ Error:", error);
    }
}

// जब पेज खुले तो API से डेटा लाओ
document.addEventListener("DOMContentLoaded", fetchJobData);
