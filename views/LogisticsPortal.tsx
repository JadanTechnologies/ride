import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import * as L from 'leaflet';
import { MapPin, Navigation, Clock, CreditCard, Star, Menu, Phone, MessageSquare, X, CheckCircle, Wallet, Plus, Zap, Share2, Timer, Map as MapIcon, History, Settings, Box, Truck, DollarSign, Users, BarChart3, TrendingUp } from 'lucide-react';
import { Ride, VehicleType } from '../types';
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

type OrderStatus = 'searching' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered';

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
  const [viewState, setViewState] = useState<'orders' | 'new_order' | 'tracking' | 'history' | 'analytics'>('orders');
  const [userLocation] = useState(user?.location || LAGOS_COORDS);
  const [orders, setOrders] = useState([
    { id: 'ord-001', customer: 'Tech Startup Ltd', pickupAddress: 'Lekki Phase 1', dropoffAddress: 'VI', status: 'in_transit', vehicle: 'Keke', items: 45, weight: '120kg', fare: 8500, driver: 'Ahmed Hassan' },
    { id: 'ord-002', customer: 'Fashion Hub', pickupAddress: 'Yaba', dropoffAddress: 'Ikeja', status: 'delivered', vehicle: 'Bus', items: 200, weight: '500kg', fare: 12000, driver: 'Zainab Okafor' }
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

  const navItems = [
    { id: 'orders', label: 'Active Orders', icon: <Box size={20} />, onClick: () => setViewState('orders') },
    { id: 'new_order', label: 'New Order', icon: <Plus size={20} />, onClick: () => setViewState('new_order') },
    { id: 'tracking', label: 'Track Order', icon: <MapIcon size={20} />, onClick: () => setViewState('tracking') },
    { id: 'history', label: 'History', icon: <History size={20} />, onClick: () => setViewState('history') },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} />, onClick: () => setViewState('analytics') },
  ];

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrder.customer || !newOrder.pickupAddress || !newOrder.dropoffAddress) {
      onNotify('alert', 'Please fill all required fields');
      return;
    }

    const order = {
      id: `ord-${Date.now()}`,
      ...newOrder,
      status: 'searching',
      fare: Math.round(2000 + Math.random() * 10000),
      driver: 'Searching...',
      items: parseInt(newOrder.items) || 1,
      weight: newOrder.weight || '0kg'
    };

    setOrders(prev => [order, ...prev]);
    setNewOrder({ customer: '', pickupAddress: '', dropoffAddress: '', vehicleType: 'Keke', items: '', weight: '', description: '' });
    onNotify('success', 'Order created successfully!');
    setViewState('orders');
  };

  const handleCompleteOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'delivered' } : o));
    const order = orders.find(o => o.id === orderId);
    if (order) {
      onOrderComplete(order);
      onNotify('success', 'Order delivered!');
    }
  };

  return (
    <>
      <CollapsibleNavBar
        userName={user?.name || 'Logistics'}
        navItems={navItems}
        onLogout={onLogout}
        hasNotifications={false}
      />

      <div className="relative min-h-[calc(100vh-4rem)] w-full flex flex-col md:flex-row overflow-hidden bg-gray-100 md:pt-16">
        {/* Map Section */}
        <div className="flex-1 relative h-full z-0 hidden md:block">
          {userLocation && !isNaN(userLocation.lat) ? (
            <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {userLocation && createMapIcon('warehouse') && (
                <Marker position={[userLocation.lat, userLocation.lng]} icon={createMapIcon('warehouse')} >
                  <Popup>Warehouse</Popup>
                </Marker>
              )}
            </MapContainer>
          ) : (
            <div className="flex items-center justify-center h-full">Loading Map...</div>
          )}
        </div>

        {/* Main Content Panel */}
        <div className="absolute bottom-0 md:top-4 md:right-4 md:bottom-auto w-full md:w-[500px] z-30 transition-all duration-300">
          {viewState === 'orders' && (
            <div className="bg-white md:rounded-2xl shadow-2xl p-6 max-h-[85vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Active Orders</h3>
              <div className="space-y-3">
                {orders.filter(o => o.status !== 'delivered').map(order => (
                  <div key={order.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => { setSelectedOrder(order); setViewState('tracking'); }}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-gray-900">{order.customer}</h4>
                        <p className="text-xs text-gray-500">{order.id}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${order.status === 'in_transit' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <MapPin size={14} /> {order.pickupAddress} → {order.dropoffAddress}
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">{order.items} items • {order.weight}</span>
                      <span className="font-bold text-gray-900">{CURRENCY}{order.fare}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {viewState === 'new_order' && (
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
                      width: selectedOrder.status === 'in_transit' ? '75%' : selectedOrder.status === 'delivered' ? '100%' : '25%'
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                  <span>Created</span>
                  <span>Assigned</span>
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
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order History</h3>
              <div className="space-y-3">
                {orders.filter(o => o.status === 'delivered').map(order => (
                  <div key={order.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-gray-900">{order.customer}</h4>
                        <p className="text-xs text-gray-500">{order.id}</p>
                      </div>
                      <span className="px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-700">DELIVERED</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{order.pickupAddress} → {order.dropoffAddress}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{order.items} items</span>
                      <span className="font-bold text-gray-900">{CURRENCY}{order.fare}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {viewState === 'analytics' && (
            <div className="bg-white md:rounded-2xl shadow-2xl p-6 max-h-[85vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Logistics Analytics</h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-4 rounded-xl">
                  <p className="text-sm text-blue-100 mb-1">Total Orders</p>
                  <p className="text-3xl font-bold">{orders.length}</p>
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
                  <p className="text-sm text-orange-100 mb-1">Active Orders</p>
                  <p className="text-3xl font-bold">{orders.filter(o => o.status !== 'delivered').length}</p>
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
