'use client';

import React from 'react';
import { QuizQuestionData } from '@/types/quiz';

interface Props {
  question: QuizQuestionData;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer: number | undefined;
  onSelectAnswer: (optionIndex: number) => void;
  onClearAnswer: () => void;
}

export default function QuizQuestion({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  onClearAnswer,
}: Props) {
  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Question Header & Category */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold text-[#FF1A2A] bg-[#141414] px-3 py-1 rounded-full border border-[#2B2B2B] uppercase tracking-wider">
          Topic: {question.topic}
        </span>
        {selectedAnswer !== undefined && (
          <button
            onClick={onClearAnswer}
            className="text-xs text-[#888888] hover:text-[#FF1A2A] transition-colors"
          >
            Clear Selection
          </button>
        )}
      </div>

      {/* Question Statement */}
      <div className="text-lg md:text-xl font-medium text-white leading-snug">
        {question.question}
      </div>

      {/* Options */}
      <div className="space-y-3 pt-2">
        {question.options.map((option, idx) => {
          const isSelected = selectedAnswer === idx;

          return (
            <button
              key={idx}
              onClick={() => onSelectAnswer(idx)}
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-4 ${
                isSelected
                  ? 'bg-[#FF1A2A]/10 border-[#FF1A2A] shadow-[0_0_18px_rgba(255,26,42,0.25)]'
                  : 'bg-[#111111] border-[#262626] hover:border-[#FF1A2A]/50 hover:bg-[#181818]'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-bold text-xs transition-colors ${
                  isSelected
                    ? 'bg-[#FF1A2A] text-white shadow-sm'
                    : 'bg-[#181818] text-[#888888] border border-[#2B2B2B]'
                }`}
              >
                {optionLabels[idx]}
              </div>
              <div
                className={`text-sm leading-relaxed ${
                  isSelected ? 'text-white font-medium' : 'text-[#D4D4D8]'
                }`}
              >
                {option}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
