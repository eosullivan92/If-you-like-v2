/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useNavigate, Link } from 'react-router-dom';
import { createComment } from '../api/comments';
import { usePost } from '../context/PostContext';
import { useAsyncFn } from '../hooks/useAsync';
import CommentList from './CommentList';
import { CommentForm } from './CommentForm';
import { deletePost, updatePost } from '../api/posts';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { IconBtn } from './IconButton';
import { PostForm } from './PostForm';
import { usePostList } from '../context/PostListContext';
import { PostType } from '../types/types';

export const Post = () => {
  const navigate = useNavigate();
  const { post, rootComments, createLocalComment } = usePost();
  const {
    deleteLocalPost,
    updateLocalPost,
    createPostActive,
    handleCreatePostActive,
  } = usePostList();
  const {
    loading,
    error,
    execute: createCommentFn,
  } = useAsyncFn(createComment);
  const deletePostFn = useAsyncFn(deletePost);
  const updatePostFn = useAsyncFn(updatePost);

  const onCommentCreate = (message: string) => {
    return createCommentFn({ postId: post!.id, message }).then(
      createLocalComment
    );
  };

  const onPostDelete = () => {
    return deletePostFn.execute(post!.id).then(({ id }: { id: string }) => {
      deleteLocalPost!(id);
      navigate('/');
    });
  };

  const onPostUpdate = (title: string, body: string) => {
    return updatePostFn
      .execute({ id: post!.id, title, body })
      .then((post: PostType) => {
        updateLocalPost!(post);
      })
      .then(() => {
        console.log(post);
        handleCreatePostActive!();
      });
  };

  return (
    <>
      <div className="post">
        <button className="btn">
          <Link to="/">Back to all posts</Link>
        </button>
        {createPostActive && (
          <PostForm
            loading={updatePostFn.loading}
            error={updatePostFn.error!}
            onSubmit={onPostUpdate}
            autoFocus
            createPostActive={createPostActive}
            handleCreatePostActive={handleCreatePostActive}
            initialValue={post}
          />
        )}
        <div className="post-content">
          <h1>{post?.title}</h1>
          <article>{post?.body}</article>
        </div>
        <div className="footer">
          <IconBtn
            Icon={FaEdit}
            aria-label="edit"
            onClick={handleCreatePostActive}
          />
          <IconBtn
            Icon={FaTrash}
            aria-label="delete"
            onClick={onPostDelete}
            color="danger"
          />
        </div>
        <h3 className="comments-title">Comments:</h3>

        <section>
          <CommentForm
            autoFocus
            loading={loading}
            error={error}
            onSubmit={onCommentCreate}
          />
          {rootComments != null && rootComments.length > 0 && (
            <div className="mt-4">
              <CommentList comments={rootComments} />
            </div>
          )}
        </section>
      </div>
    </>
  );
};
