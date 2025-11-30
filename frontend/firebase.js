// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "zerowastebite-89602.firebaseapp.com",
  projectId: "zerowastebite-89602",
  storageBucket: "zerowastebite-89602.firebasestorage.app",
  messagingSenderId: "176994370678",
  appId: "1:176994370678:web:39dedd8942371f633e0b57"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
export {app,auth}