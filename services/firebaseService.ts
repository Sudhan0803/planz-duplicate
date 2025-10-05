import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged as onFirebaseAuthStateChanged,
  type User as FirebaseUser
} from "firebase/auth";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  serverTimestamp,
  orderBy
} from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase/config";
import type { TripPlan, User } from "../types";

export const signInWithGoogle = async (): Promise<FirebaseUser | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error during sign-in:", error);
    return null;
  }
};

export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error during sign-out:", error);
  }
};

export const onAuthStateChanged = (callback: (user: User | null) => void): (() => void) => {
  return onFirebaseAuthStateChanged(auth, (user) => {
    if (user) {
      callback({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
      });
    } else {
      callback(null);
    }
  });
};

export const saveTrip = async (userId: string, tripPlan: Omit<TripPlan, 'id' | 'userId'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "trips"), {
      ...tripPlan,
      userId: userId,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving trip:", error);
    throw new Error("Could not save trip to your history.");
  }
};

export const getTrips = async (userId: string): Promise<TripPlan[]> => {
    try {
        const q = query(collection(db, "trips"), where("userId", "==", userId), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const trips: TripPlan[] = [];
        querySnapshot.forEach((doc) => {
            trips.push({ id: doc.id, ...doc.data() } as TripPlan);
        });
        return trips;
    } catch (error) {
        console.error("Error fetching trips:", error);
        throw new Error("Could not fetch your saved trips.");
    }
};
