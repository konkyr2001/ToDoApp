import userService from "../../services/users";
import { useState } from "react";

export default function Register({ handleLink, registerUser }) {
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerLoggedIn, setRegisterLoggedIn] = useState(true);

  async function submitRegisterFormHandler(event) {
    event.preventDefault();

    const form = event.target;

    if (!form.checkValidity()) {
      event.stopPropagation();
    }
    form.classList.add("validated");
    const usernameValid = registerUsernameValidation(registerUsername);
    const passwordValid = registerPasswordValidation(registerPassword);
    const username = form.querySelector("#register-username");
    const password = form.querySelector("#register-password");
    const usernameLabel = form.querySelector(".username-feedback");

    if (usernameValid.validation) {
      let findUser;
      try {
        findUser = await userService.getUser({
          username: registerUsername,
          password: registerPassword,
        });
      } catch (error) {
        findUser = undefined;
      }

      if (findUser) {
        // Set class directly without relying on asynchronous operations
        username.classList.add("is-invalid");
        username.classList.remove("is-valid");
        usernameLabel.innerHTML = "Username already exists";
        return; // Stop further execution
      }
    } else {
      displayUsernameErrorMessage(usernameValid);
      return;
    }

    if (usernameValid && passwordValid) {
      const newUser = {
        username: registerUsername,
        password: registerPassword,
      };
      const createUser = await userService
        .create(newUser)
        .then((response) => {
          console.log("user created success: ", response.data);
          const userId = response.data.id;
          if (registerLoggedIn) {
            localStorage.setItem("username", registerUsername);
            localStorage.setItem("password", registerPassword);
            localStorage.setItem("id", userId);
            localStorage.setItem("stayLoggedIn", true);
          } else {
            localStorage.setItem("username", undefined);
            localStorage.setItem("password", undefined);
            localStorage.setItem("id", undefined);
            localStorage.setItem("stayLoggedIn", false);
          }

          registerUser(registerUsername, registerPassword, userId);

          username.classList.add("is-valid");
          username.classList.remove("is-invalid");
        })
        .catch((error) => {
          console.log("Error, user not created: ", error.response.data);
          username.classList.add("is-invalid");
          username.classList.remove("is-valid");
          usernameLabel.innerHTML = "Username already exists";
        });
    }
  }

  function handleRegisterUsername(event) {
    const value = event.target.value;
    setRegisterUsername(value);
    registerUsernameValidation(value);
  }

  function registerUsernameValidation(value) {
    const form = document.querySelector(".validated");
    if (!form) {
      return;
    }

    const containsCharacter = /[a-zA-Z]/.test(value); // Check for at least one character
    const containsNumber = /\d/.test(value); // Check for at least one number
    const validLength = value.length >= 7; // Check for at least 7 characters
    const validation = containsCharacter && containsNumber && validLength;

    let message = undefined;
    if (!validLength) {
      message = "Username should be atleast 7 characters total";
    } else if (!containsCharacter) {
      message = "Username should contain atleast 1 character";
    } else if (!containsNumber) {
      message = "Username should contain atleast 1 number";
    }

    displayUsernameErrorMessage({
      validation,
      message,
    });
    return {
      validation,
      message,
    };
  }

  function displayUsernameErrorMessage(object) {
    console.log(object);
    const form = document.querySelector(".validated");

    const validation = object.validation;
    const message = object.message;
    const username = form.querySelector("#register-username");
    if (validation) {
      if (!username.classList.contains("is-valid")) {
        username.classList.add("is-valid");
        username.classList.remove("is-invalid");
      }
    } else {
      if (!username.classList.contains("is-valid")) {
        username.classList.add("is-invalid");
        username.classList.remove("is-valid");
      }

      const usernameLabel = form.querySelector(".username-feedback");
      usernameLabel.innerHTML = message;
    }
  }

  function handleRegisterPassword(event) {
    const value = event.target.value;
    setRegisterPassword(value);
    registerPasswordValidation(value);
  }

  function registerPasswordValidation(value) {
    const form = document.querySelector(".validated");
    if (!form) {
      return;
    }
    const password = form.querySelector("#register-password");
    const passwordLabel = form.querySelector(".password-feedback");

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
    const validation = containsCharacter && containsNumber && validLength;
    if (validation) {
      password.classList.add("is-valid");
      password.classList.remove("is-invalid");
    } else {
      password.classList.add("is-invalid");
      password.classList.remove("is-valid");
      passwordLabel.innerHTML = message;
    }
    return validation;
  }

  return (
    <div className="container account-form">
      <form
        id="register-form"
        onSubmit={(e) => submitRegisterFormHandler(e)}
        className="container"
        noValidate
      >
        <div className="input-group mt-4 has-validation">
          <span className="input-group-text">@</span>
          <input
            type="username"
            name="register-username"
            id="register-username"
            className="form-control"
            placeholder="Type your username here"
            minLength={7}
            value={registerUsername}
            onChange={handleRegisterUsername}
            required
          />
          <label className="invalid-feedback username-feedback">
            Write atleast 7 characters long
          </label>
        </div>
        <div className="input-group mt-4">
          <span className="input-group-text ps-3">*</span>
          <input
            type="password"
            name="password"
            id="register-password"
            className="form-control"
            placeholder="Type your password here"
            minLength={7}
            value={registerPassword}
            onChange={handleRegisterPassword}
            required
          />
          <label className="invalid-feedback password-feedback">
            Type a proper password
          </label>
        </div>
        <div className="form-check mt-3">
          <span onClick={() => setRegisterLoggedIn(!registerLoggedIn)}>
            <input
              type="checkbox"
              name="checkbox"
              className="form-check-input"
              id="register-stayLoggedIn"
              checked={registerLoggedIn}
              onClick={() => setRegisterLoggedIn(!registerLoggedIn)}
            />
            <label className="form-check-label" htmlFor="stayLoggedIn">
              Stay logged in
            </label>
          </span>
        </div>
        <div className="row justify-content-center">
          <div className="col-*" style={{ width: "fit-content" }}>
            <button type="submit" className="btn btn-primary mt-4">
              Register
            </button>
          </div>
        </div>
        <div className="row justify-content-center mt-1">
          <div className="col-*" style={{ width: "fit-content" }}>
            <a href="#" onClick={(e) => handleLink(e, true)}>
              Already have an account? Sign in
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
