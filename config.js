async function getFirebaseConfig() {
    const response = await fetch("https://raw.githubusercontent.com/rahul74603/JOBXSUCCESS/main/firebase-config.json");
    const config = await response.json();
    return config;
}
