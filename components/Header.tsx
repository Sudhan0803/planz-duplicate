import React from 'react';

interface HeaderProps {
    onGoHome: () => void;
    showBackButton: boolean;
}

const Header: React.FC<HeaderProps> = ({ onGoHome, showBackButton }) => {
    return (
        <header className="fixed top-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-200/80">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center">
                        <button onClick={onGoHome} className="flex-shrink-0 text-3xl font-extrabold text-violet-600 tracking-wider">
                            Plan Z
                        </button>
                    </div>
                     <div className="flex items-center">
                        {showBackButton && (
                            <button 
                                onClick={onGoHome}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                New Plan
                            </button>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;