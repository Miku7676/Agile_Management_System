import React, { useState } from 'react';
import '../css/Comment.css';

function Comment() {
  const [comments, setComments] = useState([
    "Lorem ipsum dolor sit amet.hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhloremefdjfkffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    "Consectetur adipisicing elit.",
    "Repudiandae soluta fugiat non distinctio.",
    "Lorem ipsum dolor sit amet.",
    "Consectetur adipisicing elit.",
    "Repudiandae soluta fugiat non distinctio.",
    "Lorem ipsum dolor sit amet.",
    "Consectetur adipisicing elit.",
    "Repudiandae soluta fugiat non distinctio.",
    "Lorem ipsum dolor sit amet.",
    "Consectetur adipisicing elit.",
    "Repudiandae soluta fugiat non distinctio.",
    "Lorem ipsum dolor sit amet.",
    "Consectetur adipisicing elit.",
    "Repudiandae soluta fugiat non distinctio.",
    "Lorem ipsum dolor sit amet.",
    "Consectetur adipisicing elit.",
    "Repudiandae soluta fugiat non distinctio.",
    "Lorem ipsum dolor sit amet.",
    "Consectetur adipisicing elit.",
    "Repudiandae soluta fugiat non distinctio.",
    "Lorem ipsum dolor sit amet.",
    "Consectetur adipisicing elit.",
    "Repudiandae soluta fugiat non distinctio.",
    "Lorem ipsum dolor sit amet.",
    "Consectetur adipisicing elit.",
    "Repudiandae soluta fugiat non distinctio.",
    "Lorem ipsum dolor sit amet.",
    "Consectetur adipisicing elit.",
    "Repudiandae soluta fugiat non distinctio.",
    
  ]);
  const [newComment, setNewComment] = useState('');

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments([...comments, newComment]);
      setNewComment('');
    }
  };

  return (
    <div className='comment-section'>
      <div className='comments-list'>
        {comments.map((comment, index) => (
          <div key={index} className='comment'>{comment}</div>
        ))}
      </div>
      <form className='commentbox' onSubmit={handleCommentSubmit}>
        <textarea
          value={newComment}
          onChange={handleCommentChange}
          placeholder='Write a comment...'
          rows={3}
        ></textarea>
        <button type='submit'>Post</button>
      </form>
    </div>
  );
}

export default Comment;
