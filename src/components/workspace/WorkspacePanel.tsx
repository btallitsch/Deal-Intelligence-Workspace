import { X, Building2, User, Calendar, Percent, StickyNote, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Deal, DealStatus, WorkspaceTab } from '../../types';
import { formatCurrency, formatDate, statusLabel } from '../../utils/formatters';
import { Badge } from '../ui/Badge';
import { RequirementsTab } from './RequirementsTab';
import { BlockersTab } from './BlockersTab';
import { FeaturesTab } from './FeaturesTab';
import { useDeals } from '../../hooks/useDeals';
import styles from './WorkspacePanel.module.css';

const STATUS_VARIANT: Record<DealStatus, 'gold' | 'teal' | 'red' | 'blue' | 'muted' | 'orange'> = {
  prospect: 'blue',
  active: 'teal',
  at_risk: 'red',
  closed_won: 'gold',
  closed_lost: 'muted',
};

const ALL_STATUSES: DealStatus[] = ['prospect', 'active', 'at_risk', 'closed_won', 'closed_lost'];

interface WorkspacePanelProps {
  deal: Deal;
  onClose: () => void;
  actions: ReturnType<typeof useDeals>;
}

export function WorkspacePanel({ deal, onClose, actions }: WorkspacePanelProps) {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview');
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState(deal.notes);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Keep notes in sync if deal changes externally
  useEffect(() => {
    setNotesValue(deal.notes);
  }, [deal.notes]);

  const handleNotesBlur = () => {
    setEditingNotes(false);
    if (notesValue !== deal.notes) {
      actions.updateDeal(deal.id, { notes: notesValue });
    }
  };

  const handleStatusChange = (status: DealStatus) => {
    actions.updateDealStatus(deal.id, status);
    setShowStatusMenu(false);
  };

  const openBlockers = deal.techBlockers.filter(b => b.status !== 'resolved');
  const unmetReqs = deal.requirements.filter(r => !r.isMet).length;

  const TABS: { id: WorkspaceTab; label: string; count?: number }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'requirements', label: 'Requirements', count: deal.requirements.length },
    { id: 'blockers', label: 'Blockers', count: openBlockers.length },
    { id: 'features', label: 'Feature Gaps', count: deal.featureGaps.length },
  ];

  return (
    <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.panel} ref={panelRef}>
        {/* Panel header */}
        <div className={styles.panelHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.companyRow}>
              <Building2 size={14} className={styles.companyIcon} />
              <h2 className={styles.companyName}>{deal.companyName}</h2>
              <div className={styles.statusSelector}>
                <button
                  className={styles.statusBtn}
                  onClick={() => setShowStatusMenu(v => !v)}
                >
                  <Badge variant={STATUS_VARIANT[deal.status]}>{statusLabel(deal.status)}</Badge>
                  <ChevronDown size={10} />
                </button>
                {showStatusMenu && (
                  <div className={styles.statusMenu}>
                    {ALL_STATUSES.map(s => (
                      <button
                        key={s}
                        className={`${styles.statusMenuItem} ${deal.status === s ? styles.statusMenuActive : ''}`}
                        onClick={() => handleStatusChange(s)}
                      >
                        <Badge variant={STATUS_VARIANT[s]}>{statusLabel(s)}</Badge>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className={styles.contactRow}>
              <User size={11} />
              <span>{deal.contactName}</span>
              <span className={styles.contactTitle}>·  {deal.contactTitle}</span>
              <span className={styles.salesOwner}>Owner: {deal.salesOwner}</span>
            </div>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.dealMeta}>
              <div className={styles.dealValue}>{formatCurrency(deal.dealValue)}</div>
              <div className={styles.dealStats}>
                <span className={styles.metaBit}>
                  <Calendar size={10} />{formatDate(deal.closeDate)}
                </span>
                <span className={styles.metaBit}>
                  <Percent size={10} />{deal.likelihoodToClose}% likely
                </span>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Inline alert banners */}
        {openBlockers.filter(b => b.severity === 'critical').length > 0 && (
          <div className={styles.alertBanner} data-type="critical">
            ⚠ {openBlockers.filter(b => b.severity === 'critical').length} critical blocker{openBlockers.filter(b => b.severity === 'critical').length > 1 ? 's' : ''} blocking this deal
          </div>
        )}
        {unmetReqs > 0 && openBlockers.filter(b => b.severity === 'critical').length === 0 && (
          <div className={styles.alertBanner} data-type="warn">
            {unmetReqs} unmet customer requirement{unmetReqs > 1 ? 's' : ''}
          </div>
        )}

        {/* Tabs */}
        <div className={styles.tabBar}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={styles.tabCount}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className={styles.tabContent}>
          {activeTab === 'overview' && (
            <div className={styles.overviewTab}>
              {/* Quick stats */}
              <div className={styles.quickStats}>
                <div className={styles.qs}>
                  <span className={styles.qsLabel}>Pipeline Weight</span>
                  <span className={styles.qsValue}>
                    {formatCurrency(Math.round(deal.dealValue * deal.likelihoodToClose / 100))}
                  </span>
                </div>
                <div className={styles.qs}>
                  <span className={styles.qsLabel}>Requirements Met</span>
                  <span className={styles.qsValue}>
                    {deal.requirements.filter(r => r.isMet).length}/{deal.requirements.length}
                  </span>
                </div>
                <div className={styles.qs}>
                  <span className={styles.qsLabel}>Open Blockers</span>
                  <span className={`${styles.qsValue} ${openBlockers.length > 0 ? styles.red : ''}`}>
                    {openBlockers.length}
                  </span>
                </div>
                <div className={styles.qs}>
                  <span className={styles.qsLabel}>Feature Gaps</span>
                  <span className={styles.qsValue}>{deal.featureGaps.length}</span>
                </div>
                <div className={styles.qs}>
                  <span className={styles.qsLabel}>Potential Revenue at Risk</span>
                  <span className={styles.qsValue}>
                    {formatCurrency(deal.featureGaps.reduce((s, f) => s + f.revenueImpact, 0))}
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div className={styles.notesSection}>
                <div className={styles.notesSectionHeader}>
                  <StickyNote size={13} />
                  <span>Deal Notes</span>
                </div>
                {editingNotes ? (
                  <textarea
                    className={styles.notesTextarea}
                    value={notesValue}
                    onChange={e => setNotesValue(e.target.value)}
                    onBlur={handleNotesBlur}
                    autoFocus
                    rows={6}
                  />
                ) : (
                  <div
                    className={styles.notesDisplay}
                    onClick={() => setEditingNotes(true)}
                  >
                    {deal.notes || (
                      <span className={styles.notesPlaceholder}>Click to add notes…</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'requirements' && (
            <RequirementsTab deal={deal} actions={actions} />
          )}

          {activeTab === 'blockers' && (
            <BlockersTab deal={deal} actions={actions} />
          )}

          {activeTab === 'features' && (
            <FeaturesTab deal={deal} actions={actions} />
          )}
        </div>
      </div>
    </div>
  );
}
