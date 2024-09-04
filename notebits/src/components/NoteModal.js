import React, { useState, useEffect } from 'react';
import './NoteModal.css';
import TagSelector from './TagSelector';

function NoteModal({ note, onClose, onSave, onDelete, tags, onAddTag }) {
  const [editedNote, setEditedNote] = useState({ ...note, tags: note?.tags || [] });

  useEffect(() => {
    setEditedNote({ ...note });
  }, [note]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedNote(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTag = (tag) => {
    if (!editedNote.tags.includes(tag)) {
      setEditedNote(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      if (onAddTag) {
        onAddTag(tag);
      }
    }
  };

  const handleRemoveTag = (tag) => {
    setEditedNote(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleTagChange = (selectedTags) => {
    setEditedNote(prev => ({
      ...prev,
      tags: selectedTags
    }));
  };

  const handleSave = () => {
    onSave(editedNote);
    onClose();
  };

  const handleDelete = async () => {
    if (note.id) {
      await onDelete(note.id);
      onClose();
    }
  };

  return (
    <div className="note-modal-overlay" onClick={onClose}>
      <div className="note-modal-content" onClick={e => e.stopPropagation()}>
        <input
          type="text"
          name="title"
          value={editedNote.title}
          onChange={handleChange}
          className="note-modal-title"
          placeholder="Note Title"
        />
        <textarea
          name="content"
          value={editedNote.content}
          onChange={handleChange}
          className="note-modal-content"
          placeholder="Note Content"
        />
        <TagSelector
          tags={tags || []}
          selectedTags={editedNote.tags}
          onTagChange={handleTagChange}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
        />
        <div className="note-modal-footer">
          <button onClick={handleSave} className="save-btn">Save</button>
          {note.id && (
            <button onClick={handleDelete} className="delete-btn">Delete</button>
          )}
          <button onClick={onClose} className="close-btn">Close</button>
        </div>
      </div>
    </div>
  );
}

export default NoteModal;