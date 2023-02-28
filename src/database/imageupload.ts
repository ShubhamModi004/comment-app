 import { storage } from '../config/firebase';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
 
 
 export  const uploadImage = async (file:File):Promise<string> => {

        const storageRef = ref(storage, `files/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        return new Promise((resolve, reject) => {
        uploadTask.on("state_changed",
            (snapshot) => {
              
            },
            (error) => {
                reject(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                });
            }
        );
        })
    };