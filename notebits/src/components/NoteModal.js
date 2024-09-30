import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './NoteModal.css';
import TagSelector from './TagSelector';

function NoteModal({ note, onClose, onSave, onDelete, tags, onAddTag }) {
  const [editedNote, setEditedNote] = useState({ ...note, tags: note?.tags || [] });

  useEffect(() => {
    setEditedNote({ ...note });
  }, [note]);

  const handleChange = (content, delta, source, editor) => {
    setEditedNote(prev => ({ ...prev, content: content }));
  };

  const handleTitleChange = (e) => {
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

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  return (
    <div className="note-modal-overlay" onClick={onClose}>
      <div className="note-modal-content" onClick={e => e.stopPropagation()}>
        <input
          type="text"
          name="title"
          value={editedNote.title}
          onChange={handleTitleChange}
          className="note-modal-title"
          placeholder="Note Title"
        />
        <ReactQuill
          theme="snow"
          value={editedNote.content}
          onChange={handleChange}
          modules={modules}
          formats={formats}
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