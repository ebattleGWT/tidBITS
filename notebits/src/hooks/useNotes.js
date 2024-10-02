import { useState, useCallback, useEffect } from 'react';
import noteService from '../services/noteService';
import tagService from '../services/tagService';
import folderService from '../services/folderService';

export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [folders, setFolders] = useState([]);

  const fetchNotes = useCallback(async (folderId) => {
    try {
      const response = await noteService.fetchNotes(folderId);
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  }, []);

  const fetchTags = useCallback(async () => {
    try {
      const fetchedTags = await tagService.getTags();
      setTags(fetchedTags);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  }, []);

  const fetchFolders = useCallback(async () => {
    try {
      const response = await folderService.fetchFolders();
      setFolders(response.data);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
    fetchTags();
    fetchFolders();
  }, [fetchNotes, fetchTags, fetchFolders]);

  const createNote = useCallback(async (note) => {
    try {
      const response = await noteService.createNote(note);
      setNotes(prevNotes => [response.data, ...prevNotes]);
      fetchTags(); // Refresh tags after creating a note
      return response.data;
    } catch (error) {
      console.error('Error creating note:', error);
    }
  }, [fetchTags]);

  const updateNote = useCallback(async (updatedNote) => {
    try {
      const response = await noteService.updateNote(updatedNote);
      setNotes(prevNotes => prevNotes.map(note => note.id === updatedNote.id ? response.data : note));
      fetchTags(); // Refresh tags after updating a note
      return response.data;
    } catch (error) {
      console.error('Error updating note:', error);
    }
  }, [fetchTags]);

  const deleteNote = useCallback(async (id) => {
    try {
      const success = await noteService.deleteNote(id);
      if (success) {
        setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
        fetchTags(); // Refresh tags after deleting a note
      }
      return success;
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  }, [fetchTags]);

  const createFolder = useCallback(async (folder) => {
    try {
      const response = await folderService.createFolder(folder);
      setFolders(prevFolders => [...prevFolders, response.data]);
      return response.data;
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  }, []);

  const updateFolder = useCallback(async (folder) => {
    try {
      const response = await folderService.updateFolder(folder);
      setFolders(prevFolders => prevFolders.map(f => f.id === folder.id ? response.data : f));
      return response.data;
    } catch (error) {
      console.error('Error updating folder:', error);
    }
  }, []);

  const deleteFolder = useCallback(async (folderId) => {
    try {
      await folderService.deleteFolder(folderId);
      setFolders(prevFolders => prevFolders.filter(folder => folder.id !== folderId));
      // Optionally, you might want to handle notes in the deleted folder
      setNotes(prevNotes => prevNotes.filter(note => note.folderId !== folderId));
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  }, []);

  return { 
    notes, 
    tags, 
    folders, 
    fetchNotes, 
    createNote, 
    updateNote, 
    deleteNote, 
    fetchTags,
    createFolder,
    updateFolder,
    deleteFolder
  };
}