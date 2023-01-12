import React from 'react';
import { useParams } from 'react-router-dom';
import { useAsync } from '../hooks/useAsync';
import { getPost } from '../api/posts';
import { useContext, useMemo, useState, useEffect } from 'react';
import { usePostList } from './PostListContext';
import {
  PostContextType,
  CommentGroup,
  CommentType,
  ChildrenProps,
} from '../types/types';

type IdParams = {
  id: string;
};

const PostContext = React.createContext<Partial<PostContextType>>({});

export function usePost() {
  return useContext(PostContext);
}

export function PostProvider({ children }: ChildrenProps) {
  const { id } = useParams<IdParams>();
  const { posts } = usePostList();
  const { value: post } = useAsync(() => getPost(id), [id, posts]);
  const [comments, setComments] = useState<CommentType[]>([]);

  //group comments by parent id
  const commentsByParentId = useMemo(() => {
    // below is causing issues with getReplies function, as parentId can't be used as a key in an empty array
    // if (comments == null) return []
    const group: CommentGroup = {};
    comments.forEach((comment) => {
      //assigns group[parentId] to [] if right side is falsy i.e. first of that parentId in loop
      if (comment.parentId) {
        group[comment.parentId] ||= [];
        group[comment.parentId].push(comment);
      }
    });
    return group;
  }, [comments]);

  const getReplies = (parentId: string) => {
    return commentsByParentId[parentId as keyof CommentGroup];
  };

  const createLocalComment = (comment: CommentType) => {
    setComments((prevComments) => {
      return [comment, ...prevComments];
    });
  };

  const updateLocalComment = (id: string, message: string) => {
    setComments((prevComments) => {
      return prevComments.map((comment: CommentType) =>
        comment.id == id ? { ...comment, message } : comment
      );
    });
  };

  const deleteLocalComment = (id: string) => {
    setComments((prevComments) => {
      return prevComments.filter((comment) => comment.id !== id);
    });
  };

  const toggleLocalCommentLike = (id: string, addLike: boolean) => {
    setComments((prevComments) => {
      return prevComments.map((comment) => {
        if (id == comment.id) {
          if (addLike) {
            return {
              ...comment,
              likeCount: comment.likeCount + 1,
              likedByMe: true,
            };
          } else {
            return {
              ...comment,
              likeCount: comment.likeCount - 1,
              likedByMe: false,
            };
          }
        } else {
          return comment;
        }
      });
    });
  };
  useEffect(() => {
    if (post?.comments == null) return;
    setComments(post.comments);
  }, [post?.comments]);

  return (
    <PostContext.Provider
      value={{
        post: {
          id,
          ...post,
        },
        rootComments: commentsByParentId['null'],
        getReplies,
        createLocalComment,
        updateLocalComment,
        deleteLocalComment,
        toggleLocalCommentLike,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}
