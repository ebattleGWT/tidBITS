import api from './api';

const fetchNotes = async (tag) => {
  try {
    const response = await api.get('/api/notes', { params: { tag } });
    return response;
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};

const createNote = async (note) => {
  try {
    const response = await api.post('/api/notes', note);
    return response;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};

const updateNote = async (note) => {
  try {
    const response = await api.put(`/api/notes/${note.id}`, note);
    return response;
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

const deleteNote = async (id) => {
  try {
    const response = await api.delete(`/api/notes/${id}`);
    return response.status === 204;
  } catch (error) {
    console.error('Error deleting note:', error.response?.data || error.message);
    throw error;
  }
};

const noteService = {
  fetchNotes,
  createNote,
  updateNote,
  deleteNote
};

export default noteService;
