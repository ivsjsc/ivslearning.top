// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAOxCF0PhA6s3DtvETux-kXGTXRTlpL4vs",
  authDomain: "ivs-159a7.firebaseapp.com",
  projectId: "ivs-159a7",
  storageBucket: "ivs-159a7.firebasestorage.app",
  messagingSenderId: "452959273724",
  appId: "1:452959273724:web:17a23e383fb1807c040d79",
  measurementId: "G-L4KG7BCTJE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Export for use in other files
export { app, analytics, auth };