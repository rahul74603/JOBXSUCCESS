import firebaseConfig from './firebase-config.js';

   document.addEventListener("DOMContentLoaded", async function () {
       console.log("Website Loaded Successfully!");

       // 🔹 Firebase Initialization
       if (firebaseConfig) {
           if (typeof firebase !== 'undefined') {
               firebase.initializeApp(firebaseConfig);
               console.log("Firebase Initialized Successfully!");
           } else {
               console.error("Firebase SDK not loaded!");
           }
       } else {
           console.error("Failed to Load Firebase Config!");
       }

       // 🔹 Jobs Data Load करना (Using Google Sheets App Script URL)
       async function loadJobs() {
           try {
               let response = await fetch(firebaseConfig.API_URL);
               if (!response.ok) {
                   throw new Error(`HTTP error! status: ${response.status}`);
               }
               let data = await response.json();

               let jobContainer = document.getElementById("jobs-container");
               jobContainer.innerHTML = "";

               if (Array.isArray(data)) {
                   data.forEach(job => {
                       let jobElement = document.createElement("div");
                       jobElement.classList.add("job-item");
                       jobElement.innerHTML = `
                           <h3>${job.title}</h3>
                           <p><strong>Company:</strong> ${job.company}</p>
                           <p><strong>Location:</strong> ${job.location}</p>
                           <a href="${job.link}" target="_blank" class="apply-button">Apply Now</a>
                       `;
                       jobContainer.appendChild(jobElement);
                   });
               } else {
                   throw new Error("Invalid data format received from API");
               }
           } catch (error) {
               console.error("Error fetching jobs:", error);
               let jobContainer = document.getElementById("jobs-container");
               jobContainer.innerHTML = `<p class="error-message">नौकरी की जानकारी लोड करने में त्रुटि। कृपया बाद में पुनः प्रयास करें।</p>`;
           }
       }

       // 🔹 अगर Jobs Page है तो Data लोड करें
       if (document.getElementById("jobs-container")) {
           loadJobs();
       }
   });
