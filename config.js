const apiKey = localStorage.getItem("apiKey");

if (!apiKey) {
    console.error("❌ API Key Not Found!");
} else {
    window.API_URL = `https://script.google.com/macros/s/AKfycbxIqMOWztisR_Yc_Vgtqt0nfpqGpH3Nl0IhDyUlh5CQ-DbTwsaam4Bpj5OXZAbv7JgU1w/exec?key=${apiKey}`;
    console.log("✅ API_URL Loaded:", window.API_URL);
}
