
import React, { useState, useCallback } from 'react';
import TripForm from './components/TripForm';
import TransportForm from './components/TransportForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import Header from './components/Header';
import ModeSelection from './components/ModeSelection';
import { generateTripPlan, generateTransportRoute, refineTripPlan } from './services/geminiService';
import type { TripPlan } from './types';

type AppView = 'selection' | 'tripForm' | 'transportForm' | 'itinerary';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('selection');
  const [currentTripPlan, setCurrentTripPlan] = useState<TripPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleTripPlanRequest = useCallback(async (from: string, to: string, travelStyle: string, preferences: string[]) => {
    setIsLoading(true);
    setError(null);
    setCurrentTripPlan(null);
    try {
      const plan = await generateTripPlan(from, to, travelStyle, preferences);
      setCurrentTripPlan(plan);
      setView('itinerary');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
      setView('tripForm'); // Go back to form on error
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleTransportRouteRequest = useCallback(async (from: string, to: string, preferences: string[]) => {
    setIsLoading(true);
    setError(null);
    setCurrentTripPlan(null);
    try {
      const plan = await generateTransportRoute(from, to, preferences);
      setCurrentTripPlan(plan);
      setView('itinerary');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
      setView('transportForm'); // Go back to form on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRefineTripPlan = useCallback(async (currentPlan: TripPlan, request: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const newPlan = await refineTripPlan(currentPlan, request); 
      setCurrentTripPlan(newPlan);
      setView('itinerary');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
      // On refinement error, we stay on the itinerary view with the old plan
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGoHome = () => {
    setView('selection');
    setCurrentTripPlan(null);
    setError(null);
  };
  
  const renderContent = () => {
    const currentFormView = view === 'tripForm' ? 'tripForm' : 'transportForm';

    if (isLoading && !currentTripPlan) {
      return <div className="flex items-center justify-center p-8"><LoadingSpinner /></div>;
    }
     if (error && !currentTripPlan) { // Only show full-page error if there's no plan to display
      return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="text-center p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-lg max-w-md mx-auto">
                <h3 className="font-bold text-lg">Oops, something went wrong!</h3>
                <p className="mt-2">{error}</p>
            </div>
            <button onClick={() => { setError(null); setView(currentFormView); }} className="text-sm font-semibold text-violet-700 hover:underline">
                Try again
            </button>
        </div>
      );
    }

    switch (view) {
        case 'selection':
            return <ModeSelection onSelectMode={(mode) => setView(mode === 'trip' ? 'tripForm' : 'transportForm')} />;
        case 'tripForm':
            return <div className="flex items-center justify-center"><TripForm onSubmit={handleTripPlanRequest} isLoading={isLoading} /></div>;
        case 'transportForm':
            return <div className="flex items-center justify-center"><TransportForm onSubmit={handleTransportRouteRequest} isLoading={isLoading} /></div>;
        case 'itinerary':
            return currentTripPlan && <ItineraryDisplay plan={currentTripPlan} onRefine={handleRefineTripPlan} isLoading={isLoading} />;
        default:
             return <ModeSelection onSelectMode={(mode) => setView(mode === 'trip' ? 'tripForm' : 'transportForm')} />;
    }
  };

  return (
    <main className="min-h-screen w-full relative">
       <div className="absolute top-0 left-0 w-full h-full app-background opacity-10"></div>
       <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-violet-50/70 via-white/60 to-violet-100/70"></div>
       <Header 
         onGoHome={handleGoHome}
         showBackButton={view !== 'selection'}
       />
       <div className="relative z-10 w-full min-h-screen flex items-center justify-center pt-24 pb-12">
        {error && currentTripPlan && (
            <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-md p-4">
                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg relative" role="alert">
                    <strong className="font-bold">Refinement Error: </strong>
                    <span className="block sm:inline">{error}</span>
                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
                        <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                    </span>
                </div>
            </div>
        )}
        {renderContent()}
      </div>
    </main>
  );
};

export default App;
