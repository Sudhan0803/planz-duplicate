import React, { useState } from 'react';
import type { DailyItinerary } from '../types';

interface BreakModalProps {
  day: DailyItinerary;
  onClose: () => void;
  onRefine: (request: string) => void;
  onShowHotelModal: (city: string) => void;
}

const BreakModal: React.FC<BreakModalProps> = ({ day, onClose, onRefine, onShowHotelModal }) => {
  const [hours, setHours] = useState(2);
  const [minutes, setMinutes] = useState(0);

  const handleConfirmBreak = () => {
    let request = `On Day ${day.day} in ${day.city}, add a break of `;
    if (hours > 0) {
      request += `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    if (minutes > 0) {
      if (hours > 0) request += ' and ';
      request += `${minutes} minutes`;
    }
    request += '. Then, recalculate the rest of the trip accordingly, updating departure times for subsequent travel.';
    onRefine(request);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4 transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start">
            <div>
                 <h3 className="text-2xl font-bold text-gray-800">Add a Break in {day.city}</h3>
                <p className="text-gray-600 mt-1">Select your break duration. The plan will be updated.</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl font-bold">&times;</button>
        </div>

        <div className="mt-6 space-y-6">
            <div>
                <label htmlFor="hours" className="block text-sm font-medium text-gray-700">Hours ({hours})</label>
                <input
                    id="hours"
                    type="range"
                    min="0"
                    max="23"
                    value={hours}
                    onChange={(e) => setHours(parseInt(e.target.value))}
                    className="w-full mt-1"
                />
            </div>
            <div>
                <label htmlFor="minutes" className="block text-sm font-medium text-gray-700">Minutes ({minutes})</label>
                <input
                    id="minutes"
                    type="range"
                    min="0"
                    max="45"
                    step="15"
                    value={minutes}
                    onChange={(e) => setMinutes(parseInt(e.target.value))}
                    className="w-full mt-1"
                />
            </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => onShowHotelModal(day.city)}
              className="w-full text-center py-3 px-4 border border-teal-500 rounded-lg shadow-sm text-base font-semibold text-teal-600 bg-white hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
            >
              Find Hotels
            </button>
             <button
              onClick={handleConfirmBreak}
              disabled={hours === 0 && minutes === 0}
              className="w-full text-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:bg-violet-400 transition-colors"
            >
              Confirm Break
            </button>
        </div>

      </div>
    </div>
  );
};

export default BreakModal;
