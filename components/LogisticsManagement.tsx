import React, { useState } from 'react';
import { CURRENCY } from '../constants';
import { Button } from './Button';
import { Check, X } from 'lucide-react';

const initialOrders = [
  { id: 'LOG-001', customer: 'Tech Startup', from: 'Lekki', to: 'VI', vehicle: 'Keke', status: 'in_transit', fare: 8500, agent: 'Ibrahim Musa' },
  { id: 'LOG-002', customer: 'Fashion Hub', from: 'Yaba', to: 'Ikeja', vehicle: 'Bus', status: 'delivered', fare: 12000, agent: 'Chinedu Eze' },
  { id: 'LOG-003', customer: 'E-commerce Co', from: 'Surulere', to: 'Lekki', vehicle: 'Okada', status: 'assigned', fare: 6200, agent: 'Samuel Okon' },
  { id: 'LOG-004', customer: 'Pharma Inc.', from: 'Apapa', to: 'Ilupeju', vehicle: 'Bus', status: 'pending', fare: 15000, agent: null },
  { id: 'LOG-005', customer: 'Bookstore', from: 'VI', to: 'Unilag', vehicle: 'Okada', status: 'pending', fare: 7000, agent: null },
];

const availableAgents = [
    { id: 1, name: "Ibrahim Musa", vehicle: "Keke" },
    { id: 4, name: "Yusuf Ali", vehicle: "Keke" },
    { id: 5, name: "Emmanuel Bassey", vehicle: "Bus" },
];

export const LogisticsManagement = () => {
    const [orders, setOrders] = useState(initialOrders);
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
  
    const handleApprove = (id) => {
      setOrders(orders.map(o => o.id === id ? { ...o, status: 'approved' } : o));
    };
  
    const handleReject = (id) => {
      setOrders(orders.filter(o => o.id !== id));
    };

    const handleOpenAssignModal = (order) => {
        setSelectedOrder(order);
        setAssignModalOpen(true);
    }

    const handleAssignAgent = (orderId, agentName) => {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'assigned', agent: agentName } : o));
        setAssignModalOpen(false);
        setSelectedOrder(null);
    }

    const pendingOrders = orders.filter(o => o.status === 'pending');
    const activeOrders = orders.filter(o => o.status !== 'pending');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Logistics Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-4 rounded-xl">
            <p className="text-sm text-blue-100 mb-1">Active Orders</p>
            <p className="text-3xl font-bold">{activeOrders.length}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 text-white p-4 rounded-xl">
            <p className="text-sm text-yellow-100 mb-1">Pending Approval</p>
            <p className="text-3xl font-bold">{pendingOrders.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-4 rounded-xl">
            <p className="text-sm text-green-100 mb-1">Delivered Today</p>
            <p className="text-3xl font-bold">156</p>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white p-4 rounded-xl">
            <p className="text-sm text-purple-100 mb-1">Revenue</p>
            <p className="text-3xl font-bold">{CURRENCY}2.4M</p>
          </div>
        </div>
      </div>

      {/* Pending Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100"><h3 className="font-bold text-gray-800">Pending Approval</h3></div>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 font-semibold text-gray-700">Order ID</th>
              <th className="p-4 font-semibold text-gray-700">Customer</th>
              <th className="p-4 font-semibold text-gray-700">Route</th>
              <th className="p-4 font-semibold text-gray-700">Vehicle</th>
              <th className="p-4 font-semibold text-gray-700 text-right">Fare</th>
              <th className="p-4 font-semibold text-gray-700 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pendingOrders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">{order.id}</td>
                <td className="p-4 text-gray-600">{order.customer}</td>
                <td className="p-4 text-gray-600">{order.from} → {order.to}</td>
                <td className="p-4 capitalize text-gray-600">{order.vehicle}</td>
                <td className="p-4 text-right font-semibold text-gray-900">{CURRENCY}{order.fare}</td>
                <td className="p-4 text-center space-x-2">
                    <Button onClick={() => handleApprove(order.id)} variant="primary" className="py-1 px-2 text-xs"><Check size={16} /></Button>
                    <Button onClick={() => handleReject(order.id)} variant="danger" className="py-1 px-2 text-xs"><X size={16} /></Button>
                </td>
              </tr>
            ))}
             {pendingOrders.length === 0 && (
                <tr>
                    <td colSpan="6" className="text-center p-8 text-gray-500">No pending orders.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Active Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100"><h3 className="font-bold text-gray-800">Active & Assigned Logistics Orders</h3></div>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 font-semibold text-gray-700">Order ID</th>
              <th className="p-4 font-semibold text-gray-700">Customer</th>
              <th className="p-4 font-semibold text-gray-700">Route</th>
              <th className="p-4 font-semibold text-gray-700">Status</th>
              <th className="p-4 font-semibold text-gray-700">Agent</th>
              <th className="p-4 font-semibold text-gray-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {activeOrders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">{order.id}</td>
                <td className="p-4 text-gray-600">{order.customer}</td>
                <td className="p-4 text-gray-600">{order.from} → {order.to}</td>
                <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${
                    order.status === 'in_transit' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'assigned' ? 'bg-purple-100 text-purple-700' :
                    'bg-yellow-100 text-yellow-700'
                }`}>{order.status.replace('_', ' ').toUpperCase()}</span></td>
                <td className="p-4 text-gray-600">{order.agent || 'N/A'}</td>
                <td className="p-4 text-right">
                    {order.status === 'approved' && <Button onClick={() => handleOpenAssignModal(order)} className="py-1 px-2 text-xs">Assign</Button>}
                </td>
              </tr>
            ))}
            {activeOrders.length === 0 && (
                <tr>
                    <td colSpan="6" className="text-center p-8 text-gray-500">No active orders.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

        {assignModalOpen && selectedOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Assign Agent</h3>
                        <button onClick={() => setAssignModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
                    </div>
                    <div className="space-y-4">
                        <p>Select an agent for order <span className="font-bold">{selectedOrder.id}</span> ({selectedOrder.customer}).</p>
                        <div className="space-y-2">
                            {availableAgents.filter(a => a.vehicle === selectedOrder.vehicle).map(agent => (
                                <button key={agent.id} onClick={() => handleAssignAgent(selectedOrder.id, agent.name)} className="w-full text-left p-4 rounded-lg border hover:bg-gray-50">
                                    <p className="font-semibold">{agent.name}</p>
                                    <p className="text-sm text-gray-500">{agent.vehicle}</p>
                                </button>
                            ))}
                            {availableAgents.filter(a => a.vehicle === selectedOrder.vehicle).length === 0 && (
                                <p className="text-center text-gray-500 p-4">No available agents with a suitable vehicle ({selectedOrder.vehicle}).</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )}

    </div>
  );
};

export default LogisticsManagement;
