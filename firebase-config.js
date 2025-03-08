export function initializeFirebase() {
  fetch("https://script.google.com/macros/s/AKfycbz6VRvr6pJ5aCLHCIeX-Wg4bdsEYRy68sujM1y2sZnxkI3rngrpxr8UNXB7lihW0dN37w/exec")
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(firebaseConfig => {
      console.log("Firebase Config Loaded Securely:", firebaseConfig);
      if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        console.log("Firebase Initialized Successfully!");
      } else {
        console.error("Firebase SDK not loaded!");
      }
    })
    .catch(error => {
      console.error("Error loading Firebase config:", error);
      // Optionally, you can display an error message to the user
      document.getElementById("firebase-error").innerText = "Failed to load Firebase configuration. Please try again later.";
    });
}
