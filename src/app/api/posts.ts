import { makeRequest } from './makeRequest';
import { PostFormType, PostType } from '../types/types';

export function getPosts() {
  return makeRequest('posts');
}

export function getPost(id: string) {
  return makeRequest(`posts/${id}`);
}

export function createPost(post: PostFormType) {
  return makeRequest('/posts', {
    method: 'POST',
    data: post,
  });
}

export function deletePost(id: string) {
  return makeRequest(`/posts/${id}`, {
    method: 'DELETE',
  });
}

export function updatePost({ id, title, body }: PostType) {
  return makeRequest(`/posts/${id}`, {
    method: 'PUT',
    data: { title, body },
  });
}

export function togglePostLike(id: string) {
  return makeRequest(`posts/${id}/toggleLike`, { method: 'POST' });
}
