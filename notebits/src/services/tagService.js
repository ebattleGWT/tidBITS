import api from './api';

export const fetchTags = async () => {
  try {
    const response = await api.get('/api/tags');
    return response.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
};

export const updateTags = async (tags) => {
  try {
    const response = await api.put('/api/tags', { tags });
    return response.data;
  } catch (error) {
    console.error('Error updating tags:', error);
    throw error;
  }
};

const tagService = {
  fetchTags,
  updateTags
};

export default tagService;
