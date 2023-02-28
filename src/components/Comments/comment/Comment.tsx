import React, { useCallback, useEffect, useState } from "react";

// components
import InputAction from "../../Comments/inputAction";
import Spinner from "../../common/spinner";
import TextArea from "../../common/textArea";

// apis
import {
  addReply,
  fetchReplies,
  upVoteReply,
  deleteEntry,
  updateEntry,
} from "../../../database/comment";

// libraries
import classNames from "classnames";

// styles
import styles from "./styles.module.scss";

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
  submitReply
}: Props) => {
  const { commentId,
    name = "",
    comment = "",
    upvotes = [],
    repliedComment = [], userId, profileImage } = commentData
  const [replyText, setReplyText] = useState<string>("");
  const [fetchedReplies, setFetchedReplies] = useState<commentType[]>([]);
  const [showReplies, setReplies] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const auth = getAuth();

  const [commentText, setCommentText] = useState<string>("");

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



  const submitAReply = useCallback(async () => {
    try {
      submitReply && submitReply(commentId, replyText, repliedComment)
      setReplyText("");
      await getReplies();
    } catch (error) {
      console.error(error);
    }
  }, [submitReply, commentId, replyText, repliedComment, getReplies]);

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

  useEffect(() => {
    getReplies();
  }, [getReplies]);

  const submitUpvote = useCallback(
    async (id: string, upvotes: string[]) => {
      let foundItem = upvotes.find((id) => id === userId);
      let votes = upvotes;
      if (!foundItem) {
        votes.push(userId);
        await upVoteReply(id, votes);
      }
      getReplies();
    },
    [getReplies, userId]
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
    updateEntry(commentId, commentText, showReplySection ? "comments" : "replies");
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

        {auth?.currentUser?.email === name ? (
          <TextArea
            handleChange={handleCommentChange}
            onSave={onSave}
            onCancel={() => setCommentText(comment)}
            value={commentText}
            defaultValue={comment}
            maxCharacters={600}
            disabled={auth?.currentUser?.email !== name}
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
  }, [auth?.currentUser?.email, auth?.currentUser?.uid, comment, commentDelete, commentText, deleteLoading, handleCommentChange, name, onSave, userId]);

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
  }, [actionItems, commentSection, fetchedReplies, handleChange, loading, replyText, showReplies, submitAReply, submitReply, submitUpvote]);

  return (
    <div className={styles["container"]} key={key}>
      <div className={styles["image_container"]}>
        <div className={styles["image_container_image"]}>
          <Avatar source={profileImage} sizes={AvatarSize.SMALLER} />
        </div>
      </div>
      {commentBox()}
    </div>
  );
};

export default Comment;
