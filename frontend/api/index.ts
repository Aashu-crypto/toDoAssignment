import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.29.59:3000", // Change to your backend URL
});

export const fetchTodos = async (userId: string) => {
  const response = await api.get(`/todos/${userId}`);
  return response.data;
};

export const createTodo = async (title: string, userId: string) => {
  const response = await api.post("/todos", { title, userId });
  return response.data;
};

export const updateTodo = async (
  id: string,
  title: string,
  completed: boolean
) => {
  const response = await api.put(`/todos/${id}`, { title, completed });
  return response.data;
};

export const deleteTodo = async (id: string) => {
  const response = await api.delete(`/todos/${id}`);
  return response.status;
};
