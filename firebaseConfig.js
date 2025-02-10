// This file is for Firebase configuration
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_APIKEY,
  authDomain: process.env.EXPO_PUBLIC_AUTHDOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECTID,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGINGSENDERID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
