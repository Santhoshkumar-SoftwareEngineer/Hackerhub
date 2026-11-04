export type FindingSeverity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';

export type ValidationStatus = 'Confirmed' | 'False Positive' | 'Not Applicable' | 'Inconclusive' | 'Pending Validation';

export interface AssessmentFinding {
  id: string;
  title: string;
  severity: FindingSeverity;
  cvssScore: number;
  cvssVector?: string;
  cveId?: string;
  cweId?: string;
  affectedAsset: string;
  portService?: string;
  validationStatus: ValidationStatus;
  description: string;
  evidence: string;
  reproductionSteps?: string;
  impactAnalysis: string;
  remediationGuidance: string;
  retestResult?: 'Pass' | 'Fail' | 'Pending';
  isHypothetical?: boolean;
}

export interface AssessmentReport {
  id: string;
  title: string;
  targetDescription: string;
  assessmentDate: string;
  assessorName: string;
  scope: string;
  methodology: string;
  toolsUsed: string[];
  findings: AssessmentFinding[];
  conclusion: string;
  limitations: string;
}

export interface LabStepData {
  id: string;
  stepNumber: number;
  title: string;
  instructions: string;
  command?: string;
  commandExplanation?: string;
  expectedObservation: string;
  evidenceChecklist: string[];
  category: 'Setup' | 'Discovery' | 'Scanning' | 'Analysis' | 'Remediation' | 'Verification';
}
