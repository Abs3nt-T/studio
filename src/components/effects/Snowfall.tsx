'use client';
import React, { useState, useEffect } from 'react';

const Snowfall: React.FC = () => {
  const [snowflakes, setSnowflakes] = useState<JSX.Element[]>([]);

  useEffect(() => {
    // This code will only run on the client, after the component has mounted.
    const generateSnowflakes = () => {
      return Array.from({ length: 100 }, (_, i) => {
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
    };
    
    setSnowflakes(generateSnowflakes());
  }, []); // Empty dependency array ensures this runs once on mount

  return <div className="snow-container">{snowflakes}</div>;
};

export { Snowfall };
