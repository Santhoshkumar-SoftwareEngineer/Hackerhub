import { QuizAttempt } from '@/types/quiz';

const STORAGE_KEYS = {
  COMPLETED_MODULES: 'va_completed_modules',
  BOOKMARKS: 'va_bookmarks',
  MODULE_NOTES: 'va_module_notes',
  QUIZ_ATTEMPTS: 'va_quiz_attempts',
  LAST_VISITED_MODULE: 'va_last_visited_module',
  WORKFLOW_POSITIONS: 'va_workflow_positions',
  LAB_PROGRESS: 'va_lab_progress',
  THEME: 'va_theme',
};

// Safe access helper
function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch (err) {
    console.warn(`Error reading localStorage key "${key}":`, err);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error saving to localStorage key "${key}":`, err);
  }
}

// Module Completion
export function getCompletedModules(): string[] {
  return getItem<string[]>(STORAGE_KEYS.COMPLETED_MODULES, []);
}

export function toggleModuleCompleted(slug: string): boolean {
  const current = getCompletedModules();
  let updated: string[];
  let isNowCompleted = false;
  if (current.includes(slug)) {
    updated = current.filter((s) => s !== slug);
    isNowCompleted = false;
  } else {
    updated = [...current, slug];
    isNowCompleted = true;
  }
  setItem(STORAGE_KEYS.COMPLETED_MODULES, updated);
  return isNowCompleted;
}

// Bookmarks
export function getBookmarks(): string[] {
  return getItem<string[]>(STORAGE_KEYS.BOOKMARKS, []);
}

export function toggleBookmark(slug: string): boolean {
  const current = getBookmarks();
  let updated: string[];
  let isBookmarked = false;
  if (current.includes(slug)) {
    updated = current.filter((s) => s !== slug);
    isBookmarked = false;
  } else {
    updated = [...current, slug];
    isBookmarked = true;
  }
  setItem(STORAGE_KEYS.BOOKMARKS, updated);
  return isBookmarked;
}

// Notes per module
export function getModuleNote(slug: string): string {
  const allNotes = getItem<Record<string, string>>(STORAGE_KEYS.MODULE_NOTES, {});
  return allNotes[slug] || '';
}

export function saveModuleNote(slug: string, note: string): void {
  const allNotes = getItem<Record<string, string>>(STORAGE_KEYS.MODULE_NOTES, {});
  allNotes[slug] = note;
  setItem(STORAGE_KEYS.MODULE_NOTES, allNotes);
}

// Last Visited
export function getLastVisitedModule(): string | null {
  return getItem<string | null>(STORAGE_KEYS.LAST_VISITED_MODULE, null);
}

export function setLastVisitedModule(slug: string): void {
  setItem(STORAGE_KEYS.LAST_VISITED_MODULE, slug);
}

// Quiz Attempts & Best Score
export function getQuizAttempts(): QuizAttempt[] {
  return getItem<QuizAttempt[]>(STORAGE_KEYS.QUIZ_ATTEMPTS, []);
}

export function saveQuizAttempt(attempt: QuizAttempt): void {
  const current = getQuizAttempts();
  setItem(STORAGE_KEYS.QUIZ_ATTEMPTS, [attempt, ...current]);
}

export function getBestQuizScore(): number {
  const attempts = getQuizAttempts();
  if (attempts.length === 0) return 0;
  return Math.max(...attempts.map((a) => a.score));
}

// Workflow Node Positions
export function getSavedWorkflowPositions(workflowId: string): Record<string, { x: number; y: number }> | null {
  const allPositions = getItem<Record<string, Record<string, { x: number; y: number }>>>(STORAGE_KEYS.WORKFLOW_POSITIONS, {});
  return allPositions[workflowId] || null;
}

export function saveWorkflowPositions(workflowId: string, positions: Record<string, { x: number; y: number }>): void {
  const allPositions = getItem<Record<string, Record<string, { x: number; y: number }>>>(STORAGE_KEYS.WORKFLOW_POSITIONS, {});
  allPositions[workflowId] = positions;
  setItem(STORAGE_KEYS.WORKFLOW_POSITIONS, allPositions);
}

export function clearWorkflowPositions(workflowId: string): void {
  const allPositions = getItem<Record<string, Record<string, { x: number; y: number }>>>(STORAGE_KEYS.WORKFLOW_POSITIONS, {});
  delete allPositions[workflowId];
  setItem(STORAGE_KEYS.WORKFLOW_POSITIONS, allPositions);
}

// Lab Progress
export interface LabProgressState {
  completedSteps: string[];
  stepNotes: Record<string, string>;
  checklistItems: Record<string, boolean>;
}

export function getLabProgress(): LabProgressState {
  return getItem<LabProgressState>(STORAGE_KEYS.LAB_PROGRESS, {
    completedSteps: [],
    stepNotes: {},
    checklistItems: {},
  });
}

export function saveLabProgress(progress: LabProgressState): void {
  setItem(STORAGE_KEYS.LAB_PROGRESS, progress);
}

// Theme
export function getStoredTheme(): 'dark' | 'light' {
  return getItem<'dark' | 'light'>(STORAGE_KEYS.THEME, 'dark');
}

export function setStoredTheme(theme: 'dark' | 'light'): void {
  setItem(STORAGE_KEYS.THEME, theme);
}

// Full Reset
export function resetAllLearningProgress(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEYS.COMPLETED_MODULES);
    window.localStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
    window.localStorage.removeItem(STORAGE_KEYS.MODULE_NOTES);
    window.localStorage.removeItem(STORAGE_KEYS.QUIZ_ATTEMPTS);
    window.localStorage.removeItem(STORAGE_KEYS.LAST_VISITED_MODULE);
    window.localStorage.removeItem(STORAGE_KEYS.LAB_PROGRESS);
    window.localStorage.removeItem(STORAGE_KEYS.WORKFLOW_POSITIONS);
  } catch (err) {
    console.warn('Error clearing progress:', err);
  }
}
