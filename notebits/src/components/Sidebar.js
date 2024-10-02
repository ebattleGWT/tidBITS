import React from 'react';
import FolderList from './FolderList';
import './Sidebar.css';

function Sidebar({ tags, folders, onLogout, onCreateNote, onCreateFolder, isOpen, onClose, onTagClick, selectedTag, onMoveToFolder }) {
  const handleDragStart = (e, type, id) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ type, id }));
  };

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <h2>Tags</h2>
        <ul className="tag-list">
          {tags.map(tag => (
            <li
              key={tag}
              className={`tag-item ${selectedTag === tag ? 'selected' : ''}`}
              onClick={() => onTagClick(tag)}
              draggable
              onDragStart={(e) => handleDragStart(e, 'TAG', tag)}
            >
              {tag}
            </li>
          ))}
        </ul>
        <FolderList 
          folders={folders} 
          onMoveToFolder={onMoveToFolder}
          onCreateFolder={onCreateFolder}
        />
        <div className="sidebar-actions">
          <button onClick={onCreateNote}>Add Note</button>
          <button onClick={onCreateFolder}>Add Folder</button>
          <button onClick={onLogout}>Logout</button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;