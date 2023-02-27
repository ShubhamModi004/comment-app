import React, { useCallback, useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// styles
import styles from "./styles.module.scss";
//components
import Comment from "../../components/Comments/comment";
import InputAction from "../../components/Comments/inputAction";
import Navbar from "../../components/common/navbar";

// apis
import { addComment, fetchComments, upVote } from "../../database/comment";

// types
import { commentType } from "../../database/types";
//fiebase
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";

import { db } from "../../config/firebase";

const CommentSection = (props: any): JSX.Element => {
  const navigation = useNavigate();
  const { state } = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<commentType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    try {
      setLoading(true);
      const auth = getAuth();
      auth.currentUser?.email === "" && navigation("/");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      navigation("/");
    }
  }, [navigation, state?.name]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      await signOut(auth);
      navigation("/");
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, [navigation]);

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
      await addComment(state?.name, comment);
      setComment("");
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [comment, state?.name]);

  const submitUpvote = useCallback(
    async (id: string, upvotes: string[]) => {
      let foundItem = upvotes.find((id) => id === state?.id);
      let votes = upvotes;
      if (!foundItem) {
        votes.push(state?.id);
        await upVote(id, votes);
      }
    },
    [state?.id]
  );

  const commentSection = useCallback(() => {
    return (
      <div className={styles["comments"]}>
        {comments.map((comment) => (
          <Comment
            key={comment.commentId}
            name={comment?.name}
            comment={comment?.comment}
            upvotes={comment?.upvotes}
            repliedComment={comment?.repliedComment}
            id={comment?.commentId}
            upvote={() => {
              submitUpvote(comment?.commentId, comment?.upvotes);
            }}
            userName={state?.name}
            userId={state?.id}
          />
        ))}
      </div>
    );
  }, [comments, state?.id, state?.name, submitUpvote]);

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
