import { useState } from 'react';
import { Puzzle, Plus, Trash2, TrendingUp } from 'lucide-react';
import { Deal, EffortSize, FeatureStatus, Priority, EFFORT_LABELS } from '../../types';
import { useDeals } from '../../hooks/useDeals';
import { formatCurrency, statusLabel } from '../../utils/formatters';
import { Badge } from '../ui/Badge';
import styles from './TabShared.module.css';
import fStyles from './FeaturesTab.module.css';

const STATUS_VARIANT: Record<FeatureStatus, 'muted' | 'blue' | 'teal'> = {
  backlog: 'muted',
  in_progress: 'blue',
  done: 'teal',
};

interface FeaturesTabProps {
  deal: Deal;
  actions: ReturnType<typeof useDeals>;
}

export function FeaturesTab({ deal, actions }: FeaturesTabProps) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    effortSize: 'md' as EffortSize,
    revenueImpact: '',
    priority: 'high' as Priority,
    status: 'backlog' as FeatureStatus,
  });

  const handleAdd = () => {
    if (!form.title.trim()) return;
    actions.addFeatureGap(deal.id, {
      title: form.title.trim(),
      description: form.description.trim(),
      effortSize: form.effortSize,
      revenueImpact: Number(form.revenueImpact) || 0,
      priority: form.priority,
      status: form.status,
    });
    setForm({ title: '', description: '', effortSize: 'md', revenueImpact: '', priority: 'high', status: 'backlog' });
    setAdding(false);
  };

  const totalRevAtRisk = deal.featureGaps.reduce((s, f) => s + f.revenueImpact, 0);

  return (
    <div className={styles.tabBody}>
      {totalRevAtRisk > 0 && (
        <div className={fStyles.revBanner}>
          <TrendingUp size={14} />
          <span>
            <strong>{formatCurrency(totalRevAtRisk)}</strong> in deal value depends on these feature gaps being resolved
          </span>
        </div>
      )}

      <div className={styles.list}>
        {deal.featureGaps.length === 0 && !adding && (
          <div className={styles.emptyList}>
            <Puzzle size={18} />
            No feature gaps tracked yet
          </div>
        )}

        {deal.featureGaps.map(fg => (
          <div key={fg.id} className={`${styles.item} ${fStyles.fgItem}`}>
            <div className={fStyles.fgLeft}>
              <div className={fStyles.fgTop}>
                <span className={styles.itemTitle}>{fg.title}</span>
                <Badge variant={STATUS_VARIANT[fg.status]}>{statusLabel(fg.status)}</Badge>
              </div>
              {fg.description && <span className={styles.itemDesc}>{fg.description}</span>}
              <div className={fStyles.fgMeta}>
                <span className={fStyles.effortChip}
                  data-size={fg.effortSize}>
                  {fg.effortSize.toUpperCase()} · {EFFORT_LABELS[fg.effortSize]}
                </span>
                <span className={fStyles.priority} data-priority={fg.priority}>
                  {fg.priority} priority
                </span>
                <div className={fStyles.statusSelect}>
                  {(['backlog', 'in_progress', 'done'] as FeatureStatus[]).map(s => (
                    <button
                      key={s}
                      className={`${fStyles.statusBtn} ${fg.status === s ? fStyles.statusBtnActive : ''}`}
                      onClick={() => actions.updateFeatureGap(deal.id, fg.id, { status: s })}
                    >
                      {statusLabel(s)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className={fStyles.fgRight}>
              {fg.revenueImpact > 0 && (
                <div className={fStyles.revenueTag}>
                  <span className={fStyles.revenueTagLabel}>revenue at risk</span>
                  <span className={fStyles.revenueTagValue}>{formatCurrency(fg.revenueImpact)}</span>
                </div>
              )}
              <button className={styles.deleteBtn} onClick={() => actions.removeFeatureGap(deal.id, fg.id)}>
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {adding ? (
        <div className={styles.addForm}>
          <input className={styles.input} placeholder="Feature title *" value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))} autoFocus />
          <input className={styles.input} placeholder="Description" value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <input className={styles.input} placeholder="Revenue at risk ($)" type="number" value={form.revenueImpact}
            onChange={e => setForm(f => ({ ...f, revenueImpact: e.target.value }))} />

          <div className={styles.formRow}>
            <div className={fStyles.formGroup}>
              <label className={styles.formLabel}>Effort size</label>
              <select className={styles.select} value={form.effortSize}
                onChange={e => setForm(f => ({ ...f, effortSize: e.target.value as EffortSize }))}>
                {(Object.entries(EFFORT_LABELS) as [EffortSize, string][]).map(([k, v]) => (
                  <option key={k} value={k}>{k.toUpperCase()} — {v}</option>
                ))}
              </select>
            </div>
            <div className={fStyles.formGroup}>
              <label className={styles.formLabel}>Priority</label>
              <select className={styles.select} value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: e.target.value as Priority }))}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className={styles.formActions}>
            <button className={styles.cancelBtn} onClick={() => setAdding(false)}>Cancel</button>
            <button className={styles.saveBtn} onClick={handleAdd} disabled={!form.title.trim()}>
              Add Feature Gap
            </button>
          </div>
        </div>
      ) : (
        <button className={styles.addRowBtn} onClick={() => setAdding(true)}>
          <Plus size={13} /> <Puzzle size={12} /> Add Feature Gap
        </button>
      )}
    </div>
  );
}
