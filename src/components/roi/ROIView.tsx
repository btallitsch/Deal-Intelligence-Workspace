import { Wrench, TrendingUp, Package, AlertCircle } from 'lucide-react';
import { Deal, EFFORT_LABELS, FeatureStatus } from '../../types';
import { aggregateFeatureGaps, getTotalUnlockableRevenue } from '../../utils/calculations';
import { formatCurrency, statusLabel } from '../../utils/formatters';
import { Badge } from '../ui/Badge';
import styles from './ROIView.module.css';

const STATUS_VARIANT: Record<FeatureStatus, 'muted' | 'blue' | 'teal'> = {
  backlog: 'muted',
  in_progress: 'blue',
  done: 'teal',
};

const EFFORT_COLOR: Record<string, string> = {
  xs: '#4ADE80',
  sm: '#A3E635',
  md: '#FACC15',
  lg: '#FB923C',
  xl: '#F87171',
};

interface ROIViewProps {
  deals: Deal[];
}

export function ROIView({ deals }: ROIViewProps) {
  const features = aggregateFeatureGaps(deals);
  const totalUnlockable = getTotalUnlockableRevenue(deals);

  if (features.length === 0) {
    return (
      <div className={styles.empty}>
        <Package size={40} strokeWidth={1} />
        <h3>No Feature Gaps Tracked</h3>
        <p>Open a deal workspace and add feature gaps to see engineering ROI analysis here.</p>
      </div>
    );
  }

  return (
    <div className={styles.view}>
      {/* Hero Banner */}
      <div className={styles.hero}>
        <div className={styles.heroLeft}>
          <span className={styles.heroLabel}>
            <Wrench size={12} /> Engineering ROI Leaderboard
          </span>
          <h2 className={styles.heroHeadline}>
            Build the right features → close{' '}
            <span className={styles.heroAmount}>{formatCurrency(totalUnlockable)}</span>
          </h2>
          <p className={styles.heroSub}>
            Features ranked by revenue unlocked per engineering day. Sorted highest ROI first.
          </p>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.heroStat}>
            <span className={styles.heroStatValue}>{features.length}</span>
            <span className={styles.heroStatLabel}>features tracked</span>
          </div>
          <div className={styles.heroStat}>
            <span className={styles.heroStatValue}>
              {deals.filter(d => d.status !== 'closed_won' && d.status !== 'closed_lost').length}
            </span>
            <span className={styles.heroStatLabel}>active deals affected</span>
          </div>
        </div>
      </div>

      {/* Feature Leaderboard */}
      <div className={styles.list}>
        {features.map((feature, idx) => (
          <div key={feature.featureId} className={styles.row}>
            {/* Rank */}
            <div className={styles.rank}>
              <span className={styles.rankNum}>#{idx + 1}</span>
            </div>

            {/* Feature info */}
            <div className={styles.featureInfo}>
              <div className={styles.featureTop}>
                <span className={styles.featureTitle}>{feature.title}</span>
                <Badge variant={STATUS_VARIANT[feature.status]}>
                  {statusLabel(feature.status)}
                </Badge>
              </div>
              <p className={styles.featureDesc}>{feature.description}</p>
              <div className={styles.featureDeals}>
                {feature.affectedDeals.map(d => (
                  <span key={d.id} className={styles.dealPill}>
                    {d.companyName} · {formatCurrency(d.dealValue)}
                  </span>
                ))}
              </div>
            </div>

            {/* Effort */}
            <div className={styles.effortCol}>
              <span
                className={styles.effortBadge}
                style={{ color: EFFORT_COLOR[feature.effortSize], borderColor: `${EFFORT_COLOR[feature.effortSize]}33`, background: `${EFFORT_COLOR[feature.effortSize]}11` }}
              >
                {feature.effortSize.toUpperCase()}
              </span>
              <span className={styles.effortLabel}>{EFFORT_LABELS[feature.effortSize]}</span>
            </div>

            {/* Revenue unlock */}
            <div className={styles.revenueCol}>
              <span className={styles.revenueLabel}>
                <TrendingUp size={11} /> unlocks
              </span>
              <span className={styles.revenueAmount}>{formatCurrency(feature.totalRevenue)}</span>
              <span className={styles.revenueDeals}>
                across {feature.affectedDeals.length} deal{feature.affectedDeals.length > 1 ? 's' : ''}
              </span>
            </div>

            {/* ROI per day */}
            <div className={styles.roiCol}>
              <span className={styles.roiLabel}>per dev-day</span>
              <span className={styles.roiValue}>{formatCurrency(Math.round(feature.roiPerDay))}</span>
              <div className={styles.roiBar}>
                <div
                  className={styles.roiBarFill}
                  style={{
                    width: `${Math.min(100, (feature.roiPerDay / features[0].roiPerDay) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className={styles.footer}>
        <AlertCircle size={12} />
        <span>
          Revenue figures represent deal value at risk — not guaranteed close value. Effort
          estimates are ballparks based on T-shirt sizes. Assumes a single engineer-sprint unless
          discussed otherwise.
        </span>
      </div>
    </div>
  );
}
