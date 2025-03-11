const apiKey = localStorage.getItem("apiKey");

if (!apiKey) {
    console.error("❌ API Key Not Found!");
} else {
    window.API_URL = `https://script.google.com/macros/s/AKfycbwJ_k5I3-gdgEme8JGTYG6EHTxoovaG44bJ6fU-qtvOaPqOipM8sc1IAREE04_XQi7P/exec?key=${apiKey}`;
    console.log("✅ API_URL Loaded:", window.API_URL);
}
