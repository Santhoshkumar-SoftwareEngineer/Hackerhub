'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { QuizQuestionData, QuizAttempt } from '@/types/quiz';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  Award,
  Filter,
  ArrowRight,
  Shuffle,
} from 'lucide-react';

interface Props {
  attempt: QuizAttempt;
  questions: QuizQuestionData[];
  onRetake: () => void;
}

export default function QuizResults({ attempt, questions, onRetake }: Props) {
  const [filterMode, setFilterMode] = useState<'all' | 'incorrect'>('all');

  useEffect(() => {
    // Fire confetti for high score
    if (attempt.score >= 13) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF1A2A', '#FFFFFF', '#32D583'],
        });
      } catch (e) {
        // Safe fallback if confetti isn't supported in test environment
      }
    }
  }, [attempt.score]);

  const incorrectCount = attempt.totalQuestions - attempt.score;

  const filteredQuestions = questions.filter((q) => {
    if (filterMode === 'incorrect') {
      return attempt.answers[q.id] !== q.correctAnswer;
    }
    return true;
  });

  const getTierMessage = () => {
    switch (attempt.tier) {
      case 'Excellent':
        return {
          title: 'Excellent Mastery!',
          desc: 'Outstanding performance. You have mastered core vulnerability assessment methods, CVE research, CVSS scoring, and validation logic.',
          color: 'text-[#32D583]',
          border: 'border-[#32D583]/40',
          bg: 'bg-[#32D583]/10',
        };
      case 'Good':
        return {
          title: 'Good Understanding',
          desc: 'Solid grasp of foundational concepts with minor gaps in specialized validation or metrics analysis. Review recommended lessons below.',
          color: 'text-white',
          border: 'border-white/30',
          bg: 'bg-white/5',
        };
      case 'Developing':
        return {
          title: 'Developing Understanding',
          desc: 'You understand basic principles but need deeper review of CVSS calculation, false positive elimination, and assessment phases.',
          color: 'text-[#FFA500]',
          border: 'border-[#FFA500]/40',
          bg: 'bg-[#FFA500]/10',
        };
      default:
        return {
          title: 'More Practice Recommended',
          desc: 'Take time to study the 14 educational modules, explore the interactive workflows, and test with the Juice Shop lab before retrying.',
          color: 'text-[#FF1A2A]',
          border: 'border-[#FF1A2A]/40',
          bg: 'bg-[#FF1A2A]/10',
        };
    }
  };

  const tierInfo = getTierMessage();

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Score Header Card */}
      <div
        className={`p-6 md:p-8 rounded-2xl border ${tierInfo.border} ${tierInfo.bg} text-center relative overflow-hidden`}
      >
        <div className="inline-flex p-3 rounded-xl bg-[#141414] border border-[#2B2B2B] text-[#FF1A2A] mb-3">
          <Award className="w-8 h-8" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white">{tierInfo.title}</h2>
        <p className="text-sm text-[#D4D4D8] max-w-xl mx-auto mt-2 leading-relaxed">
          {tierInfo.desc}
        </p>

        {/* Score metrics */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-6 border-t border-[#262626]">
          <div>
            <div className="text-4xl font-extrabold text-white">
              {attempt.score}{' '}
              <span className="text-lg font-normal text-[#888888]">
                / {attempt.totalQuestions}
              </span>
            </div>
            <div className="text-xs text-[#888888] font-medium uppercase tracking-wider mt-1">
              Total Score
            </div>
          </div>

          <div className="h-10 w-px bg-[#262626]" />

          <div>
            <div className="text-4xl font-extrabold text-white">
              {attempt.percentage}%
            </div>
            <div className="text-xs text-[#888888] font-medium uppercase tracking-wider mt-1">
              Accuracy
            </div>
          </div>

          <div className="h-10 w-px bg-[#262626]" />

          <div>
            <div className="text-4xl font-extrabold text-[#32D583]">
              {attempt.score}
            </div>
            <div className="text-xs text-[#888888] font-medium uppercase tracking-wider mt-1">
              Correct
            </div>
          </div>

          <div className="h-10 w-px bg-[#262626]" />

          <div>
            <div className="text-4xl font-extrabold text-[#FF1A2A]">
              {incorrectCount}
            </div>
            <div className="text-xs text-[#888888] font-medium uppercase tracking-wider mt-1">
              Incorrect
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <button
            onClick={onRetake}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF1A2A] hover:bg-[#E01424] text-white text-sm font-semibold transition-all shadow-lg shadow-[#FF1A2A]/30"
          >
            <Shuffle className="w-4 h-4" /> Retake with Fresh Questions
          </button>
          <Link
            href="/modules/introduction"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#141414] hover:bg-[#1E1E1E] border border-[#2B2B2B] text-sm font-medium text-white transition-colors"
          >
            <BookOpen className="w-4 h-4" /> Return to Learning
          </Link>
        </div>
      </div>

      {/* Review Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#262626]">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#FF1A2A]" />
          <span className="text-sm font-semibold text-white">Detailed Question Review</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterMode === 'all'
                ? 'bg-[#FF1A2A] text-white font-semibold'
                : 'bg-[#141414] text-[#888888] hover:text-white border border-[#262626]'
            }`}
          >
            All Questions ({questions.length})
          </button>
          <button
            onClick={() => setFilterMode('incorrect')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterMode === 'incorrect'
                ? 'bg-[#FF1A2A] text-white font-semibold'
                : 'bg-[#141414] text-[#888888] hover:text-white border border-[#262626]'
            }`}
          >
            Incorrect Answers ({incorrectCount})
          </button>
        </div>
      </div>

      {/* Questions Breakdown List */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => {
          const userAnswer = attempt.answers[q.id];
          const isCorrect = userAnswer === q.correctAnswer;
          const optionLabels = ['A', 'B', 'C', 'D'];

          return (
            <div
              key={q.id}
              className={`p-5 rounded-xl border transition-all ${
                isCorrect
                  ? 'bg-[#0E0E0E] border-[#32D583]/30'
                  : 'bg-[#0E0E0E] border-[#FF1A2A]/30'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#888888]">Q{idx + 1}.</span>
                  <span className="text-xs font-medium text-[#FF1A2A] bg-[#141414] px-2.5 py-0.5 rounded border border-[#2B2B2B]">
                    {q.topic}
                  </span>
                </div>
                {isCorrect ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-[#32D583] bg-[#32D583]/10 px-2.5 py-1 rounded-full border border-[#32D583]/30">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-semibold text-[#FF1A2A] bg-[#FF1A2A]/10 px-2.5 py-1 rounded-full border border-[#FF1A2A]/30">
                    <XCircle className="w-3.5 h-3.5" /> Incorrect
                  </span>
                )}
              </div>

              <h4 className="text-sm md:text-base font-semibold text-white mt-1 mb-3">
                {q.question}
              </h4>

              {/* Options status */}
              <div className="space-y-2 mb-4">
                {q.options.map((opt, optIdx) => {
                  const wasChosen = userAnswer === optIdx;
                  const isTheCorrectOne = q.correctAnswer === optIdx;

                  let borderClass = 'border-[#262626] bg-[#141414] text-[#888888]';
                  if (isTheCorrectOne) {
                    borderClass =
                      'border-[#32D583] bg-[#32D583]/10 text-[#32D583] font-medium';
                  } else if (wasChosen && !isCorrect) {
                    borderClass =
                      'border-[#FF1A2A] bg-[#FF1A2A]/10 text-[#FF1A2A]';
                  }

                  return (
                    <div
                      key={optIdx}
                      className={`text-xs p-2.5 rounded-lg border flex items-center justify-between ${borderClass}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] bg-black/40">
                          {optionLabels[optIdx]}
                        </span>
                        <span>{opt}</span>
                      </div>
                      <div className="shrink-0 text-[11px] font-semibold">
                        {isTheCorrectOne && '✓ Correct Answer'}
                        {wasChosen && !isTheCorrectOne && '✗ Your Selection'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explanation box */}
              <div className="p-3 rounded-lg bg-[#050505] border border-[#262626] text-xs leading-relaxed text-[#D4D4D8]">
                <strong className="text-white block mb-1">Explanation:</strong>
                {q.explanation}
              </div>

              {/* Recommended Revision Link */}
              <div className="mt-3 flex items-center justify-end">
                <Link
                  href={`/modules/${q.recommendedModuleSlug}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#FF1A2A] hover:text-white transition-colors"
                >
                  Review in {q.recommendedModuleTitle} <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
