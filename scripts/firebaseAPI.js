// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6svUa0xqlv5xNQScXUgbHMyaIaeUagWw",
  authDomain: "wealth-wave-bd22c.firebaseapp.com",
  projectId: "wealth-wave-bd22c",
  storageBucket: "wealth-wave-bd22c.appspot.com",
  messagingSenderId: "96228810074",
  appId: "1:96228810074:web:927b66237a1cfee0192763"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();