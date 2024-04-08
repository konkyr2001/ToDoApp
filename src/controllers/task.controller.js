import Task from "../models/task.model.js";
import User from "../models/user.model.js"
import express from "express";

const taskRouter = express.Router();

taskRouter.get('/', async (request, response) => {
  await Task.find({}).populate('userId', ({ username: 1 }))
    .then((allTasks) => response.json(allTasks))
    .catch((error) => response.status(400).json("Error! " + error));
})

taskRouter.get('/:id', async (request, response) => {
  try {
    const id = request.params.id;
    const tasks = await Task.find({ userId: id });
    return response.status(200).json(tasks);
  } catch (error) {
    response.status(400).json("Error! " + error);
  }
})

taskRouter.post("/", async (request, response) => {
  const newTask = new Task({
    task: request.body.task,
    checked: request.body.checked,
    userId: request.body.userId,
  });

  try {


    // Find the user and update the tasks array
    const user = await User.findById(request.body.userId);

    const newTask = new Task({
      task: request.body.task,
      checked: request.body.checked,
      userId: request.body.userId,
    })
    // Save the new task
    const savedTask = await newTask.save();

    user.tasks.push(savedTask.id);
    await user.save();

    // Respond with the saved task
    response.json(savedTask.toJSON());
  } catch (error) {
    response.status(400).json(error.message);
  }
});

taskRouter.put("/:id", async (request, response) => {
  const content = request.body;
  const taskId = request.params.id;

  const task = {
    task: content.task,
    checked: content.checked,
    userId: content.userId,
  }

  try {
    await Task.findByIdAndUpdate(taskId, task, { new: true })
    response.status(200).json(task).end();
  } catch (error) {
    response.status(400).json("Error on put: " + error.message).end();
    console.log("Error on put: " + error.message);
  }
})

taskRouter.delete("/:id", async (request, response) => {
  const taskId = request.params.id;

  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (deletedTask) {
      const userId = deletedTask.userId.toString();
      const user = await User.findById(userId);
      user.tasks.splice(user.tasks.indexOf(taskId), 1);
      user.save();
      response.status(204).json(deletedTask).end();
    } else {
      response.status(400).json("Error! Task not found").end();
      
    }
  } catch (error) {
    console.log("Error on delete: " + error.message);
  }
})
export default taskRouter;
