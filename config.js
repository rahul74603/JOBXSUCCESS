async function getFirebaseConfig() {
    const response = await fetch("https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/firebase-config.json");
    const config = await response.json();
    return config;
}
