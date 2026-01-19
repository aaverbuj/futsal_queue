import React from 'react';
import { LeagueProvider, useLeague } from './context/LeagueContext';
import ActiveGame from './components/ActiveGame';
import QueueList from './components/QueueList';
import AddTeam from './components/AddTeam';
import ErrorBoundary from './components/ErrorBoundary';
import { Trash2 } from 'lucide-react';

function Header() {
  const { resetLeague } = useLeague();

  // Safety check function for reset
  const handleReset = () => {
    if (confirm("Are you sure you want to reset the entire league? This will remove all teams.")) {
      resetLeague();
    }
  }

  return (
    <header className="mb-8 text-center relative flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
        Futsal Queue
      </h1>
      <p className="text-slate-500 text-sm mt-2">Winner stays. Tie rotates.</p>

      <button
        onClick={handleReset}
        className="absolute right-0 top-1 p-2 text-slate-600 hover:text-red-500 transition-colors"
        title="Reset League"
      >
        <Trash2 size={20} />
      </button>
    </header>
  );
}

function AppContent() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-blue-500/30">
      <div className="max-w-xl mx-auto px-4 py-8 pb-32">
        <Header />

        <main className="pb-32">
          <ActiveGame />
          <QueueList />
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent z-50">
            {/* Fixed input at bottom for easy access */}
            <div className="max-w-xl mx-auto">
              <AddTeam />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <LeagueProvider>
        <AppContent />
      </LeagueProvider>
    </ErrorBoundary>
  );
}

export default App;
