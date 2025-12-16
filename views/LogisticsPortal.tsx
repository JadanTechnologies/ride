import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import * as L from 'leaflet';
import { MapPin, Navigation, Clock, CreditCard, Star, Menu, Phone, MessageSquare, X, CheckCircle, Wallet, Plus, Zap, Share2, Timer, Map as MapIcon, History, Settings, Box, Truck, DollarSign, Users, BarChart3, TrendingUp, Check, X as XIcon, UserCheck, Layers } from 'lucide-react';
import { Ride, VehicleType, UserRole } from '../types';
import { VEHICLE_ICONS, CURRENCY, LAGOS_COORDS } from '../constants';
import { Button } from '../components/Button';
import CollapsibleNavBar from '../components/CollapsibleNavBar';

const Leaflet = (L as any).default || L;

interface LogisticsPortalProps {
  user: any;
  pricing: any;
  surge: number;
  history: any[];
  onOrderComplete: (order: any) => void;
  onLogout: () => void;
  onNotify: (type: 'info' | 'success' | 'alert', message: string) => void;
}

type OrderStatus = 'pending_approval' | 'approved' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'rejected';

const createMapIcon = (type: 'user' | 'warehouse' | 'destination' | 'vehicle', vehicleType?: string) => {
  if (!Leaflet || !Leaflet.divIcon) return null;

  let color = '#10b981';
  let iconHtml = '';

  if (type === 'warehouse') {
    color = '#8b5cf6';
    iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M2 7v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7"/><path d="M12 11v6"/><path d="M2 7l10-5 10 5"/></svg>';
  } else if (type === 'destination') {
    color = '#dc2626';
    iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>';
  } else if (type === 'vehicle') {
    if (vehicleType === 'Bus') { color = '#3b82f6'; }
    else if (vehicleType === 'Okada') { color = '#ef4444'; }
    else { color = '#f59e0b'; }
    iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect x="2" y="7" width="20" height="10" rx="2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>';
  } else {
    color = '#111827';
    iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
  }

  return Leaflet.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 2px solid white;">${iconHtml}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20]
  });
};

export const LogisticsPortal: React.FC<LogisticsPortalProps> = ({ user, pricing, surge, history, onOrderComplete, onLogout, onNotify }) => {
  const [viewState, setViewState] = useState<'orders' | 'new_order' | 'tracking' | 'history' | 'analytics' | 'pending' | 'assign' | 'assigned' | 'in_progress'>('orders');
  const [userLocation] = useState(user?.location || LAGOS_COORDS);
  const [orders, setOrders] = useState([
    { id: 'ord-001', customer: 'Tech Startup Ltd', pickupAddress: 'Lekki Phase 1', dropoffAddress: 'VI', status: 'assigned', vehicle: 'Keke', items: 45, weight: '120kg', fare: 8500, driver: 'Ahmed Hassan', progress: 60 },
    { id: 'ord-002', customer: 'Fashion Hub', pickupAddress: 'Yaba', dropoffAddress: 'Ikeja', status: 'delivered', vehicle: 'Bus', items: 200, weight: '500kg', fare: 12000, driver: 'Zainab Okafor', progress: 100 },
    { id: 'ord-003', customer: 'E-commerce Store', pickupAddress: 'Surulere', dropoffAddress: 'Lagos Island', status: 'pending_approval', vehicle: 'Okada', items: 15, weight: '30kg', fare: 0, driver: null, progress: 0 }
  ]);
  const [newOrder, setNewOrder] = useState({
    customer: '',
    pickupAddress: '',
    dropoffAddress: '',
    vehicleType: 'Keke' as VehicleType,
    items: '',
    weight: '',
    description: ''
  });
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderProgress, setOrderProgress] = useState(0);
  const [mapView, setMapView] = useState<'street' | 'satellite'>('street');

  const getNavItems = () => {
    if (user?.role === UserRole.LOGISTICS) {
      return [
        { id: 'orders', label: 'My Requests', icon: <Box size={20} />, onClick: () => setViewState('orders') },
        { id: 'new_order', label: 'New Request', icon: <Plus size={20} />, onClick: () => setViewState('new_order') },
        { id: 'tracking', label: 'Track Delivery', icon: <MapIcon size={20} />, onClick: () => setViewState('tracking') },
        { id: 'history', label: 'History', icon: <History size={20} />, onClick: () => setViewState('history') },
      ];
    } else if (user?.role === UserRole.ADMIN) {
      return [
        { id: 'pending', label: 'Pending Approvals', icon: <Timer size={20} />, onClick: () => setViewState('pending') },
        { id: 'orders', label: 'All Orders', icon: <Box size={20} />, onClick: () => setViewState('orders') },
        { id: 'assign', label: 'Assign Drivers', icon: <UserCheck size={20} />, onClick: () => setViewState('assign') },
        { id: 'tracking', label: 'Track Orders', icon: <MapIcon size={20} />, onClick: () => setViewState('tracking') },
        { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} />, onClick: () => setViewState('analytics') },
      ];
    } else if (user?.role === UserRole.DRIVER) {
      return [
        { id: 'assigned', label: 'My Deliveries', icon: <Box size={20} />, onClick: () => setViewState('assigned') },
        { id: 'in_progress', label: 'In Progress', icon: <Navigation size={20} />, onClick: () => setViewState('in_progress') },
        { id: 'history', label: 'Completed', icon: <History size={20} />, onClick: () => setViewState('history') },
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrder.customer || !newOrder.pickupAddress || !newOrder.dropoffAddress) {
      onNotify('alert', 'Please fill all required fields');
      return;
    }

    const order = {
      id: `ord-${Date.now()}`,
      ...newOrder,
      status: 'pending_approval',
      fare: 0, // Will be set after approval
      driver: null,
      items: parseInt(newOrder.items) || 1,
      weight: newOrder.weight || '0kg',
      progress: 0
    };

    setOrders(prev => [order, ...prev]);
    setNewOrder({ customer: '', pickupAddress: '', dropoffAddress: '', vehicleType: 'Keke', items: '', weight: '', description: '' });
    onNotify('success', 'Order created successfully!');
    setViewState('orders');
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.includes(searchQuery) || o.customer.toLowerCase().includes(searchQuery.toLowerCase()) || o.pickupAddress.toLowerCase().includes(searchQuery.toLowerCase()) || o.dropoffAddress.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = statusFilter === 'all' || o.status === statusFilter;
    
    if (user?.role === UserRole.LOGISTICS) {
      return o.customer === user.name && matchesSearch && matchesFilter;
    }
    if (user?.role === UserRole.DRIVER) {
      return o.driver === user.name && matchesSearch && matchesFilter;
    }
    return matchesSearch && matchesFilter; // Admin sees all
  });

  const handleCompleteOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'delivered', progress: 100 } : o));
    const order = orders.find(o => o.id === orderId);
    if (order) {
      onOrderComplete(order);
      onNotify('success', 'Order delivered!');
    }
  };

  const handleApproveOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'approved', fare: Math.round(2000 + Math.random() * 10000) } : o));
    onNotify('success', 'Order approved!');
  };

  const handleRejectOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'rejected' } : o));
    onNotify('alert', 'Order rejected!');
  };

  const handleAssignDriver = (orderId: string, driverName: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'assigned', driver: driverName } : o));
    onNotify('success', 'Driver assigned!');
  };

  const handleUpdateProgress = (orderId: string, status: OrderStatus, progress: number) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, progress } : o));
  };

  return (
    <>
      <CollapsibleNavBar
        userName={user?.name || 'Logistics'}
        navItems={navItems}
        onLogout={onLogout}
        hasNotifications={false}
      />

      <div className="relative min-h-[calc(100vh-4rem)] w-full flex flex-col md:flex-row overflow-hidden bg-gray-100 pt-16 md:pl-64">
        {/* Map Section */}
        <div className="flex-1 relative h-full z-0 hidden md:block">
          {userLocation && !isNaN(userLocation.lat) ? (
            <>
              <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false}>
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
                {userLocation && createMapIcon('warehouse') && (
                  <Marker position={[userLocation.lat, userLocation.lng]} icon={createMapIcon('warehouse')} >
                    <Popup>Warehouse</Popup>
                  </Marker>
                )}
              </MapContainer>

              {/* Map View Toggle */}
              <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-lg border border-gray-200">
                <button
                  onClick={() => setMapView(mapView === 'street' ? 'satellite' : 'street')}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  title={`Switch to ${mapView === 'street' ? 'Satellite' : 'Street'} View`}
                >
                  <Layers size={16} />
                  {mapView === 'street' ? 'Satellite' : 'Street'}
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">Loading Map...</div>
          )}
        </div>

        {/* Main Content Panel */}
        <div className="absolute bottom-0 md:top-4 md:right-4 md:bottom-auto w-full md:w-[500px] z-30 transition-all duration-300">
          {viewState === 'pending' && user?.role === UserRole.ADMIN && (
            <div className="bg-white md:rounded-2xl shadow-2xl p-6 max-h-[85vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Pending Approvals</h3>
              <div className="space-y-3">
                {orders.filter(o => o.status === 'pending_approval').map(order => (
                  <div key={order.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-gray-900">{order.customer}</h4>
                        <p className="text-xs text-gray-500">{order.id}</p>
                      </div>
                      <span className="px-2 py-1 rounded text-xs font-bold bg-yellow-100 text-yellow-700">PENDING</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{order.pickupAddress} → {order.dropoffAddress}</p>
                    <p className="text-sm text-gray-500">{order.items} items • {order.weight}</p>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => handleApproveOrder(order.id)} className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-green-700 flex items-center justify-center gap-1">
                        <Check size={16} /> Approve
                      </button>
                      <button onClick={() => handleRejectOrder(order.id)} className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-red-700 flex items-center justify-center gap-1">
                        <XIcon size={16} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
                {orders.filter(o => o.status === 'pending_approval').length === 0 && (
                  <p className="text-center text-gray-500 py-8">No pending approvals</p>
                )}
              </div>
            </div>
          )}

          {viewState === 'assign' && user?.role === UserRole.ADMIN && (
            <div className="bg-white md:rounded-2xl shadow-2xl p-6 max-h-[85vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Assign Drivers</h3>
              <div className="space-y-3">
                {orders.filter(o => o.status === 'approved').map(order => (
                  <div key={order.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-gray-900">{order.customer}</h4>
                        <p className="text-xs text-gray-500">{order.id}</p>
                      </div>
                      <span className="px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-700">APPROVED</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{order.pickupAddress} → {order.dropoffAddress}</p>
                    <p className="text-sm text-gray-500">{order.items} items • {order.weight} • {CURRENCY}{order.fare}</p>
                    <div className="mt-3">
                      <select className="w-full px-3 py-2 border border-gray-200 rounded-lg" onChange={(e) => handleAssignDriver(order.id, e.target.value)}>
                        <option>Select Driver</option>
                        <option value="Ahmed Hassan">Ahmed Hassan (Keke)</option>
                        <option value="Zainab Okafor">Zainab Okafor (Bus)</option>
                        <option value="Emeka Nwosu">Emeka Nwosu (Okada)</option>
                      </select>
                    </div>
                  </div>
                ))}
                {orders.filter(o => o.status === 'approved').length === 0 && (
                  <p className="text-center text-gray-500 py-8">No orders ready for assignment</p>
                )}
              </div>
            </div>
          )}

          {viewState === 'assigned' && user?.role === UserRole.DRIVER && (
            <div className="bg-white md:rounded-2xl shadow-2xl p-6 max-h-[85vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">My Assigned Deliveries</h3>
              <div className="space-y-3">
                {orders.filter(o => o.status === 'assigned' && o.driver === user.name).map(order => (
                  <div key={order.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => { setSelectedOrder(order); setViewState('in_progress'); }}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-gray-900">{order.customer}</h4>
                        <p className="text-xs text-gray-500">{order.id}</p>
                      </div>
                      <span className="px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-700">ASSIGNED</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{order.pickupAddress} → {order.dropoffAddress}</p>
                    <p className="text-sm text-gray-500">{order.items} items • {order.weight} • {CURRENCY}{order.fare}</p>
                  </div>
                ))}
                {orders.filter(o => o.status === 'assigned' && o.driver === user.name).length === 0 && (
                  <p className="text-center text-gray-500 py-8">No assigned deliveries</p>
                )}
              </div>
            </div>
          )}

          {viewState === 'in_progress' && user?.role === UserRole.DRIVER && selectedOrder && (
            <div className="bg-white md:rounded-2xl shadow-2xl p-6 max-h-[85vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Delivery Progress</h3>
                <button onClick={() => setViewState('assigned')} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-4">
                <h4 className="font-bold text-gray-900 mb-2">{selectedOrder.customer}</h4>
                <div className="space-y-1 text-sm text-gray-700">
                  <p>📍 From: {selectedOrder.pickupAddress}</p>
                  <p>📍 To: {selectedOrder.dropoffAddress}</p>
                  <p>🚗 Vehicle: {selectedOrder.vehicle}</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-600 font-medium mb-2">
                  <span>Progress</span>
                  <span>{selectedOrder.progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${selectedOrder.progress}%` }}></div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <button onClick={() => handleUpdateProgress(selectedOrder.id, 'picked_up', 25)} className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                  <p className="font-medium text-sm">Picked up goods</p>
                  <p className="text-xs text-gray-500">Mark as picked up from customer</p>
                </button>
                <button onClick={() => handleUpdateProgress(selectedOrder.id, 'in_transit', 75)} className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                  <p className="font-medium text-sm">In transit</p>
                  <p className="text-xs text-gray-500">Started delivery to destination</p>
                </button>
                <button onClick={() => handleCompleteOrder(selectedOrder.id)} className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-left">
                  <p className="font-medium text-sm">Delivered</p>
                  <p className="text-xs opacity-90">Mark as successfully delivered</p>
                </button>
              </div>
            </div>
          )}

          {viewState === 'orders' && (
            <div className="bg-white md:rounded-2xl shadow-2xl p-6 max-h-[85vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {user?.role === UserRole.LOGISTICS ? 'My Requests' : user?.role === UserRole.ADMIN ? 'All Orders' : 'Orders'}
              </h3>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div className="flex gap-2 mb-4">
                <Button onClick={() => setStatusFilter('all')} variant={statusFilter === 'all' ? 'primary' : 'secondary'}>All</Button>
                <Button onClick={() => setStatusFilter('pending_approval')} variant={statusFilter === 'pending_approval' ? 'primary' : 'secondary'}>Pending</Button>
                <Button onClick={() => setStatusFilter('assigned')} variant={statusFilter === 'assigned' ? 'primary' : 'secondary'}>Assigned</Button>
                <Button onClick={() => setStatusFilter('in_transit')} variant={statusFilter === 'in_transit' ? 'primary' : 'secondary'}>In Transit</Button>
                <Button onClick={() => setStatusFilter('delivered')} variant={statusFilter === 'delivered' ? 'primary' : 'secondary'}>Delivered</Button>
              </div>
              <div className="space-y-3">
                {filteredOrders.map(order => (
                  <div key={order.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => { setSelectedOrder(order); setViewState('tracking'); }}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-gray-900">{order.customer}</h4>
                        <p className="text-xs text-gray-500">{order.id}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        order.status === 'pending_approval' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'approved' ? 'bg-green-100 text-green-700' :
                        order.status === 'assigned' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'picked_up' ? 'bg-purple-100 text-purple-700' :
                        order.status === 'in_transit' ? 'bg-indigo-100 text-indigo-700' :
                        order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <MapPin size={14} /> {order.pickupAddress} → {order.dropoffAddress}
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">{order.items} items • {order.weight}</span>
                      <span className="font-bold text-gray-900">{order.fare > 0 ? CURRENCY + order.fare : 'Pending'}</span>
                    </div>
                    {order.driver && <p className="text-xs text-gray-500 mt-1">Driver: {order.driver}</p>}
                  </div>
                ))}
                {filteredOrders.length === 0 && (
                  <p className="text-center py-8 text-gray-500">No orders found.</p>
                )}
              </div>
            </div>
          )}

          {viewState === 'new_order' && user?.role === UserRole.LOGISTICS && (
            <div className="bg-white md:rounded-2xl shadow-2xl p-6 max-h-[85vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Order</h3>
              <form onSubmit={handleCreateOrder} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                  <input type="text" required value={newOrder.customer} onChange={(e) => setNewOrder({...newOrder, customer: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Company or Person Name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Address *</label>
                  <input type="text" required value={newOrder.pickupAddress} onChange={(e) => setNewOrder({...newOrder, pickupAddress: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Where to pick up" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dropoff Address *</label>
                  <input type="text" required value={newOrder.dropoffAddress} onChange={(e) => setNewOrder({...newOrder, dropoffAddress: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Where to deliver" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type *</label>
                  <select value={newOrder.vehicleType} onChange={(e) => setNewOrder({...newOrder, vehicleType: e.target.value as VehicleType})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="Keke">Keke (Small)</option>
                    <option value="Okada">Okada (Medium)</option>
                    <option value="Bus">Bus (Large)</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Items Count</label>
                    <input type="number" value={newOrder.items} onChange={(e) => setNewOrder({...newOrder, items: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                    <input type="text" value={newOrder.weight} onChange={(e) => setNewOrder({...newOrder, weight: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g., 50kg" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea value={newOrder.description} onChange={(e) => setNewOrder({...newOrder, description: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="What's in this delivery?" rows={3}></textarea>
                </div>
                <Button type="submit" className="w-full">Create Order</Button>
              </form>
            </div>
          )}

          {viewState === 'tracking' && selectedOrder && (
            <div className="bg-white md:rounded-2xl shadow-2xl p-6 max-h-[85vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Order Tracking</h3>
                <button onClick={() => setViewState('orders')} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-4">
                <h4 className="font-bold text-gray-900 mb-2">{selectedOrder.customer}</h4>
                <div className="space-y-1 text-sm text-gray-700">
                  <p>📍 From: {selectedOrder.pickupAddress}</p>
                  <p>📍 To: {selectedOrder.dropoffAddress}</p>
                  <p>🚗 Vehicle: {selectedOrder.vehicleType}</p>
                  <p>👤 Driver: {selectedOrder.driver}</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-600 font-medium mb-2">
                  <span>Status</span>
                  <span>{selectedOrder.status.replace('_', ' ').toUpperCase()}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-1000"
                    style={{
                      width: `${selectedOrder.progress || 0}%`
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                  <span>Requested</span>
                  <span>Approved</span>
                  <span>Delivered</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                  <Box size={20} className="text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{selectedOrder.items} Items</p>
                    <p className="text-xs text-gray-500">{selectedOrder.weight}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                  <DollarSign size={20} className="text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Order Total</p>
                    <p className="text-xs text-gray-500">{CURRENCY}{selectedOrder.fare}</p>
                  </div>
                </div>
              </div>

              {selectedOrder.status === 'in_transit' && (
                <Button onClick={() => handleCompleteOrder(selectedOrder.id)} className="w-full">
                  Mark as Delivered
                </Button>
              )}
            </div>
          )}

          {viewState === 'history' && (
            <div className="bg-white md:rounded-2xl shadow-2xl p-6 max-h-[85vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {user?.role === UserRole.DRIVER ? 'Completed Deliveries' : 'Order History'}
              </h3>
              <div className="space-y-3">
                {orders.filter(o => {
                  if (user?.role === UserRole.LOGISTICS) return o.customer === user.name && (o.status === 'delivered' || o.status === 'rejected');
                  if (user?.role === UserRole.DRIVER) return o.driver === user.name && o.status === 'delivered';
                  return o.status === 'delivered' || o.status === 'rejected'; // Admin sees all completed/rejected
                }).map(order => (
                  <div key={order.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-gray-900">{order.customer}</h4>
                        <p className="text-xs text-gray-500">{order.id}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {order.status === 'delivered' ? 'DELIVERED' : 'REJECTED'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{order.pickupAddress} → {order.dropoffAddress}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{order.items} items • {order.weight}</span>
                      <span className="font-bold text-gray-900">{order.fare > 0 ? CURRENCY + order.fare : 'N/A'}</span>
                    </div>
                    {order.driver && <p className="text-xs text-gray-500 mt-1">Driver: {order.driver}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {viewState === 'analytics' && user?.role === UserRole.ADMIN && (
            <div className="bg-white md:rounded-2xl shadow-2xl p-6 max-h-[85vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Logistics Analytics</h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-4 rounded-xl">
                  <p className="text-sm text-blue-100 mb-1">Total Requests</p>
                  <p className="text-3xl font-bold">{orders.length}</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 text-white p-4 rounded-xl">
                  <p className="text-sm text-yellow-100 mb-1">Pending Approval</p>
                  <p className="text-3xl font-bold">{orders.filter(o => o.status === 'pending_approval').length}</p>
                </div>
                <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-4 rounded-xl">
                  <p className="text-sm text-green-100 mb-1">Delivered</p>
                  <p className="text-3xl font-bold">{orders.filter(o => o.status === 'delivered').length}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white p-4 rounded-xl">
                  <p className="text-sm text-purple-100 mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold">{CURRENCY}{orders.reduce((sum, o) => sum + o.fare, 0)}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-600 to-orange-700 text-white p-4 rounded-xl">
                  <p className="text-sm text-orange-100 mb-1">Active Deliveries</p>
                  <p className="text-3xl font-bold">{orders.filter(o => ['assigned', 'picked_up', 'in_transit'].includes(o.status)).length}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LogisticsPortal;
