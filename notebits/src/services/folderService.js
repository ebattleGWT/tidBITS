import api from './api';

const fetchFolders = async () => {
  try {
    const response = await api.get('/folders');
    return response;
  } catch (error) {
    console.error('Error fetching folders:', error);
    throw error;
  }
};

const createFolder = async (folder) => {
  try {
    const response = await api.post('/folders', folder);
    return response;
  } catch (error) {
    console.error('Error creating folder:', error);
    throw error;
  }
};

const updateFolder = async (folder) => {
  try {
    const response = await api.put(`/folders/${folder.id}`, folder);
    return response;
  } catch (error) {
    console.error('Error updating folder:', error);
    throw error;
  }
};

const deleteFolder = async (id) => {
  try {
    const response = await api.delete(`/folders/${id}`);
    return response.status === 204;
  } catch (error) {
    console.error('Error deleting folder:', error);
    throw error;
  }
};

const folderService = {
  fetchFolders,
  createFolder,
  updateFolder,
  deleteFolder
};

export default folderService;
