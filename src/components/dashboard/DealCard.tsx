import { ChevronRight, AlertTriangle, Puzzle, CheckCircle, Circle, Clock } from 'lucide-react';
import { Deal, DealStatus } from '../../types';
import { formatCurrency, formatRelativeDate, statusLabel } from '../../utils/formatters';
import { Badge } from '../ui/Badge';
import styles from './DealCard.module.css';

const STATUS_VARIANT: Record<DealStatus, 'gold' | 'teal' | 'red' | 'blue' | 'muted' | 'orange'> = {
  prospect: 'blue',
  active: 'teal',
  at_risk: 'red',
  closed_won: 'gold',
  closed_lost: 'muted',
};

interface DealCardProps {
  deal: Deal;
  onOpen: (deal: Deal) => void;
}

export function DealCard({ deal, onOpen }: DealCardProps) {
  const openBlockers = deal.techBlockers.filter(b => b.status !== 'resolved');
  const criticalCount = openBlockers.filter(b => b.severity === 'critical').length;
  const unmetReqs = deal.requirements.filter(r => !r.isMet).length;
  const totalReqs = deal.requirements.length;
  const metReqs = totalReqs - unmetReqs;
  const pct = totalReqs > 0 ? Math.round((metReqs / totalReqs) * 100) : 0;

  const isClosed = deal.status === 'closed_won' || deal.status === 'closed_lost';

  return (
    <div
      className={`${styles.card} ${isClosed ? styles.closed : ''}`}
      onClick={() => onOpen(deal)}
    >
      {/* Status stripe */}
      <div className={`${styles.stripe} ${styles[`stripe_${deal.status}`]}`} />

      <div className={styles.body}>
        {/* Top row */}
        <div className={styles.topRow}>
          <div className={styles.company}>
            <span className={styles.companyName}>{deal.companyName}</span>
            <Badge variant={STATUS_VARIANT[deal.status]}>{statusLabel(deal.status)}</Badge>
          </div>
          <div className={styles.value}>{formatCurrency(deal.dealValue)}</div>
        </div>

        {/* Contact row */}
        <div className={styles.contact}>
          <span>{deal.contactName}</span>
          <span className={styles.contactTitle}>{deal.contactTitle}</span>
        </div>

        {/* Close date & probability */}
        <div className={styles.metaRow}>
          <div className={styles.metaItem}>
            <Clock size={11} />
            <span>{formatRelativeDate(deal.closeDate)}</span>
          </div>
          <div className={styles.probability}>
            <div
              className={styles.probBar}
              style={{ '--pct': `${deal.likelihoodToClose}%` } as React.CSSProperties}
            />
            <span>{deal.likelihoodToClose}%</span>
          </div>
        </div>

        {/* Requirements progress */}
        {totalReqs > 0 && (
          <div className={styles.reqRow}>
            <div className={styles.reqTrack}>
              <div className={styles.reqFill} style={{ width: `${pct}%` }} />
            </div>
            <span className={styles.reqLabel}>
              {metReqs}/{totalReqs} reqs met
            </span>
          </div>
        )}

        {/* Signals row */}
        <div className={styles.signals}>
          {criticalCount > 0 && (
            <div className={styles.signal} data-type="critical">
              <AlertTriangle size={11} />
              <span>{criticalCount} critical blocker{criticalCount > 1 ? 's' : ''}</span>
            </div>
          )}
          {openBlockers.length > 0 && criticalCount === 0 && (
            <div className={styles.signal} data-type="warn">
              <AlertTriangle size={11} />
              <span>{openBlockers.length} blocker{openBlockers.length > 1 ? 's' : ''}</span>
            </div>
          )}
          {deal.featureGaps.length > 0 && (
            <div className={styles.signal} data-type="gap">
              <Puzzle size={11} />
              <span>{deal.featureGaps.length} feature gap{deal.featureGaps.length > 1 ? 's' : ''}</span>
            </div>
          )}
          {openBlockers.length === 0 && deal.featureGaps.length === 0 && (
            <div className={styles.signal} data-type="clean">
              <CheckCircle size={11} />
              <span>No blockers</span>
            </div>
          )}
          {deal.featureGaps.length === 0 && openBlockers.length === 0 && totalReqs > 0 && pct < 100 && (
            <div className={styles.signal} data-type="gap">
              <Circle size={11} />
              <span>{unmetReqs} unmet req{unmetReqs > 1 ? 's' : ''}</span>
            </div>
          )}
          <div className={styles.openBtn}>
            <ChevronRight size={13} />
          </div>
        </div>
      </div>
    </div>
  );
}
