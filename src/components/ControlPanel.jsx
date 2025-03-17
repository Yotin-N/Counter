import React, { useState } from "react";

const ControlPanel = ({
  visible,
  onAddSet,
  onResetAll,
  onResetCurrent,
  countdownSets,
  isCountingDown,
  setIsCountingDown,
  onMouseLeave,
  onEditSet,
  onRemoveSet,
  currentSetIndex,
  onSelectSet,
}) => {
  const [newSetValue, setNewSetValue] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  const handleAddSet = () => {
    const value = parseInt(newSetValue);
    if (!isNaN(value) && value > 0) {
      onAddSet(value);
      setNewSetValue("");
    }
  };

  const handleStartStop = () => {
    setIsCountingDown(!isCountingDown);
  };

  const startEditingSet = (index, currentValue) => {
    setEditingIndex(index);
    setEditValue(currentValue.toString());
  };

  const saveEdit = (index) => {
    const value = parseInt(editValue);
    if (!isNaN(value) && value > 0) {
      onEditSet(index, value);
      setEditingIndex(null);
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddSet();
    }
  };

  return (
    <div
      className={`control-panel ${visible ? "visible" : "hidden"}`}
      onMouseLeave={onMouseLeave}
    >
      <div className="control-section">
        <h3>Add Countdown Set</h3>
        <div className="input-group">
          <input
            type="number"
            min="1"
            value={newSetValue}
            onChange={(e) => setNewSetValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Starting value"
          />
          <button onClick={handleAddSet}>Add</button>
        </div>
      </div>

      <div className="control-section">
        <h3>Manage Sets</h3>
        {countdownSets.length === 0 ? (
          <p>No countdown sets added yet</p>
        ) : (
          <ul className="sets-list">
            {countdownSets.map((set, index) => (
              <li
                key={index}
                className={index === currentSetIndex ? "current-set" : ""}
                onClick={() => onSelectSet(index)}
              >
                {editingIndex === index ? (
                  <div className="edit-set-form">
                    <input
                      type="number"
                      min="1"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      autoFocus
                    />
                    <div className="edit-buttons">
                      <button
                        onClick={() => saveEdit(index)}
                        className="save-btn"
                      >
                        Save
                      </button>
                      <button onClick={cancelEdit} className="cancel-btn">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="set-item">
                    <span className="set-number">
                      Set {index + 1}: {set.currentValue} / {set.startValue}
                    </span>
                    <div className="set-actions">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditingSet(index, set.startValue);
                        }}
                        className="icon-btn edit-btn"
                        title="Edit set"
                      >
                        ✎
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveSet(index);
                        }}
                        className="icon-btn delete-btn"
                        title="Remove set"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="control-section">
        <div className="button-group">
          {countdownSets.length > 0 && (
            <button onClick={handleStartStop} className="primary-btn">
              {isCountingDown ? "Pause" : "Start"}
            </button>
          )}
          <button onClick={onResetCurrent}>Reset Set</button>
          <button onClick={onResetAll}>Reset All</button>
        </div>
      </div>

      <div className="instructions">
        <h3>Instructions</h3>
        <ul>
          <li>
            Press <kbd>Enter</kbd> or <kbd>Space</kbd> to decrease number
          </li>
          <li>
            Press <kbd>Esc</kbd> to toggle controls
          </li>
          <li>
            Press <kbd>Ctrl+R</kbd> to reset current set
          </li>
          <li>Click on a set to select it</li>
        </ul>
      </div>
    </div>
  );
};

export default ControlPanel;
