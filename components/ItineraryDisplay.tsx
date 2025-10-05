import React, { useState, useEffect } from 'react';
import type { TripPlan, DailyItinerary, TransportDetail, User } from '../types';
import { signInWithGoogle, saveTrip, onAuthStateChanged } from '../services/firebaseService';
import MapView from './MapView';
import LoginModal from './LoginModal';
import HotelBookingModal from './HotelBookingModal';
import BreakModal from './BreakModal';
import { TrainIcon } from './icons/TrainIcon';
import { BusIcon } from './icons/BusIcon';
import { LandmarkIcon } from './icons/LandmarkIcon';

const getTransportIcon = (mode: TransportDetail['mode']) => {
    switch (mode) {
        case 'Train':
            return <TrainIcon className="w-6 h-6 text-blue-600" />;
        case 'Bus':
        case 'Local Bus':
            return <BusIcon className="w-6 h-6 text-green-600" />;
        default:
            return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    }
};

interface ItineraryDisplayProps {
  plan: TripPlan;
  onRefine: (currentPlan: TripPlan, request: string) => void;
  isLoading: boolean;
}

const parseBudget = (budgetStr?: string): number => {
    if (!budgetStr) return 20000;
    const matches = budgetStr.replace(/,/g, '').match(/\d+/);
    return matches ? parseInt(matches[0], 10) : 20000;
};

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ plan, onRefine, isLoading }) => {
  const [refineText, setRefineText] = useState('');
  const [refineDays, setRefineDays] = useState(plan.totalDuration);
  const [refineBudget, setRefineBudget] = useState(parseBudget(plan.estimatedTotalBudget));
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showHotelModal, setShowHotelModal] = useState<string | null>(null);
  const [breakModalInfo, setBreakModalInfo] = useState<DailyItinerary | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setRefineDays(plan.totalDuration);
    setRefineBudget(parseBudget(plan.estimatedTotalBudget));
  }, [plan]);

  const handleRefineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalRequest = '';
    if (refineDays !== plan.totalDuration) {
        finalRequest += `Change the trip duration to ${refineDays} days. `;
    }
    if (refineBudget !== parseBudget(plan.estimatedTotalBudget)) {
        finalRequest += `Adjust the total budget to be around ₹${refineBudget.toLocaleString('en-IN')}. `;
    }
    if (refineText.trim()) {
        finalRequest += refineText.trim();
    }
    
    if (finalRequest.trim()) {
      onRefine(plan, finalRequest.trim());
      setRefineText('');
    }
  };

  const handleBreakRefine = (request: string) => {
      onRefine(plan, request);
  };
  
  const handleSaveTrip = async () => {
      if (!user) {
          setShowLoginModal(true);
          return;
      }
      setIsSaving(true);
      try {
          const { id, ...planToSave } = plan;
          await saveTrip(user.uid, planToSave);
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
      } catch (error) {
          console.error("Failed to save trip", error);
          alert("Could not save your trip. Please try again.");
      } finally {
          setIsSaving(false);
      }
  };

  const handleLogin = async () => {
      const loggedInUser = await signInWithGoogle();
      if (loggedInUser) {
          const formattedUser = { uid: loggedInUser.uid, displayName: loggedInUser.displayName, email: loggedInUser.email };
          setUser(formattedUser);
          setShowLoginModal(false);
          setIsSaving(true);
            try {
                const { id, ...planToSave } = plan;
                await saveTrip(formattedUser.uid, planToSave);
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
            } catch (error) {
                console.error("Failed to save trip after login", error);
                alert("Logged in, but could not save your trip. Please try saving again.");
            } finally {
                setIsSaving(false);
            }
      }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {showLoginModal && <LoginModal onLogin={handleLogin} onClose={() => setShowLoginModal(false)} />}
      {showHotelModal && <HotelBookingModal city={showHotelModal} onClose={() => setShowHotelModal(null)} />}
      {breakModalInfo && (
          <BreakModal 
            day={breakModalInfo} 
            onClose={() => setBreakModalInfo(null)}
            onRefine={handleBreakRefine}
            onShowHotelModal={(city) => {
                setBreakModalInfo(null); // Close break modal
                setShowHotelModal(city); // Open hotel modal
            }}
          />
      )}

      <header className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{plan.tripTitle}</h1>
        <div className="mt-4 flex items-center justify-center gap-6 text-gray-600">
            <span className="font-semibold">{plan.totalDuration} Days</span>
            <span className="text-gray-300">|</span>
            <span className="font-semibold">Estimated Budget: {plan.estimatedTotalBudget}</span>
        </div>
      </header>
      
      {!plan.id && (
        <div className="flex justify-center">
            <button
                onClick={handleSaveTrip}
                disabled={isSaving || saveSuccess}
                className="px-6 py-3 text-base font-semibold text-white bg-violet-600 rounded-lg shadow-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:bg-violet-400 disabled:cursor-not-allowed transition-all duration-300"
            >
                {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Trip to My History'}
            </button>
        </div>
      )}

      <MapView itinerary={plan.itinerary} />
      
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200/80">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Refine Your Trip</h2>
          <form onSubmit={handleRefineSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="days" className="block text-sm font-medium text-gray-700">Number of Days ({refineDays})</label>
                    <input id="days" type="range" min="1" max="30" value={refineDays} onChange={(e) => setRefineDays(parseInt(e.target.value))} className="w-full mt-1" disabled={isLoading} />
                 </div>
                 <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700">Budget (₹{refineBudget.toLocaleString('en-IN')})</label>
                    <input id="budget" type="range" min="5000" max="100000" step="1000" value={refineBudget} onChange={(e) => setRefineBudget(parseInt(e.target.value))} className="w-full mt-1" disabled={isLoading} />
                 </div>
              </div>
              <input
                  type="text"
                  value={refineText}
                  onChange={(e) => setRefineText(e.target.value)}
                  placeholder="e.g., 'Add more temples' or 'Focus on hiking'"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                  disabled={isLoading}
              />
              <button type="submit" disabled={isLoading} className="flex items-center justify-center w-full px-6 py-3 font-semibold text-white bg-violet-600 rounded-lg shadow-md hover:bg-violet-700 disabled:bg-violet-400 disabled:cursor-not-allowed transition-colors">
                  {isLoading ? (
                     <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : 'Refine Plan'}
              </button>
          </form>
      </div>
      
      <div className="space-y-6">
        {plan.itinerary.map((day: DailyItinerary) => (
          <div key={day.day} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200/80">
            <h3 className="text-2xl font-bold text-gray-800">Day {day.day}: {day.title}</h3>
            <p className="text-md font-semibold text-violet-700 mb-4">{day.city}</p>
            
            <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-1">Transport</h4>
                <div className="space-y-3">
                {day.transport.map((t, index) => (
                    <div key={index} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 pt-1">{getTransportIcon(t.mode)}</div>
                        <div>
                            <p className="font-semibold text-gray-800">{t.mode}: {t.from} to {t.to}</p>
                            <p className="text-sm text-gray-600">{t.details}</p>
                            <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                                {t.departureTime && <span>Depart: {t.departureTime}</span>}
                                {t.arrivalTime && <span>Arrive: {t.arrivalTime}</span>}
                                {t.price && <span>Price: {t.price}</span>}
                            </div>
                            {t.bookingLink && <a href={t.bookingLink} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 inline-block">Booking Link</a>}
                        </div>
                    </div>
                ))}
                </div>
            </div>

            <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-1 flex items-center gap-2"><LandmarkIcon className="w-5 h-5 text-emerald-600" />Activities</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600 pl-2">
                    {day.activities.map((activity, index) => <li key={index}>{activity}</li>)}
                </ul>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row justify-end items-center gap-3">
                <button onClick={() => setBreakModalInfo(day)} className="text-sm font-semibold text-violet-600 hover:text-violet-800 bg-violet-100 hover:bg-violet-200 px-4 py-2 rounded-lg shadow-sm transition-colors w-full sm:w-auto">
                    + Add Break
                </button>
                <button onClick={() => setShowHotelModal(day.city)} className="text-sm font-semibold text-white bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-lg shadow transition-colors w-full sm:w-auto">
                    Find Hotels in {day.city}
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryDisplay;