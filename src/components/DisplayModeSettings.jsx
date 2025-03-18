// src/components/DisplayModeSettings.jsx
import React, { useState } from "react";

const DisplayModeSettings = ({
    isCountingDown,
    displayMode,
    setDisplayMode,
    workImageUrl,
    setWorkImageUrl
}) => {
    const [editingImageUrl, setEditingImageUrl] = useState(false);
    const [tempImageUrl, setTempImageUrl] = useState(workImageUrl);

    const handleDisplayModeChange = (mode) => {
        if (isCountingDown) return; // Prevent changing display mode while counting down
        setDisplayMode(mode);
    };

    const handleSaveImageUrl = () => {
        setWorkImageUrl(tempImageUrl);
        setEditingImageUrl(false);
    };

    return (
        <div className="control-section">
            <h3>Display Mode</h3>

            <div className="mode-selection">
                <div
                    className={`mode-option ${displayMode === "normal" ? "selected" : ""} ${isCountingDown ? "disabled-mode" : ""}`}
                    onClick={() => handleDisplayModeChange("normal")}
                >
                    Numbers
                </div>
                <div
                    className={`mode-option ${displayMode === "background-only" ? "selected" : ""} ${isCountingDown ? "disabled-mode" : ""}`}
                    onClick={() => handleDisplayModeChange("background-only")}
                >
                    Background Only
                </div>
                <div
                    className={`mode-option ${displayMode === "work-image" ? "selected" : ""} ${isCountingDown ? "disabled-mode" : ""}`}
                    onClick={() => handleDisplayModeChange("work-image")}
                >
                    Work Image
                </div>
            </div>

            <div className="mode-description">
                {displayMode === "normal" && "Shows countdown numbers"}
                {displayMode === "background-only" && "Shows only the background color, no numbers"}
                {displayMode === "work-image" && "Displays a work image instead of numbers"}
            </div>

            {/* Work Image URL setting */}
            {displayMode === "work-image" && (
                <div className="image-url-settings" style={{ marginTop: "15px" }}>
                    {editingImageUrl ? (
                        <div className="edit-set-form">
                            <input
                                type="text"
                                value={tempImageUrl}
                                onChange={(e) => setTempImageUrl(e.target.value)}
                                placeholder="Enter image URL"
                                disabled={isCountingDown}
                                style={{ marginBottom: "8px" }}
                            />
                            <div className="edit-buttons">
                                <button
                                    onClick={handleSaveImageUrl}
                                    className={`save-btn ${isCountingDown ? "disabled-btn" : ""}`}
                                    disabled={isCountingDown}
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditingImageUrl(false)}
                                    className="cancel-btn"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="color-selection-label">Image URL:</div>
                            <div className="input-group">
                                <input
                                    type="text"
                                    value={workImageUrl}
                                    disabled
                                    style={{ opacity: 0.7, fontSize: "0.8rem", overflow: "hidden", textOverflow: "ellipsis" }}
                                />
                                <button
                                    onClick={() => setEditingImageUrl(true)}
                                    disabled={isCountingDown}
                                    className={isCountingDown ? "disabled-btn" : ""}
                                    style={{ minWidth: "80px" }}
                                >
                                    Change
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="mode-shortcuts" style={{ marginTop: "10px", fontSize: "0.75rem", opacity: 0.7 }}>
                Quick Access: <kbd>Shift+1</kbd> for Background, <kbd>Shift+2</kbd> for Work Image
            </div>
        </div>
    );
};

export default DisplayModeSettings;