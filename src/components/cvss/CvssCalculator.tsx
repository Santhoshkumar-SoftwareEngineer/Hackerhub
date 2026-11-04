'use client';

import React, { useState, useMemo } from 'react';
import {
  CvssV31BaseMetrics,
  calculateCvssV31,
  DEFAULT_CVSS_METRICS,
  AttackVector,
  AttackComplexity,
  PrivilegesRequired,
  UserInteraction,
  Scope,
  CiaImpact,
} from '@/lib/cvss';
import {
  RotateCcw,
  Copy,
  Check,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  Info,
} from 'lucide-react';

export default function CvssCalculator() {
  const [metrics, setMetrics] = useState<CvssV31BaseMetrics>(DEFAULT_CVSS_METRICS);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => calculateCvssV31(metrics), [metrics]);

  const handleCopyVector = () => {
    navigator.clipboard.writeText(result.vectorString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setMetrics(DEFAULT_CVSS_METRICS);
  };

  // Severity color helpers
  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-[#FF4D6D]/20 text-[#FF4D6D] border-[#FF4D6D]/50';
      case 'High':
        return 'bg-[#FFB547]/20 text-[#FFB547] border-[#FFB547]/50';
      case 'Medium':
        return 'bg-[#00D9FF]/20 text-[#00D9FF] border-[#00D9FF]/50';
      case 'Low':
        return 'bg-[#32D583]/20 text-[#32D583] border-[#32D583]/50';
      default:
        return 'bg-[#9BA8BC]/20 text-[#9BA8BC] border-[#9BA8BC]/50';
    }
  };

  return (
    <div className="rounded-xl border border-[#273248] bg-[#0B101A] overflow-hidden my-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-[#273248] bg-[#101622]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#7C5CFF]/15 border border-[#7C5CFF]/30 text-[#7C5CFF]">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#F4F7FB]">Interactive CVSS v3.1 Base Score Calculator</h3>
            <p className="text-xs text-[#9BA8BC]">
              Official FIRST CVSS v3.1 mathematical specification implementation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151D2B] hover:bg-[#273248] border border-[#273248] text-xs font-medium text-[#9BA8BC] hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
          <a
            href="https://www.first.org/cvss/calculator/3.1"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#7C5CFF]/20 hover:bg-[#7C5CFF]/30 border border-[#7C5CFF]/40 text-xs font-medium text-[#7C5CFF] hover:text-white transition-colors"
          >
            FIRST Official Calc <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        </div>
      </div>

      {/* Score Summary Banner */}
      <div className="p-6 border-b border-[#273248] bg-gradient-to-r from-[#101622] via-[#151D2B] to-[#101622]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="text-center">
              <div className="text-5xl font-black tracking-tight text-[#F4F7FB]">{result.baseScore.toFixed(1)}</div>
              <div className="text-[11px] font-semibold text-[#9BA8BC] uppercase tracking-wider mt-1">CVSS Base Score</div>
            </div>

            <div className="h-12 w-px bg-[#273248] hidden sm:block" />

            <div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getSeverityBadgeClass(
                  result.severity
                )}`}
              >
                {result.severity} Severity
              </span>
              <p className="text-xs text-[#9BA8BC] mt-1.5">
                Impact: <span className="text-[#F4F7FB] font-medium">{result.impactScore}</span> | Exploitability: <span className="text-[#F4F7FB] font-medium">{result.exploitabilitySubScore}</span>
              </p>
            </div>
          </div>

          {/* Vector String with Copy */}
          <div className="w-full md:w-auto flex flex-col items-start md:items-end gap-1.5">
            <div className="text-[11px] text-[#9BA8BC]">CVSS v3.1 Vector String</div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <code className="text-xs font-mono bg-[#080B12] text-[#00D9FF] px-3 py-1.5 rounded-lg border border-[#273248] select-all break-all">
                {result.vectorString}
              </code>
              <button
                onClick={handleCopyVector}
                title="Copy Vector String"
                className="p-1.5 rounded-lg bg-[#151D2B] hover:bg-[#273248] border border-[#273248] text-[#9BA8BC] hover:text-white transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-[#32D583]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Selection Grid */}
      <div className="p-6 space-y-6">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#7C5CFF] mb-3">
            Exploitability Metrics (Vulnerability Characteristics)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Attack Vector */}
            <div className="p-3.5 rounded-lg bg-[#101622] border border-[#273248]">
              <label className="block text-xs font-semibold text-[#F4F7FB] mb-1">Attack Vector (AV)</label>
              <p className="text-[11px] text-[#9BA8BC] mb-2.5">Context for remote exploitation</p>
              <div className="space-y-1.5">
                {(['NETWORK', 'ADJACENT_NETWORK', 'LOCAL', 'PHYSICAL'] as AttackVector[]).map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setMetrics((m) => ({ ...m, av: val }))}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors ${
                      metrics.av === val
                        ? 'bg-[#7C5CFF] text-white font-medium'
                        : 'bg-[#151D2B] text-[#9BA8BC] hover:bg-[#1c273a] hover:text-white'
                    }`}
                  >
                    {val === 'NETWORK' && 'Network (AV:N)'}
                    {val === 'ADJACENT_NETWORK' && 'Adjacent (AV:A)'}
                    {val === 'LOCAL' && 'Local (AV:L)'}
                    {val === 'PHYSICAL' && 'Physical (AV:P)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Attack Complexity */}
            <div className="p-3.5 rounded-lg bg-[#101622] border border-[#273248]">
              <label className="block text-xs font-semibold text-[#F4F7FB] mb-1">Attack Complexity (AC)</label>
              <p className="text-[11px] text-[#9BA8BC] mb-2.5">Specialized conditions outside attacker control</p>
              <div className="space-y-1.5">
                {(['LOW', 'HIGH'] as AttackComplexity[]).map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setMetrics((m) => ({ ...m, ac: val }))}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors ${
                      metrics.ac === val
                        ? 'bg-[#7C5CFF] text-white font-medium'
                        : 'bg-[#151D2B] text-[#9BA8BC] hover:bg-[#1c273a] hover:text-white'
                    }`}
                  >
                    {val === 'LOW' ? 'Low (AC:L)' : 'High (AC:H)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Privileges Required */}
            <div className="p-3.5 rounded-lg bg-[#101622] border border-[#273248]">
              <label className="block text-xs font-semibold text-[#F4F7FB] mb-1">Privileges Required (PR)</label>
              <p className="text-[11px] text-[#9BA8BC] mb-2.5">Authentication level required</p>
              <div className="space-y-1.5">
                {(['NONE', 'LOW', 'HIGH'] as PrivilegesRequired[]).map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setMetrics((m) => ({ ...m, pr: val }))}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors ${
                      metrics.pr === val
                        ? 'bg-[#7C5CFF] text-white font-medium'
                        : 'bg-[#151D2B] text-[#9BA8BC] hover:bg-[#1c273a] hover:text-white'
                    }`}
                  >
                    {val === 'NONE' && 'None (PR:N)'}
                    {val === 'LOW' && 'Low (PR:L)'}
                    {val === 'HIGH' && 'High (PR:H)'}
                  </button>
                ))}
              </div>
            </div>

            {/* User Interaction */}
            <div className="p-3.5 rounded-lg bg-[#101622] border border-[#273248]">
              <label className="block text-xs font-semibold text-[#F4F7FB] mb-1">User Interaction (UI)</label>
              <p className="text-[11px] text-[#9BA8BC] mb-2.5">Victim interaction requirement</p>
              <div className="space-y-1.5">
                {(['NONE', 'REQUIRED'] as UserInteraction[]).map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setMetrics((m) => ({ ...m, ui: val }))}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors ${
                      metrics.ui === val
                        ? 'bg-[#7C5CFF] text-white font-medium'
                        : 'bg-[#151D2B] text-[#9BA8BC] hover:bg-[#1c273a] hover:text-white'
                    }`}
                  >
                    {val === 'NONE' ? 'None (UI:N)' : 'Required (UI:R)'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scope and Impact Metrics */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#00D9FF] mb-3">
            Scope & Impact Metrics (Consequences)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Scope */}
            <div className="p-3.5 rounded-lg bg-[#101622] border border-[#273248]">
              <label className="block text-xs font-semibold text-[#F4F7FB] mb-1">Scope (S)</label>
              <p className="text-[11px] text-[#9BA8BC] mb-2.5">Authority boundary change</p>
              <div className="space-y-1.5">
                {(['UNCHANGED', 'CHANGED'] as Scope[]).map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setMetrics((m) => ({ ...m, s: val }))}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors ${
                      metrics.s === val
                        ? 'bg-[#00D9FF] text-black font-semibold'
                        : 'bg-[#151D2B] text-[#9BA8BC] hover:bg-[#1c273a] hover:text-white'
                    }`}
                  >
                    {val === 'UNCHANGED' ? 'Unchanged (S:U)' : 'Changed (S:C)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Confidentiality */}
            <div className="p-3.5 rounded-lg bg-[#101622] border border-[#273248]">
              <label className="block text-xs font-semibold text-[#F4F7FB] mb-1">Confidentiality (C)</label>
              <p className="text-[11px] text-[#9BA8BC] mb-2.5">Data disclosure impact</p>
              <div className="space-y-1.5">
                {(['NONE', 'LOW', 'HIGH'] as CiaImpact[]).map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setMetrics((m) => ({ ...m, c: val }))}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors ${
                      metrics.c === val
                        ? 'bg-[#00D9FF] text-black font-semibold'
                        : 'bg-[#151D2B] text-[#9BA8BC] hover:bg-[#1c273a] hover:text-white'
                    }`}
                  >
                    {val === 'NONE' && 'None (C:N)'}
                    {val === 'LOW' && 'Low (C:L)'}
                    {val === 'HIGH' && 'High (C:H)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Integrity */}
            <div className="p-3.5 rounded-lg bg-[#101622] border border-[#273248]">
              <label className="block text-xs font-semibold text-[#F4F7FB] mb-1">Integrity (I)</label>
              <p className="text-[11px] text-[#9BA8BC] mb-2.5">Data modification impact</p>
              <div className="space-y-1.5">
                {(['NONE', 'LOW', 'HIGH'] as CiaImpact[]).map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setMetrics((m) => ({ ...m, i: val }))}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors ${
                      metrics.i === val
                        ? 'bg-[#00D9FF] text-black font-semibold'
                        : 'bg-[#151D2B] text-[#9BA8BC] hover:bg-[#1c273a] hover:text-white'
                    }`}
                  >
                    {val === 'NONE' && 'None (I:N)'}
                    {val === 'LOW' && 'Low (I:L)'}
                    {val === 'HIGH' && 'High (I:H)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="p-3.5 rounded-lg bg-[#101622] border border-[#273248]">
              <label className="block text-xs font-semibold text-[#F4F7FB] mb-1">Availability (A)</label>
              <p className="text-[11px] text-[#9BA8BC] mb-2.5">Service disruption impact</p>
              <div className="space-y-1.5">
                {(['NONE', 'LOW', 'HIGH'] as CiaImpact[]).map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setMetrics((m) => ({ ...m, a: val }))}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors ${
                      metrics.a === val
                        ? 'bg-[#00D9FF] text-black font-semibold'
                        : 'bg-[#151D2B] text-[#9BA8BC] hover:bg-[#1c273a] hover:text-white'
                    }`}
                  >
                    {val === 'NONE' && 'None (A:N)'}
                    {val === 'LOW' && 'Low (A:L)'}
                    {val === 'HIGH' && 'High (A:H)'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Disclaimer */}
      <div className="px-6 py-4 bg-[#101622] border-t border-[#273248] flex items-start gap-3">
        <Info className="w-4 h-4 text-[#FFB547] shrink-0 mt-0.5" />
        <div className="text-xs text-[#9BA8BC] leading-relaxed">
          <strong className="text-[#F4F7FB]">Educational Disclaimer:</strong> This interactive calculator rigorously computes CVSS v3.1 Base Scores per FIRST specifications. In enterprise vulnerability management, the Base Score reflects intrinsic technical severity; organizational remediation priority must also consider Temporal and Environmental factors such as threat intelligence, exploit maturity, network segmentation, and asset criticality.
        </div>
      </div>
    </div>
  );
}
