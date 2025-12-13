import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Satellite, Map as MapIcon } from 'lucide-react';
import * as L from 'leaflet';
import { LAGOS_COORDS } from '../constants';
import { VehicleType } from '../types';

const Leaflet = (L as any).default ?? L;

interface Driver {
  id: string | number;
  name: string;
  vehicle: string;
  status: string;
  rating: number;
  location: { lat: number; lng: number };
  plate?: string;
  picture?: string;
}

interface User {
  id: string | number;
  name: string;
  status: string;
  location: { lat: number; lng: number };
}

interface AdminMapViewProps {
  drivers: Driver[];
  users: User[];
}

const createIcon = (type: VehicleType | 'USER') => {
  if (!Leaflet || !Leaflet.divIcon) return undefined;

  let color = '#10b981';
  let iconHtml = '';

  if (type === VehicleType.KEKE) { color = '#f59e0b'; iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>'; }
  else if (type === VehicleType.OKADA) { color = '#ef4444'; iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>'; }
  else if (type === VehicleType.BUS) { color = '#3b82f6'; iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="17" cy="18" r="2"/></svg>'; }
  else { // User
    color = '#111827';
    iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
  }

  return Leaflet.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 2px solid white;">${iconHtml}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  });
};

export const AdminMapView: React.FC<AdminMapViewProps> = ({ drivers, users }) => {
  const [mapType, setMapType] = useState<'osm' | 'satellite'>('osm');

  const tileUrl = mapType === 'osm' 
    ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-[80vh] relative z-0">
      {/* Map Type Toggle */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => setMapType('osm')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            mapType === 'osm'
              ? 'bg-brand-600 text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <MapIcon size={18} />
          Map
        </button>
        <button
          onClick={() => setMapType('satellite')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            mapType === 'satellite'
              ? 'bg-brand-600 text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Satellite size={18} />
          Satellite
        </button>
      </div>

      <MapContainer center={[LAGOS_COORDS.lat, LAGOS_COORDS.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution={mapType === 'osm' ? '&copy; OpenStreetMap contributors' : '&copy; Esri'}
          url={tileUrl}
        />
        
        {/* Driver Markers */}
        {drivers.map(d => {
          const icon = createIcon(d.vehicle === 'Keke' ? VehicleType.KEKE : d.vehicle === 'Okada' ? VehicleType.OKADA : VehicleType.BUS);
          if (!icon) return null;
          return (
            <Marker 
              key={`driver-${d.id}`} 
              position={[d.location.lat, d.location.lng]}
              icon={icon}
            >
              <Popup>
                <div className="w-60">
                  {d.picture && (
                    <img src={d.picture} alt={d.name} className="w-full h-32 object-cover rounded mb-2" />
                  )}
                  <h4 className="font-bold text-lg">{d.name}</h4>
                  <div className="mt-2 space-y-1 text-sm">
                    <p><span className="font-semibold">Vehicle:</span> {d.vehicle}</p>
                    {d.plate && <p><span className="font-semibold">Plate:</span> {d.plate}</p>}
                    <p><span className="font-semibold">Status:</span> <span className={`px-2 py-0.5 rounded text-xs font-bold ${d.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{d.status}</span></p>
                    <p><span className="font-semibold">Rating:</span> {d.rating} ★</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* User Markers */}
        {users.filter(u => u.status === 'Active').map(u => {
          const icon = createIcon('USER');
          if (!icon) return null;
          return (
            <Marker 
              key={`user-${u.id}`} 
              position={[u.location.lat, u.location.lng]}
              icon={icon}
            >
              <Popup>
                <div className="p-2">
                  <h4 className="font-bold">{u.name}</h4>
                  <p className="text-sm">Passenger</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default AdminMapView;
