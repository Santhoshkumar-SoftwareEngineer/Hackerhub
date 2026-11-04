'use client';

import React, { useState } from 'react';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import InteractiveWorkflow from '@/components/workflows/InteractiveWorkflow';
import { WORKFLOWS } from '@/data/workflows';
import {
  Workflow,
  GitBranch,
  Tag,
  Calculator,
  Sliders,
  CheckCircle2,
  RotateCcw,
  Layers,
  Sparkles,
  Maximize2,
} from 'lucide-react';

export default function WorkflowsPage() {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>('lifecycle');

  const activeWorkflow = WORKFLOWS[selectedWorkflowId] || WORKFLOWS.lifecycle;

  const workflowTabs = [
    { id: 'lifecycle', label: '1. Assessment Lifecycle', icon: <GitBranch className="w-4 h-4 text-[#FF1A2A]" /> },
    { id: 'cveResearch', label: '2. CVE Research', icon: <Tag className="w-4 h-4 text-[#00D9FF]" /> },
    { id: 'cvssScoring', label: '3. CVSS Scoring', icon: <Calculator className="w-4 h-4 text-[#32D583]" /> },
    { id: 'misconfiguration', label: '4. Misconfiguration Analysis', icon: <Sliders className="w-4 h-4 text-[#FFA500]" /> },
    { id: 'validation', label: '5. Vulnerability Validation', icon: <CheckCircle2 className="w-4 h-4 text-[#FF1A2A]" /> },
    { id: 'remediationCycle', label: '6. Remediation Cycle', icon: <RotateCcw className="w-4 h-4 text-white" /> },
  ];

  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      <Breadcrumbs
        items={[
          { label: 'Interactive SVG Workflows' },
        ]}
      />

      {/* Header Banner */}
      <div className="rounded-2xl border border-[#262626] bg-gradient-to-br from-[#121212] via-[#0A0A0A] to-[#141414] p-6 md:p-8 relative overflow-hidden shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF1A2A]/15 border border-[#FF1A2A]/40 text-[#FF1A2A] text-xs font-bold uppercase tracking-wider">
            <Workflow className="w-3.5 h-3.5" /> Native SVG Visualization Engine
          </div>
          <span className="text-xs text-[#888888] flex items-center gap-1.5 bg-[#141414] px-3 py-1 rounded-full border border-[#262626]">
            <Maximize2 className="w-3.5 h-3.5 text-[#FF1A2A]" /> Press <kbd className="px-1.5 py-0.5 rounded bg-[#1F1F1F] border border-[#333] text-white font-mono text-[10px]">F</kbd> or click Fullscreen to expand
          </span>
        </div>

        <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
          Interactive Cybersecurity Workflow Diagrams
        </h1>
        <p className="text-sm md:text-base text-[#D4D4D8] max-w-3xl leading-relaxed">
          Explore all six primary vulnerability assessment processes rendered in native SVG. Click any phase to inspect required activities and deliverables, drag nodes to customize your layout, pan and zoom, or expand to full screen for an immersive visual experience.
        </p>

        {/* Workflow Tabs Switcher */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-[#262626]">
          {workflowTabs.map((tab) => {
            const isActive = tab.id === selectedWorkflowId;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedWorkflowId(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#FF1A2A] text-white shadow-lg shadow-[#FF1A2A]/30'
                    : 'bg-[#141414] text-[#888888] hover:text-white border border-[#262626] hover:border-[#FF1A2A]/40'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Interactive SVG Workflow Component */}
      <div className="space-y-4">
        <div className="p-4 rounded-xl border border-[#262626] bg-[#0A0A0A] flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white">{activeWorkflow.title}</h2>
            <p className="text-xs text-[#888888] mt-1 leading-relaxed">{activeWorkflow.description}</p>
          </div>
          <span className="text-[11px] text-[#888888] bg-[#141414] px-2.5 py-1 rounded-lg border border-[#262626]">
            💡 Double-click canvas or press <strong>F</strong> for Fullscreen
          </span>
        </div>

        <InteractiveWorkflow workflow={activeWorkflow} />
      </div>
    </div>
  );
}
