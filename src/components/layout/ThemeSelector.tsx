'use client';

import React, { useState, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';

export type ThemeId = 'red-black-white' | 'cyber-dark' | 'matrix-neon' | 'oceanic-cyan' | 'cyber-light';

export interface ThemeOption {
  id: ThemeId;
  name: string;
  dotColor: string;
  accent: string;
}

export const THEMES: ThemeOption[] = [
  { id: 'red-black-white', name: 'Red, Black & White', dotColor: '#FF1A2A', accent: '#FFFFFF' },
  { id: 'cyber-dark', name: 'Cyber Dark', dotColor: '#7C5CFF', accent: '#00D9FF' },
  { id: 'matrix-neon', name: 'Matrix Neon', dotColor: '#00FF88', accent: '#39FF14' },
  { id: 'oceanic-cyan', name: 'Oceanic Blue', dotColor: '#00D9FF', accent: '#38BDF8' },
  { id: 'cyber-light', name: 'Clean Light', dotColor: '#6366F1', accent: '#0284C7' },
];

export default function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState<ThemeId>('red-black-white');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem('va_theme') as ThemeId | null;
    if (saved && THEMES.some((t) => t.id === saved)) {
      setCurrentTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      setCurrentTheme('red-black-white');
      window.localStorage.setItem('va_theme', 'red-black-white');
      document.documentElement.setAttribute('data-theme', 'red-black-white');
    }
  }, []);

  const handleSelectTheme = (themeId: ThemeId) => {
    setCurrentTheme(themeId);
    window.localStorage.setItem('va_theme', themeId);
    document.documentElement.setAttribute('data-theme', themeId);
    setIsOpen(false);
  };

  const activeTheme = THEMES.find((t) => t.id === currentTheme) || THEMES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)] transition-all shadow-sm"
        title="Change Visual Theme"
      >
        <span
          className="w-3 h-3 rounded-full shrink-0 shadow-sm"
          style={{ backgroundColor: activeTheme.dotColor }}
        />
        <span className="hidden sm:inline">{activeTheme.name}</span>
        <Palette className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
      </button>

      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-transparent"
          />
          <div className="absolute right-0 mt-2 w-52 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 space-y-1">
            <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-color)] mb-1">
              Select Cyber Theme
            </div>
            {THEMES.map((theme) => {
              const isSelected = theme.id === currentTheme;
              return (
                <button
                  key={theme.id}
                  onClick={() => handleSelectTheme(theme.id)}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-[var(--accent-primary)]/20 text-[var(--text-primary)] font-bold'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20"
                      style={{ backgroundColor: theme.dotColor }}
                    />
                    <span>{theme.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[var(--accent-primary)]" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
