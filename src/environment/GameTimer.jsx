import React, { useState, useEffect } from 'react';

const TimerComponent = () => {
  const [isActive, setIsActive] = useState(false);
  const [isThreeSecondCountdown, setIsThreeSecondCountdown] = useState(false);
  const [isTwentySecondTimer, setIsTwentySecondTimer] = useState(false);

  useEffect(() => {
    let timer1;
    let timer2;

    if (isActive) {
      setIsThreeSecondCountdown(true);

      timer1 = setTimeout(() => {
        setIsThreeSecondCountdown(false);
        setIsTwentySecondTimer(true);

        timer2 = setTimeout(() => {
          setIsTwentySecondTimer(false);
          setIsActive(false);
        }, 20000);
      }, 3000);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isActive]);

  const startTimer = () => {
    setIsActive(true);
  };

  const deactivateTimer = () => {
    setIsActive(false);
    setIsThreeSecondCountdown(false);
    setIsTwentySecondTimer(false);
  };

  return (
    <div>
      <button onClick={startTimer}>Start Timer</button>
      <button onClick={deactivateTimer}>Deactivate Timer</button>
      <div>
        Current State:
        {isActive ? (
          <span>
            {isThreeSecondCountdown
              ? '3 Second Countdown'
              : isTwentySecondTimer
              ? '20 Second Timer'
              : 'Active'}
          </span>
        ) : (
          <span>Deactivated</span>
        )}
      </div>
    </div>
  );
};

export default TimerComponent;
