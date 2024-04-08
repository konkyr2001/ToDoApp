import userService from "../../services/users";
import { useState, useRef } from "react";

import Alert from "../Alert/Alert";

export default function Login({ handleLink, loginUser }) {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  let initialLoginValue;
  if (localStorage.getItem("stayLoggedIn") === null) {
    initialLoginValue = true;
  } else {
    initialLoginValue = localStorage.getItem("stayLoggedIn");
  }
  const [loginLoggedIn, setLoginLoggedIn] = useState(initialLoginValue);

  const [showError, setShowError] = useState(false);
  const alertRef = useRef();

  async function submitLoginFormHandler(event) {
    event.preventDefault();

    const form = event.target;
    if (!form.checkValidity()) {
      event.stopPropagation();
    }

    const user = {
      username: loginUsername,
      password: loginPassword,
    };

    const findUser = await userService
      .getUser(user)
      .then((response) => {
        console.log("User found in login: ", response.data);
        const userId = response.data.id;
        if (loginLoggedIn) {
          localStorage.setItem("username", loginUsername);
          localStorage.setItem("password", loginPassword);
          localStorage.setItem("id", userId);
          localStorage.setItem("stayLoggedIn", true);
        } else {
          localStorage.setItem("username", undefined);
          localStorage.setItem("password", undefined);
          localStorage.setItem("id", undefined);
          localStorage.setItem("stayLoggedIn", false);
        }

        loginUser(loginUsername, loginPassword, userId);
      })
      .catch((error) => {
        handleInputsError(form);
        console.log("Error in login: ", error);
      });
    // Additional logic for login form submission
  }

  function handleInputsError(form) {
    const username = form.querySelector("#login-username");
    const usernameMessage = checkInput(loginUsername);
    if (usernameMessage) {
      const usernameLabel = form.querySelector(".username-feedback");
      usernameLabel.innerHTML = usernameMessage;
      username.classList.add("is-invalid");
    } else {
      username.classList.remove("is-invalid");
    }

    const password = form.querySelector("#login-password");
    const passwordMessage = checkInput(loginPassword);
    if (passwordMessage) {
      const passwordLabel = form.querySelector(".password-feedback");
      passwordLabel.innerHTML = passwordMessage;
      password.classList.add("is-invalid");
    } else {
      password.classList.remove("is-invalid");
    }

    if (!usernameMessage && !passwordMessage) {
      setShowError(true);
    }
  }

  function checkInput(value) {
    const containsCharacter = /[a-zA-Z]/.test(value); // Check for at least one character
    const containsNumber = /\d/.test(value); // Check for at least one number
    const validLength = value.length >= 7; // Check for at least 7 characters
    let message = undefined;
    if (!validLength) {
      message = "Password should be atleast 7 characters total";
    } else if (!containsCharacter) {
      message = "Password should contain atleast 1 character";
    } else if (!containsNumber) {
      message = "Password should contain atleast 1 number";
    }
    return message;
  }

  return (
    <>
      {showError && (
        <Alert
          ref={alertRef}
          type="danger"
          title="Error!"
          message="The username or password are incorrect!"
          setAlert={setShowError}
        />
      )}

      <div className="container account-form">
        <form
          id="login-form"
          onSubmit={(e) => submitLoginFormHandler(e)}
          className="container"
          noValidate
        >
          <div className="input-group mt-4">
            <span className="input-group-text">@</span>
            <input
              type="username"
              name="login-username"
              className="form-control"
              id="login-username"
              placeholder="Type your username here"
              minLength={7}
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              required
            />
            <label className="invalid-feedback username-feedback"></label>
          </div>
          <div className="input-group mt-4">
            <span className="input-group-text ps-3">*</span>
            <input
              type="password"
              name="login-password"
              className="form-control"
              id="login-password"
              placeholder="Type your password here"
              minLength={7}
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
            <label className="invalid-feedback password-feedback"></label>
          </div>
          {/* <a href="#">Forgot your password?</a> */}
          <div className="form-check mt-3">
            <span
              onClick={() => {
                setLoginLoggedIn(!loginLoggedIn);
              }}
            >
              <input
                type="checkbox"
                name="login-checkbox"
                className="form-check-input"
                id="login-stayLoggedIn"
                checked={loginLoggedIn}
                onClick={() => setLoginLoggedIn(!loginLoggedIn)}
              />
              <label className="form-check-label" htmlFor="stayLoggedIn">
                Stay logged in
              </label>
            </span>
          </div>
          <div className="row justify-content-center">
            <div className="col-*" style={{ width: "fit-content" }}>
              <button type="submit" className="btn btn-primary mt-4">
                Continue
              </button>
            </div>
          </div>
          <div className="row justify-content-center mt-1">
            <div className="col-*" style={{ width: "fit-content" }}>
              <a href="#" onClick={(e) => handleLink(e, false)}>
                Dont have an account? Sign up
              </a>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
