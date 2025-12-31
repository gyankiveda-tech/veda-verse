import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBPOIZGyMvMqsUe4L8uJOHXxPbOAjvP3lY",
  authDomain: "gyan-ki-veda.firebaseapp.com",
  projectId: "gyan-ki-veda",
  storageBucket: "gyan-ki-veda.firebasestorage.app",
  messagingSenderId: "64693158776",
  appId: "1:64693158776:web:aa76426fab1cc31a1ebe8d",
  measurementId: "G-SEH91MPVC0"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

// --- HELPER FUNCTION: USER DATA SAVER (OPTIMIZED) ---
export const saveUserToDB = async (userData) => {
  if (!userData || !userData.uid) return;

  const userRef = doc(db, "users", userData.uid);
  
  try {
    // Hum 'setDoc' with 'merge: true' use kar rahe hain
    // Isse existing data (like tokens) delete nahi hoga, sirf naya data add/update hoga
    await setDoc(userRef, {
      uid: userData.uid,
      email: userData.email,
      displayName: userData.displayName || "Explorer",
      photoURL: userData.photoURL || "",
      // Agar user naya hai toh 0 tokens, agar purana hai toh purana value hi rahegi
      tokens_owned: userData.tokens_owned !== undefined ? userData.tokens_owned : 0, 
      authMethod: userData.authMethod || "unknown", // Ye batayega ki Google se hai ya Email se
      lastLogin: serverTimestamp(), // Har baar login time update hoga
      updatedAt: serverTimestamp()
    }, { merge: true }); // <--- Sabse important fix: MERGE TRUE

    console.log("Commander's profile synced with Firestore!");
  } catch (error) {
    console.error("Critical error in User Data Sync:", error);
  }
};

// Exporting instances
export { auth, googleProvider, db, storage };