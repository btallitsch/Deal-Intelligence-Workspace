import { useState } from 'react';
import { CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react';
import { Deal } from '../../types';
import { useDeals } from '../../hooks/useDeals';
import styles from './TabShared.module.css';

interface RequirementsTabProps {
  deal: Deal;
  actions: ReturnType<typeof useDeals>;
}

export function RequirementsTab({ deal, actions }: RequirementsTabProps) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const handleAdd = () => {
    if (!title.trim()) return;
    actions.addRequirement(deal.id, { title: title.trim(), description: desc.trim(), isMet: false });
    setTitle('');
    setDesc('');
    setAdding(false);
  };

  const metCount = deal.requirements.filter(r => r.isMet).length;
  const total = deal.requirements.length;

  return (
    <div className={styles.tabBody}>
      {/* Progress bar */}
      {total > 0 && (
        <div className={styles.progressRow}>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${(metCount / total) * 100}%` }} />
          </div>
          <span className={styles.progressLabel}>{metCount}/{total} requirements met</span>
        </div>
      )}

      {/* List */}
      <div className={styles.list}>
        {deal.requirements.map(req => (
          <div key={req.id} className={`${styles.item} ${req.isMet ? styles.itemMet : ''}`}>
            <button
              className={styles.checkBtn}
              onClick={() => actions.updateRequirement(deal.id, req.id, { isMet: !req.isMet })}
            >
              {req.isMet
                ? <CheckCircle2 size={18} className={styles.checkMet} />
                : <Circle size={18} className={styles.checkUnmet} />
              }
            </button>
            <div className={styles.itemContent}>
              <span className={`${styles.itemTitle} ${req.isMet ? styles.strikethrough : ''}`}>
                {req.title}
              </span>
              {req.description && (
                <span className={styles.itemDesc}>{req.description}</span>
              )}
            </div>
            <button
              className={styles.deleteBtn}
              onClick={() => actions.removeRequirement(deal.id, req.id)}
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}

        {deal.requirements.length === 0 && !adding && (
          <div className={styles.emptyList}>No requirements tracked yet</div>
        )}
      </div>

      {/* Add form */}
      {adding ? (
        <div className={styles.addForm}>
          <input
            className={styles.input}
            placeholder="Requirement title *"
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
          />
          <input
            className={styles.input}
            placeholder="Description (optional)"
            value={desc}
            onChange={e => setDesc(e.target.value)}
          />
          <div className={styles.formActions}>
            <button className={styles.cancelBtn} onClick={() => { setAdding(false); setTitle(''); setDesc(''); }}>
              Cancel
            </button>
            <button className={styles.saveBtn} onClick={handleAdd} disabled={!title.trim()}>
              Add Requirement
            </button>
          </div>
        </div>
      ) : (
        <button className={styles.addRowBtn} onClick={() => setAdding(true)}>
          <Plus size={13} /> Add Requirement
        </button>
      )}
    </div>
  );
}
