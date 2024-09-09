import { useState, useCallback, useEffect } from 'react';
import noteService from '../services/noteService';
import tagService from '../services/tagService';

export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);

  const fetchNotes = useCallback(async (tag) => {
    try {
      const response = await noteService.fetchNotes(tag);
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

  useEffect(() => {
    fetchNotes();
    fetchTags();
  }, [fetchNotes, fetchTags]);

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

  return { notes, tags, fetchNotes, createNote, updateNote, deleteNote, fetchTags };
}
