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
                <div className="work-image-container">
                    <img src="../assets/work.jpg" alt="Work" className="work-image" />
                </div>
            )}

            <div className="mode-shortcuts" style={{ marginTop: "10px", fontSize: "0.75rem", opacity: 0.7 }}>
                Quick Access: <kbd>Shift+1</kbd> for Background, <kbd>Shift+2</kbd> for Work Image
            </div>
        </div>
    );
};

export default DisplayModeSettings;