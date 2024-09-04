import React, { useState } from 'react';
import './NoteCard.css';

function NoteCard({ note, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState({ ...note });
  const [error, setError] = useState('');

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editedNote.title.trim() || !editedNote.content.trim()) {
      setError('Title and content cannot be empty');
      return;
    }
    setError('');
    onUpdate(note.id, editedNote);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedNote({ ...note });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedNote(prev => ({ ...prev, [name]: value }));
    setError('');  // Clear error when user starts typing
  };

  if (isEditing) {
    return (
      <div className="note-card editing">
        <input
          type="text"
          name="title"
          value={editedNote.title}
          onChange={handleChange}
          className="edit-title"
          placeholder="Enter title"
        />
        <textarea
          name="content"
          value={editedNote.content}
          onChange={handleChange}
          className="edit-content"
          placeholder="Enter content"
        />
        {error && <p className="error-message">{error}</p>}
        <div className="edit-actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="note-card">
      <div onClick={handleEdit}>
        <h3>{note.title}</h3>
        <p>{note.content}</p>
      </div>
      <button onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}>Delete</button>
    </div>
  );
}

export default NoteCard;
