export type commentType ={
  commentId: string;
  comment: string;
  date: Date;
  name: string;
  repliedComment?: string[];
  upvotes: string[];
  profileImage?:string;
  userId:string;
  y?: number;
}

export interface userType{
  email: string;
  id: string;
  name: string;
  profileImage: string;
}