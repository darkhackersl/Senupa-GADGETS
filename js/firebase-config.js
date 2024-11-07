// firebase-config.js
const firebaseConfig = {
    apiKey: "AIzaSyAXTwuy5ACKCRCO4M18_v8f_Bwie2gRIeU",
    authDomain: "mr-gadgets.firebaseapp.com",
    projectId: "mr-gadgets",
    storageBucket: "mr-gadgets.firebasestorage.app",
    messagingSenderId: "144245989215",
    appId: "1:144245989215:web:71e02602c87bf0087aa0ea",
    measurementId: "G-R6H4WRR6V4"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Action Code Settings for Email Verification
const actionCodeSettings = {
    url: 'https://scintillating-gnome-48c89a.netlify.app/login',
    handleCodeInApp: true
};

const auth = firebase.auth();
