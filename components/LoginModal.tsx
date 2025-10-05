import React from 'react';
import { GoogleIcon } from './icons/GoogleIcon';

interface LoginModalProps {
  onLogin: () => void;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onLogin, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center transform transition-all" onClick={e => e.stopPropagation()}>
        <h3 className="text-2xl font-bold text-gray-800">Save Your Trip</h3>
        <p className="text-gray-600 mt-2 mb-6">Log in to save this itinerary to your travel history and access it anytime.</p>
        <button
          onClick={onLogin}
          className="w-full inline-flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors"
        >
          <GoogleIcon />
          Sign in with Google
        </button>
         <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-500 hover:text-gray-700"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
