
// Fix: Use scoped firebase imports to resolve export error.
import { initializeApp } from "@firebase/app";
import { getAuth, GoogleAuthProvider } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";

// =================================================================================
// IMPORTANT: ACTION REQUIRED
// =================================================================================
// The configuration below is a placeholder. For the "Save Trip" and "My History"
// features to work, you must replace these values with your own project's
// Firebase configuration.
//
// How to get your Firebase config:
// 1. Go to the Firebase Console: https://console.firebase.google.com/
// 2. Create a new project (or select an existing one).
// 3. In your project, go to Project Settings (click the gear icon).
// 4. Under the "General" tab, scroll down to "Your apps".
// 5. Click on the "Web" icon (</>) to create a new web app or select an existing one.
// 6. You will find your firebaseConfig object there. Copy and paste it below.
// 7. Make sure to enable Google Authentication in the Firebase Console
//    (Authentication -> Sign-in method -> Add Google as a provider).
// 8. Also, set up Firestore (Database -> Create database) for data storage.
// =================================================================================
const firebaseConfig = {
  apiKey: "AIzaSyA_...REPLACE_WITH_YOUR_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:a1b2c3d4e5f6a7b8c9d0e1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };