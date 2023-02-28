import { collection,  addDoc,getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { userType } from './types';

export enum Type {
  LOGIN =  "LOGIN",
  SIGNUP =  "SIGNUP",
}


export const createUser = async ( email: string, password: string, type: Type,name?:string, imageUrl?:string) => {
    const auth = getAuth();
    try {
      if (type === Type["LOGIN"]) {
        await signInWithEmailAndPassword(auth, email, password);
        
      } else {
      const result =  await createUserWithEmailAndPassword(auth, email, password);
      console.log('result?.user?.uid',result?.user?.uid)
         await addDoc(collection(db, 'users'), {
          name: name,
          email: email,
          profileImage:imageUrl,
          id:result?.user?.uid,
        });
      }
    
      return true;
    } catch (error) {
      throw error;
    } 
};


export const getUserData = async(id:string): Promise<userType>=>{
  try{
      const q = query(
        collection(db, 'users'),
        where('id', '==', id),
      );
      const result = await getDocs(q);
  
      return  result.docs[0].data() as userType;
  }catch(error){
    throw error;
  }
 
}
