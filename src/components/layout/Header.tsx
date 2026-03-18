import { Zap, BarChart3, LayoutDashboard, RotateCcw } from 'lucide-react';
import { ActiveView } from '../../types';
import styles from './Header.module.css';

interface HeaderProps {
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
  onAddDeal: () => void;
  onReset: () => void;
}

export function Header({ activeView, onViewChange, onAddDeal, onReset }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.logo}>
          <Zap size={16} strokeWidth={2.5} />
        </div>
        <div className={styles.brandText}>
          <span className={styles.brandName}>Deal Intelligence</span>
          <span className={styles.brandSub}>Workspace</span>
        </div>
      </div>

      <nav className={styles.nav}>
        <button
          className={`${styles.navBtn} ${activeView === 'dashboard' ? styles.active : ''}`}
          onClick={() => onViewChange('dashboard')}
        >
          <LayoutDashboard size={14} />
          <span>Deals</span>
        </button>
        <button
          className={`${styles.navBtn} ${activeView === 'roi' ? styles.active : ''}`}
          onClick={() => onViewChange('roi')}
        >
          <BarChart3 size={14} />
          <span>Eng ROI</span>
          <span className={styles.navTag}>DEV VIEW</span>
        </button>
      </nav>

      <div className={styles.actions}>
        <button className={styles.resetBtn} onClick={onReset} title="Reset to sample data">
          <RotateCcw size={13} />
        </button>
        <button className={styles.addBtn} onClick={onAddDeal}>
          + New Deal
        </button>
      </div>
    </header>
  );
}
