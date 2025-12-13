import React, { useState } from 'react';
import { Search, Globe, Smartphone, Monitor, Wifi } from 'lucide-react';

interface DeviceInfo {
  id: string;
  name: string;
  type: 'user' | 'driver';
  ip: string;
  device: string;
  os: string;
  browser: string;
  lastActive: string;
}

const mockDevices: DeviceInfo[] = [
  { id: '1', name: 'Chioma Adebayo', type: 'user', ip: '192.168.1.105', device: 'iPhone 14', os: 'iOS 17', browser: 'Safari', lastActive: '2 min ago' },
  { id: '2', name: 'Ibrahim Musa', type: 'driver', ip: '192.168.1.201', device: 'Samsung Galaxy A52', os: 'Android 12', browser: 'Chrome', lastActive: '5 sec ago' },
  { id: '3', name: 'Samuel Okon', type: 'user', ip: '192.168.1.85', device: 'Google Pixel 6', os: 'Android 13', browser: 'Chrome', lastActive: '1 hour ago' },
  { id: '4', name: 'Emmanuel Bassey', type: 'driver', ip: '192.168.1.175', device: 'OnePlus 11', os: 'Android 13', browser: 'Chrome', lastActive: '30 sec ago' },
  { id: '5', name: 'Sarah Smith', type: 'user', ip: '192.168.1.92', device: 'MacBook Air', os: 'macOS 13', browser: 'Safari', lastActive: '3 hours ago' },
];

export const DeviceTracking: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'user' | 'driver'>('all');

  const filteredDevices = mockDevices.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || d.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Device & Connection Tracking</h3>
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {(['all', 'user', 'driver'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  filterType === type
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type === 'all' ? 'All Users' : type === 'user' ? 'Passengers' : 'Drivers'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Device List */}
      <div className="space-y-4">
        {filteredDevices.map(device => (
          <div key={device.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-bold text-gray-900">{device.name}</h4>
                <p className="text-sm text-gray-500 capitalize">{device.type === 'user' ? 'Passenger' : 'Driver'}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                device.type === 'user'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {device.type === 'user' ? 'Passenger' : 'Driver'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* IP Address */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Globe size={18} className="text-brand-600" />
                  <span className="text-sm font-semibold text-gray-700">IP Address</span>
                </div>
                <p className="text-lg font-mono text-gray-900">{device.ip}</p>
              </div>

              {/* Device */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone size={18} className="text-brand-600" />
                  <span className="text-sm font-semibold text-gray-700">Device</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{device.device}</p>
              </div>

              {/* Operating System */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Monitor size={18} className="text-brand-600" />
                  <span className="text-sm font-semibold text-gray-700">OS</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{device.os}</p>
              </div>

              {/* Browser */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Wifi size={18} className="text-brand-600" />
                  <span className="text-sm font-semibold text-gray-700">Browser</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{device.browser}</p>
              </div>

              {/* Last Active */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-gray-700">Last Active</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{device.lastActive}</p>
              </div>

              {/* Actions */}
              <div className="bg-gray-50 p-4 rounded-lg flex items-end">
                <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded font-medium text-sm transition-colors">
                  Revoke Session
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceTracking;
