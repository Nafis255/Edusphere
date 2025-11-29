"use client";

import { createContext, useContext, useEffect, ReactNode } from 'react';

type Theme = "light";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    
    localStorage.removeItem("theme");
  }, []);

  const setTheme = () => {}; 

  return (
    <ThemeContext.Provider value={{ theme: "light", setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}