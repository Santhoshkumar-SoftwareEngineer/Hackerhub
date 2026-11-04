'use client';

import React from 'react';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import ReportGenerator from '@/components/lab/ReportGenerator';
import { FileSpreadsheet, ShieldAlert, CheckCircle2, Info } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      <Breadcrumbs
        items={[
          { label: 'Sample Vulnerability Assessment Reports' },
        ]}
      />

      <div className="rounded-2xl border border-[#273248] bg-gradient-to-br from-[#101622] via-[#0B101A] to-[#151D2B] p-6 md:p-8 relative overflow-hidden shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C5CFF]/15 border border-[#7C5CFF]/40 text-[#7C5CFF] text-xs font-bold uppercase tracking-wider mb-3">
          <FileSpreadsheet className="w-3.5 h-3.5 text-[#00D9FF]" /> Enterprise Documentation
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-[#F4F7FB] tracking-tight mb-2">
          Sample Vulnerability Assessment Report & Builder
        </h1>
        <p className="text-sm md:text-base text-[#9BA8BC] max-w-3xl leading-relaxed">
          Examine a fully structured, professional vulnerability assessment technical report. Edit finding details, CVSS scores, validation proofs, and export a client-ready deliverable with the built-in browser print engine.
        </p>
      </div>

      <ReportGenerator />
    </div>
  );
}
