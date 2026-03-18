// ─── Domain Enums ────────────────────────────────────────────────────────────

export type DealStatus = 'prospect' | 'active' | 'at_risk' | 'closed_won' | 'closed_lost';
export type BlockerSeverity = 'low' | 'medium' | 'high' | 'critical';
export type EffortSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type FeatureStatus = 'backlog' | 'in_progress' | 'done';
export type BlockerStatus = 'open' | 'in_progress' | 'resolved';
export type Priority = 'low' | 'medium' | 'high';
export type ActiveView = 'dashboard' | 'roi';
export type WorkspaceTab = 'overview' | 'requirements' | 'blockers' | 'features';

// ─── Effort Mappings ─────────────────────────────────────────────────────────

export const EFFORT_DAYS: Record<EffortSize, number> = {
  xs: 1,
  sm: 3,
  md: 5,
  lg: 10,
  xl: 20,
};

export const EFFORT_LABELS: Record<EffortSize, string> = {
  xs: '~1 day',
  sm: '~3 days',
  md: '~1 week',
  lg: '~2 weeks',
  xl: '~1 month',
};

// ─── Core Entities ────────────────────────────────────────────────────────────

export interface FeatureGap {
  id: string;
  title: string;
  description: string;
  effortSize: EffortSize;
  revenueImpact: number;
  priority: Priority;
  status: FeatureStatus;
  createdAt: string;
}

export interface TechBlocker {
  id: string;
  dealId: string;
  title: string;
  description: string;
  severity: BlockerSeverity;
  status: BlockerStatus;
  assignedTo: string;
  createdAt: string;
}

export interface CustomerRequirement {
  id: string;
  title: string;
  description: string;
  isMet: boolean;
}

export interface Deal {
  id: string;
  companyName: string;
  contactName: string;
  contactTitle: string;
  dealValue: number;
  status: DealStatus;
  closeDate: string;
  likelihoodToClose: number;
  requirements: CustomerRequirement[];
  techBlockers: TechBlocker[];
  featureGaps: FeatureGap[];
  notes: string;
  salesOwner: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Derived / Aggregated ─────────────────────────────────────────────────────

export interface AggregatedFeature {
  featureId: string;
  title: string;
  description: string;
  effortSize: EffortSize;
  status: FeatureStatus;
  priority: Priority;
  totalRevenue: number;
  roiPerDay: number;
  affectedDeals: { id: string; companyName: string; dealValue: number }[];
}
