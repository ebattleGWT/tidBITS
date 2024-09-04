import React, { useEffect } from 'react';
import TagMenu from './TagMenu';
import './Sidebar.css';

function Sidebar({ tags, selectedTag, setSelectedTag, onRenameTag, onDeleteTag, onChangeTagColor, isOpen, onToggle, onLogout, onCreateNote, onClose }) {
  useEffect(() => {
    console.log("Tags received in Sidebar:", tags);
  }, [tags]);

  const handleTagClick = (tag) => {
    console.log("Tag clicked:", tag);
    setSelectedTag(tag);
    onClose();
  };

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Schedule</h2>
        <ul className="tag-list">
          <li 
            onClick={() => handleTagClick(null)} 
            className={selectedTag === null ? 'active' : ''}
          >
            All Notes
          </li>
          {Array.isArray(tags) && tags.length > 0 ? (
            tags.map((tag, index) => (
              <li 
                key={`${tag}-${index}`}
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
            ))
          ) : (
            <li>No tags available (Length: {Array.isArray(tags) ? tags.length : 'not an array'})</li>
          )}
        </ul>
        <div className="sidebar-footer">
          <button onClick={onCreateNote}>New Note</button>
          <button onClick={onLogout}>Logout</button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;