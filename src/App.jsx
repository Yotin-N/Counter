import { useState, useEffect, useCallback, useRef } from "react";
import "./App.css";
import CountdownDisplay from "./components/CountdownDisplay";
import ControlPanel from "./components/ControlPanel";

function App() {
  const [fontColor, setFontColor] = useState(() => {
    return localStorage.getItem('countdownFontColor') || "#ffee00";
  });

  const [backgroundColor, setBackgroundColor] = useState(() => {
    return localStorage.getItem('countdownBackgroundColor') || "#666363";
  });

  const [countdownSets, setCountdownSets] = useState(() => {
    const savedSets = localStorage.getItem("countdownSets");
    return savedSets ? JSON.parse(savedSets) : [];
  });

  const [currentSetIndex, setCurrentSetIndex] = useState(() => {

    const savedIndex = localStorage.getItem("currentSetIndex");
    return savedIndex ? parseInt(savedIndex) : 0;
  });

  const [showControls, setShowControls] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(() => {
    const savedState = localStorage.getItem("isCountingDown");
    return savedState ? JSON.parse(savedState) : false;
  });
  const [showNextSetHint, setShowNextSetHint] = useState(false);
  const [reachedZero, setReachedZero] = useState(false);


  const [isKeyHeld, setIsKeyHeld] = useState(false);
  const [isMouseHeld, setIsMouseHeld] = useState(false);

  const [showControlIndicator, setShowControlIndicator] = useState(false);


  const [countdownMode, setCountdownMode] = useState(() => {
    const savedMode = localStorage.getItem("countdownMode");
    return savedMode || "single";
  });


  const displayRef = useRef(null);


  useEffect(() => {
    localStorage.setItem('countdownFontColor', fontColor);
  }, [fontColor]);

  useEffect(() => {
    localStorage.setItem('countdownBackgroundColor', backgroundColor);
  }, [backgroundColor]);


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


  useEffect(() => {
    if (!showControls && !isCountingDown) {

      const indicatorInterval = setInterval(() => {
        setShowControlIndicator(true);


        setTimeout(() => {
          setShowControlIndicator(false);
        }, 5000);
      }, 30000);


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


  useEffect(() => {
    if (
      countdownSets.length > 0 &&
      currentSetIndex < countdownSets.length &&
      countdownSets[currentSetIndex].currentValue === 0 &&
      isCountingDown
    ) {

      setShowNextSetHint(true);
      setReachedZero(true);

      setIsCountingDown(false);
    } else if (
      countdownSets.length > 0 &&
      currentSetIndex < countdownSets.length &&
      countdownSets[currentSetIndex].currentValue > 0
    ) {

      setShowNextSetHint(false);
      setReachedZero(false);
    }
  }, [countdownSets, currentSetIndex, isCountingDown]);

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

      if (newSets[currentSetIndex].currentValue > 0) {
        newSets[currentSetIndex] = {
          ...newSets[currentSetIndex],
          currentValue: newSets[currentSetIndex].currentValue - 1,
        };
      }
      return newSets;
    });
  }, [countdownSets, currentSetIndex, isCountingDown]);

  const moveToNextSet = useCallback(() => {
    if (countdownSets.length <= 1) return;


    const nextIndex = (currentSetIndex + 1) % countdownSets.length;
    setCurrentSetIndex(nextIndex);

    setIsCountingDown(true);
  }, [countdownSets.length, currentSetIndex]);

  useEffect(() => {
    const countKeys = ["Enter", " ", "Space"];

    const handleKeyDown = (e) => {
      if (e.key === "N" && e.shiftKey && reachedZero) {
        e.preventDefault();
        moveToNextSet();
        return;
      }

      if (e.key === "R" && e.shiftKey) {
        e.preventDefault();
        resetCurrentSet();
        return;
      }

      if (countKeys.includes(e.code) || countKeys.includes(e.key)) {
        e.preventDefault();

        if (!isKeyHeld) {
          setIsKeyHeld(true);

          if (!isCountingDown && countdownSets.length > 0) {
            setIsCountingDown(true);
          } else if (isCountingDown) {
            if (countdownMode === "single") {
              decrementCurrentSet();
            } else if (countdownMode === "hold") {

              decrementCurrentSet();
            }
          }
        }
      } else if (e.key === "Escape") {
        setShowControls((prev) => !prev);
      }
    };

    const handleKeyUp = (e) => {

      if (countKeys.includes(e.code) || countKeys.includes(e.key)) {
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
    moveToNextSet,
    reachedZero,
    resetCurrentSet
  ]);


  useEffect(() => {
    let intervalId;
    let initialDelay;


    if (
      (isKeyHeld || isMouseHeld) &&
      isCountingDown &&
      countdownMode === "hold" &&
      countdownSets.length > 0
    ) {

      initialDelay = setTimeout(() => {

        intervalId = setInterval(() => {
          decrementCurrentSet();
        }, 100);
      }, 500);
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

  const handleMouseMove = (e) => {

    const edgeThreshold = 50;
    const { clientX } = e;
    const { innerWidth } = window;

    if (clientX >= innerWidth - edgeThreshold) {
      setShowControls(true);
    } else if (showControls && clientX < innerWidth - 350) {

      setShowControls(false);
    }
  };

  const handleDisplayMouseDown = () => {
    if (showControls) {
      return;
    }

    if (!isMouseHeld) {
      setIsMouseHeld(true);

      if (!isCountingDown && countdownSets.length > 0) {
        setIsCountingDown(true);
      } else if (isCountingDown) {
        if (countdownMode === "single") {

          decrementCurrentSet();
        } else if (countdownMode === "hold") {
          decrementCurrentSet();
        }
      }
    }
  };

  const handleDisplayMouseUp = () => {
    setIsMouseHeld(false);
  };

  const changeCurrentSet = (index) => {
    setCurrentSetIndex(index);
  };

  const currentValue = countdownSets[currentSetIndex]?.currentValue ?? 0;

  return (
    <div className="app-container" onMouseMove={handleMouseMove}>
      {/* Control panel indicator */}
      <div
        className={`control-panel-indicator ${showControlIndicator ? "visible" : "hidden"
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
          showNextSetHint={showNextSetHint}
          fontColor={fontColor}
          backgroundColor={backgroundColor}
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
          fontColor={fontColor}
          setFontColor={setFontColor}
          backgroundColor={backgroundColor}
          setBackgroundColor={setBackgroundColor}
        />
      </div>
    </div>
  );
}

export default App;