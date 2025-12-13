import React, { useState } from 'react';
import { Plus, Trash2, Save, AlertCircle } from 'lucide-react';

interface PaymentProvider {
  id: string;
  name: 'paystack' | 'flutterwave' | 'monnify' | 'manual';
  isActive: boolean;
  apiKey?: string;
  secretKey?: string;
}

const PaymentSettings: React.FC = () => {
  const [providers, setProviders] = useState<PaymentProvider[]>([
    { id: '1', name: 'paystack', isActive: true, apiKey: '', secretKey: '' },
    { id: '2', name: 'flutterwave', isActive: false, apiKey: '', secretKey: '' },
    { id: '3', name: 'monnify', isActive: false, apiKey: '', secretKey: '' },
    { id: '4', name: 'manual', isActive: false },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setProviders(prev =>
      prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : { ...p, isActive: false })
    );
  };

  const handleUpdateField = (id: string, field: string, value: string) => {
    setProviders(prev =>
      prev.map(p => p.id === id ? { ...p, [field]: value } : p)
    );
  };

  const handleSave = () => {
    console.log('Saving payment providers:', providers);
    alert('Payment settings saved successfully!');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-2xl font-bold mb-6">Payment Gateway Settings</h3>

      <div className="space-y-6">
        {/* Paystack */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={providers[0]?.isActive}
                onChange={() => handleToggle(providers[0]?.id)}
                className="w-4 h-4 cursor-pointer"
              />
              <div>
                <h4 className="font-semibold">Paystack</h4>
                <p className="text-sm text-gray-500">Popular payment gateway in Africa</p>
              </div>
            </div>
            {providers[0]?.isActive && <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">Active</span>}
          </div>
          {providers[0]?.isActive && (
            <div className="space-y-3 bg-gray-50 p-4 rounded">
              <div>
                <label className="block text-sm font-medium mb-1">Public Key</label>
                <input 
                  type="password"
                  placeholder="pk_live_..."
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={providers[0]?.apiKey || ''}
                  onChange={(e) => handleUpdateField(providers[0]?.id, 'apiKey', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Secret Key</label>
                <input 
                  type="password"
                  placeholder="sk_live_..."
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={providers[0]?.secretKey || ''}
                  onChange={(e) => handleUpdateField(providers[0]?.id, 'secretKey', e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Flutterwave */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={providers[1]?.isActive}
                onChange={() => handleToggle(providers[1]?.id)}
                className="w-4 h-4 cursor-pointer"
              />
              <div>
                <h4 className="font-semibold">Flutterwave</h4>
                <p className="text-sm text-gray-500">Pan-African payments platform</p>
              </div>
            </div>
            {providers[1]?.isActive && <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">Active</span>}
          </div>
          {providers[1]?.isActive && (
            <div className="space-y-3 bg-gray-50 p-4 rounded">
              <div>
                <label className="block text-sm font-medium mb-1">Public Key</label>
                <input 
                  type="password"
                  placeholder="FLWPUBK_TEST-..."
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Secret Key</label>
                <input 
                  type="password"
                  placeholder="FLWSECK_TEST-..."
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Monnify */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={providers[2]?.isActive}
                onChange={() => handleToggle(providers[2]?.id)}
                className="w-4 h-4 cursor-pointer"
              />
              <div>
                <h4 className="font-semibold">Monnify</h4>
                <p className="text-sm text-gray-500">Fast and secure payments</p>
              </div>
            </div>
            {providers[2]?.isActive && <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">Active</span>}
          </div>
          {providers[2]?.isActive && (
            <div className="space-y-3 bg-gray-50 p-4 rounded">
              <div>
                <label className="block text-sm font-medium mb-1">API Key</label>
                <input 
                  type="password"
                  placeholder="MK_..."
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contract Code</label>
                <input 
                  type="text"
                  placeholder="Your contract code"
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Manual Payment Gateway */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={providers[3]?.isActive}
                onChange={() => handleToggle(providers[3]?.id)}
                className="w-4 h-4 cursor-pointer"
              />
              <div>
                <h4 className="font-semibold">Manual Payment Gateway</h4>
                <p className="text-sm text-gray-500">Bank transfer & direct payment details</p>
              </div>
            </div>
            {providers[3]?.isActive && <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">Active</span>}
          </div>
          {providers[3]?.isActive && (
            <div className="space-y-3 bg-gray-50 p-4 rounded">
              <div>
                <label className="block text-sm font-medium mb-1">Account Name</label>
                <input 
                  type="text"
                  placeholder="Business Name"
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Account Number</label>
                  <input 
                    type="text"
                    placeholder="0123456789"
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bank Name</label>
                  <input 
                    type="text"
                    placeholder="GTBank, Access Bank, etc."
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Additional Instructions</label>
                <textarea 
                  placeholder="Any additional payment instructions..."
                  className="w-full border rounded px-3 py-2 text-sm"
                  rows={3}
                />
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex gap-2 pt-4 border-t">
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-brand-600 text-white px-6 py-2 rounded-lg hover:bg-brand-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSettings;
