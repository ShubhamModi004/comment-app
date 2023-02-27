export interface Props {
  id: string;
  name: string;
  comment: string;
  upvotes: string[];
  repliedComment?: string[];
  showReplySection?: boolean;
  reply?: () => void;
  upvote?: () => void;
  userName?: string;
  userId?: string;
  key: string;
}
