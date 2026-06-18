import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD0s7OTU93wOHuW4bvVD--fRZsI1hoZegk",
  authDomain: "salecrib-webinar.firebaseapp.com",
  projectId: "salecrib-webinar",
  storageBucket: "salecrib-webinar.firebasestorage.app",
  messagingSenderId: "369134147241",
  appId: "1:369134147241:web:4766125a33a7de3b1dfbb8",
  measurementId: "G-ERH59MK9FD"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
