import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Aapka naya Firebase Config (Jo aapne abhi bhejha)
const firebaseConfig = {
  apiKey: "AIzaSyBPOIZGyMvMqsUe4L8uJOHXxPbOAjvP3lY",
  authDomain: "gyan-ki-veda.firebaseapp.com",
  projectId: "gyan-ki-veda",
  storageBucket: "gyan-ki-veda.firebasestorage.app",
  messagingSenderId: "64693158776",
  appId: "1:64693158776:web:aa76426fab1cc31a1ebe8d",
  measurementId: "G-SEH91MPVC0"
};

// Initialize Firebase (SSR Safe)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Google Auth Provider setup
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// --- GOOGLE SIGN-IN FUNCTION ---
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // User data ko Firestore mein save/sync karna
    await saveUserToDB({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      authMethod: "google"
    });

    return user;
  } catch (error) {
    console.error("Google Login Error:", error.message);
    throw error;
  }
};

// --- USER DATA SAVER (OPTIMIZED) ---
export const saveUserToDB = async (userData) => {
  if (!userData || !userData.uid) return;

  const userRef = doc(db, "users", userData.uid);
  
  try {
    await setDoc(userRef, {
      uid: userData.uid,
      email: userData.email,
      displayName: userData.displayName || "Explorer",
      photoURL: userData.photoURL || "",
      tokens_owned: userData.tokens_owned !== undefined ? userData.tokens_owned : 0, 
      authMethod: userData.authMethod || "unknown",
      lastLogin: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });

    console.log("Commander's profile synced with Firestore!");
  } catch (error) {
    console.error("Critical error in User Data Sync:", error);
  }
};

export { auth, googleProvider, db, storage };