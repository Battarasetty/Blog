// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "blog-3bfd6.firebaseapp.com",
  projectId: "blog-3bfd6",
  storageBucket: "blog-3bfd6.firebasestorage.app",
  messagingSenderId: "879963861201",
  appId: "1:879963861201:web:dd37e6ca458843368b15f0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);