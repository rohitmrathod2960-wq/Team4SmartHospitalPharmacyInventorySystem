import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyCdQyJJSeY4Im_tqYmHY4NH0RM-VsgzNr0",
  authDomain: "studio-2848770786-b8a37.firebaseapp.com",
  projectId: "studio-2848770786-b8a37",
  storageBucket: "studio-2848770786-b8a37.firebasestorage.app",
  messagingSenderId: "1089584854928",
  appId: "1:1089584854928:web:ddbccba45e57764ef9e515"
};

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);