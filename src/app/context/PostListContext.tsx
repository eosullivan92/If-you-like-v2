import React from 'react';
import { useContext, useState, useEffect } from 'react';
import { useAsync } from '../hooks/useAsync';
import { getPosts } from '../api/posts';
import {
  PostListContextType,
  PostType,
  PostTitleType,
  PostListType,
  ChildrenProps,
} from '../types/types';

const PostListContext = React.createContext<Partial<PostListContextType>>({});

export function usePostList() {
  return useContext(PostListContext);
}

export function PostListProvider({ children }: ChildrenProps) {
  const [createPostActive, setCreatePostActive] = useState<boolean>(false);
  const [posts, setPosts] = useState<PostListType>([]);
  const { loading, error, value: postList } = useAsync(() => getPosts());

  const handleCreatePostActive = () => {
    setCreatePostActive((prev) => !prev);
  };

  const createLocalPost = (post: PostTitleType) => {
    setPosts((prevPosts) => {
      return [post, ...(prevPosts || [])];
    });
  };

  const deleteLocalPost = (id: string) => {
    setPosts((prevPosts) => {
      return prevPosts?.filter((post) => post.id !== id);
    });
  };

  const updateLocalPost = (updatedPost: PostType) => {
    setPosts((prevPosts) => {
      return prevPosts?.map((post) => {
        if (post.id == updatedPost.id) {
          return {
            ...post,
            title: updatedPost.title,
          };
        } else {
          return post;
        }
      });
    });
  };

  const toggleLocalPostLike = (id: string, addLike: boolean) => {
    setPosts((prevPosts) => {
      return prevPosts?.map((post) => {
        if (id === post.id) {
          if (addLike) {
            return {
              ...post,
              likeCount: post.likeCount + 1,
              likedByMe: true,
            };
          } else {
            return {
              ...post,
              likeCount: post.likeCount - 1,
              likedByMe: false,
            };
          }
        } else {
          return post;
        }
      });
    });
  };

  useEffect(() => {
    if (postList === null) return;
    setPosts(postList);
    console.log(postList);
  }, [postList]);

  return (
    <PostListContext.Provider
      value={{
        posts,
        loading,
        error,
        createPostActive,
        handleCreatePostActive,
        createLocalPost,
        deleteLocalPost,
        updateLocalPost,
        toggleLocalPostLike,
      }}
    >
      {children}
    </PostListContext.Provider>
  );
}
