import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, where, orderBy, limit, getDocs, Timestamp } from "firebase/firestore";
import { getEnv } from '../utils/env';

const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY'),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('VITE_FIREBASE_APP_ID')
};

// Check if all required config values are present
export const isFirebaseConfigured = () => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  );
};

let db = null;
if (isFirebaseConfigured()) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
}

/**
 * Gets or creates an anonymous learner ID stored in localStorage
 */
export const getLearnerId = () => {
  let learnerId = localStorage.getItem('skillpath_learner_id');
  if (!learnerId) {
    learnerId = 'learner_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('skillpath_learner_id', learnerId);
  }
  return learnerId;
};

/**
 * Saves a completed learning session to Firestore
 */
export const saveLearningSession = async (sessionData) => {
  if (!db) {
    console.warn("Firestore not configured. Session not saved.");
    return null;
  }

  try {
    const learnerId = getLearnerId();
    const docRef = await addDoc(collection(db, "learningSessions"), {
      ...sessionData,
      learnerId,
      createdAt: Timestamp.now()
    });
    console.log("Session saved to Firestore with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving session to Firestore:", error);
    throw error;
  }
};

/**
 * Fetches the 3 most recent learning sessions for the current learner
 */
export const getRecentLearningSessions = async () => {
  if (!db) {
    console.warn("Firestore not configured. Cannot fetch history.");
    return [];
  }

  try {
    const learnerId = getLearnerId();
    const q = query(
      collection(db, "learningSessions"),
      where("learnerId", "==", learnerId),
      orderBy("createdAt", "desc"),
      limit(3)
    );

    const querySnapshot = await getDocs(q);
    const sessions = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      sessions.push({
        id: doc.id,
        ...data,
        // Convert Firestore Timestamp to readable date
        date: data.createdAt?.toDate().toLocaleDateString() || new Date().toLocaleDateString()
      });
    });
    return sessions;
  } catch (error) {
    console.error("Error fetching history from Firestore:", error);
    return []; // Return empty array to keep app working
  }
};
