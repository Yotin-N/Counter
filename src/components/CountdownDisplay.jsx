import React, { useEffect, useState } from "react";

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

  // External image URL
  const externalImageUrl =
    "https://graduate.buu.ac.th/wp-content/uploads/2024/08/Banner01.png";

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

  // Work image display mode - using external URL with fullscreen styling
  if (displayMode === "work-image") {
    return (
      <div
        className="countdown-display"
        style={{
          ...customStyles,
          position: "fixed", // Changed to fixed positioning
          top: 0,
          left: 0,
          width: "100vw", // Use viewport width
          height: "100vh", // Use viewport height
          margin: 0,
          padding: 0,
          overflow: "hidden", // Prevent scrolling
        }}
      >
        <div
          className="work-image-container"
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {imageError ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: fontColor,
                textAlign: "center",
                padding: "20px",
              }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: "15px" }}>
                Unable to load external image
              </div>
              <div style={{ fontSize: "1rem" }}>
                Please check your internet connection
              </div>
            </div>
          ) : (
            <img
              src={externalImageUrl}
              alt="Banner"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover", // Changed to cover
                objectPosition: "center", // Center the image
                position: "absolute",
                top: 0,
                left: 0,
              }}
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
