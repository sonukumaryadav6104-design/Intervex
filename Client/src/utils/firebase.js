
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "intervex-ce296.firebaseapp.com",
  projectId: "intervex-ce296",
  storageBucket: "intervex-ce296.firebasestorage.app",
  messagingSenderId: "539681444402",
  appId: "1:539681444402:web:a58ed029e4aac133c9a22b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export {auth,provider}