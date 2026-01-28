'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Header, Footer } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Lazy load heavy components
const Confetti = dynamic(() => import('@/components/ui/confetti').then(m => ({ default: m.Confetti })), { ssr: false });
// Import the type inline
type ConfettiRef = import('@/components/ui/confetti').ConfettiRef;
import { 
  MapPin, 
  Clock, 
  Video, 
  Building2, 
  Home,
  CalendarIcon,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  IndianRupee,
  User,
  Sparkles
} from 'lucide-react';
import { format, addDays, isBefore, startOfToday } from 'date-fns';
import { cn } from '@/lib/utils';
import { DEFAULT_LOCATIONS } from '@/constants/locations';
import { DEFAULT_SERVICES, SERVICE_CATEGORIES, APPOINTMENT_MODES } from '@/constants/services';

type BookingStep = 'location' | 'service' | 'doctor' | 'datetime' | 'confirm';

const MOCK_DOCTORS = [
  { id: '1', name: 'Dr. Rajesh Kumar', specialization: 'Sports Physiotherapist', experience: 12, rating: 4.9, image: null },
  { id: '2', name: 'Dr. Priya Sharma', specialization: 'Pain Management Specialist', experience: 8, rating: 4.8, image: null },
  { id: '3', name: 'Dr. Amit Patel', specialization: 'Orthopedic Physiotherapist', experience: 15, rating: 4.9, image: null },
];

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00'
];

function BookingPageContent() {
  const searchParams = useSearchParams();
  const confettiRef = useRef<ConfettiRef>(null);
  const [currentStep, setCurrentStep] = useState<BookingStep>('location');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<'online' | 'offline' | 'home_visit'>('offline');
  const [notes, setNotes] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const triggerConfetti = () => {
    setShowConfetti(true);
    confettiRef.current?.fire({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#14b8a6', '#22d3d8', '#0891b2', '#0d9488']
    });
  };

  useEffect(() => {
    const locationParam = searchParams.get('location');
    const serviceParam = searchParams.get('service');
    const modeParam = searchParams.get('mode');

    if (locationParam) {
      const location = DEFAULT_LOCATIONS.find(l => l.city.toLowerCase() === locationParam.toLowerCase());
      if (location) {
        setSelectedLocation(location.name);
        setCurrentStep('service');
      }
    }

    if (serviceParam) {
      const service = DEFAULT_SERVICES.find(s => s.slug === serviceParam);
      if (service) {
        setSelectedService(service.slug);
      }
    }

    if (modeParam === 'online') {
      setSelectedMode('online');
    }
  }, [searchParams]);

  const steps: { key: BookingStep; label: string }[] = [
    { key: 'location', label: 'Location' },
    { key: 'service', label: 'Service' },
    { key: 'doctor', label: 'Doctor' },
    { key: 'datetime', label: 'Date & Time' },
    { key: 'confirm', label: 'Confirm' },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === currentStep);

  const goToNextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].key);
    }
  };

  const goToPrevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].key);
    }
  };

  const getSelectedLocationData = () => DEFAULT_LOCATIONS.find(l => l.name === selectedLocation);
  const getSelectedServiceData = () => DEFAULT_SERVICES.find(s => s.slug === selectedService);
  const getSelectedDoctorData = () => MOCK_DOCTORS.find(d => d.id === selectedDoctor);

  const calculatePrice = () => {
    const service = getSelectedServiceData();
    const location = getSelectedLocationData();
    if (!service || !location) return 0;
    return location.tier === 1 ? service.tier1_price : service.tier2_price;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      {/* Grid Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
      
      <Header />
      
      <main className="flex-1 mt-12 pt-24 pb-12 relative z-10">
        <div className="max-w-[1100px] mx-auto px-6">
          {/* Progress Steps - Compact */}
          <div className="mb-10 bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.key} className="flex items-center flex-1">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'flex items-center justify-center w-8 h-8 rounded-full text-[13px] font-medium transition-all',
                        index < currentStepIndex
                          ? 'bg-cyan-500 text-white'
                          : index === currentStepIndex
                          ? 'bg-cyan-500 text-white'
                          : 'bg-gray-100 text-gray-400'
                      )}
                    >
                      {index < currentStepIndex ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className={cn(
                      'hidden md:block text-[13px]',
                      index <= currentStepIndex ? 'text-gray-900 font-medium' : 'text-gray-400'
                    )}>
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      'flex-1 h-[2px] mx-3 rounded-full',
                      index < currentStepIndex ? 'bg-cyan-500' : 'bg-gray-200'
                    )} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Step 1: Location Selection */}
            {currentStep === 'location' && (
              <div>
                <div className="text-center mb-10">
                  <h1 className="text-[32px] md:text-[40px] font-medium text-gray-900 tracking-tight mb-3">Select Your Location</h1>
                  <p className="text-[15px] text-gray-500">Choose a clinic near you or opt for <span className="text-cyan-600 font-medium">online consultation</span></p>
                </div>

                {/* Online Consultation Card */}
                <div 
                  className={cn(
                    "mb-8 p-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all",
                    selectedMode === 'online' 
                      ? 'border-cyan-500 bg-cyan-50' 
                      : 'border-gray-200 hover:border-cyan-300 hover:bg-cyan-50/50'
                  )}
                  onClick={() => {
                    setSelectedMode('online');
                    setSelectedLocation('Online');
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
                        <Video className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-[16px] font-semibold text-gray-900">Online Consultation</h3>
                        <p className="text-[13px] text-gray-500">Connect with our doctors via video call from anywhere</p>
                      </div>
                    </div>
                    {selectedMode === 'online' && (
                      <CheckCircle2 className="h-6 w-6 text-cyan-500" />
                    )}
                  </div>
                </div>

                {/* Location Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {DEFAULT_LOCATIONS.map((location) => (
                    <div
                      key={location.name}
                      className={cn(
                        'group cursor-pointer p-5 rounded-xl border bg-white transition-all hover:shadow-lg',
                        selectedLocation === location.name 
                          ? 'border-cyan-500' 
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                      onClick={() => {
                        setSelectedLocation(location.name);
                        setSelectedMode('offline');
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <Badge className={cn(
                          "text-[11px] font-medium",
                          location.tier === 1 ? 'bg-cyan-500 text-white' : 'bg-teal-500 text-white'
                        )}>
                          Tier {location.tier}
                        </Badge>
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                          selectedLocation === location.name 
                            ? 'border-cyan-500 bg-cyan-500' 
                            : 'border-gray-300 group-hover:border-gray-400'
                        )}>
                          {selectedLocation === location.name && (
                            <CheckCircle2 className="h-3 w-3 text-white" />
                          )}
                        </div>
                      </div>
                      <h3 className="text-[17px] font-semibold text-gray-900 mb-2">{location.city}</h3>
                      <div className="flex items-start gap-2 text-[13px] text-gray-500">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-cyan-600" />
                        <span className="line-clamp-2">{location.address}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-10">
                  <Button
                    onClick={goToNextStep}
                    disabled={!selectedLocation}
                    className="h-11 px-8 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full text-[14px] font-medium disabled:opacity-50"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Service Selection */}
            {currentStep === 'service' && (
              <div>
                <div className="text-center mb-10">
                  <h1 className="text-[32px] md:text-[40px] font-medium text-gray-900 tracking-tight mb-3">Select a Service</h1>
                  <p className="text-[15px] text-gray-500">Choose the <span className="text-cyan-600 font-medium">treatment</span> you need</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {DEFAULT_SERVICES.filter(service => {
                    if (selectedMode === 'online') return service.online_available;
                    return true;
                  }).map((service) => {
                    const category = SERVICE_CATEGORIES[service.category as keyof typeof SERVICE_CATEGORIES];
                    const location = getSelectedLocationData();
                    const price = location ? (location.tier === 1 ? service.tier1_price : service.tier2_price) : service.tier1_price;
                    
                    return (
                      <div
                        key={service.slug}
                        className={cn(
                          'group cursor-pointer p-5 rounded-xl border bg-white transition-all hover:shadow-lg',
                          selectedService === service.slug 
                            ? 'border-cyan-500' 
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                        onClick={() => setSelectedService(service.slug)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <Badge className="bg-gray-100 text-gray-600 border-0 text-[11px]">{category.name}</Badge>
                          <div className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                            selectedService === service.slug 
                              ? 'border-cyan-500 bg-cyan-500' 
                              : 'border-gray-300 group-hover:border-gray-400'
                          )}>
                            {selectedService === service.slug && (
                              <CheckCircle2 className="h-3 w-3 text-white" />
                            )}
                          </div>
                        </div>
                        <h3 className="text-[17px] font-semibold text-gray-900 mb-2">{service.name}</h3>
                        <p className="text-[13px] text-gray-500 line-clamp-2 mb-4">{service.description}</p>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-1 text-[12px] text-gray-400">
                            <Clock className="h-3.5 w-3.5" />
                            {service.duration_minutes} mins
                          </div>
                          <div className="flex items-center gap-0.5 text-[15px] font-semibold text-cyan-600">
                            <IndianRupee className="h-3.5 w-3.5" />
                            {price}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between mt-10">
                  <Button variant="outline" onClick={goToPrevStep} className="h-11 px-6 rounded-full text-[14px] border-gray-300 hover:bg-gray-50">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button onClick={goToNextStep} disabled={!selectedService} className="h-11 px-8 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full text-[14px] font-medium disabled:opacity-50">
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Doctor Selection */}
            {currentStep === 'doctor' && (
              <div>
                <div className="text-center mb-10">
                  <h1 className="text-[32px] md:text-[40px] font-medium text-gray-900 tracking-tight mb-3">Choose Your Doctor</h1>
                  <p className="text-[15px] text-gray-500">Select a <span className="text-cyan-600 font-medium">specialist</span> for your treatment</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {MOCK_DOCTORS.map((doctor) => (
                    <div
                      key={doctor.id}
                      className={cn(
                        'group cursor-pointer p-5 rounded-xl border bg-white transition-all hover:shadow-lg',
                        selectedDoctor === doctor.id 
                          ? 'border-cyan-500' 
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                      onClick={() => setSelectedDoctor(doctor.id)}
                    >
                      <div className="flex items-start gap-4">
                        <img 
                          src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${doctor.name}&backgroundColor=b6e3f4`}
                          alt={doctor.name}
                          className="w-14 h-14 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="text-[16px] font-semibold text-gray-900 truncate">{doctor.name}</h3>
                            <div className={cn(
                              "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ml-2",
                              selectedDoctor === doctor.id 
                                ? 'border-cyan-500 bg-cyan-500' 
                                : 'border-gray-300 group-hover:border-gray-400'
                            )}>
                              {selectedDoctor === doctor.id && (
                                <CheckCircle2 className="h-3 w-3 text-white" />
                              )}
                            </div>
                          </div>
                          <p className="text-[12px] text-gray-500 mb-2">{doctor.specialization}</p>
                          <div className="flex items-center gap-3 text-[12px]">
                            <span className="text-gray-400">{doctor.experience} yrs</span>
                            <span className="flex items-center gap-1 text-amber-500 font-medium">
                              ⭐ {doctor.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-10">
                  <Button variant="outline" onClick={goToPrevStep} className="h-11 px-6 rounded-full text-[14px] border-gray-300 hover:bg-gray-50">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button onClick={goToNextStep} disabled={!selectedDoctor} className="h-11 px-8 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full text-[14px] font-medium disabled:opacity-50">
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Date & Time Selection */}
            {currentStep === 'datetime' && (
              <div>
                <div className="text-center mb-10">
                  <h1 className="text-[32px] md:text-[40px] font-medium text-gray-900 tracking-tight mb-3">Select Date & Time</h1>
                  <p className="text-[15px] text-gray-500">Choose your preferred <span className="text-cyan-600 font-medium">appointment slot</span></p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-xl border border-gray-200 bg-white">
                    <h3 className="text-[16px] font-semibold text-gray-900 mb-4">Select Date</h3>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => 
                        isBefore(date, startOfToday()) || 
                        isBefore(addDays(new Date(), 30), date)
                      }
                      className="rounded-lg border-0"
                    />
                  </div>

                  <div className="p-6 rounded-xl border border-gray-200 bg-white">
                    <h3 className="text-[16px] font-semibold text-gray-900 mb-2">Select Time</h3>
                    <p className="text-[13px] text-gray-500 mb-4">
                      {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Please select a date first'}
                    </p>
                    {selectedDate ? (
                      <div className="grid grid-cols-3 gap-2">
                        {TIME_SLOTS.map((time) => (
                          <button
                            key={time}
                            className={cn(
                              "py-2.5 px-3 rounded-lg text-[13px] font-medium transition-all",
                              selectedTime === time 
                                ? 'bg-cyan-500 text-white shadow-md' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            )}
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-400 text-[14px]">
                        Select a date to see available time slots
                      </div>
                    )}
                  </div>
                </div>

                {selectedMode !== 'online' && (
                  <div className="mt-6 p-6 rounded-xl border border-gray-200 bg-white">
                    <h3 className="text-[16px] font-semibold text-gray-900 mb-4">Consultation Mode</h3>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(APPOINTMENT_MODES).map(([key, mode]) => {
                        const service = getSelectedServiceData();
                        const isAvailable = key === 'online' ? service?.online_available :
                                           key === 'offline' ? service?.offline_available :
                                           service?.home_visit_available;
                        if (!isAvailable) return null;
                        
                        const Icon = key === 'online' ? Video : key === 'offline' ? Building2 : Home;
                        const isSelected = selectedMode === key;
                        return (
                          <button
                            key={key}
                            onClick={() => setSelectedMode(key as typeof selectedMode)}
                            className={cn(
                              "flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all",
                              isSelected 
                                ? 'bg-cyan-500 text-white shadow-md' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            )}
                          >
                            <Icon className="h-4 w-4" />
                            {mode.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-10">
                  <Button variant="outline" onClick={goToPrevStep} className="h-11 px-6 rounded-full text-[14px] border-gray-300 hover:bg-gray-50">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button onClick={goToNextStep} disabled={!selectedDate || !selectedTime} className="h-11 px-8 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full text-[14px] font-medium disabled:opacity-50">
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 5: Confirmation */}
            {currentStep === 'confirm' && (
              <div>
                <div className="text-center mb-10">
                  <h1 className="text-[32px] md:text-[40px] font-medium text-gray-900 tracking-tight mb-3">Confirm Your Booking</h1>
                  <p className="text-[15px] text-gray-500">Review your <span className="text-cyan-600 font-medium">appointment details</span></p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-xl border border-gray-200 bg-white">
                    <h3 className="text-[16px] font-semibold text-gray-900 mb-6">Appointment Summary</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-[13px] text-gray-500">Location</span>
                        <span className="text-[14px] font-medium text-gray-900">{selectedMode === 'online' ? 'Online' : getSelectedLocationData()?.city}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-[13px] text-gray-500">Service</span>
                        <span className="text-[14px] font-medium text-gray-900">{getSelectedServiceData()?.name}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-[13px] text-gray-500">Doctor</span>
                        <span className="text-[14px] font-medium text-gray-900">{getSelectedDoctorData()?.name}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-[13px] text-gray-500">Date</span>
                        <span className="text-[14px] font-medium text-gray-900">
                          {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
                        </span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-[13px] text-gray-500">Time</span>
                        <span className="text-[14px] font-medium text-gray-900">{selectedTime}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-[13px] text-gray-500">Mode</span>
                        <span className="text-[14px] font-medium text-gray-900 flex items-center gap-2">
                          {selectedMode === 'online' && <Video className="h-4 w-4 text-cyan-600" />}
                          {selectedMode === 'offline' && <Building2 className="h-4 w-4 text-cyan-600" />}
                          {selectedMode === 'home_visit' && <Home className="h-4 w-4 text-cyan-600" />}
                          {APPOINTMENT_MODES[selectedMode].name}
                        </span>
                      </div>
                      <div className="flex justify-between py-4 bg-cyan-50 rounded-lg px-4 -mx-2 mt-4">
                        <span className="text-[15px] font-semibold text-gray-900">Total Amount</span>
                        <span className="text-[18px] font-bold text-cyan-600 flex items-center">
                          <IndianRupee className="h-4 w-4" />
                          {calculatePrice()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-xl border border-gray-200 bg-white">
                    <h3 className="text-[16px] font-semibold text-gray-900 mb-2">Additional Notes</h3>
                    <p className="text-[13px] text-gray-500 mb-4">
                      Any specific concerns or information for the doctor
                    </p>
                    <Textarea
                      placeholder="Describe your symptoms or any specific concerns..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={6}
                      className="border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div className="flex justify-between mt-10">
                  <Button variant="outline" onClick={goToPrevStep} className="h-11 px-6 rounded-full text-[14px] border-gray-300 hover:bg-gray-50">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button 
                    className="h-11 px-8 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-full text-[14px] font-medium"
                    onClick={triggerConfetti}
                    asChild
                  >
                    <Link href="/login?redirect=/booking/payment">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Proceed to Payment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Confetti Canvas */}
      <Confetti
        ref={confettiRef}
        className="fixed inset-0 pointer-events-none z-50"
        manualstart
        options={{
          colors: ['#06b6d4', '#14b8a6', '#22d3d8', '#0891b2', '#0d9488'],
        }}
      />

      <Footer />
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <BookingPageContent />
    </Suspense>
  );
}
