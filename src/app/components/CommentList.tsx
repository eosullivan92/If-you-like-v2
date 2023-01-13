import Comment from './Comment';
import { CommentListProps } from '../types/types';

export default function CommentList(props: CommentListProps) {
  return (
    <>
      {props.comments.map((comment) => (
        <div key={comment.id} className="comment-stack">
          <Comment
            id={comment.id}
            createdAt={comment.createdAt}
            message={comment.message}
            user={comment.user}
            likeCount={comment.likeCount}
            likedByMe={comment.likedByMe}
          />
        </div>
      ))}
    </>
  );
}
