import Comment from "./components/comment";
import Data from "./api/data.json";
import { useState } from "react";
import "./styles/app.css"
import Form from "./components/form";

export default function App() {

    const initiateData = Data[0].comments
    const currentUser = Data.map(user => user.currentUser)
    const [comments, setComments] = useState(initiateData)
    const [replying, setReplying] = useState({})

    const findCommentAndAddReply = (commentsArray, parentId, newReply) => {
        return commentsArray.map((comment) => {
          if (comment.id === parentId) {
            return { ...comment, replies: [...comment.replies, newReply] };
          } else if (comment.replies) {
            return { ...comment, replies: findCommentAndAddReply(comment.replies, parentId, newReply) };
          }
          return comment;
        });
    };

    function editCommentContent(commentId, newContent) {
        setComments((prevComments) => {
            const editCommentRecursive = (commentsArray) => {
                return commentsArray.map((comment) => {
                    if (comment.id === commentId) {
                        // If the current comment matches the commentId, update its content
                        return { ...comment, content: newContent };
                    } else if (comment.replies) {
                        // If the comment has replies, recursively edit the comment content in replies
                        const updatedReplies = editCommentRecursive(comment.replies);
                        return { ...comment, replies: updatedReplies };
                    }
                    return comment;
                });
            };
    
            // Call the recursive function on the top-level comments
            const updatedComments = editCommentRecursive(prevComments);
        
            return updatedComments;
        });
    };

    function deleteComment(commentId) {
        setComments((prevComments) => {
            const deleteCommentRecursive = (commentsArray) => {
                return commentsArray.map((comment) => {
                    if (comment.id === commentId) {
                        // If the current comment matches the commentId, filter it out
                        return undefined;
                    } else if (comment.replies) {
                        // If the comment has replies, recursively delete the comment from replies
                        const updatedReplies = deleteCommentRecursive(comment.replies).filter(Boolean);
                        return { ...comment, replies: updatedReplies };
                    }
                    return comment;
                });
            };
            // Call the recursive function on the top-level comments
            const updatedComments = deleteCommentRecursive(prevComments).filter(Boolean);
            return updatedComments;
        });
    };

    const handleReply = (parentId, replyingTo, message) => {
        const newReply  = { 
            id: Date.now(),
            content: message,
            createdAt: "Just now",
            score: 0,
            replyingTo: replyingTo,
            user: {
                image: { 
                png: currentUser[0].image.png,
                webp: currentUser[0].image.webp
                },
                username: currentUser[0].username
            },
            replies: [],
        };
    
        setComments((prevComments) => findCommentAndAddReply(prevComments, parentId, newReply));
        setReplying(!replying)
    };

    const handleAddComment = (parentId, replyingTo, message) => {
        const newComment = { 
            id: Date.now(),
            content: message,
            createdAt: "Just now",
            score: 0,
            user: {
                image: { 
                png: currentUser[0].image.png,
                webp: currentUser[0].image.webp
                },
                username: currentUser[0].username
            },
            replies: [],
        };
        
        setComments((prevComments) => [...prevComments, newComment]);
    };

    function toReply(parentId) {
        setReplying((prevReplying) => {
            const newReplying = { ...prevReplying };
            newReplying[parentId] = !newReplying[parentId];
            return newReplying;
        });
    };

    return (

        <div className="main-container">
            {comments.map((comment) => (
                <Comment
                    key={comment.id}
                    currentUser={currentUser}
                    comment={comment} 
                    onReply={handleReply}
                    replying={replying}
                    toReply={toReply}
                    deleteComment={deleteComment}
                    editCommentContent={editCommentContent}
                />
            ))}
                <Form
                    currentUser={currentUser[0].image.png}
                    handleClick={handleAddComment}
                    type={"Add Comment..."}
                    btn={"send"}
                />
        </div>
    );
};