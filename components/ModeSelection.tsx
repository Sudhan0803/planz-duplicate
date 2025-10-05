import React from 'react';
import { TrainIcon } from './icons/TrainIcon';
import { LandmarkIcon } from './icons/LandmarkIcon';

interface ModeSelectionProps {
    onSelectMode: (mode: 'transport' | 'trip') => void;
}

const ModeSelection: React.FC<ModeSelectionProps> = ({ onSelectMode }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-100 flex items-center justify-center p-4">
            <div className="p-10 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-violet-200/50 border border-violet-100/80 w-full max-w-2xl text-center">
                {/* Header with gradient text */}
                <div className="mb-2">
                    <h1 className="text-5xl font-black bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                        What's Your Plan?
                    </h1>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full mx-auto mt-4"></div>
                </div>
                
                <p className="mt-6 text-lg text-gray-600 font-medium">
                    Choose your journey type. Get a quick route or a full-blown adventure.
                </p>
                
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Transport Card */}
                    <button
                        onClick={() => onSelectMode('transport')}
                        className="group relative p-8 flex flex-col items-center justify-center bg-gradient-to-br from-white to-violet-50 rounded-2xl shadow-xl shadow-violet-100/50 border border-violet-200/60 hover:shadow-2xl hover:shadow-violet-200/70 hover:border-violet-300 transition-all duration-500 transform hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-violet-400/30 focus:ring-offset-2 overflow-hidden"
                    >
                        {/* Animated background gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-violet-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Icon container with glow effect */}
                        <div className="relative z-10 bg-gradient-to-br from-violet-100 to-violet-200 rounded-2xl p-5 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-violet-200">
                            <TrainIcon className="w-14 h-14 text-violet-600" />
                        </div>
                        
                        <h2 className="relative z-10 mt-6 text-2xl font-bold bg-gradient-to-r from-violet-700 to-violet-800 bg-clip-text text-transparent">
                            Find Transport
                        </h2>
                        <p className="relative z-10 mt-3 text-gray-600 leading-relaxed">
                            Get the best public transport route from A to B.
                        </p>
                        
                        {/* Hover border effect */}
                        <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-padding group-hover:opacity-100 opacity-0 transition-opacity duration-500 -m-0.5"></div>
                    </button>

                    {/* Trip Card */}
                    <button
                        onClick={() => onSelectMode('trip')}
                        className="group relative p-8 flex flex-col items-center justify-center bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl shadow-purple-100/50 border border-purple-200/60 hover:shadow-2xl hover:shadow-purple-200/70 hover:border-purple-300 transition-all duration-500 transform hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-purple-400/30 focus:ring-offset-2 overflow-hidden"
                    >
                        {/* Animated background gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Icon container with glow effect */}
                        <div className="relative z-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-5 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-purple-200">
                            <LandmarkIcon className="w-14 h-14 text-purple-600" />
                        </div>
                        
                        <h2 className="relative z-10 mt-6 text-2xl font-bold bg-gradient-to-r from-purple-700 to-purple-800 bg-clip-text text-transparent">
                            Plan a Trip
                        </h2>
                        <p className="relative z-10 mt-3 text-gray-600 leading-relaxed">
                            Create a detailed, multi-day travel itinerary.
                        </p>
                        
                        {/* Hover border effect */}
                        <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-padding group-hover:opacity-100 opacity-0 transition-opacity duration-500 -m-0.5"></div>
                    </button>
                </div>

                {/* Decorative elements */}
                <div className="mt-10 flex justify-center space-x-2">
                    {[1, 2, 3].map((dot) => (
                        <div
                            key={dot}
                            className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-400 to-purple-400 opacity-60"
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ModeSelection;