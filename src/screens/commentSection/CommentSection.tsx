import React, { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
// styles
import styles from "./styles.module.scss";
//components
import Comment from "../../components/Comments/comment";
import InputAction from "../../components/Comments/inputAction";
import Navbar from "../../components/common/navbar";

// apis
import { addComment, addReply, fetchComments, upVote } from "../../database/comment";

// types
import { commentType, userType } from "../../database/types";
//fiebase
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";

import { db } from "../../config/firebase";
import { getUserData } from "../../database/user";

const CommentSection = (props: any): JSX.Element => {
  const navigation = useNavigate();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<commentType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<userType | undefined>(undefined);



  const auth = getAuth();

  const fetchUser = useCallback(async (id: string) => {
    try {
      const result: userType = await getUserData(id);
      console.log('result', result);
      setUser(result)
    } catch (error) {
      console.log('error', error);
    }

  }, [])

  useEffect(() => {
    try {
      setLoading(true);
      if (auth.currentUser?.uid) { fetchUser(auth.currentUser?.uid) }
      auth.currentUser?.email === "" && navigation("/");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      navigation("/");
    }
  }, [auth.currentUser?.email, auth.currentUser?.uid, fetchUser, navigation]);



  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await signOut(auth);
      navigation("/");
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, [auth, navigation]);

  const getComments = useCallback(async () => {
    try {
      let comments = await fetchComments();
      setComments(comments);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    const height = messagesEndRef?.current?.scrollHeight || 200;
    messagesEndRef?.current?.animate(
      {
        scrollTop: -height,
      },
      500
    );
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [comments, scrollToBottom]);

  useEffect(() => {
    getComments();
    const q = query(collection(db, "comments"), orderBy("date", "asc"));
    const unsubscribe: any = onSnapshot(q, (querySnapshot) => {
      let tempcomments: commentType[] = [];
      querySnapshot.forEach((doc) => {
        tempcomments.push({
          ...doc.data(),
          commentId: doc.id,
        } as unknown as commentType);
      });
      setComments(tempcomments);
    });

    return () => unsubscribe();
  }, [getComments]);

  const handleChange = useCallback(
    (e: { target: { value: React.SetStateAction<string> } }) => {
      setComment(e.target.value);
    },
    []
  );

  const submitComment = useCallback(async () => {
    setLoading(true);
    try {
      await addComment(auth.currentUser?.email || '', comment, user?.profileImage || '', user?.id || '');
      setComment("");
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [auth.currentUser?.email, comment, user?.id, user?.profileImage]);

  const submitReply = useCallback(async (commentId: string, replyText: string, repliedComment: string[]) => {
    try {
      if (user) {
        await addReply(commentId, user?.name, replyText, repliedComment, user?.profileImage, user?.id);
      }
    } catch (error) {
      console.error(error);
    }
  }, [user]);

  const submitUpvote = useCallback(
    async (id: string, upvotes: string[]) => {
      let foundItem = upvotes.find((id) => id === auth.currentUser?.uid || '');
      let votes = upvotes;
      if (!foundItem) {
        votes.push(auth.currentUser?.uid || '');
        await upVote(id, votes);
      }
    },
    [auth.currentUser?.uid]
  );

  const commentSection = useCallback(() => {
    return (
      <div className={styles["comments"]}>
        {comments.map((comment) => (
          <Comment
            key={comment.commentId}
            commentData={comment}
            upvote={() => {
              submitUpvote(comment?.commentId, comment?.upvotes);
            }}
            submitReply={submitReply}
          />
        ))}
      </div>
    );
  }, [comments, submitReply, submitUpvote]);

  return (
    <>
      <Navbar onLogout={logout} />
      <div className={styles["comment_section"]}>
        <div ref={messagesEndRef} className={styles["container"]}>
          <div className={styles["comment_container"]}>{commentSection()}</div>
        </div>
        <div className={styles["input_section"]}>
          <InputAction
            value={comment}
            handleChange={handleChange}
            submit={submitComment}
            loading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default CommentSection;
