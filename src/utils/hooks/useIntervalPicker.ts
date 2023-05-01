import { useEffect, useState } from "react";

export default function useIntervalPicker<Type>(items: Type[], timeMs: number) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (currentIndex === items.length - 1) {
        setCurrentIndex(0);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    }, timeMs);

    return () => clearInterval(intervalId);
  }, [currentIndex, items, timeMs]);

  const picked = items[currentIndex] as Type;

  return picked;
}
