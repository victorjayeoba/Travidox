// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyByKl9sUJVe67Ptwim96zwrrlH8FtOr1j0",
  authDomain: "travidox-b4f34.firebaseapp.com",
  projectId: "travidox-b4f34",
  storageBucket: "travidox-b4f34.firebasestorage.app",
  messagingSenderId: "754263438474",
  appId: "1:754263438474:web:4519a910b151e59ad26973",
  measurementId: "G-F9HFYVGVGB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Analytics (only in browser)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app; 