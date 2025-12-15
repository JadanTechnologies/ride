import React, { useState, useEffect } from 'react';
import { User, VehicleType, WithdrawalRequest } from '../types';
import { CURRENCY, VEHICLE_ICONS, LAGOS_COORDS } from '../constants';
import { Navigation, Wallet, Bell, Phone, MessageSquare, ArrowRight, Zap, Lock, AlertCircle, Clock, RotateCcw, TrendingUp, History, Layers } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import * as L from 'leaflet';
import { Button } from '../components/Button';
import CollapsibleNavBar from '../components/CollapsibleNavBar';

// Fix for Leaflet import in ESM environments
const Leaflet = (L as any).default ?? L;

interface DriverPortalProps {
  user: any; // User type with Driver extension
  pricing: any;
  commissionRate: number;
  surge: number;
  dailyEarnings: number;
  history: any[];
  withdrawals: WithdrawalRequest[];
  onRideComplete: (earning: number) => void;
  onWithdraw: (amount: number) => void;
  onLogout: () => void;
  onNotify: (type: 'info' | 'success' | 'alert', message: string) => void;
}

type DriverRideStatus = 'idle' | 'en_route_pickup' | 'arrived_pickup' | 'in_progress' | 'completed';
type ViewState = 'home' | 'earnings';

// Custom Map Icons
const createDriverIcon = (rotation = 0) => {
  if (!Leaflet || !Leaflet.divIcon) return undefined;
  return Leaflet.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: #10b981; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 3px solid white; transform: rotate(${rotation}deg)"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40]
  });
};

const createPinIcon = (color: string) => {
  if (!Leaflet || !Leaflet.divIcon) return undefined;
  return Leaflet.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 2px solid white;"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

const DriverMap = ({ position, pickup, dropoff, mapView }) => {
    const map = useMap();
    useEffect(() => {
        if (!map) return;
        try {
            if (position && !isNaN(position.lat) && !isNaN(position.lng)) {
                map.flyTo([position.lat, position.lng], 15);
            }
        } catch(e) {
            console.error("Map error", e);
        }
    }, [position, map]);

    const driverIcon = createDriverIcon(45);
    const pickupIcon = createPinIcon('#fbbf24');
    const dropoffIcon = createPinIcon('#10b981');

    return (
        <>
            <TileLayer
                attribution={mapView === 'street'
                  ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  : '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                }
                url={mapView === 'street'
                  ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                }
            />
            {position && !isNaN(position.lat) && driverIcon && (
                <Marker position={[position.lat, position.lng]} icon={driverIcon}>
                </Marker>
            )}
            {pickup && !isNaN(pickup.lat) && pickupIcon && (
                <Marker position={[pickup.lat, pickup.lng]} icon={pickupIcon}>
                    <Popup>Pickup Location</Popup>
                </Marker>
            )}
            {dropoff && !isNaN(dropoff.lat) && dropoffIcon && (
                <Marker position={[dropoff.lat, dropoff.lng]} icon={dropoffIcon}>
                    <Popup>Dropoff Location</Popup>
                </Marker>
            )}
        </>
    )
}

export const DriverPortal: React.FC<DriverPortalProps> = ({ user, pricing, commissionRate, surge, dailyEarnings, history, withdrawals, onRideComplete, onWithdraw, onLogout, onNotify }) => {
  const [isOnline, setIsOnline] = useState(false);
  const [activeRequest, setActiveRequest] = useState<any | null>(null);
  const [rideStatus, setRideStatus] = useState<DriverRideStatus>('idle');
  const [currentRide, setCurrentRide] = useState<any | null>(null);
  const [viewState, setViewState] = useState<ViewState>('home');
  
  // Map State
  const [driverLocation, setDriverLocation] = useState(user.location || LAGOS_COORDS);
  const [pickupCoords, setPickupCoords] = useState<any>(null);
  const [dropoffCoords, setDropoffCoords] = useState<any>(null);
  const [mapView, setMapView] = useState<'street' | 'satellite'>('street');

  // -- Access Control for Pending/Suspended Drivers --
  if (user.status === 'Pending') {
      return (
          <div className="h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <Clock size={48} className="text-yellow-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Pending</h1>
              <p className="text-gray-500 max-w-md mb-8">
                  Thanks for signing up, {user.name}. We are currently reviewing your documents. You will be notified once your account is active.
              </p>
              <Button onClick={onLogout} variant="secondary">Log Out</Button>
          </div>
      );
  }

  if (user.status === 'Suspended') {
      return (
          <div className="h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
                  <AlertCircle size={48} className="text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Suspended</h1>
              <p className="text-gray-500 max-w-md mb-8">
                  Your account has been suspended due to policy violations. Please contact support for more information.
              </p>
              <Button onClick={onLogout} variant="secondary">Log Out</Button>
          </div>
      );
  }

  // Simulate an incoming request when online
  const toggleOnline = () => {
    setIsOnline(!isOnline);
    if (!isOnline) {
        setRideStatus('idle');
        onNotify('info', "You are now ONLINE. Searching for rides...");
        // Simulate a request coming in after a few seconds
        setTimeout(() => {
            // Calculate dynamic fare based on Admin settings + Surge
            const mockDistanceKm = 2.4;
            const p = pricing[user.vehicleType as VehicleType] || pricing[VehicleType.KEKE];
            const baseFare = p.base + (p.perKm * mockDistanceKm);
            const dynamicFare = Math.round(baseFare * surge);

            setActiveRequest({
                id: 'r-999',
                passenger: 'Chioma Adebayo',
                pickup: 'Shoprite Ikeja',
                dropoff: 'Computer Village',
                fare: dynamicFare,
                distance: `${mockDistanceKm} km`,
                rating: 4.5,
                vehicleType: user.vehicleType, // Default to user's vehicle type for matching
                avatar: 'https://picsum.photos/200/200?random=5'
            });
            // Simulate coords
            setPickupCoords({ lat: driverLocation.lat + 0.005, lng: driverLocation.lng + 0.005 });
            setDropoffCoords({ lat: driverLocation.lat - 0.01, lng: driverLocation.lng - 0.01 });
            onNotify('success', "New ride request received!");
        }, 3000);
    } else {
        setActiveRequest(null);
        setCurrentRide(null);
        setPickupCoords(null);
        setDropoffCoords(null);
        onNotify('info', "You are now OFFLINE.");
    }
  };

  const handleAcceptRide = () => {
    setCurrentRide(activeRequest);
    setActiveRequest(null);
    setRideStatus('en_route_pickup');
  };

  const handleWithdrawal = () => {
    // onNotify handled in parent for consistency with global state
    onWithdraw(dailyEarnings);
  };

  const handleRideAction = () => {
    switch (rideStatus) {
      case 'en_route_pickup':
        setRideStatus('arrived_pickup');
        // Move driver to pickup immediately (snap) for demo simplicity upon arrival check
        setDriverLocation(pickupCoords);
        onNotify('info', "Arrived at pickup location.");
        break;
      case 'arrived_pickup':
        setRideStatus('in_progress');
        onNotify('info', "Trip started.");
        break;
      case 'in_progress':
        setRideStatus('completed');
        // Move driver to dropoff immediately (snap)
        setDriverLocation(dropoffCoords);
        
        // Calculate earnings and update history
        const rideFare = currentRide.fare;
        const myCut = Math.round(rideFare * (1 - commissionRate / 100));
        
        // Call parent handler
        onRideComplete(myCut);

        setTimeout(() => {
          // Reset after completing
          setRideStatus('idle');
          setCurrentRide(null);
          setPickupCoords(null);
          setDropoffCoords(null);
          // Simulate another request coming
          if (isOnline) {
             setTimeout(() => {
                const mockDistanceKm = 1.2;
                const p = pricing[user.vehicleType as VehicleType] || pricing[VehicleType.KEKE];
                const baseFare = p.base + (p.perKm * mockDistanceKm);
                const dynamicFare = Math.round(baseFare * surge);

                setActiveRequest({
                    id: 'r-1000',
                    passenger: 'Emeka Obi',
                    pickup: 'Garki Market',
                    dropoff: 'Wuse Zone 4',
                    fare: dynamicFare,
                    distance: `${mockDistanceKm} km`,
                    rating: 4.8,
                    vehicleType: user.vehicleType,
                    avatar: 'https://picsum.photos/200/200?random=8'
                });
                setPickupCoords({ lat: driverLocation.lat + 0.003, lng: driverLocation.lng - 0.002 });
                setDropoffCoords({ lat: driverLocation.lat - 0.008, lng: driverLocation.lng + 0.005 });
                onNotify('success', "New ride request received!");
             }, 5000);
          }
        }, 4000);
        break;
    }
  };

  // Effect to simulate driver movement towards destination during active trip
  useEffect(() => {
    if (rideStatus === 'idle' || rideStatus === 'completed' || rideStatus === 'arrived_pickup') return;
    
    const target = rideStatus === 'en_route_pickup' ? pickupCoords : dropoffCoords;
    if (!target) return;

    const interval = setInterval(() => {
        setDriverLocation((prev: any) => {
            const latDiff = target.lat - prev.lat;
            const lngDiff = target.lng - prev.lng;
            
            // If close enough, don't move (waiting for user action to 'Arrive')
            if (Math.abs(latDiff) < 0.0001 && Math.abs(lngDiff) < 0.0001) return prev;

            return {
                lat: prev.lat + latDiff * 0.05, // Move 5% towards target per tick
                lng: prev.lng + lngDiff * 0.05
            };
        });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [rideStatus, pickupCoords, dropoffCoords]);

  const RequestIcon = activeRequest ? (VEHICLE_ICONS[activeRequest.vehicleType as VehicleType] || VEHICLE_ICONS.KEKE) : VEHICLE_ICONS.KEKE;

  const navItems = [
    { id: 'status', label: isOnline ? 'Go Offline' : 'Go Online', icon: <Zap size={20} />, onClick: toggleOnline },
    { id: 'earnings', label: 'Earnings', icon: <Wallet size={20} />, onClick: () => setViewState('earnings') },
    { id: 'history', label: 'Trip History', icon: <History size={20} />, onClick: () => setViewState('home') },
    { id: 'support', label: 'Support', icon: <MessageSquare size={20} />, onClick: () => {} },
  ];

  return (
    <>
      <CollapsibleNavBar
        userName={user?.name || 'Driver'}
        navItems={navItems}
        onLogout={onLogout}
        hasNotifications={false}
      />
      <div className="relative min-h-[calc(100vh-4rem)] w-full flex flex-col md:flex-row overflow-hidden bg-gray-100 md:pt-16">

       {/* Main Content Area */}
       <div className="flex-1 relative overflow-hidden">
         {viewState === 'home' ? (
             <>
                <div className="absolute inset-0 bg-gray-300 z-0">
                    <MapContainer center={[driverLocation.lat, driverLocation.lng]} zoom={15} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                        <DriverMap position={driverLocation} pickup={rideStatus !== 'idle' ? pickupCoords : null} dropoff={rideStatus === 'in_progress' ? dropoffCoords : null} mapView={mapView} />
                    </MapContainer>

                    {/* Map View Toggle */}
                    <div className="absolute top-4 right-4 z-20 bg-white rounded-lg shadow-lg border border-gray-200">
                        <button
                          onClick={() => setMapView(mapView === 'street' ? 'satellite' : 'street')}
                          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          title={`Switch to ${mapView === 'street' ? 'Satellite' : 'Street'} View`}
                        >
                          <Layers size={16} />
                          {mapView === 'street' ? 'Satellite' : 'Street'}
                        </button>
                    </div>
                </div>
                
                {/* Offline / Idle State */}
                {rideStatus === 'idle' && !activeRequest && (
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
                        <button 
                            onClick={toggleOnline}
                            className={`px-8 py-3 rounded-full font-bold shadow-xl text-lg transition-all transform hover:scale-105 ${isOnline ? 'bg-red-500 text-white' : 'bg-brand-600 text-white'}`}
                        >
                            {isOnline ? 'GO OFFLINE' : 'GO ONLINE'}
                        </button>
                    </div>
                )}

                {/* Incoming Request Card */}
                {activeRequest && rideStatus === 'idle' && (
                    <div className="absolute bottom-6 left-4 right-4 md:left-1/2 md:transform md:-translate-x-1/2 md:w-[400px] bg-white rounded-2xl shadow-2xl p-6 animate-in slide-in-from-bottom-20 z-20">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-brand-50 rounded-lg text-brand-600">
                                    <RequestIcon size={24} />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">New Request</span>
                                    <h2 className="text-2xl font-bold mt-0.5">{CURRENCY}{activeRequest.fare}</h2>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-medium text-gray-500">{activeRequest.distance}</span>
                                <div className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded mt-1">
                                    ★ {activeRequest.rating}
                                </div>
                            </div>
                        </div>

                        {surge > 1 && (
                            <div className="mb-4 bg-purple-50 text-purple-700 p-2 rounded text-xs font-bold flex items-center justify-center gap-1">
                                <Zap size={14} className="fill-current"/> High Demand! {surge}x Surge Pricing Applied
                            </div>
                        )}

                        <div className="space-y-4 mb-6 relative">
                            <div className="absolute left-[9px] top-3 bottom-3 w-0.5 bg-gray-200 -z-10"></div>
                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full bg-gray-200 border-4 border-white shadow-sm shrink-0 mt-1"></div>
                                <div>
                                    <p className="text-xs text-gray-500">PICKUP</p>
                                    <p className="font-semibold text-gray-800">{activeRequest.pickup}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full bg-brand-500 border-4 border-white shadow-sm shrink-0 mt-1"></div>
                                <div>
                                    <p className="text-xs text-gray-500">DROPOFF</p>
                                    <p className="font-semibold text-gray-800">{activeRequest.dropoff}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setActiveRequest(null)} className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl">Decline</button>
                            <button onClick={handleAcceptRide} className="flex-[2] py-3 bg-brand-600 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 hover:bg-brand-700">Accept Ride</button>
                        </div>
                    </div>
                )}
                
                {/* Active Ride UI - Kept same logic, just showing map in background */}
                {rideStatus !== 'idle' && currentRide && (
                    <>
                    <div className="absolute top-4 left-4 right-4 bg-slate-800 text-white p-4 rounded-xl shadow-lg z-20">
                        <div className="flex items-start gap-4">
                            <Navigation className="w-8 h-8 text-white mt-1" />
                            <div>
                                <h2 className="text-lg font-bold">
                                {rideStatus === 'en_route_pickup' ? `Pick up ${currentRide.passenger}` : 
                                    rideStatus === 'in_progress' ? `Drop off at ${currentRide.dropoff}` : 
                                    rideStatus === 'arrived_pickup' ? 'Waiting for passenger...' : 'Trip Completed'}
                                </h2>
                                <p className="text-slate-300 text-sm">
                                {rideStatus === 'en_route_pickup' ? currentRide.pickup : 
                                    rideStatus === 'in_progress' ? '2.4 km remaining' : ''}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* ... (rest of the active ride UI) */}
                    <div className="absolute bottom-0 w-full bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 z-20 animate-in slide-in-from-bottom-20">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <img src={currentRide.avatar} alt="Passenger" className="w-12 h-12 rounded-full" />
                                <div>
                                <h3 className="font-bold text-lg">{currentRide.passenger}</h3>
                                <span className="text-sm text-gray-500">Cash Trip • {CURRENCY}{currentRide.fare}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-3 bg-gray-100 rounded-full text-brand-600"><Phone size={20}/></button>
                                <button className="p-3 bg-gray-100 rounded-full text-brand-600"><MessageSquare size={20}/></button>
                            </div>
                        </div>

                        {rideStatus === 'completed' ? (
                            <div className="text-center py-4 space-y-4">
                                <div>
                                    <p className="text-gray-500 text-sm">Total Fare</p>
                                    <h3 className="text-3xl font-bold text-gray-900">{CURRENCY}{currentRide.fare}</h3>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Platform Commission ({commissionRate}%)</span>
                                        <span className="text-red-600 font-medium">-{CURRENCY}{Math.round(currentRide.fare * (commissionRate / 100))}</span>
                                    </div>
                                    <div className="flex justify-between font-bold pt-2 border-t border-gray-200">
                                        <span className="text-gray-800">Your Earning</span>
                                        <span className="text-green-600">{CURRENCY}{Math.round(currentRide.fare * (1 - commissionRate / 100))}</span>
                                    </div>
                                </div>
                                <Button className="w-full" onClick={handleRideAction}>Confirm & Return to Online</Button>
                            </div>
                        ) : (
                            <Button 
                                className={`w-full py-4 text-lg ${rideStatus === 'en_route_pickup' ? 'bg-brand-600' : 'bg-green-600 hover:bg-green-700'}`} 
                                onClick={handleRideAction}
                            >
                                {rideStatus === 'en_route_pickup' ? 'Arrived at Pickup' : 
                                rideStatus === 'arrived_pickup' ? 'Start Trip' : 
                                'Complete Trip'}
                            </Button>
                        )}
                    </div>
                    </>
                )}
             </>
         ) : (
             <div className="p-6 bg-gray-50 h-full overflow-y-auto">
                 {/* Earnings view content - Kept same */}
                 <div className="max-w-md mx-auto">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                        <p className="text-gray-500 text-sm mb-1">Total Balance</p>
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">{CURRENCY}{dailyEarnings.toLocaleString()}</h2>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-xs text-gray-500">Today</p>
                                <p className="text-xl font-bold text-brand-600">{CURRENCY}{dailyEarnings.toLocaleString()}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-xs text-gray-500">This Week</p>
                                <p className="text-xl font-bold text-gray-900">{CURRENCY}42,000</p>
                            </div>
                        </div>

                        <Button className="w-full" onClick={handleWithdrawal} disabled={dailyEarnings <= 0}>
                            {dailyEarnings > 0 ? 'Request Withdrawal' : 'No Funds to Withdraw'}
                        </Button>
                    </div>
                    {/* ... Rest of earnings UI */}
                 </div>
             </div>
         )}
       </div>
      </div>
    </>
  );
};