// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBeNJSFm34wAfSme7fCQHaO6XAe0-lZAsw",
    authDomain: "smsa-e4136.firebaseapp.com",
    projectId: "smsa-e4136",
    storageBucket: "smsa-e4136.firebasestorage.app",
    messagingSenderId: "613252061504",
    appId: "1:613252061504:web:4bc7abecf49bd4b0fc02a5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Show message function
function showMessage(message, divId) {
    const messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(() => {
        messageDiv.style.opacity = 0;
    }, 5000);
}

// Forgot Password Functionality
function forgotPassword() {
    const email = document.getElementById('email').value;
    const button = document.getElementById("resetPasswordButton");

    if (email===""){
        showMessage('Please enter an Email!', 'resetMessage');
    }else{
    sendPasswordResetEmail(auth, email)
        .then(() => {
            showMessage('Password reset email sent!', 'resetMessage');
        })
        .catch((error) => {
            showMessage('Please enter an email');
        });
        let countdown = 10; // Set countdown time in seconds

        // Apply the disabled style and disable the button
        button.disabled = true;
        button.classList.add("disabled-button");
        button.innerText = `Please wait ${countdown}s`;
        const timer = setInterval(() => {
            countdown--;
            button.innerText = `Please wait ${countdown}s`;
    
            if (countdown <= 0) {
                clearInterval(timer);
                button.disabled = false;
                button.classList.remove("disabled-button");
                button.innerText = "Resend Email";
            }
        }, 1000);
    }
}

// Attach the function to a button click
document.getElementById('resetPasswordButton').addEventListener('click', forgotPassword);

// Sign Up event listener
const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', async (event) => {
    event.preventDefault();
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const confirmPassword = document.getElementById('rCPassword').value;
    const userName = document.getElementById('fName').value;
    const phoneNo = document.getElementById('lName').value;

    if (!email || !password || !confirmPassword || !userName || !phoneNo) {
        showMessage('Please fill out all fields.', 'signUpMessage');
        return;
    }

    if (password !== confirmPassword) {
        showMessage('Passwords do not match.', 'signUpMessage');
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userData = {
            email: email,
            Name: userName,
            phoneNo: phoneNo
        };

        const docRef = doc(db, "users", user.uid);
        await setDoc(docRef, userData);
        showMessage('Account created successfully.', 'signUpMessage');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    } catch (error) {
        const errorCode = error.code;
        if (errorCode === 'auth/email-already-in-use') {
            showMessage('Email address already exists.', 'signUpMessage');
        } else {
            showMessage('Unable to create user.', 'signUpMessage');
        }
    }
});

// Sign In event listener
const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        showMessage('Please fill out all fields.', 'signInMessage');
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        localStorage.setItem('UserId', user.uid);
        showMessage('Login successful.', 'signInMessage');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    } catch (error) {
        const errorCode = error.code;
        if (errorCode === 'auth/invalid-credential') {
            showMessage('Incorrect email or password.', 'signInMessage');
        } else {
            showMessage('Account does not exist.', 'signInMessage');
        }
    }
});
