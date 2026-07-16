import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword as fbSignIn, 
  createUserWithEmailAndPassword as fbCreateUser, 
  signOut as fbSignOut, 
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where 
} from "firebase/firestore";

// Safe, lazy initialization of Firebase configuration to prevent startup crashes if environment variables are not supplied yet.
const getFirebaseConfig = () => {
  const env = (import.meta as any).env;
  const apiKey = env.VITE_FIREBASE_API_KEY;
  const authDomain = env.VITE_FIREBASE_AUTH_DOMAIN;
  const projectId = env.VITE_FIREBASE_PROJECT_ID;
  const storageBucket = env.VITE_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = env.VITE_FIREBASE_MESSAGING_SENDER_ID;
  const appId = env.VITE_FIREBASE_APP_ID;

  if (!apiKey || !projectId) {
    console.warn(
      "Firebase environment variables are missing. Please configure VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID in your .env or platform settings. Falling back to simulated/offline mode."
    );
    return null;
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId: env.VITE_FIREBASE_MEASUREMENT_ID
  };
};

let appInstance: ReturnType<typeof initializeApp> | null = null;
let authInstance: ReturnType<typeof getAuth> | null = null;
let dbInstance: ReturnType<typeof getFirestore> | null = null;

export function getFirebaseApp() {
  if (!appInstance) {
    const config = getFirebaseConfig();
    if (!config) {
      throw new Error("Firebase is not configured. Please supply environment variables.");
    }
    appInstance = getApps().length === 0 ? initializeApp(config) : getApp();
  }
  return appInstance;
}

export function getFirebaseAuth() {
  if (!authInstance) {
    try {
      const app = getFirebaseApp();
      authInstance = getAuth(app);
    } catch (e) {
      console.warn("Could not load Firebase Auth. Check your configuration.", e);
      return null;
    }
  }
  return authInstance;
}

export function getFirebaseDb() {
  if (!dbInstance) {
    try {
      const app = getFirebaseApp();
      dbInstance = getFirestore(app);
    } catch (e) {
      console.warn("Could not load Firestore Db. Check your configuration.", e);
      return null;
    }
  }
  return dbInstance;
}

// Is Firebase Configured?
export function isFirebaseConfigured(): boolean {
  const env = (import.meta as any).env;
  return !!env.VITE_FIREBASE_API_KEY && !!env.VITE_FIREBASE_PROJECT_ID;
}

// Convert Firebase errors to clear, friendly, and actionable messages
export function getFriendlyAuthErrorMessage(err: any): string {
  if (!err) return "Authentication failed. Please check your credentials or settings.";

  const code = err.code || "";
  const message = err.message || "";

  if (code === "auth/configuration-not-found" || message.includes("configuration-not-found")) {
    return "Email & Password Sign-In is not enabled on this Firebase project. Please go to your Firebase Console -> Authentication -> Sign-in method, and enable the Email/Password provider.";
  }

  if (code === "auth/invalid-email" || message.includes("invalid-email")) {
    return "Please enter a valid student email address.";
  }

  if (code === "auth/wrong-password" || message.includes("wrong-password")) {
    return "Incorrect password. Please verify and try again.";
  }

  if (code === "auth/user-not-found" || message.includes("user-not-found")) {
    return "No student account was found with this email. Please sign up first.";
  }

  if (code === "auth/invalid-credential" || message.includes("invalid-credential")) {
    return "Incorrect email address or password. Please verify your credentials and try again.";
  }

  if (code === "auth/email-already-in-use" || message.includes("email-already-in-use")) {
    return "This email address is already registered to another student account.";
  }

  if (code === "auth/weak-password" || message.includes("weak-password")) {
    return "The password is too weak. It must be at least 6 characters long.";
  }

  if (code === "auth/operation-not-allowed" || message.includes("operation-not-allowed")) {
    return "Email & Password login is disabled in this Firebase project. Please enable it in the Firebase Console.";
  }

  if (code === "auth/user-disabled" || message.includes("user-disabled")) {
    return "This student account has been disabled by system administrators.";
  }

  if (code === "auth/too-many-requests" || message.includes("too-many-requests")) {
    return "Too many failed login attempts. Access to this account has been temporarily disabled. Please try again later.";
  }

  if (code === "auth/network-request-failed" || message.includes("network-request-failed")) {
    return "Network error. Please check your internet connection and try again.";
  }

  // Handle default messages cleanly
  if (message.startsWith("Firebase: ")) {
    return message.replace("Firebase: ", "").trim();
  }

  return message || "Authentication failed. Please verify credentials or settings.";
}

// Auth Helper Services
export async function registerStudent(email: string, pass: string, name: string, university: string) {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase Auth is not initialized.");

  try {
    const userCredential = await fbCreateUser(auth, email, pass);
    const user = userCredential.user;

    const db = getFirebaseDb();
    if (db) {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: name,
        email: email,
        university: university,
        createdAt: new Date().toISOString(),
        role: "student"
      });
    }

    return { uid: user.uid, email: user.email, displayName: name, university };
  } catch (err: any) {
    throw new Error(getFriendlyAuthErrorMessage(err));
  }
}

export async function loginStudent(email: string, pass: string) {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase Auth is not initialized.");

  try {
    const userCredential = await fbSignIn(auth, email, pass);
    const user = userCredential.user;

    let dbUser: any = null;
    const db = getFirebaseDb();
    if (db) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        dbUser = docSnap.data();
      }
    }

    return {
      uid: user.uid,
      email: user.email,
      displayName: dbUser?.fullName || user.displayName || "Student",
      university: dbUser?.university || "LAUTECH"
    };
  } catch (err: any) {
    throw new Error(getFriendlyAuthErrorMessage(err));
  }
}

export async function loginWithGoogle() {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase Auth is not initialized.");

  const provider = new GoogleAuthProvider();

  try {
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    let dbUser: any = null;
    const db = getFirebaseDb();
    if (db) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        dbUser = docSnap.data();
      } else {
        dbUser = {
          uid: user.uid,
          fullName: user.displayName || "Google Student",
          email: user.email,
          university: "LAUTECH",
          createdAt: new Date().toISOString(),
          role: "student",
          avatarUrl: user.photoURL || undefined
        };
        await setDoc(docRef, dbUser);
      }
    }

    return {
      uid: user.uid,
      email: user.email,
      displayName: dbUser?.fullName || user.displayName || "Student",
      university: dbUser?.university || "LAUTECH",
      avatarUrl: dbUser?.avatarUrl || user.photoURL || undefined
    };
  } catch (err: any) {
    throw new Error(getFriendlyAuthErrorMessage(err));
  }
}

export async function logoutUser() {
  const auth = getFirebaseAuth();
  if (auth) {
    await fbSignOut(auth);
  }
}
