const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/djfjn4ykb/image/upload';
const UPLOAD_PRESET = 'pinku_preset'; // upload preset

let isUploading = false; // A flag to track submission state

document.getElementById('profileForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  
  // Prevent form submission if already in progress
  if (isUploading) {
    alert('Upload in progress. Please wait...');
    return;
  }

  isUploading = true; // Set the flag to true
  const submitButton = document.querySelector('#profileForm button[type="submit"]');
  submitButton.disabled = true; // Disable the button during submission

  const fileInput = document.getElementById('profilePic');
  const file = fileInput.files[0];
  const fileError = document.getElementById('fileError');

  // Validate file size
  if (file.size > 1 * 1024 * 1024) {
    fileError.textContent = 'File size must be less than 1MB.';
    isUploading = false;
    submitButton.disabled = false;
    return;
  }
  fileError.textContent = '';

  const name = document.getElementById('loggedUserFName').textContent;
  const email = document.getElementById('loggedUserEmail').textContent;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    const imageUrl = data.secure_url;

    // Save details to Firebase
    await firebase.database().ref('profiles').push({
      name,
      email,
      profilePicture: imageUrl,
    });

    // Redirect to index.html
    window.location.href = '1stupload.html';
  } catch (error) {
    alert('An error occurred during upload. Please try again.');
    console.error(error);
  } finally {
    isUploading = false; // Reset the flag
    submitButton.disabled = false; // Re-enable the button
  }
});

// Wait for spans to load from homepage.js
let loggedUserFName = '';
let loggedUserEmail = '';

function waitForUserData() {
  const interval = setInterval(() => {
    const firstNameSpan = document.getElementById('loggedUserFName');
    const emailSpan = document.getElementById('loggedUserEmail');

    if (firstNameSpan.textContent && emailSpan.textContent) {
      loggedUserFName = firstNameSpan.textContent.trim();
      loggedUserEmail = emailSpan.textContent.trim();
      console.log('User Data Loaded:', loggedUserFName, loggedUserEmail);
      clearInterval(interval);
      checkUserProfileExistence();
      checkUserUploadExistence();
    }
  }, 100);
}

// Check if user already exists in database
async function checkUserProfileExistence() {
  console.log('Checking if user exists in Firebase...');
  try {
    const snapshot = await database
      .ref('profiles')
      .orderByChild('email')
      .equalTo(loggedUserEmail)
      .once('value');

    if (snapshot.exists()) {
      console.log('User already exists in the database.');
      window.location.href = 'index.html';
    } else {
      console.log('No existing user found. You can proceed to upload.');
      setupForm();
    }
  } catch (error) {
    console.error('Error querying database:', error);
  }
}

// Check if user already exists in database
async function checkUserUploadExistence() {
  console.log('Checking if user exists in Firebase...');
  try {
    const snapshot = await database
      .ref('uploads')
      .orderByChild('name')
      .equalTo(loggedUserFName)
      .once('value');

    if (snapshot.exists()) {
      console.log('User already exists in the database.');
      window.location.href = 'index.html';
    } else {
      console.log('No existing user found. You can proceed to upload.');
      setupForm();
    }
  } catch (error) {
    console.error('Error querying database:', error);
  }
}

waitForUserData();
