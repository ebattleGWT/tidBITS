import axios from 'axios';

const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const login = (email, password) => api.post('/login', { email, password });
export const register = (username, email, password) => api.post('/register', { username, email, password });
export const getNotes = () => api.get('/notes');
export const createNote = async (note) => {
  const response = await api.post('/notes', note);
  return response.data;
};
export const updateNote = (id, updatedNote) => {
  return api.put(`/notes/${id}`, JSON.stringify(updatedNote)); // Ensure the body is JSON-stringified
};
export const deleteNote = (id) => api.delete(`/notes/${id}`);

export default api;