import "./Task.css";
import { useState, useRef, useEffect } from "react";
import taskService from "../../services/tasks";

export default function Task({ task, userId, deleteTask, delay }) {
  const taskRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [taskText, setTaskText] = useState(task.task);
  const [check, setCheck] = useState(task.checked);

  useEffect(() => {
    const timer = setTimeout(() => {
      taskRef.current.classList.remove("slide-animation");
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  async function handleEditButton() {
    setIsEditing((prevState) => {
      console.log(prevState);
      return !prevState;
    });

    let text = taskText;
    if (!taskText) {
      setTaskText("Quack!");
      text = "Quack!";
    }
    if (isEditing) {
      const newTask = {
        id: task.id,
        task: text,
        checked: check,
        userId: userId,
      };
      await taskService
        .changeTask(newTask)
        .then((result) => console.log(result));
    }
  }

  function handleOnChangeInput(event) {
    setTaskText(event.target.value);
  }

  function handleInputKeyDown(event) {
    if (event.key === "Enter") {
      handleEditButton();
    }
  }

  async function handleCheck() {
    setCheck((prevCheck) => !prevCheck);
    console.log(!check);
    const newTask = {
      id: task.id,
      task: taskText,
      checked: !check,
      userId: userId,
    };
    await taskService.changeTask(newTask).then((result) => console.log(result));
  }

  async function handleDelete(e) {
    const deletedTask = {
      id: task.id,
      task: taskText,
      checked: check,
      userId: userId,
    };
    console.log("deletedTask: ", deletedTask);
    await taskService
      .deleteTask(deletedTask)
      .then((result) => deleteTask(deletedTask, task.id, taskRef));
  }

  return (
    <div className="task slide-animation" ref={taskRef}>
      <i className="fa-solid fa-grip-vertical"></i>
      <input type="checkbox" checked={check} onChange={handleCheck} />
      {!isEditing && <p className="task-text">{taskText}</p>}
      {isEditing && (
        <input
          className="form-control"
          type="text"
          value={taskText}
          onChange={(e) => handleOnChangeInput(e)}
          onKeyDown={(e) => handleInputKeyDown(e)}
        />
      )}
      <button>
        {!isEditing && (
          <i className="fa-solid fa-pencil" onClick={handleEditButton}></i>
        )}
        {isEditing && (
          <i
            className="fa-regular fa-circle-check edit-check"
            onClick={handleEditButton}
          ></i>
        )}
      </button>
      <button onClick={(e) => handleDelete(e)}>
        <i className="fa-solid fa-trash"></i>
      </button>
    </div>
  );
}
