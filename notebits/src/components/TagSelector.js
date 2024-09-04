import React, { useState } from 'react';
import './TagSelector.css';

function TagSelector({ tags = [], selectedTags = [], onTagChange, onAddTag, onRemoveTag }) {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag && !selectedTags.includes(newTag)) {
      onAddTag(newTag);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag) => {
    onRemoveTag(tag);
  };

  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      onTagChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagChange([...selectedTags, tag]);
    }
  };

  return (
    <div className="tag-selector">
      <div className="selected-tags">
        {selectedTags.map(tag => (
          <span key={tag} className="tag">
            {tag}
            <button onClick={() => handleRemoveTag(tag)}>×</button>
          </span>
        ))}
      </div>
      <div className="tag-input">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Add a new tag"
        />
        <button onClick={handleAddTag}>Add</button>
      </div>
      <div className="available-tags">
        {tags.map(tag => (
          <span
            key={tag}
            className={`tag ${selectedTags.includes(tag) ? 'selected' : ''}`}
            onClick={() => handleTagClick(tag)}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default TagSelector;