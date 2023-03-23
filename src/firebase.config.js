// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBaPY8VC_v2YGWp4PNKsZ5W9bglhMIsLvU",
  authDomain: "house-marketplace-4afa9.firebaseapp.com",
  projectId: "house-marketplace-4afa9",
  storageBucket: "house-marketplace-4afa9.appspot.com",
  messagingSenderId: "878255127703",
  appId: "1:878255127703:web:0d5f8f22fc60dfaf38bdd2",
  measurementId: "G-B0E4GJQKEZ"
};

/* eslint-disable no-unused-vars */

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();

/* eslint-disable no-unused-vars */
