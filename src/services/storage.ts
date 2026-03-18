import { Deal } from '../types';
import { SAMPLE_DEALS } from '../utils/sampleData';

const DEALS_KEY = 'diw_deals_v1';

export const storageService = {
  getDeals(): Deal[] {
    try {
      const raw = localStorage.getItem(DEALS_KEY);
      if (!raw) {
        localStorage.setItem(DEALS_KEY, JSON.stringify(SAMPLE_DEALS));
        return SAMPLE_DEALS;
      }
      return JSON.parse(raw) as Deal[];
    } catch {
      return SAMPLE_DEALS;
    }
  },

  saveDeals(deals: Deal[]): void {
    try {
      localStorage.setItem(DEALS_KEY, JSON.stringify(deals));
    } catch {
      console.warn('Failed to persist deals to localStorage');
    }
  },

  resetToSampleData(): Deal[] {
    localStorage.setItem(DEALS_KEY, JSON.stringify(SAMPLE_DEALS));
    return SAMPLE_DEALS;
  },
};
