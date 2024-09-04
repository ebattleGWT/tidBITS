import React, { useState } from 'react';
import './TagMenu.css';

function TagMenu({ tag, onRenameTag, onDeleteTag, onChangeTagColor }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleRename = () => {
    const newName = prompt("Enter new tag name:", tag);
    if (newName && newName !== tag) {
      onRenameTag(tag, newName);
    }
    setIsOpen(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the tag "${tag}"?`)) {
      onDeleteTag(tag);
    }
    setIsOpen(false);
  };

  const handleChangeColor = () => {
    const newColor = prompt("Enter new color (e.g., #FF0000):");
    if (newColor) {
      onChangeTagColor(tag, newColor);
    }
    setIsOpen(false);
  };

  return (
    <div className="tag-menu">
      <button onClick={() => setIsOpen(!isOpen)} className="tag-menu-button">⋮</button>
      {isOpen && (
        <div className="tag-menu-dropdown">
          <button onClick={handleRename}>Rename</button>
          <button onClick={handleChangeColor}>Change Color</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
}

export default TagMenu;
