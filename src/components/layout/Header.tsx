'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCompletedModules, getBookmarks } from '@/lib/storage';
import { MODULES } from '@/data/modules';
import SearchModal from './SearchModal';
import ThemeSelector from './ThemeSelector';
import {
  Menu,
  Search,
  Bookmark,
  Award,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: Props) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [bookmarkSlugs, setBookmarkSlugs] = useState<string[]>([]);

  useEffect(() => {
    setCompletedCount(getCompletedModules().length);
    setBookmarkSlugs(getBookmarks());

    // Ctrl+K or Cmd+K shortcut for search
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const progressPercent = Math.round((completedCount / MODULES.length) * 100);

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-[var(--bg-sidebar)]/90 backdrop-blur-md border-b border-[var(--border-color)] px-4 md:px-8 flex items-center justify-between gap-4 transition-colors">
        {/* Left side: Hamburger & Quick title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] hover:text-white lg:hidden transition-colors border border-[var(--border-color)]"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-xs text-[var(--text-secondary)] transition-all w-40 sm:w-64"
          >
            <Search className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span className="truncate">Search workflows, CVEs...</span>
            <kbd className="ml-auto hidden sm:inline-block px-1.5 py-0.5 rounded bg-[var(--bg-main)] text-[10px] text-[var(--text-muted)] border border-[var(--border-color)]">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right side: Theme Selector, Progress, Bookmarks & CTA */}
        <div className="flex items-center gap-2.5">
          {/* Dynamic Theme Selector */}
          <ThemeSelector />

          {/* Bookmarks Dropdown trigger */}
          <div className="relative">
            <button
              onClick={() => setIsBookmarksOpen((prev) => !prev)}
              className="p-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-white transition-colors relative"
              title="Saved Bookmarks"
            >
              <Bookmark className="w-4 h-4 text-[var(--accent-secondary)]" />
              {bookmarkSlugs.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--accent-primary)] text-[9px] font-bold text-white flex items-center justify-center">
                  {bookmarkSlugs.length}
                </span>
              )}
            </button>

            {isBookmarksOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-3 shadow-2xl z-40 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)] mb-2 text-xs font-bold text-[var(--text-primary)]">
                  <span>Bookmarked Lessons</span>
                  <span className="text-[10px] text-[var(--accent-secondary)]">{bookmarkSlugs.length} saved</span>
                </div>
                {bookmarkSlugs.length === 0 ? (
                  <p className="text-xs text-[var(--text-secondary)] py-2 text-center">No bookmarks yet.</p>
                ) : (
                  <div className="space-y-1 max-h-56 overflow-y-auto">
                    {bookmarkSlugs.map((slug) => {
                      const mod = MODULES.find((m) => m.slug === slug);
                      if (!mod) return null;
                      return (
                        <Link
                          key={slug}
                          href={`/modules/${slug}`}
                          onClick={() => setIsBookmarksOpen(false)}
                          className="block text-xs p-2 rounded-lg hover:bg-[var(--bg-card-hover)] text-[var(--text-primary)] truncate"
                        >
                          Module {mod.moduleNumber}: {mod.shortTitle}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Quiz CTA */}
          <Link
            href="/quiz"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--accent-primary)] hover:opacity-90 text-white text-xs font-bold shadow-md transition-all"
          >
            <Award className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Final</span> Quiz
          </Link>
        </div>
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
