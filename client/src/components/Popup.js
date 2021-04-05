import React from "react";
import "./Popup.css";
function Popup(props) {
  return props.trigger ? (
    <div className="popup">
      <div className="popup-inner">
        <form>
          <label htmlFor="newEmail">Enter Friends Email</label>
          <div className="form-inner">
            <h2>Add Friend</h2>
            <div class="form-group">
              <label htmlFor="newEmail">Add Friend</label>
              <input type="text" name="friend" id="friend" />
            </div>
          </div>
        </form>
        <button className="button" onClick={() => props.setTrigger(false)}>
          Add Friend
        </button>

        <input type="text" name="name" />

        {props.children}
      </div>
    </div>
  ) : (
    ""
  );
}

export default Popup;
