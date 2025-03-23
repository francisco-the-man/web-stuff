import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ChaosContextType {
  chaosMode: boolean;
  toggleChaos: () => void;
  setChaosMode: (mode: boolean) => void;
}

const ChaosContext = createContext<ChaosContextType | undefined>(undefined);

export const ChaosProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chaosMode, setChaosMode] = useState(false);

  const toggleChaos = () => {
    setChaosMode(prev => !prev);
  };

  return (
    <ChaosContext.Provider value={{ chaosMode, toggleChaos, setChaosMode }}>
      {children}
    </ChaosContext.Provider>
  );
};

export const useChaos = (): ChaosContextType => {
  const context = useContext(ChaosContext);
  if (context === undefined) {
    throw new Error('useChaos must be used within a ChaosProvider');
  }
  return context;
}; 