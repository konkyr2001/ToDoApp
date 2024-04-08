//REST API demo in Node.js
import express from "express";
const app = express();
import cors from "cors";
import userRoutes from "./src/controllers/user.controller.js"
import taskRoutes from "./src/controllers/task.controller.js"
import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();

mongoose.set("strictQuery", false);

// const MONGODB_URI = process.env.NODE_ENV === 'test'
//   ? process.env.TEST_MONGODB_URI
//   : process.env.MONGODB_URI
const MONGODB_URI = process.env.ATLAS_CONNECTION
mongoose.connect(MONGODB_URI);

const connection = mongoose.connection
connection.once('open', () => {
    console.log("DB connected.");
})

app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes)
app.use('/api/tasks', taskRoutes)

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server Listening on PORT: ",PORT);
})


