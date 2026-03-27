import { useEffect, useState } from "react";
import { animate } from "framer-motion";

export function AnimatedCounter({ 
  value, 
  prefix = "", 
  suffix = "", 
  duration = 1 
}: { 
  value: number; 
  prefix?: string; 
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate: (val) => setCount(Math.round(val)),
    });

    return controls.stop;
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}
