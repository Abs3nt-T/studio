'use client';

import React, { createContext, useContext, useState } from 'react';

interface BookingChatContextType {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
}

const BookingChatContext = createContext<BookingChatContextType | undefined>(undefined);

export function BookingChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);

  return (
    <BookingChatContext.Provider value={{ isOpen, openChat, closeChat }}>
      {children}
    </BookingChatContext.Provider>
  );
}

export function useBookingChat() {
  const context = useContext(BookingChatContext);
  if (context === undefined) {
    throw new Error('useBookingChat must be used within a BookingChatProvider');
  }
  return context;
}