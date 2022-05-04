// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7CzEM5GlrMpnfN_8KKPU4WLZ-3QhODLM",
  authDomain: "tinder-clone-mobile.firebaseapp.com",
  projectId: "tinder-clone-mobile",
  storageBucket: "tinder-clone-mobile.appspot.com",
  messagingSenderId: "971717229528",
  appId: "1:971717229528:web:8483ee40d91b3b870790ad"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { auth, db }