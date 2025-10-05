import React, { useState, useEffect } from 'react';
import { getTrips } from '../services/firebaseService';
import type { TripPlan, User } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface HistoryProps {
  user: User;
  onSelectTrip: (trip: TripPlan) => void;
}

const History: React.FC<HistoryProps> = ({ user, onSelectTrip }) => {
  const [trips, setTrips] = useState<TripPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const userTrips = await getTrips(user.uid);
        setTrips(userTrips);
      } catch (err) {
        setError("Failed to load your travel history. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, [user.uid]);

  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><LoadingSpinner /></div>;
  }

  if (error) {
    return <div className="text-center p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-lg max-w-md mx-auto">
        <h3 className="font-bold text-lg">Error</h3>
        <p className="mt-2">{error}</p>
    </div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight text-center mb-8">My Travel History</h1>
        {trips.length === 0 ? (
            <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-gray-200/80">
                <p className="text-gray-600">You have no saved trips yet.</p>
                <p className="text-sm text-gray-500 mt-1">Go ahead and plan a new adventure to see it here!</p>
            </div>
        ) : (
            <div className="space-y-4">
                {trips.map(trip => (
                    <button 
                        key={trip.id} 
                        onClick={() => onSelectTrip(trip)}
                        className="w-full text-left p-6 bg-white rounded-xl shadow-lg border border-gray-200/80 hover:shadow-xl hover:border-violet-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                    >
                        <h2 className="text-xl font-bold text-gray-900">{trip.tripTitle}</h2>
                        <p className="text-md text-violet-600 font-semibold">{trip.totalDuration} Days</p>
                    </button>
                ))}
            </div>
        )}
    </div>
  );
};

export default History;
