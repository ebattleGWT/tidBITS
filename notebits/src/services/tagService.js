import api from './api';

const getTags = async () => {
  try {
    const response = await api.get('/tags');
    return response.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
};

const updateTags = async (tags) => {
  try {
    const response = await api.put('/tags', { tags });
    return response.data;
  } catch (error) {
    console.error('Error updating tags:', error);
    throw error;
  }
};

const tagService = {
  getTags,
  updateTags
};

export default tagService;
