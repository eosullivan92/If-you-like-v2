import React, { useState } from 'react';
import { CommentFormProps } from '../types/types';

export function CommentForm({
  loading,
  error,
  onSubmit,
  autoFocus = false,
  initialValue = '',
}: CommentFormProps) {
  const [message, setMessage] = useState<string>(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(message).then(() => setMessage(''));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="comment-form-row">
        <textarea
          autoFocus={autoFocus}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="message-input"
          aria-label="text-input"
        />
        <button className="btn" disabled={loading} aria-label="submit-btn">
          {loading ? 'Loading' : 'Post'}
        </button>
      </div>
      <div className="error-msg">{error}</div>
    </form>
  );
}
