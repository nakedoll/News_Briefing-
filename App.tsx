import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import BriefingDisplay from './components/BriefingDisplay';
import WaitingDisplay from './components/WaitingDisplay';
import { generateBriefing } from './services/geminiService';
import type { BriefingData } from './types';

type Status = 'initializing' | 'waiting' | 'loading' | 'ready' | 'error';

const App: React.FC = () => {
  const [status, setStatus] = useState<Status>('initializing');
  const [error, setError] = useState<string | null>(null);
  const [briefingData, setBriefingData] = useState<BriefingData | null>(null);
  const [targetTime, setTargetTime] = useState<Date | null>(null);

  const handleGenerateBriefing = useCallback(async () => {
    if (status === 'loading') return; // Prevent concurrent fetches
    setStatus('loading');
    setError(null);
    try {
      const data = await generateBriefing();
      setBriefingData(data);
      setStatus('ready');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
      setStatus('error');
    }
  }, [status]);

  useEffect(() => {
    let timerId: number;

    const schedule = () => {
      const now = new Date();
      let nextRunTime = new Date(now);
      nextRunTime.setHours(7, 30, 0, 0);

      if (now.getTime() > nextRunTime.getTime()) {
        // If it's already past 7:30 today, schedule for tomorrow
        nextRunTime.setDate(nextRunTime.getDate() + 1);
      }
      
      setTargetTime(nextRunTime);

      const delay = nextRunTime.getTime() - now.getTime();

      timerId = window.setTimeout(() => {
        handleGenerateBriefing();
        schedule(); // Reschedule for the next day after running
      }, delay);
    };

    // Initial check when the component mounts
    const now = new Date();
    const today730 = new Date();
    today730.setHours(7, 30, 0, 0);

    if (now.getTime() >= today730.getTime()) {
      handleGenerateBriefing(); // If it's past the time, fetch immediately
    } else {
      setStatus('waiting'); // Otherwise, show the waiting screen
    }

    schedule(); // Start the scheduler for all future automatic runs

    return () => {
      clearTimeout(timerId); // Cleanup the timer on unmount
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const renderContent = () => {
    switch (status) {
      case 'initializing':
      case 'loading':
        return <LoadingSpinner />;
      case 'waiting':
        return <WaitingDisplay targetTime={targetTime} />;
      case 'error':
        return <ErrorDisplay message={error || 'An unknown error occurred.'} />;
      case 'ready':
        return briefingData ? <BriefingDisplay briefing={briefingData.briefing} sources={briefingData.sources} /> : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-end mb-4">
                <button
                    onClick={handleGenerateBriefing}
                    disabled={status === 'loading' || status === 'waiting'}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    aria-label="새로고침"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${status === 'loading' ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M20 4h-5v5M4 20h5v-5" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    새로고침
                </button>
            </div>
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
