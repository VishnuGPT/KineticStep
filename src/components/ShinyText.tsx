"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, useMotionValue, useAnimationFrame, useTransform } from 'framer-motion';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  color?: string;
  shineColor?: string;
  delay?: number;
  spread?: number;
  direction?: 'left' | 'right';
  yoyo?: boolean;
  pauseOnHover?: boolean;
}

const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 5,
  className = '',
  color = '#b5b5b5',
  shineColor = '#ffffff',
  delay = 0,
  spread = 100,
  direction = 'left',
  yoyo = false,
  pauseOnHover = false,
}) => {
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, [text]);

  useAnimationFrame((time) => {
    if (disabled || containerWidth === 0) return;
    
    const duration = speed * 1000;
    const elapsed = (time - delay * 1000) % duration;
    let progress = elapsed / duration;

    if (yoyo) {
      progress = Math.abs((progress * 2) - 1);
    }

    if (direction === 'right') {
      x.set((1 - progress) * (containerWidth + spread) - spread);
    } else {
      x.set(progress * (containerWidth + spread) - spread);
    }
  });

  const backgroundImage = useTransform(
    x,
    (value) =>
      `linear-gradient(to right, transparent, ${shineColor}, transparent), linear-gradient(${color}, ${color})`
  );

  const backgroundPosition = useTransform(x, (value) => `${value}px 0, 0 0`);
  const backgroundSize = `${spread}px 100%, 100% 100%`;

  return (
    <div
      ref={containerRef}
      className={`relative inline-block overflow-hidden ${className}`}
      style={{
        color: 'transparent',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
      }}
    >
      <motion.span
        style={{
          backgroundImage,
          backgroundSize,
          backgroundPosition,
          backgroundRepeat: 'no-repeat',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
        }}
      >
        {text}
      </motion.span>
    </div>
  );
};

export default ShinyText;