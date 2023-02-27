export interface commentType {
  commentId: string;
  comment: string;
  date: Date;
  name: string;
  repliedComment?: string[];
  upvotes: string[];
}
