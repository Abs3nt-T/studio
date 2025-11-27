
'use client';

import React, { useState, MouseEvent } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';

interface Particle {
  id: number;
  style: React.CSSProperties & { '--x-end': string; '--y-end': string };
  content: string;
}

export const SnowBurstButton: React.FC<ButtonProps> = ({ onClick, children, ...props }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  let particleId = 0;

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    // Trigger original onClick if it exists
    onClick?.(e);

    // Create a burst of particles
    const newParticles: Particle[] = Array.from({ length: 20 }).map(() => {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 30 + 20; // 20px to 50px
      const xEnd = `${Math.cos(angle) * distance}px`;
      const yEnd = `${Math.sin(angle) * distance}px`;
      const size = `${Math.random() * 8 + 6}px`; // 6px to 14px

      return {
        id: particleId++,
        style: {
          left: '50%',
          top: '50%',
          fontSize: size,
          '--x-end': xEnd,
          '--y-end': yEnd,
        },
        content: '❄️',
      };
    });

    setParticles(p => [...p, ...newParticles]);

    // Clean up particles after animation
    setTimeout(() => {
      setParticles([]);
    }, 800);
  };

  return (
    <Button onClick={handleClick} {...props} className={`relative overflow-hidden animated-glow-button ${props.className}`}>
      {children}
      {particles.map((particle) => (
        <span key={particle.id} className="snow-particle" style={particle.style}>
          {particle.content}
        </span>
      ))}
    </Button>
  );
};
