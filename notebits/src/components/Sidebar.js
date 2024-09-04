import React from 'react';
import TagMenu from './TagMenu';
import './Sidebar.css';

function Sidebar({ tags, selectedTag, setSelectedTag, onRenameTag, onDeleteTag, onChangeTagColor, isOpen, onToggle, onLogout, onCreateNote, onClose }) {
  const handleTagClick = (tag) => {
    setSelectedTag(tag);
    onClose();
  };

  const handleCreateNote = () => {
    onCreateNote();
    onClose();
  };

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button className="close-button" onClick={onClose}>×</button>
        <h2>tidBITs</h2>
        <ul className="tag-list">
          <li 
            onClick={() => handleTagClick(null)} 
            className={selectedTag === null ? 'active' : ''}
          >
            All Notes
          </li>
          {tags.map(tag => (
            <li 
              key={tag} 
              className={selectedTag === tag ? 'active' : ''}
            >
              <span onClick={() => handleTagClick(tag)}>{tag}</span>
              <TagMenu
                tag={tag}
                onRenameTag={onRenameTag}
                onDeleteTag={onDeleteTag}
                onChangeTagColor={onChangeTagColor}
              />
            </li>
          ))}
        </ul>
        <div className="sidebar-footer">
          <button onClick={handleCreateNote}>New Note</button>
          <button onClick={onLogout}>Logout</button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;