export interface replyType {
  commentId: string;
  id: string;
  name: string;
  comment: string;
  upvotes: string[];
  upvote?: () => void;
}
