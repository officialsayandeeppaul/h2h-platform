'use client';

import Link from "next/link";
import { useState, useCallback, useEffect } from 'react';
import Map, { Marker, Popup, NavigationControl, GeolocateControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Highlighter } from "@/components/ui/highlighter";
import { MapPin, Phone, Clock, Navigation2, Video, Building2, Loader2, ArrowRight } from "lucide-react";
import { APP_CONFIG } from "@/constants/config";
import { SERVICE_CATEGORIES } from "@/constants/services";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

const CARE_VERTICALS = Object.keys(SERVICE_CATEGORIES).length;
const CLINIC_DAYS_PER_WEEK = 6;
const phoneTel = (p: string) => `tel:${p.replace(/\s/g, "")}`;

// Location tier info
const LOCATION_TIERS = {
  1: { name: 'Tier 1 (Metro)', color: 'cyan' },
  2: { name: 'Tier 2', color: 'teal' },
  3: { name: 'Tier 3', color: 'emerald' },
};

interface ClinicCenter {
  id: string;
  location_id: string;
  name: string;
  slug: string;
  address: string;
  landmark: string | null;
  pincode: string | null;
  phone: string | null;
  email: string | null;
  facilities: string[];
  rating: number;
  total_reviews: number;
  is_featured: boolean;
  is_active: boolean;
  location?: {
    id: string;
    name: string;
    city: string;
    tier: number;
    latitude?: number;
    longitude?: number;
  };
}

// Default coordinates for cities (fallback)
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Mumbai': { lat: 19.0760, lng: 72.8777 },
  'Bangalore': { lat: 12.9716, lng: 77.5946 },
  'Delhi': { lat: 28.6139, lng: 77.2090 },
  'Kolkata': { lat: 22.5726, lng: 88.3639 },
  'Chennai': { lat: 13.0827, lng: 80.2707 },
  'Hyderabad': { lat: 17.3850, lng: 78.4867 },
  'Pune': { lat: 18.5204, lng: 73.8567 },
  'Jaipur': { lat: 26.9124, lng: 75.7873 },
};

export default function LocationsPage() {
  const [clinicCenters, setClinicCenters] = useState<ClinicCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<ClinicCenter | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [viewState, setViewState] = useState({
    longitude: 78.9629,
    latitude: 20.5937,
    zoom: 4.2
  });
  const [selectedCity, setSelectedCity] = useState<string>('all');

  const cityCount = new Set(
    clinicCenters.map((c) => c.location?.city || "").filter(Boolean)
  ).size;

  // Fetch clinic centers from API
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await fetch('/api/clinic-centers');
        const data = await res.json();
        if (data.success) {
          setClinicCenters(data.data.centers || []);
        }
      } catch (err) {
        console.error('Failed to fetch clinic centers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCenters();
  }, []);

  // Get unique cities from dynamic data
  const cities = ['all', ...Array.from(new Set(clinicCenters.map(c => c.location?.city || '').filter(Boolean)))].sort();

  // Filter centers by selected city
  const filteredCenters = selectedCity === 'all' 
    ? clinicCenters 
    : clinicCenters.filter(c => c.location?.city?.toLowerCase() === selectedCity.toLowerCase());

  // Get coordinates for a center
  const getCenterCoords = (center: ClinicCenter) => {
    const city = center.location?.city || '';
    const coords = CITY_COORDINATES[city] || { lat: 20.5937, lng: 78.9629 };
    // Add small offset for multiple centers in same city
    const index = clinicCenters.filter(c => c.location?.city === city).indexOf(center);
    return {
      lat: coords.lat + (index * 0.02),
      lng: coords.lng + (index * 0.02),
    };
  };

  const handleMarkerClick = useCallback((center: ClinicCenter) => {
    setSelectedLocation(center);
    const coords = getCenterCoords(center);
    setViewState(prev => ({
      ...prev,
      longitude: coords.lng,
      latitude: coords.lat,
      zoom: 12
    }));
  }, [clinicCenters]);

  const scrollToMap = useCallback((center: ClinicCenter) => {
    handleMarkerClick(center);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }, [handleMarkerClick]);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 bg-white overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute top-20 right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px]" />
          
          <div className="max-w-[1200px] mx-auto px-6 relative z-10">
            <div className="text-center mb-8">
              <p className="text-[13px] text-cyan-600 font-medium mb-3">Our Locations</p>
              <h1 className="text-[36px] md:text-[48px] font-medium text-gray-900 tracking-tight leading-tight mb-6">
                Find a{' '}
                <Highlighter action="box" color="#06b6d4" strokeWidth={2} animationDuration={1000} isView>
                  <span className="text-cyan-600">Center Near You</span>
                </Highlighter>
              </h1>
              <p className="text-[16px] text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {loading ? (
                  <>
                    Loading our centre list… You can book physio, sports rehab, and pain care—in clinic, online, or at
                    home where we operate. Need help? Call{' '}
                    <a href={phoneTel(APP_CONFIG.phone)} className="text-cyan-600 font-medium hover:underline">
                      {APP_CONFIG.phone}
                    </a>
                    .
                  </>
                ) : clinicCenters.length > 0 ? (
                  <>
                    We currently list{' '}
                    <span className="font-medium text-gray-800">{clinicCenters.length}</span> centre
                    {clinicCenters.length === 1 ? "" : "s"} across{" "}
                    <span className="font-medium text-gray-800">{cityCount}</span> cities. Same services you see on the
                    homepage—transparent booking, no inflated claims. For the fastest help, use{" "}
                    <Link href="/booking" className="text-cyan-600 font-medium hover:underline">
                      Book Appointment
                    </Link>{" "}
                    or our toll-free line.
                  </>
                ) : (
                  <>
                    We couldn&apos;t load centre details right now. Please try refreshing, use{" "}
                    <Link href="/booking" className="text-cyan-600 font-medium hover:underline">
                      Book Appointment
                    </Link>
                    , or call{" "}
                    <a href={phoneTel(APP_CONFIG.phone)} className="text-cyan-600 font-medium hover:underline">
                      {APP_CONFIG.phone}
                    </a>
                    .
                  </>
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Map Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-[32px] md:text-[40px] font-medium text-gray-900 tracking-tight mb-4">
                Interactive{' '}
                <span className="text-cyan-600">Location Map</span>
              </h2>
              <p className="text-[15px] text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Markers match the centres listed below (tiers reflect metro vs regional hubs in our static directory).
                Tap a pin for address and booking.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              <div className="h-[600px] relative">
                {/* Loading State */}
                {!mapLoaded && !mapError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                    <div className="text-center">
                      <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mx-auto mb-4" />
                      <p className="text-[14px] text-gray-600">Loading map...</p>
                    </div>
                  </div>
                )}

                {/* Error State */}
                {mapError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                    <div className="text-center max-w-md px-6">
                      <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-[18px] font-medium text-gray-900 mb-2">Map unavailable</h3>
                      <p className="text-[14px] text-gray-600 mb-4">
                        Unable to load the interactive map. Please check your connection or browse our locations below.
                      </p>
                    </div>
                  </div>
                )}

                {MAPBOX_TOKEN && (
                  <Map
                    {...viewState}
                    onMove={evt => setViewState(evt.viewState)}
                    onLoad={() => setMapLoaded(true)}
                    onError={() => setMapError(true)}
                    mapStyle="mapbox://styles/mapbox/light-v11"
                    mapboxAccessToken={MAPBOX_TOKEN}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <NavigationControl position="top-right" />
                    <GeolocateControl position="top-right" />

                    {clinicCenters.map((center) => {
                      const coords = getCenterCoords(center);
                      const tier = center.location?.tier || 2;
                      return (
                        <Marker
                          key={center.id}
                          longitude={coords.lng}
                          latitude={coords.lat}
                          anchor="bottom"
                          onClick={e => {
                            e.originalEvent.stopPropagation();
                            handleMarkerClick(center);
                          }}
                        >
                          <div className="cursor-pointer group">
                            <div className={`w-10 h-10 rounded-full ${tier === 1 ? 'bg-cyan-500' : 'bg-teal-500'} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform border-2 border-white`}>
                              <MapPin className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        </Marker>
                      );
                    })}

                    {selectedLocation && (() => {
                      const coords = getCenterCoords(selectedLocation);
                      const tier = selectedLocation.location?.tier || 2;
                      return (
                        <Popup
                          longitude={coords.lng}
                          latitude={coords.lat}
                          anchor="top"
                          onClose={() => setSelectedLocation(null)}
                          closeButton={true}
                          closeOnClick={false}
                          className="location-popup"
                          offset={15}
                          maxWidth="400px"
                        >
                          <div className="p-5 w-[340px]">
                            <div className="flex items-center gap-2 mb-3">
                              <div className={`w-1 h-6 ${tier === 1 ? 'bg-cyan-500' : 'bg-teal-500'} rounded-full`} />
                              <h3 className="font-medium text-[15px] text-gray-900">{selectedLocation.name}</h3>
                            </div>
                            <p className="text-[13px] text-gray-600 mb-3 leading-relaxed">{selectedLocation.address}</p>
                            <div className="space-y-2.5 mb-4">
                              {selectedLocation.phone && (
                                <div className="flex items-center gap-2.5 text-[13px] text-gray-700">
                                  <Phone className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                                  <a href={phoneTel(selectedLocation.phone)} className="hover:text-cyan-600">
                                    {selectedLocation.phone}
                                  </a>
                                </div>
                              )}
                              <div className="flex items-start gap-2.5 text-[13px] text-gray-700">
                                <Clock className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
                                <span className="text-[12px] leading-relaxed">Mon-Sat: 8:00 AM - 8:00 PM</span>
                              </div>
                            </div>
                            {selectedLocation.facilities?.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-4">
                                {selectedLocation.facilities.slice(0, 2).map((facility: string) => (
                                  <Badge key={facility} variant="secondary" className="text-[10px] bg-cyan-50 text-cyan-700">
                                    {facility}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            <Button size="sm" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white" asChild>
                              <Link href={`/booking?location=${selectedLocation.slug}`}>
                                Book Appointment
                              </Link>
                            </Button>
                          </div>
                        </Popup>
                      );
                    })()}
                  </Map>
                )}
              </div>

              {/* Map Legend */}
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-cyan-500" />
                    <span className="text-[13px] text-gray-600">Tier 1 (Metro)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-teal-500" />
                    <span className="text-[13px] text-gray-600">Tier 2</span>
                  </div>
                </div>
                <p className="text-[12px] text-gray-500">
                  {loading ? "Loading…" : `${clinicCenters.length} centre${clinicCenters.length === 1 ? "" : "s"} listed`}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Dark Stats Section */}
        <section className="py-20 bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute top-20 left-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-teal-500/20 rounded-full blur-[100px]" />
          
          <div className="max-w-[1200px] mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <p className="text-[13px] text-cyan-400 font-medium mb-3">Why H2H on the map</p>
              <h2 className="text-[32px] md:text-[44px] font-medium text-white tracking-tight mb-4">
                Care that fits{' '}
                <span className="text-cyan-400">real life</span>
              </h2>
              <p className="text-[15px] text-gray-400 max-w-xl mx-auto leading-relaxed">
                Numbers below come from this page&apos;s centre list and our public service map—not vanity metrics.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
              <div className="text-center lg:text-left">
                <div className="text-[44px] md:text-[48px] font-semibold text-cyan-400 mb-2 tabular-nums leading-none">
                  {loading ? "—" : clinicCenters.length}
                </div>
                <p className="text-[14px] text-gray-400">Centres listed here</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-[44px] md:text-[48px] font-semibold text-teal-400 mb-2 tabular-nums leading-none">
                  {loading ? "—" : cityCount}
                </div>
                <p className="text-[14px] text-gray-400">Cities covered</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-[44px] md:text-[48px] font-semibold text-cyan-400 mb-2 tabular-nums leading-none">
                  {CARE_VERTICALS}
                </div>
                <p className="text-[14px] text-gray-400">Care verticals (site-wide)</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-[44px] md:text-[48px] font-semibold text-teal-400 mb-2 tabular-nums leading-none">
                  {CLINIC_DAYS_PER_WEEK}
                </div>
                <p className="text-[14px] text-gray-400">Typical clinic days (Mon–Sat)</p>
              </div>
            </div>
            <p className="text-center text-[13px] text-gray-500 mt-12 max-w-2xl mx-auto">
              Toll-free:{" "}
              <a href={phoneTel(APP_CONFIG.phone)} className="text-cyan-400 hover:underline">
                {APP_CONFIG.phone}
              </a>
              {" · "}
              <a href={`mailto:${APP_CONFIG.email}`} className="text-cyan-400 hover:underline">
                {APP_CONFIG.email}
              </a>
            </p>
          </div>
        </section>

        {/* City Filter */}
        <section className="py-12 bg-white border-b border-gray-100">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-6">
              <h3 className="text-[18px] font-medium text-gray-900 mb-2">Filter by City</h3>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-6 py-2.5 rounded-full text-[14px] font-medium transition-all ${
                    selectedCity === city
                      ? 'bg-cyan-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {city === 'all' ? 'All Cities' : city}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Locations Grid */}
        <section className="py-20 bg-white relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="max-w-[1200px] mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              {/* <p className="text-[13px] text-cyan-600 font-medium mb-3">Our Centers</p> */}
              <h2 className="text-[32px] md:text-[44px] font-medium text-gray-900 tracking-tight mb-4">
                Healthcare Centers
              </h2>
              <p className="text-[15px] text-gray-500 max-w-2xl mx-auto leading-relaxed">
                Each card reflects our directory entry: address, tier, facilities, and hours. Clinicians and equipment
                vary by site—details are confirmed when you book.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                <div className="col-span-3 flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
                </div>
              ) : filteredCenters.length === 0 ? (
                <div className="col-span-3 text-center py-20 text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No centers found in this city</p>
                </div>
              ) : (
                filteredCenters.map((center) => {
                  const tier = center.location?.tier || 2;
                  const tierInfo = LOCATION_TIERS[tier as keyof typeof LOCATION_TIERS] || LOCATION_TIERS[2];
                  const isMetro = tier === 1;
                  const cityImages: Record<string, string> = {
                    'Mumbai': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800',
                    'Bangalore': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800',
                    'Delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800',
                    'Kolkata': 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800',
                    'Hyderabad': 'https://images.unsplash.com/photo-1572445271230-a78b4b5573e5?w=800',
                    'Pune': 'https://images.unsplash.com/photo-1625731226721-b4d51ae70e20?w=800',
                    'Jaipur': 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800',
                    'Chennai': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800',
                  };
                  const image = cityImages[center.location?.city || ''] || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800';
                  
                  return (
                    <div 
                      key={center.id} 
                      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 transition-all duration-300"
                    >
                      {/* Image */}
                      <div className="relative h-52 overflow-hidden">
                        <img 
                          src={image}
                          alt={center.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
                        <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[11px] font-medium ${isMetro ? 'bg-cyan-500' : 'bg-teal-500'} text-white`}>
                          {tierInfo.name}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-[20px] font-medium text-gray-900 mb-3">{center.name}</h3>
                        
                        <div className="space-y-2.5 mb-5">
                          <div className="flex items-start gap-3 text-[13px] text-gray-600">
                            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-cyan-500" />
                            <span className="leading-relaxed">{center.address}</span>
                          </div>
                          {center.phone && (
                            <div className="flex items-center gap-3 text-[13px] text-gray-600">
                              <Phone className="h-4 w-4 flex-shrink-0 text-cyan-500" />
                              <a href={phoneTel(center.phone)} className="hover:text-cyan-600 transition-colors">
                                {center.phone}
                              </a>
                            </div>
                          )}
                          <div className="flex items-center gap-3 text-[13px] text-gray-600">
                            <Clock className="h-4 w-4 flex-shrink-0 text-cyan-500" />
                            <span>Mon-Sat: 8:00 AM - 8:00 PM</span>
                          </div>
                        </div>

                        {/* Facilities */}
                        {center.facilities?.length > 0 && (
                          <div className="mb-5">
                            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-2">Facilities</p>
                            <div className="flex flex-wrap gap-1.5">
                              {center.facilities.slice(0, 3).map((facility: string) => (
                                <span key={facility} className="px-2.5 py-1 rounded-full text-[11px] bg-gray-100 text-gray-600">
                                  {facility}
                                </span>
                              ))}
                              {center.facilities.length > 3 && (
                                <span className="px-2.5 py-1 rounded-full text-[11px] bg-cyan-50 text-cyan-600">
                                  +{center.facilities.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                          <Link 
                            href={`/booking?location=${center.slug}`}
                            className="flex-1 flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-gray-900 text-white text-[13px] font-medium hover:bg-gray-800 transition-colors"
                          >
                            Book Appointment
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                          <button 
                            onClick={() => scrollToMap(center)}
                            className="h-10 w-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-cyan-600 transition-colors"
                          >
                            <Navigation2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-cyan-500 to-teal-500 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/10 rounded-full blur-[100px]" />
          
          <div className="max-w-[1200px] mx-auto px-6 text-center relative z-10">
            <h2 className="text-[32px] md:text-[44px] font-medium text-white tracking-tight mb-6">
              Can&apos;t Visit a Center?
            </h2>
            <p className="text-[16px] text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed">
              Book a video consult when online is offered for your service, or choose a centre above. Support:
              {" "}
              <a href={phoneTel(APP_CONFIG.phone)} className="font-medium underline decoration-white/40 hover:decoration-white">
                {APP_CONFIG.phone}
              </a>
              .
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="h-12 px-8 text-[14px] font-medium bg-white hover:bg-gray-100 text-gray-900 rounded-full" asChild>
                <Link href="/booking?mode=online">
                  <Video className="mr-2 h-4 w-4" />
                  Book Online Consultation
                </Link>
              </Button>
              <Button className="h-12 px-8 text-[14px] font-medium bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-full" asChild>
                <Link href="/booking">
                  <Building2 className="mr-2 h-4 w-4" />
                  Visit a Center
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
