import React, { useState } from 'react';
import { getCityFromCoordinates } from '../services/geminiService';

interface TransportFormProps {
  onSubmit: (from: string, to: string, preferences: string[]) => void;
  isLoading: boolean;
}

const transportOptions = ['Train', 'Bus'];

const TransportForm: React.FC<TransportFormProps> = ({ onSubmit, isLoading }) => {
  const [from, setFrom] = useState('Mumbai');
  const [to, setTo] = useState('Pune');
  const [preferences, setPreferences] = useState<string[]>(transportOptions);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handlePreferenceChange = (option: string) => {
    setSelectedOption(option);
    setPreferences(prev => 
      prev.includes(option) 
        ? prev.filter(p => p !== option) 
        : [...prev, option]
    );
    
    // Reset the selected option after animation
    setTimeout(() => setSelectedOption(null), 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (from && to && preferences.length > 0) {
      onSubmit(from, to, preferences);
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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-200/40 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/40 rounded-full blur-3xl animate-float-slow delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl animate-pulse-slow"></div>
        
        {/* Floating Particles */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-violet-300/50 rounded-full animate-float"></div>
        <div className="absolute top-3/4 right-1/3 w-2 h-2 bg-purple-300/40 rounded-full animate-float delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-violet-400/30 rounded-full animate-float delay-1500"></div>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 p-8 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-violet-200/50 border border-violet-100/80 space-y-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Find Transport
          </h2>
          <p className="text-gray-600 mt-3 text-lg">Get the best route from A to B</p>
          <div className="w-24 h-1.5 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full mx-auto mt-4"></div>
        </div>
        
        {/* Input Fields */}
        <div className="space-y-6">
          {/* From Input */}
          <div>
            <label htmlFor="from" className="block text-lg font-semibold text-gray-700 mb-3">
              From
            </label>
            <div className="relative">
              <input
                type="text"
                id="from"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="block w-full px-5 py-4 text-lg bg-white border-2 border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200 transition-all duration-300 transform hover:scale-105"
                placeholder="e.g., New Delhi"
                required
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <button 
                  type="button" 
                  onClick={handleGetCurrentLocation} 
                  disabled={isLocating}
                  className="text-violet-500 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 transform hover:scale-110"
                  aria-label="Use current location"
                >
                  {isLocating ? (
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce delay-150"></div>
                      <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce delay-300"></div>
                    </div>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* To Input */}
          <div>
            <label htmlFor="to" className="block text-lg font-semibold text-gray-700 mb-3">
              To
            </label>
            <input
              type="text"
              id="to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="block w-full px-5 py-4 text-lg bg-white border-2 border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200 transition-all duration-300 transform hover:scale-105"
              placeholder="e.g., Goa"
              required
            />
          </div>
        </div>
        
        {/* Transport Preferences */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-4">
            Preferred Transport
          </label>
          <div className="grid grid-cols-2 gap-4 rounded-2xl bg-gray-50/80 p-5 border border-gray-200">
            {transportOptions.map((option) => (
              <div 
                key={option} 
                className={`relative transition-all duration-500 ${
                  selectedOption === option ? 'animate-option-pop' : ''
                }`}
              >
                <button
                  type="button"
                  onClick={() => handlePreferenceChange(option)}
                  className={`w-full flex items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    preferences.includes(option)
                      ? 'bg-gradient-to-br from-violet-500 to-purple-500 text-white border-transparent shadow-lg shadow-violet-200 scale-110'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-violet-300 hover:shadow-md'
                  }`}
                >
                  <span className="text-lg font-semibold">{option}</span>
                </button>
                
                {/* Selection Animation */}
                {selectedOption === option && (
                  <>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-400 to-purple-400 animate-ping opacity-60"></div>
                    <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-violet-300 to-purple-300 opacity-30 animate-pulse"></div>
                  </>
                )}
              </div>
            ))}
          </div>
          {preferences.length === 0 && (
            <p className="mt-3 text-base text-red-500 font-medium animate-pulse">Please select at least one mode of transport</p>
          )}
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isSubmitDisabled}
          className="w-full flex justify-center items-center py-5 px-6 border border-transparent rounded-2xl text-xl font-bold text-white bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 focus:outline-none focus:ring-4 focus:ring-violet-200 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-violet-300 relative overflow-hidden group"
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          
          <span className="relative z-10 flex items-center">
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-4 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Finding Route...
              </>
            ) : (
              <>
                <svg className="w-6 h-6 mr-3 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Find Route
              </>
            )}
          </span>
        </button>

        {/* Decorative Footer */}
        <div className="flex justify-center space-x-3">
          {[1, 2, 3, 4].map((dot) => (
            <div
              key={dot}
              className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-400 to-purple-400 opacity-60"
            ></div>
          ))}
        </div>
      </form>

      {/* Custom Animations */}
      {/* Fix: Removed non-standard 'jsx' attribute from style tag. */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-40px) scale(1.1); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        @keyframes option-pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1.1); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-option-pop {
          animation: option-pop 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default TransportForm;