import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Step 3-2で控えたConfigをここに貼り付け
const firebaseConfig = {
    apiKey: "AIzaSyAGwzgJyMVDsGOVCCHgxhIYsrCFuZ7a3Gw",
    authDomain: "monos-d73f9.firebaseapp.com",
    projectId: "monos-d73f9",
    storageBucket: "monos-d73f9.firebasestorage.app",
    messagingSenderId: "133123151326",
    appId: "1:133123151326:web:e4cd8192b1855dc5a7794f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
