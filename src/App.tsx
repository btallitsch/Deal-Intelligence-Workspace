import { useState } from 'react';
import { Deal, ActiveView } from './types';
import { useDeals } from './hooks/useDeals';
import { Header } from './components/layout/Header';
import { StatsBar } from './components/dashboard/StatsBar';
import { DealBoard } from './components/dashboard/DealBoard';
import { ROIView } from './components/roi/ROIView';
import { WorkspacePanel } from './components/workspace/WorkspacePanel';
import { AddDealModal } from './components/modals/AddDealModal';

export default function App() {
  const dealActions = useDeals();
  const { deals } = dealActions;

  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [showAddDeal, setShowAddDeal] = useState(false);

  // Keep the workspace panel in sync when the deal list updates
  // (e.g. after editing from within the panel)
  const syncedDeal = selectedDeal
    ? deals.find(d => d.id === selectedDeal.id) ?? null
    : null;

  const handleReset = () => {
    if (confirm('Reset to sample data? This will clear all your changes.')) {
      dealActions.resetData();
      setSelectedDeal(null);
    }
  };

  return (
    <div className="app">
      <Header
        activeView={activeView}
        onViewChange={setActiveView}
        onAddDeal={() => setShowAddDeal(true)}
        onReset={handleReset}
      />

      <StatsBar
        deals={deals}
        onROIClick={() => setActiveView('roi')}
      />

      <div className="appBody">
        {activeView === 'dashboard' && (
          <DealBoard deals={deals} onOpenDeal={setSelectedDeal} />
        )}
        {activeView === 'roi' && (
          <ROIView deals={deals} />
        )}
      </div>

      {/* Deal Workspace slide-over */}
      {syncedDeal && (
        <WorkspacePanel
          deal={syncedDeal}
          onClose={() => setSelectedDeal(null)}
          actions={dealActions}
        />
      )}

      {/* Add Deal modal */}
      {showAddDeal && (
        <AddDealModal
          onClose={() => setShowAddDeal(false)}
          onAdd={dealActions.addDeal}
        />
      )}
    </div>
  );
}
