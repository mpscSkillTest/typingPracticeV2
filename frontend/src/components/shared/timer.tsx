import { useState, useEffect, useRef } from "react";

type Props = {
  initialValue: number;
  interval: number;
  isCountdown?: boolean;
  shouldStart?: boolean;
  shouldStop?: boolean;
  updateDuration?: (duration: number) => void;
};

export type Time = {
  seconds?: string;
  minutes?: string;
};

const Timer = ({
  interval,
  isCountdown = true,
  initialValue,
  shouldStart = false,
  shouldStop = false,
  updateDuration,
}: Props) => {
  const [time, setTime] = useState<Time>({});
  const [seconds, setSeconds] = useState<number>(initialValue);
  const timer = useRef<NodeJS.Timeout | undefined>(undefined);

  const secondsToTime = (secs: number): Time => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.ceil(secs % 60);

    return {
      minutes: `${minutes < 10 ? "0" : ""}${minutes}`,
      seconds: `${seconds < 10 ? "0" : ""}${seconds}`,
    };
  };

  useEffect(() => {
    if (shouldStart) {
      timer.current = setInterval(() => {
        if (isCountdown) {
          setSeconds((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
        } else {
          setSeconds((prevTime) => prevTime + 1);
        }
      }, interval);
    }

    return () => {
      clearInterval(timer.current);
    };
  }, [interval, isCountdown, shouldStart]);

  useEffect(() => {
    setTime(secondsToTime(seconds));
    if (typeof updateDuration === "function") {
      if (isCountdown) {
        updateDuration(initialValue - seconds);
      } else {
        updateDuration(seconds);
      }
    }
  }, [seconds]);

  useEffect(() => {
    if (shouldStop) {
      clearInterval(timer.current);
    }
  }, [shouldStop]);

  return (
    <div className="my-[10px] mx-auto p-[5px] w-[200px] font-bold text-lg border-2 text-center rounded-lg border-solid border-primary">
      {time.minutes}:{time.seconds}
    </div>
  );
};

export default Timer;
