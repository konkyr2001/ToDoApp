import axios from 'axios';
const baseUrl = 'https://todoapp-uug3.onrender.com/api/users';
// const baseUrl = 'http://192.168.2.3:5001/api/users';

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response;
}

const getByUsername = async username => {
  const response = await axios.get(`${baseUrl}/${username}`);
  return response.data;
}

const getUser = async user => {
  try {
    console.log(user)
    const response = await axios.get(`${baseUrl}/username/${user.username}`);
    if (user.password === response.data.password) {
      response.data.found = true;
    } else {
      response.data.found = false;
      throw new Error("Incorrect password");
    }
    return response;
  } catch (error) {
    // If there's an error during the axios request or password comparison, catch it here
      response.data.found = false;
      throw ("Username or password are not correct");
  }
}

const getUserTasksById = async userId => {
  const response = await axios.get(`${baseUrl}/id/${userId}`);
  return response;
}

const updateUserTaskIds = async (userId, newTasks) => {
  const response = await axios.put(`${baseUrl}/${userId}`, newTasks);
  return response;
}

const create = async newUser => {
  const response = await axios.post(`${baseUrl}`, newUser);
  return response;
}

const deleteUser = async user => {
  const response = await axios.delete(`${baseUrl}/${user.id}`);
  return response.data;
}

export default { getAll, getByUsername, getUser, getUserTasksById, updateUserTaskIds, create, deleteUser}