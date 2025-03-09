async function fetchJobData() {
    try {
        let apiKey = "XXXX1"; // अपनी API Key डालें
        let apiUrl = "https://script.google.com/macros/s/AKfycbxyz12345/exec?key=" + apiKey;

        let response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        let data = await response.json();
        console.log(data); // Console में चेक करने के लिए

        // यहाँ से आप डेटा को अपनी HTML में ऐड कर सकते हैं
        let jobList = document.getElementById("job-list");
        jobList.innerHTML = ""; // पुराना डेटा हटाएं

        data.forEach(job => {
            let jobItem = document.createElement("div");
            jobItem.innerHTML = `<h3>${job.Title}</h3><p>${job.Description}</p><a href="${job.Link}" target="_blank">Apply Now</a>`;
            jobList.appendChild(jobItem);
        });

    } catch (error) {
        console.error("Error fetching job data:", error);
    }
}

// जब पेज लोड हो, तब API कॉल करें
document.addEventListener("DOMContentLoaded", fetchJobData);
