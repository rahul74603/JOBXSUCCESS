// config.js

async function loadConfig() {
    let firebaseConfig = await getFirebaseConfig();
    return {
        SITE_NAME: "JOBXSUCCESS",
        API_URL: firebaseConfig.API_URL, // 🔹 API URL को डायनामिक रूप से लोड करें
    };
}

// 🔹 वेबसाइट का टाइटल अपडेट करना
document.addEventListener("DOMContentLoaded", async function () {
    let config = await loadConfig();
    document.title = config.SITE_NAME;
});
