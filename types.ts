
// Fix: Add User interface to be used with Firebase Auth.
export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
}

export interface TransportDetail {
  mode: 'Train' | 'Bus' | 'Metro' | 'Local Bus' | 'Ferry' | 'Auto Rickshaw' | 'Other';
  from: string;
  to: string;
  details: string; 
  price?: string;
  bookingLink?: string;
  departureTime?: string;
  arrivalTime?: string;
}

export interface DailyItinerary {
  day: number;
  title: string;
  city: string;
  lat: number;
  lng: number;
  transport: TransportDetail[];
  activities: string[];
}

export interface TripPlan {
  // Fix: Add optional id property for trips retrieved from Firestore.
  id?: string;
  tripTitle: string;
  totalDuration: number;
  itinerary: DailyItinerary[];
  estimatedTotalBudget?: string;
}