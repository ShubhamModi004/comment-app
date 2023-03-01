import React, { useCallback, useEffect, useState } from "react";

// firebase
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "../../../config/firebase";

// components
import InputAction from "../../Comments/inputAction";
import Spinner from "../../common/spinner";
import TextArea from "../../common/textArea";

// apis
import {
  fetchReplies,
  upVoteReply,
  deleteEntry,
  updateEntry,
} from "../../../database/comment";

// libraries
import classNames from "classnames";

// styles
import styles from "./styles.module.scss";

// animatioms
import { useSpring, animated } from "@react-spring/web";

// types
import { Props } from "./types";
import { commentType } from "../../../database/types";
import { getAuth } from "firebase/auth";
import Avatar, { AvatarSize } from "../../common/Avatar/Avatar";

const Comment = ({
  commentData,
  showReplySection = true,
  upvote,
  key = "",
  submitReply,
}: Props) => {
  const {
    commentId,
    name = "",
    comment = "",
    upvotes = [],
    repliedComment = [],
    userId,
    profileImage,
  } = commentData;
  const [replyText, setReplyText] = useState<string>("");
  const [fetchedReplies, setFetchedReplies] = useState<commentType[]>([]);
  const [showReplies, setReplies] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const auth = getAuth();

  const [commentText, setCommentText] = useState<string>("");

  const [props] = useSpring(
    () => ({
      from: { opacity: 0, transform: "translateY(-40px)" },
      to: { opacity: 1, transform: "translateY(0px)" },
    }),
    []
  );

  const handleCommentChange = useCallback(
    (e: { target: { value: React.SetStateAction<string> } }) => {
      setCommentText(e.target.value);
    },
    []
  );

  useEffect(() => {
    setCommentText(comment);
  }, [comment]);

  const handleChange = useCallback(
    (e: { target: { value: React.SetStateAction<string> } }) => {
      setReplyText(e.target.value);
    },
    []
  );

  const getReplies = useCallback(async () => {
    setLoading(true);
    try {
      let replies = await fetchReplies(commentId);
      setFetchedReplies(replies);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [commentId]);

  useEffect(() => {
    getReplies();
    const q = query(
      collection(db, "replies"),
      where("commentId", "==", commentId),
      orderBy("date", "asc")
    );
    const unsubscribe: any = onSnapshot(q, (querySnapshot) => {
      let tempcomments: commentType[] = [];
      querySnapshot.forEach((doc) => {
        tempcomments.push({
          ...doc.data(),
          commentId: doc.id,
        } as unknown as commentType);
      });
      setFetchedReplies(tempcomments);
    });

    return () => unsubscribe();
  }, [commentId, getReplies]);

  const submitAReply = useCallback(async () => {
    try {
      submitReply && submitReply(commentId, replyText, repliedComment);
      setReplyText("");
    } catch (error) {
      console.error(error);
    }
  }, [submitReply, commentId, replyText, repliedComment]);

  const commentDelete = useCallback(async () => {
    if (deleteLoading) return;
    try {
      setDeleteLoading(true);
      await deleteEntry(commentId, showReplySection ? "comments" : "replies");
      setDeleteLoading(false);
    } catch (error) {
      setDeleteLoading(false);
      console.error(error);
    }
  }, [deleteLoading, commentId, showReplySection]);

  const submitUpvote = useCallback(
    async (id: string, upvotes: string[]) => {
      let foundItem = upvotes.find((id) => id === userId);
      let votes = upvotes;
      if (!foundItem) {
        votes.push(userId);
        await upVoteReply(id, votes);
      }
    },
    [userId]
  );

  const toggleReplies = useCallback(() => {
    setReplies(!showReplies);
  }, [showReplies]);

  const actionItems = useCallback(() => {
    return (
      <div className={styles["action_row"]}>
        <div onClick={upvote} className={styles["row"]}>
          <img
            className={styles["icon"]}
            src={require("../../../assets/images/arrow-up.png")}
            alt="upvote"
          />
          <p>{upvotes.length}</p>
        </div>
        {showReplySection && (
          <div onClick={toggleReplies} className={styles["row"]}>
            <img
              className={classNames(styles["icon"], styles["mr5"])}
              src={require("../../../assets/images/chat.png")}
              alt="chat"
            />
            <p>{repliedComment.length}</p>
          </div>
        )}
      </div>
    );
  }, [
    showReplySection,
    repliedComment.length,
    toggleReplies,
    upvote,
    upvotes.length,
  ]);

  const onSave = useCallback(() => {
    updateEntry(
      commentId,
      commentText,
      showReplySection ? "comments" : "replies"
    );
  }, [commentText, commentId, showReplySection]);

  const commentSection = useCallback(() => {
    return (
      <div className={styles["text_container_box"]}>
        {auth?.currentUser?.uid === userId && (
          <div onClick={commentDelete} className={styles["delete_comment"]}>
            {deleteLoading ? (
              <Spinner />
            ) : (
              <img src={require("../../../assets/images/bin.png")} alt="chat" />
            )}
          </div>
        )}

        <p
          className={classNames(
            styles["subtitle1"],
            styles["text_container_name"]
          )}
        >
          {name}
        </p>

        {auth?.currentUser?.uid === userId ? (
          <TextArea
            handleChange={handleCommentChange}
            onSave={onSave}
            onCancel={() => setCommentText(comment)}
            value={commentText}
            defaultValue={comment}
            maxCharacters={600}
          />
        ) : (
          <p
            className={classNames(
              styles["subtitle2"],
              styles["text_container_comment"]
            )}
          >
            {comment}
          </p>
        )}
      </div>
    );
  }, [
    auth?.currentUser?.uid,
    comment,
    commentDelete,
    commentText,
    deleteLoading,
    handleCommentChange,
    name,
    onSave,
    userId,
  ]);

  const commentBox = useCallback(() => {
    return (
      <div className={styles["text_container"]}>
        {commentSection()}
        {actionItems()}
        {showReplies && (
          <div className={styles["reply_section"]}>
            {fetchedReplies.map((comment) => {
              return (
                <Comment
                  key={comment?.commentId}
                  commentData={comment}
                  upvote={() => {
                    submitUpvote(comment?.commentId, comment?.upvotes);
                  }}
                  showReplySection={false}
                  submitReply={submitAReply}
                />
              );
            })}
            {submitReply && (
              <InputAction
                value={replyText}
                handleChange={handleChange}
                submit={submitAReply}
                loading={loading}
              />
            )}
          </div>
        )}
      </div>
    );
  }, [
    actionItems,
    commentSection,
    fetchedReplies,
    handleChange,
    loading,
    replyText,
    showReplies,
    submitAReply,
    submitReply,
    submitUpvote,
  ]);

  return (
    <animated.div style={props} className={styles["container"]} key={key}>
      <div className={styles["image_container"]}>
        <div className={styles["image_container_image"]}>
          <Avatar source={profileImage} sizes={AvatarSize.SMALLER} />
        </div>
      </div>
      {commentBox()}
    </animated.div>
  );
};

export default Comment;