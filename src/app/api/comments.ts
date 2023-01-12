import { makeRequest } from './makeRequest';

type CommentData = {
  postId: string;
  message?: string;
  parentId?: string;
  id?: string;
};

export function createComment({ postId, message, parentId }: CommentData) {
  return makeRequest(`posts/${postId}/comments`, {
    method: 'POST',
    data: { message, parentId },
  });
}

export function updateComment({ postId, message, id }: CommentData) {
  return makeRequest(`posts/${postId}/comments/${id}`, {
    method: 'PUT',
    data: { message },
  });
}

export function deleteComment({ postId, id }: CommentData) {
  return makeRequest(`posts/${postId}/comments/${id}`, { method: 'DELETE' });
}

export function toggleCommentLike({ postId, id }: CommentData) {
  return makeRequest(`posts/${postId}/comments/${id}/toggleLike`, {
    method: 'POST',
  });
}
