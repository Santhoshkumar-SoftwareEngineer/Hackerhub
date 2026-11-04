'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MODULES } from '@/data/modules';
import { getCompletedModules } from '@/lib/storage';
import ThemeSelector from './ThemeSelector';
import {
  Workflow,
  Award,
  X,
  ChevronRight,
  GitBranch,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: Props) {
  const pathname = usePathname();
  const [completedSlugs, setCompletedSlugs] = useState<string[]>([]);

  useEffect(() => {
    setCompletedSlugs(getCompletedModules());
  }, [pathname]);

  const workflowList = [
    { title: '1. Assessment Lifecycle', id: 'lifecycle' },
    { title: '2. CVE Research', id: 'cveResearch' },
    { title: '3. CVSS Scoring', id: 'cvssScoring' },
    { title: '4. Misconfiguration', id: 'misconfiguration' },
    { title: '5. Validation Decision', id: 'validation' },
    { title: '6. Remediation Cycle', id: 'remediationCycle' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo Branding */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[var(--border-color)] bg-[var(--bg-main)]/60">
          <Link href="/" onClick={onClose} className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[var(--accent-primary)] text-white shadow-md">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black tracking-wider text-[var(--text-primary)] block">
                CYBER WORKFLOW
              </span>
              <span className="text-[10px] text-[var(--accent-secondary)] font-medium tracking-tight">
                Interactive Visualizer
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--text-secondary)] hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Workflows Center */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] px-3 mb-2 flex items-center justify-between">
              <span>Workflows Visualizer</span>
              <span className="text-[9px] bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] px-1.5 py-0.5 rounded font-bold">
                Primary
              </span>
            </div>
            <div className="space-y-1">
              <Link
                href="/"
                onClick={onClose}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  pathname === '/' || pathname === '/workflows'
                    ? 'bg-[var(--accent-primary)] text-white shadow-md'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Workflow className="w-4 h-4" />
                  <span>Interactive Workflows</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Workflows List */}
          <div className="px-3 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-secondary)] block mb-1">
              Quick Workflow Links
            </span>
            {workflowList.map((wf) => (
              <Link
                key={wf.id}
                href="/"
                onClick={onClose}
                className="flex items-center justify-between text-xs py-1 px-1.5 rounded hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <span className="truncate">{wf.title}</span>
                <GitBranch className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
              </Link>
            ))}
          </div>

          {/* Practice & Evaluation */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] px-3 mb-2">
              Practice & Testing
            </div>
            <div className="space-y-1">
              <Link
                href="/quiz"
                onClick={onClose}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  pathname === '/quiz'
                    ? 'bg-[var(--accent-primary)] text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-[var(--color-warning)]" />
                  <span>15-Question Quiz</span>
                </div>
                <span className="text-[9px] font-bold bg-black/30 text-white px-1.5 py-0.5 rounded">
                  15 Qs
                </span>
              </Link>
            </div>
          </div>

          {/* Theme Palette Card inside Sidebar */}
          <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
              Active Theme
            </span>
            <ThemeSelector />
          </div>
        </div>

      </aside>
    </>
  );
}
