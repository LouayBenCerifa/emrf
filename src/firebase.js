import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {  collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCyLuywSLJ83BwxCNFacET_qOOLm4OotHg",
  authDomain: "ecommerce-a8c8f.firebaseapp.com",
  databaseURL: "https://ecommerce-a8c8f-default-rtdb.firebaseio.com",
  projectId: "ecommerce-a8c8f",
  storageBucket: "ecommerce-a8c8f.firebasestorage.app",
  messagingSenderId: "508612013124",
  appId: "1:508612013124:web:aaafca37adb5f17f702011",
  measurementId: "G-EE7DG5D4QZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, addDoc, collection };








