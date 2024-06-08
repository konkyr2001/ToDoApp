import "./App.css";
import Palette from "./components//Color/Palette/Palette";
import Account from "./components/Account/Account.jsx";
import ToDoList from "./components/ToDoList/ToDoList.jsx";
import { useState, useEffect } from "react";

function App() {
  const [user, setUser] = useState({
    username: "",
    password: "",
    id: "",
    app: undefined,
  });

  useEffect(() => {
    document.querySelector(".circles").style.backgroundColor =
      localStorage.getItem("backgroundColor");

    if (localStorage.getItem("stayLoggedIn") === "true") {
      const username = localStorage.getItem("username");
      const password = localStorage.getItem("password");
      const id = localStorage.getItem("id");

      // console.log(username);
      // console.log(password);
      if (
        username === "undefined" ||
        password === "undefined" ||
        id === "undefined"
      ) {
        return;
      }
      setUser({
        username: localStorage.getItem("username"),
        password: localStorage.getItem("password"),
        id: localStorage.getItem("id"),
        app: true,
      });
    }
  }, []);

  return (
    <>
      <Palette />
      {user.app && <ToDoList user={user} setUser={setUser} />}
      {!user.app && <Account setUser={setUser} />}
    </>
  );
}

export default App;
