import {
  getDocs,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { commentType } from './types';
const commentCollection = collection(db, 'comments');
const replyCollection = collection(db, 'replies');

export const fetchComments = async (): Promise<commentType[]> => {
  try {
    const results = await getDocs(commentCollection);
    let comments = results.docs.map((doc) => {
      return { ...doc.data(), commentId: doc?.id, y: 0 } as commentType 
    });
    return comments;
  } catch (e) {
    throw e;
  }
};

export const addComment = async (
  name: string,
  comment: string,
  profileImage:string,
  id:string,
): Promise<boolean> => {
  try {
    await addDoc(commentCollection, {
      upvotes: [],
      comment: comment,
      name: name,
      repliedComment: [],
      date: new Date(),
      profileImage:profileImage,
      userId:id
    });
    return true;
  } catch (e) {
    throw e;
  }
};

export const deleteEntry = async (
  id: string,
  type: string
): Promise<boolean> => {
  try {
    const docRef = type === "comments" ? doc(db, 'comments', id) : doc(db, 'replies', id)
    if (type === "comments") {
      const results = await getDoc(docRef);
      results?.data()?.repliedComment?.map(async(replyId: any) => {
        const replyRef = doc(db, 'replies', replyId);
        await deleteDoc(replyRef);
      })
    } else {
      const result = await getDoc(docRef);
      const commentRef = doc(db, 'comments', result?.data()?.commentId)
      if (commentRef) {
        const commentResult = await getDoc(commentRef);
        const repliedComment = commentResult?.data()?.repliedComment?.filter((item: string) => item !== id);
        await updateDoc(commentRef, {
          repliedComment: repliedComment,
        });
      }
    }
    await deleteDoc(docRef);
    return true;
  } catch (e) {
    throw e;
  }
};

export const updateEntry = async (
  id: string,
  comment: string,
  type: string
): Promise<boolean> => {
  try {
    const docRef = type === "comments" ? doc(db, 'comments', id) : doc(db, 'replies', id)
    await updateDoc(docRef, {
      comment: comment,
    });
    return true;
  } catch (e) {
    throw e;
  }
};

export const upVote = async (
  id: string,
  upVotes: string[]
): Promise<boolean> => {
  try {
    const docRef = doc(db, 'comments', id);
    await updateDoc(docRef, {
      upvotes: upVotes,
    });
    return true;
  } catch (e) {
    throw e;
  }
};

export const addReply = async (
  commentId: string,
  name: string,
  comment: string,
  repliedComment: string[],
  profileImage:string,
  id:string,
): Promise<boolean> => {
  try {
    let ref = await addDoc(replyCollection, {
      commentId: commentId,
      upvotes: [],
      comment: comment,
      name: name,
      date: new Date(),
      profileImage:profileImage,
      userId:id
    });
    const docRef = doc(db, 'comments', commentId);
    await updateDoc(docRef, {
      repliedComment: [...repliedComment, ref.id],
    });
    return true;
  } catch (e) {
    throw e;
  }
};

export const fetchReplies = async (
  commentId: string
): Promise<commentType[]> => {
  try {
    const q = query(
      collection(db, 'replies'),
      where('commentId', '==', commentId),
      orderBy("date", "asc")
    );
    const results = await getDocs(q);
    let replies = results.docs.map((doc) => {
      return { ...doc.data(), commentId: doc.id }  as commentType;
    });
    return replies;
  } catch (e) {
    throw e;
  }
};

export const upVoteReply = async (
  id: string,
  upVotes: string[]
): Promise<boolean> => {
  try {
    const docRef = doc(db, 'replies', id);
    await updateDoc(docRef, {
      upvotes: upVotes,
    });
    return true;
  } catch (e) {
    throw e;
  }
};
