// src/components/CountdownDisplay.jsx
import React, { useEffect, useState } from "react";

const CountdownDisplay = ({
  currentValue,
  isCountingDown,
  showNextSetHint,
  fontColor,
  backgroundColor,
  displayMode = "normal",
  workImageUrl
}) => {
  const [sizeClass, setSizeClass] = useState("");

  useEffect(() => {
    // Determine digit count and set appropriate size class
    const digitCount = currentValue.toString().length;

    if (digitCount <= 1) {
      setSizeClass("single-digit");
    } else if (digitCount === 2) {
      setSizeClass("double-digit");
    } else if (digitCount === 3) {
      setSizeClass("triple-digit");
    } else {
      setSizeClass("multi-digit");
    }
  }, [currentValue]);

  // Custom styles for the display based on selected colors
  const customStyles = {
    backgroundColor: backgroundColor,
    color: fontColor
  };

  // Work image display mode
  if (displayMode === "work-image") {
    return (
      <div className="countdown-display" style={customStyles}>
        <div className="work-image-container">
          <img
            src={workImageUrl}
            alt="Work"
            className="work-image"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="countdown-display" style={customStyles}>
      {displayMode === "normal" && (
        <div className={`current-number ${sizeClass}`} style={{ color: fontColor }}>
          <span>{currentValue}</span>
        </div>
      )}

      {!isCountingDown && currentValue > 0 && displayMode === "normal" && (
        <div className="start-hint">Press Enter or Space</div>
      )}

      {showNextSetHint && displayMode === "normal" && (
        <div className="next-set-hint">
          Press Shift+N to go to the next set
        </div>
      )}
    </div>
  );
};

export default CountdownDisplay;