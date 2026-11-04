/**
 * Official CVSS v3.1 Base Metric Calculator
 * Specification: FIRST Common Vulnerability Scoring System v3.1
 * https://www.first.org/cvss/v3.1/specification-document
 */

export type AttackVector = 'NETWORK' | 'ADJACENT_NETWORK' | 'LOCAL' | 'PHYSICAL';
export type AttackComplexity = 'LOW' | 'HIGH';
export type PrivilegesRequired = 'NONE' | 'LOW' | 'HIGH';
export type UserInteraction = 'NONE' | 'REQUIRED';
export type Scope = 'UNCHANGED' | 'CHANGED';
export type CiaImpact = 'NONE' | 'LOW' | 'HIGH';

export interface CvssV31BaseMetrics {
  av: AttackVector;
  ac: AttackComplexity;
  pr: PrivilegesRequired;
  ui: UserInteraction;
  s: Scope;
  c: CiaImpact;
  i: CiaImpact;
  a: CiaImpact;
}

export interface CvssCalculationResult {
  baseScore: number;
  severity: 'None' | 'Low' | 'Medium' | 'High' | 'Critical';
  vectorString: string;
  impactSubScore: number;
  exploitabilitySubScore: number;
  impactScore: number;
  metrics: CvssV31BaseMetrics;
}

// Weights per CVSS v3.1 specification
const AV_WEIGHTS: Record<AttackVector, { weight: number; code: string; label: string }> = {
  NETWORK: { weight: 0.85, code: 'N', label: 'Network (AV:N)' },
  ADJACENT_NETWORK: { weight: 0.62, code: 'A', label: 'Adjacent Network (AV:A)' },
  LOCAL: { weight: 0.55, code: 'L', label: 'Local (AV:L)' },
  PHYSICAL: { weight: 0.20, code: 'P', label: 'Physical (AV:P)' },
};

const AC_WEIGHTS: Record<AttackComplexity, { weight: number; code: string; label: string }> = {
  LOW: { weight: 0.77, code: 'L', label: 'Low (AC:L)' },
  HIGH: { weight: 0.44, code: 'H', label: 'High (AC:H)' },
};

const UI_WEIGHTS: Record<UserInteraction, { weight: number; code: string; label: string }> = {
  NONE: { weight: 0.85, code: 'N', label: 'None (UI:N)' },
  REQUIRED: { weight: 0.62, code: 'R', label: 'Required (UI:R)' },
};

const CIA_WEIGHTS: Record<CiaImpact, { weight: number; code: string; label: string }> = {
  NONE: { weight: 0.0, code: 'N', label: 'None (N)' },
  LOW: { weight: 0.22, code: 'L', label: 'Low (L)' },
  HIGH: { weight: 0.56, code: 'H', label: 'High (H)' },
};

// PR depends on Scope
const PR_WEIGHTS: Record<Scope, Record<PrivilegesRequired, { weight: number; code: string; label: string }>> = {
  UNCHANGED: {
    NONE: { weight: 0.85, code: 'N', label: 'None (PR:N)' },
    LOW: { weight: 0.62, code: 'L', label: 'Low (PR:L)' },
    HIGH: { weight: 0.27, code: 'H', label: 'High (PR:H)' },
  },
  CHANGED: {
    NONE: { weight: 0.85, code: 'N', label: 'None (PR:N)' },
    LOW: { weight: 0.68, code: 'L', label: 'Low (PR:L)' },
    HIGH: { weight: 0.50, code: 'H', label: 'High (PR:H)' },
  },
};

/**
 * Official CVSS v3.1 Roundup function:
 * The smallest number, specified to one decimal place, that is greater than or equal to the input.
 */
export function cvssRoundup(input: number): number {
  const intInput = Math.round(input * 100000);
  if (intInput % 10000 === 0) {
    return intInput / 100000;
  }
  return (Math.floor(intInput / 10000) + 1) / 10;
}

export function calculateCvssV31(metrics: CvssV31BaseMetrics): CvssCalculationResult {
  const av = AV_WEIGHTS[metrics.av].weight;
  const ac = AC_WEIGHTS[metrics.ac].weight;
  const pr = PR_WEIGHTS[metrics.s][metrics.pr].weight;
  const ui = UI_WEIGHTS[metrics.ui].weight;
  const c = CIA_WEIGHTS[metrics.c].weight;
  const i = CIA_WEIGHTS[metrics.i].weight;
  const a = CIA_WEIGHTS[metrics.a].weight;

  // Impact Sub-Score (ISS)
  const iss = 1 - (1 - c) * (1 - i) * (1 - a);

  // Impact
  let impact: number;
  if (metrics.s === 'UNCHANGED') {
    impact = 6.42 * iss;
  } else {
    impact = 7.52 * (iss - 0.029) - 3.25 * Math.pow(iss - 0.02, 15);
  }

  // Exploitability
  const exploitability = 8.22 * av * ac * pr * ui;

  let baseScore = 0;
  if (impact > 0) {
    if (metrics.s === 'UNCHANGED') {
      baseScore = cvssRoundup(Math.min(impact + exploitability, 10));
    } else {
      baseScore = cvssRoundup(Math.min(1.08 * (impact + exploitability), 10));
    }
  }

  // Ensure 1 decimal place bounds
  baseScore = Math.min(10.0, Math.max(0.0, Math.round(baseScore * 10) / 10));

  let severity: 'None' | 'Low' | 'Medium' | 'High' | 'Critical' = 'None';
  if (baseScore === 0.0) severity = 'None';
  else if (baseScore <= 3.9) severity = 'Low';
  else if (baseScore <= 6.9) severity = 'Medium';
  else if (baseScore <= 8.9) severity = 'High';
  else severity = 'Critical';

  const vectorString = `CVSS:3.1/AV:${AV_WEIGHTS[metrics.av].code}/AC:${AC_WEIGHTS[metrics.ac].code}/PR:${PR_WEIGHTS[metrics.s][metrics.pr].code}/UI:${UI_WEIGHTS[metrics.ui].code}/S:${metrics.s === 'UNCHANGED' ? 'U' : 'C'}/C:${CIA_WEIGHTS[metrics.c].code}/I:${CIA_WEIGHTS[metrics.i].code}/A:${CIA_WEIGHTS[metrics.a].code}`;

  return {
    baseScore,
    severity,
    vectorString,
    impactSubScore: Math.round(iss * 100) / 100,
    exploitabilitySubScore: Math.round(exploitability * 10) / 10,
    impactScore: Math.round(impact * 10) / 10,
    metrics,
  };
}

export const DEFAULT_CVSS_METRICS: CvssV31BaseMetrics = {
  av: 'NETWORK',
  ac: 'LOW',
  pr: 'NONE',
  ui: 'NONE',
  s: 'UNCHANGED',
  c: 'HIGH',
  i: 'HIGH',
  a: 'HIGH',
};

export const CVSS_METRIC_DESCRIPTIONS = {
  av: {
    name: 'Attack Vector (AV)',
    description: 'Reflects the context by which vulnerability exploitation is possible (Network, Adjacent, Local, Physical).',
  },
  ac: {
    name: 'Attack Complexity (AC)',
    description: 'Describes conditions beyond the attacker’s control that must exist to exploit the vulnerability (Low vs High).',
  },
  pr: {
    name: 'Privileges Required (PR)',
    description: 'Describes the level of privileges an attacker must possess before successfully exploiting the vulnerability.',
  },
  ui: {
    name: 'User Interaction (UI)',
    description: 'Captures the requirement for a human user, other than the attacker, to participate in the compromise.',
  },
  s: {
    name: 'Scope (S)',
    description: 'Captures whether a vulnerability in one component impacts resources in beyond its security authority.',
  },
  c: {
    name: 'Confidentiality (C)',
    description: 'Measures the impact to the confidentiality of the information resources managed by the impacted component.',
  },
  i: {
    name: 'Integrity (I)',
    description: 'Measures the impact to the trustworthiness and veracity of information.',
  },
  a: {
    name: 'Availability (A)',
    description: 'Measures the impact to the availability of the impacted component (accessibility and uptime).',
  },
};
