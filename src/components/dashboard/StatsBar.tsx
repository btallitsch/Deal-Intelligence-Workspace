import { TrendingUp, DollarSign, AlertTriangle, Wrench } from 'lucide-react';
import { Deal } from '../../types';
import {
  getActivePipelineTotal,
  getWeightedPipeline,
  getTotalUnlockableRevenue,
  getCriticalBlockerCount,
  getOpenBlockerCount,
} from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';
import styles from './StatsBar.module.css';

interface StatsBarProps {
  deals: Deal[];
  onROIClick: () => void;
}

export function StatsBar({ deals, onROIClick }: StatsBarProps) {
  const pipeline = getActivePipelineTotal(deals);
  const weighted = getWeightedPipeline(deals);
  const unlockable = getTotalUnlockableRevenue(deals);
  const criticalBlockers = getCriticalBlockerCount(deals);
  const openBlockers = getOpenBlockerCount(deals);
  const activeDealCount = deals.filter(
    d => d.status !== 'closed_won' && d.status !== 'closed_lost'
  ).length;

  return (
    <div className={styles.bar}>
      <div className={styles.stat}>
        <div className={styles.statIcon} data-color="gold">
          <DollarSign size={14} />
        </div>
        <div className={styles.statBody}>
          <span className={styles.statLabel}>Active Pipeline</span>
          <span className={styles.statValue}>{formatCurrency(pipeline)}</span>
          <span className={styles.statSub}>{activeDealCount} open deals</span>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.stat}>
        <div className={styles.statIcon} data-color="blue">
          <TrendingUp size={14} />
        </div>
        <div className={styles.statBody}>
          <span className={styles.statLabel}>Weighted Pipeline</span>
          <span className={styles.statValue}>{formatCurrency(weighted)}</span>
          <span className={styles.statSub}>probability-adjusted</span>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.stat} data-clickable="true" onClick={onROIClick}>
        <div className={styles.statIcon} data-color="teal">
          <Wrench size={14} />
        </div>
        <div className={styles.statBody}>
          <span className={styles.statLabel}>Unlockable via Features</span>
          <span className={`${styles.statValue} ${styles.teal}`}>{formatCurrency(unlockable)}</span>
          <span className={`${styles.statSub} ${styles.tealSub}`}>→ See Eng ROI view</span>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.stat}>
        <div
          className={styles.statIcon}
          data-color={criticalBlockers > 0 ? 'red' : 'muted'}
        >
          <AlertTriangle size={14} />
        </div>
        <div className={styles.statBody}>
          <span className={styles.statLabel}>Tech Blockers</span>
          <span
            className={`${styles.statValue} ${criticalBlockers > 0 ? styles.red : ''}`}
          >
            {openBlockers}
          </span>
          <span className={styles.statSub}>
            {criticalBlockers > 0 ? `${criticalBlockers} critical` : 'none critical'}
          </span>
        </div>
      </div>
    </div>
  );
}
