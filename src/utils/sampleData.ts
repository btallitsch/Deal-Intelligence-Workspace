import { Deal } from '../types';

function uid(): string {
  return crypto.randomUUID();
}

const now = new Date().toISOString();
const inDays = (n: number) => new Date(Date.now() + n * 86_400_000).toISOString();

export const SAMPLE_DEALS: Deal[] = [
  // ── Deal 1: Acme Corp ────────────────────────────────────────────────────
  {
    id: uid(),
    companyName: 'Acme Corp',
    contactName: 'Sarah Chen',
    contactTitle: 'VP Engineering',
    dealValue: 80_000,
    status: 'active',
    closeDate: inDays(28),
    likelihoodToClose: 70,
    salesOwner: 'Alex Rivera',
    notes:
      'Very excited about the core product. Evaluating 2 competitors. SSO is a hard blocker — decision expected in 4 weeks. Security review started.',
    requirements: [
      {
        id: uid(),
        title: 'SSO / SAML Integration',
        description: 'Must support Okta via SAML 2.0. Required by IT policy.',
        isMet: false,
      },
      {
        id: uid(),
        title: 'Audit Logs',
        description: 'Immutable audit trail for SOC2 compliance.',
        isMet: false,
      },
      {
        id: uid(),
        title: 'REST API Access',
        description: 'Public REST API for their internal integrations.',
        isMet: true,
      },
      {
        id: uid(),
        title: 'Role-Based Permissions',
        description: 'Admin / Editor / Viewer roles.',
        isMet: true,
      },
    ],
    techBlockers: [
      {
        id: uid(),
        dealId: '',
        title: 'No SAML 2.0 support',
        description:
          "Platform only supports username/password auth. Acme's IT policy mandates Okta SSO for all SaaS tools.",
        severity: 'critical',
        status: 'open',
        assignedTo: 'Backend Platform Team',
        createdAt: now,
      },
    ],
    featureGaps: [
      {
        id: 'fg-sso',
        title: 'SAML / SSO Integration',
        description: 'Enterprise SSO via Okta and Azure AD using SAML 2.0.',
        effortSize: 'lg',
        revenueImpact: 80_000,
        priority: 'high',
        status: 'backlog',
        createdAt: now,
      },
      {
        id: 'fg-audit',
        title: 'Audit Log System',
        description: 'Tamper-proof audit trail with CSV/JSON export.',
        effortSize: 'md',
        revenueImpact: 80_000,
        priority: 'high',
        status: 'backlog',
        createdAt: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  },

  // ── Deal 2: Globex Industries ────────────────────────────────────────────
  {
    id: uid(),
    companyName: 'Globex Industries',
    contactName: 'Marcus Holt',
    contactTitle: 'CTO',
    dealValue: 145_000,
    status: 'at_risk',
    closeDate: inDays(12),
    likelihoodToClose: 35,
    salesOwner: 'Jamie Torres',
    notes:
      "CTO is firm on EU data residency — non-negotiable due to GDPR obligations. Deal will slip to Q3 or be lost entirely if we can't commit to an EU deployment timeline this month.",
    requirements: [
      {
        id: uid(),
        title: 'EU Data Residency',
        description: 'All customer data must reside in EU (Frankfurt or Dublin).',
        isMet: false,
      },
      {
        id: uid(),
        title: 'GDPR Compliance Tooling',
        description: 'Right-to-erasure, data portability, consent management.',
        isMet: false,
      },
      {
        id: uid(),
        title: '99.9% SLA',
        description: 'Contractual uptime guarantee.',
        isMet: true,
      },
      {
        id: uid(),
        title: 'Dedicated Account Manager',
        description: 'Named CSM post-sale.',
        isMet: true,
      },
    ],
    techBlockers: [
      {
        id: uid(),
        dealId: '',
        title: 'No EU infrastructure region',
        description: 'All infra runs in us-east-1 and us-west-2. No EU deployment option available.',
        severity: 'critical',
        status: 'open',
        assignedTo: 'Infrastructure Team',
        createdAt: now,
      },
      {
        id: uid(),
        dealId: '',
        title: 'Incomplete GDPR data deletion flow',
        description: "Right-to-erasure cascade doesn't cover all storage layers (S3 backups).",
        severity: 'high',
        status: 'in_progress',
        assignedTo: 'Backend Team',
        createdAt: now,
      },
    ],
    featureGaps: [
      {
        id: 'fg-eu',
        title: 'EU Data Residency',
        description: 'Deploy to EU region with data locality guarantees and DPA support.',
        effortSize: 'xl',
        revenueImpact: 145_000,
        priority: 'high',
        status: 'backlog',
        createdAt: now,
      },
      {
        id: 'fg-gdpr',
        title: 'GDPR Compliance Suite',
        description: 'Right-to-erasure, portability export, consent records.',
        effortSize: 'lg',
        revenueImpact: 145_000,
        priority: 'high',
        status: 'in_progress',
        createdAt: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  },

  // ── Deal 3: Umbrella Digital ─────────────────────────────────────────────
  {
    id: uid(),
    companyName: 'Umbrella Digital',
    contactName: 'David Park',
    contactTitle: 'Director of Operations',
    dealValue: 38_000,
    status: 'active',
    closeDate: inDays(18),
    likelihoodToClose: 85,
    salesOwner: 'Jamie Torres',
    notes: 'High intent — champion is pushing hard internally. Just needs SSO checkbox ticked and they will sign next sprint.',
    requirements: [
      {
        id: uid(),
        title: 'SSO / SAML Integration',
        description: 'Okta SSO required by IT.',
        isMet: false,
      },
      {
        id: uid(),
        title: 'Bulk CSV Import',
        description: 'Import historical data via CSV.',
        isMet: true,
      },
      {
        id: uid(),
        title: 'Outbound Webhooks',
        description: 'Webhook events for their Zapier integration.',
        isMet: true,
      },
    ],
    techBlockers: [],
    featureGaps: [
      {
        id: 'fg-sso',   // ← same feature ID as Acme — will merge in ROI view
        title: 'SAML / SSO Integration',
        description: 'Enterprise SSO via Okta and Azure AD using SAML 2.0.',
        effortSize: 'lg',
        revenueImpact: 38_000,
        priority: 'high',
        status: 'backlog',
        createdAt: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  },

  // ── Deal 4: Initech Solutions ────────────────────────────────────────────
  {
    id: uid(),
    companyName: 'Initech Solutions',
    contactName: 'Priya Nair',
    contactTitle: 'Head of Product',
    dealValue: 52_000,
    status: 'prospect',
    closeDate: inDays(55),
    likelihoodToClose: 50,
    salesOwner: 'Alex Rivera',
    notes: 'Early discovery stage. Very excited about core analytics. Mobile app is the primary missing piece — their field team lives on their phones.',
    requirements: [
      {
        id: uid(),
        title: 'iOS + Android App',
        description: 'Native mobile app for field team.',
        isMet: false,
      },
      {
        id: uid(),
        title: 'Offline Mode',
        description: 'Work offline with background sync.',
        isMet: false,
      },
      {
        id: uid(),
        title: 'Custom Dashboard Widgets',
        description: 'Configurable home screen.',
        isMet: true,
      },
    ],
    techBlockers: [
      {
        id: uid(),
        dealId: '',
        title: 'No mobile SDK',
        description: 'No React Native or Flutter SDK exists. Web app is not PWA-capable.',
        severity: 'high',
        status: 'open',
        assignedTo: 'Mobile Team',
        createdAt: now,
      },
    ],
    featureGaps: [
      {
        id: 'fg-mobile',
        title: 'Mobile App (iOS + Android)',
        description: 'React Native app with feature parity and offline sync.',
        effortSize: 'xl',
        revenueImpact: 52_000,
        priority: 'medium',
        status: 'backlog',
        createdAt: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  },

  // ── Deal 5: Waystar Royco (Closed Won) ────────────────────────────────────
  {
    id: uid(),
    companyName: 'Waystar Royco',
    contactName: 'Roman Roy',
    contactTitle: 'President',
    dealValue: 250_000,
    status: 'closed_won',
    closeDate: inDays(-8),
    likelihoodToClose: 100,
    salesOwner: 'Alex Rivera',
    notes: 'Closed! Enterprise tier with dedicated deployment. Signed off by legal and procurement.',
    requirements: [
      {
        id: uid(),
        title: 'Dedicated Cloud Instance',
        description: 'Private deployment on their AWS account.',
        isMet: true,
      },
      {
        id: uid(),
        title: '99.99% SLA',
        description: 'Enterprise uptime SLA.',
        isMet: true,
      },
    ],
    techBlockers: [],
    featureGaps: [],
    createdAt: now,
    updatedAt: now,
  },
];
