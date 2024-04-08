import mongoose from "mongoose"
import uniqueValidator from "mongoose-unique-validator"

const taskSchema = new mongoose.Schema({
  checked: {
    type: Boolean
  },
  task: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
});

taskSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
taskSchema.plugin(uniqueValidator);
const Task = mongoose.model("Task", taskSchema);
export default Task