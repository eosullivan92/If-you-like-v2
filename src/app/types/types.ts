import { IconType } from 'react-icons/lib';

//CONTEXT TYPES
export type PostListContextType = {
  posts: PostTitleType[];
  loading: boolean;
  error: string;
  createPostActive: boolean;
  handleCreatePostActive: () => void;
  createLocalPost: (post: PostTitleType) => void;
  updateLocalPost: (post: PostType) => void;
  deleteLocalPost: (id: string) => void;
  toggleLocalPostLike: (id: string, addLike: boolean) => void;
};
export type PostContextType = {
  post: PostType;
  rootComments: CommentType[];
  getReplies: (parentId: string) => CommentType[] | [];
  createLocalComment: (comment: CommentType) => void;
  updateLocalComment: (id: string, comment: string) => void;
  deleteLocalComment: (id: string) => void;
  toggleLocalCommentLike: (id: string, addLike: boolean) => void;
};

// POST TYPES
export type PostType = {
  id: string;
  title: string;
  body: string;
  comments?: CommentType[];
};

export type PostTitleType = {
  id: string;
  title: string;
  comments: Comment[];
  likeCount: number;
  likedByMe: boolean;
};

export type PostFormType = {
  title: string;
  body: string;
};

export type PostListType = PostTitleType[] | undefined;

//COMMENT TYPES
export type CommentType = {
  id: string;
  message: string;
  parentId?: string;
  createdAt: string;
  user: User;
  likeCount: number;
  likedByMe: boolean;
};

export type CommentGroup = {
  [key: string]: CommentType[];
};

// USER
export type User = {
  id: string;
  name: string;
};

// Props
export type CommentProps = {
  id: string;
  message: string;
  user: User;
  createdAt: string;
  likeCount: number;
  likedByMe: boolean;
};

export type CommentFormProps = {
  loading: boolean;
  error: string;
  onSubmit: (message: string) => Promise<CommentType>;
  autoFocus: boolean;
  initialValue?: string;
};

export type ChildrenProps = {
  children: React.ReactNode;
};

export type CommentListProps = {
  comments: CommentType[];
};

export type IconBtnProps = {
  Icon: IconType;
  isActive?: boolean;
  color?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
};

export type PostFormProps = {
  loading: boolean;
  error: string;
  onSubmit: (title: string, body: string) => Promise<PostFormType>;
  autoFocus: boolean;
  createPostActive?: boolean;
  handleCreatePostActive?: () => void;
  initialValue?: PostFormType;
};

//Promise (Server)
export type PromiseResponse = PostType[] | PostTitleType[] | null;
