import axios from "axios";
const baseUrl = 'http://localhost:5001/api/tasks';
// const baseUrl = 'http://192.168.2.3:5001/api/tasks';

const getTasksFromUser = async (userId) => {
  const response = await axios.get(`${baseUrl}/${userId}`);
  return response;
}

const addTask = async newTaskObject => {
  const response = await axios.post(`${baseUrl}`, newTaskObject);
  return response.data;
}

const changeTask = async task => {
  const response = await axios.put(`${baseUrl}/${task.id}`, task);
  return response;
}

const deleteTask = async task => {
  const response = await axios.delete(`${baseUrl}/${task.id}`);
  return response;
}
export default { getTasksFromUser, addTask, changeTask, deleteTask }