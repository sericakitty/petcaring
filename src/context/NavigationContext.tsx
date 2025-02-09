import React, { createContext, useContext, useState } from "react";

type NavigationContextProps = {
  currentRoute: string;
  setCurrentRoute: (route: string) => void;
}

const NavigationContext = createContext<NavigationContextProps | undefined>(undefined);

/**
 * NavigationProvider
 *  
 * This component provides the currentRoute and setCurrentRoute to the rest of the app
 */
export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState("Landing");
  
  return (
    <NavigationContext.Provider value={{ currentRoute, setCurrentRoute }}>
      {children}
    </NavigationContext.Provider>
  );
};

/**
 * useNavigationContext
 * 
 * A hook to access the currentRoute and setCurrentRoute from the NavigationContext
 */
export const useNavigationContext = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigationContext must be used within a NavigationProvider");
  }
  return context;
};
