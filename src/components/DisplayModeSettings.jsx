import React, { useEffect, useState } from "react";
// Import the image directly - ensure this path is correct relative to this component
import workImage from "../assets/work.png";

const CountdownDisplay = ({
  currentValue,
  isCountingDown,
  showNextSetHint,
  fontColor,
  backgroundColor,
  displayMode = "normal",
  mouseClickEnabled = true,
}) => {
  const [sizeClass, setSizeClass] = useState("");
  const [imageError, setImageError] = useState(false);

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
    backgroundColor:
      displayMode === "black-screen" ? "#000000" : backgroundColor,
    color: fontColor,
    // Set cursor style based on whether mouse clicks are enabled
    cursor: mouseClickEnabled ? "pointer" : "default",
  };

  // Work image display mode
  if (displayMode === "work-image") {
    return (
      <div className="countdown-display" style={customStyles}>
        <div className="work-image-container">
          {imageError ? (
            <div
              style={{
                color: fontColor,
                textAlign: "center",
                padding: "20px",
                fontSize: "1.2rem",
              }}
            >
              Image could not be loaded. Please check the image path.
            </div>
          ) : (
            <img
              src={workImage}
              alt="Work"
              className="work-image"
              onError={() => setImageError(true)}
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="countdown-display" style={customStyles}>
      {displayMode === "normal" && (
        <div
          className={`current-number ${sizeClass}`}
          style={{ color: fontColor }}
        >
          <span>{currentValue}</span>
        </div>
      )}

      {!isCountingDown && currentValue > 0 && displayMode === "normal" && (
        <div className="start-hint">
          {mouseClickEnabled
            ? "Press Enter/Space or Click"
            : "Press Enter or Space"}
        </div>
      )}

      {showNextSetHint && displayMode === "normal" && (
        <div className="next-set-hint">Press Shift+N to go to the next set</div>
      )}
    </div>
  );
};

export default CountdownDisplay;
