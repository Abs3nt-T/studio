'use client';
import { usePathname } from 'next/navigation';
import { Snowfall } from './Snowfall';

export const ConditionalSnowfall = () => {
    const pathname = usePathname();

    if (pathname === '/prodotti') {
        return null;
    }

    return <Snowfall />;
};
