import { initializeApp, FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {getStorage} from 'firebase/storage'
// firebase configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyCAcV2JoSfWWAlJJ_bpdsse6Wex4eCfHjo",
  authDomain: "comment-app-53db5.firebaseapp.com",
  projectId: "comment-app-53db5",
  storageBucket: "comment-app-53db5.appspot.com",
  messagingSenderId: "503359930075",
  appId: "1:503359930075:web:947c457b52c415e30516fe",
  measurementId: "G-RQEF4CTEMQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);