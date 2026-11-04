'use client';

import React, { useState, useEffect } from 'react';
import { LAB_STEPS } from '@/data/labSteps';
import { getLabProgress, saveLabProgress, LabProgressState } from '@/lib/storage';
import {
  Terminal,
  CheckCircle2,
  Copy,
  Check,
  AlertTriangle,
  FileText,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

export default function LabGuide() {
  const [progress, setProgress] = useState<LabProgressState>({
    completedSteps: [],
    stepNotes: {},
    checklistItems: {},
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({
    'step-1': true,
    'step-2': true,
  });

  useEffect(() => {
    setProgress(getLabProgress());
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleStepCompleted = (stepId: string) => {
    const isCompleted = progress.completedSteps.includes(stepId);
    const updatedSteps = isCompleted
      ? progress.completedSteps.filter((id) => id !== stepId)
      : [...progress.completedSteps, stepId];

    const updatedProgress = { ...progress, completedSteps: updatedSteps };
    setProgress(updatedProgress);
    saveLabProgress(updatedProgress);
  };

  const toggleChecklistItem = (itemKey: string) => {
    const updatedChecklist = {
      ...progress.checklistItems,
      [itemKey]: !progress.checklistItems[itemKey],
    };
    const updatedProgress = { ...progress, checklistItems: updatedChecklist };
    setProgress(updatedProgress);
    saveLabProgress(updatedProgress);
  };

  const handleNoteChange = (stepId: string, noteText: string) => {
    const updatedNotes = { ...progress.stepNotes, [stepId]: noteText };
    const updatedProgress = { ...progress, stepNotes: updatedNotes };
    setProgress(updatedProgress);
    saveLabProgress(updatedProgress);
  };

  const toggleExpand = (stepId: string) => {
    setExpandedSteps((prev) => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const completedCount = progress.completedSteps.length;
  const progressPercent = Math.round((completedCount / LAB_STEPS.length) * 100);

  return (
    <div className="space-y-6">
      {/* Lab Safety Warning Banner */}
      <div className="p-4 rounded-xl border border-[#FFB547]/40 bg-[#FFB547]/10 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-[#FFB547] shrink-0 mt-0.5" />
        <div className="text-xs text-[#9BA8BC] leading-relaxed">
          <strong className="text-[#F4F7FB] block text-sm mb-0.5">Authorization & Safe Environment Notice</strong>
          All commands below are strictly scoped to the local loopback IP (<code className="text-[#00D9FF]">127.0.0.1</code>) and an isolated Docker container target. Only execute assessment tools against systems you own or have explicit, signed authorization to test.
        </div>
      </div>

      {/* Progress Card */}
      <div className="p-5 rounded-xl border border-[#273248] bg-[#0B101A] flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#7C5CFF] uppercase tracking-wider block">Practical Lab Tracker</span>
          <h3 className="text-base font-semibold text-[#F4F7FB]">OWASP Juice Shop Guided Assessment</h3>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-[#9BA8BC]">Completed:</span>
            <div className="text-sm font-bold text-[#F4F7FB]">
              {completedCount} / {LAB_STEPS.length} Steps ({progressPercent}%)
            </div>
          </div>
          <div className="w-24 bg-[#151D2B] h-2.5 rounded-full overflow-hidden border border-[#273248]">
            <div
              className="bg-gradient-to-r from-[#7C5CFF] to-[#00D9FF] h-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        {LAB_STEPS.map((step) => {
          const isCompleted = progress.completedSteps.includes(step.id);
          const isExpanded = !!expandedSteps[step.id];

          return (
            <div
              key={step.id}
              className={`rounded-xl border transition-all ${
                isCompleted
                  ? 'border-[#32D583]/40 bg-[#0B101A]'
                  : 'border-[#273248] bg-[#0B101A] hover:border-[#7C5CFF]/40'
              }`}
            >
              {/* Step Header */}
              <div
                onClick={() => toggleExpand(step.id)}
                className="p-4 md:p-5 flex items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStepCompleted(step.id);
                    }}
                    title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors border ${
                      isCompleted
                        ? 'bg-[#32D583] text-black border-[#32D583]'
                        : 'bg-[#151D2B] text-transparent border-[#273248] hover:border-[#7C5CFF]'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#00D9FF]">Step {step.stepNumber}</span>
                      <span className="text-[10px] font-semibold bg-[#151D2B] text-[#9BA8BC] px-2 py-0.5 rounded border border-[#273248]">
                        {step.category}
                      </span>
                    </div>
                    <h4 className="text-sm md:text-base font-semibold text-[#F4F7FB] mt-0.5">
                      {step.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[#9BA8BC]">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {/* Step Expanded Content */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 space-y-4 border-t border-[#273248]/50">
                  <p className="text-xs text-[#9BA8BC] leading-relaxed">{step.instructions}</p>

                  {/* Terminal Command Box */}
                  {step.command && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-[#9BA8BC]">
                        <span className="flex items-center gap-1 font-mono text-[#7C5CFF]">
                          <Terminal className="w-3.5 h-3.5" /> Terminal Command
                        </span>
                        <span>Authorized target only</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-[#080B12] border border-[#273248] gap-3">
                        <code className="text-xs font-mono text-[#00D9FF] break-all select-all">
                          {step.command}
                        </code>
                        <button
                          onClick={() => handleCopy(step.command!, step.id)}
                          title="Copy command to clipboard"
                          className="shrink-0 p-1.5 rounded-lg bg-[#151D2B] hover:bg-[#273248] text-[#9BA8BC] hover:text-white transition-colors"
                        >
                          {copiedId === step.id ? (
                            <Check className="w-4 h-4 text-[#32D583]" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {step.commandExplanation && (
                        <p className="text-[11px] text-[#9BA8BC] italic">{step.commandExplanation}</p>
                      )}
                    </div>
                  )}

                  {/* Expected Observation */}
                  <div className="p-3 rounded-lg bg-[#101622] border border-[#273248] text-xs">
                    <strong className="text-[#F4F7FB] block mb-1">Expected Observation:</strong>
                    <span className="text-[#9BA8BC]">{step.expectedObservation}</span>
                  </div>

                  {/* Evidence Checklist */}
                  <div>
                    <span className="text-[11px] font-semibold text-[#7C5CFF] uppercase tracking-wider block mb-2">
                      Evidence Verification Checklist
                    </span>
                    <div className="space-y-2">
                      {step.evidenceChecklist.map((item, idx) => {
                        const itemKey = `${step.id}_chk_${idx}`;
                        const isChecked = !!progress.checklistItems[itemKey];

                        return (
                          <label
                            key={idx}
                            onClick={() => toggleChecklistItem(itemKey)}
                            className="flex items-start gap-2.5 text-xs text-[#9BA8BC] cursor-pointer hover:text-[#F4F7FB]"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="mt-0.5 rounded border-[#273248] bg-[#151D2B] text-[#7C5CFF] focus:ring-0"
                            />
                            <span>{item}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Personal Notes Field */}
                  <div>
                    <label className="text-[11px] font-medium text-[#9BA8BC] block mb-1">
                      Learner Step Notes & Raw Output:
                    </label>
                    <textarea
                      value={progress.stepNotes[step.id] || ''}
                      onChange={(e) => handleNoteChange(step.id, e.target.value)}
                      placeholder="Paste terminal outputs, observed banners, or personal notes here..."
                      rows={2}
                      className="w-full text-xs font-mono bg-[#080B12] border border-[#273248] rounded-lg p-2.5 text-[#F4F7FB] placeholder-[#627189] focus:outline-none focus:border-[#7C5CFF]"
                    />
                  </div>

                  {/* Mark Step Complete button */}
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => toggleStepCompleted(step.id)}
                      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        isCompleted
                          ? 'bg-[#32D583]/20 text-[#32D583] border border-[#32D583]/40'
                          : 'bg-[#7C5CFF] hover:bg-[#6848e8] text-white shadow-md shadow-[#7C5CFF]/20'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      {isCompleted ? 'Completed' : 'Mark Step Complete'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
