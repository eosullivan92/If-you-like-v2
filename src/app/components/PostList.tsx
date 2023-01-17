/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FaRegHeart, FaHeart, FaRegCommentAlt } from 'react-icons/fa';
import { IconBtn } from './IconButton';
import { usePostList } from '../context/PostListContext';
import { PostForm } from './PostForm';
import { PostTitleType } from '../types/types';
import { useAsyncFn } from '../hooks/useAsync';
import { createPost, togglePostLike } from '../api/posts';

export const PostList = () => {
  const {
    loading,
    error,
    posts,
    createLocalPost,
    createPostActive,
    handleCreatePostActive,
    toggleLocalPostLike,
  } = usePostList();
  const createPostFn = useAsyncFn(createPost);
  const togglePostLikeFn = useAsyncFn(togglePostLike);
  if (loading) return <h1>Loading</h1>;
  if (error) return <h1 className="error">Error</h1>;

  const onPostCreate = (title: string, body: string) => {
    return createPostFn.execute({ title, body }).then((post: PostTitleType) => {
      createLocalPost!(post);
      handleCreatePostActive!();
    });
  };

  const onTogglePostLike = (id: string) => {
    return togglePostLikeFn
      .execute(id)
      .then(({ addLike }: { addLike: boolean }) => {
        toggleLocalPostLike!(id, addLike);
      });
  };

  return (
    <>
      <button className="btn" onClick={handleCreatePostActive}>
        + Create Post
      </button>
      <PostForm
        onSubmit={onPostCreate}
        loading={createPostFn.loading}
        error={createPostFn.error!}
        autoFocus
        createPostActive={createPostActive}
        handleCreatePostActive={handleCreatePostActive}
      />
      {posts?.map((post: PostTitleType) => {
        return (
          <div className="post-title" key={post.id}>
            <h1>
              <a href={`/posts/${post.id}`}>{post.title}</a>
            </h1>
            <div className="footer">
              <IconBtn
                Icon={post.likedByMe ? FaHeart : FaRegHeart}
                aria-label="Like"
                onClick={() => onTogglePostLike(post.id)}
                disabled={togglePostLikeFn.loading}
              >
                {post?.likeCount}
              </IconBtn>
              <IconBtn Icon={FaRegCommentAlt} aria-label="comment count">
                {post?.comments.length || 0} comments
              </IconBtn>
            </div>
          </div>
        );
      })}
    </>
  );
};
