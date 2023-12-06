import { useState } from "react";
import Form from "./form";

export default function Comment ({ 
    comment, 
    onReply, 
    replying,
    toReply,
    editCommentContent,
    deleteComment,
    currentUser }) {
    
        const [commentScore, setCommentScore] = useState(comment.score);
        const [editComment, setEditComment] = useState(comment.content);
        const [upVote, setUpVote] = useState(false);
        const [downVote, setDownVote] = useState(false);
        const [toEditComment, setToEditComment] = useState({})
        const [isDeleting, setIsDeleting] = useState(false)

        const [scoreClr, setScoreClr] = useState({
            color: "hsl(238, 40%, 52%)"
        })

        function saveEditedComment(commentId) {     
            editCommentContent(commentId, editComment)
            toggleEditbtn(commentId)
        }

        function toggleEditbtn(parentId) {
            setToEditComment((prevReplying) => {
                const editContent = { ...prevReplying };
                editContent[parentId] = !editContent[parentId];
                return editContent;
            });
        }

        function toggleDelete(parentId) {
            setIsDeleting(prev => {
                const toDelete = {prev}
                toDelete[parentId] = !toDelete[parentId];
                return toDelete
            })
        }

        function cancelDelete(parentId) {
            setIsDeleting(prev => (
                prev[parentId] = false
            ))
        }

        function plus() {
            if (upVote === false) {
                setCommentScore(comment.score + 1);
                setUpVote(true)
                setDownVote(false)
                setScoreClr({
                    color: "#86B049"
                })
        
            } else {
                setCommentScore(comment.score);
                setUpVote(false)
                setScoreClr({
                    color: "hsl(238, 40%, 52%)"
                })
            }
        };

        function minus() {
            if (downVote === false) {
                setCommentScore(comment.score - 1);
                setDownVote(true)
                setUpVote(false)
                setScoreClr({
                    color: "#EE4B2B"
                })
            } else {
                setCommentScore(comment.score);
                setDownVote(false)
                setScoreClr({
                    color: "hsl(238, 40%, 52%)"
                })
            }
        };

    return (
        <div className="comments-container">

        { isDeleting &&
            <div className="comments-modal-container">
                <div className="modal">
                    <div className="comments-modal-warning">
                        <h1 className="comments-modal-warningTitle">{ comment.replyingTo ? "Delete Reply" : "Delete Comment" }</h1>
                        <p className="comments-modal-warningText">
                            { comment.replyingTo ? "Are you sure you want to delete this reply? This will remove the reply and can't be undone." 
                            : 
                            "Are you sure you want to delete this comment? This will remove the comment and can't be undone." }
                        </p>
                    </div>
                    <div className="comments-modal-btn-container">
                        <button className="comments-modal-cancelBtn" onClick={() => cancelDelete(comment.id)}>No, Cancel</button>
                        <button className="comments-modal-deleteBtn" onClick={() => deleteComment(comment.id)}>Yes, Delete</button>
                    </div>
                </div>
            </div> }

            <div className="comments">

                <div className="comments-info">
                    <img className="comments-info-img" alt="user profile picture" src={comment.user.image.png}/>
                    <h1 className="comments-info-username">{comment.user.username}</h1>
                    { comment.user.username === currentUser[0].username && <span className="comments-info-tag">You</span>}
                    <span className="comments-info-createdAt">{comment.createdAt}</span>
                </div>

                <div className="comments-toggle-btn-container">
                    {
                        comment.user.username !== currentUser[0].username ? 
                        (<button className="comments-toggle-btn-toggleReply" onClick={() => toReply(comment.id)}><img className="comments-toggle-btn-toggleReply-icon" alt="comment reply" src="./src/assets/images/icon-reply.svg"/>reply</button>)
                        :
                        (<div className="comments-toggle-brn-toggle-userBtn-container">
                            <button className="comments-toggle-btn-toggleDelete" onClick={() => toggleDelete(comment.id)}><img className="comments-toggle-btn-toggleDelete-icon" alt="comment delete" src="./src/assets/images/icon-delete.svg"/>delete</button>
                            <button className="comments-toggle-btn-toggleEdit" onClick={() => toggleEditbtn(comment.id)}><img className="comments-toggle-btn-toggleEdit-icon" alt="comment edit" src="./src/assets/images/icon-edit.svg"/>edit</button>
                        </div>)
                    }
                </div>

                <div className="comments-content-container">
                    {
                        toEditComment[comment.id] ?
                        <div className="comments-content-editForm-container">
                            <textarea
                                className="comments-content-editForm"
                                id={comment.id + Date.now()}
                                onChange={(event) => setEditComment(event.target.value)}
                                value={editComment}
                            />
                            <button className="comments-content-editForm-btn BTN" onClick={() => saveEditedComment(comment.id)}>save</button>
                        </div>
                        :
                        <p className="comments-content" style={{wordBreak: "break-word"}}><span className="comments-content-mention">{`${comment.replyingTo === undefined ? "" : `@${comment.replyingTo}`}`}</span> {comment.content}</p>
                    }
                </div>

                <div className="comments-score-container">
                    <button className="comments-score-plusBtn" onClick={() => plus()}><img className="comments-score-plusBtn-icon" alt="comment plus" src="./src/assets/images/icon-plus.svg"/></button>
                    <span style={scoreClr} className="comments-score">{commentScore}</span>
                    <button className="comments-score-minusBtn" onClick={() => minus()}><img className="comments-score-minusBtn-icon" alt="comment minus" src="./src/assets/images/icon-minus.svg"/></button>
                </div>

            </div>

            {
                replying[comment.id] && 
                <div className="comments-replying-form">
                    <Form 
                        currentUser={currentUser[0].image.png}
                        commentId={comment.id}
                        parentCmnt={comment.user.username}
                        handleClick={onReply}
                        type={"Add Reply..."}
                        btn={"REPLY"}
                    />
                </div>
            }

            {comment.replies && comment.replies.map((reply) => (
                <div className="comments-replies-container" key={reply.id}>

                    <Comment 
                        key={reply.id} 
                        comment={reply} 
                        onReply={onReply} 
                        replying={replying}
                        toReply={toReply}
                        editCommentContent={editCommentContent}
                        deleteComment={deleteComment}
                        currentUser={currentUser}
                    />
                </div>
            ))}
        </div>
    )
};
