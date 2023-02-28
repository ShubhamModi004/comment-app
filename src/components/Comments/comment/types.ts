import { commentType } from "../../../database/types";

export interface Props {
  commentData: commentType;
  showReplySection?: boolean;
  reply?: () => void;
  upvote?: () => void;
  key: string;
  submitReply?:(commentId: string, replyText: string, repliedComment: string[])=>void;
}
