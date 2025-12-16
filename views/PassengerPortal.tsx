import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Clock, CreditCard, Star, Menu, Phone, MessageSquare, X, CheckCircle, Wallet, Plus, Zap, Share2, Timer, Map as MapIcon, History, Settings } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import * as L from 'leaflet';
import { Ride, VehicleType } from '../types';
import { VEHICLE_ICONS, CURRENCY, LAGOS_COORDS } from '../constants';
import { Button } from '../components/Button';
import CollapsibleNavBar from '../components/CollapsibleNavBar';
import { PanicButton } from '../components/PanicButton';
import { estimateTripDetails } from '../services/geminiService';

// Robust fix for Leaflet import in various ESM environments
const Leaflet = (L as any).default || L;

interface PassengerPortalProps {
    user: any;
    pricing: any;
    surge: number;
    history: any[];
    onRideComplete: (ride: any) => void;
    onLogout: () => void;
    onNotify: (type: 'info' | 'success' | 'alert', message: string) => void;
}

type TripStatus = 'searching' | 'arriving' | 'arrived' | 'in_progress' | 'completed';

// Custom Icons for Map
const createMapIcon = (type: 'user' | 'keke' | 'okada' | 'bus' | 'destination', rotation = 0) => {
    if (!Leaflet || !Leaflet.divIcon) return null;

    let color = '#10b981';
    let iconHtml = '';

    if (type === 'keke') { color = '#f59e0b'; iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>'; }
    else if (type === 'okada') { color = '#ef4444'; iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>'; }
    else if (type === 'bus') { color = '#3b82f6'; iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="17" cy="18" r="2"/></svg>'; }
    else if (type === 'destination') { color = '#dc2626'; iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>'; }
    else { // User
        color = '#111827';
        iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
    }

    const isVehicle = ['keke', 'okada', 'bus'].includes(type);
    const pointerHtml = isVehicle ?
        `<div style="position: absolute; top: -4px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-bottom: 6px solid ${color};"></div>`
        : '';

    try {
        return Leaflet.divIcon({
            className: 'custom-icon',
            html: `
            <div style="position: relative; width: 36px; height: 36px; transform: rotate(${rotation}deg); transition: transform 0.5s linear;">
                ${pointerHtml}
                <div style="background-color: ${color}; width: 100%; height: 100%; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 2px solid white; transform: rotate(-${rotation}deg);">
                    ${iconHtml}
                </div>
            </div>
          `,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
            popupAnchor: [0, -20]
        });
    } catch (e) {
        console.error("Error creating icon", e);
        return null;
    }
};

const MapComponent = ({ userLocation, drivers, assignedDriver, destination }) => {
    const map = useMap();
    useEffect(() => {
        if (!map) return;
        try {
            if (assignedDriver && !isNaN(assignedDriver.lat) && !isNaN(assignedDriver.lng)) {
                map.flyTo([assignedDriver.lat, assignedDriver.lng], 15);
            } else if (userLocation && !isNaN(userLocation.lat) && !isNaN(userLocation.lng)) {
                map.flyTo([userLocation.lat, userLocation.lng], 14);
            }
        } catch (e) {
            console.error("Map flyTo error:", e);
        }
    }, [userLocation, assignedDriver, map]);

    const userIcon = createMapIcon('user');
    const destIcon = createMapIcon('destination');

    return (
        <>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {userLocation && !isNaN(userLocation.lat) && userIcon && (
                <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                    <Popup>Your Location</Popup>
                </Marker>
            )}

            {assignedDriver && !isNaN(assignedDriver.lat) && (
                <Marker
                    position={[assignedDriver.lat, assignedDriver.lng]}
                    icon={createMapIcon(assignedDriver.type.toLowerCase(), assignedDriver.heading || 0) || userIcon}
                >
                    <Popup>Your Driver</Popup>
                </Marker>
            )}

            {!assignedDriver && drivers.map((d: any) => {
                const icon = createMapIcon(d.type.toLowerCase(), d.heading);
                if (!icon) return null;
                return (
                    <Marker key={d.id} position={[d.lat, d.lng]} icon={icon}>
                        <Popup>
                            <div className="text-center p-1">
                                <span className="font-bold block text-sm capitalize">{d.type}</span>
                                <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">Available</span>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}

            {destination && !isNaN(destination.lat) && destIcon && (
                <Marker position={[destination.lat, destination.lng]} icon={destIcon}>
                    <Popup>Destination</Popup>
                </Marker>
            )}
        </>
    );
};


export const PassengerPortal: React.FC<PassengerPortalProps> = ({ user, pricing, surge, history, onRideComplete, onLogout, onNotify }) => {
    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState<VehicleType | null>(null);
    const [viewState, setViewState] = useState<'booking' | 'trip' | 'history' | 'wallet'>('booking');
    const [bookingStep, setBookingStep] = useState<'input' | 'estimating' | 'confirm'>('input');

    const [tripStatus, setTripStatus] = useState<TripStatus>('searching');
    const [estimatedRide, setEstimatedRide] = useState<Partial<Ride> | null>(null);
    const [tripProgress, setTripProgress] = useState(0);

    const [userLocation] = useState(user?.location || LAGOS_COORDS);
    const [destinationLocation, setDestinationLocation] = useState<any>(null);
    const [nearbyDrivers, setNearbyDrivers] = useState<any[]>([]);
    const [assignedDriverPos, setAssignedDriverPos] = useState<any>(null);

    const [walletBalance, setWalletBalance] = useState(user?.walletBalance || 0);

    const rideTimers = useRef<any[]>([]);
    const progressInterval = useRef<any>(null);

    useEffect(() => {
        if (!userLocation) return;

        const types = ['Keke', 'Okada', 'Bus'];
        const fakeDrivers = Array.from({ length: 8 }).map((_, i) => ({
            id: i,
            lat: userLocation.lat + (Math.random() - 0.5) * 0.02,
            lng: userLocation.lng + (Math.random() - 0.5) * 0.02,
            type: types[i % 3],
            heading: Math.random() * 360,
            speed: 0.0001 + Math.random() * 0.0002
        }));
        setNearbyDrivers(fakeDrivers);

        const interval = setInterval(() => {
            setNearbyDrivers(prev => prev.map(d => {
                const headingChange = (Math.random() - 0.5) * 30;
                const newHeading = (d.heading + headingChange + 360) % 360;
                const rad = newHeading * (Math.PI / 180);
                const newLat = d.lat + Math.cos(rad) * d.speed;
                const newLng = d.lng + Math.sin(rad) * d.speed;

                return {
                    ...d,
                    lat: newLat,
                    lng: newLng,
                    heading: newHeading
                };
            }));
        }, 1000);
        return () => clearInterval(interval);
    }, [userLocation]);

    useEffect(() => {
        if (user) {
            setWalletBalance(user.walletBalance);
        }
    }, [user]);

    useEffect(() => {
        return () => clearSimulation();
    }, []);

    const clearSimulation = () => {
        rideTimers.current.forEach(timer => clearTimeout(timer));
        rideTimers.current = [];
        if (progressInterval.current) {
            clearInterval(progressInterval.current);
            progressInterval.current = null;
        }
    };

    const handleEstimateFare = async () => {
        if (!pickup || !dropoff) return;
        setBookingStep('estimating');

        setDestinationLocation({
            lat: userLocation.lat + 0.02,
            lng: userLocation.lng + 0.02
        });

        const details = await estimateTripDetails(pickup, dropoff);
        const dist = details?.distance || "6.5 km";
        const dur = details?.duration || "25 mins";
        const distVal = parseFloat(dist.split(' ')[0]) || 5;

        setEstimatedRide({
            pickupAddress: pickup,
            dropoffAddress: dropoff,
            distance: dist,
            duration: dur,
            fare: distVal
        });
        setBookingStep('confirm');
    };

    const calculateFare = (type: VehicleType, distVal: number) => {
        const p = pricing[type];
        const basePrice = p.base + (p.perKm * distVal);
        return Math.round(basePrice * surge);
    };

    const handleBookRide = () => {
        setViewState('trip');
        setTripStatus('searching');
        setTripProgress(0);
        clearSimulation();

        const driverStartPos = {
            lat: userLocation.lat - 0.005,
            lng: userLocation.lng - 0.005,
            type: selectedVehicle || 'Keke',
            heading: 45
        };
        setAssignedDriverPos(null);

        const t1 = setTimeout(() => {
            setTripStatus('arriving');
            setAssignedDriverPos(driverStartPos);
        }, 3000);

        const t2 = setTimeout(() => {
            setTripStatus('arrived');
            setAssignedDriverPos(userLocation);
            onNotify('info', "Your driver has arrived!");
        }, 8000);

        const t3 = setTimeout(() => {
            setTripStatus('in_progress');
            let progress = 0;
            if (progressInterval.current) clearInterval(progressInterval.current);

            progressInterval.current = setInterval(() => {
                progress += 5;
                setTripProgress(progress);

                setAssignedDriverPos((prev: any) => {
                    if (!prev || !destinationLocation) return prev;
                    const latDiff = destinationLocation.lat - userLocation.lat;
                    const lngDiff = destinationLocation.lng - userLocation.lng;
                    const angleRad = Math.atan2(lngDiff, latDiff);
                    const angleDeg = (angleRad * 180 / Math.PI + 360) % 360;

                    return {
                        ...prev,
                        lat: prev.lat + latDiff * 0.05,
                        lng: prev.lng + lngDiff * 0.05,
                        heading: angleDeg
                    };
                });

                if (progress >= 100) {
                    if (progressInterval.current) clearInterval(progressInterval.current);
                }
            }, 800);
        }, 12000);

        const t4 = setTimeout(() => setTripStatus('completed'), 28000);

        rideTimers.current = [t1, t2, t3, t4];
    };

    const handleCancelRide = () => {
        clearSimulation();
        resetRide(false);
        onNotify('info', "Ride request cancelled.");
    };

    const resetRide = (saveToHistory = false) => {
        clearSimulation();

        if (saveToHistory && estimatedRide && selectedVehicle) {
            const fare = calculateFare(selectedVehicle, estimatedRide.fare || 5);
            const newRide = {
                id: Date.now().toString(),
                pickup: estimatedRide.pickupAddress,
                dropoff: estimatedRide.dropoffAddress,
                date: 'Just Now',
                price: fare,
                status: 'Completed',
                vehicle: selectedVehicle
            };
            onRideComplete(newRide);
            onNotify('success', `Ride completed! Paid ${CURRENCY}${fare}`);
        }

        setViewState('booking');
        setBookingStep('input');
        setPickup('');
        setDropoff('');
        setSelectedVehicle(null);
        setTripStatus('searching');
        setTripProgress(0);
        setAssignedDriverPos(null);
        setDestinationLocation(null);
    };

    const handleShareRide = () => {
        onNotify('success', "Ride details copied to clipboard!");
    };

    if (!Leaflet) return <div className="flex items-center justify-center h-full">Loading Maps...</div>;

    const navItems = [
        { id: 'booking', label: 'Book a Ride', icon: <Navigation size={20} />, onClick: () => setViewState('booking') },
        { id: 'history', label: 'History', icon: <History size={20} />, onClick: () => setViewState('history') },
        { id: 'wallet', label: 'Wallet', icon: <Wallet size={20} />, onClick: () => setViewState('wallet') },
        { id: 'support', label: 'Support', icon: <MessageSquare size={20} />, onClick: () => { } },
    ];

    return (
        <>
            <CollapsibleNavBar
                userName={user?.name || 'Guest'}
                navItems={navItems}
                onLogout={onLogout}
                hasNotifications={false}
            />

            <div className="relative min-h-[calc(100vh-4rem)] w-full flex flex-col md:flex-row overflow-hidden bg-gray-100 pt-16 md:pl-64">
                {/* Map Section */}
                <div className="flex-1 relative h-full z-0">
                    {userLocation && !isNaN(userLocation.lat) ? (
                        <MapContainer key={`${userLocation.lat}-${userLocation.lng}`} center={[userLocation.lat, userLocation.lng]} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                            <MapComponent
                                userLocation={userLocation}
                                drivers={nearbyDrivers}
                                assignedDriver={assignedDriverPos}
                                destination={destinationLocation}
                            />
                        </MapContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full bg-gray-200">
                            <p className="text-gray-500">Loading Map...</p>
                        </div>
                    )}
                </div>

                <div className="absolute bottom-0 md:top-4 md:right-4 md:bottom-auto w-full md:w-[420px] z-30 transition-all duration-300">
                    {viewState === 'booking' && (
                        <div className="bg-white md:rounded-2xl shadow-2xl p-6 max-h-[85vh] overflow-y-auto">
                            {bookingStep === 'input' && (
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Get a ride</h3>
                                    <div className="relative">
                                        <div className="absolute left-3 top-3.5 text-brand-600"><MapPin size={20} /></div>
                                        <input
                                            value={pickup}
                                            onChange={(e) => setPickup(e.target.value)}
                                            placeholder="Pickup Location"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                                        />
                                    </div>
                                    <div className="relative">
                                        <div className="absolute left-3 top-3.5 text-gray-800"><Navigation size={20} /></div>
                                        <input
                                            value={dropoff}
                                            onChange={(e) => setDropoff(e.target.value)}
                                            placeholder="Where to?"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                                        />
                                    </div>
                                    <Button
                                        className="w-full mt-4"
                                        onClick={handleEstimateFare}
                                        disabled={!pickup || !dropoff}
                                    >
                                        Check Fares
                                    </Button>
                                </div>
                            )}

                            {bookingStep === 'estimating' && (
                                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                                    <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-gray-500 font-medium">Calculating best route...</p>
                                </div>
                            )}

                            {bookingStep === 'confirm' && (
                                <div className="space-y-4 animate-in slide-in-from-right fade-in duration-300">
                                    <div className="flex items-center justify-between mb-2">
                                        <button onClick={() => setBookingStep('input')} className="text-sm text-gray-500 hover:text-gray-900 font-medium">← Back</button>
                                        <span className="text-xs font-bold bg-brand-50 text-brand-700 px-3 py-1 rounded-full">{estimatedRide?.distance} • {estimatedRide?.duration}</span>
                                    </div>

                                    {surge > 1 && (
                                        <div className="bg-purple-50 p-3 rounded-lg flex items-center justify-center gap-2 mb-2 animate-pulse">
                                            <Zap className="w-4 h-4 text-purple-600 fill-current" />
                                            <span className="text-sm font-bold text-purple-700">Surge Pricing Active (x{surge})</span>
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        {[VehicleType.KEKE, VehicleType.OKADA, VehicleType.BUS].map((type) => {
                                            if (!pricing[type]?.isActive) return null;
                                            const Icon = VEHICLE_ICONS[type];
                                            const price = calculateFare(type, estimatedRide?.fare as number);
                                            return (
                                                <div
                                                    key={type}
                                                    onClick={() => setSelectedVehicle(type)}
                                                    className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${selectedVehicle === type ? 'border-brand-600 bg-brand-50 shadow-sm' : 'border-gray-100 hover:border-gray-200'}`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-2 rounded-full ${selectedVehicle === type ? 'bg-white' : 'bg-gray-100'}`}>
                                                            <Icon className="w-8 h-8 text-gray-800" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-gray-900 capitalize">{type.toLowerCase()}</h4>
                                                            <p className="text-xs text-gray-500">Arrives in 4 mins</p>
                                                        </div>
                                                    </div>
                                                    <span className="font-bold text-lg">{CURRENCY}{price}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="flex gap-4 mt-6">
                                        <div className="flex-1 flex items-center gap-2 p-3 bg-gray-50 rounded-lg cursor-pointer border border-transparent hover:border-gray-200">
                                            <CreditCard className="w-5 h-5 text-gray-500" />
                                            <span className="text-sm font-medium">Cash</span>
                                        </div>
                                        <div className="flex-1 flex items-center gap-2 p-3 bg-gray-50 rounded-lg cursor-pointer border border-transparent hover:border-gray-200 text-gray-400">
                                            <span className="text-sm">Promo Code</span>
                                        </div>
                                    </div>
                                    <Button className="w-full" disabled={!selectedVehicle} onClick={handleBookRide}>
                                        Confirm {selectedVehicle ? selectedVehicle.toLowerCase() : 'Ride'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ... Rest of components (trip, history, wallet) identical to previous input ... */}
                    {viewState === 'trip' && (
                        <div className="bg-white md:rounded-2xl shadow-2xl overflow-hidden">
                            {tripStatus === 'searching' && (
                                <div className="p-8 flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-300">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-brand-500 rounded-full animate-ping opacity-20"></div>
                                        <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center relative z-10">
                                            <Navigation className="w-8 h-8 text-brand-600" />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-lg font-bold">Connecting you...</h3>
                                        <p className="text-gray-500 text-sm mt-1">Finding the nearest available driver</p>
                                    </div>
                                    <div className="w-full pt-4">
                                        <Button variant="danger" className="w-full py-3 text-lg font-bold shadow-md" onClick={handleCancelRide}>
                                            Cancel Request
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {(tripStatus === 'arriving' || tripStatus === 'arrived' || tripStatus === 'in_progress') && (
                                <div className="animate-in slide-in-from-bottom duration-500">
                                    <div className="bg-slate-900 text-white p-4">
                                        <h3 className="text-lg font-bold text-center">
                                            {tripStatus === 'arriving' && 'Driver is arriving'}
                                            {tripStatus === 'arrived' && 'Driver is here'}
                                            {tripStatus === 'in_progress' && 'Heading to Destination'}
                                        </h3>
                                        <p className="text-center text-slate-400 text-sm">
                                            {tripStatus === 'arriving' && '3 mins away'}
                                            {tripStatus === 'arrived' && 'Please meet at pickup'}
                                            {tripStatus === 'in_progress' && 'Sit back and relax'}
                                        </p>
                                    </div>
                                    <div className="p-6">
                                        {tripStatus === 'in_progress' && (
                                            <div className="bg-brand-50 border border-brand-100 p-4 rounded-xl mb-6 flex items-center justify-between shadow-sm animate-in zoom-in duration-300">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-brand-100 text-brand-700 rounded-full">
                                                        <Timer size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-brand-600 font-bold uppercase tracking-wider">Estimated Arrival</p>
                                                        <div className="flex items-baseline gap-2">
                                                            <p className="text-2xl font-bold text-brand-900">
                                                                {Math.max(1, Math.ceil((parseInt(estimatedRide?.duration || "15") || 15) * (1 - tripProgress / 100)))} mins
                                                            </p>
                                                            <span className="text-sm text-brand-700 font-medium bg-brand-100 px-2 py-0.5 rounded">
                                                                {(() => {
                                                                    const minsRemaining = Math.max(1, Math.ceil((parseInt(estimatedRide?.duration || "15") || 15) * (1 - tripProgress / 100)));
                                                                    const arrivalTime = new Date(Date.now() + minsRemaining * 60000);
                                                                    return arrivalTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
                                                                })()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center justify-end gap-1 text-gray-500 mb-1">
                                                        <MapIcon size={14} />
                                                        <span className="text-xs">Distance Left</span>
                                                    </div>
                                                    <p className="font-bold text-gray-800 text-lg">
                                                        {((parseFloat(estimatedRide?.distance?.split(' ')[0] || "2.5") || 2.5) * (1 - tripProgress / 100)).toFixed(1)} km
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-4 mb-6">
                                            <img src="https://picsum.photos/200/200?random=2" alt="Driver" className="w-16 h-16 rounded-full object-cover ring-2 ring-brand-100" />
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg">Ibrahim Musa</h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                                    <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded text-yellow-700 font-medium">
                                                        <Star className="w-3 h-3 fill-current" /> 4.9
                                                    </div>
                                                    <span className="text-gray-300">|</span>
                                                    <span className="font-medium text-gray-900">ABJ-492-KL</span>
                                                    <span className="text-gray-300">|</span>
                                                    <span className="capitalize">{selectedVehicle?.toLowerCase()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 mb-6">
                                            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium text-gray-700"><Phone size={18} /> Call</button>
                                            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium text-gray-700"><MessageSquare size={18} /> Chat</button>
                                            <button onClick={handleShareRide} className="flex-none flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium text-gray-700"><Share2 size={18} /></button>
                                        </div>
                                        {tripStatus === 'in_progress' && (
                                            <div className="mb-4">
                                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-brand-500 transition-all duration-1000 ease-linear" style={{ width: `${tripProgress}%` }}></div>
                                                </div>
                                                <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                                                    <span>Pickup</span>
                                                    <span>Dropoff</span>
                                                </div>
                                            </div>
                                        {tripStatus === 'arriving' && (
                                            <Button variant="danger" className="w-full py-3 text-lg font-bold shadow-md" onClick={handleCancelRide}>Cancel Ride</Button>
                                        )}

                                        <div className="mt-8 flex justify-center">
                                            <PanicButton onPanic={() => onNotify('alert', 'EMERGENCY ALERT SENT to your contacts and security team!')} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {tripStatus === 'completed' && (
                                <div className="p-8 text-center animate-in zoom-in duration-300">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="w-10 h-10 text-green-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">You arrived!</h2>
                                    <p className="text-gray-500 mb-8">Hope you enjoyed your ride with Ibrahim.</p>
                                    <div className="bg-gray-50 rounded-xl p-4 mb-8">
                                        <p className="text-sm text-gray-500 mb-1">Total Fare</p>
                                        <p className="text-3xl font-bold text-gray-900">{CURRENCY}{calculateFare(selectedVehicle || VehicleType.KEKE, estimatedRide?.fare || 5)}</p>
                                    </div>
                                    <div className="flex justify-center gap-2 mb-8">
                                        {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-8 h-8 text-yellow-400 fill-current cursor-pointer hover:scale-110 transition-transform" />)}
                                    </div>
                                    <Button className="w-full" onClick={() => resetRide(true)}>Done</Button>
                                </div>
                            )}
                        </div>
                    )}

                    {viewState === 'history' && (
                        <div className="bg-white md:rounded-2xl shadow-2xl h-[600px] flex flex-col">
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-bold text-lg">Your Trips</h3>
                                <button onClick={() => setViewState('booking')} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {history.length === 0 ? <div className="text-center py-10 text-gray-500">No rides yet.</div> : history.map((ride) => {
                                    const Icon = VEHICLE_ICONS[ride.vehicle as VehicleType] || VEHICLE_ICONS.KEKE;
                                    return (
                                        <div key={ride.id} className="flex items-start justify-between p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-shadow">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-gray-50 rounded-lg"><Icon size={20} className="text-gray-600" /></div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900">{ride.pickup} to {ride.dropoff}</h4>
                                                    <p className="text-sm text-gray-500 mt-1 capitalize">{ride.date} • {ride.vehicle?.toLowerCase()}</p>
                                                    <div className="flex items-center gap-1 mt-2">
                                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                        <span className="text-xs font-medium text-gray-600">{ride.status}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="font-bold text-gray-900">{CURRENCY}{ride.price}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {viewState === 'wallet' && (
                        <div className="bg-white md:rounded-2xl shadow-2xl h-[600px] flex flex-col">
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-bold text-lg">Wallet</h3>
                                <button onClick={() => setViewState('booking')} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
                            </div>
                            <div className="p-6">
                                <div className="bg-brand-600 rounded-2xl p-6 text-white shadow-xl mb-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-10"><Wallet size={100} /></div>
                                    <p className="text-brand-100 text-sm mb-1">Available Balance</p>
                                    <h2 className="text-3xl font-bold mb-6">{CURRENCY}{walletBalance.toLocaleString()}</h2>
                                    <button onClick={() => setWalletBalance(b => b + 5000)} className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 backdrop-blur-sm transition-colors"><Plus size={16} /> Add Funds</button>
                                </div>
                                <h4 className="font-bold text-gray-800 mb-4">Recent Transactions</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600"><Plus size={14} /></div>
                                            <div>
                                                <p className="font-medium text-sm">Wallet Top-up</p>
                                                <p className="text-xs text-gray-500">Today, 9:00 AM</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-green-600">+{CURRENCY}5,000</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600"><Navigation size={14} /></div>
                                            <div>
                                                <p className="font-medium text-sm">Ride Payment</p>
                                                <p className="text-xs text-gray-500">Yesterday</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-gray-900">-{CURRENCY}450</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};