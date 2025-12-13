import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, CreditCard, Star, Menu, Phone, MessageSquare, X, CheckCircle, Wallet, Plus, Zap, Share2, Timer, Map } from 'lucide-react';
import { Ride, VehicleType } from '../types';
import { VEHICLE_ICONS, CURRENCY } from '../constants';
import { Button } from '../components/Button';
import { estimateTripDetails } from '../services/geminiService';

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

export const PassengerPortal: React.FC<PassengerPortalProps> = ({ user, pricing, surge, history, onRideComplete, onLogout, onNotify }) => {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType | null>(null);
  const [viewState, setViewState] = useState<'booking' | 'trip' | 'history' | 'wallet'>('booking');
  const [bookingStep, setBookingStep] = useState<'input' | 'estimating' | 'confirm'>('input');
  
  // Trip State
  const [tripStatus, setTripStatus] = useState<TripStatus>('searching');
  const [estimatedRide, setEstimatedRide] = useState<Partial<Ride> | null>(null);
  const [tripProgress, setTripProgress] = useState(0);

  // Data State
  const [walletBalance, setWalletBalance] = useState(user.walletBalance);

  // Sync wallet balance when user prop changes (e.g. after a ride)
  useEffect(() => {
    setWalletBalance(user.walletBalance);
  }, [user.walletBalance]);

  // Mock Map Background
  const MapBackground = () => (
    <div className="absolute inset-0 bg-gray-200 z-0 overflow-hidden">
      <div className="w-full h-full opacity-30 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Lagos_Island_OpenStreetMap.png')] bg-cover bg-center grayscale" />
      
      {/* Dynamic Map Elements based on state */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-brand-600 rounded-full ring-4 ring-brand-200 animate-pulse z-10"></div>
      
      {viewState === 'booking' && (
        <>
          <div className="absolute top-1/3 left-1/4 transform rotate-45 text-gray-700"><VEHICLE_ICONS.KEKE className="w-6 h-6" /></div>
          <div className="absolute bottom-1/3 right-1/4 transform -rotate-12 text-gray-700"><VEHICLE_ICONS.OKADA className="w-6 h-6" /></div>
          <div className="absolute top-2/3 left-1/2 transform rotate-12 text-gray-700"><VEHICLE_ICONS.BUS className="w-6 h-6" /></div>
        </>
      )}

      {viewState === 'trip' && tripStatus !== 'completed' && (
         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
             <div className="w-64 h-64 border-2 border-brand-500/30 rounded-full animate-ping absolute"></div>
         </div>
      )}
    </div>
  );

  const handleEstimateFare = async () => {
    if (!pickup || !dropoff) return;
    setBookingStep('estimating');
    
    // Simulate AI/API delay
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
    // Use dynamic pricing + surge
    const p = pricing[type];
    const basePrice = p.base + (p.perKm * distVal);
    return Math.round(basePrice * surge);
  };

  const handleBookRide = () => {
    setViewState('trip');
    setTripStatus('searching');
    
    // Simulation of ride lifecycle
    setTimeout(() => setTripStatus('arriving'), 3000);
    setTimeout(() => {
        setTripStatus('arrived');
        onNotify('info', "Your driver has arrived!");
    }, 8000);
    setTimeout(() => {
        setTripStatus('in_progress');
        // Simulate progress bar
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setTripProgress(progress);
            if (progress >= 100) clearInterval(interval);
        }, 800);
    }, 12000);
    setTimeout(() => setTripStatus('completed'), 20000);
  };

  const resetRide = (saveToHistory = false) => {
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
        // Call parent handler
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
  };

  const handleShareRide = () => {
    onNotify('success', "Ride details copied to clipboard!");
  };

  return (
    <div className="relative h-screen w-full flex flex-col md:flex-row overflow-hidden bg-gray-100">
      {/* Sidebar / Mobile Menu */}
      <div className="absolute top-0 left-0 w-full md:w-auto p-4 z-20 flex justify-between items-start pointer-events-none md:pointer-events-auto">
        <button className="bg-white p-2 rounded-full shadow-lg pointer-events-auto md:hidden">
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden md:flex flex-col gap-4 bg-white p-4 rounded-xl shadow-xl w-80 pointer-events-auto border border-gray-100">
           <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <img src={user.avatarUrl} alt="User" className="w-12 h-12 rounded-full bg-gray-200" />
              <div>
                <h2 className="font-bold text-gray-800">{user.name}</h2>
                <p className="text-sm text-gray-500">{CURRENCY}{walletBalance.toLocaleString()} Wallet</p>
              </div>
           </div>
           <nav className="space-y-1">
             <button onClick={() => setViewState('booking')} className={`w-full p-3 rounded-lg flex items-center gap-3 font-medium transition-colors ${viewState === 'booking' && tripStatus === 'searching' ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                <Navigation size={20}/> Book a Ride
             </button>
             <button onClick={() => setViewState('history')} className={`w-full p-3 rounded-lg flex items-center gap-3 font-medium transition-colors ${viewState === 'history' ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                <Clock size={20}/> History
             </button>
             <button onClick={() => setViewState('wallet')} className={`w-full p-3 rounded-lg flex items-center gap-3 font-medium transition-colors ${viewState === 'wallet' ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                <CreditCard size={20}/> Payments
             </button>
             <button onClick={onLogout} className="w-full p-3 text-left text-red-600 hover:bg-red-50 rounded-lg font-medium mt-4">
                Sign Out
             </button>
           </nav>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative h-full">
        <MapBackground />
      </div>

      {/* Interface Panels */}
      <div className="absolute bottom-0 md:top-4 md:right-4 md:bottom-auto w-full md:w-[420px] z-30 transition-all duration-300">
        
        {/* Booking Flow */}
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
                            // Don't show inactive vehicle types
                            if (!pricing[type]?.isActive) return null;

                            const Icon = VEHICLE_ICONS[type];
                            // Dynamic Pricing Calculation
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
                                <CreditCard className="w-5 h-5 text-gray-500"/>
                                <span className="text-sm font-medium">Cash</span>
                            </div>
                            <div className="flex-1 flex items-center gap-2 p-3 bg-gray-50 rounded-lg cursor-pointer border border-transparent hover:border-gray-200 text-gray-400">
                                <span className="text-sm">Promo Code</span>
                            </div>
                        </div>

                        <Button 
                        className="w-full" 
                        disabled={!selectedVehicle} 
                        onClick={handleBookRide}
                        >
                        Confirm {selectedVehicle ? selectedVehicle.toLowerCase() : 'Ride'}
                        </Button>
                    </div>
                )}
            </div>
        )}

        {/* Trip View (Simulation) */}
        {viewState === 'trip' && (
             <div className="bg-white md:rounded-2xl shadow-2xl overflow-hidden">
                {tripStatus === 'searching' && (
                    <div className="p-8 flex flex-col items-center justify-center space-y-6">
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
                    </div>
                )}

                {(tripStatus === 'arriving' || tripStatus === 'arrived' || tripStatus === 'in_progress') && (
                    <div className="animate-in slide-in-from-bottom duration-500">
                        {/* Status Header */}
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
                        
                        {/* Driver Details */}
                        <div className="p-6">
                            {/* ETA Display for In Progress */}
                            {tripStatus === 'in_progress' && (
                                <div className="bg-brand-50 border border-brand-100 p-4 rounded-xl mb-6 flex items-center justify-between shadow-sm animate-in zoom-in duration-300">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-brand-100 text-brand-700 rounded-full">
                                            <Timer size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-brand-600 font-bold uppercase tracking-wider">Estimated Arrival</p>
                                            <p className="text-2xl font-bold text-brand-900">
                                                {Math.max(1, Math.ceil((parseInt(estimatedRide?.duration || "15") || 15) * (1 - tripProgress / 100)))} mins
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center justify-end gap-1 text-gray-500 mb-1">
                                            <Map size={14} />
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
                                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium text-gray-700">
                                    <Phone size={18} /> Call
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium text-gray-700">
                                    <MessageSquare size={18} /> Chat
                                </button>
                                <button onClick={handleShareRide} className="flex-none flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium text-gray-700" title="Share Ride Details">
                                    <Share2 size={18} />
                                </button>
                            </div>

                            {tripStatus === 'in_progress' && (
                                <div className="mb-4">
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-brand-500 transition-all duration-1000 ease-linear"
                                            style={{ width: `${tripProgress}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                                        <span>Pickup</span>
                                        <span>Dropoff</span>
                                    </div>
                                </div>
                            )}

                            {tripStatus !== 'in_progress' && (
                                <Button variant="danger" className="w-full bg-red-50 text-red-600 hover:bg-red-100 border-none shadow-none" onClick={() => resetRide(false)}>
                                    Cancel Ride
                                </Button>
                            )}
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
                            {[1,2,3,4,5].map(star => (
                                <Star key={star} className="w-8 h-8 text-yellow-400 fill-current cursor-pointer hover:scale-110 transition-transform" />
                            ))}
                        </div>

                        <Button className="w-full" onClick={() => resetRide(true)}>Done</Button>
                    </div>
                )}
             </div>
        )}

        {/* History View Overlay */}
        {viewState === 'history' && (
            <div className="bg-white md:rounded-2xl shadow-2xl h-[600px] flex flex-col">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg">Your Trips</h3>
                    <button onClick={() => setViewState('booking')} className="p-2 hover:bg-gray-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {history.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">No rides yet.</div>
                    ) : (
                        history.map((ride) => {
                            const Icon = VEHICLE_ICONS[ride.vehicle as VehicleType] || VEHICLE_ICONS.KEKE;
                            return (
                                <div key={ride.id} className="flex items-start justify-between p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-shadow">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <Icon size={20} className="text-gray-600" />
                                        </div>
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
                        })
                    )}
                </div>
            </div>
        )}

        {/* Wallet View Overlay */}
        {viewState === 'wallet' && (
            <div className="bg-white md:rounded-2xl shadow-2xl h-[600px] flex flex-col">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg">Wallet</h3>
                    <button onClick={() => setViewState('booking')} className="p-2 hover:bg-gray-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">
                    <div className="bg-brand-600 rounded-2xl p-6 text-white shadow-xl mb-6 relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-8 opacity-10"><Wallet size={100} /></div>
                         <p className="text-brand-100 text-sm mb-1">Available Balance</p>
                         <h2 className="text-3xl font-bold mb-6">{CURRENCY}{walletBalance.toLocaleString()}</h2>
                         <button 
                            onClick={() => setWalletBalance(b => b + 5000)}
                            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 backdrop-blur-sm transition-colors"
                        >
                            <Plus size={16} /> Add Funds
                         </button>
                    </div>

                    <h4 className="font-bold text-gray-800 mb-4">Recent Transactions</h4>
                    <div className="space-y-3">
                         <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                             <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600"><Plus size={14}/></div>
                                 <div>
                                     <p className="font-medium text-sm">Wallet Top-up</p>
                                     <p className="text-xs text-gray-500">Today, 9:00 AM</p>
                                 </div>
                             </div>
                             <span className="font-bold text-green-600">+{CURRENCY}5,000</span>
                         </div>
                         <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                             <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600"><Navigation size={14}/></div>
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
  );
};