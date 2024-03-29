import { useState, useEffect } from "react";

type Props = {
  initialValue: number;
  interval: number;
  isCountdown?: boolean;
  shouldStart?: boolean;
};

type Time = {
  seconds?: string;
  minutes?: string;
};

const Timer = ({
  interval,
  isCountdown = true,
  initialValue,
  shouldStart = false,
}: Props) => {
  const [time, setTime] = useState<Time>({});
  const [seconds, setSeconds] = useState<number>(initialValue);

  const secondsToTime = (secs: number): Time => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.ceil(secs % 60);

    return {
      minutes: `${minutes < 10 ? "0" : ""}${minutes}`,
      seconds: `${seconds < 10 ? "0" : ""}${seconds}`,
    };
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (shouldStart) {
      timer = setInterval(() => {
        if (isCountdown) {
          setSeconds((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
        } else {
          setSeconds((prevTime) => prevTime + 1);
        }
      }, interval);
    }

    return () => {
      clearInterval(timer);
      setSeconds(0);
      setTime({});
    };
  }, [interval, isCountdown, shouldStart]);

  useEffect(() => {
    setTime(secondsToTime(seconds));
  }, [seconds]);

  return (
    <div className="my-[10px] mx-auto p-[5px] max-w-40 font-bold text-lg border-2 text-center rounded-lg border-solid border-primary">
      {time.minutes}:{time.seconds}
    </div>
  );
};

export default Timer;
