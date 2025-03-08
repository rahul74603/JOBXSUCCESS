// ✅ Service Worker रजिस्टर करें
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(reg => console.log('✅ Service Worker Registered!', reg))
        .catch(err => console.log('❌ Service Worker Registration Failed!', err));
}

// ✅ Firebase Import करें
import { initializeApp } from "./firebase-config.js"; // 🔴 इस फाइल को मत खोलना

// ✅ इंटरनेट कनेक्शन चेक करने का फंक्शन
function checkInternet() {
    if (!navigator.onLine) {
        window.location.href = "offline.html"; // 🚀 इंटरनेट नहीं तो Offline Page दिखेगा
    }
}

// ✅ पेज लोड होते ही इंटरनेट स्टेटस चेक करें
window.addEventListener('load', checkInternet);
window.addEventListener('online', () => console.log('✅ Online'));
window.addEventListener('offline', () => {
    console.log('❌ Offline');
    window.location.href = "offline.html";
});

// ✅ मैनिफेस्ट फाइल को डायनामिकली जोड़ना (PWA के लिए)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("service-worker.js")
        .then(reg => console.log("✅ Service Worker Registered!", reg))
        .catch(err => console.log("❌ Service Worker Registration Failed!", err));
}

// ✅ रियल-टाइम जॉब अपडेट्स के लिए Firebase से Data लोड करना
function loadJobs() {
    fetch('https://your-firebase-database-url/jobs.json') // 🔴 अपनी Firebase Database URL लगाएं
        .then(response => response.json())
        .then(data => {
            let jobsContainer = document.getElementById("jobs-list");
            jobsContainer.innerHTML = "";
            data.forEach(job => {
                let jobItem = `<div class="job-card">
                    <h3>${job.title}</h3>
                    <p>${job.description}</p>
                    <a href="${job.link}" target="_blank">🔗 आवेदन करें</a>
                </div>`;
                jobsContainer.innerHTML += jobItem;
            });
        })
        .catch(err => console.log("❌ जॉब लोड करने में समस्या:", err));
}

// ✅ पेज लोड होते ही जॉब्स लोड करें
window.addEventListener("load", loadJobs);
