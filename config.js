fetch("https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec")
  .then(response => response.json())
  .then(data => {
    let jobsContainer = document.getElementById("jobs");
    jobsContainer.innerHTML = "";  
    data.forEach(job => {
      jobsContainer.innerHTML += `
        <div>
          <h3>${job["Job Title"]}</h3>
          <p><b>Organization:</b> ${job.Organization}</p>
          <p><b>Last Date:</b> ${job["Last Date"]}</p>
          <a href="${job["Apply Link"]}" target="_blank">Apply Now</a>
        </div>
        <hr>
      `;
    });
  });
