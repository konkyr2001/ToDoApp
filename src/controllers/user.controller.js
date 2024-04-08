import User from "../models/user.model.js";
import express from "express";

const userRouter = express.Router();

userRouter.get("/", async (request, response) => {
  // using .find() without a parameter will match on all user instances
  await User.find().populate('tasks', ({
    checked: 1,
    task: 1
  }))
    .then((allUsers) => response.json(allUsers))
    .catch((error) => response.status(400).json("Error! " + error));
});

userRouter.get("/username/:username", async (request, response) => {
  try {
    const username = request.params.username;
    const user = await User.findOne({ username: username })
    .populate('tasks', ({
      checked: 1,
      task: 1
    }))
    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }
    return response.status(200).json(user);
  } catch (error) {
    return response.status(500).json({ error: "Internal Server Error" });
  }
});

userRouter.get("/id/:id", async (request, response) => {
  try {
    const user = await User.findById(request.params.id)
    .populate({path: 'tasks' })
    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }
    return response.status(200).json(user);
  } catch (error) {
      return response.status(500).json({ error: "Internal Server Error" });
  }
});

userRouter.post("/", async (request, response) => {
  const existingUser = await User.findOne({ username: request.body.username });
  if (existingUser) {
    response.status(400).json("user already exists");
    return;
  }
  const newUser = new User({
    username: request.body.username,
    password: request.body.password,
  });
  try {
    console.log(newUser);
    const savedUser = await newUser.save(); 
    response.json(savedUser.toJSON());
  } catch (error) {
    response.status(400).json(error.name); // Respond with an error status and message
  }
});

userRouter.put("/:id", async (request, response) => {
  try{

  await User.findByIdAndUpdate(request.params.id, request.body)
    .then((result) => {
      response.json(result)
    })
    .catch((err) => res.status(400).json("Error put! " + err.message));
  } catch(error) {
    console.log(error.message);
  }
});

userRouter.delete("/delete/:id", async (request, response) => {
  await User.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).json("Success! User deleted.");
    })
    .catch((error) => {
      console.log(exception);
      response.status(400).json("Error delete! " + exception.message);
    });
});

export default userRouter;
