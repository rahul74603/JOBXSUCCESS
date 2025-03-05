# Creating script.js file content



script_js_content = """

// ✅ Firebase & Jobs लोड करने का कोड

document.addEventListener("DOMContentLoaded", async function () {

    if (typeof firebase === "undefined") {

        const firebaseScript = document.createElement("script");

        firebaseScript.src = "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

        firebaseScript.onload = () => {

            const dbScript = document.createElement("script");

            dbScript.src = "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

            dbScript.onload = initializeFirebase;

            document.head.appendChild(dbScript);

        };

        document.head.appendChild(firebaseScript);

    } else {

        initializeFirebase();

    }



    async function initializeFirebase() {

        const configModule = await import("./firebase-config.js");

        const firebaseConfig = configModule.default;



        if (!firebase.apps.length) {

            firebase.initializeApp(firebaseConfig);

        }



        loadJobs();

    }



    function loadJobs() {

        const jobsList = document.getElementById("jobsList");

        const db = firebase.database().ref("jobs");



        db.on("value", (snapshot) => {

            jobsList.innerHTML = "";

            const jobs = snapshot.val();



            if (jobs) {

                Object.keys(jobs).forEach((key) => {

                    const job = jobs[key];

                    const deadlineText = job.lastDate ? `📅 Last Date: ${job.lastDate}` : "";

                    

                    const jobElement = document.createElement("li");

                    jobElement.innerHTML = `

                        <div class="job-card">

                            <strong>${job.title}</strong> - <i>${job.company}</i>

                            <br> 📍 Location: ${job.location}

                            <br> ${deadlineText}

                            <br> <a class="apply-btn" href="${job.applyLink}" target="_blank">🚀 Apply Now</a>

                        </div>

                    `;

                    jobsList.appendChild(jobElement);

                });

            } else {

                jobsList.innerHTML = "<li>कोई सरकारी नौकरी उपलब्ध नहीं</li>";

            }

        });

    }



    // ✅ Back Button का सही से काम करना

    window.addEventListener("popstate", function () {

        const currentPage = location.pathname.split("/").pop();



        if (currentPage === "" || currentPage === "index.html") {

            location.href = "index.html";

        } else if (currentPage === "study.html") {

            location.href = "study.html";

        } else if (currentPage === "jobs.html") {

            location.href = "jobs.html";

        }

    });

});

"""



# Creating style.css file content



style_css_content = """

/* 🌟 बेसिक स्टाइलिंग */

body {

    font-family: Arial, sans-serif;

    text-align: center;

    background-color: #f8f9fa;

    margin: 0;

    padding: 0;

}



/* 🌟 Navbar स्टाइल */

.navbar {

    background: #2E86C1;

    padding: 15px;

    display: flex;

    justify-content: center;

    gap: 15px;

}



.navbar a {

    color: white;

    text-decoration: none;

    font-size: 18px;

    padding: 10px;

    border-radius: 5px;

    transition: 0.3s;

}



.navbar a:hover {

    background: #1B4F72;

}



.active {

    font-weight: bold;

    text-decoration: underline;

}



/* 🌟 हेडिंग */

h1 {

    color: #dc3545;

    margin-top: 20px;

}



/* 🌟 जॉब सेक्शन */

#jobs-container {

    background: white;

    padding: 20px;

    margin: 20px auto;

    width: 90%;

    max-width: 600px;

    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);

    border-radius: 8px;

}



/* 🌟 जॉब कार्ड */

.job-card {

    padding: 15px;

    margin: 10px 0;

    border: 1px solid #ddd;

    border-radius: 5px;

    background-color: #fff;

    transition: 0.3s;

    text-align: left;

}



.job-card:hover {

    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);

    transform: scale(1.02);

}



/* 🌟 बटन */

.apply-btn {

    text-decoration: none;

    color: white;

    background: #28a745;

    padding: 10px 20px;

    margin: 10px;

    border-radius: 5px;

    display: inline-block;

    transition: 0.3s;

}



.apply-btn:hover {

    background: #218838;

}



/* 🌟 Footer */

footer {

    margin-top: 20px;

    padding: 10px;

    background: #343a40;

    color: white;

    font-size: 14px;

    text-align: center;

}

"""



# Save files

script_js_path = "/mnt/data/script.js"

style_css_path = "/mnt/data/style.css"



with open(script_js_path, "w") as script_file:

    script_file.write(script_js_content)



with open(style_css_path, "w") as style_file:

    style_file.write(style_css_content)



script_js_path, style_css_path
