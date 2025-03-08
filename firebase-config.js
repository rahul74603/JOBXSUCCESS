fetch("https://script.google.com/macros/s/AKfycbz6VRvr6pJ5aCLHCIeX-Wg4bdsEYRy68sujM1y2sZnxkI3rngrpxr8UNXB7lihW0dN37w/exec")
  .then(response => response.json())
  .then(firebaseConfig => {
    console.log("Firebase Config Loaded Securely:", firebaseConfig);
    firebase.initializeApp(firebaseConfig);
  })
  .catch(error => console.error("Error loading Firebase config:", error));
