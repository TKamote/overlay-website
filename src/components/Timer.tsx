import React, { useState, useEffect } from "react";
import "./Timer.css";

interface TimerProps {
  initialTime?: number; // in seconds
  isRunning?: boolean;
  onTimeUp?: () => void;
  displaySize?: "overlay" | "full-screen";
}

const Timer: React.FC<TimerProps> = ({
  initialTime = 300, // 5 minutes default
  isRunning = false,
  onTimeUp,
  displaySize = "full-screen",
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(isRunning);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsActive(false);
            onTimeUp?.();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onTimeUp]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setTimeLeft(initialTime);
    setIsActive(false);
  };

  return (
    <div className="timer-display" data-display-size={displaySize}>
      <h2>Timer</h2>
      <div className="timer">
        <div className="timer-display">
          <span className="timer-time">{formatTime(timeLeft)}</span>
        </div>
        <div className="timer-controls">
          <button className="timer-btn" onClick={toggleTimer}>
            {isActive ? "Pause" : "Start"}
          </button>
          <button className="timer-btn" onClick={resetTimer}>
            Reset
          </button>
        </div>
        <div className="timer-status">{isActive ? "Running" : "Stopped"}</div>
      </div>
    </div>
  );
};

export default Timer;
