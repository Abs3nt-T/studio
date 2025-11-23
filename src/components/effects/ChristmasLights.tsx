import React from 'react';

export function ChristmasLights() {
    const colors = ['blue', 'red', 'yellow', 'green', 'pink'];
    const lights = Array.from({ length: 30 }, (_, i) => colors[i % colors.length]);

    return (
        <ul className="christmas-lights">
            {lights.map((color, index) => (
                <li key={index} className={color}></li>
            ))}
        </ul>
    );
}
