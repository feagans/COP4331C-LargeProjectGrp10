import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL, ACCESS_TOKEN_NAME } from "../constants/apiConstants.js";

import "./Email.css";

function Name(props) {
  // local details
  const [state, setState] = useState({
    oldName: "",
    newName: "",
    confirmPassword: "",
    successMessage: null,
  });
  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    const payload = {
      //needs to be changed to email maybe.
      oldName: state.oldName,
      newName: state.newName,
      confirmPassword: state.confirmPassword,
    };
    axios
      .post(API_BASE_URL + "/api/login", payload)
      .then(function (response) {
        if (response.status === 200) {
          setState((prevState) => ({
            ...prevState,
            successMessage: "Update successful. Redirecting to settings page..",
          }));
          localStorage.setItem(ACCESS_TOKEN_NAME, response.data.token);
          redirectToHome();
          props.showError(null);
        } else if (response.code === 204) {
          props.showError("Password Incorrect");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // method for submitting the form
  const submitHandler = (e) => {
    // prevent the page from reloading
    e.preventDefault();

    // passes through the form details we have set via props
    Email(details);
  };
  return (
    <div className="grid-container">
      <div className="grid-item">
        <div class="grid-item">
          <form onSubmit={submitHandler}>
            <div className="form-inner">
              <h2>Update Name</h2>
              <div class="form-group">
                <label htmlFor="newEmail">New Name</label>
                <input
                  type="text"
                  name="newName"
                  id="newName"
                  value={state.newName}
                  onChange={handleChange}
                />
              </div>
              <div class="form-group">
                <label htmlFor="oldEmail">Old Name</label>
                <input
                  type="text"
                  name="oldName"
                  id="oldName"
                  value={state.oldName}
                  onChange={handleChange}
                />
              </div>
              <h3>To verify your identity, please enter your password</h3>
              <div class="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={state.email}
                  onChange={handleChange}
                />
              </div>
              <input
                type="submit"
                value="Save Changes"
                onClick={handleSubmitClick}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Name;
