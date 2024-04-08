import { useState } from "react";

import Login from "./Login";
import Register from "./Register";

import "./Account.css";

function Account({ setUser }) {
  const [showLogin, setShowLogin] = useState(true);

  function handleLink(event, value) {
    event.preventDefault();
    setShowLogin(value);
  }

  function handleUser(username, password, id) {
    setUser((prevUser) => {
      console.log(prevUser);
      return {
        username,
        password,
        id,
        app: true,
      };
    });
  }

  return (
    <div className="container account" style={{ padding: 0 }}>
      <div className="row justify-content-center">
        <div className="col-*" style={{ width: "fit-content" }}>
          {showLogin ? <h1>Login to ToDoApp</h1> : <h1>Register to ToDoApp</h1>}
        </div>
      </div>
      {showLogin && <Login handleLink={handleLink} loginUser={handleUser} />}
      {!showLogin && (
        <Register handleLink={handleLink} registerUser={handleUser} />
      )}
    </div>
  );
}

export default Account;
