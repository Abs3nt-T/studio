'use client';
import React from 'react';

const Snowfall: React.FC = () => {
  // Create an array of snowflakes to render
  const snowflakes = Array.from({ length: 100 }, (_, i) => {
    const style: React.CSSProperties & { '--i': number } = {
      '--i': Math.random(),
      left: `${Math.random() * 100}vw`,
      animationDuration: `${2 + Math.random() * 8}s`, // between 2 and 10 seconds
      animationDelay: `${Math.random() * 10}s`,
    };
    return (
      <div key={i} className="snowflake" style={style}>
        •
      </div>
    );
  });

  return <div className="snow-container">{snowflakes}</div>;
};

export { Snowfall };
