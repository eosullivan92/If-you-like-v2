/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CommentType, CommentProps } from '../types/types';
import { CommentForm } from './CommentForm';
import { useState } from 'react';
import { usePost } from '../context/PostContext';
import { FaHeart, FaReply, FaEdit, FaTrash, FaRegHeart } from 'react-icons/fa';
import { IconBtn } from './IconButton';
import CommentList from './CommentList';
// import { useUser } from '../hooks/useUser'
import { useAsyncFn } from '../hooks/useAsync';
import {
  createComment,
  deleteComment,
  toggleCommentLike,
  updateComment,
} from '../api/comments';

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export default function Comment({
  id,
  message,
  user,
  createdAt,
  likeCount,
  likedByMe,
}: CommentProps) {
  const [areChildrenHidden, setAreChildrenHidden] = useState<boolean>(false);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [isEditingComment, setIsEditingComment] = useState<boolean>(false);
  const {
    post,
    getReplies,
    createLocalComment,
    updateLocalComment,
    deleteLocalComment,
    toggleLocalCommentLike,
  } = usePost();
  const childComments = getReplies!(id);
  //   const currentUser = useUser();
  const createCommentFn = useAsyncFn(createComment);
  const updateCommentFn = useAsyncFn(updateComment);
  const deleteCommentFn = useAsyncFn(deleteComment);
  const toggleCommentLikeFn = useAsyncFn(toggleCommentLike);

  const onCommentReply = (message: string) => {
    return createCommentFn
      .execute({
        postId: post!.id,
        message,
        parentId: id,
      })
      .then((comment: CommentType) => {
        setIsReplying(false);
        createLocalComment!(comment);
      });
  };

  const onCommentUpdate = (message: string) => {
    return updateCommentFn
      .execute({ postId: post!.id, message, id })
      .then((comment: CommentType) => {
        if (comment) {
          setIsEditingComment(false);
          updateLocalComment!(id, comment.message);
        }
      });
  };

  const onCommentDelete = () => {
    return deleteCommentFn
      .execute({ postId: post!.id, id })
      .then(({ id }: { id: string }) => {
        deleteLocalComment!(id);
      });
  };

  const ontoggleCommentLike = () => {
    return toggleCommentLikeFn
      .execute({ postId: post!.id, id })
      .then(({ addLike }: { addLike: boolean }) =>
        toggleLocalCommentLike!(id, addLike)
      );
  };
  return (
    <>
      <div className="comment" data-testid="comment">
        <div className="header">
          <span className="name">{user.name}</span>
          <span className="date">
            {dateFormatter.format(Date.parse(createdAt))}
          </span>
        </div>

        {isEditingComment ? (
          <CommentForm
            autoFocus
            onSubmit={onCommentUpdate}
            loading={updateCommentFn.loading}
            error={updateCommentFn.error}
            initialValue={message}
          />
        ) : (
          <div className="message">{message}</div>
        )}
        <div className="footer">
          <IconBtn
            Icon={likedByMe ? FaHeart : FaRegHeart}
            aria-label={likedByMe ? 'Unlike' : 'Like'}
            onClick={ontoggleCommentLike}
            disabled={toggleCommentLikeFn.loading}
          >
            {likeCount}
          </IconBtn>
          <IconBtn
            Icon={FaReply}
            aria-label="reply"
            onClick={() => setIsReplying((prev) => !prev)}
            isActive={isReplying}
          />
          {/* {user.id === currentUser.id && ( */}
          <>
            <IconBtn
              Icon={FaEdit}
              aria-label="edit"
              onClick={() => setIsEditingComment((prev) => !prev)}
              isActive={isEditingComment}
            />
            <IconBtn
              Icon={FaTrash}
              aria-label="delete"
              onClick={onCommentDelete}
              color="danger"
            />
          </>
          {/* )} */}
          {deleteCommentFn.error && (
            <div className="error-msg mt-1">{deleteCommentFn.error}</div>
          )}
        </div>
        {isReplying && (
          <div className="mt-1 ml-3">
            <CommentForm
              autoFocus
              onSubmit={onCommentReply}
              loading={createCommentFn.loading}
              error={createCommentFn.error}
            />
          </div>
        )}
        {childComments?.length > 0 && (
          <>
            {!areChildrenHidden && (
              <div
                className={`nested-comment-stack ${
                  areChildrenHidden ? 'hide' : ''
                }`}
              >
                <button
                  className="collapse-line"
                  area-label="Hide Replies"
                  onClick={() => setAreChildrenHidden(true)}
                ></button>
                <div className="nested-comments">
                  <CommentList comments={childComments} />
                </div>
              </div>
            )}
            <button
              className={`btn mt1 ${!areChildrenHidden ? 'hide' : ''}`}
              onClick={() => setAreChildrenHidden(false)}
            >
              Show Replies
            </button>
          </>
        )}
      </div>
    </>
  );
}
