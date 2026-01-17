'use client';

import Link from "next/link";
import { useState, useCallback } from 'react';
import Map, { Marker, Popup, NavigationControl, GeolocateControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Highlighter } from "@/components/ui/highlighter";
import { PixelImage } from "@/components/ui/pixel-image";
import { MapPin, Phone, Mail, Clock, Navigation2, Video, Building2, Star, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { DEFAULT_LOCATIONS, LOCATION_TIERS, type Location } from "@/constants/locations";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export default function LocationsPage() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [viewState, setViewState] = useState({
    longitude: 78.9629,
    latitude: 20.5937,
    zoom: 4.2
  });
  const [selectedCity, setSelectedCity] = useState<string>('all');

  const filteredLocations = selectedCity === 'all' 
    ? DEFAULT_LOCATIONS 
    : DEFAULT_LOCATIONS.filter(loc => loc.city.toLowerCase() === selectedCity.toLowerCase());

  const cities = ['all', ...Array.from(new Set(DEFAULT_LOCATIONS.map(loc => loc.city)))];

  const handleMarkerClick = useCallback((location: Location) => {
    setSelectedLocation(location);
    setViewState(prev => ({
      ...prev,
      longitude: location.longitude,
      latitude: location.latitude,
      zoom: 12
    }));
  }, []);

  const scrollToMap = useCallback((location: Location) => {
    handleMarkerClick(location);
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
              <p className="text-[16px] text-gray-600 max-w-2xl mx-auto">
                With {DEFAULT_LOCATIONS.length}+ state-of-the-art facilities across major Indian cities, quality healthcare is always within reach.
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
              <p className="text-[15px] text-gray-600 max-w-2xl mx-auto">
                Explore our centers across India. Click on any marker to view details.
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

                    {DEFAULT_LOCATIONS.map((location) => (
                      <Marker
                        key={location.id}
                        longitude={location.longitude}
                        latitude={location.latitude}
                        anchor="bottom"
                        onClick={e => {
                          e.originalEvent.stopPropagation();
                          handleMarkerClick(location);
                        }}
                      >
                        <div className="cursor-pointer group">
                          <div className={`w-10 h-10 rounded-full ${location.tier === 1 ? 'bg-cyan-500' : 'bg-teal-500'} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform border-2 border-white`}>
                            <MapPin className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </Marker>
                    ))}

                    {selectedLocation && (
                      <Popup
                        longitude={selectedLocation.longitude}
                        latitude={selectedLocation.latitude}
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
                            <div className={`w-1 h-6 ${selectedLocation.tier === 1 ? 'bg-cyan-500' : 'bg-teal-500'} rounded-full`} />
                            <h3 className="font-medium text-[15px] text-gray-900">{selectedLocation.name}</h3>
                          </div>
                          <p className="text-[13px] text-gray-600 mb-3 leading-relaxed">{selectedLocation.address}</p>
                          <div className="space-y-2.5 mb-4">
                            <div className="flex items-center gap-2.5 text-[13px] text-gray-700">
                              <Phone className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                              <a href={`tel:${selectedLocation.phone}`} className="hover:text-cyan-600">
                                {selectedLocation.phone}
                              </a>
                            </div>
                            <div className="flex items-start gap-2.5 text-[13px] text-gray-700">
                              <Clock className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
                              <span className="text-[12px] leading-relaxed">{selectedLocation.timings}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {selectedLocation.services.slice(0, 2).map((service) => (
                              <Badge key={service} variant="secondary" className="text-[10px] bg-cyan-50 text-cyan-700">
                                {service}
                              </Badge>
                            ))}
                          </div>
                          <Button size="sm" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white" asChild>
                            <Link href={`/booking?location=${selectedLocation.id}`}>
                              Book Appointment
                            </Link>
                          </Button>
                        </div>
                      </Popup>
                    )}
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
                <p className="text-[12px] text-gray-500">{DEFAULT_LOCATIONS.length} locations across India</p>
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
              <p className="text-[13px] text-cyan-400 font-medium mb-3">Why Choose Us</p>
              <h2 className="text-[32px] md:text-[44px] font-medium text-white tracking-tight mb-4">
                Healthcare at Your{' '}
                <span className="text-cyan-400">Doorstep</span>
              </h2>
              <p className="text-[15px] text-gray-400 max-w-xl mx-auto">
                Experience world-class healthcare services across India
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-[48px] font-semibold text-cyan-400 mb-2">{DEFAULT_LOCATIONS.length}+</div>
                <p className="text-[14px] text-gray-400">Centers Across India</p>
              </div>
              <div className="text-center">
                <div className="text-[48px] font-semibold text-teal-400 mb-2">50K+</div>
                <p className="text-[14px] text-gray-400">Patients Treated</p>
              </div>
              <div className="text-center">
                <div className="text-[48px] font-semibold text-cyan-400 mb-2">100+</div>
                <p className="text-[14px] text-gray-400">Expert Therapists</p>
              </div>
              <div className="text-center">
                <div className="text-[48px] font-semibold text-teal-400 mb-2">4.9</div>
                <p className="text-[14px] text-gray-400">Average Rating</p>
              </div>
            </div>
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
              <p className="text-[15px] text-gray-500 max-w-2xl mx-auto">
                Each location is equipped with modern facilities and staffed by expert healthcare professionals.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredLocations.map((location) => {
                const tierInfo = LOCATION_TIERS[location.tier as keyof typeof LOCATION_TIERS];
                const isMetro = location.tier === 1;
                return (
                  <div 
                    key={location.id} 
                    className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 transition-all duration-300"
                  >
                    {/* Image */}
                    {location.image && (
                      <div className="relative h-52 overflow-hidden">
                        <img 
                          src={location.image}
                          alt={location.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
                        <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[11px] font-medium ${isMetro ? 'bg-cyan-500' : 'bg-teal-500'} text-white`}>
                          {tierInfo.name}
                        </div>
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-[20px] font-medium text-gray-900 mb-3">{location.name}</h3>
                      
                      <div className="space-y-2.5 mb-5">
                        <div className="flex items-start gap-3 text-[13px] text-gray-600">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-cyan-500" />
                          <span className="leading-relaxed">{location.address}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[13px] text-gray-600">
                          <Phone className="h-4 w-4 flex-shrink-0 text-cyan-500" />
                          <a href={`tel:${location.phone}`} className="hover:text-cyan-600 transition-colors">
                            {location.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-3 text-[13px] text-gray-600">
                          <Clock className="h-4 w-4 flex-shrink-0 text-cyan-500" />
                          <span>{location.timings}</span>
                        </div>
                      </div>

                      {/* Services */}
                      <div className="mb-5">
                        <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-2">Services</p>
                        <div className="flex flex-wrap gap-1.5">
                          {location.services.slice(0, 3).map((service) => (
                            <span key={service} className="px-2.5 py-1 rounded-full text-[11px] bg-gray-100 text-gray-600">
                              {service}
                            </span>
                          ))}
                          {location.services.length > 3 && (
                            <span className="px-2.5 py-1 rounded-full text-[11px] bg-cyan-50 text-cyan-600">
                              +{location.services.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                        <Link 
                          href={`/booking?location=${location.id}`}
                          className="flex-1 flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-gray-900 text-white text-[13px] font-medium hover:bg-gray-800 transition-colors"
                        >
                          Book Appointment
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                        <button 
                          onClick={() => scrollToMap(location)}
                          className="h-10 w-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-cyan-600 transition-colors"
                        >
                          <Navigation2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
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
            <p className="text-[16px] text-white/90 max-w-2xl mx-auto mb-10">
              No worries! Book an online consultation and connect with our experts from anywhere in India via video call.
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
