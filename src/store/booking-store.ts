/**
 * H2H Healthcare - Booking Store (Zustand)
 * Global state management for booking flow
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ClinicCenter {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string | null;
  facilities: string[];
  location?: {
    id: string;
    city: string;
    name: string;
    tier: number;
  };
}

interface Service {
  id: string;
  name: string;
  slug: string;
  category: string;
  duration_minutes: number;
  price?: number;
}

interface Doctor {
  id: string;
  name: string;
  avatar?: string;
  specializations: string[];
  experience_years: number;
  rating: number;
  consultation_fee: number;
}

interface BookingState {
  // Pre-selected data (from URL params or previous selections)
  preSelectedCenter: ClinicCenter | null;
  preSelectedMode: 'online' | 'offline' | 'home_visit' | null;
  
  // Current booking selections
  selectedCenter: ClinicCenter | null;
  selectedService: Service | null;
  selectedDoctor: Doctor | null;
  selectedDate: string | null;
  selectedTime: string | null;
  selectedMode: 'online' | 'offline' | 'home_visit';
  
  // Patient details
  patientName: string;
  patientPhone: string;
  notes: string;
  
  // Booking result
  lastBookingId: string | null;
  lastBookingDetails: any | null;
  
  // Actions
  setPreSelectedCenter: (center: ClinicCenter | null) => void;
  setPreSelectedMode: (mode: 'online' | 'offline' | 'home_visit' | null) => void;
  setSelectedCenter: (center: ClinicCenter | null) => void;
  setSelectedService: (service: Service | null) => void;
  setSelectedDoctor: (doctor: Doctor | null) => void;
  setSelectedDate: (date: string | null) => void;
  setSelectedTime: (time: string | null) => void;
  setSelectedMode: (mode: 'online' | 'offline' | 'home_visit') => void;
  setPatientDetails: (name: string, phone: string, notes?: string) => void;
  setBookingResult: (id: string, details: any) => void;
  clearBooking: () => void;
  clearPreSelection: () => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      // Initial state
      preSelectedCenter: null,
      preSelectedMode: null,
      selectedCenter: null,
      selectedService: null,
      selectedDoctor: null,
      selectedDate: null,
      selectedTime: null,
      selectedMode: 'offline',
      patientName: '',
      patientPhone: '',
      notes: '',
      lastBookingId: null,
      lastBookingDetails: null,

      // Actions
      setPreSelectedCenter: (center) => set({ 
        preSelectedCenter: center,
        selectedCenter: center,
      }),
      
      setPreSelectedMode: (mode) => set({ 
        preSelectedMode: mode,
        selectedMode: mode || 'offline',
      }),
      
      setSelectedCenter: (center) => set({ selectedCenter: center }),
      setSelectedService: (service) => set({ selectedService: service }),
      setSelectedDoctor: (doctor) => set({ selectedDoctor: doctor }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setSelectedTime: (time) => set({ selectedTime: time }),
      setSelectedMode: (mode) => set({ selectedMode: mode }),
      
      setPatientDetails: (name, phone, notes = '') => set({ 
        patientName: name, 
        patientPhone: phone,
        notes,
      }),
      
      setBookingResult: (id, details) => set({ 
        lastBookingId: id, 
        lastBookingDetails: details,
      }),
      
      clearBooking: () => set({
        selectedCenter: null,
        selectedService: null,
        selectedDoctor: null,
        selectedDate: null,
        selectedTime: null,
        selectedMode: 'offline',
        patientName: '',
        patientPhone: '',
        notes: '',
      }),
      
      clearPreSelection: () => set({
        preSelectedCenter: null,
        preSelectedMode: null,
      }),
    }),
    {
      name: 'h2h-booking-store',
      partialize: (state) => ({
        // Only persist these fields
        patientName: state.patientName,
        patientPhone: state.patientPhone,
        lastBookingId: state.lastBookingId,
        lastBookingDetails: state.lastBookingDetails,
      }),
    }
  )
);
