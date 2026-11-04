export interface WorkflowNode {
  id: string;
  label: string;
  description: string;
  details?: string;
  realWorldExample?: string;
  keyQuestion?: string;
  pitfalls?: string[];
  sampleCommand?: string;
  activities?: string[];
  tools?: string[];
  deliverables?: string[];
  x: number;
  y: number;
  width?: number;
  height?: number;
  type?: 'default' | 'decision' | 'start' | 'end' | 'return' | 'status-confirmed' | 'status-fp' | 'status-na' | 'status-inconclusive';
  phase?: string;
  category?: string;
  color?: string;
}

export interface WorkflowConnection {
  from: string;
  to: string;
  label?: string;
  style?: 'solid' | 'dashed' | 'loopback';
  color?: string;
  description?: string;
  dataArtifact?: string;
}

export interface WorkflowDefinition {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  defaultNodes: WorkflowNode[];
  connections: WorkflowConnection[];
  viewBox: { width: number; height: number };
  legend?: { label: string; color: string; description: string }[];
}
