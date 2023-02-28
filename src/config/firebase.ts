import { initializeApp, FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {getStorage} from 'firebase/storage'
// firebase configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyCFjyHusl3lYa5QnV6JTj8kYZ1HFRAw1bM",
  authDomain: "comment-app-9a099.firebaseapp.com",
  projectId: "comment-app-9a099",
  storageBucket: "comment-app-9a099.appspot.com",
  messagingSenderId: "640387226456",
  appId: "1:640387226456:web:b50f529034ea3b9009232d",
  measurementId: "G-7NLRX0719Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);