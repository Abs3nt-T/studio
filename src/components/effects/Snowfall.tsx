'use client';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const Snowfall: React.FC = () => {
  const [snowflakes, setSnowflakes] = useState<JSX.Element[]>([]);
  const pathname = usePathname();

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
          <div key={`${pathname}-${i}`} className="snowflake" style={style}>
            •
          </div>
        );
      });
    };
    
    setSnowflakes(generateSnowflakes());
  }, [pathname]); // Reruns the effect when the pathname changes

  return <div className="snow-container">{snowflakes}</div>;
};

export { Snowfall };
