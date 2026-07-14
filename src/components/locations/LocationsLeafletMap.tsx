'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Phone, Clock, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export type MapClinicCenter = {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string | null;
  facilities: string[];
  location?: {
    city?: string;
    tier?: number;
  };
};

type Coords = { lat: number; lng: number };

type LocationsLeafletMapProps = {
  centers: MapClinicCenter[];
  getCoords: (center: MapClinicCenter) => Coords;
  selectedId: string | null;
  onSelect: (center: MapClinicCenter | null) => void;
  view: { latitude: number; longitude: number; zoom: number };
  /** Required — Mapbox-only tiles (no OSM / other providers). */
  mapboxToken: string;
};

function FlyToView({
  latitude,
  longitude,
  zoom,
}: {
  latitude: number;
  longitude: number;
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([latitude, longitude], zoom, { duration: 0.75 });
  }, [map, latitude, longitude, zoom]);
  return null;
}

function pinIcon(tier: number) {
  const bg = tier === 1 ? '#06b6d4' : '#14b8a6';
  return L.divIcon({
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -36],
    html: `<div style="width:40px;height:40px;border-radius:9999px;background:${bg};border:2px solid #fff;box-shadow:0 8px 20px rgba(15,23,42,.25);display:flex;align-items:center;justify-content:center">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
    </div>`,
  });
}

function phoneTel(p: string) {
  return `tel:${p.replace(/\s/g, '')}`;
}

/**
 * Mapbox-only map via Leaflet raster tiles (light-v11).
 * Avoids Mapbox GL / WebGL while still using Mapbox styles + token exclusively.
 */
export function LocationsLeafletMap({
  centers,
  getCoords,
  selectedId,
  onSelect,
  view,
  mapboxToken,
}: LocationsLeafletMapProps) {
  if (!mapboxToken) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-100 px-6">
        <div className="max-w-md text-center">
          <MapPin className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-[18px] font-medium text-gray-900">Mapbox token missing</h3>
          <p className="text-[14px] text-gray-600">
            Set <code className="rounded bg-gray-200 px-1">NEXT_PUBLIC_MAPBOX_TOKEN</code> in{' '}
            <code className="rounded bg-gray-200 px-1">.env.local</code> and restart the dev server.
          </p>
        </div>
      </div>
    );
  }

  const tileUrl = `https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`;

  return (
    <MapContainer
      center={[view.latitude, view.longitude]}
      zoom={view.zoom}
      className="h-full w-full z-0"
      scrollWheelZoom
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> <a href="https://www.mapbox.com/map-feedback/">Improve this map</a>'
        url={tileUrl}
        tileSize={512}
        zoomOffset={-1}
        maxZoom={22}
      />
      <FlyToView latitude={view.latitude} longitude={view.longitude} zoom={view.zoom} />

      {centers.map((center) => {
        const coords = getCoords(center);
        const tier = center.location?.tier || 2;
        const open = selectedId === center.id;
        return (
          <Marker
            key={center.id}
            position={[coords.lat, coords.lng]}
            icon={pinIcon(tier)}
            eventHandlers={{
              click: () => onSelect(center),
            }}
          >
            {open && (
              <Popup
                eventHandlers={{
                  remove: () => onSelect(null),
                }}
                className="h2h-map-popup"
              >
                <div
                  className="w-[280px] max-w-[85vw] p-1 text-gray-900"
                  style={{ fontFamily: 'var(--font-poppins), system-ui, sans-serif' }}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div className={`h-6 w-1 rounded-full ${tier === 1 ? 'bg-cyan-500' : 'bg-teal-500'}`} />
                    <h3
                      className="text-[15px] font-medium text-gray-900"
                      style={{ fontFamily: 'var(--font-poppins), system-ui, sans-serif' }}
                    >
                      {center.name}
                    </h3>
                  </div>
                  <p
                    className="mb-3 text-[13px] leading-relaxed text-gray-600"
                    style={{ fontFamily: 'var(--font-poppins), system-ui, sans-serif' }}
                  >
                    {center.address}
                  </p>
                  <div className="mb-3 space-y-2">
                    {center.phone && (
                      <div
                        className="flex items-center gap-2 text-[13px] text-gray-700"
                        style={{ fontFamily: 'var(--font-poppins), system-ui, sans-serif' }}
                      >
                        <Phone className="h-4 w-4 shrink-0 text-cyan-600" />
                        <a href={phoneTel(center.phone)} className="text-cyan-700 hover:text-cyan-800">
                          {center.phone}
                        </a>
                      </div>
                    )}
                    <div
                      className="flex items-start gap-2 text-[12px] leading-relaxed text-gray-700"
                      style={{ fontFamily: 'var(--font-poppins), system-ui, sans-serif' }}
                    >
                      <Clock className="mt-0.5 h-4 w-4 shrink-0 text-cyan-600" />
                      <span>Mon-Sat: 8:00 AM - 8:00 PM</span>
                    </div>
                  </div>
                  {center.facilities?.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {center.facilities.slice(0, 2).map((facility) => (
                        <Badge
                          key={facility}
                          variant="secondary"
                          className="bg-cyan-50 text-[10px] font-medium text-cyan-700"
                          style={{ fontFamily: 'var(--font-poppins), system-ui, sans-serif' }}
                        >
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {/* Plain link — Leaflet forces blue on <a>; override with inline white */}
                  <Link
                    href={`/booking?location=${center.slug}`}
                    className="mt-1 flex h-9 w-full items-center justify-center rounded-md bg-cyan-500 text-[13px] font-medium no-underline transition-colors hover:bg-cyan-600"
                    style={{
                      color: '#ffffff',
                      fontFamily: 'var(--font-poppins), system-ui, sans-serif',
                    }}
                  >
                    Book Appointment
                  </Link>
                </div>
              </Popup>
            )}
          </Marker>
        );
      })}
    </MapContainer>
  );
}
