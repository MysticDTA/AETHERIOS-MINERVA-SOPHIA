
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ThemeMode = 'RADIANT' | 'VOID' | 'BIOLUMINESCENT';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

const THEMES: Record<ThemeMode, React.CSSProperties> = {
  RADIANT: {
    '--pearl': '#f8f5ec',
    '--gold': '#ffd700',
    '--rose': '#f4c2c2',
    '--warm-grey': '#b6b0a0',
    '--aether-blue': '#6d28d9',
    '--aether-violet': '#4c1d95',
    '--dark-bg': '#020202',
    '--dark-surface': '#080808',
    '--dark-border': 'rgba(255, 255, 255, 0.05)',
  } as React.CSSProperties,
  VOID: {
    '--pearl': '#e2e8f0',
    '--gold': '#94a3b8',
    '--rose': '#ef4444',
    '--warm-grey': '#64748b',
    '--aether-blue': '#3b82f6',
    '--aether-violet': '#1e3a8a',
    '--dark-bg': '#000000',
    '--dark-surface': '#030303',
    '--dark-border': 'rgba(255, 255, 255, 0.08)',
  } as React.CSSProperties,
  BIOLUMINESCENT: {
    '--pearl': '#ccfbf1',
    '--gold': '#a3e635',
    '--rose': '#f472b6',
    '--warm-grey': '#94a3b8',
    '--aether-blue': '#06b6d4',
    '--aether-violet': '#0891b2',
    '--dark-bg': '#020617',
    '--dark-surface': '#0f172a',
    '--dark-border': 'rgba(34, 211, 238, 0.1)',
  } as React.CSSProperties,
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('RADIANT');

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      <div style={THEMES[mode] as any} className="contents transition-colors duration-700">
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
