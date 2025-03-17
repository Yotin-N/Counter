// src/App.jsx
import { useState, useEffect, useCallback } from "react";
import "./App.css";
import CountdownDisplay from "./components/CountdownDisplay";
import ControlPanel from "./components/ControlPanel";

function App() {
  const [countdownSets, setCountdownSets] = useState(() => {
    // Load from localStorage on initial render
    const savedSets = localStorage.getItem("countdownSets");
    return savedSets ? JSON.parse(savedSets) : [];
  });

  const [currentSetIndex, setCurrentSetIndex] = useState(() => {
    // Load current set index from localStorage
    const savedIndex = localStorage.getItem("currentSetIndex");
    return savedIndex ? parseInt(savedIndex) : 0;
  });

  const [showControls, setShowControls] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(() => {
    // Load counting state from localStorage
    const savedState = localStorage.getItem("isCountingDown");
    return savedState ? JSON.parse(savedState) : false;
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("countdownSets", JSON.stringify(countdownSets));
  }, [countdownSets]);

  useEffect(() => {
    localStorage.setItem("currentSetIndex", currentSetIndex.toString());
  }, [currentSetIndex]);

  useEffect(() => {
    localStorage.setItem("isCountingDown", JSON.stringify(isCountingDown));
  }, [isCountingDown]);

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
    setIsCountingDown(false);
    // Note: No longer resetting currentSetIndex to 0
  };

  const resetCurrentSet = () => {
    if (countdownSets.length === 0) return;

    setCountdownSets((prevSets) => {
      const newSets = [...prevSets];
      newSets[currentSetIndex] = {
        ...newSets[currentSetIndex],
        currentValue: newSets[currentSetIndex].startValue,
      };
      return newSets;
    });
    setIsCountingDown(false);
  };

  const decrementCurrentSet = useCallback(() => {
    if (countdownSets.length === 0 || !isCountingDown) return;

    setCountdownSets((prevSets) => {
      const newSets = [...prevSets];
      // Only decrement if the current value is greater than zero
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
      // Support both Enter and Space for counting
      if (e.key === "Enter" || e.code === "Space") {
        e.preventDefault(); // Prevent page scrolling on spacebar

        if (!isCountingDown && countdownSets.length > 0) {
          setIsCountingDown(true);
        } else {
          decrementCurrentSet();
        }
      } else if (e.key === "Escape") {
        setShowControls((prev) => !prev);
      } else if (e.key === "r" && e.ctrlKey) {
        // Reset only the current set instead of all sets
        resetCurrentSet();
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    decrementCurrentSet,
    isCountingDown,
    countdownSets.length,
    currentSetIndex,
  ]);

  // Move to next set when current set reaches zero
  // Removing this effect since we want sets to remain at zero
  // Instead, we'll let the user manually choose the next set

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

  // Change current set manually
  const changeCurrentSet = (index) => {
    setCurrentSetIndex(index);
  };

  const currentValue = countdownSets[currentSetIndex]?.currentValue ?? 0;

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
          onResetAll={resetAllSets}
          onResetCurrent={resetCurrentSet}
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
          onSelectSet={changeCurrentSet}
        />
      </div>
    </div>
  );
}

export default App;
