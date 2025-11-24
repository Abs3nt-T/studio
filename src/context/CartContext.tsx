'use client';

import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import type { Product } from '@/lib/products';

export interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    decreaseQuantity: (productId: string) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getCartItemCount: () => number;
}

export const CartContext = createContext<CartContextType>({
    cart: [],
    addToCart: () => {},
    removeFromCart: () => {},
    decreaseQuantity: () => {},
    clearCart: () => {},
    getCartTotal: () => 0,
    getCartItemCount: () => 0,
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        const storedCart = localStorage.getItem('fanuli_cart');
        if (storedCart) {
            try {
                const parsedCart = JSON.parse(storedCart);
                if (Array.isArray(parsedCart)) {
                    setCart(parsedCart);
                }
            } catch (error) {
                console.error("Failed to parse cart from localStorage", error);
                setCart([]);
            }
        }
    }, []);

    useEffect(() => {
        if(cart.length > 0) {
            localStorage.setItem('fanuli_cart', JSON.stringify(cart));
        } else {
            localStorage.removeItem('fanuli_cart');
        }
    }, [cart]);

    const addToCart = (product: Product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const decreaseQuantity = (productId: string) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === productId);
            if (existingItem && existingItem.quantity > 1) {
                return prevCart.map(item =>
                    item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
                );
            }
            // If quantity is 1, remove the item
            return prevCart.filter(item => item.id !== productId);
        });
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('fanuli_cart');
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + item.offerPrice * item.quantity, 0);
    };

    const getCartItemCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, decreaseQuantity, clearCart, getCartTotal, getCartItemCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
