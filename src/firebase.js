// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCoddGs4fK1e_BEkjctN-SLuueEt0f491U",
  authDomain: "subscriptionos-a2d59.firebaseapp.com",
  projectId: "subscriptionos-a2d59",
  storageBucket: "subscriptionos-a2d59.firebasestorage.app",
  messagingSenderId: "938291413389",
  appId: "1:938291413389:web:bac08027d2b6ff5248bdc4",
  measurementId: "G-B0J4V04908"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth  = getAuth(app);