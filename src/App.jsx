// src/App.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import "./App.css";
import CountdownDisplay from "./components/CountdownDisplay";
import ControlPanel from "./components/ControlPanel";
import Footer from "./components/Footer";

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

  // Track if a key or mouse button is currently being held down
  const [isKeyHeld, setIsKeyHeld] = useState(false);
  const [isMouseHeld, setIsMouseHeld] = useState(false);

  // New state for control panel indicator
  const [showControlIndicator, setShowControlIndicator] = useState(false);

  // Countdown mode selection: 'single' or 'hold'
  const [countdownMode, setCountdownMode] = useState(() => {
    const savedMode = localStorage.getItem("countdownMode");
    return savedMode || "single";
  });

  // Reference to the display area for click handling
  const displayRef = useRef(null);

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

  useEffect(() => {
    localStorage.setItem("countdownMode", countdownMode);
  }, [countdownMode]);

  // Show control indicator periodically if controls are hidden
  useEffect(() => {
    if (!showControls && !isCountingDown) {
      // Show the indicator every 30 seconds for 5 seconds
      const indicatorInterval = setInterval(() => {
        setShowControlIndicator(true);

        // Hide it after 5 seconds
        setTimeout(() => {
          setShowControlIndicator(false);
        }, 5000);
      }, 30000);

      // Also show it initially for new users
      if (countdownSets.length === 0) {
        setShowControlIndicator(true);
        setTimeout(() => {
          setShowControlIndicator(false);
        }, 5000);
      }

      return () => {
        clearInterval(indicatorInterval);
      };
    } else {
      setShowControlIndicator(false);
    }
  }, [showControls, isCountingDown, countdownSets.length]);

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

  // Handle keyboard events for counting
  useEffect(() => {
    // These keys will trigger the countdown
    const countKeys = ["Enter", "Space"];

    const handleKeyDown = (e) => {
      // Check if it's one of our count keys
      if (countKeys.includes(e.code)) {
        e.preventDefault(); // Prevent page scrolling on spacebar

        // Only process if the key wasn't already being held down
        if (!isKeyHeld) {
          setIsKeyHeld(true);

          if (!isCountingDown && countdownSets.length > 0) {
            setIsCountingDown(true);
          } else if (isCountingDown) {
            if (countdownMode === "single") {
              // For single mode, manually decrement on each press
              decrementCurrentSet();
            } else if (countdownMode === "hold") {
              // For hold mode, decrement once immediately
              decrementCurrentSet();
            }
          }
        }
      } else if (e.key === "Escape") {
        setShowControls((prev) => !prev);
      } else if (e.key === "r" && e.ctrlKey) {
        // Reset only the current set instead of all sets
        resetCurrentSet();
        e.preventDefault();
      }
    };

    const handleKeyUp = (e) => {
      // Reset key held state when the key is released
      if (countKeys.includes(e.code)) {
        setIsKeyHeld(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    decrementCurrentSet,
    isCountingDown,
    countdownSets.length,
    currentSetIndex,
    countdownMode,
    isKeyHeld,
  ]);

  // Auto-decrement timer for hold mode
  useEffect(() => {
    let intervalId;
    let initialDelay;

    // Start auto-repeat when a key or mouse is held in hold mode
    if (
      (isKeyHeld || isMouseHeld) &&
      isCountingDown &&
      countdownMode === "hold" &&
      countdownSets.length > 0
    ) {
      // First wait 500ms before starting auto-repeat (similar to keyboard behavior)
      initialDelay = setTimeout(() => {
        // Then start repeating at 100ms intervals
        intervalId = setInterval(() => {
          decrementCurrentSet();
        }, 100); // Fast repeat rate once holding begins
      }, 500); // Initial delay before auto-repeat starts
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (initialDelay) clearTimeout(initialDelay);
    };
  }, [
    isKeyHeld,
    isMouseHeld,
    isCountingDown,
    countdownMode,
    countdownSets.length,
    decrementCurrentSet,
  ]);

  // Handle mouse movement to show/hide controls
  const handleMouseMove = (e) => {
    // Show controls when mouse is near the right edge of the screen
    const edgeThreshold = 50;
    const { clientX } = e;
    const { innerWidth } = window;

    if (clientX >= innerWidth - edgeThreshold) {
      setShowControls(true);
    } else if (showControls && clientX < innerWidth - 350) {
      // Hide controls when mouse moves away from the panel
      setShowControls(false);
    }
  };

  // Handle mouse clicks on the display
  const handleDisplayMouseDown = () => {
    if (showControls) {
      // If controls are visible, don't trigger countdown actions
      return;
    }

    // Only process if the mouse wasn't already being held down
    if (!isMouseHeld) {
      setIsMouseHeld(true);

      if (!isCountingDown && countdownSets.length > 0) {
        setIsCountingDown(true);
      } else if (isCountingDown) {
        if (countdownMode === "single") {
          // For single mode, manually decrement on each click
          decrementCurrentSet();
        } else if (countdownMode === "hold") {
          // For hold mode, decrement once immediately
          decrementCurrentSet();
        }
      }
    }
  };

  // Reset mouse held state on mouse up
  const handleDisplayMouseUp = () => {
    setIsMouseHeld(false);
  };

  // Change current set manually
  const changeCurrentSet = (index) => {
    setCurrentSetIndex(index);
  };

  const currentValue = countdownSets[currentSetIndex]?.currentValue ?? 0;

  return (
    <div className="app-container" onMouseMove={handleMouseMove}>
      {/* Control panel indicator */}
      <div
        className={`control-panel-indicator ${
          showControlIndicator ? "visible" : "hidden"
        }`}
      />

      <div
        className="display-container"
        onMouseDown={handleDisplayMouseDown}
        onMouseUp={handleDisplayMouseUp}
        onMouseLeave={handleDisplayMouseUp}
        ref={displayRef}
      >
        <CountdownDisplay
          currentValue={currentValue}
          isCountingDown={isCountingDown}
        />

        <ControlPanel
          visible={showControls || false}
          onAddSet={addCountdownSet}
          onResetAll={resetAllSets}
          onResetCurrent={resetCurrentSet}
          countdownSets={countdownSets}
          isCountingDown={isCountingDown}
          setIsCountingDown={setIsCountingDown}
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
          countdownMode={countdownMode}
          setCountdownMode={setCountdownMode}
        />
      </div>
    </div>
  );
}

export default App;
