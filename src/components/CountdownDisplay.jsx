import React from "react";

const CountdownDisplay = ({ currentValue, isCountingDown }) => {
  return (
    <div className="countdown-display">
      <div className="current-number">{currentValue}</div>
      {!isCountingDown && currentValue > 0 && (
        <div className="start-hint">Press Enter</div>
      )}
    </div>
  );
};

export default CountdownDisplay;
