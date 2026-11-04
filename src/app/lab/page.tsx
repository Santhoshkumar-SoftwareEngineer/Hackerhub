'use client';

import React, { useState } from 'react';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import LabGuide from '@/components/lab/LabGuide';
import ReportGenerator from '@/components/lab/ReportGenerator';
import { Terminal, FileSpreadsheet, ShieldCheck, Info } from 'lucide-react';

export default function LabPage() {
  const [activeTab, setActiveTab] = useState<'guide' | 'report'>('guide');

  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      <Breadcrumbs
        items={[
          { label: 'Practical Lab: OWASP Juice Shop' },
        ]}
      />

      {/* Lab Header */}
      <div className="rounded-2xl border border-[#273248] bg-gradient-to-br from-[#101622] via-[#0B101A] to-[#151D2B] p-6 md:p-8 relative overflow-hidden shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D9FF]/15 border border-[#00D9FF]/40 text-[#00D9FF] text-xs font-bold uppercase tracking-wider mb-3">
          <Terminal className="w-3.5 h-3.5" /> Hands-On Security Training Lab
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-[#F4F7FB] tracking-tight mb-2">
          Deliberately Vulnerable Application Assessment
        </h1>
        <p className="text-sm md:text-base text-[#9BA8BC] max-w-3xl leading-relaxed">
          Follow step-by-step instructions to deploy an isolated instance of OWASP Juice Shop locally via Docker on loopback (<code className="text-[#00D9FF]">127.0.0.1:3000</code>). Perform service discovery, inspect HTTP headers, evaluate CVEs, validate findings, and generate a formal printable vulnerability report.
        </p>

        {/* Tab switchers */}
        <div className="flex items-center gap-3 mt-6 pt-4 border-t border-[#273248]/60">
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'guide'
                ? 'bg-[#7C5CFF] text-white shadow-lg shadow-[#7C5CFF]/30'
                : 'bg-[#151D2B] text-[#9BA8BC] hover:text-white border border-[#273248]'
            }`}
          >
            <Terminal className="w-4 h-4" /> Lab Exercises & Step Tracker
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'report'
                ? 'bg-[#7C5CFF] text-white shadow-lg shadow-[#7C5CFF]/30'
                : 'bg-[#151D2B] text-[#9BA8BC] hover:text-white border border-[#273248]'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" /> Lab Report Generator & PDF Export
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'guide' ? <LabGuide /> : <ReportGenerator />}
    </div>
  );
}
