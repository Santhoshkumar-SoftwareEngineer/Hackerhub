'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getCompletedModules,
  getQuizAttempts,
  getBestQuizScore,
  getLastVisitedModule,
  resetAllLearningProgress,
} from '@/lib/storage';
import { MODULES } from '@/data/modules';
import {
  CheckCircle2,
  Award,
  Clock,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function ProgressCard() {
  const [completedSlugs, setCompletedSlugs] = useState<string[]>([]);
  const [quizAttemptsCount, setQuizAttemptsCount] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(0);
  const [lastVisitedSlug, setLastVisitedSlug] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const refreshProgress = () => {
    setCompletedSlugs(getCompletedModules());
    const attempts = getQuizAttempts();
    setQuizAttemptsCount(attempts.length);
    setBestScore(getBestQuizScore());
    setLastVisitedSlug(getLastVisitedModule());
  };

  useEffect(() => {
    refreshProgress();
  }, []);

  const handleReset = () => {
    resetAllLearningProgress();
    setShowResetConfirm(false);
    refreshProgress();
  };

  const totalModules = MODULES.length;
  const completedCount = completedSlugs.length;
  const completionPercentage = Math.round((completedCount / totalModules) * 100);

  const lastVisitedModule = lastVisitedSlug
    ? MODULES.find((m) => m.slug === lastVisitedSlug)
    : null;

  return (
    <div className="rounded-2xl border border-[#273248] bg-[#0B101A] p-6 shadow-xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#273248] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#32D583]/15 text-[#32D583]">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F4F7FB]">Your Learning Progress</h3>
            <p className="text-xs text-[#9BA8BC]">Persisted locally in your browser storage</p>
          </div>
        </div>

        <button
          onClick={() => setShowResetConfirm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151D2B] hover:bg-[#FF4D6D]/15 border border-[#273248] hover:border-[#FF4D6D]/40 text-xs font-medium text-[#9BA8BC] hover:text-[#FF4D6D] transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Progress
        </button>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Modules Completed */}
        <div className="p-4 rounded-xl bg-[#101622] border border-[#273248]">
          <div className="flex items-center justify-between text-xs text-[#9BA8BC] mb-1">
            <span>Modules</span>
            <CheckCircle2 className="w-4 h-4 text-[#32D583]" />
          </div>
          <div className="text-2xl font-black text-[#F4F7FB]">
            {completedCount} <span className="text-xs font-normal text-[#9BA8BC]">/ {totalModules}</span>
          </div>
          <div className="text-[11px] text-[#00D9FF] font-medium mt-1">
            {completionPercentage}% complete
          </div>
        </div>

        {/* Quiz Attempts */}
        <div className="p-4 rounded-xl bg-[#101622] border border-[#273248]">
          <div className="flex items-center justify-between text-xs text-[#9BA8BC] mb-1">
            <span>Quiz Attempts</span>
            <Award className="w-4 h-4 text-[#7C5CFF]" />
          </div>
          <div className="text-2xl font-black text-[#F4F7FB]">{quizAttemptsCount}</div>
          <div className="text-[11px] text-[#9BA8BC] mt-1">
            {quizAttemptsCount > 0 ? 'Evaluations taken' : 'Not yet attempted'}
          </div>
        </div>

        {/* Best Score */}
        <div className="p-4 rounded-xl bg-[#101622] border border-[#273248]">
          <div className="flex items-center justify-between text-xs text-[#9BA8BC] mb-1">
            <span>Best Score</span>
            <Award className="w-4 h-4 text-[#FFB547]" />
          </div>
          <div className="text-2xl font-black text-[#F4F7FB]">
            {bestScore} <span className="text-xs font-normal text-[#9BA8BC]">/ 15</span>
          </div>
          <div className="text-[11px] text-[#FFB547] font-medium mt-1">
            {bestScore > 0 ? `${Math.round((bestScore / 15) * 100)}% accuracy` : 'Take test to record'}
          </div>
        </div>

        {/* Last Visited */}
        <div className="p-4 rounded-xl bg-[#101622] border border-[#273248]">
          <div className="flex items-center justify-between text-xs text-[#9BA8BC] mb-1">
            <span>Last Visited</span>
            <Clock className="w-4 h-4 text-[#00D9FF]" />
          </div>
          <div className="text-sm font-bold text-[#F4F7FB] truncate mt-1">
            {lastVisitedModule ? lastVisitedModule.shortTitle : 'None yet'}
          </div>
          {lastVisitedModule && (
            <Link
              href={`/modules/${lastVisitedModule.slug}`}
              className="text-[11px] text-[#7C5CFF] hover:underline flex items-center gap-0.5 mt-1"
            >
              Resume lesson <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between text-xs text-[#9BA8BC] mb-2">
          <span>Overall Course Completion</span>
          <span className="font-bold text-[#F4F7FB]">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-[#151D2B] h-2.5 rounded-full overflow-hidden border border-[#273248]">
          <div
            className="bg-gradient-to-r from-[#7C5CFF] via-[#00D9FF] to-[#32D583] h-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#151D2B] border border-[#273248] rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="flex items-center gap-3 text-[#FF4D6D]">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h4 className="text-base font-bold text-[#F4F7FB]">Confirm Progress Reset</h4>
            </div>
            <p className="text-xs text-[#9BA8BC] leading-relaxed">
              This will erase all module completion records, personal notes, bookmarks, and quiz attempt scores stored in your browser. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-lg bg-[#101622] hover:bg-[#273248] text-xs font-semibold text-[#9BA8BC] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-lg bg-[#FF4D6D] hover:bg-red-600 text-white text-xs font-bold transition-all"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
