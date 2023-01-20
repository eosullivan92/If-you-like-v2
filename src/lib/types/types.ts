// GET POSTS

// export type PrismaPost = {
//   id: string;
//   title: string;
//   body: string;
//   createdAt: Date;
//   updatedAt: Date;
//   comments: PrismaComment[];
//   user?: PrismaUser;
//   userId: string;
//   likes: PrismaPostLike[];
//   _count?: { likes: number };
// };

export type PrismaPost = {
  id: string;
  title: string;
  body?: string;
  comments: PrismaComment[];
  _count?: { likes: number };
  likedByMe?: boolean;
  likeCount?: number;
};

export type PrismaComment = {
  id: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  user?: PrismaUser;
  userId: string;
  post?: PrismaPost;
  postId: string;
  parent?: PrismaComment;
  children?: PrismaComment[];
  parentId?: string;
  likes?: PrismaCommentLike[];
  _count?: { likes: number };
};

export type PrismaUser = {
  id: string;
  name: string;
  comments: PrismaComment[];
  commentLikes: PrismaCommentLike[];
  posts: PrismaPost[];
  postLike: PrismaPostLike[];
};

export type PrismaCommentLike = {
  user: PrismaUser;
  comment: PrismaComment;
  userId: string;
  commentId: string;
};

export type PrismaPostLike = {
  user: PrismaUser;
  post: PrismaPost;
  userId: string;
  postId: string;
};
