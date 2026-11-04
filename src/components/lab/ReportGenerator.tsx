'use client';

import React, { useState } from 'react';
import { AssessmentFinding, AssessmentReport, FindingSeverity, ValidationStatus } from '@/types/finding';
import { SAMPLE_FINDINGS, SAMPLE_REPORT_DATA } from '@/data/sampleFindings';
import {
  Printer,
  Download,
  Plus,
  Trash2,
  FileCheck,
  Shield,
  AlertCircle,
  CheckCircle2,
  Info,
} from 'lucide-react';

export default function ReportGenerator() {
  const [report, setReport] = useState<AssessmentReport>(SAMPLE_REPORT_DATA);
  const [findings, setFindings] = useState<AssessmentFinding[]>(SAMPLE_FINDINGS);
  const [selectedFindingId, setSelectedFindingId] = useState<string>(SAMPLE_FINDINGS[0]?.id || '');

  const handlePrint = () => {
    window.print();
  };

  const handleAddFinding = () => {
    const newId = `FIND-00${findings.length + 1}`;
    const newFinding: AssessmentFinding = {
      id: newId,
      title: 'New Candidate Vulnerability Finding',
      severity: 'Medium',
      cvssScore: 5.0,
      cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N',
      affectedAsset: '127.0.0.1:3000',
      validationStatus: 'Confirmed',
      description: 'Describe the technical flaw and conditions...',
      evidence: 'Observed HTTP headers or scanner output...',
      impactAnalysis: 'Potential business or operational consequences...',
      remediationGuidance: 'Specific patching or configuration steps...',
      retestResult: 'Pending',
      isHypothetical: true,
    };
    setFindings([...findings, newFinding]);
    setSelectedFindingId(newId);
  };

  const handleDeleteFinding = (id: string) => {
    if (findings.length <= 1) return;
    const filtered = findings.filter((f) => f.id !== id);
    setFindings(filtered);
    setSelectedFindingId(filtered[0]?.id || '');
  };

  const updateSelectedFinding = (field: keyof AssessmentFinding, value: any) => {
    setFindings((prev) =>
      prev.map((f) => (f.id === selectedFindingId ? { ...f, [field]: value } : f))
    );
  };

  const currentFinding = findings.find((f) => f.id === selectedFindingId);

  const getSeverityBadgeClass = (severity: FindingSeverity) => {
    switch (severity) {
      case 'Critical':
        return 'text-[#FF4D6D] bg-[#FF4D6D]/10 border-[#FF4D6D]/30';
      case 'High':
        return 'text-[#FFB547] bg-[#FFB547]/10 border-[#FFB547]/30';
      case 'Medium':
        return 'text-[#00D9FF] bg-[#00D9FF]/10 border-[#00D9FF]/30';
      case 'Low':
        return 'text-[#32D583] bg-[#32D583]/10 border-[#32D583]/30';
      default:
        return 'text-[#9BA8BC] bg-[#9BA8BC]/10 border-[#273248]';
    }
  };

  return (
    <div className="space-y-8">
      {/* Disclaimer Banner */}
      <div className="p-4 rounded-xl border border-[#7C5CFF]/30 bg-[#7C5CFF]/10 flex items-start gap-3 no-print">
        <Info className="w-5 h-5 text-[#7C5CFF] shrink-0 mt-0.5" />
        <div className="text-xs text-[#9BA8BC] leading-relaxed">
          <strong className="text-[#F4F7FB] block text-sm mb-0.5">Report Generator & Documentation Tool</strong>
          This generator produces formal vulnerability assessment documentation for instructional, academic, and audit reporting. It formats your verified findings into an industry-standard template with instant browser print or PDF export.
        </div>
      </div>

      {/* Editor Controls (Hidden during print) */}
      <div className="rounded-xl border border-[#273248] bg-[#0B101A] p-5 space-y-5 no-print">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#273248] pb-4">
          <div>
            <h3 className="text-base font-bold text-[#F4F7FB]">Report Metadata & Project Scope</h3>
            <p className="text-xs text-[#9BA8BC]">Customize the technical parameters of your assessment report</p>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7C5CFF] hover:bg-[#6848e8] text-white text-xs font-bold transition-all shadow-lg shadow-[#7C5CFF]/20"
          >
            <Printer className="w-4 h-4" /> Print / Save as PDF
          </button>
        </div>

        {/* Report Metadata Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-[#9BA8BC] block mb-1">Report Title</label>
            <input
              type="text"
              value={report.title}
              onChange={(e) => setReport({ ...report, title: e.target.value })}
              className="w-full text-xs bg-[#101622] border border-[#273248] rounded-lg p-2.5 text-[#F4F7FB] focus:border-[#7C5CFF] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#9BA8BC] block mb-1">Target Description</label>
            <input
              type="text"
              value={report.targetDescription}
              onChange={(e) => setReport({ ...report, targetDescription: e.target.value })}
              className="w-full text-xs bg-[#101622] border border-[#273248] rounded-lg p-2.5 text-[#F4F7FB] focus:border-[#7C5CFF] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#9BA8BC] block mb-1">Assessment Date</label>
            <input
              type="date"
              value={report.assessmentDate}
              onChange={(e) => setReport({ ...report, assessmentDate: e.target.value })}
              className="w-full text-xs bg-[#101622] border border-[#273248] rounded-lg p-2.5 text-[#F4F7FB] focus:border-[#7C5CFF] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-[#9BA8BC] block mb-1">Assessor Name / Team</label>
            <input
              type="text"
              value={report.assessorName}
              onChange={(e) => setReport({ ...report, assessorName: e.target.value })}
              className="w-full text-xs bg-[#101622] border border-[#273248] rounded-lg p-2.5 text-[#F4F7FB] focus:border-[#7C5CFF] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#9BA8BC] block mb-1">Authorized Scope & Boundaries</label>
            <input
              type="text"
              value={report.scope}
              onChange={(e) => setReport({ ...report, scope: e.target.value })}
              className="w-full text-xs bg-[#101622] border border-[#273248] rounded-lg p-2.5 text-[#F4F7FB] focus:border-[#7C5CFF] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Finding Editor Drawer (Hidden during print) */}
      <div className="rounded-xl border border-[#273248] bg-[#0B101A] p-5 space-y-4 no-print">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#273248] pb-3">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-[#F4F7FB]">Manage Report Findings ({findings.length})</h4>
          </div>
          <button
            onClick={handleAddFinding}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151D2B] hover:bg-[#273248] border border-[#273248] text-xs font-semibold text-[#00D9FF] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Finding
          </button>
        </div>

        {/* Finding Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {findings.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFindingId(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-2 ${
                f.id === selectedFindingId
                  ? 'bg-[#7C5CFF] text-white border-[#7C5CFF]'
                  : 'bg-[#101622] text-[#9BA8BC] border-[#273248] hover:border-[#7C5CFF]/40'
              }`}
            >
              <span>{f.id}</span>
              <span className="max-w-[120px] truncate text-[11px] opacity-80">{f.title}</span>
            </button>
          ))}
        </div>

        {/* Selected Finding Edit Fields */}
        {currentFinding && (
          <div className="p-4 rounded-xl bg-[#101622] border border-[#273248] space-y-4 mt-3">
            <div className="flex items-center justify-between gap-2 border-b border-[#273248] pb-3">
              <span className="text-xs font-bold text-[#00D9FF]">Editing: {currentFinding.id}</span>
              <button
                onClick={() => handleDeleteFinding(currentFinding.id)}
                disabled={findings.length <= 1}
                className="flex items-center gap-1 text-xs text-[#FF4D6D] hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="text-[11px] font-semibold text-[#9BA8BC] block mb-1">Finding Title</label>
                <input
                  type="text"
                  value={currentFinding.title}
                  onChange={(e) => updateSelectedFinding('title', e.target.value)}
                  className="w-full text-xs bg-[#080B12] border border-[#273248] rounded-lg p-2 text-[#F4F7FB]"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#9BA8BC] block mb-1">Severity</label>
                <select
                  value={currentFinding.severity}
                  onChange={(e) => updateSelectedFinding('severity', e.target.value as FindingSeverity)}
                  className="w-full text-xs bg-[#080B12] border border-[#273248] rounded-lg p-2 text-[#F4F7FB]"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                  <option value="Informational">Informational</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-[#9BA8BC] block mb-1">CVSS Base Score</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={currentFinding.cvssScore}
                  onChange={(e) => updateSelectedFinding('cvssScore', parseFloat(e.target.value) || 0)}
                  className="w-full text-xs bg-[#080B12] border border-[#273248] rounded-lg p-2 text-[#F4F7FB]"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#9BA8BC] block mb-1">Validation Status</label>
                <select
                  value={currentFinding.validationStatus}
                  onChange={(e) => updateSelectedFinding('validationStatus', e.target.value as ValidationStatus)}
                  className="w-full text-xs bg-[#080B12] border border-[#273248] rounded-lg p-2 text-[#F4F7FB]"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="False Positive">False Positive</option>
                  <option value="Not Applicable">Not Applicable</option>
                  <option value="Inconclusive">Inconclusive</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#9BA8BC] block mb-1">Retest Result</label>
                <select
                  value={currentFinding.retestResult || 'Pending'}
                  onChange={(e) => updateSelectedFinding('retestResult', e.target.value)}
                  className="w-full text-xs bg-[#080B12] border border-[#273248] rounded-lg p-2 text-[#F4F7FB]"
                >
                  <option value="Pending">Pending</option>
                  <option value="Pass">Pass (Resolved)</option>
                  <option value="Fail">Fail (Unresolved)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#9BA8BC] block mb-1">Technical Description</label>
              <textarea
                rows={2}
                value={currentFinding.description}
                onChange={(e) => updateSelectedFinding('description', e.target.value)}
                className="w-full text-xs bg-[#080B12] border border-[#273248] rounded-lg p-2 text-[#F4F7FB]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#9BA8BC] block mb-1">Validation Proof & Evidence</label>
              <textarea
                rows={2}
                value={currentFinding.evidence}
                onChange={(e) => updateSelectedFinding('evidence', e.target.value)}
                className="w-full text-xs font-mono bg-[#080B12] border border-[#273248] rounded-lg p-2 text-[#00D9FF]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#9BA8BC] block mb-1">Remediation Guidance</label>
              <textarea
                rows={2}
                value={currentFinding.remediationGuidance}
                onChange={(e) => updateSelectedFinding('remediationGuidance', e.target.value)}
                className="w-full text-xs bg-[#080B12] border border-[#273248] rounded-lg p-2 text-[#F4F7FB]"
              />
            </div>
          </div>
        )}
      </div>

      {/* FORMAL PRINTABLE REPORT PREVIEW (Targeted by window.print()) */}
      <div className="print-area rounded-xl border border-[#273248] bg-[#080B12] p-8 space-y-8 shadow-2xl">
        {/* Cover / Document Header */}
        <div className="border-b-2 border-[#7C5CFF] pb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#7C5CFF] mb-2">
              <Shield className="w-6 h-6" />
              <span className="text-xs font-black tracking-widest uppercase">Cybersecurity Assessment Division</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-[#F4F7FB]">{report.title}</h1>
            <p className="text-sm text-[#9BA8BC] mt-1">{report.targetDescription}</p>
          </div>
          <div className="text-right text-xs text-[#9BA8BC] space-y-1">
            <div><strong className="text-[#F4F7FB]">Report ID:</strong> {report.id}</div>
            <div><strong className="text-[#F4F7FB]">Date:</strong> {report.assessmentDate}</div>
            <div><strong className="text-[#F4F7FB]">Lead Assessor:</strong> {report.assessorName}</div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#00D9FF]">1. Executive Summary</h2>
          <p className="text-xs leading-relaxed text-[#9BA8BC]">
            An authorized vulnerability assessment was performed against <strong className="text-[#F4F7FB]">{report.targetDescription}</strong> on {report.assessmentDate}. The primary objective was to discover exposed services, analyze known CVEs, evaluate CVSS severity, identify configuration weaknesses, and conduct safe vulnerability validation without disrupting production operations.
          </p>
        </div>

        {/* Scope and Methodology */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="p-4 rounded-xl bg-[#101622] border border-[#273248] space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7C5CFF]">2. Assessment Scope</h3>
            <p className="text-xs text-[#9BA8BC] leading-relaxed">{report.scope}</p>
          </div>
          <div className="p-4 rounded-xl bg-[#101622] border border-[#273248] space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7C5CFF]">3. Assessment Methodology</h3>
            <p className="text-xs text-[#9BA8BC] leading-relaxed">{report.methodology}</p>
          </div>
        </div>

        {/* Findings Summary Table */}
        <div className="space-y-3 pt-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#00D9FF]">
            4. Vulnerability Findings Register ({findings.length} Total)
          </h2>
          <div className="overflow-x-auto rounded-xl border border-[#273248]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#101622] text-[#9BA8BC] border-b border-[#273248]">
                <tr>
                  <th className="p-3 font-semibold">ID</th>
                  <th className="p-3 font-semibold">Title</th>
                  <th className="p-3 font-semibold">Severity</th>
                  <th className="p-3 font-semibold">CVSS</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold">Retest</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#273248]">
                {findings.map((f) => (
                  <tr key={f.id} className="hover:bg-[#151D2B]/50">
                    <td className="p-3 font-mono font-bold text-[#7C5CFF]">{f.id}</td>
                    <td className="p-3 font-medium text-[#F4F7FB]">{f.title}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getSeverityBadgeClass(f.severity)}`}>
                        {f.severity}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-[#F4F7FB]">{f.cvssScore.toFixed(1)}</td>
                    <td className="p-3">
                      <span className="text-[11px] text-[#9BA8BC]">{f.validationStatus}</span>
                    </td>
                    <td className="p-3 text-[11px] font-medium text-[#00D9FF]">
                      {f.retestResult || 'Pending'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Findings Breakdown */}
        <div className="space-y-6 pt-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#00D9FF]">
            5. Technical Findings Deep-Dive
          </h2>
          {findings.map((f, idx) => (
            <div key={f.id} className="p-5 rounded-xl border border-[#273248] bg-[#101622] space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#273248] pb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-[#7C5CFF]">{f.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getSeverityBadgeClass(f.severity)}`}>
                      {f.severity}
                    </span>
                    <span className="text-xs text-[#9BA8BC]">CVSS v3.1: <strong className="text-[#F4F7FB]">{f.cvssScore.toFixed(1)}</strong></span>
                  </div>
                  <h3 className="text-base font-bold text-[#F4F7FB]">{f.title}</h3>
                </div>
                <div className="text-right text-xs text-[#9BA8BC]">
                  <div>Asset: <span className="font-mono text-[#00D9FF]">{f.affectedAsset}</span></div>
                  <div>Validation: <span className="font-semibold text-[#F4F7FB]">{f.validationStatus}</span></div>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7C5CFF]">Description</span>
                <p className="text-xs text-[#9BA8BC] leading-relaxed">{f.description}</p>
              </div>

              {f.evidence && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#00D9FF]">Verification Evidence</span>
                  <pre className="text-xs font-mono p-3 rounded-lg bg-[#080B12] border border-[#273248] text-[#00D9FF] whitespace-pre-wrap select-all">
                    {f.evidence}
                  </pre>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFB547]">Impact Analysis</span>
                  <p className="text-xs text-[#9BA8BC]">{f.impactAnalysis}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#32D583]">Remediation Guidance</span>
                  <p className="text-xs text-[#9BA8BC]">{f.remediationGuidance}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Conclusion & Sign-off */}
        <div className="space-y-3 pt-4 border-t border-[#273248]">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#00D9FF]">6. Conclusion & Remediation Roadmap</h2>
          <p className="text-xs leading-relaxed text-[#9BA8BC]">{report.conclusion}</p>
          <div className="pt-6 flex justify-between items-end text-xs text-[#9BA8BC]">
            <div>
              <div className="w-48 border-b border-[#273248] mb-1 pb-4 text-[#F4F7FB] font-medium">
                {report.assessorName}
              </div>
              <span>Authorized Assessor Signature</span>
            </div>
            <div className="text-right">
              <span>Date: {report.assessmentDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
