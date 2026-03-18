import { Deal, DealStatus } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { DealCard } from './DealCard';
import styles from './DealBoard.module.css';

const COLUMNS: { status: DealStatus; label: string }[] = [
  { status: 'prospect', label: 'Prospect' },
  { status: 'active', label: 'Active' },
  { status: 'at_risk', label: 'At Risk' },
  { status: 'closed_won', label: 'Closed Won' },
  { status: 'closed_lost', label: 'Closed Lost' },
];

interface DealBoardProps {
  deals: Deal[];
  onOpenDeal: (deal: Deal) => void;
}

export function DealBoard({ deals, onOpenDeal }: DealBoardProps) {
  const byStatus = (status: DealStatus) => deals.filter(d => d.status === status);

  return (
    <div className={styles.board}>
      {COLUMNS.map(col => {
        const colDeals = byStatus(col.status);
        const total = colDeals.reduce((s, d) => s + d.dealValue, 0);

        return (
          <div key={col.status} className={`${styles.column} ${styles[`col_${col.status}`]}`}>
            <div className={styles.colHeader}>
              <span className={styles.colLabel}>{col.label}</span>
              <span className={styles.colCount}>{colDeals.length}</span>
              {total > 0 && (
                <span className={styles.colTotal}>{formatCurrency(total)}</span>
              )}
            </div>

            <div className={styles.cards}>
              {colDeals.length === 0 && (
                <div className={styles.empty}>
                  <span>No deals</span>
                </div>
              )}
              {colDeals.map(deal => (
                <DealCard key={deal.id} deal={deal} onOpen={onOpenDeal} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
