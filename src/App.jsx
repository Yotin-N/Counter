// src/App.jsx
import { useState, useEffect, useCallback } from "react";
import "./App.css";
import CountdownDisplay from "./components/CountdownDisplay";
import ControlPanel from "./components/ControlPanel";

function App() {
  const [countdownSets, setCountdownSets] = useState([]);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);

  const addCountdownSet = (startValue) => {
    setCountdownSets([
      ...countdownSets,
      { startValue, currentValue: startValue },
    ]);
  };

  const resetAllSets = () => {
    setCountdownSets(
      countdownSets.map((set) => ({ ...set, currentValue: set.startValue }))
    );
    setCurrentSetIndex(0);
    setIsCountingDown(false);
  };

  const decrementCurrentSet = useCallback(() => {
    if (countdownSets.length === 0 || !isCountingDown) return;

    setCountdownSets((prevSets) => {
      const newSets = [...prevSets];
      if (newSets[currentSetIndex].currentValue > 0) {
        newSets[currentSetIndex] = {
          ...newSets[currentSetIndex],
          currentValue: newSets[currentSetIndex].currentValue - 1,
        };
      }
      return newSets;
    });
  }, [countdownSets, currentSetIndex, isCountingDown]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        if (!isCountingDown && countdownSets.length > 0) {
          setIsCountingDown(true);
        } else {
          decrementCurrentSet();
        }
      } else if (e.key === "Escape") {
        setShowControls((prev) => !prev);
      } else if (e.key === "r" && e.ctrlKey) {
        resetAllSets();
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [decrementCurrentSet, isCountingDown, countdownSets.length]);

  // Move to next set when current set reaches zero
  useEffect(() => {
    if (countdownSets.length === 0 || !isCountingDown) return;

    const currentSet = countdownSets[currentSetIndex];
    if (currentSet && currentSet.currentValue === 0) {
      if (currentSetIndex < countdownSets.length - 1) {
        setCurrentSetIndex(currentSetIndex + 1);
      } else {
        // All sets completed
        setIsCountingDown(false);
      }
    }
  }, [countdownSets, currentSetIndex, isCountingDown]);

  // Handle mouse movement to show/hide controls
  const handleMouseMove = (e) => {
    if (!showControls) {
      // Show controls when mouse is near the edge of the screen
      const edgeThreshold = 50;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const isNearEdge =
        clientX <= edgeThreshold ||
        clientX >= innerWidth - edgeThreshold ||
        clientY <= edgeThreshold ||
        clientY >= innerHeight - edgeThreshold;

      if (isNearEdge) {
        setShowControls(true);
      }
    }
  };

  // Function to handle mouse leaving the control panel
  const handleControlPanelMouseLeave = () => {
    setShowControls(false);
  };

  const currentValue = countdownSets[currentSetIndex]?.currentValue ?? 0;
  // const totalSets = countdownSets.length;

  return (
    <div className="app-container" onMouseMove={handleMouseMove}>
      <div className="display-container">
        <CountdownDisplay
          currentValue={currentValue}
          isCountingDown={isCountingDown}
        />

        <ControlPanel
          visible={showControls}
          onAddSet={addCountdownSet}
          onReset={resetAllSets}
          countdownSets={countdownSets}
          isCountingDown={isCountingDown}
          setIsCountingDown={setIsCountingDown}
          onMouseLeave={handleControlPanelMouseLeave}
          onEditSet={(index, newValue) => {
            setCountdownSets((prevSets) => {
              const newSets = [...prevSets];
              newSets[index] = {
                startValue: newValue,
                currentValue: isCountingDown
                  ? newSets[index].currentValue
                  : newValue,
              };
              return newSets;
            });
          }}
          onRemoveSet={(index) => {
            setCountdownSets((prevSets) => {
              const newSets = [...prevSets];
              newSets.splice(index, 1);
              if (currentSetIndex >= newSets.length) {
                setCurrentSetIndex(Math.max(0, newSets.length - 1));
              }
              return newSets;
            });
          }}
          currentSetIndex={currentSetIndex}
        />
      </div>
    </div>
  );
}

export default App;
