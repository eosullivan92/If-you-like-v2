/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useState } from 'react';
import { PostFormProps, PostFormType } from '../types/types';

export const PostForm = ({
  loading,
  error,
  onSubmit,
  autoFocus,
  createPostActive,
  handleCreatePostActive,
  initialValue = { title: '', body: '' },
}: PostFormProps) => {
  const [postInput, setPostInput] = useState<PostFormType>(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(postInput.title, postInput.body).then(() => {
      setPostInput({
        title: '',
        body: '',
      });
    });
  };

  const handleClose = () => {
    handleCreatePostActive!();
    setPostInput({
      title: '',
      body: '',
    });
  };

  return (
    <div className={`post-form-modal ${createPostActive ? '' : 'hide'}`}>
      <div className="modal-header">
        <h2>Create Post</h2>
        <button onClick={() => handleClose()}>&times;</button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-input-control">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Title"
            autoFocus={autoFocus}
            onChange={(e) =>
              setPostInput({
                ...postInput,
                title: e.target.value,
              })
            }
            value={postInput.title}
          />
        </div>
        <div className="form-input-control">
          <label htmlFor="post">Post:</label>
          <textarea
            onChange={(e) =>
              setPostInput({
                ...postInput,
                body: e.target.value,
              })
            }
            id="post"
            name="post"
            placeholder="Post"
            className="message-input"
            aria-label="text-input"
            value={postInput.body}
          />
        </div>
        <button className="btn" disabled={loading} aria-label="submit-btn">
          {loading ? 'Loading' : 'Post'}
        </button>
        <div className="error-msg">{error}</div>
      </form>
    </div>
  );
};
