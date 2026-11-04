export interface LessonSection {
  id: string;
  title: string;
  content: string;
  keyTakeaways?: string[];
  practicalObservations?: string[];
  codeSnippets?: {
    language: string;
    code: string;
    caption?: string;
  }[];
}

export type ComparisonRow = Record<string, string>;

export interface ComparisonTableData {
  title: string;
  description?: string;
  columns: { key: string; label: string }[];
  rows: ComparisonRow[];
}

export interface KnowledgeCheckQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ModuleData {
  id: string;
  slug: string;
  moduleNumber: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  estimatedMinutes: number;
  category: 'Fundamentals' | 'Standards & Metrics' | 'Analysis & Validation' | 'Operations & Tools' | 'Professional Practice';
  summary: string;
  sections: LessonSection[];
  comparisonTables?: ComparisonTableData[];
  knowledgeCheck?: KnowledgeCheckQuestion;
  workflowId?: string;
  externalLinks?: { title: string; url: string; description: string }[];
}
