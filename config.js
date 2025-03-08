async function getFirebaseConfig() {
    try {
        const response = await fetch("https://raw.githubusercontent.com/rahul74603/JOBXSUCCESS/main/firebase-config.json");

        if (!response.ok) {
            throw new Error(`⚠️ HTTP Error! Status: ${response.status}`);
        }

        const config = await response.json();
        return config;
    } catch (error) {
        console.error("🔥 Firebase Config Load करने में दिक्कत आई:", error);
        return null; // ❌ Error आने पर null Return होगा
    }
}

// ✅ Firebase Config को Import करने के लिए Export करना
export default getFirebaseConfig;
