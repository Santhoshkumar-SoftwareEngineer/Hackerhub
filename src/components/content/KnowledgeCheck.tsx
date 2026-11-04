'use client';

import React, { useState } from 'react';
import { KnowledgeCheckQuestion } from '@/types/lesson';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

interface Props {
  data: KnowledgeCheckQuestion;
}

export default function KnowledgeCheck({ data }: Props) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  const handleSelect = (idx: number) => {
    if (isRevealed) return;
    setSelectedIdx(idx);
    setIsRevealed(true);
  };

  const handleReset = () => {
    setSelectedIdx(null);
    setIsRevealed(false);
  };

  const isCorrect = selectedIdx === data.correctIndex;

  return (
    <div className="my-8 rounded-xl border border-[#273248] bg-[#0B101A] overflow-hidden">
      <div className="p-4 bg-[#101622] border-b border-[#273248] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#7C5CFF]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#F4F7FB]">Module Knowledge Check</h4>
        </div>
        {isRevealed && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-[11px] text-[#9BA8BC] hover:text-white transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Retry
          </button>
        )}
      </div>

      <div className="p-5 space-y-4">
        <div className="text-sm font-medium text-[#F4F7FB]">{data.question}</div>

        <div className="space-y-2">
          {data.options.map((opt, idx) => {
            const isChosen = selectedIdx === idx;
            const isTargetCorrect = idx === data.correctIndex;

            let borderClass = 'border-[#273248] bg-[#151D2B] text-[#9BA8BC] hover:border-[#7C5CFF]/40';
            if (isRevealed) {
              if (isTargetCorrect) {
                borderClass = 'border-[#32D583] bg-[#32D583]/10 text-[#32D583] font-medium';
              } else if (isChosen && !isCorrect) {
                borderClass = 'border-[#FF4D6D] bg-[#FF4D6D]/10 text-[#FF4D6D]';
              } else {
                borderClass = 'border-[#273248] bg-[#151D2B] opacity-50 text-[#9BA8BC]';
              }
            }

            return (
              <button
                key={idx}
                disabled={isRevealed}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-3 rounded-lg border text-xs transition-colors flex items-center justify-between ${borderClass}`}
              >
                <span>{opt}</span>
                {isRevealed && isTargetCorrect && <CheckCircle2 className="w-4 h-4 text-[#32D583] shrink-0" />}
                {isRevealed && isChosen && !isCorrect && <XCircle className="w-4 h-4 text-[#FF4D6D] shrink-0" />}
              </button>
            );
          })}
        </div>

        {isRevealed && (
          <div className="p-3.5 rounded-lg bg-[#080B12] border border-[#273248] text-xs text-[#9BA8BC] leading-relaxed animate-in fade-in">
            <strong className="text-[#F4F7FB] block mb-1">
              {isCorrect ? '✓ Correct! Explanation:' : '✗ Incorrect. Explanation:'}
            </strong>
            {data.explanation}
          </div>
        )}
      </div>
    </div>
  );
}
