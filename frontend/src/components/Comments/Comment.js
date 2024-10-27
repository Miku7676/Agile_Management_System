import React, { useEffect, useState, useCallback } from 'react';
import '../css/Comment.css';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

function Comment() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { projectId } = useParams();
  const [userId,setUserId] = useState();
  const location = useLocation();


  useEffect(() => {
    const tkn = localStorage.getItem('token')
    tkn && setUserId(JSON.parse(atob(tkn.split('.')[1])).userId);
  }, [location]);

  const fetchComments = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found in localStorage. Please log in again.');
        window.location.reload();
      }

      const response = await axios.get(`http://localhost:5000/api/project/${projectId}/comment`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setComments(response.data.result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  },[projectId]);

  useEffect(() => {
    if (projectId) {
      fetchComments();
    }
  }, [projectId, fetchComments]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  // if (!comments.length) return 

  console.log(comments);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };


  // const handleCommentSubmit = (e) => {
  //   e.preventDefault();
  //   if (newComment.trim()) {
  //     const newCommentObject = {
  //       COMMENT_ID: Date.now(),
  //       CONTENT: newComment,
  //       TIMESTAMP: new Date().toISOString(),
  //       USERNAME: 'current_user', // Replace with actual username
  //       USER_ID: 'current_user_id', // Replace with actual user ID
  //     };
  //     setComments([...comments, newCommentObject]);
  //     setNewComment('');
  //   }
  // };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      // const newCommentObject = {
      //   CONTENT: newComment,
      //   TIMESTAMP: new Date().toISOString(),
      //   USERNAME: 'current_user', // Replace with actual username
      //   USER_ID: 'current_user_id', // Replace with actual user ID
      // };

      // Make a POST request to save the new comment
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('No token found in localStorage. Please log in again.');
          window.location.reload();
        }

        await axios.post(`http://localhost:5000/api/project/${projectId}/comment/postcom`, {
          content : newComment
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        // Fetch updated comments
        fetchComments();
        setNewComment(''); // Clear the input
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className='comment-section'>
      {!comments.length ? (
        <div className="error">No comments yet</div>
      ):(
      <div className='comments-list'>
        {comments.map((comment) => (
          <div key={comment.COMMENT_ID} >
            {(comment.USER_ID === userId)?(
            <div className="comment" style={{backgroundColor: '#41c04b'}}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <strong>You ({comment.USER_ID})</strong>
                <strong style={{ marginLeft: 'auto', fontSize:'12px' }}>{new Date(comment.TIMESTAMP).toLocaleString()}</strong>
              </div>
              {comment.CONTENT}
            </div>
          ):(
            <div className="comment">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <strong>{comment.USERNAME} ({comment.USER_ID})</strong>
                <strong style={{ marginLeft: 'auto', fontSize:'12px' }}>{new Date(comment.TIMESTAMP).toLocaleString()}</strong>
              </div>
              {comment.CONTENT}
            </div>
          )}
          </div>
        ))}
      </div>
      )}
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
