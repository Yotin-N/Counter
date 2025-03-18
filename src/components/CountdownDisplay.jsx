// src/components/CountdownDisplay.jsx
import React, { useEffect, useState } from "react";

const CountdownDisplay = ({ currentValue, isCountingDown, showNextSetHint }) => {
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

  return (
    <div className="countdown-display">
      <div className={`current-number ${sizeClass}`}>
        <span>{currentValue}</span>
      </div>

      {!isCountingDown && currentValue > 0 && (
        <div className="start-hint">Press Enter or Space</div>
      )}

      {showNextSetHint && (
        <div className="next-set-hint">
          Press Shift+N to go to the next set
        </div>
      )}
    </div>
  );
};

export default CountdownDisplay;