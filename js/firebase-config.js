// firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyAXTwuy5ACKCRCO4M18_v8f_Bwie2gRIeU",
  authDomain: "mr-gadgets.firebaseapp.com",
  projectId: "mr-gadgets",
  storageBucket: "mr-gadgets.firebasestorage.app", // Fixed storage bucket URL
  messagingSenderId: "144245989215",
  appId: "1:144245989215:web:71e02602c87bf0087aa0ea"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
