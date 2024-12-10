import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, get, remove} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Firebase Configuration
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

let currentMediaKey = null;

// Get media URL from query parameters
const urlParams = new URLSearchParams(window.location.search);
const mediaUrl = urlParams.get('mediaUrl');

// Fetch and display media details
async function fetchMediaDetails(mediaUrl) {
    if (!mediaUrl) {
        alert("No media URL provided!");
        return;
    }

    try {
        // Reference to the 'uploads' branch
        const uploadsRef = ref(database, 'uploads');
        const snapshot = await get(uploadsRef);

        if (snapshot.exists()) {
            const uploads = snapshot.val();
            let mediaDetails = null;

            // Find the upload corresponding to the mediaUrl
            for (const key in uploads) {
                if (uploads[key]?.mediaUrl === mediaUrl) {
                    mediaDetails = uploads[key];
                    currentMediaKey = key;
                    break;
                }
            }

            if (mediaDetails) {
                // Update the DOM with media details
                document.getElementById('selectedMedia').src = mediaUrl;
                document.getElementById('mediaTitle').textContent = `Title: ${mediaDetails.title || "N/A"}`;
                document.getElementById('mediaDescription').textContent = `Description: ${mediaDetails.description || "N/A"}`;
                document.getElementById('mediaName').textContent = `Uploaded by: ${mediaDetails.name || "Unknown"}`;
                document.getElementById('mediaLink').innerHTML = mediaDetails.link 
                ? `Link: <a href="${mediaDetails.link}" target="_blank" rel="noopener noreferrer">${mediaDetails.link}</a>` 
                : "Link: N/A";
                              mediaDescription.style.maxWidth = '300px'; // Set your desired max width (e.g., 300px)

                // Optional: You can also set other styles if needed
                mediaDescription.style.overflow = 'hidden'; // Hide overflow text
                mediaDescription.style.textOverflow = 'ellipsis'; // Add "..." for overflowing text
                mediaDescription.style.whiteSpace = 'nowrap'; // Prevent text wrapping


                // Show the delete button and attach functionality
                const deleteButton = document.getElementById('deleteButton');
                deleteButton.style.display = 'block';
                deleteButton.onclick = () => deletePost();
            } else {
                alert("No details found for this media!");
            }
        } else {
            alert("No uploads data found in the database!");
        }
    } catch (error) {
        console.error("Error fetching media details:", error);
    }
}

// Delete media post
async function deletePost() {
    try {
        if (!currentMediaKey) {
            alert("Media key not found!");
            return;
        }

        const mediaRef = ref(database, `uploads/${currentMediaKey}`);
        await remove(mediaRef);

        alert("Media post deleted successfully!");

        // Clear the UI
        document.getElementById('selectedMedia').src = "";
        document.getElementById('mediaTitle').textContent = "";
        document.getElementById('mediaDescription').textContent = "";
        document.getElementById('mediaName').textContent = "";
        document.getElementById('mediaLink').textContent = "";

        // Hide the delete button
        const deleteButton = document.getElementById('deleteButton');
        deleteButton.style.display = 'none';

        // Reset mediaKey
        currentMediaKey = null;

        document.getElementById('mediaDetailsContainer').innerHTML = "File Deleted";
    } catch (error) {
        console.error("Error deleting media:", error);
        alert("Failed to delete the media post.");
    }
}

// Load media details when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchMediaDetails(mediaUrl);
});
