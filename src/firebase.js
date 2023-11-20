// firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { updateProfile, sendEmailVerification } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
    apiKey: "AIzaSyBtbZTgxZ-0VYsdEfIvlkHwmk5Ak4d2XyM",
    authDomain: "kurudhi-6135d.firebaseapp.com",
    databaseURL: "https://kurudhi-6135d-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "kurudhi-6135d",
    storageBucket: "kurudhi-6135d.appspot.com",
    messagingSenderId: "78326000398",
    appId: "1:78326000398:web:1953cb2b173b882d87455f",
    measurementId: "G-3VRSYK6VLF"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp); // Export auth here once.

const db = getDatabase(firebaseApp);

const storage = getStorage(firebaseApp);

export { firebaseApp, storage };

export { auth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification, db };