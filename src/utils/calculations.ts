import { Deal, AggregatedFeature, EFFORT_DAYS } from '../types';

export function getWeightedPipeline(deals: Deal[]): number {
  return deals
    .filter(d => d.status !== 'closed_won' && d.status !== 'closed_lost')
    .reduce((sum, d) => sum + (d.dealValue * d.likelihoodToClose) / 100, 0);
}

export function getActivePipelineTotal(deals: Deal[]): number {
  return deals
    .filter(d => d.status === 'active' || d.status === 'prospect' || d.status === 'at_risk')
    .reduce((sum, d) => sum + d.dealValue, 0);
}

export function getClosedRevenue(deals: Deal[]): number {
  return deals
    .filter(d => d.status === 'closed_won')
    .reduce((sum, d) => sum + d.dealValue, 0);
}

export function getOpenBlockerCount(deals: Deal[]): number {
  return deals.reduce((sum, d) => {
    return sum + d.techBlockers.filter(b => b.status !== 'resolved').length;
  }, 0);
}

export function getCriticalBlockerCount(deals: Deal[]): number {
  return deals.reduce((sum, d) => {
    return (
      sum + d.techBlockers.filter(b => b.severity === 'critical' && b.status !== 'resolved').length
    );
  }, 0);
}

/**
 * Aggregates feature gaps across all active deals.
 * Features sharing the same title are merged — so "SAML SSO" blocking 2 deals
 * shows a combined revenue number ("Build this → unlock $118K").
 */
export function aggregateFeatureGaps(deals: Deal[]): AggregatedFeature[] {
  const map = new Map<string, AggregatedFeature>();

  for (const deal of deals) {
    if (deal.status === 'closed_won' || deal.status === 'closed_lost') continue;

    for (const fg of deal.featureGaps) {
      const key = fg.title.toLowerCase().trim();

      if (map.has(key)) {
        const existing = map.get(key)!;
        if (!existing.affectedDeals.find(d => d.id === deal.id)) {
          existing.affectedDeals.push({
            id: deal.id,
            companyName: deal.companyName,
            dealValue: deal.dealValue,
          });
          existing.totalRevenue += fg.revenueImpact;
          existing.roiPerDay = existing.totalRevenue / EFFORT_DAYS[fg.effortSize];
        }
      } else {
        map.set(key, {
          featureId: fg.id,
          title: fg.title,
          description: fg.description,
          effortSize: fg.effortSize,
          status: fg.status,
          priority: fg.priority,
          totalRevenue: fg.revenueImpact,
          roiPerDay: fg.revenueImpact / EFFORT_DAYS[fg.effortSize],
          affectedDeals: [
            { id: deal.id, companyName: deal.companyName, dealValue: deal.dealValue },
          ],
        });
      }
    }
  }

  // Sort by ROI per dev-day (highest first)
  return Array.from(map.values()).sort((a, b) => b.roiPerDay - a.roiPerDay);
}

export function getTotalUnlockableRevenue(deals: Deal[]): number {
  return aggregateFeatureGaps(deals).reduce((sum, f) => sum + f.totalRevenue, 0);
}
