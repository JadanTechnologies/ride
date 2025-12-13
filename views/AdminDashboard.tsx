import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Users, Truck, DollarSign, Activity, AlertCircle, Settings, Check, X, Shield, Search, MoreVertical, ArrowUpRight, Zap, Ban, Map as MapIcon, Send, UserPlus, Briefcase, Bike, Bus } from 'lucide-react';
import { CURRENCY, LAGOS_COORDS } from '../constants';
import { Button } from '../components/Button';
import { User, Driver, WithdrawalRequest, VehicleType } from '../types';

interface AdminDashboardProps {
  currentPricing: any;
  currentCommission: number;
  currentSurge: number;
  withdrawalRequests: WithdrawalRequest[];
  sessionData: {
    passenger: User;
    driver: Driver;
    rides: any[];
  };
  onUpdatePricing: (pricing: any) => void;
  onUpdateCommission: (rate: number) => void;
  onUpdateSurge: (surge: number) => void;
  onUpdateDriverStatus: (status: 'Active' | 'Suspended') => void;
  onProcessWithdrawal: (id: string) => void;
  onBroadcast: (message: string) => void;
  onLogout: () => void;
}

const dataRevenue = [
  { name: 'Mon', revenue: 400000 },
  { name: 'Tue', revenue: 300000 },
  { name: 'Wed', revenue: 550000 },
  { name: 'Thu', revenue: 480000 },
  { name: 'Fri', revenue: 800000 },
  { name: 'Sat', revenue: 950000 },
  { name: 'Sun', revenue: 600000 },
];

const dataVehicles = [
  { name: 'Keke', value: 450 },
  { name: 'Okada', value: 800 },
  { name: 'Bus', value: 200 },
];

const COLORS = ['#10b981', '#f59e0b', '#3b82f6'];

// Custom Icons for Leaflet
const createIcon = (type: VehicleType | 'USER') => {
  let color = '#10b981';
  let iconHtml = '';

  if (type === VehicleType.KEKE) { color = '#f59e0b'; iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>'; }
  else if (type === VehicleType.OKADA) { color = '#ef4444'; iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>'; }
  else if (type === VehicleType.BUS) { color = '#3b82f6'; iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="17" cy="18" r="2"/></svg>'; }
  else { // User
    color = '#111827';
    iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
  }

  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 2px solid white;">${iconHtml}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  });
};

type AdminView = 'overview' | 'map' | 'drivers' | 'users' | 'rides' | 'disputes' | 'finance' | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  currentPricing, 
  currentCommission,
  currentSurge,
  withdrawalRequests,
  sessionData,
  onUpdatePricing, 
  onUpdateCommission,
  onUpdateSurge,
  onUpdateDriverStatus,
  onProcessWithdrawal,
  onBroadcast,
  onLogout 
}) => {
  const [currentView, setCurrentView] = useState<AdminView>('overview');
  const [broadcastInput, setBroadcastInput] = useState('');

  // Recruitment State
  const [showRecruitModal, setShowRecruitModal] = useState(false);
  const [driverTab, setDriverTab] = useState<'active' | 'pending'>('active');
  const [recruitForm, setRecruitForm] = useState({
    name: '',
    phone: '',
    vehicle: VehicleType.KEKE,
    plate: ''
  });

  // Initialize with Mocks + Session Data
  const [drivers, setDrivers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [allRides, setAllRides] = useState<any[]>([]);

  useEffect(() => {
    // Generate some random positions around Lagos for demo
    const getRandomPos = () => ({
      lat: LAGOS_COORDS.lat + (Math.random() - 0.5) * 0.05,
      lng: LAGOS_COORDS.lng + (Math.random() - 0.5) * 0.05
    });

    // Merge Session Driver
    const sessionDriverFormatted = {
        id: sessionData.driver.id,
        name: sessionData.driver.name + " (You)",
        vehicle: sessionData.driver.vehicleType,
        status: sessionData.driver.status || "Active",
        rating: sessionData.driver.rating,
        isCompany: false,
        location: getRandomPos()
    };
    
    setDrivers(prev => {
        // Simple check to avoid overwriting new recruits on re-renders for this demo
        if (prev.length > 5) return prev;
        return [
            sessionDriverFormatted,
            { id: 1, name: "Ibrahim Musa", vehicle: "Keke", status: "Active", rating: 4.8, isCompany: true, location: getRandomPos() },
            { id: 2, name: "Samuel Okon", vehicle: "Okada", status: "Pending", rating: 0, isCompany: false, location: getRandomPos() },
            { id: 3, name: "Chinedu Eze", vehicle: "Bus", status: "Suspended", rating: 3.2, isCompany: false, location: getRandomPos() },
            { id: 4, name: "Yusuf Ali", vehicle: "Keke", status: "Active", rating: 4.9, isCompany: false, location: getRandomPos() },
            { id: 5, name: "Emmanuel Bassey", vehicle: "Bus", status: "Pending", rating: 0, isCompany: false, location: getRandomPos() },
        ];
    });

    // Merge Session User
    const sessionUserFormatted = {
        id: sessionData.passenger.id,
        name: sessionData.passenger.name + " (You)",
        email: sessionData.passenger.email,
        rides: sessionData.rides.length,
        status: "Active",
        location: getRandomPos()
    };

    setUsers([
        sessionUserFormatted,
        { id: 1, name: "Chioma Adebayo", email: "chioma@example.com", rides: 45, status: "Active", location: getRandomPos() },
        { id: 2, name: "John Doe", email: "john@test.com", rides: 2, status: "Active", location: getRandomPos() },
        { id: 3, name: "Sarah Smith", email: "sarah@test.com", rides: 0, status: "Inactive", location: getRandomPos() },
    ]);

    // Merge Session Rides
    const sessionRidesFormatted = sessionData.rides.map(r => ({
        id: r.id,
        passenger: sessionData.passenger.name,
        driver: "Assigned Driver",
        pickup: r.pickup,
        dropoff: r.dropoff,
        status: r.status,
        fare: r.price,
        type: r.vehicle
    }));

    setAllRides([
        ...sessionRidesFormatted,
        { id: 'r-101', passenger: "Chioma Adebayo", driver: "Ibrahim Musa", pickup: "Shoprite Ikeja", dropoff: "Maryland Mall", status: "In Progress", fare: 1200, type: "Keke" },
        { id: 'r-102', passenger: "John Doe", driver: "Samuel Okon", pickup: "Garki", dropoff: "Wuse 2", status: "Completed", fare: 850, type: "Okada" },
        { id: 'r-103', passenger: "Sarah Smith", driver: "Chinedu Eze", pickup: "Lekki Phase 1", dropoff: "VI", status: "Cancelled", fare: 0, type: "Bus" },
        { id: 'r-104', passenger: "Emeka Obi", driver: "Yusuf Ali", pickup: "Agege", dropoff: "Ikeja Along", status: "Completed", fare: 500, type: "Keke" },
    ]);

  }, [sessionData]);

  // Simulate movement on the map
  useEffect(() => {
    if (currentView !== 'map') return;
    
    const interval = setInterval(() => {
      // Move Drivers
      setDrivers(prev => prev.map(d => {
        if (d.status !== 'Active') return d;
        return {
          ...d,
          location: {
            lat: d.location.lat + (Math.random() - 0.5) * 0.001,
            lng: d.location.lng + (Math.random() - 0.5) * 0.001
          }
        };
      }));

      // Move Active Users
      setUsers(prev => prev.map(u => {
        if (u.status !== 'Active') return u;
        return {
          ...u,
          location: {
            lat: u.location.lat + (Math.random() - 0.5) * 0.0005,
            lng: u.location.lng + (Math.random() - 0.5) * 0.0005
          }
        };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [currentView]);

  const [disputes, setDisputes] = useState([
    { id: 'd-001', complainant: "Chioma Adebayo", respondent: "Ibrahim Musa", issue: "Driver requested extra cash", status: "Open", date: "Today, 10:30 AM" },
    { id: 'd-002', complainant: "Samuel Okon", respondent: "John Doe", issue: "Passenger refused to pay toll", status: "Resolved", date: "Yesterday" },
  ]);

  const [pricingForm, setPricingForm] = useState(currentPricing);
  const [commissionForm, setCommissionForm] = useState(currentCommission);
  const [surgeForm, setSurgeForm] = useState(currentSurge);

  // -- Actions --
  const handleBroadcast = () => {
    if(!broadcastInput.trim()) return;
    onBroadcast(broadcastInput);
    setBroadcastInput('');
  };

  const handleApproveDriver = (id: number | string) => {
    // Check if it's the session driver
    if (id === sessionData.driver.id) {
        onUpdateDriverStatus('Active');
    }
    setDrivers(drivers.map(d => d.id === id ? { ...d, status: 'Active' } : d));
  };

  const handleRejectDriver = (id: number | string) => {
    if(confirm("Are you sure you want to reject this application?")) {
        setDrivers(drivers.filter(d => d.id !== id));
    }
  };

  const handleSuspendDriver = (id: number | string) => {
    if (id === sessionData.driver.id) {
        onUpdateDriverStatus('Suspended');
    }
    setDrivers(drivers.map(d => d.id === id ? { ...d, status: 'Suspended' } : d));
  };

  const handleRecruitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDriver = {
        id: `d-${Date.now()}`,
        name: recruitForm.name,
        vehicle: recruitForm.vehicle,
        status: 'Active',
        rating: 5.0,
        isCompany: true,
        location: { lat: LAGOS_COORDS.lat + 0.01, lng: LAGOS_COORDS.lng + 0.01 }
    };
    setDrivers(prev => [newDriver, ...prev]);
    setShowRecruitModal(false);
    onBroadcast(`New Company Pilot Recruited: ${recruitForm.name} (${recruitForm.vehicle})`);
    setRecruitForm({ name: '', phone: '', vehicle: VehicleType.KEKE, plate: '' });
  };

  const handleDeleteUser = (id: number | string) => {
    if(confirm('Are you sure you want to delete this user?')) {
        setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleResolveDispute = (id: string) => {
    setDisputes(disputes.map(d => d.id === id ? { ...d, status: 'Resolved' } : d));
  };

  const handleUpdatePricing = (type: VehicleType, field: string, value: any) => {
    setPricingForm((prev: any) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: field === 'isActive' ? value : (parseInt(value) || 0)
      }
    }));
  };

  const savePricing = () => {
    onUpdatePricing(pricingForm);
    onUpdateCommission(commissionForm);
    onUpdateSurge(surgeForm);
  };

  const pendingWithdrawalsCount = withdrawalRequests.filter(w => w.status === 'Pending').length;

  const renderContent = () => {
    switch(currentView) {
      case 'map':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-[80vh] relative z-0">
             <MapContainer center={[LAGOS_COORDS.lat, LAGOS_COORDS.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Driver Markers */}
                {drivers.map(d => (
                  <Marker 
                    key={`driver-${d.id}`} 
                    position={[d.location.lat, d.location.lng]}
                    icon={createIcon(d.vehicle === 'Keke' ? VehicleType.KEKE : d.vehicle === 'Okada' ? VehicleType.OKADA : VehicleType.BUS)}
                  >
                    <Popup>
                      <div className="p-2">
                        <h4 className="font-bold">{d.name}</h4>
                        <p className="text-sm capitalize">{d.vehicle} • {d.status}</p>
                        <p className="text-xs text-gray-500">{d.rating} ★</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {/* User Markers (Only Active) */}
                {users.filter(u => u.status === 'Active').map(u => (
                  <Marker 
                    key={`user-${u.id}`} 
                    position={[u.location.lat, u.location.lng]}
                    icon={createIcon('USER')}
                  >
                    <Popup>
                      <div className="p-2">
                        <h4 className="font-bold">{u.name}</h4>
                        <p className="text-sm">Passenger</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
             </MapContainer>
             
             {/* Map Legend Overlay */}
             <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000] border border-gray-100">
                <h4 className="font-bold text-gray-800 mb-2 text-sm">Live Fleet Status</h4>
                <div className="space-y-2">
                   <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div> Keke (Tricycle)
                   </div>
                   <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div> Okada (Bike)
                   </div>
                   <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div> Bus
                   </div>
                   <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-full bg-gray-900 border border-white"></div> Active Passenger
                   </div>
                </div>
                <div className="mt-4 pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500 font-bold">Total Active: {drivers.filter(d => d.status === 'Active').length}</p>
                </div>
             </div>
          </div>
        );

      case 'drivers':
        const filteredDrivers = drivers.filter(d => {
            if (driverTab === 'active') return d.status === 'Active' || d.status === 'Suspended';
            return d.status === 'Pending';
        });

        return (
          <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                  <h3 className="text-lg font-bold text-gray-800">Driver Management</h3>
                  <div className="flex gap-4 mt-2">
                    <button 
                        onClick={() => setDriverTab('active')} 
                        className={`text-sm font-medium pb-1 border-b-2 transition-colors ${driverTab === 'active' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Active Fleet
                    </button>
                    <button 
                        onClick={() => setDriverTab('pending')} 
                        className={`text-sm font-medium pb-1 border-b-2 transition-colors ${driverTab === 'pending' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Applications ({drivers.filter(d => d.status === 'Pending').length})
                    </button>
                  </div>
              </div>
              <div className="flex gap-4 items-center">
                 <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input type="text" placeholder="Search drivers..." className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-500" />
                 </div>
                 <Button onClick={() => setShowRecruitModal(true)} variant="primary" className="py-2 text-sm flex items-center gap-2">
                    <UserPlus size={16} /> Recruit Driver
                 </Button>
              </div>
            </div>
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-sm">
                <tr>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Vehicle</th>
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Rating</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDrivers.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-400 italic">
                            No drivers found in this category.
                        </td>
                    </tr>
                ) : (
                    filteredDrivers.map((driver) => (
                    <tr key={driver.id} className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-900 flex items-center gap-2">
                            {driver.name}
                            {driver.isCompany && <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded border border-blue-200" title="Company Driver">STAFF</span>}
                        </td>
                        <td className="p-4 text-gray-600 capitalize">{driver.vehicle.toLowerCase()}</td>
                        <td className="p-4 text-gray-500 text-sm">{driver.isCompany ? 'Company Asset' : 'Independent'}</td>
                        <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                            driver.status === 'Active' ? 'bg-green-100 text-green-700' :
                            driver.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                        }`}>
                            {driver.status}
                        </span>
                        </td>
                        <td className="p-4 text-gray-600">★ {driver.rating || '-'}</td>
                        <td className="p-4 text-right space-x-2">
                        {driver.status === 'Pending' && (
                            <>
                                <button onClick={() => handleApproveDriver(driver.id)} className="text-green-600 hover:bg-green-50 p-1.5 rounded transition-colors" title="Approve"><Check size={18}/></button>
                                <button onClick={() => handleRejectDriver(driver.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors" title="Reject"><X size={18}/></button>
                            </>
                        )}
                        {driver.status === 'Active' && (
                            <button onClick={() => handleSuspendDriver(driver.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors" title="Suspend"><Ban size={18}/></button>
                        )}
                        <button className="text-gray-400 hover:text-gray-600 p-1.5 rounded transition-colors"><MoreVertical size={18}/></button>
                        </td>
                    </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>

          {/* Recruit Modal */}
          {showRecruitModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                  <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95">
                      <div className="flex justify-between items-center mb-6">
                          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                              <Briefcase className="text-brand-600" /> Recruit Company Driver
                          </h3>
                          <button onClick={() => setShowRecruitModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
                      </div>
                      
                      <form onSubmit={handleRecruitSubmit} className="space-y-4">
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                              <input 
                                required
                                type="text" 
                                value={recruitForm.name}
                                onChange={e => setRecruitForm({...recruitForm, name: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                                placeholder="e.g. David Mark"
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                              <input 
                                required
                                type="tel" 
                                value={recruitForm.phone}
                                onChange={e => setRecruitForm({...recruitForm, phone: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                                placeholder="080..."
                              />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                                <select 
                                    value={recruitForm.vehicle}
                                    onChange={e => setRecruitForm({...recruitForm, vehicle: e.target.value as VehicleType})}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                                >
                                    <option value={VehicleType.KEKE}>Keke (Tricycle)</option>
                                    <option value={VehicleType.OKADA}>Okada (Bike)</option>
                                    <option value={VehicleType.BUS}>Bus</option>
                                </select>
                              </div>
                              <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Plate</label>
                                  <input 
                                    required
                                    type="text" 
                                    value={recruitForm.plate}
                                    onChange={e => setRecruitForm({...recruitForm, plate: e.target.value})}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                                    placeholder="LAG-123-XY"
                                  />
                              </div>
                          </div>
                          
                          <div className="bg-blue-50 p-3 rounded-lg text-blue-800 text-xs flex items-start gap-2">
                             <Shield size={14} className="mt-0.5 shrink-0" />
                             <p>Company drivers are automatically approved and verified. They will appear in the "Active Fleet" tab immediately.</p>
                          </div>

                          <div className="flex gap-3 pt-2">
                              <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowRecruitModal(false)}>Cancel</Button>
                              <Button type="submit" className="flex-1">Recruit Driver</Button>
                          </div>
                      </form>
                  </div>
              </div>
          )}
          </>
        );

      case 'users':
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">User Management</h3>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input type="text" placeholder="Search users..." className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-500" />
              </div>
            </div>
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-sm">
                <tr>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Total Rides</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">{u.name}</td>
                    <td className="p-4 text-gray-600">{u.email}</td>
                    <td className="p-4 text-gray-600">{u.rides}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        u.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                       <button onClick={() => handleDeleteUser(u.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors" title="Delete"><X size={18}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'rides':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Ride Monitoring</h3>
                <div className="flex gap-2 text-sm text-gray-500 bg-gray-100 p-1 rounded-lg">
                    <button className="px-3 py-1 bg-white rounded shadow-sm text-gray-800 font-medium">All</button>
                    <button className="px-3 py-1 hover:text-gray-800">Active</button>
                    <button className="px-3 py-1 hover:text-gray-800">Completed</button>
                </div>
             </div>
             <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-sm">
                  <tr>
                    <th className="p-4 font-medium">ID</th>
                    <th className="p-4 font-medium">Passenger</th>
                    <th className="p-4 font-medium">Driver</th>
                    <th className="p-4 font-medium">Route</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium text-right">Fare</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {allRides.map((ride) => (
                    <tr key={ride.id} className="hover:bg-gray-50">
                       <td className="p-4 text-xs font-mono text-gray-500">{ride.id.toString().substring(0,8)}...</td>
                       <td className="p-4 font-medium text-gray-900">{ride.passenger}</td>
                       <td className="p-4 text-gray-600">{ride.driver} <span className="text-xs text-gray-400 capitalize">({ride.type?.toLowerCase()})</span></td>
                       <td className="p-4 text-sm text-gray-600">
                          <span className="block truncate w-32" title={ride.pickup}>{ride.pickup}</span>
                          <span className="text-xs text-gray-400">to</span>
                          <span className="block truncate w-32" title={ride.dropoff}>{ride.dropoff}</span>
                       </td>
                       <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                             ride.status === 'In Progress' ? 'bg-blue-100 text-blue-700 animate-pulse' :
                             ride.status === 'Completed' ? 'bg-green-100 text-green-700' :
                             'bg-gray-100 text-gray-700'
                          }`}>
                            {ride.status}
                          </span>
                       </td>
                       <td className="p-4 text-right font-medium">{CURRENCY}{ride.fare}</td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        );

      case 'disputes':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Dispute Resolution</h3>
                <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-1 rounded-full">{disputes.filter(d => d.status === 'Open').length} Open</span>
             </div>
             <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-sm">
                  <tr>
                    <th className="p-4 font-medium">ID</th>
                    <th className="p-4 font-medium">Complainant</th>
                    <th className="p-4 font-medium">Issue</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                   {disputes.map((d) => (
                      <tr key={d.id} className="hover:bg-gray-50">
                         <td className="p-4 text-xs font-mono text-gray-500">{d.id}</td>
                         <td className="p-4">
                            <p className="font-bold text-gray-900">{d.complainant}</p>
                            <p className="text-xs text-gray-500">vs {d.respondent}</p>
                         </td>
                         <td className="p-4 text-gray-800">{d.issue}</td>
                         <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                               d.status === 'Open' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                            }`}>{d.status}</span>
                         </td>
                         <td className="p-4 text-right">
                            {d.status === 'Open' && (
                               <Button onClick={() => handleResolveDispute(d.id)} variant="secondary" className="py-1 px-3 text-xs">Resolve</Button>
                            )}
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        );
      
      case 'finance':
        return (
          <div className="space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                   <p className="text-sm text-gray-500 mb-1">Platform Commission (Today)</p>
                   <h2 className="text-3xl font-bold text-gray-900">{CURRENCY}245,000</h2>
                   <span className="text-green-600 text-xs font-bold flex items-center gap-1 mt-2"><ArrowUpRight size={14} /> 12% vs yesterday</span>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                   <p className="text-sm text-gray-500 mb-1">Pending Withdrawals</p>
                   <h2 className="text-3xl font-bold text-gray-900">{CURRENCY}{withdrawalRequests.filter(w => w.status === 'Pending').reduce((a, b) => a + b.amount, 0).toLocaleString()}</h2>
                   <span className="text-gray-500 text-xs mt-2 block">{pendingWithdrawalsCount} Drivers waiting</span>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                   <p className="text-sm text-gray-500 mb-1">Net Revenue (Month)</p>
                   <h2 className="text-3xl font-bold text-brand-600">{CURRENCY}4.2M</h2>
                </div>
             </div>

             <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                   <h3 className="font-bold text-gray-800">Withdrawal Requests</h3>
                </div>
                {withdrawalRequests.length > 0 ? (
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm">
                      <tr>
                        <th className="p-4 font-medium">Driver</th>
                        <th className="p-4 font-medium">Amount</th>
                        <th className="p-4 font-medium">Date</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {withdrawalRequests.map((w) => (
                        <tr key={w.id} className="hover:bg-gray-50">
                          <td className="p-4 font-bold text-gray-900">{w.driverName}</td>
                          <td className="p-4">{CURRENCY}{w.amount.toLocaleString()}</td>
                          <td className="p-4 text-gray-500">{w.date}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                                w.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                            }`}>{w.status}</span>
                          </td>
                          <td className="p-4 text-right">
                            {w.status === 'Pending' && (
                                <Button onClick={() => onProcessWithdrawal(w.id)} className="py-1 px-3 text-xs" variant="primary">Pay Now</Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-8 text-center text-gray-500 italic">No active withdrawal requests</div>
                )}
             </div>
          </div>
        );

      case 'settings':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">Platform Settings</h3>
                <span className="text-sm text-gray-500">Configure availability, fares, and pricing logic</span>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Commission Settings */}
                <div className="p-6 bg-brand-50 border border-brand-100 rounded-lg">
                    <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-bold text-brand-900">Platform Commission</h4>
                        <p className="text-xs text-brand-700 mt-1">Fee per completed ride</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input 
                            type="number" 
                            value={commissionForm}
                            onChange={(e) => setCommissionForm(Number(e.target.value))}
                            className="w-20 p-2 border rounded text-right font-bold text-gray-800"
                            min="0"
                            max="100"
                        />
                        <span className="font-bold text-brand-900">%</span>
                    </div>
                    </div>
                </div>

                {/* Surge Pricing Settings */}
                <div className="p-6 bg-purple-50 border border-purple-100 rounded-lg">
                    <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-bold text-purple-900 flex items-center gap-2"><Zap size={16} className="fill-current"/> Surge Pricing</h4>
                        <p className="text-xs text-purple-700 mt-1">Multiplier for peak hours</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-purple-900">x</span>
                        <input 
                            type="number" 
                            value={surgeForm}
                            onChange={(e) => setSurgeForm(Number(e.target.value))}
                            className="w-20 p-2 border rounded text-right font-bold text-gray-800"
                            min="1"
                            max="5"
                            step="0.1"
                        />
                    </div>
                    </div>
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[VehicleType.KEKE, VehicleType.OKADA, VehicleType.BUS].map(type => (
                 <div key={type} className={`p-4 border rounded-lg transition-all ${pricingForm[type].isActive ? 'border-brand-200 bg-brand-50/50' : 'border-gray-200 bg-gray-50 opacity-75'}`}>
                   <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-gray-700 flex items-center gap-2 capitalize">
                          {type.toLowerCase()}
                      </h4>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={pricingForm[type].isActive} 
                          onChange={(e) => handleUpdatePricing(type, 'isActive', e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
                      </label>
                   </div>
                   
                   <div className="space-y-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Base Fare ({CURRENCY})</label>
                        <input 
                          type="number" 
                          value={pricingForm[type].base}
                          disabled={!pricingForm[type].isActive}
                          onChange={(e) => handleUpdatePricing(type, 'base', e.target.value)}
                          className="w-full p-2 border rounded bg-white disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Per KM ({CURRENCY})</label>
                        <input 
                          type="number" 
                          value={pricingForm[type].perKm}
                          disabled={!pricingForm[type].isActive}
                          onChange={(e) => handleUpdatePricing(type, 'perKm', e.target.value)}
                          className="w-full p-2 border rounded bg-white disabled:bg-gray-100"
                        />
                      </div>
                   </div>
                 </div>
               ))}
             </div>
             
             <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
               <Button onClick={savePricing}>Save Configuration</Button>
             </div>
          </div>
        );

      default: // Overview
        return (
          <>
            {/* Broadcast Widget */}
            <div className="bg-brand-900 text-white p-6 rounded-xl shadow-lg mb-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-12 opacity-10 transform rotate-12">
                  <Send size={120} />
               </div>
               <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-2">Broadcast Announcement</h3>
                  <p className="text-brand-200 mb-4 max-w-xl">Send a system-wide notification to all active drivers and passengers immediately.</p>
                  <div className="flex gap-2 max-w-lg">
                     <input 
                        type="text" 
                        value={broadcastInput}
                        onChange={(e) => setBroadcastInput(e.target.value)}
                        placeholder="Type your message here..."
                        className="flex-1 px-4 py-2 rounded-lg text-gray-900 focus:outline-none text-black"
                     />
                     <button onClick={handleBroadcast} className="bg-brand-500 hover:bg-brand-400 px-6 py-2 rounded-lg font-bold transition-colors">Send</button>
                  </div>
               </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div 
                onClick={() => setCurrentView('finance')}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">{CURRENCY}12.4M</h3>
                    </div>
                    <div className="p-2 bg-green-100 rounded-lg text-green-600"><DollarSign size={20}/></div>
                </div>
                <span className="text-xs text-green-600 font-medium mt-4 block">↑ 12% from last week</span>
              </div>

              <div 
                onClick={() => setCurrentView('drivers')}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Active Drivers</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">{drivers.length + 1240}</h3>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Truck size={20}/></div>
                </div>
                <span className="text-xs text-gray-500 font-medium mt-4 block">85 awaiting approval</span>
              </div>

              <div 
                onClick={() => setCurrentView('users')}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Users</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">{users.length + 45200}</h3>
                    </div>
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><Users size={20}/></div>
                </div>
                <span className="text-xs text-green-600 font-medium mt-4 block">↑ 540 today</span>
              </div>

              <div 
                onClick={() => setCurrentView('disputes')}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Active Disputes</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">23</h3>
                    </div>
                    <div className="p-2 bg-red-100 rounded-lg text-red-600"><AlertCircle size={20}/></div>
                </div>
                <span className="text-xs text-red-600 font-medium mt-4 block">Action required</span>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Weekly Revenue</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dataRevenue}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} />
                          <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `${val/1000}k`} />
                          <Tooltip 
                              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                              cursor={{ fill: '#f9fafb' }}
                          />
                          <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Vehicle Distribution</h3>
                <div className="h-80 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                          <Pie
                            data={dataVehicles}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {dataVehicles.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2">
                      {dataVehicles.map((entry, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                            <span className="text-sm text-gray-600">{entry.name} ({Math.round(entry.value / 14.5)}%)</span>
                          </div>
                      ))}
                    </div>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
         <div className="p-6">
            <h1 className="text-2xl font-bold text-brand-500 tracking-tighter">KEKE ADMIN</h1>
         </div>
         <nav className="flex-1 px-4 space-y-2">
            <div 
              onClick={() => setCurrentView('overview')}
              className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer ${currentView === 'overview' ? 'bg-brand-600' : 'text-gray-400 hover:bg-slate-800'}`}
            >
               <Activity size={20} /> Dashboard
            </div>
            <div 
              onClick={() => setCurrentView('map')}
              className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer ${currentView === 'map' ? 'bg-brand-600' : 'text-gray-400 hover:bg-slate-800'}`}
            >
               <MapIcon size={20} /> Live Map
            </div>
            <div 
              onClick={() => setCurrentView('rides')}
              className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer ${currentView === 'rides' ? 'bg-brand-600' : 'text-gray-400 hover:bg-slate-800'}`}
            >
               <Truck size={20} /> Rides
            </div>
            <div 
              onClick={() => setCurrentView('drivers')}
              className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer ${currentView === 'drivers' ? 'bg-brand-600' : 'text-gray-400 hover:bg-slate-800'}`}
            >
               <Briefcase size={20} /> Drivers
            </div>
            <div 
               onClick={() => setCurrentView('users')}
               className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer ${currentView === 'users' ? 'bg-brand-600' : 'text-gray-400 hover:bg-slate-800'}`}
            >
               <Users size={20} /> Users
            </div>
            <div 
               onClick={() => setCurrentView('disputes')}
               className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer ${currentView === 'disputes' ? 'bg-brand-600' : 'text-gray-400 hover:bg-slate-800'}`}
            >
               <AlertCircle size={20} /> Disputes
            </div>
            <div 
               onClick={() => setCurrentView('finance')}
               className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer justify-between ${currentView === 'finance' ? 'bg-brand-600' : 'text-gray-400 hover:bg-slate-800'}`}
            >
               <div className="flex items-center gap-3">
                 <DollarSign size={20} /> Finance
               </div>
               {pendingWithdrawalsCount > 0 && (
                   <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{pendingWithdrawalsCount}</span>
               )}
            </div>
            <div 
              onClick={() => setCurrentView('settings')}
              className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer ${currentView === 'settings' ? 'bg-brand-600' : 'text-gray-400 hover:bg-slate-800'}`}
            >
               <Settings size={20} /> Settings
            </div>
         </nav>
         <div className="p-4 border-t border-slate-800">
            <button onClick={onLogout} className="text-red-400 hover:text-red-300 text-sm font-medium">Log Out</button>
         </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto h-screen">
         <header className="flex justify-between items-center mb-8">
            <div>
               <h2 className="text-2xl font-bold text-gray-800 capitalize">{currentView === 'map' ? 'Live Fleet Map' : currentView}</h2>
               <p className="text-gray-500">Platform Management System</p>
            </div>
            <div className="flex gap-4">
               <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">Export Report</button>
               <div className="flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 rounded-lg text-sm font-medium">
                  <Shield size={16} /> Super Admin
               </div>
            </div>
         </header>

         {renderContent()}
      </main>
    </div>
  );
};