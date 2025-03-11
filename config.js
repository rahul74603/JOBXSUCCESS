const apiKey = localStorage.getItem("apiKey");

if (!apiKey) {
    console.error("❌ API Key Not Found!");
} else {
    window.API_URL = `https://script.google.com/macros/s/AKfycbyQqKOScQRE9Zt0l0tzplgnYoNnhrBT1HxfQhx-qqZdnVfZOdoa88hBsHh4vd0BzPUI/exec?key=${apiKey}`;
    console.log("✅ API_URL Loaded:", window.API_URL);
}
