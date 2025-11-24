'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { useCart } from '@/context/CartContext';

export function CartIcon() {
    const { getCartItemCount } = useCart();
    const itemCount = getCartItemCount();

    return (
        <Link href="/checkout">
            <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-6 w-6" />
                {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        {itemCount}
                    </span>
                )}
                <span className="sr-only">Carrello</span>
            </Button>
        </Link>
    );
}
