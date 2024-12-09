import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, getDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Check authentication status
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, retrieve user data
        localStorage.setItem('loggedInUserId', user.uid);
        const docRef = doc(db, "users", user.uid);
        getDoc(docRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    document.getElementById('loggedUserFName').innerText = userData.firstName;
                    document.getElementById('loggedUserEmail').innerText = userData.email;
                    document.getElementById('loggedUserLName').innerText = userData.phoneNo;
                } else {
                    console.log("No document found matching ID");
                }
            })
            .catch((error) => {
                console.error("Error getting document:", error);
            });
    } else {
        // User is not signed in, redirect to login page
        window.location.href = 'login.html';
    }
});

// Handle logout
const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', () => {
    localStorage.removeItem('loggedInUserId');
    signOut(auth)
        .then(() => {
            window.location.href = 'login.html';
        })
        .catch((error) => {
            console.error('Error signing out:', error);
        });
});


