export interface QuizQuestionData {
  id: number;
  question: string;
  options: [string, string, string, string];
  correctAnswer: number; // 0, 1, 2, or 3
  explanation: string;
  topic: string;
  recommendedModuleSlug: string;
  recommendedModuleTitle: string;
}

export interface QuizAttempt {
  id: string;
  timestamp: number;
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: { [questionId: number]: number };
  tier: 'Excellent' | 'Good' | 'Developing' | 'Practice';
}
