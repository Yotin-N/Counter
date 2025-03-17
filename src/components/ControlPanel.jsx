// src/components/ControlPanel.jsx
import React, { useState } from "react";
import Footer from "./Footer";

const ControlPanel = ({
  visible,
  onAddSet,
  onResetAll,
  onResetCurrent,
  countdownSets,
  isCountingDown,
  setIsCountingDown,
  // onMouseLeave,
  onEditSet,
  onRemoveSet,
  currentSetIndex,
  onSelectSet,
  countdownMode,
  setCountdownMode,
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
    <div className={`control-panel ${visible ? "visible" : "hidden"}`}>
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
                    <div className="set-details">
                      <div className="set-icon">{index + 1}</div>
                      <div className="set-values">
                        <div className="set-name">Set {index + 1}</div>
                        <div className="set-progress">
                          {set.currentValue} / {set.startValue}
                        </div>
                      </div>
                    </div>
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

      {/* New countdown mode selection */}
      <div className="control-section mode-section">
        <h3>Count Mode</h3>
        <div className="mode-selection">
          <div
            className={`mode-option ${
              countdownMode === "single" ? "selected" : ""
            }`}
            onClick={() => setCountdownMode("single")}
          >
            Single Press
          </div>
          <div
            className={`mode-option ${
              countdownMode === "hold" ? "selected" : ""
            }`}
            onClick={() => setCountdownMode("hold")}
          >
            Hold Mode
          </div>
        </div>
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
          <li>Click on the display area to decrease when counting</li>
          <li>Move mouse to the right edge to show controls</li>
        </ul>
      </div>

      <Footer isCountingDown={false} />
    </div>
  );
};

export default ControlPanel;
