import React, { useState } from 'react';
import { getCityFromCoordinates } from '../services/geminiService';

interface TripFormProps {
  onSubmit: (from: string, to: string, travelStyle: string, preferences: string[]) => void;
  isLoading: boolean;
}

const transportOptions = ['Train', 'Bus'];
const travelStyleOptions = ['Leisurely', 'Balanced', 'Action-Packed', 'Budget-Focused'];

const TripForm: React.FC<TripFormProps> = ({ onSubmit, isLoading }) => {
  const [from, setFrom] = useState('Delhi');
  const [to, setTo] = useState('Goa');
  const [travelStyle, setTravelStyle] = useState('Balanced');
  const [preferences, setPreferences] = useState<string[]>(transportOptions);
  const [isLocating, setIsLocating] = useState(false);

  const handlePreferenceChange = (option: string) => {
    setPreferences(prev => 
      prev.includes(option) 
        ? prev.filter(p => p !== option) 
        : [...prev, option]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (from && to && travelStyle && preferences.length > 0) {
      onSubmit(from, to, travelStyle, preferences);
    }
  };

  const handleGetCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const cityName = await getCityFromCoordinates(latitude, longitude);
          setFrom(cityName);
        } catch (error) {
          console.error(error);
          alert("Could not determine the city from your location. Please enter it manually.");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to retrieve your location. Please ensure location services are enabled and permissions are granted.");
        setIsLocating(false);
      }
    );
  };

  const isSubmitDisabled = isLoading || preferences.length === 0;

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/80 space-y-6 w-full max-w-md">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-800">Plan a Trip</h2>
        <p className="text-gray-600 mt-2">Create a detailed, multi-day itinerary.</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="from" className="block text-sm font-medium text-gray-700">From</label>
           <div className="mt-1 relative">
            <input
              type="text"
              id="from"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm pr-10"
              placeholder="e.g., New Delhi"
              required
            />
             <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button 
                    type="button" 
                    onClick={handleGetCurrentLocation} 
                    disabled={isLocating}
                    className="text-gray-400 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Use current location"
                >
                    {isLocating ? (
                        <svg className="animate-spin h-5 w-5 text-violet-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                    )}
                </button>
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="to" className="block text-sm font-medium text-gray-700">To</label>
          <input
            type="text"
            id="to"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
            placeholder="e.g., Mumbai"
            required
          />
        </div>
      </div>
       <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Travel Style</label>
        <div className="grid grid-cols-2 gap-2">
            {travelStyleOptions.map(style => (
                <button type="button" key={style} onClick={() => setTravelStyle(style)} className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${travelStyle === style ? 'bg-violet-600 text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    {style}
                </button>
            ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Preferred Transport</label>
        <div className="mt-2 grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-3 border">
          {transportOptions.map((option) => (
            <div key={option} className="flex items-center">
              <input
                id={`pref-${option}`}
                name="transportPreference"
                type="checkbox"
                checked={preferences.includes(option)}
                onChange={() => handlePreferenceChange(option)}
                className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
              />
              <label htmlFor={`pref-${option}`} className="ml-3 block text-sm font-medium text-gray-900">
                {option}
              </label>
            </div>
          ))}
        </div>
        {preferences.length === 0 && (
          <p className="mt-2 text-xs text-red-600">Please select at least one mode of transport.</p>
        )}
      </div>

      <button 
        type="submit" 
        disabled={isSubmitDisabled}
        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-md font-semibold text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:bg-violet-400 disabled:cursor-not-allowed transition-transform transform hover:scale-105 duration-200"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating Your Adventure...
          </>
        ) : 'Generate My Trip'}
      </button>
    </form>
  );
};

export default TripForm;