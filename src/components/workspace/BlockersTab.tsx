import { useState } from 'react';
import { AlertTriangle, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { Deal, BlockerSeverity, BlockerStatus } from '../../types';
import { useDeals } from '../../hooks/useDeals';
import { Badge } from '../ui/Badge';
import { statusLabel } from '../../utils/formatters';
import styles from './TabShared.module.css';
import bStyles from './BlockersTab.module.css';

const SEV_VARIANT: Record<BlockerSeverity, 'gold' | 'teal' | 'red' | 'blue' | 'muted' | 'orange'> = {
  low: 'muted',
  medium: 'orange',
  high: 'orange',
  critical: 'red',
};

interface BlockersTabProps {
  deal: Deal;
  actions: ReturnType<typeof useDeals>;
}

export function BlockersTab({ deal, actions }: BlockersTabProps) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    severity: 'high' as BlockerSeverity,
    assignedTo: '',
  });

  const handleAdd = () => {
    if (!form.title.trim()) return;
    actions.addBlocker(deal.id, {
      title: form.title.trim(),
      description: form.description.trim(),
      severity: form.severity,
      status: 'open',
      assignedTo: form.assignedTo.trim(),
    });
    setForm({ title: '', description: '', severity: 'high', assignedTo: '' });
    setAdding(false);
  };

  const openBlockers = deal.techBlockers.filter(b => b.status !== 'resolved');
  const resolvedBlockers = deal.techBlockers.filter(b => b.status === 'resolved');

  return (
    <div className={styles.tabBody}>
      {/* Open blockers */}
      <div className={styles.list}>
        {openBlockers.length === 0 && !adding && (
          <div className={styles.emptyList}>
            <CheckCircle2 size={20} className={bStyles.allClear} />
            No open blockers — this deal is clear to close!
          </div>
        )}

        {openBlockers.map(blocker => (
          <div key={blocker.id} className={`${styles.item} ${bStyles.blockerItem}`} data-severity={blocker.severity}>
            <div className={bStyles.severityStripe} data-severity={blocker.severity} />
            <div className={styles.itemContent} style={{ flex: 1 }}>
              <div className={bStyles.blockerTop}>
                <span className={styles.itemTitle}>{blocker.title}</span>
                <Badge variant={SEV_VARIANT[blocker.severity]}>{blocker.severity}</Badge>
              </div>
              {blocker.description && (
                <span className={styles.itemDesc}>{blocker.description}</span>
              )}
              <div className={bStyles.blockerMeta}>
                {blocker.assignedTo && (
                  <span className={bStyles.assignee}>→ {blocker.assignedTo}</span>
                )}
                <div className={bStyles.statusBtns}>
                  {(['open', 'in_progress', 'resolved'] as BlockerStatus[]).map(s => (
                    <button
                      key={s}
                      className={`${bStyles.statusBtn} ${blocker.status === s ? bStyles.statusBtnActive : ''}`}
                      onClick={() => actions.updateBlocker(deal.id, blocker.id, { status: s })}
                    >
                      {statusLabel(s)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button className={styles.deleteBtn} onClick={() => actions.removeBlocker(deal.id, blocker.id)}>
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      {/* Resolved section */}
      {resolvedBlockers.length > 0 && (
        <div className={bStyles.resolvedSection}>
          <span className={bStyles.resolvedLabel}>
            <CheckCircle2 size={11} /> {resolvedBlockers.length} resolved
          </span>
          {resolvedBlockers.map(b => (
            <div key={b.id} className={bStyles.resolvedItem}>
              <span>{b.title}</span>
              <button className={styles.deleteBtn} onClick={() => actions.removeBlocker(deal.id, b.id)}>
                <Trash2 size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add form */}
      {adding ? (
        <div className={styles.addForm}>
          <input className={styles.input} placeholder="Blocker title *" value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))} autoFocus />
          <input className={styles.input} placeholder="Description" value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <input className={styles.input} placeholder="Assigned to (team / person)" value={form.assignedTo}
            onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))} />
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Severity</label>
            <select className={styles.select} value={form.severity}
              onChange={e => setForm(f => ({ ...f, severity: e.target.value as BlockerSeverity }))}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div className={styles.formActions}>
            <button className={styles.cancelBtn} onClick={() => setAdding(false)}>Cancel</button>
            <button className={styles.saveBtn} onClick={handleAdd} disabled={!form.title.trim()}>
              Add Blocker
            </button>
          </div>
        </div>
      ) : (
        <button className={styles.addRowBtn} onClick={() => setAdding(true)}>
          <Plus size={13} /> <AlertTriangle size={12} /> Add Blocker
        </button>
      )}
    </div>
  );
}
