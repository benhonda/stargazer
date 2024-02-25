// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GithubAuthProvider, connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Note: these are public keys, so don't worry about them being here
const firebaseConfig = {
  apiKey: "AIzaSyDN_RBLbWHcb-1DWVLK34lLdzo7PxVsLLE",
  authDomain: "stargazer-69459.firebaseapp.com",
  projectId: "stargazer-69459",
  storageBucket: "stargazer-69459.appspot.com",
  messagingSenderId: "375196753577",
  appId: "1:375196753577:web:a1e64175915df39e0ad3b8",
  measurementId: "G-CHE5JY9FT6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// analytics
if (import.meta.env.PROD) {
  const analytics = getAnalytics(app);
}

// auth
export const auth = getAuth(app);
export const gitHubProvider = new GithubAuthProvider();
// gitHubProvider.addScope("") // need this?
if (import.meta.env.DEV) {
  connectAuthEmulator(auth, "http://localhost:9099");
}

// db
export const db = getFirestore(app);
if (import.meta.env.DEV) {
  connectFirestoreEmulator(db, "localhost", 8080);
}

// storage
export const storage = getStorage(app);
if (import.meta.env.DEV) {
  connectStorageEmulator(storage, "localhost", 9199);
}
