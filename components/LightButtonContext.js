
'use client'
import React, { createContext, useContext, useState } from 'react';

const ButtonContext = createContext();

export function ButtonProvider({ children }) {
  const [buttonState, setButtonState] = useState(false);

  const toggleButton = () => {
    setButtonState(!buttonState);
  };

  return (
    <ButtonContext.Provider value={{ buttonState, toggleButton }}>
      {children}
    </ButtonContext.Provider>
  );
}

export function useButton() {
    const context = useContext(ButtonContext);
  
    if (!context) {
      throw new Error('useButton must be used within a ButtonProvider');
    }
  
    return context;
  }