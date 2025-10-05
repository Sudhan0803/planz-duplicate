import React, { useEffect, useRef } from 'react';
import type { DailyItinerary } from '../types';

// Let TypeScript know that 'L' (from Leaflet.js) is a global variable.
declare const L: any;

interface MapViewProps {
  itinerary: DailyItinerary[];
}

const MapView: React.FC<MapViewProps> = ({ itinerary }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      // Initialize map
      const map = L.map(mapContainerRef.current).setView([20.5937, 78.9629], 5); // Default view over India
      mapInstanceRef.current = map;

      // Add tile layer (e.g., OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
    }
    
    if (mapInstanceRef.current && itinerary.length > 0) {
       const map = mapInstanceRef.current;
        
      // Clear existing layers
      map.eachLayer((layer: any) => {
        if (!!layer.toGeoJSON) {
          map.removeLayer(layer);
        }
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);


      const locations = itinerary.reduce((acc, day) => {
        if (!acc.some(loc => loc.city === day.city)) {
          acc.push({ city: day.city, lat: day.lat, lng: day.lng });
        }
        return acc;
      }, [] as { city: string; lat: number; lng: number }[]);

      const latLngs = locations.map(loc => [loc.lat, loc.lng]);

      if (locations.length > 0) {
        locations.forEach(loc => {
          L.marker([loc.lat, loc.lng]).addTo(map)
            .bindPopup(`<b>${loc.city}</b>`);
        });

        if (latLngs.length > 1) {
          const polyline = L.polyline(latLngs, { color: 'rgb(139, 92, 246)', weight: 4 }).addTo(map);
          map.fitBounds(polyline.getBounds().pad(0.2));
        } else {
            map.setView(latLngs[0], 8);
        }
      }
    }
    
  }, [itinerary]); 

  // Separate cleanup effect
  useEffect(() => {
    const map = mapInstanceRef.current;
    return () => {
      if (map) {
        map.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div 
        ref={mapContainerRef} 
        className="w-full h-64 md:h-96 rounded-2xl shadow-lg border border-gray-200/80"
        aria-label="Map showing the trip route"
    ></div>
  );
};

export default MapView;