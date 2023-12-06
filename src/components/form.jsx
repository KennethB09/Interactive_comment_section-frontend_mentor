import { useState } from "react";

export default function Form ({ currentUser, commentId, btn, handleClick, type, parentCmnt, initialValue = ""  }) {

  const [ message, setMessage ] = useState(initialValue)

  function handleSubmit(e) {
    e.preventDefault()
    handleClick( commentId, parentCmnt, message )
    setMessage("")
  };

  return (

    <div className="comment-form-container">
      <form onSubmit={handleSubmit} className="comment-form">
        <img className="comments-form-img" src={currentUser}/>
          <textarea
            className="comment-form-textarea"
            id={ Date.now() } 
            value={ message }
            onChange={ event => setMessage(event.target.value) }
            placeholder= { type }
          />
          <button type="submit" className="comment-form-btn BTN">{ btn }</button>
      </form>
    </div>
  );
};