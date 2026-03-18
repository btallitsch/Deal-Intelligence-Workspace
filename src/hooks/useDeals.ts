import { useState, useCallback } from 'react';
import {
  Deal,
  TechBlocker,
  FeatureGap,
  CustomerRequirement,
  DealStatus,
} from '../types';
import { storageService } from '../services/storage';

type NewDeal = Pick<
  Deal,
  'companyName' | 'contactName' | 'contactTitle' | 'dealValue' |
  'status' | 'closeDate' | 'likelihoodToClose' | 'salesOwner' | 'notes'
>;

export function useDeals() {
  const [deals, setDeals] = useState<Deal[]>(() => storageService.getDeals());

  const persist = useCallback((updated: Deal[]) => {
    setDeals(updated);
    storageService.saveDeals(updated);
  }, []);

  // ── Deal CRUD ────────────────────────────────────────────────────────────

  const addDeal = useCallback(
    (data: NewDeal): Deal => {
      const newDeal: Deal = {
        ...data,
        id: crypto.randomUUID(),
        requirements: [],
        techBlockers: [],
        featureGaps: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      persist([...deals, newDeal]);
      return newDeal;
    },
    [deals, persist]
  );

  const updateDeal = useCallback(
    (id: string, updates: Partial<Omit<Deal, 'id' | 'createdAt'>>) => {
      persist(
        deals.map(d =>
          d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d
        )
      );
    },
    [deals, persist]
  );

  const updateDealStatus = useCallback(
    (id: string, status: DealStatus) => updateDeal(id, { status }),
    [updateDeal]
  );

  const deleteDeal = useCallback(
    (id: string) => persist(deals.filter(d => d.id !== id)),
    [deals, persist]
  );

  const resetData = useCallback(() => {
    const fresh = storageService.resetToSampleData();
    setDeals(fresh);
  }, []);

  // ── Tech Blocker CRUD ────────────────────────────────────────────────────

  const addBlocker = useCallback(
    (dealId: string, data: Omit<TechBlocker, 'id' | 'dealId' | 'createdAt'>) => {
      const blocker: TechBlocker = {
        ...data,
        id: crypto.randomUUID(),
        dealId,
        createdAt: new Date().toISOString(),
      };
      persist(
        deals.map(d =>
          d.id === dealId
            ? { ...d, techBlockers: [...d.techBlockers, blocker], updatedAt: new Date().toISOString() }
            : d
        )
      );
    },
    [deals, persist]
  );

  const updateBlocker = useCallback(
    (dealId: string, blockerId: string, updates: Partial<TechBlocker>) => {
      persist(
        deals.map(d => {
          if (d.id !== dealId) return d;
          return {
            ...d,
            techBlockers: d.techBlockers.map(b =>
              b.id === blockerId ? { ...b, ...updates } : b
            ),
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    [deals, persist]
  );

  const removeBlocker = useCallback(
    (dealId: string, blockerId: string) => {
      persist(
        deals.map(d => {
          if (d.id !== dealId) return d;
          return {
            ...d,
            techBlockers: d.techBlockers.filter(b => b.id !== blockerId),
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    [deals, persist]
  );

  // ── Feature Gap CRUD ─────────────────────────────────────────────────────

  const addFeatureGap = useCallback(
    (dealId: string, data: Omit<FeatureGap, 'id' | 'createdAt'>) => {
      const fg: FeatureGap = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      persist(
        deals.map(d =>
          d.id === dealId
            ? { ...d, featureGaps: [...d.featureGaps, fg], updatedAt: new Date().toISOString() }
            : d
        )
      );
    },
    [deals, persist]
  );

  const updateFeatureGap = useCallback(
    (dealId: string, fgId: string, updates: Partial<FeatureGap>) => {
      persist(
        deals.map(d => {
          if (d.id !== dealId) return d;
          return {
            ...d,
            featureGaps: d.featureGaps.map(fg =>
              fg.id === fgId ? { ...fg, ...updates } : fg
            ),
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    [deals, persist]
  );

  const removeFeatureGap = useCallback(
    (dealId: string, fgId: string) => {
      persist(
        deals.map(d => {
          if (d.id !== dealId) return d;
          return {
            ...d,
            featureGaps: d.featureGaps.filter(fg => fg.id !== fgId),
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    [deals, persist]
  );

  // ── Requirement CRUD ─────────────────────────────────────────────────────

  const addRequirement = useCallback(
    (dealId: string, data: Omit<CustomerRequirement, 'id'>) => {
      const req: CustomerRequirement = { ...data, id: crypto.randomUUID() };
      persist(
        deals.map(d =>
          d.id === dealId
            ? { ...d, requirements: [...d.requirements, req], updatedAt: new Date().toISOString() }
            : d
        )
      );
    },
    [deals, persist]
  );

  const updateRequirement = useCallback(
    (dealId: string, reqId: string, updates: Partial<CustomerRequirement>) => {
      persist(
        deals.map(d => {
          if (d.id !== dealId) return d;
          return {
            ...d,
            requirements: d.requirements.map(r =>
              r.id === reqId ? { ...r, ...updates } : r
            ),
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    [deals, persist]
  );

  const removeRequirement = useCallback(
    (dealId: string, reqId: string) => {
      persist(
        deals.map(d => {
          if (d.id !== dealId) return d;
          return {
            ...d,
            requirements: d.requirements.filter(r => r.id !== reqId),
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    [deals, persist]
  );

  return {
    deals,
    // Deal
    addDeal,
    updateDeal,
    updateDealStatus,
    deleteDeal,
    resetData,
    // Blockers
    addBlocker,
    updateBlocker,
    removeBlocker,
    // Feature Gaps
    addFeatureGap,
    updateFeatureGap,
    removeFeatureGap,
    // Requirements
    addRequirement,
    updateRequirement,
    removeRequirement,
  };
}
