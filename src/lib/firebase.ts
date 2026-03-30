import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCklYay-5GpPT8WkP_BikJxmk4WU_S7MLI",
  authDomain: "studio-7688081303-32670.firebaseapp.com",
  projectId: "studio-7688081303-32670",
  storageBucket: "studio-7688081303-32670.firebasestorage.app",
  messagingSenderId: "1015147458351",
  appId: "1:1015147458351:web:f1c85c2f4a7f8287a83bda"
};

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);