'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import InteractiveWorkflow from '@/components/workflows/InteractiveWorkflow';
import ThemeSelector from '@/components/layout/ThemeSelector';
import { WORKFLOWS } from '@/data/workflows';
import {
  GitBranch,
  Tag,
  Calculator,
  Sliders,
  CheckCircle2,
  RotateCcw,
  Award,
  Shield,
} from 'lucide-react';

export default function WorkflowHubPage() {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>('lifecycle');

  const activeWorkflow = WORKFLOWS[selectedWorkflowId] || WORKFLOWS.lifecycle;

  const workflowTabs = [
    {
      id: 'lifecycle',
      label: '1. Assessment Lifecycle',
      badge: '10 Phases',
      icon: <GitBranch className="w-4 h-4 text-[var(--accent-primary)]" />,
    },
    {
      id: 'cveResearch',
      label: '2. CVE Research',
      badge: '8 Steps',
      icon: <Tag className="w-4 h-4 text-[var(--accent-secondary)]" />,
    },
    {
      id: 'cvssScoring',
      label: '3. CVSS Scoring',
      badge: '6 Steps',
      icon: <Calculator className="w-4 h-4 text-[var(--color-success)]" />,
    },
    {
      id: 'misconfiguration',
      label: '4. Misconfiguration Analysis',
      badge: 'Hardening',
      icon: <Sliders className="w-4 h-4 text-[var(--color-warning)]" />,
    },
    {
      id: 'validation',
      label: '5. Validation Decision Tree',
      badge: '4 Branches',
      icon: <CheckCircle2 className="w-4 h-4 text-[var(--color-critical)]" />,
    },
    {
      id: 'remediationCycle',
      label: '6. Remediation Cycle',
      badge: 'Retest Loop',
      icon: <RotateCcw className="w-4 h-4 text-[var(--accent-primary)]" />,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in pb-16">
      {/* Top Cyber Workflow Banner */}
      <div className="rounded-2xl border border-[var(--border-color)] bg-gradient-to-r from-[var(--bg-secondary)] via-[var(--bg-card)] to-[var(--bg-secondary)] p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/30 text-[var(--accent-primary)] text-xs font-bold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              Cybersecurity Workflow & Interactive Verification Engine
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-[var(--text-primary)] tracking-tight">
              Vulnerability Assessment Workflows
            </h1>
            <p className="text-xs md:text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
              Touch or click any node in the workflow to inspect required activities, real-world CVE examples, sample commands, and common pitfalls. Drag nodes to customize your diagram, or change the visual theme below.
            </p>
          </div>

          {/* Theme & Fast Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5">
            <ThemeSelector />

            <Link
              href="/quiz"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--accent-primary)] hover:opacity-90 text-white text-xs font-bold shadow-md shadow-[var(--accent-primary)]/20 transition-all"
            >
              <Award className="w-3.5 h-3.5" /> 15-Question Quiz
            </Link>
          </div>
        </div>

        {/* Workflow Selection Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-[var(--border-color)]">
          {workflowTabs.map((tab) => {
            const isActive = tab.id === selectedWorkflowId;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedWorkflowId(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[var(--accent-primary)] text-white shadow-lg shadow-[var(--accent-primary)]/30 scale-[1.02]'
                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                  isActive ? 'bg-black/30 text-white' : 'bg-[var(--bg-main)] text-[var(--accent-secondary)]'
                }`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Workflow Component */}
      <InteractiveWorkflow key={activeWorkflow.id} workflow={activeWorkflow} />
    </div>
  );
}
