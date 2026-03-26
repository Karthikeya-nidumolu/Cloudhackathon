import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "./firebase";

export const updateProgress = async (course: string, progress: number) => {
  const user = auth.currentUser;

  if (!user) return;

  const ref = doc(db, "users", user.uid, "progress", course);

  await setDoc(ref, { progress }, { merge: true });
};