"use client";

import { createContext, useContext, useEffect, ReactNode } from 'react';

// Kita kunci tipenya hanya 'light'
type Theme = "light";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  
  // Efek ini berjalan sekali saat aplikasi dimuat untuk memastikan bersih dari dark mode
  useEffect(() => {
    // 1. Selalu HAPUS class 'dark' dari <html>
    document.documentElement.classList.remove("dark");
    
    // 2. Bersihkan localStorage agar tidak ada sisa setting
    localStorage.removeItem("theme");
  }, []);

  // Fungsi dummy: tidak melakukan apa-apa karena tema dikunci
  const setTheme = () => {}; 

  return (
    // Selalu berikan value "light"
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