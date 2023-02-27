import { collection,  addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export enum Type {
  LOGIN =  "LOGIN",
  SIGNUP =  "SIGNUP",
}


export const createUser = async (email: string, password: string, type: Type) => {
    const auth = getAuth();
    try {
      if (type === Type["LOGIN"]) {
        await signInWithEmailAndPassword(auth, email, password);
        
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      const docRef = await addDoc(collection(db, 'users'), {
        name: email,
      });
      return { name: email, id: docRef.id };
    } catch (error) {
      throw error;
    } 
};
