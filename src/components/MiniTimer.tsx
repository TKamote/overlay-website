import React, { useState, useEffect } from "react";

interface MiniTimerProps {
  initialTime?: number;
  isRunning?: boolean;
}

const MiniTimer: React.FC<MiniTimerProps> = ({
  initialTime = 300,
  isRunning = false,
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
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="mini-timer">
      <div className="mini-timer-time">{formatTime(timeLeft)}</div>
      <div className="mini-timer-status">{isActive ? "LIVE" : "PAUSED"}</div>
    </div>
  );
};

export default MiniTimer;
