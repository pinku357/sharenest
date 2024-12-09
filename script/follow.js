// Firebase configuration and initialization
const firebaseConfig = {
    apiKey: "AIzaSyBeNJSFm34wAfSme7fCQHaO6XAe0-lZAsw",
    authDomain: "smsa-e4136.firebaseapp.com",
    databaseURL: "https://smsa-e4136-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "smsa-e4136",
    storageBucket: "smsa-e4136.firebasestorage.app",
    messagingSenderId: "613252061504",
    appId: "1:613252061504:web:4bc7abecf49bd4b0fc02a5"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Fetch profiles from Realtime Database
const profileListContainer = document.getElementById('profile-list');

database.ref('profiles').on('value', (snapshot) => {
    const profiles = snapshot.val();
    profileListContainer.innerHTML = ''; // Clear current content

    for (const id in profiles) {
        const { name, profilePicture } = profiles[id];

        // Create profile item
        const profileItem = document.createElement('div');
        profileItem.className = 'profile-item';

        const img = document.createElement('img');
        img.src = profilePicture;
        img.alt = name;

        const profileName = document.createElement('div');
        profileName.className = 'profile-name';
        profileName.textContent = name;

        profileItem.appendChild(img);
        profileItem.appendChild(profileName);

        profileListContainer.appendChild(profileItem);
    }
});
