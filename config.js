const apiKey = localStorage.getItem("apiKey"); 

if (!apiKey) {
    console.error("❌ API Key Not Found!");
} else {
    const API_URL = `https://script.google.com/macros/s/AKfycbxlmdCI1HHnQSwReOQ6Or-dNPdYoBWVBU3lRhas78H9etz5UgsYp_38ToWQZep0epY14w/exec?key=${apiKey}`;
    console.log("✅ API_URL Loaded:", API_URL);
}
