import { useState, useEffect } from "react";

export function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState(targetDate - new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(targetDate - new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const isLive = timeLeft <= 0;

  return {
    live: isLive,
    days: Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60 * 24))),
    hours: Math.max(0, Math.floor((timeLeft / (1000 * 60 * 60)) % 24)),
    minutes: Math.max(0, Math.floor((timeLeft / (1000 * 60)) % 60)),
    seconds: Math.max(0, Math.floor((timeLeft / 1000) % 60)),
  };
}