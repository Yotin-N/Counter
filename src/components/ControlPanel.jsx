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
    if (isCountingDown) return; // Prevent adding sets while counting down

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
    if (isCountingDown) return; // Prevent editing while counting down

    setEditingIndex(index);
    setEditValue(currentValue.toString());
  };

  const saveEdit = (index) => {
    if (isCountingDown) return; // Prevent saving edits while counting down

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
    if (e.key === "Enter" && !isCountingDown) {
      handleAddSet();
    }
  };

  // Render a message when counting down


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
            disabled={isCountingDown}
          />
          <button
            onClick={handleAddSet}
            disabled={isCountingDown}
            className={isCountingDown ? "disabled-btn" : ""}
          >
            Add
          </button>
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
                className={`${index === currentSetIndex ? "current-set" : ""} ${isCountingDown ? "counting-set" : ""}`}
                onClick={() => !isCountingDown && onSelectSet(index)}
              >
                {editingIndex === index ? (
                  <div className="edit-set-form">
                    <input
                      type="number"
                      min="1"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      autoFocus
                      disabled={isCountingDown}
                    />
                    <div className="edit-buttons">
                      <button
                        onClick={() => saveEdit(index)}
                        className={`save-btn ${isCountingDown ? "disabled-btn" : ""}`}
                        disabled={isCountingDown}
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="cancel-btn"
                      >
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
                        className={`icon-btn edit-btn ${isCountingDown ? "disabled-btn" : ""}`}
                        title="Edit set"
                        disabled={isCountingDown}
                      >
                        ✎
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isCountingDown) onRemoveSet(index);
                        }}
                        className={`icon-btn delete-btn ${isCountingDown ? "disabled-btn" : ""}`}
                        title="Remove set"
                        disabled={isCountingDown}
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

      {/* Countdown mode selection */}
      <div className="control-section mode-section">
        <h3>Count Mode</h3>
        <div className="mode-selection">
          <div
            className={`mode-option ${countdownMode === "single" ? "selected" : ""
              } ${isCountingDown ? "disabled-mode" : ""}`}
            onClick={() => !isCountingDown && setCountdownMode("single")}
          >
            Single Press
          </div>
          <div
            className={`mode-option ${countdownMode === "hold" ? "selected" : ""
              } ${isCountingDown ? "disabled-mode" : ""}`}
            onClick={() => !isCountingDown && setCountdownMode("hold")}
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
          <button
            onClick={onResetCurrent}
            className={isCountingDown ? "disabled-btn" : ""}
            disabled={isCountingDown}
          >
            Reset Set
          </button>
          <button
            onClick={onResetAll}
            className={isCountingDown ? "disabled-btn" : ""}
            disabled={isCountingDown}
          >
            Reset All
          </button>
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
            Press <kbd>Shift+R</kbd> to reset current set
          </li>
          <li>
            Press <kbd>Shift+N</kbd> to move to next set when current set reaches 0
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