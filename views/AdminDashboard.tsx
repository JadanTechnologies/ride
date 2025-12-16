import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import * as L from 'leaflet';
import { Users, Truck, DollarSign, Activity, AlertCircle, Settings, Check, X, Shield, Search, MoreVertical, ArrowUpRight, Zap, Ban, Map as MapIcon, Send, UserPlus, Briefcase, Bike, Bus, Smartphone, Wrench, MessageSquare, AlertTriangle, Box } from 'lucide-react';
import { CURRENCY, LAGOS_COORDS } from '../constants';
import { Button } from '../components/Button';
import { User, Driver, WithdrawalRequest, VehicleType, Ride, Dispute, Pricing, RideStatus, UserRole } from '../types';
import AdminSettingsPanel from '../components/AdminSettingsPanel';
import AdminMapView from '../components/AdminMapView';
import DeviceTracking from '../components/DeviceTracking';
import AppManagement from '../components/AppManagement';
import SupportManagement from '../components/SupportManagement';
import UserManagement from '../components/UserManagement';
import { FinancialReports } from '../components/FinancialReports';
import CollapsibleNavBar from '../components/CollapsibleNavBar';
import LogisticsManagement from '../components/LogisticsManagement';

// Fix for Leaflet import in ESM environments
const Leaflet = (L as any).default ?? L;

interface AdminDashboardProps {
  currentPricing: Pricing;
  currentCommission: number;
  currentSurge: number;
  withdrawalRequests: WithdrawalRequest[];
  sessionData: {
    passenger: User;
    driver: Driver;
    rides: Ride[];
  };
  onUpdatePricing: (pricing: Pricing) => void;
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

type AdminView = 'overview' | 'map' | 'drivers' | 'users' | 'rides' | 'disputes' | 'finance' | 'logistics' | 'settings' | 'devices' | 'apps' | 'support' | 'fraud' | 'usermanagement';

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

  // Navigation items for CollapsibleNavBar
  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: <Activity size={20} />, onClick: () => setCurrentView('overview') },
    { id: 'map', label: 'Live Map', icon: <MapIcon size={20} />, onClick: () => setCurrentView('map') },
    { id: 'rides', label: 'Rides', icon: <Truck size={20} />, onClick: () => setCurrentView('rides') },
    { id: 'drivers', label: 'Drivers', icon: <Briefcase size={20} />, onClick: () => setCurrentView('drivers') },
    { id: 'users', label: 'Users', icon: <Users size={20} />, onClick: () => setCurrentView('users') },
    { id: 'usermanagement', label: 'User Mgmt', icon: <UserPlus size={20} />, onClick: () => setCurrentView('usermanagement') },
    { id: 'disputes', label: 'Disputes', icon: <AlertCircle size={20} />, onClick: () => setCurrentView('disputes') },
    { id: 'logistics', label: 'Logistics', icon: <Box size={20} />, onClick: () => setCurrentView('logistics') },
    { id: 'finance', label: 'Finance', icon: <DollarSign size={20} />, onClick: () => setCurrentView('finance') },
    { id: 'devices', label: 'Devices', icon: <Smartphone size={20} />, onClick: () => setCurrentView('devices') },
    { id: 'apps', label: 'Apps', icon: <Wrench size={20} />, onClick: () => setCurrentView('apps') },
    { id: 'support', label: 'Support', icon: <MessageSquare size={20} />, onClick: () => setCurrentView('support') },
    { id: 'fraud', label: 'Fraud', icon: <AlertTriangle size={20} />, onClick: () => setCurrentView('fraud') },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} />, onClick: () => setCurrentView('settings') },
  ];

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
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [allRides, setAllRides] = useState<Ride[]>([]);

  useEffect(() => {
    // Generate some random positions around Lagos for demo
    const getRandomPos = () => ({
      lat: LAGOS_COORDS.lat + (Math.random() - 0.5) * 0.05,
      lng: LAGOS_COORDS.lng + (Math.random() - 0.5) * 0.05
    });

    const mockUsers: User[] = [
      { id: 'u-1', name: "Chioma Adebayo", email: "chioma@example.com", phone: "08012345678", role: UserRole.PASSENGER, walletBalance: 1500, location: getRandomPos() },
      { id: 'u-2', name: "John Doe", email: "john@test.com", phone: "08012345679", role: UserRole.PASSENGER, walletBalance: 500, location: getRandomPos() },
      { id: 'u-3', name: "Sarah Smith", email: "sarah@test.com", phone: "08012345680", role: UserRole.PASSENGER, walletBalance: 12500, location: getRandomPos() },
    ];

    const mockDrivers: Driver[] = [
        { id: 'd-1', name: "Ibrahim Musa", vehicleType: VehicleType.KEKE, status: "Active", rating: 4.8, isCompany: true, location: getRandomPos(), email: 'd1@test.com', phone: '123', role: UserRole.DRIVER, walletBalance: 0, vehiclePlate: "ABC-123", isOnline: true, totalRides: 10, earnings: {today: 100, week: 500, month: 2000} },
        { id: 'd-2', name: "Samuel Okon", vehicleType: VehicleType.OKADA, status: "Pending", rating: 0, isCompany: false, location: getRandomPos(), email: 'd2@test.com', phone: '123', role: UserRole.DRIVER, walletBalance: 0, vehiclePlate: "ABC-123", isOnline: true, totalRides: 10, earnings: {today: 100, week: 500, month: 2000} },
        { id: 'd-3', name: "Chinedu Eze", vehicleType: VehicleType.BUS, status: "Suspended", rating: 3.2, isCompany: false, location: getRandomPos(), email: 'd3@test.com', phone: '123', role: UserRole.DRIVER, walletBalance: 0, vehiclePlate: "ABC-123", isOnline: true, totalRides: 10, earnings: {today: 100, week: 500, month: 2000} },
        { id: 'd-4', name: "Yusuf Ali", vehicleType: VehicleType.KEKE, status: "Active", rating: 4.9, isCompany: false, location: getRandomPos(), email: 'd4@test.com', phone: '123', role: UserRole.DRIVER, walletBalance: 0, vehiclePlate: "ABC-123", isOnline: true, totalRides: 10, earnings: {today: 100, week: 500, month: 2000} },
        { id: 'd-5', name: "Emmanuel Bassey", vehicleType: VehicleType.BUS, status: "Pending", rating: 0, isCompany: false, location: getRandomPos(), email: 'd5@test.com', phone: '123', role: UserRole.DRIVER, walletBalance: 0, vehiclePlate: "ABC-123", isOnline: true, totalRides: 10, earnings: {today: 100, week: 500, month: 2000} },
    ];

    const mockRides: Ride[] = [
      { id: 'r-101', passengerId: "u-1", driverId: "d-1", pickupAddress: "Shoprite Ikeja", dropoffAddress: "Maryland Mall", status: RideStatus.IN_PROGRESS, fare: 1200, vehicleType: VehicleType.KEKE, distance: "5km", duration: "10m", createdAt: Date.now() },
    ];
    
    // Merge session data with mocks
    setDrivers([sessionData.driver, ...mockDrivers]);
    setUsers([sessionData.passenger, ...mockUsers]);
    setAllRides([...sessionData.rides, ...mockRides]);

  }, [sessionData]);

  // Simulate movement
  useEffect(() => {
    if (currentView !== 'map') return;
    const interval = setInterval(() => {
      setDrivers(prev => prev.map(d => {
        if (d.status !== 'Active' || !d.location) return d;
        return {
          ...d,
          location: {
            lat: d.location.lat + (Math.random() - 0.5) * 0.001,
            lng: d.location.lng + (Math.random() - 0.5) * 0.001
          }
        };
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, [currentView]);

  const [disputes, setDisputes] = useState<Dispute[]>([
    { id: 'd-001', complainant: "Chioma Adebayo", respondent: "Ibrahim Musa", issue: "Driver requested extra cash", status: "Open", date: "Today, 10:30 AM" },
  ]);

  const [pricingForm, setPricingForm] = useState<Pricing>(currentPricing);
  const [commissionForm, setCommissionForm] = useState(currentCommission);
  const [surgeForm, setSurgeForm] = useState(currentSurge);

  // -- Actions --
  const handleBroadcast = () => {
    if(!broadcastInput.trim()) return;
    onBroadcast(broadcastInput);
    setBroadcastInput('');
  };

  const handleApproveDriver = (id: string) => {
    if (id === sessionData.driver.id) onUpdateDriverStatus('Active');
    setDrivers(prevDrivers => prevDrivers.map(d => d.id === id ? { ...d, status: 'Active' } : d));
  };

  const handleRejectDriver = (id: string) => {
    if(confirm("Are you sure you want to reject this application?")) {
        setDrivers(prevDrivers => prevDrivers.filter(d => d.id !== id));
    }
  };

  const handleSuspendDriver = (id: string) => {
    if (id === sessionData.driver.id) onUpdateDriverStatus('Suspended');
    setDrivers(prevDrivers => prevDrivers.map(d => d.id === id ? { ...d, status: 'Suspended' } : d));
  };

  const handleRecruitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDriver: Driver = {
        id: `d-${Date.now()}`,
        name: recruitForm.name,
        phone: recruitForm.phone,
        vehicleType: recruitForm.vehicle,
        vehiclePlate: recruitForm.plate,
        status: 'Active',
        rating: 5.0,
        isCompany: true,
        location: { lat: LAGOS_COORDS.lat + 0.01, lng: LAGOS_COORDS.lng + 0.01 },
        email: 'new@recruit.com',
        role: UserRole.DRIVER,
        walletBalance: 0,
        isOnline: true,
        totalRides: 0,
        earnings: { today: 0, week: 0, month: 0 }
    };
    setDrivers(prev => [newDriver, ...prev]);
    setShowRecruitModal(false);
    onBroadcast(`New Company Pilot Recruited: ${recruitForm.name} (${recruitForm.vehicle})`);
    setRecruitForm({ name: '', phone: '', vehicle: VehicleType.KEKE, plate: '' });
  };

  const handleDeleteUser = (id: string) => {
    if(confirm('Are you sure you want to delete this user?')) {
        setUsers(prevUsers => prevUsers.filter(u => u.id !== id));
    }
  };

  const handleResolveDispute = (id: string) => {
    setDisputes(prevDisputes => prevDisputes.map(d => d.id === id ? { ...d, status: 'Resolved' } : d));
  };

  const handleUpdatePricing = (type: VehicleType, field: string, value: string | boolean) => {
    setPricingForm((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: field === 'isActive' ? value : (parseInt(value as string) || 0)
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
          <div className="h-[calc(100vh-12rem)]">
            <AdminMapView drivers={drivers} users={users} />
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
            {/* Driver Table Content */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                  <h3 className="text-lg font-bold text-gray-800">Driver Management</h3>
                  <div className="flex gap-4 mt-2">
                    <button onClick={() => setDriverTab('active')} className={`text-sm font-medium pb-1 border-b-2 transition-colors ${driverTab === 'active' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Active Fleet</button>
                    <button onClick={() => setDriverTab('pending')} className={`text-sm font-medium pb-1 border-b-2 transition-colors ${driverTab === 'pending' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Applications ({drivers.filter(d => d.status === 'Pending').length})</button>
                  </div>
              </div>
              <Button onClick={() => setShowRecruitModal(true)} variant="primary" className="py-2 text-sm flex items-center gap-2"><UserPlus size={16} /> Recruit Driver</Button>
            </div>
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-sm"><tr><th className="p-4 font-medium">Name</th><th className="p-4 font-medium">Vehicle</th><th className="p-4 font-medium">Type</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium">Rating</th><th className="p-4 font-medium text-right">Actions</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDrivers.map((driver) => (
                    <tr key={driver.id} className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-900 flex items-center gap-2">{driver.name}{driver.isCompany && <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded border border-blue-200">STAFF</span>}</td>
                        <td className="p-4 text-gray-600 capitalize">{driver.vehicleType.toLowerCase()}</td>
                        <td className="p-4 text-gray-500 text-sm">{driver.isCompany ? 'Company Asset' : 'Independent'}</td>
                        <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${driver.status === 'Active' ? 'bg-green-100 text-green-700' : driver.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{driver.status}</span></td>
                        <td className="p-4 text-gray-600">★ {driver.rating || '-'}</td>
                        <td className="p-4 text-right space-x-2">
                        {driver.status === 'Pending' && (<><button onClick={() => handleApproveDriver(driver.id)} className="text-green-600 hover:bg-green-50 p-1.5 rounded"><Check size={18}/></button><button onClick={() => handleRejectDriver(driver.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded"><X size={18}/></button></>)}
                        {driver.status === 'Active' && (<button onClick={() => handleSuspendDriver(driver.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded"><Ban size={18}/></button>)}
                        </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
          {showRecruitModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                  <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95">
                      <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Briefcase className="text-brand-600" /> Recruit Company Driver</h3><button onClick={() => setShowRecruitModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button></div>
                      <form onSubmit={handleRecruitSubmit} className="space-y-4">
                          <input required type="text" value={recruitForm.name} onChange={e => setRecruitForm({...recruitForm, name: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg" placeholder="Full Name" />
                          <input required type="tel" value={recruitForm.phone} onChange={e => setRecruitForm({...recruitForm, phone: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg" placeholder="Phone Number" />
                          <div className="grid grid-cols-2 gap-4">
                              <select value={recruitForm.vehicle} onChange={e => setRecruitForm({...recruitForm, vehicle: e.target.value as VehicleType})} className="w-full p-2 border border-gray-300 rounded-lg"><option value={VehicleType.KEKE}>Keke</option><option value={VehicleType.OKADA}>Okada</option><option value={VehicleType.BUS}>Bus</option></select>
                              <input required type="text" value={recruitForm.plate} onChange={e => setRecruitForm({...recruitForm, plate: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg" placeholder="Plate Number" />
                          </div>
                          <div className="flex gap-3 pt-2"><Button type="button" variant="secondary" className="flex-1" onClick={() => setShowRecruitModal(false)}>Cancel</Button><Button type="submit" className="flex-1">Recruit Driver</Button></div>
                      </form>
                  </div>
              </div>
          )}
          </>
        );

      case 'users':
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center"><h3 className="text-lg font-bold text-gray-800">User Management</h3></div>
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-sm"><tr><th className="p-4 font-medium">Name</th><th className="p-4 font-medium">Email</th><th className="p-4 font-medium">Wallet Balance</th><th className="p-4 font-medium text-right">Actions</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50"><td className="p-4 font-medium text-gray-900">{u.name}</td><td className="p-4 text-gray-600">{u.email}</td><td className="p-4 font-medium text-gray-900">{CURRENCY}{u.walletBalance}</td><td className="p-4 text-right"><button onClick={() => handleDeleteUser(u.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded"><X size={18}/></button></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'rides':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center"><h3 className="text-lg font-bold text-gray-800">Ride Monitoring</h3></div>
             <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-sm"><tr><th className="p-4 font-medium">ID</th><th className="p-4 font-medium">Passenger</th><th className="p-4 font-medium">Driver</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium text-right">Fare</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {allRides.map((ride) => {
                    const passenger = users.find(u => u.id === ride.passengerId);
                    const driver = drivers.find(d => d.id === ride.driverId);
                    return (
                      <tr key={ride.id} className="hover:bg-gray-50"><td className="p-4 text-xs font-mono text-gray-500">{ride.id.toString().substring(0,8)}...</td><td className="p-4 font-medium text-gray-900">{passenger?.name || ride.passengerId}</td><td className="p-4 text-gray-600">{driver?.name || ride.driverId}</td><td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${ride.status === RideStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{ride.status}</span></td><td className="p-4 text-right font-medium">{CURRENCY}{ride.fare}</td></tr>
                    )
                  })}
                </tbody>
             </table>
          </div>
        );

      case 'disputes':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center"><h3 className="text-lg font-bold text-gray-800">Disputes</h3></div>
             {/* Disputes table */}
             <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-sm"><tr><th className="p-4 font-medium">ID</th><th className="p-4 font-medium">Details</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium text-right">Action</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                   {disputes.map((d) => (
                      <tr key={d.id} className="hover:bg-gray-50"><td className="p-4 text-xs font-mono text-gray-500">{d.id}</td><td className="p-4"><p className="font-bold">{d.issue}</p><p className="text-xs text-gray-500">{d.complainant} vs {d.respondent}</p></td><td className="p-4"><span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">{d.status}</span></td><td className="p-4 text-right">{d.status === 'Open' && <Button onClick={() => handleResolveDispute(d.id)} variant="secondary" className="py-1 px-2 text-xs">Resolve</Button>}</td></tr>
                   ))}
                </tbody>
             </table>
          </div>
        );

      case 'finance':
        return <FinancialReports />;

      case 'logistics':
        return <LogisticsManagement />;

      case 'settings':
        return <AdminSettingsPanel />;

      case 'devices':
        return <DeviceTracking />;

      case 'apps':
        return <AppManagement />;

      case 'support':
        return <SupportManagement />;

      case 'fraud':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="text-red-600" size={24} />
                <h3 className="text-lg font-bold text-gray-800">Fraud Detection & Monitoring</h3>
              </div>
              <p className="text-gray-600 mb-4">Automated fraud detection service is running. Suspicious activities are tracked and logged automatically.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <p className="text-sm text-red-800 font-semibold mb-1">Critical Alerts</p>
                  <p className="text-3xl font-bold text-red-700">2</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800 font-semibold mb-1">High Risk</p>
                  <p className="text-3xl font-bold text-yellow-700">7</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 font-semibold mb-1">Users Suspended</p>
                  <p className="text-3xl font-bold text-blue-700">5</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h4 className="font-bold text-gray-800 mb-4">Recent Alerts</h4>
              <div className="space-y-3">
                {[
                  { id: '1', user: 'User_456', type: 'Fake Booking', risk: 'CRITICAL', time: '5 min ago' },
                  { id: '2', user: 'Driver_789', type: 'Multiple Cancellations', risk: 'HIGH', time: '20 min ago' },
                  { id: '3', user: 'User_123', type: 'Payment Anomaly', risk: 'MEDIUM', time: '1 hour ago' }
                ].map(alert => (
                  <div key={alert.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{alert.user}</p>
                      <p className="text-sm text-gray-600">{alert.type}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded text-xs font-semibold ${
                        alert.risk === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                        alert.risk === 'HIGH' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>{alert.risk}</span>
                      <span className="text-xs text-gray-500">{alert.time}</span>
                      <button className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded">Review</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'usermanagement':
        return <UserManagement />;

      default: // Overview
        return (
          <>
            {/* Overview Content */}
            <div className="bg-brand-900 text-white p-6 rounded-xl shadow-lg mb-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-12 opacity-10 transform rotate-12"><Send size={120} /></div>
               <div className="relative z-10"><h3 className="text-xl font-bold mb-2">Broadcast Announcement</h3><div className="flex gap-2 max-w-lg"><input type="text" value={broadcastInput} onChange={(e) => setBroadcastInput(e.target.value)} placeholder="Type message..." className="flex-1 px-4 py-2 rounded-lg text-black" /><button onClick={handleBroadcast} className="bg-brand-500 hover:bg-brand-400 px-6 py-2 rounded-lg font-bold">Send</button></div></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div onClick={() => setCurrentView('finance')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md"><div className="flex justify-between"><h3 className="text-2xl font-bold">{CURRENCY}12.4M</h3><DollarSign className="text-green-500" /></div><p className="text-sm text-gray-500">Revenue</p></div>
              <div onClick={() => setCurrentView('drivers')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md"><div className="flex justify-between"><h3 className="text-2xl font-bold">{drivers.length + 1240}</h3><Truck className="text-blue-500" /></div><p className="text-sm text-gray-500">Drivers</p></div>
              <div onClick={() => setCurrentView('users')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md"><div className="flex justify-between"><h3 className="text-2xl font-bold">{users.length + 45200}</h3><Users className="text-purple-500" /></div><p className="text-sm text-gray-500">Users</p></div>
              <div onClick={() => setCurrentView('disputes')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md"><div className="flex justify-between"><h3 className="text-2xl font-bold">23</h3><AlertCircle className="text-red-500" /></div><p className="text-sm text-gray-500">Disputes</p></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={dataRevenue}><XAxis dataKey="name" /><Tooltip /><Bar dataKey="revenue" fill="#10b981" /></BarChart></ResponsiveContainer></div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={dataVehicles} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>{dataVehicles.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
            </div>
          </>
        );
    }
  };

  return (
    <>
      <CollapsibleNavBar
        userName="Super Admin"
        navItems={navItems}
        onLogout={onLogout}
        hasNotifications={pendingWithdrawalsCount > 0}
      />

      <div className="relative min-h-[calc(100vh-4rem)] w-full flex flex-col md:flex-row overflow-hidden bg-gray-100 md:pt-16 md:pl-64">
        {/* Main Content Panel */}
        <div className="flex-1 relative overflow-hidden">
          <div className="p-6 md:p-8">
            <header className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 capitalize">
                  {currentView === 'map' ? 'Live Fleet Map' : currentView}
                </h2>
                <p className="text-gray-500">Platform Management System</p>
              </div>
              <div className="flex gap-4">
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
                  Export Report
                </button>
                <div className="flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 rounded-lg text-sm font-medium">
                  <Shield size={16} /> Super Admin
                </div>
              </div>
            </header>
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
};