import taskService from "../../services/tasks";
import userService from "../../services/users";
import Logout from "../Logout/Logout.jsx";
import Task from "./Task.jsx";

import { useState, useReducer, useEffect } from "react";

import "./ToDoList.css";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function taskReducer(state, action) {
  switch (action.type) {
    case "initialize_tasks":
      return { ...state, tasks: action.payload.tasks };
    case "add_new_task":
      return { ...state, tasks: [...state.tasks, action.payload] };
    case "delete_task":
      const newTasks = state.tasks.filter(
        (task) => task.id !== action.payload.id
      );
      return { ...state, tasks: newTasks };
    default:
      return state;
  }
}

export default function ToDoList({ user, setUser }) {
  const [taskState, tasksDispatch] = useReducer(taskReducer, {
    tasks: [],
  });
  const [task, setTask] = useState("");
  const [noTask, setNoTask] = useState(true);

  const [tasks, setTasks] = useState(taskState.tasks);

  // console.log(user);

  useEffect(() => {
    async function getTasks() {
      try {
        const response = await userService.getUserTasksById(user.id);
        const tasks = response.data.tasks;
        tasksDispatch({
          type: "initialize_tasks",
          payload: {
            tasks,
          },
        });
        setTasks(tasks);
        if (tasks.length > 0) setNoTask(false);
        else setNoTask(true);
      } catch (error) {
        setNoTask(true);
        console.log("No tasks found!");
      }
    }

    getTasks();
  }, [userService]);

  function onChangeTask(event) {
    const input = document.querySelector("#task-input");
    const label = document.querySelector(".task-feedback");
    input.classList.remove("is-invalid");
    label.innerHTML = "";

    setTask(event.target.value);
  }
  async function handleTask(e) {
    e.preventDefault();
    if (!task) {
      const input = document.querySelector("#task-input");
      const label = document.querySelector(".task-feedback");
      input.classList.add("is-invalid");
      label.innerHTML = "Please enter a task";

      return;
    }

    setTask("");
    setNoTask(false);
    try {
      const currentTask = await taskService.addTask({
        checked: false,
        task: task,
        userId: user.id,
      });

      tasksDispatch({
        type: "add_new_task",
        payload: currentTask,
      });
      console.log("task added!");
    } catch (error) {
      console.log("error on adding task!");
    }
  }

  function deleteTask(task, id, ref) {
    ref.current.classList.add("opacity");
    setTimeout(() => {
      ref.current.classList.remove("opacity");
      tasksDispatch({
        type: "delete_task",
        payload: task,
      });
    }, 500);
  }

  async function handleOnDragEnd(result) {
    if (!result.destination) return null;

    const items = Array.from(taskState.tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    taskState.tasks = items;

    const taskIds = items.map((item) => item.id);
    const newTasks = {
      tasks: taskIds,
    };

    await userService
      .updateUserTaskIds(user.id, newTasks)
  }
  return (
    <>
      <Logout setUser={setUser} />
      <div id="to-do-list" className="">
        <div id="to-do-container" className="">
          <p className="h4">ToDo list</p>
          <form className="to-do-inputs" onSubmit={handleTask}>
            <input
              value={task}
              id="task-input"
              type="text"
              className="form-control"
              placeholder="Add your task"
              onChange={(e) => onChangeTask(e)}
            />
            <label
              htmlFor="task-input"
              className="invalid-feedback task-feedback"
            ></label>
            <button className="submit-task rounded-circle" type="submit">
              <i className="fa-solid fa-plus"></i>
            </button>
          </form>
          {noTask && <p className="text-center">There are no tasks yet!</p>}
          {!noTask && (
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="tasks">
                {(provided) => (
                  <ul
                    className="task-list"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {taskState.tasks.map((taskElement, index) => (
                      <Draggable
                        key={taskElement.id}
                        draggableId={taskElement.id} // Corrected draggableId
                        index={index}
                      >
                        {(provided) => (
                          <li
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            className="task-list-item"
                          >
                            <Task
                              task={taskElement}
                              userId={user.id}
                              delay={(index + 1) * 500}
                              deleteTask={deleteTask}
                            />
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      </div>
    </>
  );
}
