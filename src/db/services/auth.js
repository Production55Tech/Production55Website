import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// TODO: for google login (ask JC)
/*export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);

  return result
}; */

//TODO: add password reset, and email verification

export const doSignOut = () => {
  return auth.signOut();
};
