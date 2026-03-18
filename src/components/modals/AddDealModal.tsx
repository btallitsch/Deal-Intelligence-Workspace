import { useState } from 'react';
import { X } from 'lucide-react';
import { DealStatus } from '../../types';
import { useDeals } from '../../hooks/useDeals';
import styles from './AddDealModal.module.css';

interface AddDealModalProps {
  onClose: () => void;
  onAdd: ReturnType<typeof useDeals>['addDeal'];
}

export function AddDealModal({ onClose, onAdd }: AddDealModalProps) {
  const today = new Date();
  const defaultClose = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate())
    .toISOString()
    .split('T')[0];

  const [form, setForm] = useState({
    companyName: '',
    contactName: '',
    contactTitle: '',
    dealValue: '',
    status: 'prospect' as DealStatus,
    closeDate: defaultClose,
    likelihoodToClose: '50',
    salesOwner: '',
    notes: '',
  });

  const handleSubmit = () => {
    if (!form.companyName.trim()) return;
    onAdd({
      companyName: form.companyName.trim(),
      contactName: form.contactName.trim(),
      contactTitle: form.contactTitle.trim(),
      dealValue: Number(form.dealValue) || 0,
      status: form.status,
      closeDate: new Date(form.closeDate).toISOString(),
      likelihoodToClose: Number(form.likelihoodToClose) || 50,
      salesOwner: form.salesOwner.trim(),
      notes: form.notes.trim(),
    });
    onClose();
  };

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>New Deal</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className={styles.form}>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label>Company Name *</label>
              <input value={form.companyName} onChange={e => set('companyName', e.target.value)}
                placeholder="Acme Corp" autoFocus />
            </div>
            <div className={styles.field}>
              <label>Deal Value ($)</label>
              <input type="number" value={form.dealValue} onChange={e => set('dealValue', e.target.value)}
                placeholder="50000" />
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label>Contact Name</label>
              <input value={form.contactName} onChange={e => set('contactName', e.target.value)}
                placeholder="Jane Smith" />
            </div>
            <div className={styles.field}>
              <label>Contact Title</label>
              <input value={form.contactTitle} onChange={e => set('contactTitle', e.target.value)}
                placeholder="VP Engineering" />
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label>Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="prospect">Prospect</option>
                <option value="active">Active</option>
                <option value="at_risk">At Risk</option>
                <option value="closed_won">Closed Won</option>
                <option value="closed_lost">Closed Lost</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Close Date</label>
              <input type="date" value={form.closeDate} onChange={e => set('closeDate', e.target.value)} />
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label>Likelihood to Close ({form.likelihoodToClose}%)</label>
              <input type="range" min="0" max="100" step="5" value={form.likelihoodToClose}
                onChange={e => set('likelihoodToClose', e.target.value)} />
            </div>
            <div className={styles.field}>
              <label>Sales Owner</label>
              <input value={form.salesOwner} onChange={e => set('salesOwner', e.target.value)}
                placeholder="Alex Rivera" />
            </div>
          </div>

          <div className={styles.field}>
            <label>Notes</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
              placeholder="Any context about this deal…" rows={3} />
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.submitBtn} onClick={handleSubmit}
            disabled={!form.companyName.trim()}>
            Create Deal
          </button>
        </div>
      </div>
    </div>
  );
}
