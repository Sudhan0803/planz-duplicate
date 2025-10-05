
import React from 'react';

export const BusIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.354c-1.39-1.39-2.25-3.236-2.25-5.232 0-1.996.86-3.842 2.25-5.232m0 10.464c1.39-1.39 2.25-3.236 2.25-5.232 0-1.996-.86-3.842-2.25-5.232m0 10.464L12 21m0-18v.01" />
  </svg>
);
