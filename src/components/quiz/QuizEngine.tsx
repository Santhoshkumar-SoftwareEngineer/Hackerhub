'use client';

import React, { useState, useEffect } from 'react';
import { QuizQuestionData, QuizAttempt } from '@/types/quiz';
import { generateRandomQuiz } from '@/data/quizQuestions';
import { saveQuizAttempt, getQuizAttempts } from '@/lib/storage';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';
import {
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertCircle,
  RotateCcw,
  History,
  Shuffle,
  Sparkles,
} from 'lucide-react';

export default function QuizEngine() {
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestionData[]>([]);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [questionId: number]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [currentAttempt, setCurrentAttempt] = useState<QuizAttempt | null>(null);
  const [pastAttempts, setPastAttempts] = useState<QuizAttempt[]>([]);
  const [quizIteration, setQuizIteration] = useState<number>(1);

  // Initialize fresh dynamic randomized quiz on client mount to avoid hydration mismatch
  useEffect(() => {
    setActiveQuestions(generateRandomQuiz(undefined, 15));
    setIsMounted(true);
    setPastAttempts(getQuizAttempts());
  }, []);

  useEffect(() => {
    if (isSubmitted) {
      setPastAttempts(getQuizAttempts());
    }
  }, [isSubmitted]);

  // Generate a brand new randomized quiz attempt
  const handleNewQuiz = (force: boolean = false) => {
    if (!force && Object.keys(answers).length > 0) {
      if (
        !window.confirm(
          'Generate a brand new randomized quiz? Your current answers in this attempt will be reset.'
        )
      ) {
        return;
      }
    }
    setActiveQuestions(generateRandomQuiz(undefined, 15));
    setAnswers({});
    setCurrentIndex(0);
    setIsSubmitted(false);
    setCurrentAttempt(null);
    setQuizIteration((prev) => prev + 1);
  };

  const handleRetake = () => {
    handleNewQuiz(true);
  };

  if (!isMounted || activeQuestions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-12 rounded-2xl border border-[#262626] bg-[#0A0A0A] text-center space-y-4">
        <div className="inline-flex p-3 rounded-xl bg-[#141414] border border-[#262626] text-[#FF1A2A] animate-spin">
          <Shuffle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">Generating Fresh Quiz...</h3>
        <p className="text-xs text-[#888888]">
          Sampling 15 randomized questions and shuffling answer positions across all 14 modules.
        </p>
      </div>
    );
  }

  const currentQuestion = activeQuestions[currentIndex];
  const totalQuestions = activeQuestions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercentage = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const handleSelectAnswer = (optionIdx: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIdx,
    }));
  };

  const handleClearAnswer = () => {
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQuestion.id];
      return copy;
    });
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    setShowConfirmModal(false);

    // Calculate score against active dynamic questions
    let correctCount = 0;
    activeQuestions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const percentage = Math.round((correctCount / totalQuestions) * 100);

    let tier: 'Excellent' | 'Good' | 'Developing' | 'Practice' = 'Practice';
    if (correctCount >= 13) tier = 'Excellent';
    else if (correctCount >= 10) tier = 'Good';
    else if (correctCount >= 7) tier = 'Developing';
    else tier = 'Practice';

    const newAttempt: QuizAttempt = {
      id: `attempt_${Date.now()}`,
      timestamp: Date.now(),
      score: correctCount,
      totalQuestions,
      percentage,
      answers,
      tier,
    };

    saveQuizAttempt(newAttempt);
    setCurrentAttempt(newAttempt);
    setIsSubmitted(true);
  };

  if (isSubmitted && currentAttempt) {
    return (
      <QuizResults
        attempt={currentAttempt}
        questions={activeQuestions}
        onRetake={handleRetake}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Quiz Card */}
      <div className="rounded-2xl border border-[#262626] bg-[#0A0A0A] overflow-hidden shadow-2xl">
        {/* Top Header & Progress */}
        <div className="p-6 border-b border-[#262626] bg-[#0F0F0F]">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-[#FF1A2A] uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Dynamic Knowledge Evaluation
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#181818] border border-[#2B2B2B] text-[#D4D4D8]">
                  Set #{quizIteration} • Randomized
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">
                Vulnerability Assessment Knowledge Test
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => handleNewQuiz()}
                title="Shuffle and generate a brand new set of questions"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141414] hover:bg-[#1E1E1E] text-xs font-medium text-[#D4D4D8] hover:text-white border border-[#2B2B2B] hover:border-[#FF1A2A]/50 transition-all shadow-sm"
              >
                <Shuffle className="w-3.5 h-3.5 text-[#FF1A2A]" />
                <span className="hidden sm:inline">New Questions</span>
              </button>

              <div className="text-right">
                <span className="text-xs text-[#888888]">Question</span>
                <div className="text-lg font-bold text-white">
                  {currentIndex + 1}{' '}
                  <span className="text-xs font-normal text-[#888888]">
                    / {totalQuestions}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#141414] h-2 rounded-full overflow-hidden border border-[#262626]">
            <div
              className="bg-gradient-to-r from-[#FF1A2A] to-[#FF4D6D] h-full transition-all duration-300 shadow-[0_0_10px_rgba(255,26,42,0.5)]"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Question Dots Navigation */}
          <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-[#262626]/70">
            {activeQuestions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = idx === currentIndex;

              let dotStyle = 'bg-[#141414] text-[#888888] border-[#262626] hover:border-[#444]';
              if (isCurrent) {
                dotStyle =
                  'bg-[#FF1A2A] text-white border-[#FF1A2A] ring-2 ring-[#FF1A2A]/40 font-bold';
              } else if (isAnswered) {
                dotStyle =
                  'bg-[#32D583]/15 text-[#32D583] border-[#32D583]/40';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  title={`Question ${idx + 1}: ${q.topic}`}
                  className={`w-7 h-7 rounded-lg text-xs flex items-center justify-center border transition-all ${dotStyle}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Area */}
        <div className="p-6 md:p-8">
          <QuizQuestion
            question={currentQuestion}
            currentIndex={currentIndex}
            totalQuestions={totalQuestions}
            selectedAnswer={answers[currentQuestion.id]}
            onSelectAnswer={handleSelectAnswer}
            onClearAnswer={handleClearAnswer}
          />
        </div>

        {/* Footer Navigation Bar */}
        <div className="p-6 border-t border-[#262626] bg-[#0F0F0F] flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#141414] hover:bg-[#1E1E1E] disabled:opacity-40 disabled:cursor-not-allowed border border-[#262626] text-xs font-semibold text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#888888] hidden sm:inline">
              Answered: <strong className="text-white">{answeredCount}</strong> /{' '}
              {totalQuestions}
            </span>

            {currentIndex === totalQuestions - 1 ? (
              <button
                onClick={() => setShowConfirmModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#32D583] hover:bg-[#28b86f] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#32D583]/20"
              >
                <Send className="w-4 h-4" /> Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#FF1A2A] hover:bg-[#E01424] text-white text-xs font-semibold transition-all shadow-lg shadow-[#FF1A2A]/20"
              >
                Next Question <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#2B2B2B] rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-[#FFA500] mb-3">
              <AlertCircle className="w-6 h-6 text-[#FF1A2A]" />
              <h3 className="text-base font-bold text-white">Confirm Submission</h3>
            </div>
            <p className="text-xs text-[#D4D4D8] leading-relaxed mb-4">
              You have answered <strong className="text-white">{answeredCount}</strong> of{' '}
              <strong className="text-white">{totalQuestions}</strong> questions in this randomized set.
              {answeredCount < totalQuestions && (
                <span className="text-[#FFA500] block mt-1 font-semibold">
                  Warning: You have {totalQuestions - answeredCount} unanswered questions!
                </span>
              )}
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-lg bg-[#181818] hover:bg-[#222222] text-xs font-medium text-[#888888] hover:text-white transition-colors border border-[#2B2B2B]"
              >
                Review Answers
              </button>
              <button
                onClick={handleSubmit}
                className="px-5 py-2 rounded-lg bg-[#32D583] hover:bg-[#28b86f] text-black text-xs font-bold transition-all"
              >
                Yes, Submit Final Score
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prior Attempts History Card */}
      {pastAttempts.length > 0 && (
        <div className="p-5 rounded-xl border border-[#262626] bg-[#0A0A0A]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#FF1A2A]" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Your Previous Attempts
              </h4>
            </div>
            <span className="text-[11px] text-[#888888]">
              {pastAttempts.length} total attempt{pastAttempts.length === 1 ? '' : 's'} recorded
            </span>
          </div>
          <div className="space-y-2">
            {pastAttempts.slice(0, 3).map((att) => (
              <div
                key={att.id}
                className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-[#111111] border border-[#262626]"
              >
                <span className="text-[#888888]">
                  {new Date(att.timestamp).toLocaleDateString()} at{' '}
                  {new Date(att.timestamp).toLocaleTimeString()}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-white font-medium">
                    {att.score} / {att.totalQuestions} ({att.percentage}%)
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                      att.tier === 'Excellent'
                        ? 'bg-[#32D583]/15 text-[#32D583] border-[#32D583]/30'
                        : att.tier === 'Good'
                        ? 'bg-white/10 text-white border-white/20'
                        : att.tier === 'Developing'
                        ? 'bg-[#FFA500]/15 text-[#FFA500] border-[#FFA500]/30'
                        : 'bg-[#FF1A2A]/15 text-[#FF1A2A] border-[#FF1A2A]/30'
                    }`}
                  >
                    {att.tier}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
