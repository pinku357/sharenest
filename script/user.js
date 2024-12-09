
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBeNJSFm34wAfSme7fCQHaO6XAe0-lZAsw",
    authDomain: "smsa-e4136.firebaseapp.com",
    databaseURL: "https://smsa-e4136-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "smsa-e4136",
    storageBucket: "smsa-e4136.firebasestorage.app",
    messagingSenderId: "613252061504",
    appId: "1:613252061504:web:4bc7abecf49bd4b0fc02a5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Function to show spinner until data is loaded
function showSpinner() {
    const container = document.getElementById('mediaContainer');
    container.innerHTML = `<div class="spinner"></div>`;
}

function hideSpinner() {
    const container = document.getElementById('mediaContainer');
    container.innerHTML = '';
}

// Fetch data & render media gallery
async function fetchUserMedia(hardcodedEmail) {
    try {
        showSpinner(); // Show spinner before data fetch
        const db = database;
        const profileRef = ref(db, 'profiles');
        const uploadsRef = ref(db, 'uploads');

        const [profileSnapshot, uploadsSnapshot] = await Promise.all([
            get(profileRef),
            get(uploadsRef),
        ]);

        if (profileSnapshot.exists() && uploadsSnapshot.exists()) {
            const profiles = profileSnapshot.val();
            const uploads = uploadsSnapshot.val();

            let matchedUser = null;
            for (const key in profiles) {
                if (profiles[key]?.email === hardcodedEmail) {
                    matchedUser = profiles[key];
                    break;
                }
            }

            if (matchedUser) {
                const matchedMediaUrls = Object.keys(uploads).reduce((acc, key) => {
                    if (uploads[key]?.name === matchedUser.name) acc.push(uploads[key].mediaUrl);
                    return acc;
                }, []);

                console.log("Matched URLs:", matchedMediaUrls);

                if (matchedMediaUrls.length > 0) {
                    displayMedia(matchedMediaUrls);
                } else {
                    alert("No media found for this user.");
                }
            }
        } else {
            alert("No profiles or uploads data found.");
        }
    } catch (error) {
        console.error("Error fetching data: ", error);
    } finally {
        hideSpinner(); // Always hide the spinner after attempt
    }
}


async function checkEmailAndFetchMedia(hardcodedEmail) {
    try {
        checkUserProfileExistence();
        const db = database;
        const profilesRef = ref(db, "profiles");
        const uploadsRef = ref(db, "uploads");

        const profileSnapshot = await get(profilesRef);
        const uploadsSnapshot = await get(uploadsRef);

        if (profileSnapshot.exists() && uploadsSnapshot.exists()) {
            const profiles = profileSnapshot.val();
            const uploads = uploadsSnapshot.val();

            let matchedName = "";
            for (let key in profiles) {
                if (profiles[key]?.email === hardcodedEmail) {
                    matchedName = profiles[key]?.name || "";
                    document.getElementById("userEmail").textContent = profiles[key]?.email || "";
                    document.getElementById("userName").textContent = profiles[key]?.name || "";
                    document.getElementById("userProfilePicture").src = profiles[key]?.profilePicture || "";
                    break;
                }
            }

            if (!matchedName) {
                alert("No profile found for this email.");
                return;
            }

            const matchedMediaUrls = [];
            for (let key in uploads) {
                if (uploads[key]?.name === matchedName) {
                    matchedMediaUrls.push(uploads[key]?.mediaUrl);
                }
            }

            if (matchedMediaUrls.length) {
                displayMedia(matchedMediaUrls);
            }
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function displayMedia(mediaUrls) {
    const container = document.getElementById('mediaContainer');
    container.innerHTML = ''; // Clear container before displaying new images
    mediaUrls.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        img.className = 'grid-image';
        img.onclick = () => {
            // Redirect to the details page with the media URL as a query parameter
            window.location.href = `mediaDetails.html?mediaUrl=${encodeURIComponent(url)}`;
        };
        container.appendChild(img);
    });
}

 // Check if user already exists in database
 async function checkUserProfileExistence() {
    const name = document.getElementById('loggedUserFName').textContent;
    console.log('Checking if user exists in Firebase...');
    try {
      const snapshot = await database
        .ref('uploads')
        .orderByChild('name')
        .equalTo(name)
        .once('value');

      if (snapshot.exists()) {
        console.log('User already exists in the database.');
        window.location.href = 'index.html'; // Redirect user if already exists
      } else {
        console.log('No existing user found. You can proceed to upload.');
        setupForm();
      }
    } catch (error) {
      console.error('Error querying database:', error);
    }
  }

document.addEventListener('DOMContentLoaded', function () {
    const email = document.getElementById('loggedUserEmail');
    const hardcodedEmail = email.textContent || ""; // Replace with actual email dynamically
    fetchUserMedia(hardcodedEmail);
});

// Wait until the logged user email is populated before running Firebase logic
document.addEventListener("DOMContentLoaded", function () {
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (
                mutation.target.textContent &&
                mutation.target.textContent.trim() !== ""
            ) {
                // Stop observing when email is available
                observer.disconnect();
                const hardcodedEmail = mutation.target.textContent.trim();
                checkEmailAndFetchMedia(hardcodedEmail);
            }
        }
    });

    observer.observe(document.getElementById("loggedUserEmail"), {
        childList: true,
        characterData: true,
        subtree: true,
    });
});

