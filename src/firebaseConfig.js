// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdeGwLFzGu4FB9fJvfFoLXZiO5YRqfWUo",
  authDomain: "chat-app-c99c9.firebaseapp.com",
  projectId: "chat-app-c99c9",
  storageBucket: "chat-app-c99c9.appspot.com",
  messagingSenderId: "846019553150",
  appId: "1:846019553150:web:83ad6465c75bc8b631f52f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Authentication
const db = getFirestore(app);
const auth = getAuth(app);

// Export the db and auth
export { db, auth };
