import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import RsvpButton from "./rsvp-button";

export default function CommentBlock({eventData}) {
    const [commentData, setCommentData] = useState(eventData.comments);
    const [textE, setTextE] = useState("")
    const [, setEnteredComment] = useState(null);
    const [username, setUsername] = useState(null);

    useEffect(() => {
        // Fetch the session info from your Flask API
        fetch('/api/v1/userinfo')
            .then(response => response.json())
            .then(data => setUsername(data.username));
    }, []);

    const handleInputChange = (event) => {
        setTextE(event.target.value);
        console.log(event.target.value);
    }

    const handleCommentDelete = (commentId) => {
        console.log(`Deleting comment with ID: ${commentId}`); // Debugging
    
        fetch(`/api/v1/comments/${commentId}`, { // Corrected URL
            method: 'DELETE',
            credentials: 'same-origin',
        })
        .then(response => {
            if (response.status === 204) {
                setCommentData(commentData => commentData.filter(comment => comment.commentid !== commentId));
                console.log('Comment deleted successfully.');
            } else if (response.status === 403) {
                alert('Cannot delete: You do not own this comment.');
            } else if (response.status === 404) {
                alert(`Comment not found: ${commentId}`);
            } else {
                alert('An error occurred. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error deleting comment:', error);
        });
    };

    const handleCommentPost = (event) => {
        console.log("posting comment: ", textE)
        event.preventDefault(); // Prevent default form submit action
        

        // Assuming you have the eventid passed down to this component
        const eventid = eventData.eventid;

        // Prepare your comment in the format the API expects
        const comment = {
        text: textE
        };

        // Use fetch API to post the comment
        fetch(`/api/v1/comments/?eventid=${eventid}`, {
        method: 'POST',
        credentials: 'same-origin', // for cookies, if needed
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(comment)
        })
        .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
        })
        .then(data => {
            console.log('Comment created:', data);
            // Add the new comment to the commentData state to update the UI
            setCommentData([...commentData, data]);
            // Reset the comment input field
            setTextE('');
        })
        .catch(error => {
        console.log('Error posting comment:', error);
    });
        
    }

    const commentList = commentData.map((comment) => (
        <div key={comment.commentid} className="comment-box">
            <div className="comment-content">
                <p className="comment-owner"><a href={`/users/${comment.owner}`}>{comment.owner}</a></p>
                <p className="comment-text">{comment.text}</p>
            </div>
            {username === comment.owner && ( 
                <button onClick={() => handleCommentDelete(comment.commentid)} className="delete-button">
                    Delete Comment
                </button>
            )}           
        </div>
    ));


    return (
        <div>
            <form data-testid="comment-form" onSubmit={handleCommentPost} className="comment-form">
            <textarea 
                placeholder="Leave a comment..."
                value={textE}
                onChange={handleInputChange}
                className="comment-input"
            />
            <button type="submit" className="submit-comment">Submit</button>
            </form>
            <div className="comments-list">{commentList}</div>
        </div>
    );
}