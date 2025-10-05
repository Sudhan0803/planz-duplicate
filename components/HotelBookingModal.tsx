
import React from 'react';

interface HotelBookingModalProps {
  city: string;
  onClose: () => void;
}

const HotelBookingModal: React.FC<HotelBookingModalProps> = ({ city, onClose }) => {
  const bookingSites = [
    { name: 'Booking.com', url: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(city)}` },
    { name: 'Agoda', url: `https://www.agoda.com/search?city=${encodeURIComponent(city)}` },
    { name: 'MakeMyTrip', url: `https://www.makemytrip.com/hotels/hotel-listing/?city=${encodeURIComponent(city)}` },
    { name: 'Goibibo', url: `https://www.goibibo.com/hotels/find-hotels-in-${city.toLowerCase().replace(/\s+/g, '-')}/` }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start">
            <div>
                 <h3 className="text-2xl font-bold text-gray-800">Find Hotels in {city}</h3>
                <p className="text-gray-600 mt-1">Check these popular sites for accommodation.</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl font-bold">&times;</button>
        </div>
       
        <div className="mt-6 space-y-3">
          {bookingSites.map(site => (
            <a
              key={site.name}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors"
            >
              Search on {site.name}
            </a>
          ))}
        </div>
         <button
          onClick={onClose}
          className="mt-6 w-full text-sm font-semibold text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default HotelBookingModal;
